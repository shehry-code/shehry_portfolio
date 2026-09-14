# Shehry — Personal Engineering Portfolio

A personal engineering portfolio and technical blog built with React, TypeScript, and Tailwind CSS.

## Overview

This is a long-term personal platform for documenting projects, writing technical articles, maintaining an engineering knowledge base, and showcasing research in computer science, cybersecurity, and systems engineering.

## Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Tailwind CSS v4** — Styling
- **React Router** — Client-side routing
- **React Markdown** — Blog content rendering
- **Lucide React** — Icons
- **Vite** — Build tool

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── App.tsx              # Main app with routing
├── main.tsx             # Entry point
├── index.css            # Global styles + Tailwind
├── components/
│   ├── Navbar.tsx       # Navigation bar
│   ├── Footer.tsx       # Site footer
│   ├── Hero.tsx         # Homepage hero section
│   └── SearchModal.tsx  # Global search (⌘K)
├── data/
│   └── content.ts       # All site content (projects, blog, notes, etc.)
└── pages/
    ├── Home.tsx         # Homepage
    ├── About.tsx        # About page
    ├── Projects.tsx     # Projects listing
    ├── ProjectDetail.tsx # Individual project page
    ├── Blog.tsx         # Blog listing
    ├── BlogPost.tsx     # Individual blog post
    ├── Notes.tsx        # Notes/knowledge base
    ├── Research.tsx     # Research & experiments
    ├── Work.tsx         # Work experience
    ├── Contact.tsx      # Contact page
    └── NotFound.tsx     # 404 page
```

## How to Add Content

All content is managed through `src/data/content.ts`. This makes it easy to add new content without modifying components.

### Add a New Project

Open `src/data/content.ts` and add to the `projects` array:

```typescript
{
  slug: "my-new-project",
  title: "My New Project",
  description: "Short description of the project.",
  longDescription: "Detailed description...",
  technologies: ["Tech1", "Tech2"],
  category: "Systems",
  status: "Active", // "Active" | "Completed" | "Planned" | "Coming Soon"
  github: "https://github.com/...",
  demo: "https://...",
  featured: true,
  date: "2026",
}
```

### Add a New Blog Post

Add to the `blogPosts` array:

```typescript
{
  slug: "my-blog-post",
  title: "My Blog Post Title",
  description: "Short description for listing.",
  date: "2026-01-15",
  tags: ["Tag1", "Tag2"],
  category: "Computer Architecture",
  featured: false,
  draft: false,
  readingTime: 5,
  content: `
## Introduction

Your markdown content here...

## Code Example

\`\`\`c
int main() {
    return 0;
}
\`\`\`
  `,
}
```

Blog posts support full Markdown including:
- Headings, paragraphs, lists
- Code blocks with syntax context
- Tables
- Blockquotes
- Links and images
- GFM (GitHub Flavored Markdown)

### Add a New Note

Add to the `notes` array:

```typescript
{
  slug: "my-note",
  title: "Note Title",
  description: "Brief description.",
  date: "2026-01-15",
  tags: ["Tag1"],
  category: "Computer Architecture",
  content: `Note content in markdown...`,
}
```

### Add Research

Add to the `researchItems` array:

```typescript
{
  slug: "my-research",
  title: "Research Title",
  description: "Description.",
  date: "2026",
  status: "Idea", // "Idea" | "In Progress" | "Completed" | "Planned"
  tags: ["Security"],
  category: "Security Research",
  motivation: "Why this matters.",
  method: "How I'm approaching this.",
  currentStatus: "What I've done so far.",
  github: "https://github.com/...",
}
```

### Update Personal Information

Edit the `profile` object at the top of `src/data/content.ts`:

```typescript
export const profile = {
  name: "Your Name",
  title: "Your Title",
  subtitle: "Your Focus Areas",
  tagline: "Your tagline",
  description: "Your description",
  email: "your@email.com",
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
};
```

### Update Skills

Edit the `skills` array:

```typescript
{
  category: "Category Name",
  skills: [
    { name: "Skill Name", level: "comfortable" }, // "comfortable" | "learning" | "familiar"
  ],
}
```

### Update Timeline

Edit the `timeline` array:

```typescript
{
  year: "2026",
  title: "What happened",
  items: ["Detail 1", "Detail 2"],
}
```

## Features

- **Dark theme** with terminal/systems aesthetic
- **Responsive design** (mobile, tablet, desktop)
- **Global search** (⌘K / Ctrl+K) across all content
- **Blog system** with markdown, tags, categories, search
- **Project showcase** with filtering and detail pages
- **Notes/Knowledge base** with categorization
- **Research section** for experiments and investigations
- **Contact form** (mailto integration)
- **SEO metadata** and semantic HTML
- **Accessibility** (keyboard nav, focus states, reduced motion)
- **Performance optimized** (minimal dependencies, static generation)

## Deployment

The site builds to static files in `dist/`. Deploy to any static hosting:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag `dist/` folder or connect repo
- **GitHub Pages**: Push `dist/` to gh-pages branch
- **Any static server**: Upload `dist/` contents

## Configuration

### Contact Form

The contact form currently opens the user's email client via `mailto:`. To use a real backend:

1. Set up a form service (Formspree, Netlify Forms, etc.)
2. Update the `handleSubmit` function in `src/pages/Contact.tsx`

### GitHub Integration

Project GitHub links are configured in `src/data/content.ts`. For live GitHub API integration (stars, forks), add API calls to the project components.

## License

Personal portfolio — all rights reserved.
