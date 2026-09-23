import { createPrivateKey, createSign } from "node:crypto";
import { fetchWithTimeout } from "./auth.js";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_API_VERSION = "2022-11-28";
const TOKEN_SAFETY_WINDOW_MS = 60_000;
const DEFAULT_TIMEOUT_MS = 10_000;

let installationTokenCache = null;

const requiredGithubEnv = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required GitHub App configuration: ${name}`);
  return value;
};

const validateNumericId = (value, name) => {
  if (!/^\d+$/.test(value) || /^0+$/.test(value)) throw new Error(`Invalid GitHub App configuration: ${name}`);
  return value;
};

const normalizePrivateKey = (value) => {
  const privateKey = value.replace(/\\n/g, "\n").trim();
  if (!privateKey.includes("BEGIN") || !privateKey.includes("PRIVATE KEY") || !privateKey.includes("END")) {
    throw new Error("Invalid GitHub App private key configuration.");
  }

  try {
    createPrivateKey(privateKey);
  } catch {
    throw new Error("Invalid GitHub App private key configuration.");
  }

  return privateKey;
};

const validateRepositoryName = (value, name) => {
  if (!/^[A-Za-z0-9_.-]+$/.test(value)) throw new Error(`Invalid GitHub App configuration: ${name}`);
  return value;
};

const validateBranchName = (value) => {
  if (!value || value.length > 255 || /[\u0000-\u001f\u007f]/.test(value)) {
    throw new Error("Invalid GitHub App configuration: GITHUB_BASE_BRANCH");
  }
  return value;
};

export const getGithubConfig = () => ({
  appId: validateNumericId(requiredGithubEnv("GITHUB_APP_ID"), "GITHUB_APP_ID"),
  privateKey: normalizePrivateKey(requiredGithubEnv("GITHUB_APP_PRIVATE_KEY")),
  installationId: validateNumericId(requiredGithubEnv("GITHUB_INSTALLATION_ID"), "GITHUB_INSTALLATION_ID"),
  owner: validateRepositoryName(requiredGithubEnv("GITHUB_OWNER"), "GITHUB_OWNER"),
  repository: validateRepositoryName(requiredGithubEnv("GITHUB_REPOSITORY"), "GITHUB_REPOSITORY"),
  baseBranch: validateBranchName(requiredGithubEnv("GITHUB_BASE_BRANCH")),
});

const base64UrlEncode = (value) => Buffer.from(value).toString("base64url");

export const createGithubAppJwt = (config = getGithubConfig(), now = Math.floor(Date.now() / 1000)) => {
  const issuedAt = now - 60;
  const expiresAt = issuedAt + 9 * 60;
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64UrlEncode(JSON.stringify({ iat: issuedAt, exp: expiresAt, iss: config.appId }));
  const unsignedToken = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  return `${unsignedToken}.${signer.sign(config.privateKey, "base64url")}`;
};

const getInstallationToken = async (config) => {
  const now = Date.now();
  const cacheKey = `${config.appId}:${config.installationId}`;
  if (installationTokenCache?.key === cacheKey && installationTokenCache.expiresAt > now + TOKEN_SAFETY_WINDOW_MS) {
    return installationTokenCache.token;
  }

  const jwt = createGithubAppJwt(config);
  const response = await fetchWithTimeout(`${GITHUB_API_BASE}/app/installations/${config.installationId}/access_tokens`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${jwt}`,
      "User-Agent": "portfolio-admin",
      "X-GitHub-Api-Version": GITHUB_API_VERSION,
    },
  }, DEFAULT_TIMEOUT_MS);

  if (!response.ok) throw new Error("GitHub App installation authentication failed.");
  const payload = await response.json();
  if (typeof payload.token !== "string" || typeof payload.expires_at !== "string") {
    throw new Error("GitHub App installation authentication returned an invalid response.");
  }

  const expiresAt = Date.parse(payload.expires_at);
  if (!Number.isFinite(expiresAt) || expiresAt <= now) {
    throw new Error("GitHub App installation authentication returned an expired token.");
  }

  installationTokenCache = { key: cacheKey, token: payload.token, expiresAt };
  return payload.token;
};

export const githubRequest = async (path, options = {}, config = getGithubConfig()) => {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("://")) {
    throw new Error("GitHub API paths must be relative.");
  }

  const token = await getInstallationToken(config);
  return fetchWithTimeout(`${GITHUB_API_BASE}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "portfolio-admin",
      "X-GitHub-Api-Version": GITHUB_API_VERSION,
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  }, DEFAULT_TIMEOUT_MS);
};
