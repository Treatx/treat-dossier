// Story.jsx (placeholder test screen)
import React from 'react';

export default function Story({ onExit }) {
  return (
    <div className="w-full max-w-2xl text-center">
      <img src="/treat-story-preview.png" alt="Story Placeholder" className="mx-auto rounded shadow mb-6" />

      <p className="text-white text-lg mb-4">This is a test screen for interactive story mode.</p>

      <button
        onClick={onExit}
        className="px-6 py-2 bg-green-500 text-black rounded hover:bg-green-400 transition font-semibold"
      >
        Back to Menu
      </button>
    </div>
  );
}