import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Briefcase, FileText, LayoutGrid, LogOut, Search } from "lucide-react";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutGrid },
  { label: "Blogs", to: "/admin/blogs", icon: FileText },
  { label: "Notes", to: "/admin/notes", icon: BookOpen },
  { label: "Research", to: "/admin/research", icon: Search },
  { label: "Projects", to: "/admin/projects", icon: Briefcase },
];

interface AdminLayoutProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function AdminLayout({ title, description, actions, children }: AdminLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-20 text-text-primary">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-accent"
            >
              <ArrowLeft size={14} />
              Back to portfolio
            </Link>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-accent"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-bg-card shadow-sm">
          <div className="border-b border-border bg-bg-secondary px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="mb-2 text-xs font-mono uppercase tracking-[0.16em] text-accent">Admin</p>
                <h1 className="text-2xl font-semibold text-text-primary sm:text-3xl">{title}</h1>
              </div>
              {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
            </div>
            {description ? (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary">{description}</p>
            ) : null}
          </div>

          <div className="grid gap-0 lg:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="border-b border-border bg-bg-secondary lg:border-b-0 lg:border-r">
              <nav aria-label="Admin navigation" className="p-4">
                <ul className="space-y-1.5">
                  {navItems.map(({ label, to, icon: Icon }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        end={to === "/admin"}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors ${
                            isActive
                              ? "border-accent/25 bg-accent-glow text-accent"
                              : "border-transparent text-text-secondary hover:border-border-hover hover:text-text-primary"
                          }`
                        }
                      >
                        <Icon size={15} />
                        {label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <main className="p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
