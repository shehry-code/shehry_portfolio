import { requireAdmin, setNoStore } from "../../_lib/auth.js";
import { getGithubConfig, githubRequest } from "../../_lib/github.js";

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

export default function handler(req, res) {
  setNoStore(res);

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end();
    return;
  }

  return requireAdmin(req, res, async () => {
    try {
      const config = getGithubConfig();
      const repositoryPath = `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repository)}`;
      const repositoryResponse = await githubRequest(repositoryPath, {}, config);
      if (!repositoryResponse.ok) {
        sendJson(res, 502, { connected: false, owner: config.owner, repository: config.repository, branch: config.baseBranch, installation: false });
        return;
      }

      const branchPath = `${repositoryPath}/branches/${encodeURIComponent(config.baseBranch)}`;
      const branchResponse = await githubRequest(branchPath, {}, config);
      if (!branchResponse.ok) {
        sendJson(res, 502, { connected: false, owner: config.owner, repository: config.repository, branch: config.baseBranch, installation: false });
        return;
      }

      sendJson(res, 200, {
        connected: true,
        owner: config.owner,
        repository: config.repository,
        branch: config.baseBranch,
        installation: true,
      });
    } catch {
      sendJson(res, 502, { connected: false, installation: false });
    }
  });
}
