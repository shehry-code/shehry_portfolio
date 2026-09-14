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

```text
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
```

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
