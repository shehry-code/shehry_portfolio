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

The development server runs at [http://localhost:3000](http://localhost:3000).

Run the checks and production build with:

```bash
npm run typecheck
npm run build
```

The production build is generated in `dist/`.

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

- GitHub: [shehry-code/shehry_portfolio](https://github.com/shehry-code/shehry_portfolio)
- Portfolio: [shehry-portfolio.vercel.app](https://shehry-portfolio.vercel.app)

## License

Personal portfolio — all rights reserved.
