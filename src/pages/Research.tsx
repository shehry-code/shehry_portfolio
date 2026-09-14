import { FlaskConical, Github } from "lucide-react";
import { researchItems } from "../data/content";

export default function Research() {
  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-2">Research</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Research & Experiments
          </h1>
          <p className="text-text-secondary max-w-2xl">
            Technical experiments and research directions I'm exploring. This section documents 
            ongoing investigations into security, architecture, and systems.
          </p>
        </div>

        {/* Research Items */}
        <div className="space-y-6">
          {researchItems.map((item) => (
            <article
              key={item.slug}
              className="p-6 rounded-lg border border-border bg-bg-card"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <FlaskConical size={20} className="text-accent mt-0.5 shrink-0" />
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">{item.title}</h2>
                    <span className="text-xs font-mono text-accent/70">{item.category}</span>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border whitespace-nowrap ${
                  item.status === "In Progress" ? "border-green/30 text-green" :
                  item.status === "Idea" ? "border-yellow/30 text-yellow" :
                  item.status === "Planned" ? "border-purple/30 text-purple" :
                  "border-text-muted/30 text-text-muted"
                }`}>
                  {item.status}
                </span>
              </div>

              <p className="text-sm text-text-muted mb-5">{item.description}</p>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-mono text-text-primary uppercase tracking-wider mb-1">
                    Motivation
                  </h3>
                  <p className="text-sm text-text-secondary">{item.motivation}</p>
                </div>

                <div>
                  <h3 className="text-xs font-mono text-text-primary uppercase tracking-wider mb-1">
                    Method
                  </h3>
                  <p className="text-sm text-text-secondary">{item.method}</p>
                </div>

                <div>
                  <h3 className="text-xs font-mono text-text-primary uppercase tracking-wider mb-1">
                    Current Status
                  </h3>
                  <p className="text-sm text-text-secondary">{item.currentStatus}</p>
                </div>
              </div>

              {/* Tags & Links */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded bg-bg-tertiary text-text-muted font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
                {item.github && (
                  <a
                    href={item.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors"
                  >
                    <Github size={12} />
                    Repository
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Note */}
        <div className="mt-10 p-4 rounded-lg border border-border bg-bg-secondary text-center">
          <p className="text-sm text-text-muted">
            This section will grow as I complete more experiments and research. 
            Each entry represents genuine exploration — nothing here is fabricated.
          </p>
        </div>
      </div>
    </div>
  );
}
