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
