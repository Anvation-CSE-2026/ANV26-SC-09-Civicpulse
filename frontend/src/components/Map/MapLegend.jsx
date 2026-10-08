import React from 'react';

export default function MapLegend() {
  const levels = [
    { label: 'NORMAL', range: '0–30', color: 'bg-[#00D66B]', icon: '🟢' },
    { label: 'MEDIUM', range: '31–60', color: 'bg-[#FFD83D]', icon: '🟡' },
    { label: 'HIGH', range: '61–80', color: 'bg-[#FF9F1C]', icon: '🟠' },
    { label: 'CRITICAL', range: '81–100', color: 'bg-[#FF4F87]', icon: '🔴' },
  ];

  return (
    <div className="absolute bottom-4 left-4 z-40 bg-white border-3 border-[#050505] p-3 shadow-[4px_4px_0_#050505] font-sans">
      <h4 className="font-display font-black text-xs uppercase tracking-wider text-[#050505] border-b-2 border-[#050505] pb-1 mb-2">
        INCIDENT SEVERITY
      </h4>
      <div className="space-y-1.5 font-mono text-[11px] font-bold">
        {levels.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`w-3.5 h-3.5 border-2 border-[#050505] ${item.color} flex items-center justify-center text-[8px]`}></span>
            <span className="text-[#050505] tracking-wide">{item.label}</span>
            <span className="text-gray-500 font-semibold text-[10px] ml-auto">({item.range})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
