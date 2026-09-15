import { Link } from "react-router-dom";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { currentFocus, profile } from "../data/content";

export default function Hero() {
  return (
    <section className="relative flex min-h-[88vh] items-center grid-bg">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="hero-layout">
          <div className="animate-fade-in hero-copy">
            <div className="mb-5">
              <span className="hero-badge">{profile.title}</span>
            </div>

            <h1 className="hero-title">
              <span>Computer Science</span>
              <span className="hero-subtitle">Systems • Security</span>
            </h1>

            <p className="hero-intro">
              Studying computers from the hardware up — from transistors and logic, through CPU architecture and systems, to security and software.
            </p>

            <div className="flex flex-wrap gap-3 pb-8 pt-2">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg-primary transition-colors hover:bg-accent/90"
              >
                View Projects
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent/30 hover:text-accent"
              >
                Read Blog
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 pb-8" aria-label="Current focus areas">
              {currentFocus.map((item) => (
                <span key={item.label} className="hero-chip">
                  {item.label}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="social-link"
              >
                <Github size={16} />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="social-link"
              >
                <Linkedin size={16} />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="social-link"
              >
                <Mail size={16} />
                <span className="hidden sm:inline">Email</span>
              </a>
            </div>
          </div>

          <div className="animate-fade-in hero-terminal-wrap" style={{ animationDelay: "0.15s" }}>
            <div className="terminal hero-terminal" aria-label="Terminal with current focus and status">
              <div className="terminal-header">
                <div className="terminal-dot" style={{ backgroundColor: "#f87171" }} />
                <div className="terminal-dot" style={{ backgroundColor: "#fbbf24" }} />
                <div className="terminal-dot" style={{ backgroundColor: "#34d399" }} />
                <span className="ml-2 text-xs font-mono text-text-muted">~/shehry</span>
              </div>

              <div className="terminal-body">
                <div className="terminal-line">
                  <span className="terminal-prompt">$</span>
                  <span className="terminal-command">whoami</span>
                </div>
                <div className="terminal-output mb-3">shehry</div>

                <div className="terminal-line">
                  <span className="terminal-prompt">$</span>
                  <span className="terminal-command">cat focus.txt</span>
                </div>
                <div className="terminal-output">→ cybersecurity</div>
                <div className="terminal-output">→ computer architecture</div>
                <div className="terminal-output">→ systems programming</div>
                <div className="terminal-output mb-3">→ reverse engineering</div>

                <div className="terminal-line">
                  <span className="terminal-prompt">$</span>
                  <span className="terminal-command">status</span>
                </div>
                <div className="terminal-output">
                  <span className="text-green">●</span> learning...
                </div>
                <div className="terminal-output">
                  <span className="text-yellow">●</span> building...
                </div>
                <div className="terminal-output mb-3">
                  <span className="text-accent">●</span> researching...
                </div>

                <div className="terminal-line">
                  <span className="terminal-prompt">$</span>
                  <span className="cursor-blink text-accent">▊</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
