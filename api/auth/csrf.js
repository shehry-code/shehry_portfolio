import { issueCsrfToken, requireAdmin, setNoStore } from "../_lib/auth.js";

export default function handler(req, res) {
  setNoStore(res);
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end();
    return;
  }

  return requireAdmin(req, res, async (user) => {
    const csrfToken = issueCsrfToken(res, user.id);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: true, csrfToken }));
  });
}