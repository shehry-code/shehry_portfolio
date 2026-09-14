import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Terminal, Shield, Search, Code, Globe } from "lucide-react";
import Hero from "../components/Hero";
import { currentFocus, projects, blogPosts } from "../data/content";

const iconMap: Record<string, React.ReactNode> = {
  cpu: <Cpu size={16} />,
  terminal: <Terminal size={16} />,
  shield: <Shield size={16} />,
  search: <Search size={16} />,
  code: <Code size={16} />,
  globe: <Globe size={16} />,
};

export default function Home() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const featuredPosts = blogPosts.filter((p) => p.featured && !p.draft).slice(0, 3);

  return (
    <div>
      <Hero />

      {/* Current Focus */}
      <section className="border-t border-border py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-2">Currently Exploring</p>
            <h2 className="text-2xl font-bold text-text-primary">What I'm Working On</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {currentFocus.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-bg-card hover:border-accent/20 transition-colors group"
              >
                <span className="text-accent group-hover:scale-110 transition-transform">
                  {iconMap[item.icon]}
                </span>
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="border-t border-border py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-mono text-accent uppercase tracking-wider mb-2">Projects</p>
              <h2 className="text-2xl font-bold text-text-primary">Featured Work</h2>
            </div>
            <Link
              to="/projects"
              className="hidden sm:flex items-center gap-1 text-sm text-text-muted hover:text-accent transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                to={`/projects/${project.slug}`}
                className="group block p-5 rounded-lg border border-border bg-bg-card hover:border-accent/20 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    project.status === "Active" ? "border-green/30 text-green" :
                    project.status === "Planned" ? "border-yellow/30 text-yellow" :
                    "border-text-muted/30 text-text-muted"
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-text-muted mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-xs px-2 py-0.5 rounded bg-bg-tertiary text-text-muted font-mono">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-xs px-2 py-0.5 text-text-muted">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 sm:hidden">
            <Link
              to="/projects"
              className="flex items-center justify-center gap-1 text-sm text-text-muted hover:text-accent transition-colors py-2"
            >
              View all projects <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="border-t border-border py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-mono text-accent uppercase tracking-wider mb-2">Blog</p>
              <h2 className="text-2xl font-bold text-text-primary">Latest Writing</h2>
            </div>
            <Link
              to="/blog"
              className="hidden sm:flex items-center gap-1 text-sm text-text-muted hover:text-accent transition-colors"
            >
              All posts <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {featuredPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group block p-5 rounded-lg border border-border bg-bg-card hover:border-accent/20 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-base font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <span className="text-xs text-text-muted font-mono whitespace-nowrap">
                    {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <p className="text-sm text-text-muted mb-3">
                  {post.description}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-accent font-mono">{post.category}</span>
                  <span className="text-xs text-text-muted">{post.readingTime} min read</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 sm:hidden">
            <Link
              to="/blog"
              className="flex items-center justify-center gap-1 text-sm text-text-muted hover:text-accent transition-colors py-2"
            >
              All blog posts <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Engineering Timeline Preview */}
      <section className="border-t border-border py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-2">Journey</p>
            <h2 className="text-2xl font-bold text-text-primary">Learning Path</h2>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {[
                { year: "2024", title: "Started Computer Science", desc: "Python, web fundamentals, Linux basics" },
                { year: "2025", title: "Systems & Networking", desc: "Linux deep dive, C programming, networking" },
                { year: "2026", title: "Architecture & Security", desc: "Computer architecture, assembly, cybersecurity research" },
              ].map((entry) => (
                <div key={entry.year} className="relative pl-10">
                  <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-accent bg-bg-primary" />
                  <div className="text-xs font-mono text-accent mb-1">{entry.year}</div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">{entry.title}</h3>
                  <p className="text-sm text-text-muted">{entry.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
