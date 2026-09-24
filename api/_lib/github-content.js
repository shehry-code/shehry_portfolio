import { getGithubConfig, githubRequest } from "./github.js";
import { assertManagedRepositoryPath } from "./repository-paths.js";

const MAX_COMMIT_MESSAGE_LENGTH = 200;
const MAX_FILE_CONTENT_LENGTH = 500_000;

export class GithubContentError extends Error {
  constructor(code, status) {
    super(code);
    this.name = "GithubContentError";
    this.code = code;
    this.status = status;
  }
}

const parseJsonResponse = async (response) => {
  if (!response.ok) {
    throw new GithubContentError(response.status === 404 ? "not-found" : "github-error", response.status);
  }
  try {
    return await response.json();
  } catch {
    throw new GithubContentError("invalid-response", response.status);
  }
};

export const readManagedRepositoryFile = async (path, ref, config = getGithubConfig()) => {
  assertManagedRepositoryPath(path);
  if (typeof ref !== "string" || !/^[a-f0-9]{40}$/i.test(ref)) throw new Error("Repository revision is invalid.");
  const response = await githubRequest(`/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repository)}/contents/${path.split("/").map(encodeURIComponent).join("/")}?ref=${encodeURIComponent(ref)}`, {}, config);
  const payload = await parseJsonResponse(response);
  if (payload?.type !== "file" || typeof payload.content !== "string" || typeof payload.sha !== "string" || !/^[a-f0-9]{40}$/i.test(payload.sha)) {
    throw new GithubContentError("invalid-response", response.status);
  }
  return { content: Buffer.from(payload.content.replace(/\s/g, ""), "base64").toString("utf8"), sha: payload.sha };
};

export const getBranchHead = async (config = getGithubConfig()) => {
  const repositoryPath = `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repository)}`;
  const response = await githubRequest(`${repositoryPath}/git/ref/heads/${encodeURIComponent(config.baseBranch)}`, {}, config);
  const payload = await parseJsonResponse(response);
  const sha = payload?.object?.sha;
  if (payload?.object?.type !== "commit" || typeof sha !== "string" || !/^[a-f0-9]{40}$/i.test(sha)) {
    throw new GithubContentError("invalid-response", response.status);
  }
  return sha;
};

const getCommitTree = async (commitSha, config) => {
  const response = await githubRequest(`/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repository)}/git/commits/${encodeURIComponent(commitSha)}`, {}, config);
  const payload = await parseJsonResponse(response);
  const treeSha = payload?.tree?.sha;
  if (typeof treeSha !== "string" || !/^[a-f0-9]{40}$/i.test(treeSha)) throw new GithubContentError("invalid-response", response.status);
  return treeSha;
};

const createBlob = async (content, config) => {
  if (typeof content !== "string" || content.length > MAX_FILE_CONTENT_LENGTH) throw new Error("Managed file content is invalid.");
  const response = await githubRequest(`/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repository)}/git/blobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, encoding: "utf-8" }),
  }, config);
  const payload = await parseJsonResponse(response);
  if (typeof payload?.sha !== "string" || !/^[a-f0-9]{40}$/i.test(payload.sha)) throw new GithubContentError("invalid-response", response.status);
  return payload.sha;
};

const createTree = async (files, baseTreeSha, config) => {
  const tree = [];
  for (const file of files) {
    assertManagedRepositoryPath(file.path);
    tree.push({ path: file.path, mode: "100644", type: "blob", sha: await createBlob(file.content, config) });
  }
  const response = await githubRequest(`/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repository)}/git/trees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base_tree: baseTreeSha, tree }),
  }, config);
  const payload = await parseJsonResponse(response);
  if (typeof payload?.sha !== "string" || !/^[a-f0-9]{40}$/i.test(payload.sha)) throw new GithubContentError("invalid-response", response.status);
  return payload.sha;
};

const createCommit = async (treeSha, parentSha, message, config) => {
  const response = await githubRequest(`/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repository)}/git/commits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, tree: treeSha, parents: [parentSha] }),
  }, config);
  const payload = await parseJsonResponse(response);
  if (typeof payload?.sha !== "string" || !/^[a-f0-9]{40}$/i.test(payload.sha)) throw new GithubContentError("invalid-response", response.status);
  return payload.sha;
};

const updateBranch = async (commitSha, expectedHead, config) => {
  const currentHead = await getBranchHead(config);
  if (currentHead !== expectedHead) throw new GithubContentError("conflict", 409);
  // GitHub has no compare-and-swap ref update. The non-forced update rejects a non-fast-forward race.
  const response = await githubRequest(`/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repository)}/git/refs/heads/${encodeURIComponent(config.baseBranch)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sha: commitSha, force: false }),
  }, config);
  try {
    await parseJsonResponse(response);
  } catch (error) {
    if (error instanceof GithubContentError && error.status === 422) {
      throw new GithubContentError("conflict", 422);
    }
    throw error;
  }
};

export const createAtomicCommit = async ({ config = getGithubConfig(), parentSha, message, files }) => {
  if (typeof parentSha !== "string" || !/^[a-f0-9]{40}$/i.test(parentSha)) throw new Error("Repository revision is invalid.");
  if (typeof message !== "string" || !message.trim() || message.length > MAX_COMMIT_MESSAGE_LENGTH) throw new Error("Commit message is invalid.");
  const baseTreeSha = await getCommitTree(parentSha, config);
  const treeSha = await createTree(files, baseTreeSha, config);
  const commitSha = await createCommit(treeSha, parentSha, message.trim(), config);
  await updateBranch(commitSha, parentSha, config);
  return commitSha;
};

export const writeManagedRepositoryFile = async ({ path, content, message, sha, branch }, config = getGithubConfig()) => {
  assertManagedRepositoryPath(path);
  if (typeof content !== "string" || content.length > MAX_FILE_CONTENT_LENGTH) throw new Error("Managed file content is invalid.");
  if (typeof message !== "string" || !message.trim() || message.length > MAX_COMMIT_MESSAGE_LENGTH) throw new Error("Commit message is invalid.");
  if (branch !== undefined && branch !== config.baseBranch) throw new Error("Repository branch is not managed.");
  if (sha !== undefined && (typeof sha !== "string" || !/^[a-f0-9]{40}$/i.test(sha))) throw new Error("File revision is invalid.");

  const repositoryPath = `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repository)}/contents/${path.split("/").map(encodeURIComponent).join("/")}`;
  return githubRequest(repositoryPath, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: message.trim(),
      content: Buffer.from(content).toString("base64"),
      ...(sha ? { sha } : {}),
      branch: config.baseBranch,
    }),
  }, config);
};