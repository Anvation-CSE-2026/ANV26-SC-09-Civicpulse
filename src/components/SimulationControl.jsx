import React from 'react';
import { Play, Square, Radio, Sparkles } from 'lucide-react';

export default function SimulationControl({ isSimulating, onToggleSimulation }) {
  return (
    <div className="fixed bottom-4 right-4 z-30 bg-white border-3 border-[#050505] p-3 shadow-[5px_5px_0_#050505] flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isSimulating ? 'bg-[#FF4F87]' : 'bg-gray-400'
          }`} />
          <span className={`relative inline-flex rounded-full h-3 w-3 ${
            isSimulating ? 'bg-[#FF4F87]' : 'bg-gray-400'
          }`} />
        </span>
        <span className="font-mono font-black text-xs text-[#050505] uppercase tracking-wider hidden sm:inline">
          LIVE SIMULATION
        </span>
      </div>

      <button
        onClick={onToggleSimulation}
        className={`px-4 py-2 border-2 border-[#050505] shadow-[2px_2px_0_#050505] font-display font-black text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
          isSimulating
            ? 'bg-[#FF4F87] text-white hover:bg-[#ff3574]'
            : 'bg-[#B7FF2A] text-[#050505] hover:bg-[#a3f015]'
        }`}
      >
        {isSimulating ? (
          <>
            <Square className="w-4 h-4 fill-white" />
            <span>STOP SIMULATION</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-[#050505]" />
            <span>START SIMULATION</span>
          </>
        )}
      </button>
    </div>
  );
}
