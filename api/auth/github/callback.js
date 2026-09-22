import { clearAuthCookies, fetchWithTimeout, getConfig, getOAuthCookies, parseGithubUserId, setNoStore, setSessionCookie, statesMatch } from "../../_lib/auth.js";

const sendError = (res, statusCode, message) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(message);
};

export default async function handler(req, res) {
  setNoStore(res);
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end();
    return;
  }

  try {
    const { code, state, error } = req.query || {};
    const { clientId, clientSecret, redirectUri, siteUrl, allowedUserId } = getConfig();
    const oauthCookies = getOAuthCookies(req);

    if (error || typeof code !== "string" || !statesMatch(state, oauthCookies.state) || !oauthCookies.verifier) {
      clearAuthCookies(res);
      sendError(res, 400, "Unable to complete authentication.");
      return;
    }

    const tokenResponse = await fetchWithTimeout("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        code_verifier: oauthCookies.verifier,
      }),
    });
    const tokenPayload = await tokenResponse.json();
    if (!tokenResponse.ok || typeof tokenPayload.access_token !== "string") {
      clearAuthCookies(res);
      sendError(res, 400, "Unable to complete authentication.");
      return;
    }

    const userResponse = await fetchWithTimeout("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${tokenPayload.access_token}`,
        "User-Agent": "portfolio-admin",
      },
    });
    const userPayload = await userResponse.json();
    const githubUserId = parseGithubUserId(userPayload && userPayload.id);

    clearAuthCookies(res);
    if (!userResponse.ok || !githubUserId || githubUserId !== allowedUserId) {
      sendError(res, 403, "This GitHub account is not authorized.");
      return;
    }

    setSessionCookie(res, githubUserId);
    res.statusCode = 302;
    res.setHeader("Location", new URL("/#/admin", siteUrl).toString());
    res.end();
  } catch {
    clearAuthCookies(res);
    sendError(res, 500, "Unable to complete authentication.");
  }
}
