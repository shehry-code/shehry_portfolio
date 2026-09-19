import { useState } from "react";
import { Link } from "react-router-dom";
import { BookText, Image, Pencil, Plus, Trash2 } from "lucide-react";
import { notes } from "../data/content";
import AdminLayout from "../components/AdminLayout";

export default function AdminNotes() {
  const [visibleNotes, setVisibleNotes] = useState(() => [...notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const deleteNote = async (note: typeof notes[number]) => {
    if (!window.confirm(`Delete the note "${note.title}"? This also removes its handwritten page images.`)) return;
    setFeedback("");
    setError("");
    try {
      const response = await fetch(`http://localhost:3001/api/content/notes/${encodeURIComponent(note.slug)}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Unable to delete note.");
      setVisibleNotes((current) => current.filter((currentNote) => currentNote.slug !== note.slug));
      setFeedback(`Deleted "${note.title}" successfully.`);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete note.");
    }
  };

  return (
    <AdminLayout
      title="Notes"
      description="Current handwritten notes tracked by the portfolio content model. This page is read-only for Phase 1 and keeps the public notes experience unchanged."
      actions={
        <Link to="/admin/notes/new" className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-bg-primary transition-colors hover:bg-accent/90">
          <Plus size={14} />
          New Note
        </Link>
      }
    >
      <div className="space-y-4">
        {error ? <div className="rounded-lg border border-red/35 bg-red/10 p-3 text-sm text-red">{error}</div> : null}
        {feedback ? <div className="rounded-lg border border-green/35 bg-green/10 p-3 text-sm text-green">{feedback}</div> : null}
        {visibleNotes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-bg-secondary p-8 text-center text-text-muted">
            No notes found.
          </div>
        ) : (
          visibleNotes.map((note) => (
            <article key={note.slug} className="rounded-lg border border-border bg-bg-secondary p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-[0.12em] text-text-muted">
                    <span>{note.category}</span>
                    <span>{note.pages.length} pages</span>
                  </div>
                  <h2 className="text-lg font-semibold text-text-primary">{note.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{note.description}</p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
                  <BookText size={14} />
                  {note.slug}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-xs text-text-muted">
                <span>{new Date(note.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                <span>{note.tags.join(", ") || "No tags"}</span>
                <Link to={`/admin/notes/${encodeURIComponent(note.slug)}/edit`} className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-medium text-text-primary transition-colors hover:border-accent/30 hover:text-accent">
                  <Pencil size={12} />
                  Edit
                </Link>
                <Link to={`/admin/notes/${encodeURIComponent(note.slug)}/pages`} className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-medium text-text-primary transition-colors hover:border-accent/30 hover:text-accent">
                  <Image size={12} />
                  Manage pages
                </Link>
                <button type="button" onClick={() => void deleteNote(note)} className="inline-flex items-center gap-1.5 rounded-md border border-red/40 bg-red/10 px-2.5 py-1.5 font-medium text-red transition-colors hover:border-red/60">
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
