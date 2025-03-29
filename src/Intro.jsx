import React, { useEffect, useState, useRef } from 'react';
import Snowfall from './Snowfall';
import { motion, AnimatePresence } from 'framer-motion';

const lines = [
  "I don't know what a good person in life is....",
  "But whoever that person is, I know it's not me.",
  "But this time... maybe I can make it right.",
];

export default function Intro({ onFinish }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [visible, setVisible] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.loop = true;
      audioRef.current.play().catch((e) => {
        console.warn("Autoplay failed, user interaction required.", e);
      });
    }
  }, []);

  useEffect(() => {
    let fadeOutTimer, nextLineTimer;

    if (visible) {
      fadeOutTimer = setTimeout(() => setVisible(false), 3500); // Stay visible 3.5s
    } else {
      nextLineTimer = setTimeout(() => {
        if (currentLine < lines.length - 1) {
          setCurrentLine((prev) => prev + 1);
          setVisible(true);
        } else {
          onFinish();
        }
      }, 1000); // 1s fade out time before next
    }

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(nextLineTimer);
    };
  }, [visible, currentLine, onFinish]);

  return (
    <div className="relative h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      <Snowfall />
      <audio ref={audioRef} src="/bgm.mp3" autoPlay />

      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={currentLine}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
            }}
            className="z-10 text-xl md:text-2xl text-center px-6 font-light"
          >
            {lines[currentLine]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
