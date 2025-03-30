// MainTitle.jsx
import React from "react";

export default function MainTitle({ onEnter }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl sm:text-6xl font-bold mb-6 tracking-widest">TREAT'S STORY</h1>
      <p className="mb-8 text-zinc-400 max-w-xl">
        A visual/Interactive storytelling experience about Treat.
      </p>
      <button
        onClick={onEnter}
        className="bg-green-500 hover:bg-green-400 text-black font-semibold py-2 px-6 rounded transition"
      >
        Enter
      </button>
    </div>
  );
}
