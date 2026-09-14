import { Link } from "react-router-dom";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { profile } from "../data/content";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center grid-bg">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text Content */}
          <div className="animate-fade-in">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-xs font-mono text-accent border border-accent/20 rounded-full bg-accent-glow">
                {profile.title}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-4 tracking-tight">
              {profile.name}
            </h1>

            <p className="text-lg sm:text-xl text-text-secondary mb-2 font-mono">
              {profile.subtitle}
            </p>

            <p className="text-base text-text-muted mb-8 max-w-lg leading-relaxed">
              {profile.tagline}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-bg-primary bg-accent hover:bg-accent/90 rounded-md transition-colors"
              >
                View Projects
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-primary border border-border hover:border-accent/30 hover:text-accent rounded-md transition-colors"
              >
                Read Blog
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
              >
                <Github size={16} />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
              >
                <Linkedin size={16} />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
              >
                <Mail size={16} />
                <span className="hidden sm:inline">Email</span>
              </a>
            </div>
          </div>

          {/* Right - Terminal */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="terminal">
              <div className="terminal-header">
                <div className="terminal-dot bg-red" style={{ backgroundColor: "#f87171" }} />
                <div className="terminal-dot bg-yellow" style={{ backgroundColor: "#fbbf24" }} />
                <div className="terminal-dot bg-green" style={{ backgroundColor: "#34d399" }} />
                <span className="ml-2 text-xs text-text-muted font-mono">~/shehry</span>
              </div>
              <div className="terminal-body">
                <div className="text-text-muted">
                  <span className="text-green">$</span> <span className="text-text-secondary">whoami</span>
                </div>
                <div className="text-text-primary mb-3">shehry</div>

                <div className="text-text-muted">
                  <span className="text-green">$</span> <span className="text-text-secondary">cat focus.txt</span>
                </div>
                <div className="text-text-secondary mb-1">→ cybersecurity</div>
                <div className="text-text-secondary mb-1">→ computer-architecture</div>
                <div className="text-text-secondary mb-1">→ systems-programming</div>
                <div className="text-text-secondary mb-3">→ reverse-engineering</div>

                <div className="text-text-muted">
                  <span className="text-green">$</span> <span className="text-text-secondary">status</span>
                </div>
                <div className="text-text-secondary mb-1">
                  <span className="text-green">●</span> learning...
                </div>
                <div className="text-text-secondary mb-1">
                  <span className="text-yellow">●</span> building...
                </div>
                <div className="text-text-secondary mb-3">
                  <span className="text-accent">●</span> researching...
                </div>

                <div className="text-text-muted">
                  <span className="text-green">$</span> <span className="cursor-blink text-accent">▊</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
