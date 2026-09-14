

// ============================================================
// PROFILE DATA
// ============================================================

export const profile = {
  name: "Shehry",
  title: "Computer Science Student",
  subtitle: "Cybersecurity • Systems • Computer Architecture",
  tagline: "Building, breaking, and studying computer systems to understand what happens under the hood.",
  description: "Computer Science student and aspiring cybersecurity engineer. I explore systems from the lowest level upward — from transistors and digital logic, through assembly and CPU architecture, up to operating systems and security.",
  email: "shehrimary@gmail.com",
  github: "https://github.com/shehry-code",
  linkedin: "https://www.linkedin.com/in/muhammad-shehriyar-94a966422/",
  location: "Peshawar, Pakistan",
  education: {
    degree: "Bachelor of Computer Science",
    institution: "CECOS University of IT and Emerging Sciences",
    period: "2024 — Present",
  },
};

export const social = {
  github: profile.github,
  linkedin: profile.linkedin,
  email: `mailto:${profile.email}`,
};

// ============================================================
// CURRENT FOCUS
// ============================================================

export const currentFocus = [
  { label: "Computer Architecture", icon: "cpu" },
  { label: "Linux Internals", icon: "terminal" },
  { label: "Cybersecurity", icon: "shield" },
  { label: "Reverse Engineering", icon: "search" },
  { label: "x86 Assembly", icon: "code" },
  { label: "Networking", icon: "globe" },
];

// ============================================================
// SKILLS
// ============================================================

export type SkillLevel = "comfortable" | "learning" | "familiar";

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export const skills: SkillCategory[] = [
  {
    category: "Programming",
    skills: [
      { name: "C", level: "learning" },
      { name: "C++", level: "learning" },
      { name: "Python", level: "comfortable" },
      { name: "JavaScript / TypeScript", level: "comfortable" },
      { name: "x86 Assembly", level: "learning" },
    ],
  },
  {
    category: "Systems",
    skills: [
      { name: "Linux", level: "comfortable" },
      { name: "Operating Systems", level: "learning" },
      { name: "Bash / Shell", level: "comfortable" },
      { name: "Git", level: "comfortable" },
      { name: "QEMU", level: "learning" },
    ],
  },
  {
    category: "Cybersecurity",
    skills: [
      { name: "Networking Fundamentals", level: "learning" },
      { name: "Linux Security", level: "learning" },
      { name: "Security Concepts", level: "learning" },
      { name: "Reverse Engineering", level: "learning" },
      { name: "CTF / Problem Solving", level: "learning" },
    ],
  },
  {
    category: "Web",
    skills: [
      { name: "HTML / CSS", level: "comfortable" },
      { name: "JavaScript", level: "comfortable" },
      { name: "TypeScript", level: "comfortable" },
      { name: "React", level: "comfortable" },
      { name: "Flask", level: "learning" },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git / GitHub", level: "comfortable" },
      { name: "VS Code", level: "comfortable" },
      { name: "Neovim", level: "learning" },
      { name: "GDB", level: "learning" },
      { name: "Wireshark", level: "learning" },
    ],
  },
];

// ============================================================
// PROJECTS
// ============================================================

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  category: string;
  status: "Active" | "Completed" | "Planned" | "Coming Soon";
  github?: string;
  demo?: string;
  featured: boolean;
  date: string;
}

export const projects: Project[] = [
  {
    slug: "mini-os",
    title: "Mini Operating System",
    description: "A modular x86 Assembly-based mini operating system. Building from bootloader to understand how computers execute code at the lowest level.",
    longDescription: "A hands-on project to understand how operating systems work from the ground up. Written in x86 Assembly using NASM, this mini OS includes a custom bootloader, basic memory management, and a simple shell. The goal is to understand the relationship between hardware and software at the most fundamental level.",
    technologies: ["NASM", "x86 Assembly", "Linux", "QEMU", "Make"],
    category: "Systems",
    status: "Active",
    github: "https://github.com/shehry-code/MIni-operating-system-in-assembly-.git",
    featured: true,
    date: "2026",
  },
  {
    slug: "phishing-detector",
    title: "AI Phishing URL Detector",
    description: "Machine-learning-based phishing URL detection application using XGBoost and LightGBM classifiers.",
    longDescription: "A web application that uses machine learning to detect phishing URLs in real-time. Built with Flask as the backend, the system uses XGBoost and LightGBM models trained on lexical and host-based features of URLs. The project explores the intersection of AI and cybersecurity.",
    technologies: ["Python", "Flask", "XGBoost", "LightGBM", "Machine Learning"],
    category: "Security / AI",
    status: "Active",
    github: "https://github.com/shehry/phishing-detector",
    featured: true,
    date: "2026",
  },
  {
    slug: "career-gps",
    title: "Career GPS AI",
    description: "An AI-powered career guidance tool that helps students navigate their career paths using intelligent recommendations.",
    technologies: ["Python", "Machine Learning", "Flask"],
    category: "AI",
    status: "Active",
    github: "https://github.com/shehry/career-gps",
    featured: true,
    date: "2026",
  },
  {
    slug: "linux-experiments",
    title: "Linux Kernel Experiments",
    description: "Experiments with Linux kernel modules, system calls, and process management to understand OS internals.",
    technologies: ["C", "Linux", "Kernel Modules"],
    category: "Systems",
    status: "Active",
    github: "https://github.com/shehry/linux-experiments",
    featured: false,
    date: "2026",
  },
  {
    slug: "network-analyzer",
    title: "Network Protocol Analyzer",
    description: "A tool for capturing and analyzing network packets to understand TCP/IP protocols and network behavior.",
    technologies: ["Python", "Scapy", "Networking"],
    category: "Networking",
    status: "Planned",
    featured: false,
    date: "2026",
  },
  {
    slug: "reverse-engineering-lab",
    title: "Reverse Engineering Lab",
    description: "A collection of reverse engineering exercises and experiments. Analyzing binaries, understanding ELF formats, and learning disassembly.",
    technologies: ["C", "x86 Assembly", "GDB", "Linux"],
    category: "Security",
    status: "Active",
    github: "https://github.com/shehry/re-lab",
    featured: false,
    date: "2026",
  },
];

// ============================================================
// BLOG POSTS
// ============================================================

const blogContent = import.meta.glob(
  "../content/blogs/*.md",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
) as Record<string, string>;

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  category: string;
  featured: boolean;
  draft: boolean;
  readingTime: number;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "what-is-an-isa",
    title: "What Is an ISA?",
    description: "Understanding Instruction Set Architecture — the interface between hardware and software that defines how a processor works.",
    date: "2026-08-20",
    tags: ["Computer Architecture", "ISA", "x86", "MIPS"],
    category: "Computer Architecture",
    featured: true,
    draft: false,
    readingTime: 7,
    content: blogContent["../content/blogs/what-is-an-isa.md"],
  },
  {
    slug: "how-dram-stores-data",
    title: "How DRAM Stores Data",
    description: "A deep dive into Dynamic Random Access Memory — how a single transistor and capacitor store a bit of information.",
    date: "2026-09-14",
    tags: ["Computer Architecture", "DRAM", "Memory", "Hardware"],
    category: "Computer Architecture",
    featured: true,
    draft: false,
    readingTime: 8,
    content: blogContent["../content/blogs/how-dram-stores-data.md"],
  },
  {
    slug: "understanding-cpu-registers",
    title: "Understanding CPU Registers",
    description: "What CPU registers are, why they exist, and how they form the fastest layer of the memory hierarchy.",
    date: "2026-07-10",
    tags: ["Computer Architecture", "CPU", "Registers", "Assembly"],
    category: "Computer Architecture",
    featured: false,
    draft: false,
    readingTime: 6,
    content: blogContent["../content/blogs/understanding-cpu-registers.md"],
  },
  {
    slug: "what-happens-when-program-runs",
    title: "What Actually Happens When a Program Runs?",
    description: "Tracing the journey of a program from source code to execution — the full stack of abstraction.",
    date: "2026-10-01",
    tags: ["Systems", "Compilers", "Operating Systems", "CPU"],
    category: "Systems",
    featured: true,
    draft: false,
    readingTime: 10,
    content: blogContent["../content/blogs/what-happens-when-program-runs.md"],
  },
  {
    slug: "why-learn-computer-architecture",
    title: "Why I Started Learning Computer Architecture",
    description: "A personal reflection on why understanding computer architecture matters, even if you're not building CPUs.",
    date: "2026-06-15",
    tags: ["Computer Architecture", "Learning", "Systems"],
    category: "Personal",
    featured: false,
    draft: false,
    readingTime: 5,
    content: blogContent["../content/blogs/why-learn-computer-architecture.md"],
  },
];

// ============================================================
// NOTES
// ============================================================

export interface Note {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  content: string;
}

export const notes: Note[] = [
  {
    slug: "mos-transistors",
    title: "MOS Transistors",
    description: "How Metal-Oxide-Semiconductor transistors work as the fundamental building block of digital circuits.",
    date: "2026-05-10",
    tags: ["Digital Logic", "Hardware", "Transistors"],
    category: "Digital Logic",
    content: `
## MOS Transistor Basics

A MOS (Metal-Oxide-Semiconductor) transistor is a voltage-controlled switch. It's the fundamental building block of all modern digital circuits.

### Types
- **NMOS**: Conducts when gate voltage is HIGH
- **PMOS**: Conducts when gate voltage is LOW

### Terminals
- **Gate (G)**: Control input
- **Source (S)**: Where carriers enter
- **Drain (D)**: Where carriers exit
- **Body (B)**: Substrate connection

### How It Works

When voltage is applied to the gate, an electric field creates a conductive channel between source and drain. No gate voltage = no channel = open switch.

This simple switching behavior is what enables all digital computation.

### CMOS

Modern circuits use **Complementary MOS** (CMOS) — pairs of NMOS and PMOS transistors. This design:
- Consumes power only during switching
- Provides clean logic levels
- Is resistant to noise

Every gate in your CPU is built from CMOS transistors.
`,
  },
  {
    slug: "flip-flops",
    title: "Flip-Flops",
    description: "How flip-flops store a single bit of data — the foundation of sequential logic and memory.",
    date: "2026-05-15",
    tags: ["Digital Logic", "Sequential Logic", "Memory"],
    category: "Digital Logic",
    content: `
## What Is a Flip-Flop?

A flip-flop is a circuit that stores **one bit** of data. Unlike combinational logic (where output depends only on current input), flip-flops have **memory** — their output depends on both current input and previous state.

## SR Flip-Flop (Set-Reset)

The simplest flip-flop:
- **S (Set)**: Output → 1
- **R (Reset)**: Output → 0
- Both low: Hold previous state
- Both high: Invalid/forbidden

Built from two cross-coupled NOR or NAND gates.

## D Flip-Flop

The most commonly used flip-flop:
- Has a **data input (D)** and a **clock input (CLK)**
- On clock edge, Q = D
- Between clock edges, Q holds its value

This edge-triggered behavior is what makes synchronous digital systems work.

## Applications

- **Registers**: Collections of flip-flops store multi-bit values
- **Counters**: Flip-flops chained together count events
- **Memory**: SRAM cells are essentially flip-flops
- **State Machines**: Flip-flops hold the state

## Key Insight

Without flip-flops, computers couldn't store anything. They're what make sequential computation possible — the difference between a calculator and a computer.
`,
  },
  {
    slug: "cpu-registers-note",
    title: "CPU Registers",
    description: "Quick reference for x86-64 general purpose and special purpose registers.",
    date: "2026-06-01",
    tags: ["x86", "Assembly", "CPU", "Registers"],
    category: "Computer Architecture",
    content: `
## x86-64 Registers Quick Reference

### General Purpose (64-bit)

| Register | Common Use |
|----------|-----------|
| RAX | Return value, accumulator |
| RBX | Callee-saved general purpose |
| RCX | Loop counter, shift amount |
| RDX | I/O, extended multiply/divide |
| RSI | Source index (string ops) |
| RDI | Destination index, first arg |
| RSP | Stack pointer |
| RBP | Base/frame pointer |
| R8-R15 | Additional GPRs |

### Special Purpose

| Register | Purpose |
|----------|---------|
| RIP | Instruction pointer |
| RFLAGS | Condition flags |
| CS/DS/SS | Segment registers |

### Sub-registers

Each 64-bit register can be accessed as:
- 64-bit: RAX
- 32-bit: EAX
- 16-bit: AX
- 8-bit high: AH
- 8-bit low: AL

### Calling Convention (System V AMD64)

Arguments passed in: RDI, RSI, RDX, RCX, R8, R9
Return value in: RAX
`,
  },
  {
    slug: "dram-row-buffer",
    title: "DRAM Row Buffer",
    description: "Understanding the row buffer mechanism in DRAM and its impact on memory access patterns.",
    date: "2026-06-20",
    tags: ["DRAM", "Memory", "Computer Architecture"],
    category: "Computer Architecture",
    content: `
## The Row Buffer

When a DRAM row is activated, its entire contents are sense-amplified and stored in the **row buffer** — a fast buffer that holds the active row's data.

## Row Hit vs Row Miss

- **Row Hit**: Requested column is in the currently active row → fast access
- **Row Miss**: Requested column is in a different row → must precharge + activate new row → slow

## Implications

Sequential access patterns benefit from row buffer locality. Random access patterns cause constant row conflicts.

This is why:
- Sequential memory access is fast
- Random access is slow
- Memory scheduling algorithms try to maximize row hits

## Open vs Closed Page Policy

- **Open page**: Keep row buffer active after access (good for sequential)
- **Closed page**: Precharge immediately after access (good for random)

Modern controllers use adaptive policies.

## Security Note

Row buffer state can be exploited in side-channel attacks. Understanding row buffer behavior is essential for understanding RowHammer and similar vulnerabilities.
`,
  },
  {
    slug: "tcp-vs-udp",
    title: "TCP vs UDP",
    description: "Key differences between TCP and UDP transport protocols and when to use each.",
    date: "2026-07-05",
    tags: ["Networking", "TCP", "UDP", "Protocols"],
    category: "Networking",
    content: `
## TCP (Transmission Control Protocol)

**Connection-oriented, reliable, ordered**

- Three-way handshake (SYN → SYN-ACK → ACK)
- Guaranteed delivery with acknowledgments
- Ordered delivery with sequence numbers
- Flow control (sliding window)
- Congestion control
- Higher overhead

**Use when**: Data integrity matters (web, email, file transfer)

## UDP (User Datagram Protocol)

**Connectionless, unreliable, unordered**

- No handshake
- No delivery guarantees
- No ordering
- No flow/congestion control
- Minimal overhead
- Faster for small messages

**Use when**: Speed matters more than reliability (DNS, streaming, gaming, VoIP)

## Header Comparison

| Feature | TCP | UDP |
|---------|-----|-----|
| Header Size | 20-60 bytes | 8 bytes |
| Connection | Yes | No |
| Reliability | Yes | No |
| Ordering | Yes | No |
| Speed | Slower | Faster |

## Key Insight

TCP adds reliability on top of IP. UDP is essentially raw IP with port numbers. Choose based on your application's requirements.
`,
  },
  {
    slug: "linux-process-states",
    title: "Linux Process States",
    description: "Understanding the different states a process can be in on a Linux system.",
    date: "2026-07-20",
    tags: ["Linux", "Operating Systems", "Processes"],
    category: "Operating Systems",
    content: `
## Process States in Linux

Every process in Linux exists in one of several states:

### Running (R)
Currently executing on a CPU or in the run queue waiting for a CPU.

### Sleeping / Interruptible (S)
Waiting for an event (I/O, signal, resource). Can be interrupted by signals.

### Deep Sleep / Uninterruptible (D)
Waiting for I/O. Cannot be interrupted — not even by signals. This is the state you see when a process is stuck on disk I/O.

### Stopped (T)
Stopped by a signal (SIGSTOP, Ctrl+Z). Can be resumed with SIGCONT.

### Zombie (Z)
Process has terminated but parent hasn't called wait(). The process table entry is kept until the parent reaps it.

## State Transitions

\`\`\`
  ┌──────────┐
  │ Running  │ ←── scheduler
  └────┬─────┘
       │
  ┌────┴──────────┐
  │               │
  ▼               ▼
┌──────┐    ┌──────────────┐
│Sleep │    │Uninterruptible│
│  (S) │    │    (D)       │
└──┬───┘    └──────┬───────┘
   │               │
   └───────┬───────┘
           │ event/signal
           ▼
     ┌──────────┐
     │ Running  │
     └──────────┘
\`\`\`

## Checking Process States

\`\`\`bash
ps aux          # See all processes
ps -eo pid,stat,comm  # Show state codes
top             # Real-time view
/proc/[pid]/status    # Detailed info
\`\`\`
`,
  },
];

// ============================================================
// RESEARCH
// ============================================================

export interface ResearchItem {
  slug: string;
  title: string;
  description: string;
  date: string;
  status: "Idea" | "In Progress" | "Completed" | "Planned";
  tags: string[];
  category: string;
  motivation: string;
  method: string;
  currentStatus: string;
  github?: string;
}

export const researchItems: ResearchItem[] = [
  {
    slug: "rowhammer-analysis",
    title: "RowHammer Vulnerability Analysis",
    description: "Investigating DRAM RowHammer vulnerability and its implications for system security.",
    date: "2026",
    status: "Idea",
    tags: ["Security", "DRAM", "Memory", "Hardware"],
    category: "Security Research",
    motivation: "RowHammer demonstrates how hardware-level phenomena can create software-exploitable vulnerabilities. Understanding this attack requires knowledge spanning device physics, memory architecture, and security.",
    method: "Literature review of RowHammer research, understanding DRAM refresh mechanisms, analyzing affected memory configurations, and studying mitigation techniques (TRR, target row refresh).",
    currentStatus: "Initial literature review phase. Studying DRAM architecture and refresh mechanisms.",
  },
  {
    slug: "ai-architecture-optimization",
    title: "AI Workloads and Computer Architecture",
    description: "Exploring how AI/ML workloads interact with computer architecture and memory hierarchy.",
    date: "2026",
    status: "Planned",
    tags: ["AI", "Computer Architecture", "Performance", "Memory"],
    category: "Architecture Research",
    motivation: "Modern AI workloads are extremely memory-intensive. Understanding how they interact with cache hierarchy, memory bandwidth, and data movement is crucial for optimization.",
    method: "Profiling ML workloads, analyzing memory access patterns, studying cache behavior during training and inference.",
    currentStatus: "Planning phase. Identifying specific workloads to profile.",
  },
  {
    slug: "cache-side-channels",
    title: "Cache-Based Side Channel Analysis",
    description: "Studying how CPU cache behavior can leak information through timing side channels.",
    date: "2026",
    status: "Idea",
    tags: ["Security", "Cache", "Side Channels", "CPU"],
    category: "Security Research",
    motivation: "Cache timing attacks (like Spectre and Meltdown) demonstrate that microarchitectural features can leak sensitive information. Understanding these attacks requires deep knowledge of cache design.",
    method: "Studying cache architecture (L1/L2/L3), understanding eviction sets, analyzing timing differences, reviewing academic papers on cache attacks.",
    currentStatus: "Background study phase. Learning about cache architectures and existing attacks.",
  },
];

// ============================================================
// TIMELINE
// ============================================================

export interface TimelineEntry {
  year: string;
  title: string;
  items: string[];
}

export const timeline: TimelineEntry[] = [
  {
    year: "2024",
    title: "Started Computer Science",
    items: [
      "Began CS degree",
      "Learned Python and web fundamentals",
      "Started exploring Linux",
    ],
  },
  {
    year: "2025",
    title: "Systems & Networking",
    items: [
      "Deep dove into Linux",
      "Studied networking fundamentals",
      "Started systems programming in C",
      "First experiments with assembly",
    ],
  },
  {
    year: "2026",
    title: "Architecture & Security",
    items: [
      "Computer Architecture deep dive",
      "Building mini OS in x86 Assembly",
      "Cybersecurity research and learning",
      "AI + security projects",
      "Technical writing and documentation",
    ],
  },
];
