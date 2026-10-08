import React from 'react';
import { Plus, Sparkles } from 'lucide-react';

export default function WelcomeBanner({ activeReportsCount, onOpenReportModal }) {
  return (
    <div className="bg-[#B7FF2A] border-4 border-[#050505] p-5 md:p-6 shadow-[6px_6px_0_#050505] flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-[#050505]" />
          <span className="font-mono font-bold text-xs uppercase tracking-widest text-[#050505]">
            CITIZEN ACTION PORTAL
          </span>
        </div>
        <h1 className="font-display font-black text-2xl md:text-3xl lg:text-4xl text-[#050505] tracking-tight uppercase">
          HEY CITIZEN! 👋
        </h1>
        <p className="font-sans font-bold text-sm md:text-base text-[#050505] mt-1">
          <span className="bg-[#050505] text-[#B7FF2A] px-2 py-0.5 font-mono text-xs font-black mr-2">
            {activeReportsCount} ACTIVE REPORTS
          </span>
          Help improve your city, report issues & earn civic points.
        </p>
      </div>

      <button
        onClick={onOpenReportModal}
        className="self-start md:self-auto bg-[#FF4F87] text-white border-3 border-[#050505] px-6 py-3.5 shadow-[5px_5px_0_#050505] font-display font-black text-base uppercase tracking-wider hover:bg-[#ff3574] hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#050505] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_#050505] transition-all cursor-pointer flex items-center gap-2"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
        <span>+ NEW REPORT</span>
      </button>
    </div>
  );
}
