# Shehry — Personal Engineering Portfolio

A personal engineering portfolio and learning journal focused on understanding computing from the hardware and low-level layers upward.

The portfolio documents an ongoing Computer Science learning journey across cybersecurity, computer architecture, operating systems, Linux, networking, systems programming, assembly, C/C++, reverse engineering, low-level computing, and hardware/security research.

## Portfolio Structure

The sections have distinct purposes:

- **Projects** — things I actually build
- **Blogs** — polished explanations of things I learned
- **Notes** — short, raw learning material
- **Research** — deeper investigations and experiments
- **About** — who I am, what I study, and how I learn

## Technology Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- `@tailwindcss/vite`
- React Router DOM with `HashRouter`
- React Markdown
- `remark-gfm` for GitHub-Flavored Markdown
- `lucide-react` for icons
- Native `mailto:` contact flow

## Getting Started

From the project directory:

```bash
npm install
npm run dev
```

The public portfolio runs at [http://localhost:3000](http://localhost:3000).

The local admin API is a separate developer-only tool for editing the repo content locally. It must remain bound to the loopback interface and is not a public CMS or production service.

```bash
npm run dev:admin
```

This starts the local admin server on the loopback interface and the Vite frontend together. The admin API listens on `http://127.0.0.1:3001` and is not intended to be exposed to the network.

Run the checks and production build with:

```bash
npm run typecheck
npm run build
```

The production build is generated in `dist/`.

## Remote Admin Authentication

The remote admin authentication foundation uses GitHub OAuth through Vercel Functions. The admin UI remains on the existing `HashRouter`, while authentication requests use same-origin endpoints:

```text
/api/auth/github
/api/auth/github/callback
/api/auth/session
/api/auth/logout
```

Only the configured immutable GitHub numeric user ID is authorized. OAuth state, PKCE, and an HMAC-signed `HttpOnly`, `Secure`, `SameSite=Lax` session cookie are handled server-side. GitHub OAuth credentials are never included in frontend code, and OAuth is not used for repository writes.

Configure these values in Vercel Project Settings. Do not prefix them with `VITE_`, and do not commit real values:

```text
GITHUB_OAUTH_CLIENT_ID=
GITHUB_OAUTH_CLIENT_SECRET=
GITHUB_ALLOWED_USER_ID=
SESSION_SECRET=
PUBLIC_SITE_URL=https://your-site.vercel.app
```

Generate `SESSION_SECRET` locally with a cryptographically secure generator, then copy it to the Vercel environment settings without committing it:

```bash
node -e 'console.log(require("node:crypto").randomBytes(32).toString("base64url"))'
```

The server requires at least 256 bits of base64url secret material. Rotating `SESSION_SECRET` invalidates every existing signed session because sessions are verified against the current configured secret. Logout still clears the current browser cookie, but a copied cookie remains valid until expiry unless the secret is rotated.

The GitHub OAuth application callback URL must exactly match:

```text
https://your-site.vercel.app/api/auth/github/callback
```

For local Vercel Function testing, use the Vercel development runtime with the same variables loaded locally. Running only `vite` does not provide `/api` Functions. `server.js` remains available for the existing local content workflow until later migration phases.

### Admin API security preparation

Future `/api/admin/*` handlers must use the shared `requireAdmin(req, res, handler)` helper before reading or mutating request data. The URL prefix is organizational only; server-side authorization remains mandatory.

The current serverless-safe implementation intentionally does not add an in-memory rate limiter. In-memory limits are local to one warm Vercel instance and do not provide a global guarantee. Phase 3 should add distributed limits such as 5 OAuth initiations per IP per minute, 10 callbacks per IP per 10 minutes, and 30 authenticated mutations per user/IP per minute, with stricter limits for uploads.

Phase 3 mutations must also require an explicit CSRF token. The server should issue a token for the authenticated session, the frontend should send it in an `X-CSRF-Token` header, and every state-changing `POST`, `PUT`, `PATCH`, and `DELETE` admin request should validate it before authorization-sensitive work. `SameSite=Lax` remains useful defense in depth, but is not the sole CSRF control.

Phase 3C adds the security foundation for those future mutations without wiring any write endpoint. An authenticated browser obtains a fresh CSRF token from `GET /api/auth/csrf`; the server stores a signed session-bound copy in a readable cookie and returns the token to the authenticated browser for the `X-CSRF-Token` header. `requireCsrf()` compares the header with that signed cookie after `requireAdmin()` succeeds. The token is not a GitHub credential and is never stored in localStorage.

Future repository operations must use semantic inputs, not browser-supplied paths. Blog slugs are validated strictly and construct only `src/content/blogs/<slug>.md` plus the managed `src/data/content.ts` index. The internal GitHub Contents primitive rejects every other path, branch, owner, or repository supplied by a caller. It is not exposed as a generic file-writing or GitHub proxy endpoint.

A blog operation updates both its Markdown body and metadata index. The eventual remote implementation should use one Git Data API tree and commit, with the current branch head as the parent, so both files become visible atomically. It should verify the expected branch head before creating the commit and handle a stale head as a conflict rather than issuing two independent Contents API writes. Phase 3C intentionally stops before implementing that mutation workflow.

## Controlled GitHub App Integration

The GitHub App integration uses the protected read-only status endpoint:

```text
GET /api/admin/github/status
```

It verifies the authenticated admin session, obtains an installation token server-side, then checks the configured repository and base branch. The browser receives only connection status and repository coordinates. It never receives the App JWT, installation token, private key, or any OAuth credential.

Configure these additional server-only values in Vercel Project Settings:

```text
GITHUB_APP_ID=
GITHUB_APP_PRIVATE_KEY=
GITHUB_INSTALLATION_ID=
GITHUB_OWNER=shehry-code
GITHUB_REPOSITORY=shehry_portfolio
GITHUB_BASE_BRANCH=main
```

The private key may be stored as one line with literal `\\n` sequences; the server normalizes those sequences before parsing the key. Do not commit the key or place any of these values in frontend `VITE_` variables.

### Manual GitHub App setup

This repository cannot create or install the GitHub App automatically. Perform these steps manually:

1. Open GitHub Developer settings, choose **GitHub Apps**, and create a new App.
2. Set the App name and homepage URL according to the deployment. No GitHub App user callback is needed because this phase uses App installation authentication, not GitHub App user OAuth.
3. Disable webhooks for this phase. No webhook is required for read-only repository verification.
4. Under repository permissions, grant **Contents: Read & Write** only. Keep the App installed only on `shehry-code/shehry_portfolio` and leave all other permissions disabled.
5. Restrict the App to **Only select repositories** and select `shehry-code/shehry_portfolio`.
6. Generate and download the App private key. Store it only in Vercel as `GITHUB_APP_PRIVATE_KEY`.
7. Install the App on the portfolio repository.
8. Copy the App ID and installation ID into the corresponding Vercel environment variables. The installation ID is available from the App installation URL or GitHub App installation settings.
9. Configure `GITHUB_OWNER`, `GITHUB_REPOSITORY`, and `GITHUB_BASE_BRANCH` for the target repository.

The existing GitHub OAuth callback URL remains separate and is still configured as `/api/auth/github/callback` for administrator login.

### Controlled repository write test

Phase 3D adds the protected endpoint:

`POST /api/admin/github/test-write`

It requires the authenticated admin session and `X-CSRF-Token`, then writes a small timestamped diagnostic file only at `docs/admin-write-test.txt` in the server-configured repository and branch. The browser cannot supply the repository, branch, path, or content. The endpoint returns only the repository, branch, fixed path, and resulting commit SHA. It is an infrastructure test only and is not connected to the blog editor.

## Project Structure

```text
src/
├── App.tsx
├── components/
│   ├── Footer.tsx
│   ├── Hero.tsx
│   └── Navbar.tsx
├── data/
│   └── content.ts
├── content/
│   ├── blogs/
│   └── notes/
├── pages/
│   ├── About.tsx
│   ├── Blog.tsx
│   ├── BlogPost.tsx
│   ├── Contact.tsx
│   ├── Home.tsx
│   ├── Notes.tsx
│   ├── NoteDetail.tsx
│   ├── NotFound.tsx
│   ├── ProjectDetail.tsx
│   ├── Projects.tsx
│   ├── Research.tsx
│   └── Work.tsx
└── index.css
```

## Content Architecture

### Structured Data

`src/data/content.ts` contains metadata and structured data for:

- Profile and social links
- Current focus
- Skills and skill levels
- Projects
- Blog metadata
- Notes metadata
- Research entries
- Learning timeline

### Blogs

Blog metadata lives in `src/data/content.ts`. Blog bodies are separate Markdown files under `src/content/blogs/`. Vite's `import.meta.glob()` loader makes the raw Markdown available, and detail pages render it with React Markdown and GitHub-Flavored Markdown support.

To add a blog post:

1. Add a `.md` file to `src/content/blogs/`.
2. Add the matching metadata entry to `blogPosts` in `src/data/content.ts`.
3. Keep the metadata slug and filename consistent.
4. The existing loader makes the body available to the blog detail route.

There is no CMS or backend involved.

### Notes

Note metadata lives in `src/data/content.ts`, while note bodies are separate Markdown files under `src/content/notes/`. They use a Notes-specific Vite `import.meta.glob()` loader and dedicated detail routes through `NoteDetail.tsx`.

To add a note:

1. Add a Markdown file to `src/content/notes/`.
2. Add matching metadata to the `notes` data in `src/data/content.ts`.
3. Keep the metadata slug and filename consistent.
4. The existing loader exposes the body to `NoteDetail.tsx`.

### Projects

Project metadata is maintained in `src/data/content.ts`. Projects are listed at `/projects` and use dynamic detail routes at `/projects/:slug`.

### Research

Research entries are structured data in `src/data/content.ts`. They represent investigations that may be ideas, planned work, in-progress work, or completed work. The status reflects the current state of each investigation.

### Learning Journey

The About page uses the timeline data in `src/data/content.ts` to describe the existing learning journey.

## Routes

The application uses React Router's `HashRouter`, so deployed navigation uses hash-based URLs:

```text
/
/about
/projects
/projects/:slug
/blog
/blog/:slug
/notes
/notes/:slug
/research
/work
/contact
```

A catch-all route renders the 404 page for unknown paths.

## Contact Behavior

The Contact page is fully static. It has no backend or API. Submitting the form prepares a `mailto:` email draft containing the visitor's name, email, subject, and message. The visitor's email client handles sending the message.

## Accessibility and UX

The current interface includes:

- Keyboard-accessible navigation and mobile menu controls
- Visible focus states
- Accessible filter controls
- Labeled search inputs
- Semantic heading structure
- Responsive layouts for mobile, tablet, and desktop
- Native form validation
- No known horizontal overflow at tested widths

## Deployment

This is a static Vite application deployed on Vercel.

1. Install dependencies with `npm install`.
2. Build the site with `npm run build`.
3. Vite generates the static output in `dist/`.
4. Deploy the generated application through Vercel.

`HashRouter` is intentional for this static deployment, so the application does not require server-side routing or a backend rewrite configuration.

The local admin server is separate from the public deployment. It is a repository-local editing helper for writing blog and note content during development. It is intentionally bound to `127.0.0.1`, uses only local allowed origins, and is not meant to be exposed beyond the same machine.

- GitHub: [shehry-code/shehry_portfolio](https://github.com/shehry-code/shehry_portfolio)
- Portfolio: [shehry-portfolio.vercel.app](https://shehry-portfolio.vercel.app)

## License

Personal portfolio — all rights reserved.
