const BLOG_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const BLOG_MARKDOWN_PREFIX = "src/content/blogs/";
const BLOG_INDEX_PATH = "src/data/content.ts";
const ADMIN_WRITE_TEST_PATH = "docs/admin-write-test.txt";

export const assertSafeSlug = (value, name = "Slug") => {
  if (typeof value !== "string" || !BLOG_SLUG_PATTERN.test(value)) {
    throw new Error(`${name} must contain only lowercase letters, numbers, and hyphens.`);
  }
  return value;
};

export const getBlogRepositoryPaths = (slug) => {
  const safeSlug = assertSafeSlug(slug, "Blog slug");
  return {
    markdown: `${BLOG_MARKDOWN_PREFIX}${safeSlug}.md`,
    index: BLOG_INDEX_PATH,
  };
};

export const assertManagedRepositoryPath = (path) => {
  if (typeof path !== "string" || path.includes("\\") || path.includes("\0") || path.startsWith("/") || path.includes("..")) {
    throw new Error("Repository path is not managed.");
  }

  if (path === ADMIN_WRITE_TEST_PATH) return path;
  if (path === BLOG_INDEX_PATH) return path;

  if (path.startsWith(BLOG_MARKDOWN_PREFIX) && path.endsWith(".md")) {
    const slug = path.slice(BLOG_MARKDOWN_PREFIX.length, -3);
    if (getBlogRepositoryPaths(slug).markdown === path) return path;
  }

  throw new Error("Repository path is not managed.");
};

export { ADMIN_WRITE_TEST_PATH, BLOG_INDEX_PATH };