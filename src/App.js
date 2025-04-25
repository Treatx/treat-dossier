import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Intro from "./Intro";
import MainTitle from "./MainTitle";
import Snowfall from "./Snowfall";
import Terminal from "./Terminal";
import Dossier from "./Dossier";
import Story from "./story";

const sections = {
  Abilities: [], // Locked
  Backstory: [
    {
      title: "Origin",
      content: "Treat wasn’t born with knowledge of his technique...",
    },
    {
      title: "Rebirth",
      content: "After that death, he returned. Muzzled. Rewritten...",
    },
  ],
  Personality: [
    {
      title: "Disposition",
      content: "Gojo-like: confident, sarcastic, observant...",
    },
    {
      title: "Philosophy",
      content: "He believes strength without freedom is slavery...",
    },
  ],
  Terminal: [
    {
      title: "System Terminal",
      content: "Enter `help` to see available commands."
    },
  ],
};

export default function App() {
  const [state, setState] = useState("main-title");
  const [menu, setMenu] = useState(true);
  const [category, setCategory] = useState(null);
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [volume, setVolume] = useState(0.15);
  const [snowOpacity, setSnowOpacity] = useState(0);
  const [blackScreen, setBlackScreen] = useState(false);
  const bgmRef = useRef(null);

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

  const handleEnter = () => {
    setState("transitioning");
    setTimeout(() => {
      let step = 0;
      const fadeIn = setInterval(() => {
        step += 0.02;
        setSnowOpacity(step);
        if (step >= 1) clearInterval(fadeIn);
      }, 60);

      setTimeout(() => {
        setState("intro");
      }, 3000);
    }, 1500);
  };

  const fadeOutSnowFullyThenTransition = () => {
    let step = snowOpacity;
    const fadeOut = setInterval(() => {
      step = Math.max(0, step - 0.05);
      setSnowOpacity(step);
      if (step <= 0) {
        clearInterval(fadeOut);
        setBlackScreen(true);
        setTimeout(() => {
          setBlackScreen(false);
          setState("menu");
        }, 2000);
      }
    }, 40);
  };

  const currentSection = category ? sections[category]?.[index] : null;

  // ✅ Music effect: intro only
  useEffect(() => {
    if (state === "intro" && bgmRef.current) {
      const audio = bgmRef.current;
      let volumeLevel = 0;
      audio.volume = volumeLevel;
      audio.loop = true;

      const rampUp = setInterval(() => {
        if (volumeLevel < volume) {
          volumeLevel = Math.min(volumeLevel + 0.01, volume);
          audio.volume = volumeLevel;
        } else {
          clearInterval(rampUp);
        }
      }, 100);

      const startAudio = setTimeout(() => {
        audio.play().catch(() => {
          console.warn("Autoplay blocked");
        });
      }, 500);

      return () => {
        clearInterval(rampUp);
        clearTimeout(startAudio);
      };
    }
  }, [state, volume]);

  // ✅ Always sync volume when slider changes
  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col items-center justify-center px-6 py-12 relative">
      {(state === "intro" || state === "transitioning") && (
        <motion.div
          style={{ opacity: snowOpacity }}
          animate={{ opacity: snowOpacity }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <Snowfall />
        </motion.div>
      )}

      {state !== "main-title" && <audio ref={bgmRef} src="/bgm.mp3" preload="auto" />}

      {blackScreen && (
        <motion.div
          className="absolute inset-0 bg-black z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      )}

      <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
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
        {state === "main-title" && (
          <motion.div key="title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <MainTitle onEnter={handleEnter} />
          </motion.div>
        )}

        {state === "intro" && (
          <motion.div key="intro" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <Intro onFinish={fadeOutSnowFullyThenTransition} />
          </motion.div>
        )}

        {state === "menu" && (
          <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="w-full max-w-3xl flex flex-col items-center">
            {menu ? (
              <div className="space-y-4 text-center">
                <h1 className="text-white text-3xl mb-6 tracking-widest">TREAT DOSSIER</h1>
                {["Story", "Abilities", "Backstory", "Personality", "Terminal"].map((key) => {
                  const locked = key !== "Terminal" && key !== "Story";
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
            ) : category === "Terminal" ? (
              <Terminal onExit={() => setMenu(true)} />
            ) : category === "Story" ? (
              <Story onExit={() => setMenu(true)} />
            ) : (
              <Dossier
                section={sections[category]}
                index={index}
                onNext={handleNext}
                title={currentSection?.title || ""}
                text={displayedText}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// trigger redeploy

