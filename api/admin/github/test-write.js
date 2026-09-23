import { requireAdmin, requireCsrf, setNoStore } from "../../_lib/auth.js";
import { getGithubConfig, githubRequest } from "../../_lib/github.js";
import { writeManagedRepositoryFile } from "../../_lib/github-content.js";
import { ADMIN_WRITE_TEST_PATH } from "../../_lib/repository-paths.js";

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

const logDiagnosticError = (stage, error) => {
  console.error("GitHub write diagnostic", {
    stage,
    error: {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Unknown error",
    },
  });
};

const githubContentsPath = (config) => {
  const encodedPath = ADMIN_WRITE_TEST_PATH.split("/").map(encodeURIComponent).join("/");
  return `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repository)}/contents/${encodedPath}`;
};

const getExistingSha = async (config) => {
  const response = await githubRequest(`${githubContentsPath(config)}?ref=${encodeURIComponent(config.baseBranch)}`, {}, config);
  if (response.status === 404) return undefined;
  if (!response.ok) {
    logDiagnosticError("test-file-lookup", new Error("GitHub test file lookup failed."));
    throw new Error("GitHub test file lookup failed.");
  }

  const payload = await response.json();
  if (!payload || typeof payload.sha !== "string" || !/^[a-f0-9]{40}$/i.test(payload.sha)) {
    logDiagnosticError("test-file-lookup-response", new Error("GitHub test file response was invalid."));
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

    let diagnosticStage = "configuration";
    try {
      const config = getGithubConfig();
      console.error("GitHub write diagnostic", {
        stage: "configuration",
        repository: `${config.owner}/${config.repository}`,
        branch: config.baseBranch,
      });
      diagnosticStage = "test-file-lookup";
      const sha = await getExistingSha(config);
      const content = [
        "Repository write test",
        `UTC timestamp: ${new Date().toISOString()}`,
        "",
      ].join("\n");
      diagnosticStage = "repository-write";
      const writeResponse = await writeManagedRepositoryFile({
        path: ADMIN_WRITE_TEST_PATH,
        content,
        message: "test: verify controlled repository write",
        ...(sha ? { sha } : {}),
      }, config);

      if (!writeResponse.ok) {
        logDiagnosticError("repository-write", new Error("GitHub repository write failed."));
        throw new Error("GitHub repository write failed.");
      }
      diagnosticStage = "write-response-validation";
      const payload = await writeResponse.json();
      const commitSha = payload?.commit?.sha;
      if (typeof commitSha !== "string" || !/^[a-f0-9]{40}$/i.test(commitSha)) {
        logDiagnosticError("write-response-validation", new Error("GitHub repository write response was invalid."));
        throw new Error("GitHub repository write response was invalid.");
      }

      sendJson(res, 200, {
        ok: true,
        repository: `${config.owner}/${config.repository}`,
        branch: config.baseBranch,
        path: ADMIN_WRITE_TEST_PATH,
        commitSha,
      });
    } catch (error) {
      if (!(error instanceof Error) || !["GitHub test file lookup failed.", "GitHub test file response was invalid.", "GitHub repository write failed.", "GitHub repository write response was invalid."].includes(error.message)) {
        logDiagnosticError(diagnosticStage, error);
      }
      sendJson(res, 502, { ok: false, error: "Repository write test failed." });
    }
  });
}