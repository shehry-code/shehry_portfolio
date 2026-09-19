import { useEffect, useState } from "react";
import { ArrowLeft, Image, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

interface NoteForm {
  title: string;
  slug: string;
  description: string;
  date: string;
  category: string;
  tags: string;
}

const emptyForm: NoteForm = { title: "", slug: "", description: "", date: "", category: "", tags: "" };

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const validateSlug = (value: string) => !value.trim() ? "Slug is required." : /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.trim()) ? "" : "Use lowercase letters, numbers, and hyphens only.";

export default function AdminEditNote() {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<NoteForm>(emptyForm);
  const [slugEdited, setSlugEdited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    const loadNote = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/content/notes/${encodeURIComponent(slug)}`);
        const payload = await response.json();
        if (!response.ok || !payload.ok) throw new Error(payload.error || "Unable to load note.");
        if (!cancelled) {
          setForm({ title: payload.note.title, slug: payload.note.slug, description: payload.note.description, date: payload.note.date, category: payload.note.category, tags: payload.note.tags.join(", ") });
          setSlugEdited(false);
        }
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : "Unable to load note.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    loadNote();
    return () => { cancelled = true; };
  }, [slug]);

  const errors = {
    title: !form.title.trim() ? "Title is required." : "",
    slug: validateSlug(form.slug),
    description: !form.description.trim() ? "Description is required." : "",
    date: !form.date || Number.isNaN(Date.parse(form.date)) ? "Date must be valid." : "",
    category: !form.category.trim() ? "Category is required." : "",
  };
  const showError = (field: keyof typeof errors) => touched[field] && errors[field];
  const update = (field: keyof NoteForm, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ title: true, slug: true, description: true, date: true, category: true });
    if (Object.values(errors).some(Boolean)) {
      setSubmitError("Please fix the highlighted fields before saving.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");
    try {
      const response = await fetch(`http://localhost:3001/api/content/notes/${encodeURIComponent(slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.title.trim(), slug: form.slug.trim(), description: form.description.trim(), date: form.date, category: form.category.trim(), tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean) }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Unable to update note.");
      setSubmitSuccess("Note updated successfully.");
      setTimeout(() => navigate("/admin/notes"), 250);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to update note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <AdminLayout title="Edit Note" description="Loading note metadata..."><p className="text-sm text-text-muted">Loading note...</p></AdminLayout>;
  if (loadError) return <AdminLayout title="Edit Note" description="The requested note could not be loaded."><div className="space-y-4"><div className="rounded-lg border border-red/35 bg-red/10 p-3 text-sm text-red">{loadError}</div><Link to="/admin/notes" className="text-sm text-accent hover:underline">Back to notes</Link></div></AdminLayout>;

  return (
    <AdminLayout title="Edit Note" description="Update note metadata separately from handwritten page management." actions={<Link to={`/admin/notes/${encodeURIComponent(slug)}/pages`} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-text-primary hover:border-accent/30 hover:text-accent"><Image size={14} />Manage pages</Link>}>
      <div className="space-y-6">
        {submitError ? <div className="rounded-lg border border-red/35 bg-red/10 p-3 text-sm text-red">{submitError}</div> : null}
        {submitSuccess ? <div className="rounded-lg border border-green/35 bg-green/10 p-3 text-sm text-green">{submitSuccess}</div> : null}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2"><Field label="Title" id="note-title" value={form.title} error={showError("title")} onBlur={() => setTouched((current) => ({ ...current, title: true }))} onChange={(value) => setForm((current) => ({ ...current, title: value, slug: slugEdited ? current.slug : slugify(value) }))} /><Field label="Slug" id="note-slug" value={form.slug} error={showError("slug")} onBlur={() => setTouched((current) => ({ ...current, slug: true }))} onChange={(value) => { setSlugEdited(true); update("slug", value); }} /></div>
          <div className="space-y-2"><label htmlFor="note-description" className="text-sm font-medium text-text-primary">Description</label><textarea id="note-description" value={form.description} onBlur={() => setTouched((current) => ({ ...current, description: true }))} onChange={(event) => update("description", event.target.value)} rows={3} className={`w-full rounded-md border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary focus:outline-none ${showError("description") ? "border-red/40" : "border-border focus:border-accent/30"}`} />{showError("description") ? <p className="text-xs text-red">{errors.description}</p> : null}</div>
          <div className="grid gap-5 md:grid-cols-3"><Field label="Date" id="note-date" type="date" value={form.date} error={showError("date")} onBlur={() => setTouched((current) => ({ ...current, date: true }))} onChange={(value) => update("date", value)} /><Field label="Category" id="note-category" value={form.category} error={showError("category")} onBlur={() => setTouched((current) => ({ ...current, category: true }))} onChange={(value) => update("category", value)} /><Field label="Tags" id="note-tags" value={form.tags} onChange={(value) => update("tags", value)} /></div>
          <p className="text-sm text-text-muted">Pages and images stay with the page manager, including when this note's slug changes.</p>
          <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between"><Link to="/admin/notes" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent"><ArrowLeft size={14} />Back to notes</Link><button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-bg-primary hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"><Save size={14} />{isSubmitting ? "Saving..." : "Save changes"}</button></div>
        </form>
      </div>
    </AdminLayout>
  );
}

interface FieldProps { label: string; id: string; value: string; type?: string; error?: string | boolean; onBlur?: () => void; onChange: (value: string) => void; }
function Field({ label, id, value, type = "text", error, onBlur, onChange }: FieldProps) {
  return <div className="space-y-2"><label htmlFor={id} className="text-sm font-medium text-text-primary">{label}</label><input id={id} type={type} value={value} onBlur={onBlur} onChange={(event) => onChange(event.target.value)} className={`w-full rounded-md border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary focus:outline-none ${error ? "border-red/40" : "border-border focus:border-accent/30"}`} />{error ? <p className="text-xs text-red">{error}</p> : null}</div>;
}
