import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen } from "lucide-react";
import { notes } from "../data/content";

export default function Notes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...new Set(notes.map((n) => n.category))];

  const filtered = useMemo(() => {
    return notes
      .filter((n) => {
        if (activeCategory !== "All" && n.category !== activeCategory) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            n.title.toLowerCase().includes(q) ||
            n.description.toLowerCase().includes(q) ||
            n.tags.some((t) => t.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-2">Notes</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Engineering Knowledge Base
          </h1>
          <p className="text-text-secondary max-w-2xl">
            Short technical notes documenting concepts I'm learning. These are quick references — 
            not polished articles, but building blocks of understanding.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-bg-card border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/30 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
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
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <Link
              to={`/notes/${note.slug}`}
              key={note.slug}
              className="group p-5 rounded-lg border border-border bg-bg-card hover:border-accent/20 transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <BookOpen size={16} className="text-accent mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {note.title}
                  </h3>
                  <span className="text-xs font-mono text-accent/70">{note.category}</span>
                </div>
              </div>

              <p className="text-sm text-text-muted mb-4 line-clamp-3">
                {note.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {note.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs text-text-muted font-mono">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="text-xs text-text-muted font-mono">
                {new Date(note.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted">No notes match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
