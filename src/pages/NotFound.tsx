import { Link } from "react-router-dom";
import { ArrowLeft, Terminal } from "lucide-react";
import SEO from "../components/SEO";

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found | Shehry"
        description="The page you requested could not be found."
      />
      <div className="min-h-screen pt-20 flex items-center justify-center grid-bg">
      <div className="mx-auto max-w-lg px-4 sm:px-6 text-center">
        {/* Terminal */}
        <div className="terminal mb-8 text-left">
          <div className="terminal-header">
            <div className="terminal-dot" style={{ backgroundColor: "#f87171" }} />
            <div className="terminal-dot" style={{ backgroundColor: "#fbbf24" }} />
            <div className="terminal-dot" style={{ backgroundColor: "#34d399" }} />
            <span className="ml-2 text-xs text-text-muted font-mono">error</span>
          </div>
          <div className="terminal-body text-sm">
            <div className="text-text-muted">
              <span className="text-green">$</span> <span className="text-text-secondary">cd /requested-page</span>
            </div>
            <div className="text-red mt-1">
              bash: cd: /requested-page: No such file or directory
            </div>
            <div className="text-text-muted mt-3">
              <span className="text-green">$</span> <span className="text-text-secondary">echo $?</span>
            </div>
            <div className="text-yellow mt-1">1</div>
            <div className="text-text-muted mt-3">
              <span className="text-green">$</span> <span className="cursor-blink text-accent">▊</span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Terminal size={24} className="text-accent" />
          <h1 className="text-4xl font-bold font-mono text-text-primary">404</h1>
        </div>

        <p className="text-text-secondary mb-2">
          The requested address does not exist.
        </p>
        <p className="text-sm text-text-muted mb-8">
          This page may have been moved, deleted, or never existed.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-bg-primary bg-accent hover:bg-accent/90 rounded-md transition-colors"
        >
          <ArrowLeft size={14} />
          Return Home
        </Link>
      </div>
      </div>
    </>
  );
}
