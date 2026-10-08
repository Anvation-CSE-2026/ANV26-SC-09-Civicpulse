import React from 'react';
import { Cpu, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function AdminAiEnginePage() {
  return (
    <div className="space-y-6">
      <div className="neo-box p-5 bg-[#050505] text-[#B7FF2A] flex justify-between items-center">
        <div>
          <h1 className="font-display font-black text-2xl uppercase">AI VISION & SEVERITY EXPLAINABILITY ENGINE</h1>
          <p className="font-mono text-xs text-gray-300 mt-1">Computer vision classification, evidence weighting, & automatic severity scoring.</p>
        </div>
        <span className="font-mono font-black text-xs bg-[#B7FF2A] text-black px-3 py-1 border border-black">
          MODEL V4.2 ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="neo-box p-5 bg-white space-y-3">
          <h3 className="font-display font-black text-lg uppercase border-b-2 border-black pb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#4C5CFF]" /> EXPLAINABLE SEVERITY WEIGHT MATRIX
          </h3>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span>ML Image Visual Risk Score</span>
              <span className="font-black text-[#4C5CFF]">+28 MAX</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span>Citizen Reports Frequency</span>
              <span className="font-black text-[#4C5CFF]">+20 MAX</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span>Geographic Radial Density</span>
              <span className="font-black text-[#4C5CFF]">+15 MAX</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span>Report Acceleration Velocity</span>
              <span className="font-black text-[#4C5CFF]">+12 MAX</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Public Safety & Grid Hazard</span>
              <span className="font-black text-[#4C5CFF]">+25 MAX</span>
            </div>
          </div>
        </div>

        <div className="neo-box p-5 bg-white space-y-3">
          <h3 className="font-display font-black text-lg uppercase border-b-2 border-black pb-2">CONFIDENCE THRESHOLDS</h3>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span>Waterlogging Detection</span>
              <span className="font-black text-[#00D66B]">96% Threshold</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span>Pothole Surface Degradation</span>
              <span className="font-black text-[#00D66B]">92% Threshold</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span>Sewage Leak & Chemical Hazard</span>
              <span className="font-black text-[#00D66B]">97% Threshold</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Electrical Cable Sagging</span>
              <span className="font-black text-[#00D66B]">89% Threshold</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
