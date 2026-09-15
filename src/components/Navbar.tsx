import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Moon, Sun, Terminal, X } from "lucide-react";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/projects", label: "Projects" },
  { path: "/blog", label: "Blog" },
  { path: "/notes", label: "Notes" },
  { path: "/research", label: "Research" },
  { path: "/work", label: "Work" },
  { path: "/contact", label: "Contact" },
];

export default function Navbar({
  theme,
  onToggleTheme,
}: {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isDarkMode = theme === "dark";
  const themeLabel = isDarkMode ? "Switch to light mode" : "Switch to dark mode";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-mono text-sm font-semibold text-text-primary hover:text-accent transition-colors"
          >
            <Terminal size={16} className="text-accent" />
            <span>shehry</span>
            <span className="text-text-muted hidden sm:inline">~</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  location.pathname === link.path
                    ? "text-accent bg-accent-glow"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={onToggleTheme}
              className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-bg-card/80 text-text-secondary transition-colors hover:border-accent/30 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              aria-label={themeLabel}
              title={themeLabel}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-bg-card/80 text-text-secondary transition-colors hover:border-accent/30 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              aria-label={themeLabel}
              title={themeLabel}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden border-t border-border bg-bg-primary/95 backdrop-blur-md"
        >
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                  location.pathname === link.path
                    ? "text-accent bg-accent-glow"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
