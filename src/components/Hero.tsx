import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { currentFocus, profile } from "../data/content";

const TERMINAL_COMMANDS = [
  "help",
  "whoami",
  "focus",
  "about",
  "projects",
  "notes",
  "writing",
  "date",
  "clear",
];

type TerminalEntry = { type: "command" | "output"; value: string };

const STATIC_TERMINAL_ENTRIES: TerminalEntry[] = [
  { type: "command", value: "whoami" },
  { type: "output", value: "shehry" },
  { type: "command", value: "cat focus.txt" },
  { type: "output", value: "→ cybersecurity" },
  { type: "output", value: "→ computer architecture" },
  { type: "output", value: "→ systems programming" },
  { type: "output", value: "→ reverse engineering" },
  { type: "command", value: "status" },
  { type: "output", value: "● learning..." },
  { type: "output", value: "● building..." },
  { type: "output", value: "● researching..." },
];

function formatCurrentDate() {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getFocusOutput() {
  return currentFocus.length > 0
    ? currentFocus
        .map((item) => item.label.toLowerCase())
        .filter((item, index, array) => array.indexOf(item) === index)
    : ["cybersecurity", "computer architecture", "systems programming", "reverse engineering"];
}

export default function Hero() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [terminalEntries, setTerminalEntries] = useState<TerminalEntry[]>(STATIC_TERMINAL_ENTRIES);
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const appendEntries = (entries: TerminalEntry[]) => {
    setTerminalEntries((previousEntries) => [...previousEntries, ...entries]);
  };

  const executeCommand = (rawCommand: string) => {
    const trimmedCommand = rawCommand.trim();

    if (!trimmedCommand) {
      return;
    }

    const normalizedCommand = trimmedCommand.toLowerCase();

    setCommandHistory((previousHistory) => {
      const lastEntry = previousHistory[previousHistory.length - 1];
      if (lastEntry === normalizedCommand) {
        return previousHistory;
      }

      return [...previousHistory, normalizedCommand];
    });
    setHistoryIndex(-1);

    const commandEntry: TerminalEntry = { type: "command", value: trimmedCommand };

    if (normalizedCommand === "help") {
      appendEntries([
        commandEntry,
        { type: "output", value: "Available commands:" },
        { type: "output", value: "help Show available commands" },
        { type: "output", value: "whoami Who I am" },
        { type: "output", value: "focus Current technical focus" },
        { type: "output", value: "about About this portfolio" },
        { type: "output", value: "projects View projects" },
        { type: "output", value: "notes View handwritten notes" },
        { type: "output", value: "writing View featured writing" },
        { type: "output", value: "date Show current date" },
        { type: "output", value: "clear Clear terminal" },
      ]);
      return;
    }

    if (normalizedCommand === "whoami") {
      appendEntries([commandEntry, { type: "output", value: profile.name.toLowerCase() }]);
      return;
    }

    if (normalizedCommand === "focus") {
      appendEntries([
        commandEntry,
        ...getFocusOutput().map((focusItem) => ({ type: "output" as const, value: focusItem })),
      ]);
      return;
    }

    if (normalizedCommand === "about") {
      appendEntries([commandEntry, { type: "output", value: profile.description }]);
      return;
    }

    if (normalizedCommand === "projects") {
      appendEntries([commandEntry, { type: "output", value: "navigating to /projects..." }]);
      navigate("/projects");
      return;
    }

    if (normalizedCommand === "notes") {
      appendEntries([commandEntry, { type: "output", value: "navigating to /notes..." }]);
      navigate("/notes");
      return;
    }

    if (normalizedCommand === "writing") {
      appendEntries([commandEntry, { type: "output", value: "navigating to /research..." }]);
      navigate("/research");
      return;
    }

    if (normalizedCommand === "date") {
      appendEntries([commandEntry, { type: "output", value: formatCurrentDate() }]);
      return;
    }

    if (normalizedCommand === "clear") {
      setTerminalEntries([]);
      setInputValue("");
      return;
    }

    appendEntries([
      commandEntry,
      { type: "output", value: `command not found: ${trimmedCommand}` },
    ]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      executeCommand(inputValue);
      setInputValue("");
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const query = inputValue.trim().toLowerCase();

      if (!query) {
        return;
      }

      const matches = TERMINAL_COMMANDS.filter((command) => command.startsWith(query));

      if (matches.length === 1) {
        setInputValue(matches[0]);
        return;
      }

      if (matches.length > 1) {
        appendEntries([{ type: "output", value: `matches: ${matches.join("  ")}` }]);
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (commandHistory.length === 0) {
        return;
      }

      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setInputValue(commandHistory[nextIndex]);
      setHistoryIndex(nextIndex);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (commandHistory.length === 0 || historyIndex === -1) {
        if (historyIndex === -1 && inputValue !== "") {
          setInputValue("");
        }
        return;
      }

      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setInputValue("");
        setHistoryIndex(-1);
        return;
      }

      setInputValue(commandHistory[nextIndex]);
      setHistoryIndex(nextIndex);
    }
  };

  return (
    <section className="relative flex min-h-[88vh] items-center grid-bg">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="hero-layout">
          <div className="animate-fade-in hero-copy">
            <div className="mb-5">
              <span className="hero-badge">{profile.title}</span>
            </div>

            <h1 className="hero-title">
              <span>Computer Science</span>
              <span className="hero-subtitle">Systems • Security</span>
            </h1>

            <p className="hero-intro">
              Studying computers from the hardware up — from transistors and logic, through CPU architecture and systems, to security and software.
            </p>

            <div className="flex flex-wrap gap-3 pb-8 pt-2">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg-primary transition-colors hover:bg-accent/90"
              >
                View Projects
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent/30 hover:text-accent"
              >
                Read Blog
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 pb-8" aria-label="Current focus areas">
              {currentFocus.map((item) => (
                <span key={item.label} className="hero-chip">
                  {item.label}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="social-link"
              >
                <Github size={16} />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="social-link"
              >
                <Linkedin size={16} />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="social-link"
              >
                <Mail size={16} />
                <span className="hidden sm:inline">Email</span>
              </a>
            </div>
          </div>

          <div className="animate-fade-in hero-terminal-wrap" style={{ animationDelay: "0.15s" }}>
            <div className="terminal hero-terminal" aria-label="Portfolio terminal">
              <div className="terminal-header">
                <div className="terminal-dot" style={{ backgroundColor: "#f87171" }} />
                <div className="terminal-dot" style={{ backgroundColor: "#fbbf24" }} />
                <div className="terminal-dot" style={{ backgroundColor: "#34d399" }} />
                <span className="ml-2 text-xs font-mono text-text-muted">~/shehry</span>
              </div>

              <div className="terminal-body">
                <div className="terminal-output-list" aria-live="polite" aria-atomic="false">
                  {terminalEntries.map((entry, index) => (
                    <div key={`${entry.type}-${index}`} className={entry.type === "command" ? "terminal-line" : "terminal-output"}>
                      {entry.type === "command" ? (
                        <>
                          <span className="terminal-prompt">$</span>
                          <span className="terminal-command">{entry.value}</span>
                        </>
                      ) : (
                        entry.value
                      )}
                    </div>
                  ))}
                </div>

                <label htmlFor="portfolio-terminal-input" className="sr-only">
                  Terminal command input
                </label>
                <div className="terminal-input-row">
                  <span className="terminal-prompt">$</span>
                  <input
                    id="portfolio-terminal-input"
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                    className="terminal-input"
                    aria-label="Terminal command input"
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    placeholder="type a command"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
