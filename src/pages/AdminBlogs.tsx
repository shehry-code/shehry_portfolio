import { Link } from "react-router-dom";
import { Plus, Clock, FileText, Pencil, Trash2 } from "lucide-react";
import { blogPosts } from "../data/content";
import AdminLayout from "../components/AdminLayout";

export default function AdminBlogs() {
  const visiblePosts = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = async (slug: string, title: string) => {
    const confirmed = window.confirm(`Delete "${title}"? This removes the blog and its markdown file.`);
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/content/blogs/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Unable to delete blog.");
      }
      window.location.reload();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to delete blog.");
    }
  };

  return (
    <AdminLayout
      title="Blogs"
      description="Edit existing portfolio blog entries or create a new post using the local content workflow."
      actions={
        <Link to="/admin/blogs/new" className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-bg-primary transition-colors hover:bg-accent/90">
          <Plus size={14} />
          New Blog
        </Link>
      }
    >
      <div className="space-y-4">
        {visiblePosts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-bg-secondary p-8 text-center text-text-muted">
            No blogs found.
          </div>
        ) : (
          visiblePosts.map((post) => (
            <article key={post.slug} className="rounded-lg border border-border bg-bg-secondary p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-[0.12em] text-text-muted">
                    <span>{post.category}</span>
                    {post.featured ? <span className="text-accent">Featured</span> : null}
                    {post.draft ? <span className="text-yellow">Draft</span> : null}
                  </div>
                  <h2 className="text-lg font-semibold text-text-primary">{post.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{post.description}</p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
                  <FileText size={14} />
                  {post.slug}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted">
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5"><Clock size={12} /> {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span>{post.readingTime} min read</span>
                  <span>{post.tags.join(", ") || "No tags"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/blogs/${encodeURIComponent(post.slug)}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-medium text-text-primary transition-colors hover:border-accent/30 hover:text-accent"
                  >
                    <Pencil size={12} />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.slug, post.title)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-red/40 bg-red/10 px-2.5 py-1.5 font-medium text-red transition-colors hover:border-red/60 hover:bg-red/15"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
