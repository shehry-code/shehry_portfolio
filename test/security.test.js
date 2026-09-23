import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import test from "node:test";

import {
  issueCsrfToken,
  requireCsrf,
  setSessionCookie,
} from "../api/_lib/auth.js";
import testWriteHandler from "../api/admin/github/test-write.js";
import { BLOG_LIMITS, createBlogOperation, validateBlog } from "../api/_lib/blog.js";
import { writeManagedRepositoryFile } from "../api/_lib/github-content.js";
import { ADMIN_WRITE_TEST_PATH, assertManagedRepositoryPath, getBlogRepositoryPaths } from "../api/_lib/repository-paths.js";

process.env.SESSION_SECRET = "a".repeat(43) + "_route-test";
process.env.GITHUB_ALLOWED_USER_ID = "42";

const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const githubConfig = {
  appId: "123456",
  privateKey: privateKey.export({ type: "pkcs8", format: "pem" }),
  installationId: "987654",
  owner: "shehry-code",
  repository: "shehry_portfolio",
  baseBranch: "main",
};

const createResponse = () => {
  const headers = new Map();
  return {
    statusCode: 200,
    setHeader(name, value) { headers.set(name, value); },
    getHeader(name) { return headers.get(name); },
    headers,
    end(body = "") { this.body = body; },
  };
};

const cookieValue = (response, name) => {
  const cookie = response.getHeader("Set-Cookie").find((value) => value.startsWith(`${name}=`));
  assert.ok(cookie);
  return cookie.slice(name.length + 1).split(";", 1)[0];
};

const authenticatedRequest = () => {
  process.env.SESSION_SECRET = "a".repeat(43) + "_route-test";
  process.env.GITHUB_ALLOWED_USER_ID = "42";
  const sessionResponse = createResponse();
  setSessionCookie(sessionResponse, "42");
  const csrfResponse = createResponse();
  const csrfToken = issueCsrfToken(csrfResponse, "42");
  const request = {
    method: "POST",
    headers: {
      cookie: `__Host-portfolio_admin_session=${cookieValue(sessionResponse, "__Host-portfolio_admin_session")}; __Host-portfolio_csrf=${cookieValue(csrfResponse, "__Host-portfolio_csrf")}`,
      "x-csrf-token": csrfToken,
    },
  };
  return request;
};

const configureGithubEnvironment = (installationId) => {
  process.env.GITHUB_APP_ID = githubConfig.appId;
  process.env.GITHUB_APP_PRIVATE_KEY = githubConfig.privateKey;
  process.env.GITHUB_INSTALLATION_ID = installationId;
  process.env.GITHUB_OWNER = githubConfig.owner;
  process.env.GITHUB_REPOSITORY = githubConfig.repository;
  process.env.GITHUB_BASE_BRANCH = githubConfig.baseBranch;
};

const validBlog = () => ({
  slug: "hello-world",
  title: "Hello World",
  description: "A sufficiently descriptive blog post summary.",
  date: "2026-09-22",
  updated: "2026-09-23",
  tags: ["Systems", "Security"],
  category: "Engineering",
  featured: false,
  draft: true,
  readingTime: 5,
  content: "# Hello\n\nThis is Markdown content.",
});

test("CSRF rejects missing and incorrect tokens, accepts a session-bound token", () => {
  const issueResponse = createResponse();
  const token = issueCsrfToken(issueResponse, "42");
  const csrfCookie = cookieValue(issueResponse, "__Host-portfolio_csrf");

  const missingResponse = createResponse();
  assert.equal(requireCsrf({ method: "POST", headers: {}, }, missingResponse, { id: "42" }), false);
  assert.equal(missingResponse.statusCode, 403);

  const invalidResponse = createResponse();
  assert.equal(requireCsrf({ method: "POST", headers: { cookie: `__Host-portfolio_csrf=${csrfCookie}`, "x-csrf-token": "wrong" } }, invalidResponse, { id: "42" }), false);
  assert.equal(invalidResponse.statusCode, 403);

  const validResponse = createResponse();
  assert.equal(requireCsrf({ method: "POST", headers: { cookie: `__Host-portfolio_csrf=${csrfCookie}`, "x-csrf-token": token } }, validResponse, { id: "42" }), true);
  assert.equal(validResponse.statusCode, 200);
});

test("CSRF token is not hard-coded and safe methods remain allowed", () => {
  const first = createResponse();
  const second = createResponse();
  issueCsrfToken(first, "42");
  issueCsrfToken(second, "42");
  assert.notEqual(cookieValue(first, "__Host-portfolio_csrf"), cookieValue(second, "__Host-portfolio_csrf"));
  assert.equal(requireCsrf({ method: "GET", headers: {} }, createResponse(), { id: "42" }), true);
  assert.equal(requireCsrf({ method: "HEAD", headers: {} }, createResponse(), { id: "42" }), true);
});

test("repository paths accept safe blog slugs and reject traversal or unexpected paths", () => {
  assert.deepEqual(getBlogRepositoryPaths("hello-world"), {
    markdown: "src/content/blogs/hello-world.md",
    index: "src/data/content.ts",
  });
  for (const path of ["../secret", "../../etc/passwd", "/absolute/path", "..\\secret", "%2e%2e%2fsecret", "src/content/blogs/hello-world.js", "src/other/hello-world.md", ""]) {
    assert.throws(() => assertManagedRepositoryPath(path));
  }
  assert.equal(assertManagedRepositoryPath(ADMIN_WRITE_TEST_PATH), ADMIN_WRITE_TEST_PATH);
  for (const slug of ["hello-world", "nfa-to-dfa", "dram-row-buffer"]) {
    assert.equal(getBlogRepositoryPaths(slug).markdown.endsWith(`${slug}.md`), true);
  }
  assert.throws(() => getBlogRepositoryPaths("Invalid Slug"));
});

test("blog validation accepts the current metadata shape and returns a semantic operation", () => {
  const blog = validateBlog(validBlog());
  assert.equal(blog.slug, "hello-world");
  assert.deepEqual(createBlogOperation(validBlog(), "create").paths, getBlogRepositoryPaths("hello-world"));
});

test("blog validation rejects malformed metadata and oversized content", () => {
  const cases = [
    ["missing title", { ...validBlog(), title: undefined }],
    ["invalid slug", { ...validBlog(), slug: "../secret" }],
    ["invalid reading time", { ...validBlog(), readingTime: 0 }],
    ["invalid date", { ...validBlog(), date: "not-a-date" }],
    ["malformed tags", { ...validBlog(), tags: ["ok", 3] }],
    ["invalid metadata type", { ...validBlog(), featured: "yes" }],
    ["executable content", { ...validBlog(), content: "<script>alert(1)</script>" }],
    ["oversized content", { ...validBlog(), content: "x".repeat(BLOG_LIMITS.MAX_MARKDOWN_LENGTH + 1) }],
  ];
  for (const [, payload] of cases) assert.throws(() => validateBlog(payload));
});

test("GitHub write helper obtains a token and sends only managed repository content", async () => {
  const calls = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    if (calls.length === 1) return new Response(JSON.stringify({ token: "installation-token", expires_at: "2099-01-01T00:00:00Z" }), { status: 201 });
    return new Response(JSON.stringify({ content: { path: "src/content/blogs/hello-world.md" } }), { status: 201 });
  };

  try {
    const response = await writeManagedRepositoryFile({
      path: "src/content/blogs/hello-world.md",
      content: "# Hello",
      message: "Create hello-world blog",
    }, githubConfig);
    assert.equal(response.status, 201);
    assert.equal(calls[0].options.method, "POST");
    assert.match(calls[0].options.headers.Authorization, /^Bearer /);
    assert.equal(calls[1].options.method, "PUT");
    assert.equal(JSON.parse(calls[1].options.body).branch, "main");
    assert.equal(JSON.parse(calls[1].options.body).content, Buffer.from("# Hello").toString("base64"));
    assert.equal(JSON.stringify(calls[1].options.body).includes("installation-token"), false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("GitHub write helper preserves GitHub errors and rejects unmanaged paths", async () => {
  const originalFetch = globalThis.fetch;
  let callCount = 0;
  globalThis.fetch = async () => {
    callCount += 1;
    return callCount === 1
      ? new Response(JSON.stringify({ token: "installation-token", expires_at: "2099-01-01T00:00:00Z" }), { status: 201 })
      : new Response(JSON.stringify({ message: "forbidden" }), { status: 403 });
  };
  try {
    const response = await writeManagedRepositoryFile({ path: "src/content/blogs/hello-world.md", content: "# Hello", message: "Update hello-world blog" }, { ...githubConfig, installationId: "987655" });
    assert.equal(response.status, 403);
    await assert.rejects(() => writeManagedRepositoryFile({ path: "src/content/blogs/../secret.md", content: "x", message: "bad" }, githubConfig));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("GitHub request timeout is propagated without exposing credentials", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error("timeout"); };
  try {
    await assert.rejects(() => writeManagedRepositoryFile({ path: "src/content/blogs/hello-world.md", content: "# Hello", message: "Update hello-world blog" }, { ...githubConfig, installationId: "987656" }), /timeout/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("GitHub token acquisition failure is generic and GitHub 5xx stays server-side", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (String(url).includes("access_tokens")) return new Response(JSON.stringify({ message: "server failure", token: "do-not-return" }), { status: 500 });
    return new Response(JSON.stringify({ message: "unexpected" }), { status: 500 });
  };
  try {
    await assert.rejects(
      () => writeManagedRepositoryFile({ path: "src/content/blogs/hello-world.md", content: "# Hello", message: "Update hello-world blog" }, { ...githubConfig, installationId: "987657" }),
      /GitHub App installation authentication failed/,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("test-write endpoint requires an admin session, POST, and CSRF token", async () => {
  const unauthenticatedResponse = createResponse();
  await testWriteHandler({ method: "POST", headers: {} }, unauthenticatedResponse);
  assert.equal(unauthenticatedResponse.statusCode, 401);

  const invalidCsrfRequest = authenticatedRequest();
  invalidCsrfRequest.headers["x-csrf-token"] = "wrong";
  const invalidCsrfResponse = createResponse();
  await testWriteHandler(invalidCsrfRequest, invalidCsrfResponse);
  assert.equal(invalidCsrfResponse.statusCode, 403);

  const getResponse = createResponse();
  await testWriteHandler({ method: "GET", headers: {} }, getResponse);
  assert.equal(getResponse.statusCode, 405);
  assert.equal(getResponse.getHeader("Allow"), "POST");
});

test("test-write endpoint uses only the fixed repository path and returns safe commit data", async () => {
  configureGithubEnvironment("987658");
  const calls = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    if (calls.length === 1) return new Response(JSON.stringify({ token: "installation-token", expires_at: "2099-01-01T00:00:00Z" }), { status: 201 });
    if (calls.length === 2) return new Response(JSON.stringify({ sha: "a".repeat(40) }), { status: 200 });
    return new Response(JSON.stringify({ commit: { sha: "b".repeat(40) }, content: { path: ADMIN_WRITE_TEST_PATH } }), { status: 201 });
  };

  try {
    const response = createResponse();
    const request = authenticatedRequest();
    request.body = JSON.stringify({ owner: "attacker", repository: "other", path: "src/secrets.txt" });
    await testWriteHandler(request, response);
    assert.equal(response.statusCode, 200);
    assert.deepEqual(JSON.parse(response.body), {
      ok: true,
      repository: "shehry-code/shehry_portfolio",
      branch: "main",
      path: ADMIN_WRITE_TEST_PATH,
      commitSha: "b".repeat(40),
    });
    assert.match(calls[0].options.headers.Authorization, /^Bearer /);
    assert.match(calls[1].url, /\/repos\/shehry-code\/shehry_portfolio\/contents\/docs\/admin-write-test\.txt\?ref=main$/);
    assert.equal(calls[2].options.method, "PUT");
    assert.match(calls[2].url, /\/repos\/shehry-code\/shehry_portfolio\/contents\/docs\/admin-write-test\.txt$/);
    const writeBody = JSON.parse(calls[2].options.body);
    assert.equal(writeBody.branch, "main");
    assert.equal(writeBody.sha, "a".repeat(40));
    assert.match(Buffer.from(writeBody.content, "base64").toString(), /^Repository write test\nUTC timestamp: /);
    assert.equal(JSON.stringify(JSON.parse(response.body)).includes("installation-token"), false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("test-write endpoint handles upstream failures without leaking credentials", async () => {
  configureGithubEnvironment("987659");
  const originalFetch = globalThis.fetch;
  const originalConsoleError = console.error;
  const logs = [];
  console.error = (...args) => logs.push(args);
  globalThis.fetch = async () => new Response(JSON.stringify({ message: "failure", token: "do-not-return" }), { status: 500 });

  try {
    const response = createResponse();
    await testWriteHandler(authenticatedRequest(), response);
    assert.equal(response.statusCode, 502);
    assert.deepEqual(JSON.parse(response.body), { ok: false, error: "Repository write test failed." });
    assert.equal(response.body.includes("do-not-return"), false);
    assert.equal(JSON.stringify(logs).includes("do-not-return"), false);
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalConsoleError;
  }
});
