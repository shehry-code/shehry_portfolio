import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE = "__Host-portfolio_admin_session";
const OAUTH_STATE_COOKIE = "__Host-portfolio_oauth_state";
const OAUTH_VERIFIER_COOKIE = "__Host-portfolio_oauth_verifier";
const SESSION_MAX_AGE = 60 * 60 * 8;
const OAUTH_MAX_AGE = 10 * 60;

const base64UrlEncode = (value) => Buffer.from(value).toString("base64url");
const base64UrlDecode = (value) => Buffer.from(value, "base64url");

const getSessionSecret = () => {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("Missing required server configuration: SESSION_SECRET");
  if (!/^[A-Za-z0-9_-]{43,}$/.test(value) || /^(.)\1+$/.test(value) || /^(?:password|secret|changeme|default|test)$/i.test(value)) {
    throw new Error("SESSION_SECRET must contain at least 256 bits of secret material.");
  }
  return value;
};

const requiredEnv = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required server configuration: ${name}`);
  return value;
};

const getSiteUrl = () => {
  const value = requiredEnv("PUBLIC_SITE_URL").replace(/\/+$/, "");
  let siteUrl;
  try {
    siteUrl = new URL(value);
  } catch {
    throw new Error("PUBLIC_SITE_URL must be an absolute URL.");
  }

  const isLocalDevelopment = process.env.NODE_ENV !== "production" &&
    (siteUrl.hostname === "localhost" || siteUrl.hostname === "127.0.0.1" || siteUrl.hostname === "::1");
  if (siteUrl.username || siteUrl.password || siteUrl.search || siteUrl.hash || (!isLocalDevelopment && siteUrl.protocol !== "https:") || (isLocalDevelopment && !["http:", "https:"].includes(siteUrl.protocol))) {
    throw new Error("PUBLIC_SITE_URL is not a valid trusted site URL.");
  }

  return siteUrl;
};

const getRedirectUri = () => new URL("/api/auth/github/callback", getSiteUrl()).toString();

const getAllowedUserId = () => {
  const value = requiredEnv("GITHUB_ALLOWED_USER_ID");
  if (!/^\d+$/.test(value) || /^0+$/.test(value)) throw new Error("Invalid allowed GitHub user configuration.");
  return value;
};

const sign = (value) => createHmac("sha256", getSessionSecret()).update(value).digest("base64url");

const createSignedValue = (payload) => {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
};

const readSignedValue = (value) => {
  if (!value) return null;
  const separator = value.lastIndexOf(".");
  if (separator <= 0) return null;

  const encodedPayload = value.slice(0, separator);
  const providedSignature = value.slice(separator + 1);
  const expectedSignature = sign(encodedPayload);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) return null;

  try {
    return JSON.parse(base64UrlDecode(encodedPayload).toString("utf8"));
  } catch {
    return null;
  }
};

const parseCookies = (req) => Object.fromEntries(
  (req.headers.cookie || "")
    .split(";")
    .map((part) => part.trim().split("="))
    .filter(([name, value]) => name && value)
    .map(([name, ...value]) => [name, value.join("=")]),
);

const cookie = (name, value, maxAge) => `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
const expiredCookie = (name) => cookie(name, "", 0);

export const appendCookies = (res, cookies) => {
  const existing = res.getHeader("Set-Cookie");
  const current = Array.isArray(existing) ? existing : existing ? [String(existing)] : [];
  res.setHeader("Set-Cookie", [...current, ...cookies]);
};

export const setNoStore = (res) => res.setHeader("Cache-Control", "no-store");

export const clearAuthCookies = (res) => appendCookies(res, [
  expiredCookie(SESSION_COOKIE),
  expiredCookie(OAUTH_STATE_COOKIE),
  expiredCookie(OAUTH_VERIFIER_COOKIE),
]);

export const createOAuthState = () => randomBytes(32).toString("base64url");
export const createCodeVerifier = () => randomBytes(48).toString("base64url");
export const createCodeChallenge = (verifier) => createHash("sha256").update(verifier).digest("base64url");

export const setOAuthCookies = (res, state, verifier) => appendCookies(res, [
  cookie(OAUTH_STATE_COOKIE, state, OAUTH_MAX_AGE),
  cookie(OAUTH_VERIFIER_COOKIE, verifier, OAUTH_MAX_AGE),
]);

export const getOAuthCookies = (req) => {
  const cookies = parseCookies(req);
  return { state: cookies[OAUTH_STATE_COOKIE], verifier: cookies[OAUTH_VERIFIER_COOKIE] };
};

export const statesMatch = (left, right) => {
  if (!left || !right) return false;
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

export const setSessionCookie = (res, githubUserId) => {
  const now = Math.floor(Date.now() / 1000);
  const session = createSignedValue({ sub: String(githubUserId), iat: now, exp: now + SESSION_MAX_AGE });
  appendCookies(res, [cookie(SESSION_COOKIE, session, SESSION_MAX_AGE)]);
};

export const parseGithubUserId = (value) => {
  if (!Number.isSafeInteger(value) || value <= 0) return null;
  return String(value);
};

export const getAuthenticatedUser = (req) => {
  const session = readSignedValue(parseCookies(req)[SESSION_COOKIE]);
  if (!session || typeof session.sub !== "string" || !Number.isInteger(session.iat) || !Number.isInteger(session.exp)) return null;
  if (session.exp <= Math.floor(Date.now() / 1000) || session.sub !== getAllowedUserId()) return null;
  return { id: session.sub };
};

export const requireAuth = (req, res) => {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ ok: false, error: "Unauthorized." }));
      return null;
    }
    return user;
  } catch {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: false, error: "Unauthorized." }));
    return null;
  }
};

export const requireAdmin = async (req, res, handler) => {
  const user = requireAuth(req, res);
  if (!user) return undefined;
  return handler(user);
};

export const fetchWithTimeout = async (url, options = {}, timeoutMs = 10_000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
};

export const getConfig = () => ({
  clientId: requiredEnv("GITHUB_OAUTH_CLIENT_ID"),
  clientSecret: requiredEnv("GITHUB_OAUTH_CLIENT_SECRET"),
  redirectUri: getRedirectUri(),
  siteUrl: getSiteUrl(),
  allowedUserId: getAllowedUserId(),
});

export { SESSION_COOKIE, OAUTH_STATE_COOKIE, OAUTH_VERIFIER_COOKIE };
