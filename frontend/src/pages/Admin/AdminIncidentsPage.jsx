import React, { useState } from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { getSeverityInfo, getStatusStyle } from '../../utils/severity';
import { AlertTriangle, CheckCircle2, ShieldAlert, Filter, Search } from 'lucide-react';

export default function AdminIncidentsPage() {
  const { incidents, dispatchIncident, resolveIncident } = useIncidents();
  const [filterCat, setFilterCat] = useState('ALL');
  const [filterSev, setFilterSev] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = incidents.filter(i => {
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'ALL' || i.category === filterCat;
    const matchSev = filterSev === 'ALL' || getSeverityInfo(i.severity).level === filterSev;
    return matchSearch && matchCat && matchSev;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="neo-box p-5 bg-[#4C5CFF] text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl uppercase">
            INCIDENT MANAGEMENT GRID
          </h1>
          <p className="font-mono text-xs font-bold text-gray-200 mt-1">
            Monitor, prioritize, dispatch field units, and close civic tickets across Bengaluru.
          </p>
        </div>
        <span className="font-mono font-black text-xs bg-[#B7FF2A] text-[#050505] px-3 py-1 border-2 border-[#050505] shadow-[2px_2px_0_#050505]">
          {filtered.length} INCIDENTS LOADED
        </span>
      </div>

      {/* Filter Bar */}
      <div className="neo-box p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search incident title, ID or location..."
            className="w-full pl-9 pr-3 py-2 bg-white border-2 border-[#050505] font-sans font-bold text-xs shadow-[2px_2px_0_#050505]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="bg-white border-2 border-[#050505] p-2 font-mono font-bold text-xs shadow-[2px_2px_0_#050505]"
          >
            <option value="ALL">ALL CATEGORIES</option>
            <option value="INFRASTRUCTURE">INFRASTRUCTURE</option>
            <option value="PUBLIC SAFETY">PUBLIC SAFETY</option>
            <option value="UTILITIES">UTILITIES</option>
          </select>

          <select
            value={filterSev}
            onChange={(e) => setFilterSev(e.target.value)}
            className="bg-white border-2 border-[#050505] p-2 font-mono font-bold text-xs shadow-[2px_2px_0_#050505]"
          >
            <option value="ALL">ALL SEVERITIES</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="NORMAL">NORMAL</option>
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="neo-box overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#050505] text-white font-mono font-black text-xs uppercase border-b-4 border-[#050505]">
                <th className="p-3.5">ID</th>
                <th className="p-3.5">TITLE & LOCATION</th>
                <th className="p-3.5">CATEGORY</th>
                <th className="p-3.5">SEVERITY</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5">REPORTS</th>
                <th className="p-3.5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs font-bold divide-y-2 divide-[#050505]">
              {filtered.map((inc) => {
                const sev = getSeverityInfo(inc.severity);
                const statusStyle = getStatusStyle(inc.status);

                return (
                  <tr key={inc.id} className="hover:bg-[#FFD83D]/30 transition-colors bg-white">
                    <td className="p-3.5 font-black text-[#4C5CFF]">#{inc.id}</td>
                    <td className="p-3.5">
                      <p className="font-display font-black text-sm uppercase text-[#050505]">{inc.title}</p>
                      <p className="text-[10px] text-gray-600">📍 {inc.areaName}</p>
                    </td>
                    <td className="p-3.5">{inc.category}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 border border-[#050505] ${sev.badgeBg} ${sev.badgeText}`}>
                        {inc.severity} ({sev.level})
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 border border-[#050505] ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.label}
                      </span>
                    </td>
                    <td className="p-3.5 font-black text-sm">{inc.reportCount}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => dispatchIncident(inc.id, 'BBMP Rapid Squad')}
                        className="px-2.5 py-1 bg-[#4C5CFF] text-white border border-[#050505] shadow-[2px_2px_0_#050505] font-black text-[10px] uppercase hover:bg-[#3848e8]"
                      >
                        DISPATCH
                      </button>
                      <button
                        onClick={() => resolveIncident(inc.id)}
                        className="px-2.5 py-1 bg-[#00D66B] text-[#050505] border border-[#050505] shadow-[2px_2px_0_#050505] font-black text-[10px] uppercase hover:bg-[#00be5e]"
                      >
                        RESOLVE
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
