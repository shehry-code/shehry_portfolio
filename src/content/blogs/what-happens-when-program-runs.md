## The Journey

When you run a program, an enormous amount of work happens before the first instruction executes. Let's trace the full path.

## Step 1: Source Code

```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

This is human-readable. The CPU cannot execute this directly.

## Step 2: Preprocessing

The preprocessor handles directives:
- Expands `#include` files
- Processes `#define` macros
- Handles conditional compilation

## Step 3: Compilation

The compiler translates C code into assembly:

```asm
main:
    push rbp
    mov rbp, rsp
    lea rdi, [rip + .LC0]  ; "Hello, World!"
    call printf
    xor eax, eax            ; return 0
    pop rbp
    ret
```

## Step 4: Assembly

The assembler converts assembly into machine code — binary instructions the CPU can execute.

## Step 5: Linking

The linker combines object files, resolves symbols, and produces the final executable. It connects your `printf` call to the actual implementation in libc.

## Step 6: Loading

When you run the program:
1. The shell calls `execve()`
2. The kernel reads the ELF header
3. Memory is allocated (virtual address space)
4. The program is loaded into memory
5. The dynamic linker resolves shared libraries
6. Control transfers to `_start`

## Step 7: Execution

The CPU begins fetching and executing instructions:
1. **Fetch**: Read instruction from memory (via cache)
2. **Decode**: Determine what the instruction does
3. **Execute**: Perform the operation
4. **Memory**: Access data if needed
5. **Writeback**: Store results

This cycle repeats billions of times per second.

## The Full Stack

```text
Source Code (human)
    ↓
Preprocessor
    ↓
Compiler → Assembly
    ↓
Assembler → Machine Code
    ↓
Linker → Executable
    ↓
Loader → Memory
    ↓
CPU → Execution
    ↓
Transistors → Physics
```

## Conclusion

A simple "Hello World" involves preprocessing, compilation, assembly, linking, loading, and execution. Each layer abstracts the one below it. Understanding these layers is what separates people who use computers from people who understand them.
