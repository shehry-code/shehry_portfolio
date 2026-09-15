import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookText, Calendar, Tag } from "lucide-react";
import { notes } from "../data/content";

export default function NoteDetail() {
  const { slug } = useParams<{ slug: string }>();
  const note = notes.find((item) => item.slug === slug);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setCurrentPage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  useEffect(() => {
    if (!note || note.pages.length === 0) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setCurrentPage((previous) => Math.max(previous - 1, 0));
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setCurrentPage((previous) => Math.min(previous + 1, note.pages.length - 1));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [note]);

  if (!note) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Note Not Found</h1>
          <p className="text-text-muted mb-4">The note you're looking for doesn't exist.</p>
          <Link to="/notes" className="text-accent hover:underline">← Back to Notes</Link>
        </div>
      </div>
    );
  }

  const pageCount = note.pages.length;
  const currentPageData = note.pages[currentPage];
  const hasPages = pageCount > 0;

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <Link
          to="/notes"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to Notes
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-mono text-accent px-2 py-0.5 border border-accent/20 rounded">
              {note.category}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-text-muted">
              <Calendar size={14} />
              {new Date(note.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3 leading-tight">
            {note.title}
          </h1>
          <p className="text-lg text-text-secondary mb-4">{note.description}</p>

          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 rounded-full border border-border bg-bg-card px-2.5 py-1 text-[10px] font-mono text-text-muted">
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="rounded-2xl border border-border bg-bg-card p-4 sm:p-5">
          {hasPages && currentPageData?.image ? (
            <>
              <div className="mb-4 flex items-center justify-between gap-3 text-xs font-mono text-text-muted">
                <span>Page {currentPage + 1} / {pageCount}</span>
                <span>{note.title}</span>
              </div>

              <div className="overflow-hidden rounded-xl border border-border bg-bg-secondary p-3 sm:p-4">
                <img
                  src={currentPageData.image}
                  alt={currentPageData.alt}
                  className="mx-auto max-h-[70vh] w-full max-w-full rounded-md border border-border object-contain bg-bg-card shadow-sm"
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage((previous) => Math.max(previous - 1, 0))}
                  disabled={currentPage === 0}
                  aria-label="Previous page"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-secondary px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent/30 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft size={16} />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage((previous) => Math.min(previous + 1, pageCount - 1))}
                  disabled={currentPage >= pageCount - 1}
                  aria-label="Next page"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-secondary px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent/30 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-bg-secondary px-6 py-12 text-center">
              <BookText size={36} className="mb-4 text-accent" />
              <p className="mb-2 text-xl font-semibold text-text-primary">Handwritten pages coming soon</p>
              <p className="max-w-md text-sm leading-6 text-text-muted">
                This note is still in the study-notes archive and will show the handwritten pages here once they are added.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
