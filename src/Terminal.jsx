import { useState, useRef, useEffect } from "react";

export default function Terminal({ onExit }) {
  const [history, setHistory] = useState([
    "Welcome to Treat's Terminal.",
    "Type `help` to see available commands.",
  ]);
  const [input, setInput] = useState("");
  const [lastLogUnlocked, setLastLogUnlocked] = useState(false);
  const terminalRef = useRef(null);

  const glitchText = () => {
    const chars = "AM I?".split("");
    return chars
      .map((char) => (Math.random() < 0.2 ? String.fromCharCode(33 + Math.random() * 94) : char))
      .join("");
  };

  const logEntries = {
    "001": "TEXT.LOG.001",
    "009": "TEXT.LOG.009",
    "023": "TEXT.LOG.023",
    "02%": "TEXT.LOG.02%",
  };

  const logContents = {
    "001": "TEXT.LOG.001: \"Where did they go...Where am I...Who...Are you..?\"",
    "009": "TEXT.LOG.009: \"W-What are you doing? Back off! Get the FUCK away from me you fuck!\"",
    "023": "TEXT.LOG.023: \"...Who are you...? Where am I...? Who...-\"",
    "02%": <span key="glitch" className="animate-pulse text-red-500">TEXT.LOG.02%: "{glitchText()}"</span>,
  };

  const commands = {
    help: [
      "`help` - List commands",
      "`logs` - List available logs",
      "`access log [id]` - View specific memory log (e.g. access log 001)",
      "`clear` - Clear terminal",
      "`exit` - Return to menu",
    ],
    logs: Object.values(logEntries),
    clear: () => [],
    exit: () => {
      onExit?.();
      return [];
    },
  };

  const handleCommand = () => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;

    let output = [`> ${trimmed}`];

    if (trimmed.startsWith("access log")) {
      const parts = trimmed.split(" ");
      const logId = parts[2];
      if (logContents[logId]) {
        if (logId === "02%" && !lastLogUnlocked) {
          const attempt = prompt("Access restricted. Enter password:");
          if (attempt === "kernel.404") {
            setLastLogUnlocked(true);
            output.push(logContents[logId]);
          } else {
            output.push("Nice try.");
          }
        } else {
          output.push(logContents[logId]);
        }
      } else {
        output.push("Log not found.");
      }
    } else if (commands[trimmed]) {
      const response = commands[trimmed];
      const lines = typeof response === "function" ? response() : response;
      output = [...output, ...lines];
    } else {
      output.push("Unrecognized command.");
    }

    setHistory((prev) => (trimmed === "clear" ? [] : [...prev, ...output]));
    setInput("");
  };

  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [history]);

  return (
    <div className="w-full max-w-3xl flex flex-col items-center text-green-400">
      <h2 className="text-white text-2xl uppercase tracking-wide mb-4">System Terminal</h2>

      <div
        ref={terminalRef}
        className="bg-zinc-900 border border-green-500 p-4 w-full h-80 overflow-y-auto rounded text-sm whitespace-pre-wrap font-mono"
      >
        {history.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        <div className="flex mt-2">
          <span className="pr-2">{">"}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCommand()}
            className="bg-transparent outline-none text-green-400 flex-grow"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
