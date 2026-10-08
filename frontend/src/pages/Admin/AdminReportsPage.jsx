import React from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { FileText, Download, Clock, CheckCircle } from 'lucide-react';

export default function AdminReportsPage() {
  const { userReports } = useIncidents();

  return (
    <div className="space-y-6">
      <div className="neo-box p-5 bg-[#FFD83D] text-[#050505] flex justify-between items-center">
        <div>
          <h1 className="font-display font-black text-2xl uppercase">CITIZEN MUNICIPAL REPORTS</h1>
          <p className="font-mono text-xs font-bold text-[#050505] mt-1">Audit log of all citizen submissions & status changes.</p>
        </div>
        <button className="px-3 py-1 bg-black text-white font-mono text-xs font-black uppercase flex items-center gap-1">
          <Download className="w-3.5 h-3.5" /> EXPORT CSV
        </button>
      </div>

      <div className="neo-box p-4 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs font-bold">
            <thead>
              <tr className="bg-[#050505] text-white border-b-2 border-black">
                <th className="p-3">REPORT ID</th>
                <th className="p-3">TITLE</th>
                <th className="p-3">CATEGORY</th>
                <th className="p-3">LOCATION</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">SUBMITTED</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {userReports.map((r) => (
                <tr key={r.id} className="hover:bg-[#F8F1E5]">
                  <td className="p-3 text-[#4C5CFF]">#{r.id}</td>
                  <td className="p-3 font-black text-black">{r.title}</td>
                  <td className="p-3">{r.category}</td>
                  <td className="p-3">{r.location || 'Koramangala'}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-[#FFD83D] border border-black text-black font-black">
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">{r.timeAgo || 'Recent'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
