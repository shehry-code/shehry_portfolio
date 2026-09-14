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

```
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
```

## Checking Process States

```bash
ps aux          # See all processes
ps -eo pid,stat,comm  # Show state codes
top             # Real-time view
/proc/[pid]/status    # Detailed info
```
