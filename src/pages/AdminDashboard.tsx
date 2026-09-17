import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Briefcase, FileText, Pencil, Search } from "lucide-react";
import { blogPosts, notes, researchItems, projects } from "../data/content";
import AdminLayout from "../components/AdminLayout";

const contentStats = [
  { label: "Blogs", count: blogPosts.filter((post) => !post.draft).length, href: "/admin/blogs" },
  { label: "Notes", count: notes.length, href: "/admin/notes" },
  { label: "Research", count: researchItems.length, href: "/admin/research" },
  { label: "Projects", count: projects.length, href: "/admin/projects" },
];

export default function AdminDashboard() {
  return (
    <AdminLayout
      title="Admin Dashboard"
      description="Content overview for the local portfolio management foundation. This phase is read-oriented and keeps the public site untouched."
      actions={
        <>
          <Link to="/admin/blogs/new" className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-card px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent/30 hover:text-accent">
            <Pencil size={14} />
            New Blog
          </Link>
          <Link to="/admin/notes/new" className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-card px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent/30 hover:text-accent">
            <BookOpen size={14} />
            New Note
          </Link>
        </>
      }
    >
      <div className="space-y-8">
        <section>
          <div className="mb-4 flex items-center gap-2">
            <FileText size={16} className="text-accent" />
            <h2 className="text-lg font-semibold text-text-primary">Content</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {contentStats.map((stat) => (
              <Link
                key={stat.label}
                to={stat.href}
                className="group rounded-lg border border-border bg-bg-secondary p-4 transition-colors hover:border-accent/25 hover:bg-bg-card"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">{stat.label}</span>
                  <ArrowRight size={14} className="text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
                <div className="text-3xl font-semibold text-text-primary">{stat.count}</div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <Search size={16} className="text-accent" />
            <h2 className="text-lg font-semibold text-text-primary">Quick actions</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Link to="/admin/blogs/new" className="flex items-center justify-between rounded-lg border border-border bg-bg-secondary p-4 text-text-primary transition-colors hover:border-accent/25 hover:text-accent">
              <span className="font-medium">New Blog</span>
              <ArrowRight size={14} />
            </Link>
            <Link to="/admin/notes/new" className="flex items-center justify-between rounded-lg border border-border bg-bg-secondary p-4 text-text-primary transition-colors hover:border-accent/25 hover:text-accent">
              <span className="font-medium">New Note</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-bg-secondary p-4">
          <div className="mb-2 flex items-center gap-2">
            <Briefcase size={16} className="text-accent" />
            <h2 className="text-lg font-semibold text-text-primary">Status</h2>
          </div>
          <p className="text-sm leading-6 text-text-secondary">
            Local admin foundation is active. Research and project management are placeholders for a later phase, while blog and note inventory is read from the existing portfolio source.
          </p>
        </section>
      </div>
    </AdminLayout>
  );
}
