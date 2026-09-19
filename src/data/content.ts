

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
    status: "Coming Soon",
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
    status: "Coming Soon",
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
    status: "Coming Soon",
    github: "https://github.com/shehry-code",
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
    status: "Coming Soon",
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
    title: "How DRAM Stores Data. And what are the isssues with the scalibility of DRAM.",
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
    slug: "what-happens-when-program-runs",
    title: "What Actually Happens When a Program Runs?",
    description: "Tracing the journey of a program from source code to execution — the full stack of abstraction.",
    date: "2026-10-01",
    updated: "2026-09-17",
    tags: ["Systems", "Compilers", "Operating Systems", "CPU"],
    category: "Systems",
    featured: true,
    draft: false,
    readingTime: 4,
    content: blogContent["../content/blogs/what-happens-when-program-runs.md"],
  },


  {
    slug: "why-learn-computer-architecture",
    title: "Why I Started Learning Computer Architecture",
    description: "A personal reflection on why understanding computer architecture matters, even if you're not building CPUs. And for me its fun.",
    date: "2026-06-15",
    tags: ["Computer Architecture", "Learning", "Systems"],
    category: "Personal",
    featured: false,
    draft: false,
    readingTime: 5,
    content: blogContent["../content/blogs/why-learn-computer-architecture.md"],
  },
  {
    slug: "How-user-define-functions-work-at-the-assembly-level",
    title: "How User-Defined Functions Work at the Assembly Level",
    description: "Exploring the mechanics of function calls and returns in assembly language.And how stack is used to manage function calls.",
    date: "2026-10-01",
    tags: ["Systems", "Assembly", "Nasm", "CPU"],
    category: "Systems",
    featured: true,
    draft: false,
    readingTime: 10,
    content: blogContent["../content/blogs/how-user-define-functions-work-at-the-assembly-level.md"],
  },

];


// ============================================================
// NOTES
// ============================================================

const noteContent = import.meta.glob(
  "../content/notes/*.md",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
) as Record<string, string>;

export interface NotePage {
  image?: string;
  alt: string;
}

export interface Note {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  pages: NotePage[];
}

export const notes: Note[] = [
  {
    slug: "mos-transistors",
    title: "MOS Transistors",
    description: "How Metal-Oxide-Semiconductor transistors work as the fundamental building block of digital circuits.",
    date: "2026-05-10",
    tags: ["Digital Logic", "Hardware", "Transistors"],
    category: "Digital Logic",
    pages: [],
  },
  {
    slug: "flip-flops",
    title: "Flip-Flops",
    description: "How flip-flops store a single bit of data — the foundation of sequential logic and memory.",
    date: "2026-05-15",
    tags: ["Digital Logic", "Sequential Logic", "Memory"],
    category: "Digital Logic",
    pages: [],
  },
  {
    slug: "cpu-registers-note",
    title: "CPU Registers",
    description: "Quick reference for x86-64 general purpose and special purpose registers.",
    date: "2026-06-01",
    tags: ["x86", "Assembly", "CPU", "Registers"],
    category: "Computer Architecture",
    pages: [],
  },
  {
    slug: "dram-row-buffer",
    title: "DRAM Row Buffer",
    description: "Understanding the row buffer mechanism in DRAM and its impact on memory access patterns.",
    date: "2026-06-20",
    tags: ["DRAM", "Memory", "Computer Architecture"],
    category: "Computer Architecture",
    pages: [
      {
        image: "/notes/dram-row-buffer/dram-row-buffer.jpg",
        alt: "Handwritten DRAM row buffer note illustration",
      },
    ],
  },
  {
    slug: "tcp-vs-udp",
    title: "TCP vs UDP",
    description: "Key differences between TCP and UDP transport protocols and when to use each.",
    date: "2026-07-05",
    tags: ["Networking", "TCP", "UDP", "Protocols"],
    category: "Networking",
    pages: [],
  },
  {
    slug: "linux-process-states",
    title: "Linux Process States",
    description: "Understanding the different states a process can be in on a Linux system.",
    date: "2026-07-20",
    tags: ["Linux", "Operating Systems", "Processes"],
    category: "Operating Systems",
    pages: [{"image":"/notes/linux-process-states/page-f60a2237-d7d3-4bcf-890a-94ffbab9b93c.jpg","alt":"dram-row-buffer.jpg"}],
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
