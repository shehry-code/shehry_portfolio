import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eye, FileText, Save } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AdminLayout from "../components/AdminLayout";

interface BlogForm {
  title: string;
  slug: string;
  description: string;
  date: string;
  updated: string;
  category: string;
  tags: string;
  readingTime: string;
  featured: boolean;
  draft: boolean;
  content: string;
}

const validateSlug = (value: string) => {
  if (!value.trim()) return "Slug is required.";
  const trimmed = value.trim();
  if (trimmed.includes("..") || trimmed.includes("/") || trimmed.includes("\\")) {
    return "Slug must be a safe path segment.";
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
    return "Use lowercase letters, numbers, and hyphens only.";
  }
  return "";
};

const emptyForm: BlogForm = {
  title: "",
  slug: "",
  description: "",
  date: "",
  updated: "",
  category: "",
  tags: "",
  readingTime: "",
  featured: false,
  draft: false,
  content: "",
};

export default function AdminEditBlog() {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [view, setView] = useState<"editor" | "preview">("editor");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;

    const loadBlog = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const response = await fetch(`http://localhost:3001/api/content/blogs/${encodeURIComponent(slug)}`);
        const payload = await response.json();
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || "Unable to load blog.");
        }
        if (!cancelled) {
          const blog = payload.blog;
          setForm({
            title: blog.title,
            slug: blog.slug,
            description: blog.description,
            date: blog.date,
            updated: blog.updated || "",
            category: blog.category,
            tags: blog.tags.join(", "),
            readingTime: String(blog.readingTime),
            featured: blog.featured,
            draft: blog.draft,
            content: blog.content,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Unable to load blog.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadBlog();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const errors = {
    title: !form.title.trim() ? "Title is required." : "",
    slug: validateSlug(form.slug),
    description: !form.description.trim() ? "Description is required." : "",
    date: !form.date || Number.isNaN(Date.parse(form.date)) ? "Date must be valid." : "",
    category: !form.category.trim() ? "Category is required." : "",
    readingTime: Number(form.readingTime) > 0 && Number.isInteger(Number(form.readingTime)) ? "" : "Reading time must be a positive integer.",
    content: !form.content.trim() ? "Markdown content is required." : "",
  };

  const previewContent = useMemo(() => form.content || "# Preview\n\nStart writing your post here...", [form.content]);
  const showError = (key: keyof typeof errors) => touched[key] && errors[key];
  const updateField = <K extends keyof BlogForm>(field: K, value: BlogForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const allTouched = { title: true, slug: true, description: true, date: true, category: true, readingTime: true, content: true };
    setTouched(allTouched);
    if (Object.values(errors).some(Boolean)) {
      setSubmitError("Please fix the highlighted fields before saving.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");
    try {
      const response = await fetch(`http://localhost:3001/api/content/blogs/${encodeURIComponent(slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          slug: form.slug.trim(),
          description: form.description.trim(),
          date: form.date,
          updated: new Date().toISOString().slice(0, 10),
          category: form.category.trim(),
          tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          readingTime: Number(form.readingTime),
          featured: form.featured,
          draft: form.draft,
          content: form.content,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Unable to update blog.");
      setSubmitSuccess("Blog updated successfully.");
      setTimeout(() => navigate("/admin/blogs"), 250);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to update blog.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <AdminLayout title="Edit Blog" description="Loading the complete blog entry..."><div className="text-sm text-text-muted">Loading blog...</div></AdminLayout>;
  }

  if (loadError) {
    return <AdminLayout title="Edit Blog" description="The requested blog could not be loaded."><div className="space-y-4"><div className="rounded-lg border border-red/35 bg-red/10 p-3 text-sm text-red">{loadError}</div><Link to="/admin/blogs" className="text-sm text-accent hover:underline">Back to blogs</Link></div></AdminLayout>;
  }

  return (
    <AdminLayout
      title="Edit Blog"
      description="Update the existing metadata and raw Markdown content through the local content API."
      actions={
        <>
          <button type="button" onClick={() => setView("editor")} className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${view === "editor" ? "border-accent/30 bg-accent-glow text-accent" : "border-border bg-bg-card text-text-primary hover:border-accent/30 hover:text-accent"}`}><FileText size={14} />Editor</button>
          <button type="button" onClick={() => setView("preview")} className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${view === "preview" ? "border-accent/30 bg-accent-glow text-accent" : "border-border bg-bg-card text-text-primary hover:border-accent/30 hover:text-accent"}`}><Eye size={14} />Preview</button>
        </>
      }
    >
      <div className="space-y-6">
        {submitError ? <div className="rounded-lg border border-red/35 bg-red/10 p-3 text-sm text-red">{submitError}</div> : null}
        {submitSuccess ? <div className="rounded-lg border border-green/35 bg-green/10 p-3 text-sm text-green">{submitSuccess}</div> : null}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Title" id="blog-title" value={form.title} error={showError("title")} onBlur={() => setTouched((current) => ({ ...current, title: true }))} onChange={(value) => updateField("title", value)} />
            <Field label="Slug" id="blog-slug" value={form.slug} error={showError("slug")} onBlur={() => setTouched((current) => ({ ...current, slug: true }))} onChange={(value) => updateField("slug", value)} />
          </div>
          <div className="space-y-2"><label htmlFor="blog-description" className="text-sm font-medium text-text-primary">Description</label><textarea id="blog-description" value={form.description} onBlur={() => setTouched((current) => ({ ...current, description: true }))} onChange={(event) => updateField("description", event.target.value)} rows={3} className={`w-full rounded-md border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary focus:outline-none ${showError("description") ? "border-red/40" : "border-border focus:border-accent/30"}`} />{showError("description") ? <p className="text-xs text-red">{errors.description}</p> : null}</div>
          <div className="grid gap-5 md:grid-cols-4">
            <Field label="Date" id="blog-date" type="date" value={form.date} error={showError("date")} onBlur={() => setTouched((current) => ({ ...current, date: true }))} onChange={(value) => updateField("date", value)} />
            <Field label="Category" id="blog-category" value={form.category} error={showError("category")} onBlur={() => setTouched((current) => ({ ...current, category: true }))} onChange={(value) => updateField("category", value)} />
            <Field label="Tags" id="blog-tags" value={form.tags} onChange={(value) => updateField("tags", value)} />
            <Field label="Reading Time" id="blog-reading-time" type="number" value={form.readingTime} error={showError("readingTime")} onBlur={() => setTouched((current) => ({ ...current, readingTime: true }))} onChange={(value) => updateField("readingTime", value)} />
          </div>
          <div className="flex flex-wrap gap-4"><label className="inline-flex items-center gap-2 text-sm text-text-primary"><input type="checkbox" checked={form.featured} onChange={(event) => updateField("featured", event.target.checked)} className="h-4 w-4 rounded border-border bg-bg-secondary" />Featured</label><label className="inline-flex items-center gap-2 text-sm text-text-primary"><input type="checkbox" checked={form.draft} onChange={(event) => updateField("draft", event.target.checked)} className="h-4 w-4 rounded border-border bg-bg-secondary" />Draft</label></div>
          {view === "editor" ? <div className="space-y-2"><label htmlFor="blog-markdown" className="text-sm font-medium text-text-primary">Markdown Content</label><textarea id="blog-markdown" value={form.content} onBlur={() => setTouched((current) => ({ ...current, content: true }))} onChange={(event) => updateField("content", event.target.value)} rows={14} className={`w-full rounded-md border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary focus:outline-none ${showError("content") ? "border-red/40" : "border-border focus:border-accent/30"}`} />{showError("content") ? <p className="text-xs text-red">{errors.content}</p> : null}</div> : <div className="rounded-lg border border-border bg-bg-secondary p-4 text-text-primary"><div className="mb-3 text-xs font-mono uppercase tracking-[0.14em] text-accent">Preview</div><article className="prose max-w-none prose-headings:text-text-primary prose-p:text-text-secondary prose-strong:text-text-primary prose-code:text-accent prose-a:text-accent prose-li:text-text-secondary"><ReactMarkdown remarkPlugins={[remarkGfm]}>{previewContent}</ReactMarkdown></article></div>}
          <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between"><Link to="/admin/blogs" className="text-sm text-text-muted transition-colors hover:text-accent">Back to blogs</Link><button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-bg-primary transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"><Save size={14} />{isSubmitting ? "Saving..." : "Save changes"}</button></div>
        </form>
      </div>
    </AdminLayout>
  );
}

interface FieldProps {
  label: string;
  id: string;
  value: string;
  type?: string;
  error?: string | boolean;
  onBlur?: () => void;
  onChange: (value: string) => void;
}

function Field({ label, id, value, type = "text", error, onBlur, onChange }: FieldProps) {
  return <div className="space-y-2"><label htmlFor={id} className="text-sm font-medium text-text-primary">{label}</label><input id={id} type={type} min={type === "number" ? 1 : undefined} value={value} onBlur={onBlur} onChange={(event) => onChange(event.target.value)} className={`w-full rounded-md border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary focus:outline-none ${error ? "border-red/40" : "border-border focus:border-accent/30"}`} />{error ? <p className="text-xs text-red">{error}</p> : null}</div>;
}
