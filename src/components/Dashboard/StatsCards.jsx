import React from 'react';
import { FileText, CheckCircle2, Award, TrendingUp } from 'lucide-react';

export default function StatsCards({ totalReports = 8, resolvedReports = 5, civicPoints = 240 }) {
  const cards = [
    {
      id: 'total',
      number: totalReports,
      label: 'TOTAL REPORTS',
      icon: FileText,
      squareBg: 'bg-[#4C5CFF]',
      iconColor: 'text-white',
      borderBg: 'bg-white'
    },
    {
      id: 'resolved',
      number: resolvedReports,
      label: 'RESOLVED',
      icon: CheckCircle2,
      squareBg: 'bg-[#00D66B]',
      iconColor: 'text-[#050505]',
      borderBg: 'bg-white'
    },
    {
      id: 'points',
      number: civicPoints,
      label: 'CIVIC POINTS',
      icon: Award,
      squareBg: 'bg-[#FFD83D]',
      iconColor: 'text-[#050505]',
      borderBg: 'bg-white'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div 
            key={card.id}
            className="neo-box p-4 md:p-5 flex items-center gap-4 hover:-translate-y-1 transition-all"
          >
            <div className={`w-14 h-14 ${card.squareBg} border-3 border-[#050505] shadow-[3px_3px_0_#050505] flex items-center justify-center shrink-0`}>
              <Icon className={`w-7 h-7 ${card.iconColor}`} />
            </div>

            <div>
              <span className="font-display font-black text-3xl md:text-4xl text-[#050505] leading-none block">
                {card.number}
              </span>
              <span className="font-mono font-bold text-xs uppercase tracking-wider text-gray-700 mt-1 block">
                {card.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
