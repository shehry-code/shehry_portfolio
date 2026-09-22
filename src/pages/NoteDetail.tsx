import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookText, Calendar, Download, RotateCcw, RotateCw, Tag, X } from "lucide-react";
import SEO from "../components/SEO";
import { notes } from "../data/content";

export default function NoteDetail() {
  const { slug } = useParams<{ slug: string }>();
  const note = notes.find((item) => item.slug === slug);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageRotations, setPageRotations] = useState<Record<number, number>>({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const imageButtonRef = useRef<HTMLButtonElement | null>(null);

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
      <>
        <SEO
          title="Note Not Found | Shehry"
          description="The requested note could not be found."
        />
        <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Note Not Found</h1>
          <p className="text-text-muted mb-4">The note you're looking for doesn't exist.</p>
          <Link to="/notes" className="text-accent hover:underline">← Back to Notes</Link>
        </div>
        </div>
      </>
    );
  }

  const pageCount = note.pages.length;
  const currentPageData = note.pages[currentPage];
  const hasPages = pageCount > 0;
  const currentRotation = pageRotations[currentPage] ?? 0;

  const rotatePage = (direction: "left" | "right") => {
    const delta = direction === "left" ? -90 : 90;
    setPageRotations((previous) => ({
      ...previous,
      [currentPage]: ((previous[currentPage] ?? 0) + delta + 360) % 360,
    }));
  };

  const resetPageRotation = () => {
    setPageRotations((previous) => ({
      ...previous,
      [currentPage]: 0,
    }));
  };

  const handleDownload = () => {
    if (!currentPageData?.image) return;

    const link = document.createElement("a");
    const fileName = currentPageData.image.split("/").pop() || `${note.slug}-page-${currentPage + 1}.jpg`;
    link.href = currentPageData.image;
    link.download = fileName;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (!isLightboxOpen) {
      imageButtonRef.current?.focus();
      return;
    }

    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isLightboxOpen]);

  return (
    <>
      <SEO
        title={`${note.title} | Shehry`}
        description={note.description}
      />
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

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => rotatePage("left")}
                    aria-label="Rotate page left"
                    title="Rotate page left"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-bg-secondary text-text-primary transition-colors hover:border-accent/30 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card"
                  >
                    <RotateCcw size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => rotatePage("right")}
                    aria-label="Rotate page right"
                    title="Rotate page right"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-bg-secondary text-text-primary transition-colors hover:border-accent/30 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card"
                  >
                    <RotateCw size={16} />
                  </button>

                  {currentRotation !== 0 && (
                    <button
                      type="button"
                      onClick={resetPageRotation}
                      aria-label="Reset page rotation"
                      title="Reset page rotation"
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-secondary px-2.5 py-2 text-xs font-medium text-text-primary transition-colors hover:border-accent/30 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card"
                    >
                      <RotateCcw size={14} />
                      Reset
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleDownload}
                    aria-label="Download page image"
                    title="Download page image"
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-secondary px-2.5 py-2 text-xs font-medium text-text-primary transition-colors hover:border-accent/30 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card"
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>

                <div className="text-xs font-mono text-text-muted">
                  Rotation: {currentRotation}°
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-border bg-bg-secondary p-3 sm:p-4">
                <div className="flex max-w-full items-center justify-center overflow-hidden rounded-md">
                  <button
                    type="button"
                    ref={imageButtonRef}
                    onClick={() => setIsLightboxOpen(true)}
                    aria-label={`Open ${currentPageData.alt} in full size`}
                    title="Click to enlarge"
                    className="group block w-full cursor-zoom-in rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card"
                  >
                    <img
                      src={currentPageData.image}
                      alt={currentPageData.alt}
                      style={{
                        transform: `rotate(${currentRotation}deg)`,
                        transition: "transform 180ms ease-in-out",
                        transformOrigin: "center center",
                      }}
                      className="mx-auto max-h-[70vh] max-w-full rounded-md border border-border object-contain bg-bg-card shadow-sm"
                    />
                    <span className="mt-2 inline-flex items-center text-[11px] font-medium text-text-muted transition-colors group-hover:text-accent">
                      Click to enlarge
                    </span>
                  </button>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage((previous) => Math.max(previous - 1, 0))}
                  disabled={currentPage === 0}
                  aria-label="Previous page"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-secondary px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent/30 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card"
                >
                  <ArrowLeft size={16} />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage((previous) => Math.min(previous + 1, pageCount - 1))}
                  disabled={currentPage >= pageCount - 1}
                  aria-label="Next page"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-secondary px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent/30 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card"
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

      {isLightboxOpen && currentPageData?.image ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={currentPageData.alt}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-md border border-border bg-bg-card p-2 sm:p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleDownload}
                aria-label="Download image"
                title="Download image"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-secondary px-2.5 py-2 text-xs font-medium text-text-primary transition-colors hover:border-accent/30 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card"
              >
                <Download size={14} />
                Download
              </button>

              <button
                type="button"
                ref={closeButtonRef}
                onClick={() => setIsLightboxOpen(false)}
                aria-label="Close image viewer"
                title="Close image viewer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-bg-secondary text-text-primary transition-colors hover:border-accent/30 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex max-h-[80vh] max-w-[85vw] items-center justify-center overflow-hidden rounded-md bg-bg-secondary p-2 sm:p-3">
              <img
                src={currentPageData.image}
                alt={currentPageData.alt}
                style={{
                  transform: `rotate(${currentRotation}deg)`,
                  transition: "transform 180ms ease-in-out",
                  transformOrigin: "center center",
                }}
                className="max-h-[80vh] max-w-[85vw] rounded-md border border-border object-contain bg-bg-card shadow-sm"
              />
            </div>
          </div>
        </div>
      ) : null}
      </div>
    </>
  );
}
