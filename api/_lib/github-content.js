import { getGithubConfig, githubRequest } from "./github.js";
import { assertManagedRepositoryPath } from "./repository-paths.js";

const MAX_COMMIT_MESSAGE_LENGTH = 200;
const MAX_FILE_CONTENT_LENGTH = 500_000;

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