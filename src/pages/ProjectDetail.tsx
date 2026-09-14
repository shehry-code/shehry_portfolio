import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { projects } from "../data/content";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Project Not Found</h1>
          <p className="text-text-muted mb-4">The project you're looking for doesn't exist.</p>
          <Link to="/projects" className="text-accent hover:underline">← Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        {/* Back */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          All Projects
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-mono text-accent uppercase tracking-wider">{project .category}</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mt-2">{project.title}</h1>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full border whitespace-nowrap ${
              project.status === "Active" ? "border-green/30 text-green" :
              project.status === "Planned" ? "border-yellow/30 text-yellow" :
              "border-text-muted/30 text-text-muted"
            }`}>
              {project.status}
            </span>
          </div>
          <p className="text-lg text-text-secondary">{project.description}</p>

          {/* Links */}
          <div className="flex gap-3 mt-6">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-primary border border-border hover:border-accent/30 rounded-md transition-colors"
              >
                <Github size={14} />
                Source Code
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-primary border border-border hover:border-accent/30 rounded-md transition-colors"
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-10 p-5 rounded-lg border border-border bg-bg-card">
          <h3 className="text-sm font-medium text-text-primary mb-3">Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="px-3 py-1 text-xs font-mono text-accent border border-accent/20 rounded bg-accent-glow">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span className="text-accent font-mono text-sm">§</span> Overview
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {project.longDescription || project.description}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span className="text-accent font-mono text-sm">§</span> Motivation
            </h2>
            <p className="text-text-secondary leading-relaxed">
              This project was built to deepen my understanding of {project.category.toLowerCase()} 
              and to create something practical while learning. It represents hands-on exploration 
              of concepts that I'm studying theoretically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span className="text-accent font-mono text-sm">§</span> What I Learned
            </h2>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">·</span>
                Deeper understanding of {project.technologies[0]} and its practical applications
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">·</span>
                System design and architecture decisions for {project.category.toLowerCase()} projects
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">·</span>
                Debugging and problem-solving in {project.technologies.slice(0, 2).join(" and ")}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span className="text-accent font-mono text-sm">§</span> Future Improvements
            </h2>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">·</span>
                Expand functionality and add more features
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">·</span>
                Improve documentation and add more examples
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">·</span>
                Explore integration with related systems and tools
              </li>
            </ul>
          </section>
        </div>

        {/* GitHub CTA */}
        {project.github && (
          <div className="mt-12 p-6 rounded-lg border border-border bg-bg-card text-center">
            <h3 className="text-base font-semibold text-text-primary mb-2">View Source Code</h3>
            <p className="text-sm text-text-muted mb-4">
              This project is open source. Check out the repository on GitHub.
            </p>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-bg-primary bg-accent hover:bg-accent/90 rounded-md transition-colors"
            >
              <Github size={14} />
              View on GitHub
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
