import { getBlogRepositoryPaths } from "./repository-paths.js";
import { createAtomicCommit, getBranchHead, readManagedRepositoryFile } from "./github-content.js";

const BLOG_ARRAY_START = "export const blogPosts: BlogPost[] = [";
const BLOG_ENTRY_PATTERN = /\n  \{\n([\s\S]*?)\n  \},/g;
const BLOG_CONTENT_PREFIX = "../content/blogs/";

export class BlogContentError extends Error {
  constructor(code, message = code) {
    super(message);
    this.name = "BlogContentError";
    this.code = code;
  }
}

const readStringField = (entry, field) => {
  const match = entry.match(new RegExp(`^    ${field}: (.*),$`, "m"));
  return match ? JSON.parse(match[1]) : undefined;
};

const hasBlogContentReference = (entry, slug) => entry.includes(`    content: blogContent[${JSON.stringify(`${BLOG_CONTENT_PREFIX}${slug}.md`)}],`);

const readArrayField = (entry, field) => {
  const match = entry.match(new RegExp(`^    ${field}: (\\[[^\\n]*\\]),$`, "m"));
  return match ? JSON.parse(match[1]) : undefined;
};

const readBooleanField = (entry, field) => {
  const match = entry.match(new RegExp(`^    ${field}: (true|false),$`, "m"));
  return match ? match[1] === "true" : undefined;
};

const readNumberField = (entry, field) => {
  const match = entry.match(new RegExp(`^    ${field}: (\\d+),$`, "m"));
  return match ? Number(match[1]) : undefined;
};

const getBlogArray = (source) => {
  const start = source.indexOf(BLOG_ARRAY_START);
  if (start === -1) throw new BlogContentError("invalid-index");
  const end = source.indexOf("\n];", start + BLOG_ARRAY_START.length);
  if (end === -1) throw new BlogContentError("invalid-index");
  return { start, end };
};

const findBlogEntry = (source, slug) => {
  const { start, end } = getBlogArray(source);
  const section = source.slice(start, end);
  const pattern = new RegExp(BLOG_ENTRY_PATTERN.source, "g");
  let match;
  while ((match = pattern.exec(section))) {
    const entry = match[1];
    if (readStringField(entry, "slug") === slug) {
      const entryStart = start + match.index + 1;
      const entryEnd = start + pattern.lastIndex;
      return { entry, start: entryStart, end: entryEnd };
    }
  }
  throw new BlogContentError("not-found");
};

const parseBlogMetadata = (entry, slug) => {
  if (!hasBlogContentReference(entry, slug)) {
    throw new BlogContentError("invalid-index");
  }

  const blog = {
    slug,
    title: readStringField(entry, "title"),
    description: readStringField(entry, "description"),
    date: readStringField(entry, "date"),
    ...(readStringField(entry, "updated") ? { updated: readStringField(entry, "updated") } : {}),
    tags: readArrayField(entry, "tags"),
    category: readStringField(entry, "category"),
    featured: readBooleanField(entry, "featured"),
    draft: readBooleanField(entry, "draft"),
    readingTime: readNumberField(entry, "readingTime"),
  };

  if (!blog.title || !blog.description || !blog.date || !Array.isArray(blog.tags) || !blog.category || typeof blog.featured !== "boolean" || typeof blog.draft !== "boolean" || !Number.isInteger(blog.readingTime)) {
    throw new BlogContentError("invalid-index");
  }
  return blog;
};

export const readBlogMetadata = (source, slug) => parseBlogMetadata(findBlogEntry(source, slug).entry, slug);

const serializeBlogEntry = (blog) => [
  "  {",
  `    slug: ${JSON.stringify(blog.slug)},`,
  `    title: ${JSON.stringify(blog.title)},`,
  `    description: ${JSON.stringify(blog.description)},`,
  `    date: ${JSON.stringify(blog.date)},`,
  ...(blog.updated ? [`    updated: ${JSON.stringify(blog.updated)},`] : []),
  `    tags: ${JSON.stringify(blog.tags)},`,
  `    category: ${JSON.stringify(blog.category)},`,
  `    featured: ${blog.featured},`,
  `    draft: ${blog.draft},`,
  `    readingTime: ${blog.readingTime},`,
  `    content: blogContent[${JSON.stringify(`${BLOG_CONTENT_PREFIX}${blog.slug}.md`)}],`,
  "  },",
].join("\n");

export const updateBlogMetadata = (source, blog) => {
  const current = findBlogEntry(source, blog.slug);
  const currentBlog = parseBlogMetadata(current.entry, blog.slug);
  const nextBlog = {
    ...blog,
    ...(blog.updated ? {} : currentBlog.updated ? { updated: currentBlog.updated } : {}),
  };
  return `${source.slice(0, current.start)}${serializeBlogEntry(nextBlog)}${source.slice(current.end)}`;
};

export const readBlogSnapshot = async (config, slug) => {
  const paths = getBlogRepositoryPaths(slug);
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const initialHead = await getBranchHead(config);
    const [markdownFile, indexFile] = await Promise.all([
      readManagedRepositoryFile(paths.markdown, initialHead, config),
      readManagedRepositoryFile(paths.index, initialHead, config),
    ]);
    const finalHead = await getBranchHead(config);
    if (initialHead === finalHead) {
      const metadata = readBlogMetadata(indexFile.content, slug);
      return {
        blog: { ...metadata, content: markdownFile.content },
        revision: {
          branch: config.baseBranch,
          head: initialHead,
          files: { markdown: markdownFile.sha, index: indexFile.sha },
        },
      };
    }
  }
  throw new BlogContentError("conflict");
};

export const commitBlogUpdate = async (config, slug, blog, expectedRevision) => {
  const paths = getBlogRepositoryPaths(slug);
  const currentHead = await getBranchHead(config);
  if (currentHead !== expectedRevision) throw new BlogContentError("conflict");

  const [markdownFile, indexFile] = await Promise.all([
    readManagedRepositoryFile(paths.markdown, expectedRevision, config),
    readManagedRepositoryFile(paths.index, expectedRevision, config),
  ]);
  const currentMetadata = readBlogMetadata(indexFile.content, slug);
  const metadata = { ...blog, ...(blog.updated ? {} : currentMetadata.updated ? { updated: currentMetadata.updated } : {}) };
  const updatedIndex = updateBlogMetadata(indexFile.content, metadata);

  const beforeBlobsHead = await getBranchHead(config);
  if (beforeBlobsHead !== expectedRevision) throw new BlogContentError("conflict");

  return createAtomicCommit({
    config,
    parentSha: expectedRevision,
    message: `content: update blog ${slug}`,
    files: [
      { path: paths.markdown, content: blog.content },
      { path: paths.index, content: updatedIndex },
    ],
  });
};
