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
