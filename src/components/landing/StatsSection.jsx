import React from 'react';
import { LANDING_STATS } from '../../data/landingStats';

export default function StatsSection() {
  return (
    <section className="py-10 bg-[#050505] text-white border-b-4 border-[#050505]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {LANDING_STATS.map((stat, i) => (
          <div key={i} className="space-y-1">
            <span className="font-display font-black text-4xl md:text-5xl text-[#B7FF2A] block leading-none">
              {stat.value}
            </span>
            <span className="font-mono font-black text-xs uppercase tracking-wider text-white block mt-1">
              {stat.label}
            </span>
            <span className="font-sans font-bold text-[11px] text-gray-400 block">
              {stat.description}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
