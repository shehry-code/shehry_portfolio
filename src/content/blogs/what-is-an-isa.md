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

### MIP

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

```text
Your Code (C/Python/Java)
    ↓
Compiler / Interpreter
    ↓
Assembly Instructions (ISA)
    ↓
Microarchitecture (implementation)
    ↓
Transistors (physics)