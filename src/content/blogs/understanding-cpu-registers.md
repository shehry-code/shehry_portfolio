## What Are Registers?

CPU registers are tiny, ultra-fast storage locations **inside the processor itself**. They're the fastest memory in any computer system — faster than L1 cache, which is faster than RAM.

## Why Registers Exist

Accessing main memory takes hundreds of CPU cycles. Registers take zero additional cycles — they're part of the CPU's execution engine. Every arithmetic operation, every memory address calculation, every branch decision happens through registers.

## x86-64 General Purpose Registers

```asm
RAX  — Accumulator (return values, arithmetic)
RBX  — Base register (general purpose)
RCX  — Counter (loop counters, shift counts)
RDX  — Data (I/O, multiplication/division)
RSI  — Source Index (string operations)
RDI  — Destination Index (string operations)
RSP  — Stack Pointer
RBP  — Base Pointer (stack frame)
R8-R15 — Additional general purpose registers
```

## Special Purpose Registers

- **RIP** — Instruction Pointer (address of next instruction)
- **RFLAGS** — Status flags (zero, carry, overflow, etc.)
- **CR0-CR4** — Control registers (paging, protection modes)
- **Segment Registers** — CS, DS, SS, ES, FS, GS

## Register File

The register file is implemented as a set of flip-flops — the same fundamental building blocks used throughout digital logic. In modern CPUs, register renaming maps architectural registers to a larger physical register file to enable out-of-order execution.

## The Register-Memory Gap

```text
Registers:    ~0 cycles     (inside CPU)
L1 Cache:     ~4 cycles     (inside CPU)
L2 Cache:     ~12 cycles    (inside CPU)
L3 Cache:     ~40 cycles    (on chip)
Main Memory:  ~200 cycles   (separate chip)
Disk:         ~millions     (I/O device)
```

This hierarchy is why efficient code keeps frequently-used data in registers.

## In Assembly

```asm
mov rax, 42      ; Load 42 into RAX
add rax, rbx     ; RAX = RAX + RBX
mov [rsp], rax   ; Store RAX to memory (stack)
```

Every instruction operates on registers. Even memory operations typically load data into a register first, then operate on it.

## Conclusion

Registers are the foundation of all computation. Understanding them is essential for assembly programming, compiler design, performance optimization, and reverse engineering.
