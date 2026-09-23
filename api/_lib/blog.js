import { getBlogRepositoryPaths } from "./repository-paths.js";

const MAX_TITLE_LENGTH = 160;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_CATEGORY_LENGTH = 80;
const MAX_TAG_LENGTH = 50;
const MAX_TAGS = 20;
const MAX_MARKDOWN_LENGTH = 500_000;

const isIsoDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));

const assertText = (value, field, maxLength, minimum = 1) => {
  if (typeof value !== "string" || value.trim().length < minimum || value.trim().length > maxLength) {
    throw new Error(`${field} is invalid.`);
  }
  return value.trim();
};

export const validateBlog = (payload) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error("Blog must be an object.");

  const allowedFields = new Set(["slug", "title", "description", "date", "updated", "tags", "category", "featured", "draft", "readingTime", "content"]);
  if (Object.keys(payload).some((key) => !allowedFields.has(key))) throw new Error("Blog contains unsupported fields.");

  const slug = payload.slug;
  if (typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Blog slug is invalid.");
  const title = assertText(payload.title, "Blog title", MAX_TITLE_LENGTH, 2);
  const description = assertText(payload.description, "Blog description", MAX_DESCRIPTION_LENGTH, 10);
  if (!isIsoDate(payload.date)) throw new Error("Blog date is invalid.");
  if (payload.updated !== undefined && payload.updated !== "" && !isIsoDate(payload.updated)) throw new Error("Blog updated date is invalid.");
  if (!Array.isArray(payload.tags) || payload.tags.length > MAX_TAGS || !payload.tags.every((tag) => typeof tag === "string" && tag.trim() && tag.trim().length <= MAX_TAG_LENGTH)) {
    throw new Error("Blog tags are invalid.");
  }
  const category = assertText(payload.category, "Blog category", MAX_CATEGORY_LENGTH, 2);
  if (!Number.isInteger(payload.readingTime) || payload.readingTime < 1 || payload.readingTime > 600) throw new Error("Blog reading time is invalid.");
  if (typeof payload.featured !== "boolean" || typeof payload.draft !== "boolean") throw new Error("Blog flags are invalid.");
  const content = assertText(payload.content, "Blog content", MAX_MARKDOWN_LENGTH);
  if (/<\/?script\b/i.test(content) || /(?:javascript|data):/i.test(content)) throw new Error("Blog content contains a prohibited executable URL or tag.");

  return {
    slug,
    title,
    description,
    date: payload.date,
    ...(payload.updated ? { updated: payload.updated } : {}),
    tags: payload.tags.map((tag) => tag.trim()),
    category,
    featured: payload.featured,
    draft: payload.draft,
    readingTime: payload.readingTime,
    content,
  };
};

export const createBlogOperation = (payload, mode = "upsert") => {
  if (!["create", "update", "upsert"].includes(mode)) throw new Error("Unsupported blog operation.");
  const blog = validateBlog(payload);
  return { type: "blog", mode, blog, paths: getBlogRepositoryPaths(blog.slug) };
};

export const BLOG_LIMITS = Object.freeze({ MAX_MARKDOWN_LENGTH, MAX_TAGS });