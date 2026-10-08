import React from 'react';
import { getStatusStyle, getSeverityInfo } from '../../utils/severity';
import { Clock, Eye, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function ReportsList({ userReports = [], onSelectReport }) {
  return (
    <div className="neo-box p-4 md:p-5 flex flex-col h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b-4 border-[#050505]">
        <h2 className="font-display font-black text-xl text-[#050505] uppercase tracking-wide">
          MY REPORTS
        </h2>
        <span className="font-mono font-bold text-xs bg-[#FFD83D] border-2 border-[#050505] px-2 py-0.5 shadow-[2px_2px_0_#050505]">
          {userReports.length} SUBMITTED
        </span>
      </div>

      {/* Reports List */}
      <div className="space-y-4 overflow-y-auto pr-1 max-h-[580px]">
        {userReports.length === 0 ? (
          <div className="p-6 text-center border-2 border-dashed border-[#050505] bg-[#F8F1E5]">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-500" />
            <p className="font-bold text-sm text-[#050505]">NO REPORTS YET</p>
            <p className="font-mono text-xs text-gray-600 mt-1">Submit your first civic issue using the + NEW REPORT button.</p>
          </div>
        ) : (
          userReports.map((report) => {
            const statusStyle = getStatusStyle(report.status);
            const severityInfo = getSeverityInfo(report.severity || 50);

            return (
              <div
                key={report.id}
                onClick={() => onSelectReport && onSelectReport(report)}
                className="group relative bg-white border-3 border-[#050505] p-4 shadow-[4px_4px_0_#050505] hover:-translate-y-1 hover:shadow-[6px_6px_0_#050505] transition-all cursor-pointer"
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-black text-xs bg-[#050505] text-[#B7FF2A] px-2 py-0.5 border border-[#050505]">
                    #{report.id}
                  </span>
                  
                  {/* Status Badge */}
                  <span className={`font-mono font-extrabold text-[11px] px-2.5 py-0.5 border-2 border-[#050505] shadow-[2px_2px_0_#050505] ${statusStyle.bg} ${statusStyle.text}`}>
                    {statusStyle.label}
                  </span>
                </div>

                {/* Report Title */}
                <h3 className="font-display font-black text-base text-[#050505] group-hover:text-[#4C5CFF] transition-colors leading-snug uppercase mb-1.5 flex items-center justify-between">
                  <span>{report.title}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-[#4C5CFF]" />
                </h3>

                {/* Description */}
                <p className="font-sans text-xs font-semibold text-gray-700 line-clamp-2 mb-3">
                  {report.description}
                </p>

                {/* Footer Metadata */}
                <div className="pt-2 border-t-2 border-[#050505]/20 flex items-center justify-between font-mono font-bold text-[11px] text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#050505]" />
                    <span>{report.timeAgo || 'RECENT'}</span>
                  </div>
                  <span className="text-[#050505] bg-[#F8F1E5] px-2 py-0.5 border border-[#050505]">
                    {report.updatesCount || 'UNDER REVIEW'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
