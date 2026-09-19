import http from "node:http";
import { createWriteStream } from "node:fs";
import { mkdir, readFile, writeFile, rename, unlink, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import Busboy from "busboy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3001);
const BLOGS_DIR = path.join(__dirname, "src", "content", "blogs");
const NOTES_ASSETS_DIR = path.join(__dirname, "public", "notes");
const CONTENT_FILE = path.join(__dirname, "src", "data", "content.ts");
const MAX_NOTE_IMAGE_SIZE = 10 * 1024 * 1024;
let noteWriteQueue = Promise.resolve();

const withNoteWriteLock = (task) => {
  const next = noteWriteQueue.then(task, task);
  noteWriteQueue = next.catch(() => {});
  return next;
};

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

const getNoteEntryBounds = (file, slug) => {
  const startMarker = `  {\n    slug: ${JSON.stringify(slug)},`;
  const start = file.indexOf(startMarker);
  if (start === -1) return null;

  const nextEntry = file.indexOf("\n  {\n    slug:", start + startMarker.length);
  const arrayEnd = file.indexOf("\n];", start + startMarker.length);
  const end = nextEntry === -1 ? arrayEnd : Math.min(nextEntry, arrayEnd);
  if (end === -1) return null;

  return { start, end };
};

const readNoteEntry = (file, slug) => {
  const bounds = getNoteEntryBounds(file, slug);
  return bounds ? file.slice(bounds.start, bounds.end) : null;
};

const getNotePaths = (slug) => {
  if (typeof slug !== "string" || !isSafeSlug(slug)) {
    throw new Error("Slug is invalid. Use lowercase letters, numbers, and hyphens only.");
  }

  const noteDirectory = path.resolve(NOTES_ASSETS_DIR, slug.trim());
  const relativePath = path.relative(path.resolve(NOTES_ASSETS_DIR), noteDirectory);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error("Note path resolves outside the notes directory.");
  }

  return { noteDirectory };
};

const getNoteImagePath = (slug, image) => {
  const { noteDirectory } = getNotePaths(slug);
  if (typeof image !== "string" || !image.startsWith(`/notes/${slug}/`)) {
    throw new Error("Image path must belong to this note.");
  }

  let decodedImage;
  try {
    decodedImage = decodeURIComponent(image);
  } catch {
    throw new Error("Image path is invalid.");
  }

  const filename = decodedImage.slice(`/notes/${slug}/`.length);
  if (!filename || filename.includes("/") || filename.includes("\\") || filename === "." || filename === "..") {
    throw new Error("Image path must contain one safe filename.");
  }

  const imagePath = path.resolve(noteDirectory, filename);
  const relativePath = path.relative(noteDirectory, imagePath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error("Image path resolves outside the note directory.");
  }

  return { imagePath, filename };
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

const readNoteMetadata = (file, slug) => {
  const entry = readNoteEntry(file, slug);
  if (!entry) throw new Error("Note not found.");

  const readField = (field) => entry.match(new RegExp(`^    ${field}: (.*),$`, "m"))?.[1] || "";
  const pagesValue = entry.match(/    pages: ([\s\S]*?),\n  \},$/)?.[1] || "[]";
  const pages = [...pagesValue.matchAll(/\{([\s\S]*?)\}/g)].map((match) => {
    const pageEntry = match[1];
    const readPageString = (field) => pageEntry.match(new RegExp(`(?:^|[,\\s])(?:${field}|"${field}"):\\s*("(?:\\\\.|[^"\\\\])*")`))?.[1];
    const altValue = readPageString("alt");
    if (!altValue) throw new Error("Note page metadata is invalid.");
    const imageValue = readPageString("image");
    return {
      ...(imageValue ? { image: JSON.parse(imageValue) } : {}),
      alt: JSON.parse(altValue),
    };
  });

  return {
    slug,
    title: JSON.parse(readField("title")),
    description: JSON.parse(readField("description")),
    date: JSON.parse(readField("date")),
    tags: JSON.parse(readField("tags")),
    category: JSON.parse(readField("category")),
    pages,
  };
};

const updateNotePages = async (slug, pages) => {
  const file = await readFile(CONTENT_FILE, "utf-8");
  const bounds = getNoteEntryBounds(file, slug);
  const entry = bounds ? file.slice(bounds.start, bounds.end) : null;
  if (!entry) throw new Error("Note not found.");

  const updatedEntry = entry.replace(/^    pages: [\s\S]*\n  },$/m, `    pages: ${JSON.stringify(pages)},\n  },`);
  if (updatedEntry === entry) throw new Error("Unable to locate note pages metadata.");
  const updatedFile = `${file.slice(0, bounds.start)}${updatedEntry}${file.slice(bounds.end)}`;
  const tempPath = `${CONTENT_FILE}.tmp`;
  await writeFile(tempPath, updatedFile, "utf-8");
  await rename(tempPath, CONTENT_FILE);
};

const validateNotePages = (slug, pages) => {
  if (!Array.isArray(pages)) throw new Error("Pages must be an array.");
  return pages.map((page) => {
    if (!page || typeof page !== "object" || Array.isArray(page) || typeof page.alt !== "string" || !page.alt.trim()) {
      throw new Error("Each page must contain a non-empty alt string.");
    }
    if (page.image === undefined) return { alt: page.alt.trim() };
    const { filename } = getNoteImagePath(slug, page.image);
    if (!/^[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp)$/.test(filename)) {
      throw new Error("Image filename is invalid.");
    }
    return { image: `/notes/${slug}/${filename}`, alt: page.alt.trim() };
  });
};

const detectImageType = (signature) => {
  if (signature.length >= 3 && signature[0] === 0xff && signature[1] === 0xd8 && signature[2] === 0xff) return { mime: "image/jpeg", extension: "jpg" };
  if (signature.length >= 8 && signature.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return { mime: "image/png", extension: "png" };
  if (signature.length >= 12 && signature.toString("ascii", 0, 4) === "RIFF" && signature.toString("ascii", 8, 12) === "WEBP") return { mime: "image/webp", extension: "webp" };
  return null;
};

const parseNoteImageUpload = (req) => new Promise((resolve, reject) => {
  let parser;
  try {
    parser = Busboy({ headers: req.headers, limits: { fileSize: MAX_NOTE_IMAGE_SIZE, files: 1, fields: 2 } });
  } catch {
    reject(new Error("Request must be multipart/form-data."));
    return;
  }

  let alt = "";
  let upload;
  let filePromise = Promise.resolve();
  let settled = false;
  const fail = (error) => {
    if (!settled) {
      settled = true;
      if (upload && !error.tempPath) error.tempPath = upload.tempPath;
      reject(error);
    }
  };

  parser.on("field", (name, value) => {
    if (name === "alt") alt = value;
  });

  parser.on("file", (name, file, info) => {
    if (name !== "image" || upload) {
      file.resume();
      fail(new Error("Upload must contain exactly one image field."));
      return;
    }

    const tempPath = path.join(NOTES_ASSETS_DIR, `.upload-${randomUUID()}.tmp`);
    const signature = [];
    let tooLarge = false;
    upload = { mimeType: info.mimeType, tempPath, signature, get tooLarge() { return tooLarge; } };
    file.on("data", (chunk) => {
      if (signature.length < 12) signature.push(...chunk.subarray(0, 12 - signature.length));
    });
    file.on("limit", () => { tooLarge = true; });
    file.on("error", () => fail(new Error("Failed to read uploaded image.")));

    const writeStream = createWriteStream(tempPath, { flags: "wx" });
    writeStream.on("error", () => fail(new Error("Failed to store uploaded image.")));
    file.pipe(writeStream);
    filePromise = new Promise((resolveFile, rejectFile) => {
      writeStream.on("close", resolveFile);
      writeStream.on("error", rejectFile);
    });
  });

  parser.on("error", () => fail(new Error("Malformed multipart upload.")));
  parser.on("filesLimit", () => fail(new Error("Upload must contain exactly one image file.")));
  parser.on("fieldsLimit", () => fail(new Error("Upload contains too many fields.")));
  parser.on("finish", async () => {
    try {
      await filePromise;
      if (!upload) throw new Error("An image file is required.");
      if (upload.tooLarge) throw new Error("Image exceeds the 10 MiB size limit.");
      if (!alt.trim()) throw new Error("Alt text is required.");
      const imageType = detectImageType(Buffer.from(upload.signature));
      if (!imageType || upload.mimeType !== imageType.mime) throw new Error("Only valid JPEG, PNG, and WebP images are accepted.");
      if (upload.mimeType === "image/svg+xml" || upload.mimeType === "image/gif") throw new Error("This image format is not supported.");
      if (settled) return;
      settled = true;
      resolve({ ...upload, alt: alt.trim(), imageType });
    } catch (error) {
      fail(error);
    }
  });

  req.on("error", () => fail(new Error("Failed to read upload request.")));
  req.pipe(parser);
});

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

  if (req.method === "GET" && url.pathname.startsWith("/api/content/notes/")) {
    try {
      const slug = decodeURIComponent(url.pathname.slice("/api/content/notes/".length));
      const contentFile = await readFile(CONTENT_FILE, "utf-8");
      sendJson(res, 200, { ok: true, note: readNoteMetadata(contentFile, slug) });
    } catch (error) {
      const message = error?.message === "Note not found." ? "Note not found." : "Unable to load note.";
      sendJson(res, message === "Note not found." ? 404 : 400, { ok: false, error: message });
    }
    return;
  }

  if (req.method === "POST" && url.pathname.startsWith("/api/content/notes/") && url.pathname.endsWith("/pages")) {
    const slug = decodeURIComponent(url.pathname.slice("/api/content/notes/".length, -"/pages".length));
    let upload;
    try {
      getNotePaths(slug);
      upload = await parseNoteImageUpload(req);
      const { noteDirectory } = getNotePaths(slug);
      await mkdir(noteDirectory, { recursive: true });
      const filename = `page-${randomUUID()}.${upload.imageType.extension}`;
      const { imagePath } = getNoteImagePath(slug, `/notes/${slug}/${filename}`);
      const page = await withNoteWriteLock(async () => {
        const contentFile = await readFile(CONTENT_FILE, "utf-8");
        const note = readNoteMetadata(contentFile, slug);
        await rename(upload.tempPath, imagePath);
        const nextPage = { image: `/notes/${slug}/${filename}`, alt: upload.alt };
        try {
          await updateNotePages(slug, [...note.pages, nextPage]);
        } catch (error) {
          await unlink(imagePath).catch(() => {});
          throw error;
        }
        return nextPage;
      });

      sendJson(res, 201, { ok: true, page });
    } catch (error) {
      if (upload?.tempPath) await unlink(upload.tempPath).catch(() => {});
      if (error?.tempPath) await unlink(error.tempPath).catch(() => {});
      const message = error?.message === "Note not found." ? "Note not found." : error instanceof Error ? error.message : "Unable to upload note page.";
      const statusCode = message === "Note not found." ? 404 : message.includes("10 MiB") || message.includes("accepted") ? 415 : 400;
      sendJson(res, statusCode, { ok: false, error: message });
    }
    return;
  }

  if (req.method === "PUT" && url.pathname.startsWith("/api/content/notes/") && url.pathname.endsWith("/pages")) {
    const slug = decodeURIComponent(url.pathname.slice("/api/content/notes/".length, -"/pages".length));
    try {
      getNotePaths(slug);
      const contentFile = await readFile(CONTENT_FILE, "utf-8");
      readNoteMetadata(contentFile, slug);
      const requestBody = await parseJsonBody(req);
      const pages = validateNotePages(slug, requestBody.pages);
      await Promise.all(pages.filter((page) => page.image).map(async (page) => {
        const { imagePath } = getNoteImagePath(slug, page.image);
        await access(imagePath);
      }));
      await withNoteWriteLock(() => updateNotePages(slug, pages));
      sendJson(res, 200, { ok: true, pages });
    } catch (error) {
      const message = error?.code === "ENOENT" ? "Referenced page image does not exist." : error?.message === "Note not found." ? "Note not found." : error instanceof Error ? error.message : "Unable to update note pages.";
      sendJson(res, message === "Note not found." ? 404 : message === "Referenced page image does not exist." ? 400 : 400, { ok: false, error: message });
    }
    return;
  }

  if (req.method === "DELETE" && url.pathname.startsWith("/api/content/notes/") && url.pathname.endsWith("/pages")) {
    const slug = decodeURIComponent(url.pathname.slice("/api/content/notes/".length, -"/pages".length));
    try {
      getNotePaths(slug);
      const contentFile = await readFile(CONTENT_FILE, "utf-8");
      const note = readNoteMetadata(contentFile, slug);
      const requestBody = await parseJsonBody(req);
      const image = requestBody.image;
      const remainingPages = note.pages.filter((page) => page.image !== image);
      if (remainingPages.length === note.pages.length) {
        sendJson(res, 404, { ok: false, error: "Page not found." });
        return;
      }
      const { imagePath } = getNoteImagePath(slug, image);
      await withNoteWriteLock(() => updateNotePages(slug, remainingPages));
      try {
        await unlink(imagePath);
      } catch (error) {
        sendJson(res, 200, { ok: true, warning: "Page metadata removed, but the image file could not be removed." });
        return;
      }
      sendJson(res, 200, { ok: true });
    } catch (error) {
      const message = error?.message === "Note not found." ? "Note not found." : error instanceof Error ? error.message : "Unable to delete note page.";
      sendJson(res, message === "Note not found." ? 404 : 400, { ok: false, error: message });
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
