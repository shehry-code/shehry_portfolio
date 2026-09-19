import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowDown, ArrowLeft, ArrowUp, Pencil, Save, Trash2, Upload } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import type { NotePage } from "../data/content";

export default function AdminNotePages() {
  const { slug = "" } = useParams<{ slug: string }>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pages, setPages] = useState<NotePage[]>([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [uploadAlt, setUploadAlt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadNote = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/content/notes/${encodeURIComponent(slug)}`);
        const payload = await response.json();
        if (!response.ok || !payload.ok) throw new Error(payload.error || "Unable to load note.");
        if (!cancelled) {
          setNoteTitle(payload.note.title);
          setPages(payload.note.pages);
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Unable to load note.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    loadNote();
    return () => { cancelled = true; };
  }, [slug]);

  const savePages = async (nextPages: NotePage[]) => {
    setIsBusy(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`http://localhost:3001/api/content/notes/${encodeURIComponent(slug)}/pages`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages: nextPages }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Unable to save pages.");
      setPages(payload.pages);
      setSuccess("Page changes saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save pages.");
    } finally {
      setIsBusy(false);
    }
  };

  const movePage = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= pages.length) return;
    const nextPages = [...pages];
    [nextPages[index], nextPages[targetIndex]] = [nextPages[targetIndex], nextPages[index]];
    setPages(nextPages);
    void savePages(nextPages);
  };

  const updateAlt = (index: number, alt: string) => {
    setPages((current) => current.map((page, pageIndex) => pageIndex === index ? { ...page, alt } : page));
  };

  const handleAltBlur = () => {
    void savePages(pages);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsBusy(true);
    setError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("image", file);
    formData.append("alt", uploadAlt.trim() || file.name);

    try {
      const response = await fetch(`http://localhost:3001/api/content/notes/${encodeURIComponent(slug)}/pages`, {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Unable to upload page.");
      setPages((current) => [...current, payload.page]);
      setUploadAlt("");
      setSuccess("Page uploaded.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload page.");
    } finally {
      setIsBusy(false);
    }
  };

  const removePage = async (page: NotePage) => {
    if (!page.image || !window.confirm("Remove this handwritten page?")) return;
    setIsBusy(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`http://localhost:3001/api/content/notes/${encodeURIComponent(slug)}/pages`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: page.image }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Unable to remove page.");
      setPages((current) => current.filter((currentPage) => currentPage.image !== page.image));
      setSuccess(payload.warning || "Page removed.");
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Unable to remove page.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <AdminLayout title="Note Pages" description={noteTitle ? `Manage handwritten pages for ${noteTitle}.` : "Manage handwritten note pages."}>
      <div className="space-y-6">
        {error ? <div className="rounded-lg border border-red/35 bg-red/10 p-3 text-sm text-red">{error}</div> : null}
        {success ? <div className="rounded-lg border border-green/35 bg-green/10 p-3 text-sm text-green">{success}</div> : null}

        {isLoading ? <p className="text-sm text-text-muted">Loading note pages...</p> : (
          <>
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-bg-secondary p-4 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1 space-y-2">
                <label htmlFor="page-alt" className="text-sm font-medium text-text-primary">Alt text for new page</label>
                <input id="page-alt" value={uploadAlt} onChange={(event) => setUploadAlt(event.target.value)} placeholder="Describe the handwritten page" className="w-full rounded-md border border-border bg-bg-card px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent/30 focus:outline-none" />
              </div>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload} className="sr-only" />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isBusy} className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-3 py-2.5 text-sm font-medium text-bg-primary transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60">
                <Upload size={14} />
                Add page
              </button>
            </div>

            {pages.length === 0 ? <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-text-muted">No handwritten pages yet.</div> : (
              <div className="space-y-3">
                {pages.map((page, index) => (
                  <article key={`${page.image || "page"}-${index}`} className="flex flex-col gap-4 rounded-lg border border-border bg-bg-secondary p-4 sm:flex-row">
                    <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-bg-card sm:w-40">
                      {page.image ? <img src={page.image} alt={page.alt} className="h-full w-full object-contain" /> : <span className="text-xs text-text-muted">No image</span>}
                    </div>
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-3 text-xs font-mono text-text-muted"><span>Page {index + 1}</span><span className="truncate">{page.image || "No image path"}</span></div>
                      <input value={page.alt} onChange={(event) => updateAlt(index, event.target.value)} onBlur={handleAltBlur} aria-label={`Alt text for page ${index + 1}`} className="w-full rounded-md border border-border bg-bg-card px-3 py-2.5 text-sm text-text-primary focus:border-accent/30 focus:outline-none" />
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => movePage(index, -1)} disabled={index === 0 || isBusy} aria-label="Move page up" title="Move page up" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-primary hover:border-accent/30 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"><ArrowUp size={14} /></button>
                        <button type="button" onClick={() => movePage(index, 1)} disabled={index === pages.length - 1 || isBusy} aria-label="Move page down" title="Move page down" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-primary hover:border-accent/30 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"><ArrowDown size={14} /></button>
                        <button type="button" onClick={() => removePage(page)} disabled={isBusy} className="inline-flex items-center gap-2 rounded-md border border-red/40 bg-red/10 px-3 py-2 text-xs font-medium text-red hover:border-red/60 disabled:cursor-not-allowed disabled:opacity-40"><Trash2 size={13} />Remove</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
              <Link to="/admin/notes" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent"><ArrowLeft size={14} />Back to notes</Link>
              <div className="flex flex-wrap items-center gap-2"><Link to={`/admin/notes/${encodeURIComponent(slug)}/edit`} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-text-primary hover:border-accent/30 hover:text-accent"><Pencil size={14} />Edit note</Link><button type="button" onClick={() => savePages(pages)} disabled={isBusy} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-text-primary hover:border-accent/30 hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"><Save size={14} />Save pages</button></div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
