import React from 'react';
import { Wrench, ShieldAlert, Zap } from 'lucide-react';

export default function CategoriesSection() {
  const categories = [
    {
      title: 'INFRASTRUCTURE',
      color: 'bg-[#B7FF2A]',
      icon: Wrench,
      items: ['Roads & Excavation', 'Waterlogging', 'Potholes & Cracks', 'Broken Footpaths']
    },
    {
      title: 'PUBLIC SAFETY',
      color: 'bg-[#FF4F87]',
      textColor: 'text-white',
      icon: ShieldAlert,
      items: ['Fire & Gas Leaks', 'Road Accidents', 'Dangerous Obstructions', 'Open Manholes']
    },
    {
      title: 'UTILITIES',
      color: 'bg-[#FFD83D]',
      icon: Zap,
      items: ['Streetlights Out', 'Power Failures', 'Water Pipe Leakage', 'Sewage Overflows']
    }
  ];

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 border-b-4 border-[#050505] bg-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="font-mono font-black text-xs uppercase bg-[#FFD83D] text-[#050505] px-3 py-1 border border-[#050505] inline-block shadow-[2px_2px_0_#050505]">
            CIVIC COVERAGE
          </span>
          <h2 className="font-display font-black text-3xl md:text-5xl uppercase text-[#050505]">
            THREE CIVIC CATEGORIES. ONE PLATFORM.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.title} className="neo-box p-6 space-y-4 bg-[#F8F1E5]">
                <div className="flex items-center justify-between border-b-3 border-[#050505] pb-3">
                  <h3 className="font-display font-black text-xl text-[#050505] uppercase">{cat.title}</h3>
                  <div className={`w-10 h-10 ${cat.color} border-3 border-[#050505] shadow-[2px_2px_0_#050505] flex items-center justify-center font-black`}>
                    <Icon className={`w-5 h-5 ${cat.textColor || 'text-[#050505]'}`} />
                  </div>
                </div>

                <ul className="space-y-2 font-mono text-xs font-bold text-gray-800">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 bg-white p-2 border-2 border-[#050505] shadow-[2px_2px_0_#050505]">
                      <span className="text-[#4C5CFF] font-black">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
