import { useState, useRef, useEffect } from "react";

export default function Terminal({ onExit }) {
  const [history, setHistory] = useState([
    "Welcome to Treat's Terminal.",
    "Type `help` to see available commands.",
  ]);
  const [input, setInput] = useState("");
  const [locked, setLocked] = useState(true);
  const terminalRef = useRef(null);

  const commands = {
    help: [
      "`help` - List commands",
      "`access memories` - View a personal reflection",
      "`unlock dossier` - Unlock classified records (password required)",
      "`clear` - Clear terminal",
      "`exit` - Return to menu",
    ],
    "access memories": [
      "I'm sorry for what happened on that dreadful day..."
    ],
    "unlock dossier": () => {
      const password = prompt("Enter password:");
      if (password === "glitch") {
        setLocked(false);
        return ["Dossier Unlocked."];
      } else {
        return ["Access Denied."];
      }
    },
    clear: () => [],
    exit: () => {
      onExit();
      return [];
    }
  };

  const handleCommand = () => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;

    let output = [`> ${trimmed}`];
    if (commands[trimmed]) {
      const response = commands[trimmed];
      const lines = typeof response === "function" ? response() : response;
      output = [...output, ...lines];
    } else {
      output.push("Unrecognized command.");
    }

    setHistory((prev) =>
      trimmed === "clear" ? [] : [...prev, ...output]
    );
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
