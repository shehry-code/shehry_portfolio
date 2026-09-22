import { getAuthenticatedUser, setNoStore } from "../_lib/auth.js";

export default function handler(req, res) {
  setNoStore(res);
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end();
    return;
  }

  try {
    const user = getAuthenticatedUser(req);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ authenticated: Boolean(user) }));
  } catch {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ authenticated: false }));
  }
}
