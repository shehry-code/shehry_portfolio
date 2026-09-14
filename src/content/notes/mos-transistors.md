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
