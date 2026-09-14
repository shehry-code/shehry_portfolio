import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Terminal } from "lucide-react";
import { profile } from "../data/content";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-primary">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-mono text-sm font-semibold text-text-primary mb-3">
              <Terminal size={14} className="text-accent" />
              <span>{profile.name}</span>
            </Link>
            <p className="text-sm text-text-muted">
              {profile.subtitle}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-3">Navigation</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { to: "/projects", label: "Projects" },
                { to: "/blog", label: "Blog" },
                { to: "/notes", label: "Notes" },
                { to: "/research", label: "Research" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-text-muted hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-3">Connect</h4>
            <div className="flex gap-3">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="p-2 rounded-md border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-text-muted">
            © 2026 {profile.name}. Built with curiosity.
          </p>
          <p className="text-xs text-text-muted font-mono">
            v1.0.0
          </p>
        </div>
      </div>
    </footer>
  );
}
