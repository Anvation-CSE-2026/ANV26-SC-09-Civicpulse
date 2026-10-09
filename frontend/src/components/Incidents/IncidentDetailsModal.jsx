import React from 'react';
import { X, AlertTriangle, Clock, MapPin, Sparkles, CheckCircle2, Navigation, Layers, ShieldAlert } from 'lucide-react';
import { getSeverityInfo, getStatusStyle, calculateSeverityBreakdown } from '../../utils/severity';
import { calculateDistance, formatDistance } from '../../utils/geo';

export default function IncidentDetailsModal({ 
  incident, 
  onClose, 
  allIncidents = [],
  onSelectIncident 
}) {
  if (!incident) return null;

  const severityInfo = getSeverityInfo(incident.severity);
  const statusStyle = getStatusStyle(incident.status);
  const breakdown = calculateSeverityBreakdown(incident);

  // Find nearby incidents within approx 2.5km (excluding current)
  const nearbyIncidents = allIncidents
    .filter(other => other.id !== incident.id)
    .map(other => ({
      ...other,
      distanceKm: calculateDistance(incident.latitude, incident.longitude, other.latitude, other.longitude)
    }))
    .filter(other => other.distanceKm <= 3.0)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="neo-box w-full max-w-3xl bg-[#F8F1E5] my-8 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#050505] text-white p-4 border-b-4 border-[#050505] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono font-black text-xs bg-[#B7FF2A] text-[#050505] px-2.5 py-1 border border-[#050505]">
              #{incident.id}
            </span>
            <span className={`font-mono font-black text-xs px-2.5 py-1 border border-white ${statusStyle.bg} ${statusStyle.text}`}>
              {statusStyle.label}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 bg-[#FF4F87] text-white border-2 border-white font-bold flex items-center justify-center cursor-pointer hover:bg-[#ff3574]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-6">
          {/* Main Title & Location Banner */}
          <div>
            <h1 className="font-display font-black text-2xl md:text-3xl text-[#050505] uppercase leading-tight tracking-tight">
              {incident.title}
            </h1>
            <p className="font-sans font-bold text-sm text-gray-700 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#FF4F87]" />
              <span>{incident.areaName || 'Bengaluru Urban'} ({incident.latitude}, {incident.longitude})</span>
            </p>
          </div>

          {/* Description Card */}
          <div className="bg-white border-3 border-[#050505] p-4 shadow-[3px_3px_0_#050505]">
            <h3 className="font-mono font-black text-xs text-gray-500 uppercase mb-1">DESCRIPTION</h3>
            <p className="font-sans font-bold text-sm text-[#050505] leading-relaxed">
              {incident.description}
            </p>
          </div>

          {/* Grid Section: Severity Breakdown & AI Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Explainable Severity Score */}
            <div className="bg-white border-3 border-[#050505] p-4 shadow-[3px_3px_0_#050505] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b-2 border-[#050505]">
                <span className="font-mono font-black text-xs uppercase text-[#050505]">
                  SEVERITY SCORE EXPLANATION
                </span>
                <span className={`font-mono font-black text-xs px-2 py-0.5 border border-[#050505] ${severityInfo.badgeBg} ${severityInfo.badgeText}`}>
                  {severityInfo.level}
                </span>
              </div>

              {/* Total Score Badge */}
              <div className="flex items-baseline gap-2 bg-[#F8F1E5] p-3 border-2 border-[#050505]">
                <span className="font-display font-black text-4xl text-[#050505]">
                  {incident.severity}
                </span>
                <span className="font-mono font-bold text-sm text-gray-600">/ 100 TOTAL</span>
              </div>

              {/* Factors Table */}
              <div className="space-y-1.5 font-mono text-xs">
                {breakdown.factors.map((item) => (
                  <div key={item.label} className="flex justify-between py-0.5 border-b border-gray-200">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-black text-[#4C5CFF]">+{item.score}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-1 font-black text-sm text-[#050505]">
                  <span>TOTAL SCORE</span>
                  <span>{breakdown.total}</span>
                </div>
              </div>

              {/* Civic Context Box */}
              {breakdown.context && (
                <div className="pt-2 border-t border-gray-200 font-mono text-[10px]">
                  <span className="font-bold text-gray-500 uppercase block mb-1">CIVIC CONTEXT:</span>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="bg-[#F8F1E5] p-1 border border-gray-300">
                      <span className="text-gray-500 block">Rainfall</span>
                      <span className="font-bold text-[#050505]">{breakdown.context.rainfall}</span>
                    </div>
                    <div className="bg-[#F8F1E5] p-1 border border-gray-300">
                      <span className="text-gray-500 block">Traffic</span>
                      <span className="font-bold text-[#050505]">{breakdown.context.traffic}</span>
                    </div>
                    <div className="bg-[#F8F1E5] p-1 border border-gray-300">
                      <span className="text-gray-500 block">Population</span>
                      <span className="font-bold text-[#050505]">{breakdown.context.population}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Image Evidence Section */}
            <div className="bg-white border-3 border-[#050505] p-4 shadow-[3px_3px_0_#050505] space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-[#050505]">
                <Sparkles className="w-4 h-4 text-[#4C5CFF]" />
                <span className="font-mono font-black text-xs uppercase text-[#050505]">
                  AI EVIDENCE ANALYSIS
                </span>
              </div>

              {incident.hasImage && incident.imageUrl ? (
                <div className="space-y-2">
                  <img
                    src={incident.imageUrl}
                    alt={incident.title}
                    className="w-full h-32 object-cover border-2 border-[#050505]"
                  />
                  <div className="bg-[#F8F1E5] p-2.5 border-2 border-[#050505] font-mono text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Detected:</span>
                      <span className="font-black text-[#050505]">{incident.issueType.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confidence:</span>
                      <span className="font-black text-[#00D66B]">{incident.evidenceConfidence || 94}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center border-2 border-dashed border-[#050505] bg-[#F8F1E5]">
                  <p className="font-mono text-xs font-bold text-gray-500">No image evidence uploaded for this report.</p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-white border-3 border-[#050505] p-4 shadow-[3px_3px_0_#050505]">
            <h3 className="font-mono font-black text-xs text-[#050505] uppercase pb-2 mb-3 border-b-2 border-[#050505] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#4C5CFF]" />
              INCIDENT TIMELINE LOG
            </h3>

            <div className="space-y-2.5 font-mono text-xs">
              {(incident.timeline || [
                { time: "10:05", text: "Citizen report received" },
                { time: "10:12", text: "Similar report detected" },
                { time: "10:18", text: "Image evidence uploaded" },
                { time: "10:19", text: "Severity increased" },
                { time: "10:20", text: "Response priority updated" }
              ]).map((evt, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="font-black bg-[#FFD83D] border border-[#050505] px-2 py-0.5 text-[11px] shrink-0">
                    {evt.time}
                  </span>
                  <span className="font-bold text-gray-800 pt-0.5">{evt.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Issues Section (Section 17) */}
          <div className="bg-[#B7FF2A]/20 border-3 border-[#050505] p-4 shadow-[3px_3px_0_#050505]">
            <h3 className="font-mono font-black text-xs text-[#050505] uppercase pb-2 mb-3 border-b-2 border-[#050505] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#050505]" />
              NEARBY ISSUES (SPATIAL CORRELATION)
            </h3>

            {nearbyIncidents.length === 0 ? (
              <p className="font-mono text-xs font-bold text-gray-600">No other reported incidents within 3km.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {nearbyIncidents.map((near) => {
                  const nearSev = getSeverityInfo(near.severity);
                  return (
                    <div
                      key={near.id}
                      onClick={() => onSelectIncident(near)}
                      className="bg-white border-2 border-[#050505] p-2.5 shadow-[2px_2px_0_#050505] cursor-pointer hover:bg-[#FFD83D]/40 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] font-black bg-[#050505] text-white px-1">
                          #{near.id}
                        </span>
                        <span className={`font-mono text-[9px] font-black px-1 border border-[#050505] ${nearSev.badgeBg} ${nearSev.badgeText}`}>
                          {nearSev.level}
                        </span>
                      </div>
                      <p className="font-display font-black text-xs uppercase truncate text-[#050505]">
                        {near.title}
                      </p>
                      <p className="font-mono text-[11px] font-bold text-gray-700 mt-1">
                        {formatDistance(near.distanceKm)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions Footer */}
          <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={() => {
                onClose();
              }}
              className="px-5 py-2.5 bg-[#4C5CFF] text-white border-3 border-[#050505] shadow-[3px_3px_0_#050505] font-display font-black text-xs uppercase hover:bg-[#3949e6] cursor-pointer flex items-center gap-1.5"
            >
              <Navigation className="w-4 h-4" />
              <span>VIEW ON MAP</span>
            </button>

            <button
              onClick={() => alert(`Reassignment ticket created for ${incident.id}. Dispatched to BBMP Zonal Office.`)}
              className="px-5 py-2.5 bg-[#FF4F87] text-white border-3 border-[#050505] shadow-[3px_3px_0_#050505] font-display font-black text-xs uppercase hover:bg-[#ff3574] cursor-pointer flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>REASSIGN / PRIORITIZE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
