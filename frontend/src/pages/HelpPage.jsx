import React from 'react';
import { HelpCircle, PhoneCall, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export default function HelpPage() {
  const helplines = [
    { name: 'BBMP Control Room (Bruhat Bengaluru Mahanagara Palike)', number: '1533 / 080-22660000' },
    { name: 'BESCOM Electricity Helpline', number: '1912' },
    { name: 'BWSSB Water & Sewage Board', number: '1916 / 080-22945151' },
    { name: 'Bengaluru City Police Emergency', number: '112' },
    { name: 'Namma Metro Helpline', number: '1800-425-1663' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="neo-box p-6 bg-[#B7FF2A] text-[#050505]">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-6 h-6" />
          <h1 className="font-display font-black text-2xl md:text-3xl uppercase">
            CIVICPULSE HELP & EMERGENCY CONTACTS
          </h1>
        </div>
        <p className="font-sans font-bold text-sm">
          Everything you need to know about reporting issues, severity scoring, and emergency municipal helplines.
        </p>
      </div>

      {/* Helplines Card */}
      <div className="neo-box p-6 space-y-4">
        <h2 className="font-display font-black text-xl text-[#050505] uppercase border-b-3 border-[#050505] pb-2 flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-[#FF4F87]" />
          BENGALURU EMERGENCY HELPLINES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {helplines.map((h) => (
            <div key={h.name} className="bg-[#F8F1E5] border-3 border-[#050505] p-4 shadow-[3px_3px_0_#050505]">
              <h3 className="font-display font-black text-sm text-[#050505] uppercase">{h.name}</h3>
              <p className="font-mono font-black text-lg text-[#4C5CFF] mt-1">{h.number}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Guide */}
      <div className="neo-box p-6 space-y-4">
        <h2 className="font-display font-black text-xl text-[#050505] uppercase border-b-3 border-[#050505] pb-2">
          HOW CIVICPULSE WORKS
        </h2>

        <div className="space-y-3 font-sans">
          <div className="bg-white border-2 border-[#050505] p-3.5">
            <h4 className="font-display font-black text-sm uppercase text-[#050505]">
              How is the Severity Score (0-100) calculated?
            </h4>
            <p className="text-xs font-bold text-gray-700 mt-1">
              CivicPulse combines ML visual evidence (+28 max), citizen report frequency (+20 max), geographic density (+15), report velocity (+12), and public impact factors to calculate explainable severity.
            </p>
          </div>

          <div className="bg-white border-2 border-[#050505] p-3.5">
            <h4 className="font-display font-black text-sm uppercase text-[#050505]">
              What happens after I submit a report?
            </h4>
            <p className="text-xs font-bold text-gray-700 mt-1">
              Your report generates an incident marker on the Bengaluru map, updates the live heatmap, awards you 25 Civic Points, and routes the ticket to the respective municipal division (BBMP/BWSSB/BESCOM).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
