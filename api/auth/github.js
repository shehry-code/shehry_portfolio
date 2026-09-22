import {
  createCodeChallenge,
  createCodeVerifier,
  createOAuthState,
  getConfig,
  setNoStore,
  setOAuthCookies,
} from "../_lib/auth.js";

export default function handler(req, res) {
  setNoStore(res);
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end();
    return;
  }

  try {
    const { clientId, redirectUri } = getConfig();
    const state = createOAuthState();
    const verifier = createCodeVerifier();
    const authorizationUrl = new URL("https://github.com/login/oauth/authorize");
    authorizationUrl.search = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      state,
      code_challenge: createCodeChallenge(verifier),
      code_challenge_method: "S256",
      scope: "read:user",
      allow_signup: "false",
    });

    setOAuthCookies(res, state, verifier);
    res.statusCode = 302;
    res.setHeader("Location", authorizationUrl.toString());
    res.end();
  } catch {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Authentication is not configured.");
  }
}
