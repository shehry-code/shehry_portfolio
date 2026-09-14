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
