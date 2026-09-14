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

```text
        Column 0  Column 1  Column 2  Column 3
Row 0:  [cell]    [cell]    [cell]    [cell]
Row 1:  [cell]    [cell]    [cell]    [cell]
Row 2:  [cell]    [cell]    [cell]    [cell]
Row 3:  [cell]    [cell]    [cell]    [cell]
```

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
