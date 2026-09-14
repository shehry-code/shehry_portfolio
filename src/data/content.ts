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
    github: "https://github.com/shehry/mini-os",
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
    content: `
## Introduction

An **Instruction Set Architecture** (ISA) is the abstract model that defines how a CPU operates. It's the contract between hardware and software — the set of rules that tells a processor what instructions it can execute and how.

Think of it as the language a CPU speaks. Just as you need to know English to read this sentence, a program must be written in the CPU's ISA to be executed.

## What Does an ISA Define?

An ISA specifies several critical things:

- **Instructions**: What operations the CPU can perform (ADD, MOV, JMP, etc.)
- **Registers**: The internal storage locations available to programs
- **Memory Model**: How the CPU addresses and accesses memory
- **Data Types**: What sizes of data the CPU can work with natively
- **Interrupts**: How the CPU handles external events

## Common ISAs

### x86
The most widespread ISA in personal computers. Originally 16-bit, now 64-bit (x86-64). Complex instruction set (CISC) with variable-length instructions.

### ARM
Dominant in mobile devices and increasingly in servers. Reduced instruction set (RISC) with fixed-length instructions. Power-efficient by design.

### MIPS
A clean, simple RISC ISA often used in education. Its simplicity makes it ideal for learning how processors actually work.

### RISC-V
An open-source ISA gaining momentum. Modular design allows custom extensions.

## Why ISA Matters

The ISA is where software meets hardware. Understanding it helps you:

1. Write more efficient code
2. Understand compiler output
3. Debug at a lower level
4. Understand security vulnerabilities
5. Design better systems

## The Layer Beneath

\`\`\`
Your Code (C/Python/Java)
    ↓
Compiler / Interpreter
    ↓
Assembly Instructions (ISA)
    ↓
Microarchitecture (implementation)
    ↓
Transistors (physics)
\`\`\`

The ISA sits right at this boundary. It's abstract enough to allow different implementations, but concrete enough that programmers can reason about performance.

## Conclusion

The ISA is one of the most important abstractions in computing. It defines what's possible on a processor and shapes everything above it. Understanding ISA is understanding the foundation of all software execution.
`,
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
    content: `
## The DRAM Cell

At its core, a DRAM cell is remarkably simple: **one transistor and one capacitor** store one bit of data.

- Charged capacitor → 1
- Discharged capacitor → 0

That's it. Billions of these tiny cells make up your RAM.

## Why "Dynamic"?

The capacitor leaks charge over time. Without intervention, the stored bit fades away. This is why DRAM needs to be **refreshed** periodically — typically every 64ms.

This is in contrast to SRAM, which uses six transistors per cell but doesn't need refreshing (hence "static").

## Organization: Rows and Columns

DRAM is organized in a grid:

\`\`\`
        Column 0  Column 1  Column 2  Column 3
Row 0:  [cell]    [cell]    [cell]    [cell]
Row 1:  [cell]    [cell]    [cell]    [cell]
Row 2:  [cell]    [cell]    [cell]    [cell]
Row 3:  [cell]    [cell]    [cell]    [cell]
\`\`\`

- **Wordlines** run horizontally (rows)
- **Bitlines** run vertically (columns)

## Accessing Data

A DRAM access involves three key operations:

### 1. ACTIVATE (Row Access)
The memory controller asserts a wordline, connecting an entire row of cells to their respective bitlines. The tiny charge from each cell is sensed by **sense amplifiers**.

### 2. READ / WRITE (Column Access)
Once the row is active, specific columns are selected to read or write data.

### 3. PRECHARGE
The row is closed, bitlines are equalized, and the array is ready for the next access.

## The Row Buffer

When a row is activated, its contents are copied into the **row buffer** — a fast cache that holds the active row. Subsequent accesses to the same row (row hits) are much faster than accessing a different row (row misses).

## Timing Parameters

DRAM has strict timing requirements:

| Parameter | Meaning |
|-----------|---------|
| tRCD | Row-to-Column Delay |
| tCAS | Column Address Strobe Latency |
| tRP | Row Precharge Time |
| tRAS | Row Active Strobe |

These define the minimum time between operations.

## Security Implications

DRAM is not just an academic topic — it has real security implications:

- **RowHammer**: Repeatedly accessing a row can flip bits in adjacent rows
- **Cold Boot Attacks**: DRAM retains data briefly after power loss
- **Side Channels**: Memory timing can leak information

## Conclusion

DRAM is one of the most important components in any computer system. Understanding how it works — from the single transistor-capacitor cell to the complex timing of modern DDR modules — gives you insight into a fundamental layer of computing.
`,
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
    content: `
## What Are Registers?

CPU registers are tiny, ultra-fast storage locations **inside the processor itself**. They're the fastest memory in any computer system — faster than L1 cache, which is faster than RAM.

## Why Registers Exist

Accessing main memory takes hundreds of CPU cycles. Registers take zero additional cycles — they're part of the CPU's execution engine. Every arithmetic operation, every memory address calculation, every branch decision happens through registers.

## x86-64 General Purpose Registers

\`\`\`asm
RAX  — Accumulator (return values, arithmetic)
RBX  — Base register (general purpose)
RCX  — Counter (loop counters, shift counts)
RDX  — Data (I/O, multiplication/division)
RSI  — Source Index (string operations)
RDI  — Destination Index (string operations)
RSP  — Stack Pointer
RBP  — Base Pointer (stack frame)
R8-R15 — Additional general purpose registers
\`\`\`

## Special Purpose Registers

- **RIP** — Instruction Pointer (address of next instruction)
- **RFLAGS** — Status flags (zero, carry, overflow, etc.)
- **CR0-CR4** — Control registers (paging, protection modes)
- **Segment Registers** — CS, DS, SS, ES, FS, GS

## Register File

The register file is implemented as a set of flip-flops — the same fundamental building blocks used throughout digital logic. In modern CPUs, register renaming maps architectural registers to a larger physical register file to enable out-of-order execution.

## The Register-Memory Gap

\`\`\`
Registers:    ~0 cycles     (inside CPU)
L1 Cache:     ~4 cycles     (inside CPU)
L2 Cache:     ~12 cycles    (inside CPU)
L3 Cache:     ~40 cycles    (on chip)
Main Memory:  ~200 cycles   (separate chip)
Disk:         ~millions     (I/O device)
\`\`\`

This hierarchy is why efficient code keeps frequently-used data in registers.

## In Assembly

\`\`\`asm
mov rax, 42      ; Load 42 into RAX
add rax, rbx     ; RAX = RAX + RBX
mov [rsp], rax   ; Store RAX to memory (stack)
\`\`\`

Every instruction operates on registers. Even memory operations typically load data into a register first, then operate on it.

## Conclusion

Registers are the foundation of all computation. Understanding them is essential for assembly programming, compiler design, performance optimization, and reverse engineering.
`,
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
    content: `
## The Journey

When you run a program, an enormous amount of work happens before the first instruction executes. Let's trace the full path.

## Step 1: Source Code

\`\`\`c
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
\`\`\`

This is human-readable. The CPU cannot execute this directly.

## Step 2: Preprocessing

The preprocessor handles directives:
- Expands \`#include\` files
- Processes \`#define\` macros
- Handles conditional compilation

## Step 3: Compilation

The compiler translates C code into assembly:

\`\`\`asm
main:
    push rbp
    mov rbp, rsp
    lea rdi, [rip + .LC0]  ; "Hello, World!"
    call printf
    xor eax, eax            ; return 0
    pop rbp
    ret
\`\`\`

## Step 4: Assembly

The assembler converts assembly into machine code — binary instructions the CPU can execute.

## Step 5: Linking

The linker combines object files, resolves symbols, and produces the final executable. It connects your \`printf\` call to the actual implementation in libc.

## Step 6: Loading

When you run the program:
1. The shell calls \`execve()\`
2. The kernel reads the ELF header
3. Memory is allocated (virtual address space)
4. The program is loaded into memory
5. The dynamic linker resolves shared libraries
6. Control transfers to \`_start\`

## Step 7: Execution

The CPU begins fetching and executing instructions:
1. **Fetch**: Read instruction from memory (via cache)
2. **Decode**: Determine what the instruction does
3. **Execute**: Perform the operation
4. **Memory**: Access data if needed
5. **Writeback**: Store results

This cycle repeats billions of times per second.

## The Full Stack

\`\`\`
Source Code (human)
    ↓
Preprocessor
    ↓
Compiler → Assembly
    ↓
Assembler → Machine Code
    ↓
Linker → Executable
    ↓
Loader → Memory
    ↓
CPU → Execution
    ↓
Transistors → Physics
\`\`\`

## Conclusion

A simple "Hello World" involves preprocessing, compilation, assembly, linking, loading, and execution. Each layer abstracts the one below it. Understanding these layers is what separates people who use computers from people who understand them.
`,
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
    content: `
## The Question

"Why bother learning computer architecture? I'm not building CPUs."

I asked myself this too. Here's why I decided to go deep.

## The Abstraction Problem

Modern software development is built on layers of abstraction. Most of us work at the top — frameworks, libraries, APIs. There's nothing wrong with that. But I realized I couldn't answer basic questions:

- What actually happens when I call a function?
- How does memory really work?
- Why is my code slow?
- What's happening at the hardware level?

## What Changed

Once I started learning architecture, everything clicked:

**Performance** makes sense when you understand caches, pipelining, and branch prediction.

**Security** makes sense when you understand memory layout, privilege levels, and hardware vulnerabilities.

**Systems programming** makes sense when you understand registers, virtual memory, and system calls.

## The Layers

\`\`\`
Applications
    ↓
Languages & Frameworks
    ↓
Compilers & Runtimes
    ↓
Operating Systems
    ↓
Instruction Set Architecture
    ↓
Microarchitecture
    ↓
Digital Logic
    ↓
Transistors
\`\`\`

Each layer exists because of the one below it. You don't need to understand all of them. But understanding more of them makes you a better engineer.

## What I'm Doing

- Studying computer architecture formally
- Writing assembly code
- Building a mini operating system
- Reading about CPU design
- Experimenting with Linux internals
- Documenting everything I learn

## The Goal

Not to become a CPU designer. But to be an engineer who understands the full stack — from application code down to electrons moving through transistors.

That understanding changes how you write software, debug problems, and think about systems.

## Conclusion

Computer architecture isn't just for hardware engineers. It's for anyone who wants to truly understand computing. And once you start seeing the layers, you can't unsee them.
`,
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
