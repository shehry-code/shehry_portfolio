import { useState } from "react";
import { Link } from "react-router-dom";
import { Github, ExternalLink } from "lucide-react";
import SEO from "../components/SEO";
import { projects } from "../data/content";

const categories = ["All", ...new Set(projects.map((p) => p.category))];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <>
      <SEO
        title="Projects | Shehry"
        description="Engineering projects spanning systems programming, cybersecurity, AI, and computer architecture."
      />
      <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-2">Projects</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Things I've Built
          </h1>
          <p className="text-text-secondary max-w-2xl">
            Projects spanning systems programming, cybersecurity, AI, and computer architecture. 
            Each one is a step toward understanding how computers work at every level.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter projects by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-colors ${
                activeCategory === cat
                  ? "border-accent/30 text-accent bg-accent-glow"
                  : "border-border text-text-muted hover:text-text-primary hover:border-border-hover"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((project) => (
            <div
              key={project.slug}
              className="group p-5 rounded-lg border border-border bg-bg-card hover:border-accent/20 transition-all"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <Link
                  to={`/projects/${project.slug}`}
                  className="min-w-0 text-base font-semibold text-text-primary group-hover:text-accent transition-colors"
                >
                  {project.title}
                </Link>
                <span className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${
                  project.status === "Active" ? "border-green/30 text-green" :
                  project.status === "Planned" ? "border-yellow/30 text-yellow" :
                  project.status === "Coming Soon" ? "border-purple/30 text-purple" :
                  "border-text-muted/30 text-text-muted"
                }`}>
                  {project.status}
                </span>
              </div>

              <p className="text-sm text-text-muted mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.technologies.map((tech) => (
                  <span key={tech} className="text-xs px-2 py-0.5 rounded bg-bg-tertiary text-text-muted font-mono">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <span className="text-xs text-accent font-mono">{project.category}</span>
                <span className="text-xs text-text-muted">{project.date}</span>
                <div className="ml-auto flex gap-2">
                  {project.github?.trim() && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-text-muted hover:text-accent transition-colors"
                      aria-label={`${project.title} GitHub`}
                    >
                      <Github size={14} />
                    </a>
                  )}
                  {project.demo?.trim() && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-text-muted hover:text-accent transition-colors"
                      aria-label={`${project.title} Demo`}
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
}
