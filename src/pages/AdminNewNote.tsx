import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

const initialForm = {
  title: "",
  slug: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  category: "",
  tags: "",
  pages: "[]",
};

const slugify = (value: string) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .slice(0, 80);

const validateSlug = (value: string) => {
  if (!value.trim()) return "Slug is required.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.trim())) return "Use lowercase letters, numbers, and hyphens only.";
  return "";
};

export default function AdminNewNote() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [slugEdited, setSlugEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const errors = {
    title: !form.title.trim() ? "Title is required." : "",
    slug: validateSlug(form.slug),
    description: !form.description.trim() ? "Description is required." : "",
    date: !form.date || Number.isNaN(Date.parse(form.date)) ? "Date must be valid." : "",
    category: !form.category.trim() ? "Category is required." : "",
    pages: (() => {
      try {
        const pages = JSON.parse(form.pages);
        return Array.isArray(pages) && pages.every((page) => page && typeof page === "object" && typeof page.alt === "string" && (page.image === undefined || typeof page.image === "string"))
          ? ""
          : "Pages must be a JSON array of objects with alt and optional image fields.";
      } catch {
        return "Pages must be valid JSON.";
      }
    })(),
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (Object.values(errors).some(Boolean)) {
      setSubmitError("Please fix the highlighted fields before saving.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const response = await fetch("http://localhost:3001/api/content/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          slug: form.slug.trim(),
          description: form.description.trim(),
          date: form.date,
          category: form.category.trim(),
          tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          pages: JSON.parse(form.pages),
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Unable to create note.");
      setSubmitSuccess("Note created successfully.");
      setTimeout(() => navigate("/admin/notes"), 250);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to create note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="New Note"
      description="Create a note using the existing portfolio content model. Image uploads and page management will be added in a later phase."
    >
      <div className="space-y-6">
        {submitError ? <div className="rounded-lg border border-red/35 bg-red/10 p-3 text-sm text-red">{submitError}</div> : null}
        {submitSuccess ? <div className="rounded-lg border border-green/35 bg-green/10 p-3 text-sm text-green">{submitSuccess}</div> : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="note-title" className="text-sm font-medium text-text-primary">Title</label>
              <input id="note-title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value, slug: slugEdited ? current.slug : slugify(event.target.value) }))} className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent/30 focus:outline-none" placeholder="Note title" />
            </div>
            <div className="space-y-2">
              <label htmlFor="note-slug" className="text-sm font-medium text-text-primary">Slug</label>
              <input id="note-slug" value={form.slug} onChange={(event) => { setSlugEdited(true); setForm((current) => ({ ...current, slug: event.target.value })); }} className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent/30 focus:outline-none" placeholder="note-slug" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="note-description" className="text-sm font-medium text-text-primary">Description</label>
            <textarea id="note-description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent/30 focus:outline-none" placeholder="What is this note about?" />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="note-date" className="text-sm font-medium text-text-primary">Date</label>
              <input id="note-date" type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary focus:border-accent/30 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label htmlFor="note-category" className="text-sm font-medium text-text-primary">Category</label>
              <input id="note-category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent/30 focus:outline-none" placeholder="Computer Architecture" />
            </div>
            <div className="space-y-2">
              <label htmlFor="note-tags" className="text-sm font-medium text-text-primary">Tags</label>
              <input id="note-tags" value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent/30 focus:outline-none" placeholder="cpu, assembly" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-text-primary">Pages</label>
              <span className="text-xs text-text-muted">Add pages after creating the note.</span>
            </div>

            <div className="space-y-2">
              <p className="text-sm leading-6 text-text-muted">This note will be created with no pages. Use the page manager from the Notes list to upload, reorder, edit alt text, or remove handwritten pages.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/admin/notes" className="text-sm text-text-muted transition-colors hover:text-accent">Back to notes</Link>
            <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-bg-primary transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60">
              <Save size={14} />
              {isSubmitting ? "Saving..." : "Create note"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
