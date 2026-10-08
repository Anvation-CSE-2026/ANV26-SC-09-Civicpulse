import React from 'react';
import { Link } from 'react-router-dom';
import { FilePlus, Eye, MapPin, ArrowRight } from 'lucide-react';

export default function CitizenSection() {
  const cards = [
    {
      title: 'REPORT AN ISSUE',
      desc: 'Submit a civic problem with description, precise GPS location and optional image evidence.',
      icon: FilePlus,
      bg: 'bg-[#B7FF2A]'
    },
    {
      title: 'TRACK YOUR REPORT',
      desc: 'See whether your report is pending, in progress or resolved with live municipal dispatch logs.',
      icon: Eye,
      bg: 'bg-[#FFD83D]'
    },
    {
      title: 'SEE NEARBY ISSUES',
      desc: 'Understand civic situations happening around your neighbourhood in real-time.',
      icon: MapPin,
      bg: 'bg-[#FF4F87]',
      textColor: 'text-white'
    }
  ];

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 border-b-4 border-[#050505] bg-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="font-mono font-black text-xs uppercase bg-[#B7FF2A] text-[#050505] px-3 py-1 border border-[#050505] inline-block shadow-[2px_2px_0_#050505]">
            FOR BENGALURU RESIDENTS
          </span>
          <h2 className="font-display font-black text-3xl md:text-5xl uppercase text-[#050505]">
            YOUR REPORT CAN START THE RESPONSE.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="neo-box p-6 space-y-4 bg-[#F8F1E5] flex flex-col justify-between">
                <div className="space-y-3">
                  <div className={`w-12 h-12 ${c.bg} border-3 border-[#050505] shadow-[3px_3px_0_#050505] flex items-center justify-center font-black`}>
                    <Icon className={`w-6 h-6 ${c.textColor || 'text-[#050505]'}`} />
                  </div>
                  <h3 className="font-display font-black text-xl text-[#050505] uppercase">{c.title}</h3>
                  <p className="font-sans font-bold text-sm text-gray-700 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF4F87] text-white border-3 border-[#050505] shadow-[5px_5px_0_#050505] font-display font-black text-base uppercase hover:bg-[#ff3574] transition-all cursor-pointer"
          >
            <span>START REPORTING NOW</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
