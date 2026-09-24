import { requireAdmin, requireCsrf, setNoStore } from "../../_lib/auth.js";
import { getGithubConfig, githubRequest } from "../../_lib/github.js";
import { writeManagedRepositoryFile } from "../../_lib/github-content.js";
import { ADMIN_WRITE_TEST_PATH } from "../../_lib/repository-paths.js";

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

const githubContentsPath = (config) => {
  const encodedPath = ADMIN_WRITE_TEST_PATH.split("/").map(encodeURIComponent).join("/");
  return `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repository)}/contents/${encodedPath}`;
};

const getExistingSha = async (config) => {
  const response = await githubRequest(`${githubContentsPath(config)}?ref=${encodeURIComponent(config.baseBranch)}`, {}, config);
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error("GitHub test file lookup failed.");

  const payload = await response.json();
  if (!payload || typeof payload.sha !== "string" || !/^[a-f0-9]{40}$/i.test(payload.sha)) {
    throw new Error("GitHub test file response was invalid.");
  }
  return payload.sha;
};

export default function handler(req, res) {
  setNoStore(res);

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end();
    return;
  }

  return requireAdmin(req, res, async (user) => {
    if (!requireCsrf(req, res, user)) return;

    try {
      const config = getGithubConfig();
      const sha = await getExistingSha(config);
      const content = [
        "Repository write test",
        `UTC timestamp: ${new Date().toISOString()}`,
        "",
      ].join("\n");
      const writeResponse = await writeManagedRepositoryFile({
        path: ADMIN_WRITE_TEST_PATH,
        content,
        message: "test: verify controlled repository write",
        ...(sha ? { sha } : {}),
      }, config);

      if (!writeResponse.ok) throw new Error("GitHub repository write failed.");
      const payload = await writeResponse.json();
      const commitSha = payload?.commit?.sha;
      if (typeof commitSha !== "string" || !/^[a-f0-9]{40}$/i.test(commitSha)) {
        throw new Error("GitHub repository write response was invalid.");
      }

      sendJson(res, 200, {
        ok: true,
        repository: `${config.owner}/${config.repository}`,
        branch: config.baseBranch,
        path: ADMIN_WRITE_TEST_PATH,
        commitSha,
      });
    } catch {
      sendJson(res, 502, { ok: false, error: "Repository write test failed." });
    }
  });
}