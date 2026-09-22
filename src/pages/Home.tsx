import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Hero from "../components/Hero";
import SEO, { siteSchema } from "../components/SEO";
import { profile, projects, blogPosts, timeline } from "../data/content";

const architectureLayers = [
  { label: "Application", detail: "Software interactions and interfaces" },
  { label: "Programming Languages & Frameworks", detail: "Abstractions that shape how we build" },
  { label: "Compilers & Interpreters", detail: "Turning intent into executable instructions" },
  { label: "Assembly Language", detail: "Low-level instructions and control flow" },
  { label: "Instruction Set Architecture (ISA)", detail: "The contract between hardware and software" },
  { label: "CPU Microarchitecture", detail: "Pipelines, caches, and execution units" },
  { label: "Memory System", detail: "Data movement, latency, and hierarchy" },
  { label: "Digital Logic & Circuits", detail: "Gates, state, and computation" },
  { label: "Transistors", detail: "The physical foundation of computation" },
];

export default function Home() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const featuredPosts = blogPosts.filter((p) => p.featured && !p.draft).slice(0, 3);

  return (
    <>
      <SEO
        title="Shehry | Computer Science • Systems • Security"
        description="Computer Science portfolio covering systems, cybersecurity, computer architecture, Linux internals, and hands-on technical learning."
        schema={siteSchema}
      />
      <div className="home-page-shell">
        <Hero />

        <main>
          <section className="home-section">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="section-header">
                <p className="section-kicker">Systems</p>
                <h2 className="section-title">From Transistors to Systems</h2>
              </div>

              <div className="architecture-layout">
                <div className="architecture-copy">
                  <p>
                    I study the stack from the lowest level upward — from digital logic and transistors to CPU design, memory, operating systems, and security.
                  </p>
                  <p>
                    {profile.description}
                  </p>
                </div>

                <div className="architecture-visual" aria-label="Computing layers from transistors to systems">
                  {architectureLayers.map((layer, index) => (
                    <div
                      key={layer.label}
                      className={`architecture-layer ${index === 0 ? "is-highlight" : ""}`}
                    >
                      <span className="architecture-node" aria-hidden="true" />
                      <div className="architecture-label">
                        <span>{layer.label}</span>
                        <small>{layer.detail}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="home-section">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between gap-4 mb-8">
                <div>
                  <p className="section-kicker">Projects</p>
                  <h2 className="section-title">Things I&apos;ve Built</h2>
                </div>
                <Link
                  to="/projects"
                  className="hidden items-center gap-1 text-sm text-text-muted transition-colors hover:text-accent sm:flex"
                >
                  View all <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((project) => (
                  <Link
                    key={project.slug}
                    to={`/projects/${project.slug}`}
                    className="group block rounded-xl border border-border bg-bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/25"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold text-text-primary transition-colors group-hover:text-accent">
                        {project.title}
                      </h3>
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] ${
                          project.status === "Active"
                            ? "border-green/30 text-green"
                            : project.status === "Planned"
                              ? "border-yellow/30 text-yellow"
                              : "border-text-muted/30 text-text-muted"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <p className="mb-4 text-sm leading-6 text-text-muted">{project.description}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="rounded bg-bg-tertiary px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-text-muted"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-xs text-text-muted">+{project.technologies.length - 3}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-6 sm:hidden">
                <Link
                  to="/projects"
                  className="flex items-center justify-center gap-1 py-2 text-sm text-text-muted transition-colors hover:text-accent"
                >
                  View all projects <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </section>

          <section className="home-section">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="section-kicker">Writing</p>
                  <h2 className="section-title">Featured Writing</h2>
                </div>
                <Link
                  to="/blog"
                  className="hidden items-center gap-1 text-sm text-text-muted transition-colors hover:text-accent sm:flex"
                >
                  All posts <ArrowRight size={14} />
                </Link>
              </div>

              <div className="space-y-4">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="group block rounded-xl border border-border bg-bg-card p-5 transition-colors hover:border-accent/25"
                  >
                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-base font-semibold text-text-primary transition-colors group-hover:text-accent">
                        {post.title}
                      </h3>
                      <span className="whitespace-nowrap font-mono text-xs text-text-muted">
                        {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>

                    <p className="mb-3 text-sm leading-6 text-text-muted">{post.description}</p>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">{post.category}</span>
                      <span className="text-xs text-text-muted">{post.readingTime} min read</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-6 sm:hidden">
                <Link
                  to="/blog"
                  className="flex items-center justify-center gap-1 py-2 text-sm text-text-muted transition-colors hover:text-accent"
                >
                  All blog posts <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </section>

          <section className="home-section">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <p className="section-kicker">Journey</p>
                <h2 className="section-title">Engineering Timeline</h2>
              </div>

              <div className="timeline-wrap">
                <div className="timeline-rail" aria-hidden="true" />
                <div className="space-y-8">
                  {timeline.slice(0, 3).map((entry) => (
                    <div key={entry.year} className="timeline-item">
                      <div className="timeline-dot" aria-hidden="true" />
                      <div className="timeline-content">
                        <div className="timeline-year">{entry.year}</div>
                        <h3 className="timeline-title">{entry.title}</h3>
                        <p className="timeline-text">{entry.items.join(" • ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
