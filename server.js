import http from "node:http";
import { readFile, writeFile, rename, unlink, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3001);
const BLOGS_DIR = path.join(__dirname, "src", "content", "blogs");
const CONTENT_FILE = path.join(__dirname, "src", "data", "content.ts");

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(payload));
};

const parseJsonBody = (req) => new Promise((resolve, reject) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
    if (body.length > 1_000_000) {
      reject(new Error("Request payload too large."));
      req.destroy();
    }
  });

  req.on("end", () => {
    if (!body) {
      resolve({});
      return;
    }

    try {
      resolve(JSON.parse(body));
    } catch (error) {
      reject(new Error("Request body must be valid JSON."));
    }
  });

  req.on("error", () => reject(new Error("Failed to read request body.")));
});

const isSafeSlug = (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.trim());

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getBlogEntryPattern = (slug) => new RegExp(`  \\{\\n    slug: "${escapeRegExp(slug)}",\\n[\\s\\S]*?\\n  \\},`);

const getNotesArrayBounds = (file) => {
  const startMarker = "export const notes: Note[] = [";
  const start = file.indexOf(startMarker);
  if (start === -1) throw new Error("Unable to locate the notes array in content.ts.");

  const closingIndex = file.indexOf("];", start + startMarker.length);
  if (closingIndex === -1) throw new Error("Unable to locate the notes array closing bracket.");

  return { start, closingIndex };
};

const buildNoteMetadataEntry = (payload) => `
  {
    slug: ${JSON.stringify(payload.slug)},
    title: ${JSON.stringify(payload.title)},
    description: ${JSON.stringify(payload.description)},
    date: ${JSON.stringify(payload.date)},
    tags: ${JSON.stringify(payload.tags)},
    category: ${JSON.stringify(payload.category)},
    pages: ${JSON.stringify(payload.pages)},
  },`;

const noteSlugExists = (file, slug) => {
  const { start, closingIndex } = getNotesArrayBounds(file);
  const notesSection = file.slice(start, closingIndex);
  return new RegExp(`\\bslug: ${escapeRegExp(JSON.stringify(slug))}\\s*,`).test(notesSection);
};

const appendNoteMetadata = async (payload) => {
  const file = await readFile(CONTENT_FILE, "utf-8");
  const { closingIndex } = getNotesArrayBounds(file);
  const updated = `${file.slice(0, closingIndex)}${buildNoteMetadataEntry(payload)}\n${file.slice(closingIndex)}`;
  const tempPath = `${CONTENT_FILE}.tmp`;
  await writeFile(tempPath, updated, "utf-8");
  await rename(tempPath, CONTENT_FILE);
};

const ensureFileDoesNotExist = async (targetPath) => {
  try {
    await access(targetPath, constants.F_OK);
    return false;
  } catch {
    return true;
  }
};

const buildBlogMetadataEntry = (payload) => {
  const updatedLine = payload.updated ? `    updated: "${payload.updated}",\n` : "";

  return `
  {
    slug: "${payload.slug}",
    title: "${payload.title.replace(/"/g, '\\"')}",
    description: "${payload.description.replace(/"/g, '\\"')}",
    date: "${payload.date}",
${updatedLine}    tags: [${payload.tags.map((tag) => `"${tag.replace(/"/g, '\\"')}"`).join(", ")}],
    category: "${payload.category.replace(/"/g, '\\"')}",
    featured: ${payload.featured},
    draft: ${payload.draft},
    readingTime: ${payload.readingTime},
    content: blogContent["../content/blogs/${payload.slug}.md"],
  },`;
};

const updateContentFile = async (payload) => {
  const file = await readFile(CONTENT_FILE, "utf-8");
  const closingIndex = file.lastIndexOf("];\n");

  if (closingIndex === -1) {
    throw new Error("Unable to locate the blogPosts array in content.ts.");
  }

  const beforeClosing = file.slice(0, closingIndex);
  const afterClosing = file.slice(closingIndex);
  const entryText = buildBlogMetadataEntry(payload);
  const updated = `${beforeClosing}${entryText}${afterClosing}`;

  const tempPath = `${CONTENT_FILE}.tmp`;
  await writeFile(tempPath, updated, "utf-8");
  await rename(tempPath, CONTENT_FILE);
};

const normalizeBlogPayload = (payload) => ({
  ...payload,
  slug: String(payload.slug).trim(),
  title: String(payload.title).trim(),
  description: String(payload.description).trim(),
  date: String(payload.date).trim(),
  updated: payload.updated ? String(payload.updated).trim() : "",
  tags: Array.isArray(payload.tags) ? payload.tags.map((tag) => String(tag).trim()).filter(Boolean) : [],
  category: String(payload.category).trim(),
  readingTime: Number(payload.readingTime),
});

const replaceBlogMetadata = async (originalSlug, payload) => {
  const file = await readFile(CONTENT_FILE, "utf-8");
  const entryPattern = getBlogEntryPattern(originalSlug);

  if (!entryPattern.test(file)) {
    throw new Error("Unable to locate the blog metadata entry.");
  }

  const updatedFile = file.replace(entryPattern, buildBlogMetadataEntry(payload).trimEnd());
  const tempPath = `${CONTENT_FILE}.tmp`;
  await writeFile(tempPath, updatedFile, "utf-8");
  await rename(tempPath, CONTENT_FILE);
};

const removeBlogMetadata = async (slug) => {
  const file = await readFile(CONTENT_FILE, "utf-8");
  const entryPattern = getBlogEntryPattern(slug);

  if (!entryPattern.test(file)) {
    throw new Error("Blog not found.");
  }

  const updatedFile = file.replace(entryPattern, "");
  const tempPath = `${CONTENT_FILE}.tmp`;
  await writeFile(tempPath, updatedFile, "utf-8");
  await rename(tempPath, CONTENT_FILE);
};

const readBlogMetadata = (file, slug) => {
  const entry = file.match(getBlogEntryPattern(slug))?.[0];

  if (!entry) {
    throw new Error("Blog not found.");
  }

  const readField = (field) => entry.match(new RegExp(`    ${field}: (.*),`))?.[1] || "";
  const tagsValue = entry.match(/    tags: \[(.*)\],/)?.[1] || "";

  return {
    slug,
    title: JSON.parse(readField("title")),
    description: JSON.parse(readField("description")),
    date: JSON.parse(readField("date")),
    updated: readField("updated") ? JSON.parse(readField("updated")) : "",
    tags: tagsValue ? tagsValue.split(",").map((tag) => tag.trim().replace(/^"|"$/g, "")).filter(Boolean) : [],
    category: JSON.parse(readField("category")),
    featured: readField("featured") === "true",
    draft: readField("draft") === "true",
    readingTime: Number(readField("readingTime")),
  };
};

const getBlogPaths = (slug) => {
  if (typeof slug !== "string" || !isSafeSlug(slug)) {
    throw new Error("Slug is invalid. Use lowercase letters, numbers, and hyphens only.");
  }

  const markdownPath = path.resolve(BLOGS_DIR, `${slug.trim()}.md`);
  const relativePath = path.relative(path.resolve(BLOGS_DIR), markdownPath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error("Slug resolves outside the blog directory.");
  }

  return { markdownPath };
};

const validateBlogPayload = (payload) => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Request body must be a JSON object.");
  }

  const requiredFields = ["title", "slug", "description", "date", "category", "readingTime", "content"];

  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === "") {
      throw new Error(`Missing required field: ${field}.`);
    }
  }

  if (typeof payload.title !== "string" || payload.title.trim().length < 2) {
    throw new Error("Title must be at least 2 characters long.");
  }

  if (typeof payload.slug !== "string" || !isSafeSlug(payload.slug)) {
    throw new Error("Slug is invalid. Use lowercase letters, numbers, and hyphens only.");
  }

  if (payload.slug.includes("..") || payload.slug.includes("/") || payload.slug.includes("\\")) {
    throw new Error("Slug contains unsafe path characters.");
  }

  if (typeof payload.description !== "string" || payload.description.trim().length < 10) {
    throw new Error("Description must be at least 10 characters long.");
  }

  if (typeof payload.date !== "string" || Number.isNaN(Date.parse(payload.date))) {
    throw new Error("Date must be a valid ISO date string.");
  }

  if (payload.updated !== undefined && payload.updated !== "" && (typeof payload.updated !== "string" || Number.isNaN(Date.parse(payload.updated)))) {
    throw new Error("Updated date must be a valid ISO date string.");
  }

  if (typeof payload.category !== "string" || payload.category.trim().length < 2) {
    throw new Error("Category is required.");
  }

  if (!Number.isInteger(Number(payload.readingTime)) || Number(payload.readingTime) <= 0) {
    throw new Error("Reading time must be a positive integer.");
  }

  if (typeof payload.content !== "string" || payload.content.trim().length === 0) {
    throw new Error("Markdown content is required.");
  }

  if (payload.tags !== undefined && (!Array.isArray(payload.tags) || !payload.tags.every((tag) => typeof tag === "string"))) {
    throw new Error("Tags must be an array of strings.");
  }

  if (typeof payload.featured !== "boolean") {
    throw new Error("Featured must be a boolean.");
  }

  if (typeof payload.draft !== "boolean") {
    throw new Error("Draft must be a boolean.");
  }
};

const validateNotePayload = (payload) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Request body must be a JSON object.");
  }

  for (const field of ["title", "description", "slug", "date", "category", "tags", "pages"]) {
    if (payload[field] === undefined || payload[field] === null) {
      throw new Error(`Missing required field: ${field}.`);
    }
  }

  if (typeof payload.title !== "string" || payload.title.trim().length < 2) {
    throw new Error("Title must be at least 2 characters long.");
  }
  if (typeof payload.description !== "string" || payload.description.trim().length < 1) {
    throw new Error("Description is required.");
  }
  if (typeof payload.slug !== "string" || !isSafeSlug(payload.slug)) {
    throw new Error("Slug is invalid. Use lowercase letters, numbers, and hyphens only.");
  }
  if (typeof payload.date !== "string" || Number.isNaN(Date.parse(payload.date))) {
    throw new Error("Date must be a valid ISO date string.");
  }
  if (typeof payload.category !== "string" || payload.category.trim().length < 1) {
    throw new Error("Category is required.");
  }
  if (!Array.isArray(payload.tags) || !payload.tags.every((tag) => typeof tag === "string")) {
    throw new Error("Tags must be an array of strings.");
  }
  if (!Array.isArray(payload.pages)) {
    throw new Error("Pages must be an array.");
  }
  if (!payload.pages.every((page) => (
    page && typeof page === "object" && !Array.isArray(page) &&
    typeof page.alt === "string" &&
    (page.image === undefined || typeof page.image === "string")
  ))) {
    throw new Error("Each page must contain an alt string and an optional image string.");
  }
};

const normalizeNotePayload = (payload) => ({
  slug: payload.slug.trim(),
  title: payload.title.trim(),
  description: payload.description.trim(),
  date: payload.date.trim(),
  tags: payload.tags.map((tag) => tag.trim()).filter(Boolean),
  category: payload.category.trim(),
  pages: payload.pages.map((page) => ({
    ...(page.image?.trim() ? { image: page.image.trim() } : {}),
    alt: page.alt.trim(),
  })),
});

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/content/blogs") {
    try {
      const contentPath = path.join(__dirname, "src", "data", "content.ts");
      const file = await readFile(contentPath, "utf-8");
      sendJson(res, 200, {
        ok: true,
        source: "src/data/content.ts",
        preview: file.slice(0, 200),
      });
    } catch (error) {
      sendJson(res, 500, { ok: false, error: "Unable to read content index." });
    }
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/content/blogs/")) {
    try {
      const slug = decodeURIComponent(url.pathname.slice("/api/content/blogs/".length));
      const { markdownPath } = getBlogPaths(slug);
      const [contentFile, markdown] = await Promise.all([
        readFile(CONTENT_FILE, "utf-8"),
        readFile(markdownPath, "utf-8"),
      ]);
      sendJson(res, 200, { ok: true, blog: { ...readBlogMetadata(contentFile, slug), content: markdown } });
    } catch (error) {
      const statusCode = error?.code === "ENOENT" || error?.message === "Blog not found." ? 404 : 400;
      sendJson(res, statusCode, { ok: false, error: statusCode === 404 ? "Blog not found." : "Unable to load blog." });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/content/blogs") {
    try {
      const requestBody = await parseJsonBody(req);
      validateBlogPayload(requestBody);

      const slug = requestBody.slug.trim();
      const targetFile = path.join(BLOGS_DIR, `${slug}.md`);

      if (!(await ensureFileDoesNotExist(targetFile))) {
        sendJson(res, 409, { ok: false, error: "A blog with this slug already exists." });
        return;
      }

      const markdownContent = String(requestBody.content);
      const tempMarkdownPath = `${targetFile}.tmp`;
      await writeFile(tempMarkdownPath, markdownContent, "utf-8");
      await rename(tempMarkdownPath, targetFile);

      const normalizedPayload = { ...normalizeBlogPayload(requestBody), slug };

      await updateContentFile(normalizedPayload);

      sendJson(res, 201, { ok: true, slug });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create blog.";
      const statusCode = message === "A blog with this slug already exists." ? 409 : 400;
      sendJson(res, statusCode, { ok: false, error: message });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/content/notes") {
    try {
      const requestBody = await parseJsonBody(req);
      validateNotePayload(requestBody);
      const payload = normalizeNotePayload(requestBody);
      const contentFile = await readFile(CONTENT_FILE, "utf-8");

      if (noteSlugExists(contentFile, payload.slug)) {
        sendJson(res, 409, { ok: false, error: "A note with this slug already exists." });
        return;
      }

      await appendNoteMetadata(payload);
      sendJson(res, 201, { ok: true, slug: payload.slug });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create note.";
      const statusCode = message === "A note with this slug already exists." ? 409 : 400;
      sendJson(res, statusCode, { ok: false, error: message });
    }
    return;
  }

  if (req.method === "PUT" && url.pathname.startsWith("/api/content/blogs/")) {
    const originalSlug = decodeURIComponent(url.pathname.slice("/api/content/blogs/".length));
    let originalMetadata;

    try {
      const { markdownPath: originalMarkdownPath } = getBlogPaths(originalSlug);
      const contentFile = await readFile(CONTENT_FILE, "utf-8");
      originalMetadata = readBlogMetadata(contentFile, originalSlug);
      const originalMarkdown = await readFile(originalMarkdownPath, "utf-8");
      const requestBody = await parseJsonBody(req);
      validateBlogPayload(requestBody);
      const payload = normalizeBlogPayload(requestBody);
      const { markdownPath: newMarkdownPath } = getBlogPaths(payload.slug);
      const slugChanged = originalSlug !== payload.slug;

      if (slugChanged && !(await ensureFileDoesNotExist(newMarkdownPath))) {
        sendJson(res, 409, { ok: false, error: "A blog with this slug already exists." });
        return;
      }

      const markdownTempPath = `${newMarkdownPath}.tmp`;
      await writeFile(markdownTempPath, payload.content, "utf-8");

      let newFileCreated = false;

      try {
        await replaceBlogMetadata(originalSlug, payload);
        await rename(markdownTempPath, newMarkdownPath);
        newFileCreated = true;
        if (slugChanged) await unlink(originalMarkdownPath);
      } catch (error) {
        await unlink(markdownTempPath).catch(() => {});
        if (newFileCreated && slugChanged) await unlink(newMarkdownPath).catch(() => {});
        await replaceBlogMetadata(payload.slug, { ...originalMetadata, slug: originalSlug, content: originalMarkdown }).catch(() => {});
        throw error;
      }

      sendJson(res, 200, { ok: true, slug: payload.slug });
    } catch (error) {
      const message = error?.code === "ENOENT"
        ? "Blog not found."
        : error instanceof Error
          ? error.message
          : "Unable to update blog.";
      const statusCode = message === "A blog with this slug already exists." ? 409 : message === "Blog not found." ? 404 : 400;
      sendJson(res, statusCode, { ok: false, error: message });
    }
    return;
  }

  if (req.method === "DELETE" && url.pathname.startsWith("/api/content/blogs/")) {
    try {
      const slug = decodeURIComponent(url.pathname.slice("/api/content/blogs/".length)).trim();
      const { markdownPath } = getBlogPaths(slug);

      try {
        await access(markdownPath, constants.F_OK);
      } catch (error) {
        throw Object.assign(new Error("Blog not found."), { code: "ENOENT" });
      }

      await unlink(markdownPath);
      await removeBlogMetadata(slug);
      sendJson(res, 200, { ok: true, slug });
    } catch (error) {
      const message = error?.code === "ENOENT"
        ? "Blog not found."
        : error instanceof Error
          ? error.message
          : "Unable to delete blog.";
      const statusCode = message === "Blog not found." ? 404 : 400;
      sendJson(res, statusCode, { ok: false, error: message });
    }
    return;
  }

  sendJson(res, 404, { ok: false, error: "Not found" });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Local content API listening on http://localhost:${PORT}`);
});
