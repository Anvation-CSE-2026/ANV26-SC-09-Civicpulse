import React from 'react';
import { Users, Award, ShieldCheck } from 'lucide-react';

export default function AdminCitizensPage() {
  const citizens = [
    { id: 'USR-002', name: 'Citizen User', email: 'citizen@civicpulse.com', ward: 'Koramangala 5th Block', points: 240, level: 'LEVEL 4 GUARDIAN', reports: 8 },
    { id: 'USR-003', name: 'Rahul Sharma', email: 'rahul.s@example.com', ward: 'Indiranagar 100ft Road', points: 175, level: 'LEVEL 3 SENTINEL', reports: 5 },
    { id: 'USR-004', name: 'Priya Nair', email: 'priya.nair@example.com', ward: 'HSR Layout Sector 1', points: 310, level: 'LEVEL 5 CHAMPION', reports: 12 },
    { id: 'USR-005', name: 'Anil Kumar', email: 'anil.k@example.com', ward: 'Whitefield Main Road', points: 90, level: 'LEVEL 2 SCOUT', reports: 3 }
  ];

  return (
    <div className="space-y-6">
      <div className="neo-box p-5 bg-[#4C5CFF] text-white flex justify-between items-center">
        <div>
          <h1 className="font-display font-black text-2xl uppercase">CITIZEN REPUTATION & GUARDIANS DIRECTORY</h1>
          <p className="font-mono text-xs font-bold text-gray-200 mt-1">Verified resident accounts, civic point rewards, & leaderboard rankings.</p>
        </div>
        <span className="font-mono font-black text-xs bg-[#B7FF2A] text-black px-3 py-1 border border-black">
          {citizens.length} GUARDIANS LISTED
        </span>
      </div>

      <div className="neo-box p-4 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs font-bold">
            <thead>
              <tr className="bg-[#050505] text-white border-b-2 border-black">
                <th className="p-3">USER ID</th>
                <th className="p-3">FULL NAME & EMAIL</th>
                <th className="p-3">RESIDENTIAL WARD</th>
                <th className="p-3">CIVIC POINTS</th>
                <th className="p-3">GUARDIAN LEVEL</th>
                <th className="p-3 text-right">REPORTS</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {citizens.map((c) => (
                <tr key={c.id} className="hover:bg-[#F8F1E5]">
                  <td className="p-3 text-[#4C5CFF]">#{c.id}</td>
                  <td className="p-3">
                    <p className="font-black text-black">{c.name}</p>
                    <p className="text-[10px] text-gray-600">{c.email}</p>
                  </td>
                  <td className="p-3">{c.ward}</td>
                  <td className="p-3 font-black text-base text-[#050505]">{c.points} PTS</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-[#B7FF2A] border border-black text-black font-black">
                      {c.level}
                    </span>
                  </td>
                  <td className="p-3 text-right font-black">{c.reports}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
