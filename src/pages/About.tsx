import { skills, profile, timeline } from "../data/content";
import type { SkillLevel } from "../data/content";
import SEO from "../components/SEO";

function SkillBadge({ name, level }: { name: string; level: SkillLevel }) {
  const colors = {
    comfortable: "border-green/30 text-green bg-green/5",
    learning: "border-yellow/30 text-yellow bg-yellow/5",
    familiar: "border-text-muted/30 text-text-muted bg-bg-tertiary",
  };

  return (
    <span className={`inline-block px-2.5 py-1 text-xs font-mono rounded border ${colors[level]}`}>
      {name}
    </span>
  );
}

export default function About() {
  return (
    <>
      <SEO
        title="About | Shehry"
        description="Learn about Shehry's Computer Science journey, systems-focused learning path, and interest in cybersecurity, computer architecture, and low-level computing."
      />
      <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-2">About</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Understanding computers from the ground up.
          </h1>
          <p className="text-text-secondary leading-relaxed max-w-2xl">
            {profile.description}
          </p>
        </div>

        {/* Who I Am */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span className="text-accent font-mono text-sm">#</span> Who I Am
          </h2>
          <div className="prose">
            <p className="text-text-secondary leading-relaxed">
              I'm a Computer Science student who believes that truly understanding computing means 
              understanding it at every level — from the transistors and digital logic at the bottom, 
              through assembly language and CPU architecture, up to operating systems and applications.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Rather than staying at the surface level of high-level frameworks, I want to understand 
              what happens underneath. How does a CPU actually execute an instruction? How does memory 
              really work? What happens at the hardware level when software has a vulnerability?
            </p>
            <p className="text-text-secondary leading-relaxed">
              I'm actively learning, building projects, writing about what I discover, and documenting 
              my journey through systems engineering and cybersecurity.
            </p>
          </div>
        </section>

        {/* Learning Philosophy */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span className="text-accent font-mono text-sm">#</span> The Layers I Study
          </h2>
          <div className="terminal">
            <div className="terminal-header">
              <div className="terminal-dot" style={{ backgroundColor: "#f87171" }} />
              <div className="terminal-dot" style={{ backgroundColor: "#fbbf24" }} />
              <div className="terminal-dot" style={{ backgroundColor: "#34d399" }} />
              <span className="ml-2 text-xs text-text-muted font-mono">abstraction-layers</span>
            </div>
            <div className="terminal-body text-sm">
              {[
                "Application Layer",
                "Programming Languages & Frameworks",
                "Compilers & Interpreters",
                "Assembly Language",
                "Instruction Set Architecture (ISA)",
                "CPU Microarchitecture",
                "Memory System (Cache, RAM)",
                "Digital Logic & Circuits",
                "Transistors (Physics)",
              ].map((layer, i) => (
                <div
                  key={layer}
                  className="flex items-start gap-2 mb-1 min-w-0"
                  style={{ paddingLeft: `${Math.min(i, 8) * 8}px` }}
                >
                  <span className="text-accent w-3 shrink-0">{i === 0 ? "●" : "→"}</span>
                  <span className="text-text-secondary break-words">{layer}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span className="text-accent font-mono text-sm">#</span> Skills
          </h2>

          <div className="flex gap-4 mb-6 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green" />
              Comfortable
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow" />
              Learning
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-text-muted" />
              Familiar
            </span>
          </div>

          <div className="space-y-6">
            {skills.map((category) => (
              <div key={category.category}>
                <h3 className="text-sm font-medium text-text-primary mb-3">{category.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <SkillBadge key={skill.name} name={skill.name} level={skill.level} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span className="text-accent font-mono text-sm">#</span> Education
          </h2>
          <div className="p-4 rounded-lg border border-border bg-bg-card">
            <h3 className="text-sm font-semibold text-text-primary">{profile.education.degree}</h3>
            <p className="text-sm text-text-muted mt-1">{profile.education.institution}</p>
            <p className="text-xs text-text-muted font-mono mt-1">{profile.education.period}</p>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span className="text-accent font-mono text-sm">#</span> Learning Journey
          </h2>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {timeline.map((entry) => (
                <div key={entry.year} className="relative pl-10">
                  <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-accent bg-bg-primary" />
                  <div className="text-xs font-mono text-accent mb-1">{entry.year}</div>
                  <h3 className="text-sm font-semibold text-text-primary mb-2">{entry.title}</h3>
                  <ul className="space-y-1">
                    {entry.items.map((item) => (
                      <li key={item} className="text-sm text-text-muted flex items-start gap-2 min-w-0">
                        <span className="text-text-muted/50 shrink-0">·</span>
                        <span className="break-words">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interests */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span className="text-accent font-mono text-sm">#</span> Interests
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Cybersecurity", "Reverse Engineering", "Computer Architecture",
              "Operating Systems", "Linux", "Networking", "Systems Programming",
              "Assembly Language", "C/C++", "Low-level Computing",
              "AI + Architecture", "Security Research", "Hardware Security",
            ].map((interest) => (
              <span
                key={interest}
                className="px-3 py-1.5 text-xs font-mono text-text-secondary border border-border rounded-md hover:border-accent/20 hover:text-accent transition-colors"
              >
                {interest}
              </span>
            ))}
          </div>
        </section>
      </div>
      </div>
    </>
  );
}
