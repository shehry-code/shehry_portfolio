import { requireAdmin, requireCsrf, setNoStore } from "../../_lib/auth.js";
import { validateBlog } from "../../_lib/blog.js";
import { BlogContentError, commitBlogUpdate, readBlogSnapshot } from "../../_lib/blog-content.js";
import { getGithubConfig } from "../../_lib/github.js";
import { GithubContentError } from "../../_lib/github-content.js";
import { assertSafeSlug } from "../../_lib/repository-paths.js";

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

const getSlug = (req) => {
  const value = req.query?.slug;
  if (Array.isArray(value) || typeof value !== "string") throw new Error("Invalid slug.");
  return assertSafeSlug(value, "Blog slug");
};

const parseBody = (req) => {
  let body = req.body;
  if (typeof req.body === "string") {
    try {
      body = JSON.parse(req.body);
    } catch {
      throw new Error("Invalid blog payload.");
    }
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid blog payload.");
  const { expectedRevision, ...blogPayload } = body;
  if (typeof expectedRevision !== "string" || !/^[a-f0-9]{40}$/i.test(expectedRevision)) throw new Error("Invalid blog revision.");
  return { expectedRevision, blogPayload };
};

const statusForError = (error, fallback = 502) => {
  if (error instanceof BlogContentError || error instanceof GithubContentError) {
    if (error.code === "not-found") return 404;
    if (error.code === "conflict") return 409;
  }
  return fallback;
};

export default function handler(req, res) {
  setNoStore(res);

  if (!["GET", "PUT"].includes(req.method)) {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, PUT");
    res.end();
    return;
  }

  return requireAdmin(req, res, async (user) => {
    if (req.method === "PUT" && !requireCsrf(req, res, user)) return;

    if (req.method === "GET") {
      try {
        const slug = getSlug(req);
        const snapshot = await readBlogSnapshot(getGithubConfig(), slug);
        sendJson(res, 200, { ok: true, blog: snapshot.blog, revision: snapshot.revision });
      } catch (error) {
        const statusCode = error?.message?.startsWith("Blog slug") ? 400 : statusForError(error);
        sendJson(res, statusCode, { ok: false, error: statusCode === 400 ? "Invalid blog slug." : statusCode === 404 ? "Blog not found." : statusCode === 409 ? "Blog changed while it was being read." : "Unable to load blog." });
      }
      return;
    }

    try {
      const slug = getSlug(req);
      const { expectedRevision, blogPayload } = parseBody(req);
      const blog = validateBlog(blogPayload);
      if (blog.slug !== slug) throw new Error("Blog slug cannot be changed.");
      const commitSha = await commitBlogUpdate(getGithubConfig(), slug, blog, expectedRevision);
      sendJson(res, 200, { ok: true, slug, commitSha });
    } catch (error) {
      const statusCode = error?.message?.startsWith("Blog slug") || error?.message === "Invalid slug." || error?.message === "Invalid blog payload." || error?.message === "Invalid blog revision." || error?.message === "Blog slug cannot be changed." || error?.message?.startsWith("Blog ") ? 400 : statusForError(error);
      sendJson(res, statusCode, { ok: false, error: statusCode === 400 ? "Invalid blog payload." : statusCode === 404 ? "Blog not found." : statusCode === 409 ? "Blog revision is stale." : "Unable to update blog." });
    }
  });
}
