import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, BookText, Search } from "lucide-react";
import SEO from "../components/SEO";
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
            n.tags.some((t) => t.toLowerCase().includes(q)) ||
            n.category.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchQuery, activeCategory]);

  return (
    <>
      <SEO
        title="Notes | Shehry"
        description="Handwritten technical notes and study pages focused on digital logic, computer architecture, networking, and systems understanding."
      />
      <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-10">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-2">Notes</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Handwritten Study Notes
          </h1>
          <p className="text-text-secondary max-w-2xl">
            Personal engineering notes and study pages — the working material behind the concepts I am learning.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <label htmlFor="notes-search" className="sr-only">Search notes</label>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              id="notes-search"
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-bg-card border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/30 transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter notes by category">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((note) => {
            const pageCount = note.pages.length;
            const firstPage = note.pages[0];

            return (
              <Link
                to={`/notes/${note.slug}`}
                key={note.slug}
                className="group block overflow-hidden rounded-xl border border-border bg-bg-card transition-all hover:-translate-y-0.5 hover:border-accent/25"
              >
                <div className="aspect-[4/3] border-b border-border bg-bg-secondary p-3">
                  {firstPage?.image ? (
                    <img
                      src={firstPage.image}
                      alt={firstPage.alt}
                      className="h-full w-full rounded-md border border-border object-cover bg-bg-tertiary shadow-sm"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-md border border-dashed border-border bg-bg-card/60 text-center text-text-muted">
                      <BookText size={28} className="mb-3 text-accent" />
                      <p className="text-sm font-medium text-text-secondary">Handwritten pages coming soon</p>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-start gap-3">
                    <BookOpen size={16} className="mt-0.5 shrink-0 text-accent" />
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-text-primary group-hover:text-accent transition-colors">
                        {note.title}
                      </h3>
                      <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-accent/80">
                        {note.category}
                      </span>
                    </div>
                  </div>

                  <p className="mb-4 text-sm leading-6 text-text-muted">
                    {note.description}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full border border-border bg-bg-secondary px-2 py-1 text-[10px] font-mono text-text-muted">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-border pt-3 text-xs font-mono text-text-muted">
                    <span>
                      {new Date(note.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span>{pageCount > 0 ? `${pageCount} pages` : "Draft notes"}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-text-muted">No notes match your search.</p>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
