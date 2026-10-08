import React from 'react';
import { Clock, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function LiveIncidentSection() {
  const timelineEvents = [
    { time: '10:00', text: 'INCIDENT CREATED', color: 'bg-white text-[#050505]' },
    { time: '10:11', text: '+3 CITIZEN REPORTS', color: 'bg-[#FFD83D] text-[#050505]' },
    { time: '10:24', text: 'IMAGE EVIDENCE RECEIVED', color: 'bg-[#4C5CFF] text-white' },
    { time: '10:25', text: 'SEVERITY 64 → 82', color: 'bg-[#FF9F1C] text-white' },
    { time: '10:31', text: 'CRITICAL ESCALATION', color: 'bg-[#FF4F87] text-white' },
    { time: '10:32', text: 'RESPONSE TEAM DISPATCHED', color: 'bg-[#00D66B] text-[#050505]' }
  ];

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 border-b-4 border-[#050505] bg-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="font-mono font-black text-xs uppercase bg-[#FF4F87] text-white px-3 py-1 border border-[#050505] inline-block shadow-[2px_2px_0_#050505]">
            DYNAMIC EVOLUTION
          </span>
          <h2 className="font-display font-black text-3xl md:text-5xl uppercase text-[#050505]">
            INCIDENTS DON'T STAY THE SAME.
          </h2>
        </div>

        {/* Timeline Block Strip */}
        <div className="neo-box p-6 md:p-8 bg-[#F8F1E5] max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-3 border-b-3 border-[#050505]">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#4C5CFF]" />
              <h3 className="font-display font-black text-lg uppercase text-[#050505]">
                INCIDENT #INC-2041 LIVE LIFE CYCLE
              </h3>
            </div>
            <span className="font-mono font-black text-xs bg-[#B7FF2A] border border-[#050505] px-2.5 py-1">
              REAL-TIME LOG
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {timelineEvents.map((evt, idx) => (
              <div
                key={idx}
                className={`p-4 border-3 border-[#050505] shadow-[3px_3px_0_#050505] space-y-1.5 ${evt.color}`}
              >
                <span className="font-mono font-black text-xs bg-[#050505] text-[#B7FF2A] px-2 py-0.5 inline-block">
                  {evt.time}
                </span>
                <p className="font-display font-black text-sm uppercase">
                  {evt.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
