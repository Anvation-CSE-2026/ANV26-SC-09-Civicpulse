import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Cpu, Shield, RefreshCw, ArrowRight } from 'lucide-react';

export default function MunicipalSection() {
  const cards = [
    {
      title: 'LIVE INCIDENT MAP',
      desc: 'Monitor active infrastructure, safety, and utility incidents across Bengaluru.',
      icon: Map,
      bg: 'bg-[#4C5CFF]',
      textColor: 'text-white'
    },
    {
      title: 'AI EVIDENCE EXPLAINABILITY',
      desc: 'Understand exactly why an incident received its severity score before dispatching.',
      icon: Cpu,
      bg: 'bg-[#FFD83D]'
    },
    {
      title: 'RESOURCE OPTIMIZATION',
      desc: 'Allocate limited field units, linesmen, and repair teams to highest-priority cases.',
      icon: Shield,
      bg: 'bg-[#B7FF2A]'
    },
    {
      title: 'LIVE REPRIORITIZATION',
      desc: 'Dynamic matrix recomputes urgency immediately when new evidence arrives.',
      icon: RefreshCw,
      bg: 'bg-[#FF4F87]',
      textColor: 'text-white'
    }
  ];

  return (
    <section id="municipalities" className="py-12 md:py-16 px-4 md:px-8 border-b-4 border-[#050505] bg-[#F8F1E5]">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="font-mono font-black text-xs uppercase bg-[#4C5CFF] text-white px-3 py-1 border border-[#050505] inline-block shadow-[2px_2px_0_#050505]">
            FOR MUNICIPAL TEAMS & BBMP
          </span>
          <h2 className="font-display font-black text-3xl md:text-5xl uppercase text-[#050505]">
            ONE COMMAND CENTER. THE WHOLE CITY.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="neo-box p-5 space-y-3 bg-white flex flex-col justify-between hover:-translate-y-1 transition-all">
                <div className="space-y-2">
                  <div className={`w-10 h-10 ${c.bg} border-3 border-[#050505] shadow-[2px_2px_0_#050505] flex items-center justify-center font-black mb-2`}>
                    <Icon className={`w-5 h-5 ${c.textColor || 'text-[#050505]'}`} />
                  </div>
                  <h3 className="font-display font-black text-base text-[#050505] uppercase leading-tight">{c.title}</h3>
                  <p className="font-sans font-bold text-xs text-gray-700 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#4C5CFF] text-white border-3 border-[#050505] shadow-[5px_5px_0_#050505] font-display font-black text-base uppercase hover:bg-[#3848e8] transition-all cursor-pointer"
          >
            <span>OPEN COMMAND CENTER</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
