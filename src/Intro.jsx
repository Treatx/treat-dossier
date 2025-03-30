// Intro.jsx - Fix first line cut-in by ensuring fade logic applies on mount
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const introLines = [
  "I don't know what a good person in life is...",
  "But whoever that person is, I know it's not me.",
  "But this time, maybe I can make it right."
];

export default function Intro({ onFinish }) {
  const [index, setIndex] = useState(0);
  const [showLine, setShowLine] = useState(false);

  useEffect(() => {
    const fadeInStart = setTimeout(() => setShowLine(true), 100); // Ensures mount transition

    if (index < introLines.length) {
      const lineTimer = setTimeout(() => {
        setShowLine(false);
        const nextTimer = setTimeout(() => {
          setIndex((prev) => prev + 1);
        }, 800);
        return () => clearTimeout(nextTimer);
      }, 3000);
      return () => {
        clearTimeout(lineTimer);
        clearTimeout(fadeInStart);
      };
    } else {
      const finishTimer = setTimeout(() => onFinish(), 1000);
      return () => clearTimeout(finishTimer);
    }
  }, [index]);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        {showLine && (
          <motion.p
            key={index}
            className="text-white text-xl sm:text-2xl md:text-3xl font-light tracking-wide text-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            {introLines[index]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
