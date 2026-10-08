import React from 'react';
import { Layers, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function ProblemSection() {
  const problems = [
    {
      num: '01',
      title: 'FRAGMENTED REPORTS',
      description: 'Different citizens report the same incident separately across isolated channels, masking the real scale of civic emergencies.',
      color: 'bg-[#FFD83D]',
      icon: Layers
    },
    {
      num: '02',
      title: 'UNCERTAIN SEVERITY',
      description: 'A single unverified text report may hide a serious life-threatening hazard or electrical disruption in high-density traffic zones.',
      color: 'bg-[#FF4F87]',
      icon: AlertTriangle
    },
    {
      num: '03',
      title: 'LIMITED RESOURCES',
      description: 'Municipal teams cannot respond everywhere at once. Without priority scoring, critical issues wait while minor ones consume crews.',
      color: 'bg-[#4C5CFF]',
      icon: ShieldAlert
    }
  ];

  return (
    <section id="features" className="py-12 md:py-16 px-4 md:px-8 border-b-4 border-[#050505] bg-[#F8F1E5]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="font-mono font-black text-xs uppercase bg-[#050505] text-[#B7FF2A] px-3 py-1 border border-[#050505] inline-block">
            THE MUNICIPAL CHALLENGE
          </span>
          <h2 className="font-display font-black text-3xl md:text-5xl uppercase leading-tight text-[#050505]">
            CITIES RECEIVE THOUSANDS OF REPORTS. <br/>
            <span className="text-[#FF4F87]">BUT WHICH ONE NEEDS HELP FIRST?</span>
          </h2>
        </div>

        {/* 3 Neo-brutalist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.num}
                className="neo-box p-6 space-y-4 hover:-translate-y-1.5 transition-all bg-white flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-4xl text-[#050505]">
                      {p.num}
                    </span>
                    <div className={`w-10 h-10 ${p.color} border-3 border-[#050505] shadow-[2px_2px_0_#050505] flex items-center justify-center font-black`}>
                      <Icon className="w-5 h-5 text-[#050505] stroke-[2.5]" />
                    </div>
                  </div>

                  <h3 className="font-display font-black text-xl text-[#050505] uppercase leading-tight">
                    {p.title}
                  </h3>

                  <p className="font-sans font-bold text-sm text-gray-700 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
