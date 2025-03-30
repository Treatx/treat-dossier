// Dossier.jsx
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections = {
  Abilities: [
    {
      title: "Cursed Technique",
      content:
        "Echo Partition — Treat exists in a glitched echo-layer of reality. He can slip between frames and act ahead of time.",
    },
    {
      title: "Passive Aura",
      content:
        "Desync Field — Enemies near Treat experience 200ms+ reaction delay while he remains unaffected.",
    },
    {
      title: "Black Flash Equivalent",
      content:
        "Packet Loss — A cursed strike that overloads an enemy's senses, stunning them in a lag spike of perception.",
    },
    {
      title: "Domain",
      content:
        "Dead Link Sanctuary — A network topology-based domain where Treat can rewrite space, delay enemy senses, and warp movement.",
    },
  ],
  Backstory: [],
  Personality: [],
};

export default function Dossier() {
  const [menu, setMenu] = useState(true);
  const [category, setCategory] = useState("");
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");

  const currentSection = sections[category]?.[index];

  useEffect(() => {
    if (!currentSection) return;
    const text = currentSection.content;
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayedText(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [index, category]);

  const handleNext = () => {
    const nextIndex = index + 1;
    if (nextIndex < sections[category].length) {
      setIndex(nextIndex);
    } else {
      setMenu(true);
      setCategory("");
      setIndex(0);
    }
  };

  const handleSelect = (key) => {
    setCategory(key);
    setIndex(0);
    setMenu(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {menu ? (
        <div className="space-y-4 text-center">
          <h1 className="text-white text-3xl mb-6 tracking-widest">TREAT DOSSIER</h1>
          {Object.keys(sections).map((key) => {
            const locked = sections[key].length === 0;
            return (
              <button
                key={key}
                onClick={() => !locked && handleSelect(key)}
                disabled={locked}
                className={`block w-64 border py-2 px-4 rounded transition ${
                  locked
                    ? "border-zinc-700 text-zinc-500 cursor-not-allowed"
                    : "border-green-500 hover:bg-green-500 hover:text-black"
                }`}
              >
                {locked ? `${key} (Locked)` : key}
              </button>
            );
          })}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection?.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-3xl flex flex-col items-center"
          >
            <motion.h2
              className="text-white text-2xl uppercase tracking-wide mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {currentSection?.title}
            </motion.h2>

            <div className="bg-zinc-900 border border-green-500 p-6 rounded-md w-full min-h-[160px] shadow-md mb-6">
              <pre className="whitespace-pre-wrap break-words">{displayedText}</pre>
            </div>

            <button
              onClick={handleNext}
              className="px-6 py-2 bg-green-500 text-black rounded hover:bg-green-400 transition font-semibold"
            >
              {index + 1 < sections[category]?.length ? "Next" : "Back to Menu"}
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
