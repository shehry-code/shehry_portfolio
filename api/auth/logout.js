import { clearAuthCookies, setNoStore } from "../_lib/auth.js";

export default function handler(req, res) {
  setNoStore(res);
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end();
    return;
  }

  clearAuthCookies(res);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ ok: true }));
}
