import { Briefcase, Code2, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function Work() {
  return (
    <>
      <SEO
        title="Work | Shehry"
        description="Project experience, active learning, and technical growth in systems, cybersecurity, and engineering."
      />
      <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-2">Experience</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Work & Experience
          </h1>
          <p className="text-text-secondary max-w-2xl">
            My professional journey so far. I'm actively building experience through projects, 
            learning, and exploration.
          </p>
        </div>

        {/* Status */}
        <div className="p-6 rounded-lg border border-accent/10 bg-accent-glow/20 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green animate-pulse" />
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Currently Building Experience</h2>
              <p className="text-sm text-text-muted mt-1">
                I'm focused on learning, building projects, and developing skills. Open to internships 
                and opportunities in cybersecurity, systems engineering, and security research.
              </p>
            </div>
          </div>
        </div>

        {/* Experience Areas */}
        <div className="space-y-8">
          {/* Projects */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Code2 size={18} className="text-accent" />
              Project Experience
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "Mini Operating System",
                  type: "Systems Programming",
                  description: "Building a modular x86 Assembly-based OS to understand bootloader, memory management, and kernel design.",
                  tech: ["NASM", "x86 Assembly", "QEMU"],
                },
                {
                  title: "AI Phishing URL Detector",
                  type: "Security / ML",
                  description: "Machine learning application for detecting phishing URLs using XGBoost and LightGBM classifiers.",
                  tech: ["Python", "Flask", "XGBoost"],
                },
                {
                  title: "Linux Kernel Experiments",
                  type: "Operating Systems",
                  description: "Experiments with kernel modules, system calls, and process management.",
                  tech: ["C", "Linux", "Kernel Modules"],
                },
              ].map((item) => (
                <div key={item.title} className="p-4 rounded-lg border border-border bg-bg-card">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-sm font-semibold text-text-primary">{item.title}</h3>
                    <span className="text-xs font-mono text-accent whitespace-nowrap">{item.type}</span>
                  </div>
                  <p className="text-sm text-text-muted mb-3">{item.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tech.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded bg-bg-tertiary text-text-muted font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <GraduationCap size={18} className="text-accent" />
              Education
            </h2>
            <div className="p-4 rounded-lg border border-border bg-bg-card">
              <h3 className="text-sm font-semibold text-text-primary">Bachelor of Computer Science</h3>
              <p className="text-sm text-text-muted mt-1">University • 2024 — Present</p>
              <p className="text-sm text-text-muted mt-2">
                Coursework in programming, data structures, algorithms, computer architecture, 
                operating systems, and networking.
              </p>
            </div>
          </section>

          {/* Open To */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Briefcase size={18} className="text-accent" />
              Open To
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Cybersecurity Internships",
                "Systems Engineering Roles",
                "Security Research Opportunities",
                "Open Source Contributions",
                "CTF Competitions",
                "Technical Writing",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 p-3 rounded-md border border-border bg-bg-card">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="text-sm text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-text-muted mb-4">
            Interested in working together or offering an opportunity?
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-bg-primary bg-accent hover:bg-accent/90 rounded-md transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>
      </div>
    </>
  );
}
