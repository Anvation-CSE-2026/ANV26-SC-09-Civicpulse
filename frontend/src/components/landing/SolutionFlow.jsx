import React from 'react';
import { ArrowRight, ArrowDown, FilePlus, GitMerge, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export default function SolutionFlow() {
  const steps = [
    {
      num: '01',
      title: 'REPORT',
      description: 'Citizen submits a civic issue with location and photo evidence.',
      icon: FilePlus,
      bg: 'bg-[#B7FF2A]'
    },
    {
      num: '02',
      title: 'CORRELATE',
      description: 'AI identifies related reports and groups them into a single incident.',
      icon: GitMerge,
      bg: 'bg-[#FFD83D]'
    },
    {
      num: '03',
      title: 'ANALYZE',
      description: 'Text, images, location and temporal patterns become structured evidence.',
      icon: Sparkles,
      bg: 'bg-[#4C5CFF]',
      textColor: 'text-white'
    },
    {
      num: '04',
      title: 'PRIORITIZE',
      description: 'Severity (0-100) and priority urgency are continuously calculated.',
      icon: TrendingUp,
      bg: 'bg-[#FF4F87]',
      textColor: 'text-white'
    },
    {
      num: '05',
      title: 'RESPOND',
      description: 'Limited municipal resources are allocated to highest-priority incidents.',
      icon: ShieldCheck,
      bg: 'bg-[#00D66B]'
    }
  ];

  return (
    <section id="how-it-works" className="py-12 md:py-16 px-4 md:px-8 border-b-4 border-[#050505] bg-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="font-mono font-black text-xs uppercase bg-[#B7FF2A] text-[#050505] px-3 py-1 border border-[#050505] inline-block shadow-[2px_2px_0_#050505]">
            INTELLIGENT WORKFLOW
          </span>
          <h2 className="font-display font-black text-3xl md:text-5xl uppercase text-[#050505]">
            FROM REPORTS TO RESPONSE.
          </h2>
        </div>

        {/* 5 Step Horizontal Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="neo-box p-4 space-y-3 flex flex-col justify-between hover:-translate-y-1 transition-all bg-[#F8F1E5]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-black text-2xl text-[#050505]">
                      {s.num}
                    </span>
                    <div className={`w-8 h-8 ${s.bg} border-2 border-[#050505] shadow-[2px_2px_0_#050505] flex items-center justify-center font-black`}>
                      <Icon className={`w-4 h-4 ${s.textColor || 'text-[#050505]'}`} />
                    </div>
                  </div>

                  <h3 className="font-display font-black text-base text-[#050505] uppercase">
                    {s.title}
                  </h3>

                  <p className="font-sans font-bold text-xs text-gray-700 mt-1 leading-normal">
                    {s.description}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden md:flex justify-end pt-2 text-[#050505]">
                    <ArrowRight className="w-5 h-5 text-[#4C5CFF]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
