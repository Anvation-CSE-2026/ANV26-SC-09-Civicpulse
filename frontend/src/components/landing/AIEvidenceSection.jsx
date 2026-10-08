import React from 'react';
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2, TrendingUp, Image as ImageIcon } from 'lucide-react';

export default function AIEvidenceSection() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-8 border-b-4 border-[#050505] bg-[#F8F1E5]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="font-mono font-black text-xs uppercase bg-[#4C5CFF] text-white px-3 py-1 border border-[#050505] inline-block shadow-[2px_2px_0_#050505]">
            EXPLAINABLE AI ENGINE
          </span>
          <h2 className="font-display font-black text-3xl md:text-5xl uppercase text-[#050505] leading-tight">
            ONE STRONG PIECE OF EVIDENCE <br/>
            <span className="text-[#4C5CFF]">CAN CHANGE EVERYTHING.</span>
          </h2>
          <p className="font-sans font-bold text-sm md:text-base text-gray-800 italic">
            "CivicPulse does not simply count reports. It evaluates the quality and severity of evidence."
          </p>
        </div>

        {/* Interactive Evidence Escalation Demonstration Card */}
        <div className="neo-box p-6 md:p-8 bg-white max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Step 1: Citizen Text Report */}
            <div className="md:col-span-4 bg-[#F8F1E5] border-3 border-[#050505] p-4 shadow-[3px_3px_0_#050505] space-y-2">
              <span className="font-mono font-black text-[10px] bg-[#050505] text-[#B7FF2A] px-2 py-0.5 uppercase">
                01 CITIZEN REPORT
              </span>
              <p className="font-sans font-extrabold text-sm text-[#050505] italic">
                "Large road excavation blocking the main lane near metro station."
              </p>
              <div className="font-mono text-[11px] font-bold text-gray-600 border-t border-[#050505]/20 pt-1.5 flex justify-between">
                <span>INITIAL SEVERITY:</span>
                <span className="font-black text-[#050505]">64 / 100</span>
              </div>
            </div>

            {/* Plus Icon */}
            <div className="hidden md:flex justify-center text-[#050505] font-black text-xl">
              +
            </div>

            {/* Step 2: AI Computer Vision Output */}
            <div className="md:col-span-4 bg-[#FFD83D] border-3 border-[#050505] p-4 shadow-[3px_3px_0_#050505] space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-[#050505]">
                <span className="font-black uppercase text-[#050505] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#4C5CFF]" /> AI COMPUTER VISION
                </span>
                <span className="font-black text-[10px] bg-white px-1.5 border border-[#050505]">94% CONF</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-800">Detected Object:</span>
                  <span className="font-black text-[#050505]">ROAD EXCAVATION</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-800">Visual Severity:</span>
                  <span className="font-black text-[#FF4F87]">HIGH RISK</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-800">Evidence Weight:</span>
                  <span className="font-black text-[#4C5CFF]">+25 POINTS</span>
                </div>
              </div>
            </div>

            {/* Step 3: Severity Escalation Output */}
            <div className="md:col-span-3 bg-[#FF4F87] text-white border-3 border-[#050505] p-4 shadow-[3px_3px_0_#050505] space-y-2 text-center">
              <span className="font-mono font-black text-[10px] bg-white text-[#FF4F87] px-2 py-0.5 uppercase border border-[#050505]">
                SEVERITY ESCALATION
              </span>

              <div className="font-display font-black text-3xl md:text-4xl leading-none">
                64 → 89
              </div>

              <span className="font-mono font-black text-xs bg-[#050505] text-[#B7FF2A] px-2 py-0.5 inline-block">
                HIGH → CRITICAL
              </span>
            </div>
          </div>

          {/* Explanation Footer */}
          <div className="p-3.5 bg-[#B7FF2A] border-2 border-[#050505] font-mono text-xs font-bold text-[#050505] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>
              High-confidence visual evidence can increase incident priority even before multiple citizens report the same issue.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
