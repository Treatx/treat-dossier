import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Intro from './Intro';

const sections = {
  Abilities: [
    {
      title: "Cursed Technique",
      content: "Echo Partition — Treat exists in a glitched echo-layer of reality. He can slip between frames and act ahead of time.",
    },
    {
      title: "Passive Aura",
      content: "Desync Field — Enemies near Treat experience 200ms+ reaction delay while he remains unaffected.",
    },
    {
      title: "Black Flash Equivalent",
      content: "Packet Loss — A cursed strike that overloads an enemy's senses, stunning them in a lag spike of perception.",
    },
    {
      title: "Domain",
      content: "Dead Link Sanctuary — A network topology-based domain where Treat can rewrite space, delay enemy senses, and warp movement.",
    },
  ],
  Backstory: [
    {
      title: "Origin",
      content: "Treat wasn’t born with knowledge of his technique. He nearly died discovering it—ripped apart and rewired by his own glitch.",
    },
    {
      title: "Rebirth",
      content: "After that death, he returned. Muzzled. Rewritten. Alive again not out of mercy, but out of defiance.",
    },
  ],
  Personality: [
    {
      title: "Disposition",
      content: "Gojo-like: confident, unbothered, sarcastic—but deeply observant and protective of those with potential.",
    },
    {
      title: "Philosophy",
      content: "He believes strength without freedom is slavery. And he won’t let the higher-ups kill another kid under their rule.",
    },
  ],
};

export default function App() {
  const [menu, setMenu] = useState(true); // Starts true for menu (after intro, user chooses section)
  const [category, setCategory] = useState(null); // category null until user picks
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [volume, setVolume] = useState(0.15);
  const [showMenu, setShowMenu] = useState(false);

  const bgmRef = useRef(null);
  const currentSection = category ? sections[category]?.[index] : null;

  // Music play + ramp
  useEffect(() => {
    const audio = bgmRef.current;
    if (!audio) return;

    let volumeLevel = 0.0;
    audio.volume = volumeLevel;
    audio.loop = true;

    const tryPlay = () => {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          const ramp = setInterval(() => {
            if (volumeLevel < volume) {
              volumeLevel = Math.min(volumeLevel + 0.01, volume);
              audio.volume = volumeLevel;
            } else {
              clearInterval(ramp);
            }
          }, 100);
        }).catch((e) => {
          console.warn("Autoplay blocked, waiting for interaction:", e);
        });
      }
    };

    const delayPlay = setTimeout(tryPlay, 300);
    return () => clearTimeout(delayPlay);
  }, [volume]);

  // Autoplay fallback
  useEffect(() => {
    const resumeAudio = () => {
      const audio = bgmRef.current;
      if (audio && audio.paused) {
        audio.play().catch(() => {});
      }
      window.removeEventListener("click", resumeAudio);
    };
    window.addEventListener("click", resumeAudio);
    return () => window.removeEventListener("click", resumeAudio);
  }, []);

  // Typewriter
  useEffect(() => {
    if (!currentSection) return;
    const text = currentSection.content;
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayedText((prev) =>
          prev !== text.slice(0, i) ? text.slice(0, i) : prev
        );
        i++;
      } else {
        clearInterval(interval);
      }
    }, 35);
    return () => clearInterval(interval);
  }, [index, category]);

  const handleNext = () => {
    const nextIndex = index + 1;
    if (nextIndex < sections[category].length) {
      setIndex(nextIndex);
    } else {
      setMenu(true);
      setCategory(null);
      setIndex(0);
    }
  };

  const handleSelect = (key) => {
    setCategory(key);
    setIndex(0);
    setMenu(false);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col items-center justify-center px-6 py-12 relative">
      {/* Audio */}
      <audio ref={bgmRef} src="/bgm.mp3" preload="auto" />

      {/* Volume Control */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <label className="text-white text-sm">Volume</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-32 accent-green-500"
        />
      </div>

      <AnimatePresence mode="wait">
        {!showMenu ? (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Intro onFinish={() => setShowMenu(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full max-w-3xl flex flex-col items-center"
          >
            {menu ? (
              <div className="space-y-4 text-center">
                <h1 className="text-white text-3xl mb-6 tracking-widest">TREAT DOSSIER</h1>
                {Object.keys(sections).map((key) => {
                  const locked = key === "Backstory" || key === "Personality";
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
            ) : currentSection && (
              <motion.div
                key={currentSection.title}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-3xl flex flex-col items-center"
              >
                <motion.h2
                  className="text-white text-2xl uppercase tracking-wide mb-4"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentSection.title}
                </motion.h2>

                <div className="bg-zinc-900 border border-green-500 p-6 rounded-md w-full min-h-[160px] shadow-md mb-6">
                  <motion.div
                    key={displayedText}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <pre className="whitespace-pre-wrap break-words">{displayedText}</pre>
                  </motion.div>
                </div>

                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-green-500 text-black rounded hover:bg-green-400 transition font-semibold"
                >
                  {index + 1 < sections[category].length ? "Next" : "Back to Menu"}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
