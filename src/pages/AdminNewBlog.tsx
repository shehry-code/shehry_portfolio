import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, FileText, Save } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AdminLayout from "../components/AdminLayout";

const initialForm = {
  title: "",
  slug: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  category: "",
  tags: "",
  readingTime: "7",
  featured: false,
  draft: true,
  content: "",
};

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
};

const validateSlug = (value: string) => {
  if (!value.trim()) {
    return "Slug is required.";
  }

  const trimmed = value.trim();

  if (trimmed.includes("..") || trimmed.includes("/") || trimmed.includes("\\")) {
    return "Slug must be a safe path segment.";
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
    return "Use lowercase letters, numbers, and hyphens only.";
  }

  return "";
};

export default function AdminNewBlog() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [view, setView] = useState<"editor" | "preview">("editor");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [slugEdited, setSlugEdited] = useState(false);

  const previewContent = useMemo(() => form.content || "# Preview\n\nStart writing your post here...", [form.content]);

  const errors = {
    title: !form.title.trim() ? "Title is required." : "",
    slug: validateSlug(form.slug),
    description: !form.description.trim() ? "Description is required." : "",
    date: !form.date ? "Date is required." : "",
    category: !form.category.trim() ? "Category is required." : "",
    readingTime: Number(form.readingTime) > 0 && Number.isInteger(Number(form.readingTime)) ? "" : "Reading time must be a positive integer.",
    content: !form.content.trim() ? "Markdown content is required." : "",
  };

  const showError = (key: keyof typeof errors) => touched[key] && errors[key];

  const handleTitleChange = (value: string) => {
    setForm((current) => ({
      ...current,
      title: value,
      slug: !slugEdited && !current.slug ? slugify(value) : current.slug,
    }));

    if (!slugEdited) {
      setForm((current) => ({
        ...current,
        title: value,
        slug: slugify(value),
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const touchedFields = {
      title: true,
      slug: true,
      description: true,
      date: true,
      category: true,
      readingTime: true,
      content: true,
    };
    setTouched(touchedFields);

    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) {
      setSubmitError("Please fix the highlighted fields before saving.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const response = await fetch("http://localhost:3001/api/content/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title.trim(),
          slug: form.slug.trim(),
          description: form.description.trim(),
          date: form.date,
          category: form.category.trim(),
          tags: form.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          readingTime: Number(form.readingTime),
          featured: form.featured,
          draft: form.draft,
          content: form.content,
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Unable to save the blog post.");
      }

      setSubmitSuccess("Blog created successfully.");
      setTimeout(() => {
        navigate("/admin/blogs");
      }, 250);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to save the blog post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="New Blog"
      description="Create a new post with the existing portfolio blog architecture. The Markdown file and metadata entry are generated through the local content API."
      actions={
        <>
          <button
            type="button"
            onClick={() => setView("editor")}
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
              view === "editor"
                ? "border-accent/30 bg-accent-glow text-accent"
                : "border-border bg-bg-card text-text-primary hover:border-accent/30 hover:text-accent"
            }`}
          >
            <FileText size={14} />
            Editor
          </button>
          <button
            type="button"
            onClick={() => setView("preview")}
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
              view === "preview"
                ? "border-accent/30 bg-accent-glow text-accent"
                : "border-border bg-bg-card text-text-primary hover:border-accent/30 hover:text-accent"
            }`}
          >
            <Eye size={14} />
            Preview
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {submitError ? (
          <div className="rounded-lg border border-red/35 bg-red/10 p-3 text-sm text-red">{submitError}</div>
        ) : null}

        {submitSuccess ? (
          <div className="rounded-lg border border-green/35 bg-green/10 p-3 text-sm text-green">{submitSuccess}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="blog-title" className="text-sm font-medium text-text-primary">Title</label>
              <input
                id="blog-title"
                value={form.title}
                onBlur={() => setTouched((current) => ({ ...current, title: true }))}
                onChange={(event) => handleTitleChange(event.target.value)}
                className={`w-full rounded-md border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                  showError("title") ? "border-red/40" : "border-border focus:border-accent/30"
                }`}
                placeholder="Blog title"
              />
              {showError("title") ? <p className="text-xs text-red">{errors.title}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="blog-slug" className="text-sm font-medium text-text-primary">Slug</label>
              <input
                id="blog-slug"
                value={form.slug}
                onBlur={() => {
                  setTouched((current) => ({ ...current, slug: true }));
                  setSlugEdited(true);
                }}
                onChange={(event) => {
                  setSlugEdited(true);
                  setForm((current) => ({ ...current, slug: event.target.value }));
                }}
                className={`w-full rounded-md border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                  showError("slug") ? "border-red/40" : "border-border focus:border-accent/30"
                }`}
                placeholder="blog-slug"
              />
              {showError("slug") ? <p className="text-xs text-red">{errors.slug}</p> : null}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="blog-description" className="text-sm font-medium text-text-primary">Description</label>
            <textarea
              id="blog-description"
              value={form.description}
              onBlur={() => setTouched((current) => ({ ...current, description: true }))}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              rows={3}
              className={`w-full rounded-md border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                showError("description") ? "border-red/40" : "border-border focus:border-accent/30"
              }`}
              placeholder="Short summary"
            />
            {showError("description") ? <p className="text-xs text-red">{errors.description}</p> : null}
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            <div className="space-y-2">
              <label htmlFor="blog-date" className="text-sm font-medium text-text-primary">Date</label>
              <input
                id="blog-date"
                type="date"
                value={form.date}
                onBlur={() => setTouched((current) => ({ ...current, date: true }))}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                className={`w-full rounded-md border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary focus:outline-none ${
                  showError("date") ? "border-red/40" : "border-border focus:border-accent/30"
                }`}
              />
              {showError("date") ? <p className="text-xs text-red">{errors.date}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="blog-category" className="text-sm font-medium text-text-primary">Category</label>
              <input
                id="blog-category"
                value={form.category}
                onBlur={() => setTouched((current) => ({ ...current, category: true }))}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                className={`w-full rounded-md border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                  showError("category") ? "border-red/40" : "border-border focus:border-accent/30"
                }`}
                placeholder="Computer Architecture"
              />
              {showError("category") ? <p className="text-xs text-red">{errors.category}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="blog-tags" className="text-sm font-medium text-text-primary">Tags</label>
              <input
                id="blog-tags"
                value={form.tags}
                onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                className="w-full rounded-md border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent/30 focus:outline-none"
                placeholder="systems, linux"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="blog-reading-time" className="text-sm font-medium text-text-primary">Reading Time</label>
              <input
                id="blog-reading-time"
                type="number"
                min="1"
                value={form.readingTime}
                onBlur={() => setTouched((current) => ({ ...current, readingTime: true }))}
                onChange={(event) => setForm((current) => ({ ...current, readingTime: event.target.value }))}
                className={`w-full rounded-md border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary focus:outline-none ${
                  showError("readingTime") ? "border-red/40" : "border-border focus:border-accent/30"
                }`}
              />
              {showError("readingTime") ? <p className="text-xs text-red">{errors.readingTime}</p> : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-text-primary">
              <input type="checkbox" checked={form.featured} onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))} className="h-4 w-4 rounded border-border bg-bg-secondary" />
              Featured
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-text-primary">
              <input type="checkbox" checked={form.draft} onChange={(event) => setForm((current) => ({ ...current, draft: event.target.checked }))} className="h-4 w-4 rounded border-border bg-bg-secondary" />
              Draft
            </label>
          </div>

          {view === "editor" ? (
            <div className="space-y-2">
              <label htmlFor="blog-markdown" className="text-sm font-medium text-text-primary">Markdown Content</label>
              <textarea
                id="blog-markdown"
                value={form.content}
                onBlur={() => setTouched((current) => ({ ...current, content: true }))}
                onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                rows={14}
                className={`w-full rounded-md border bg-bg-secondary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none ${
                  showError("content") ? "border-red/40" : "border-border focus:border-accent/30"
                }`}
                placeholder="# Post title\n\nWrite markdown here..."
              />
              {showError("content") ? <p className="text-xs text-red">{errors.content}</p> : null}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-bg-secondary p-4 text-text-primary">
              <div className="mb-3 text-xs font-mono uppercase tracking-[0.14em] text-accent">Preview</div>
              <article className="prose max-w-none prose-headings:text-text-primary prose-p:text-text-secondary prose-strong:text-text-primary prose-code:text-accent prose-a:text-accent prose-li:text-text-secondary">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{previewContent}</ReactMarkdown>
              </article>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/admin/blogs" className="text-sm text-text-muted transition-colors hover:text-accent">
              Back to blogs
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-bg-primary transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={14} />
              {isSubmitting ? "Saving..." : "Save blog"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
