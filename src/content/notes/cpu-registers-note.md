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
