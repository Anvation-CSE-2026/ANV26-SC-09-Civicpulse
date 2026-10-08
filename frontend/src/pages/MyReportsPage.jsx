import React, { useState } from 'react';
import { FileText, Plus, Clock, AlertCircle } from 'lucide-react';
import { getStatusStyle, getSeverityInfo } from '../utils/severity';

export default function MyReportsPage({ userReports, onOpenReportModal, onSelectReport }) {
  const [filter, setFilter] = useState('ALL');

  const filteredReports = userReports.filter(r => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="neo-box p-6 bg-[#4C5CFF] text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight">
            MY CIVIC REPORTS
          </h1>
          <p className="font-mono text-xs font-bold text-gray-200 mt-1">
            Track status, official responses, and civic points for your submitted issues.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="bg-[#B7FF2A] text-[#050505] border-3 border-[#050505] px-5 py-3 shadow-[4px_4px_0_#050505] font-display font-black text-sm uppercase hover:bg-[#a5f013] transition-all cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>+ NEW REPORT</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'IN PROGRESS', 'PENDING', 'RESOLVED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-4 py-2 font-mono font-extrabold text-xs uppercase border-3 border-[#050505] shadow-[3px_3px_0_#050505] transition-all cursor-pointer ${
              filter === st ? 'bg-[#050505] text-white' : 'bg-white text-[#050505] hover:bg-[#FFD83D]'
            }`}
          >
            {st} ({st === 'ALL' ? userReports.length : userReports.filter(r => r.status === st).length})
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="neo-box p-12 text-center bg-white space-y-4">
          <div className="w-16 h-16 bg-[#FFD83D] border-3 border-[#050505] shadow-[3px_3px_0_#050505] mx-auto flex items-center justify-center font-display font-black text-2xl">
            📋
          </div>
          <h3 className="font-display font-black text-xl uppercase text-[#050505]">
            NO CITIZEN REPORTS FOUND
          </h3>
          <p className="font-mono text-xs font-bold text-gray-600 max-w-md mx-auto">
            You haven't submitted any civic issues matching this filter yet. Submit a new report to help improve your neighborhood!
          </p>
          <button
            onClick={onOpenReportModal}
            className="px-5 py-2.5 bg-[#B7FF2A] text-[#050505] border-3 border-[#050505] shadow-[3px_3px_0_#050505] font-display font-black text-xs uppercase hover:bg-[#a3eb17] cursor-pointer"
          >
            + SUBMIT NEW REPORT
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReports.map((report) => {
            const statusStyle = getStatusStyle(report.status);
            const severityInfo = getSeverityInfo(report.severity || 50);

            return (
              <div
                key={report.id}
                onClick={() => onSelectReport(report)}
                className="neo-box p-5 space-y-3 hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-[#050505]">
                    <span className="font-mono font-black text-xs bg-[#050505] text-[#B7FF2A] px-2 py-0.5">
                      R-{report.id}
                    </span>
                    <span className={`font-mono text-xs font-black px-2 py-0.5 border-2 border-[#050505] ${statusStyle.bg} ${statusStyle.text}`}>
                      {statusStyle.label}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-lg text-[#050505] uppercase leading-tight mb-2">
                    {report.title}
                  </h3>

                  <p className="font-sans font-bold text-xs text-gray-700 line-clamp-3 mb-3">
                    {report.description}
                  </p>

                  {report.assignedTeam && (
                    <div className="mb-3 p-2 bg-[#B7FF2A]/30 border-2 border-[#050505] font-mono text-[11px] font-bold">
                      <span className="text-gray-600">ASSIGNED UNIT: </span>
                      <span className="font-black text-[#050505]">{report.assignedTeam}</span>
                    </div>
                  )}

                  {report.imageUrl && (
                    <img
                      src={report.imageUrl}
                      alt={report.title}
                      className="w-full h-36 object-cover border-2 border-[#050505] mb-3"
                    />
                  )}
                </div>

                <div className="pt-3 border-t-2 border-[#050505] flex items-center justify-between font-mono text-xs font-bold">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{report.timeAgo || 'RECENT'}</span>
                  </div>

                  <span className={`px-2 py-0.5 border border-[#050505] ${severityInfo.badgeBg} ${severityInfo.badgeText}`}>
                    SEV: {report.severity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
