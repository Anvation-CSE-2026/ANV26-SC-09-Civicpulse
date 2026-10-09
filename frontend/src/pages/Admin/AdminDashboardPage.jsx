import React, { useState } from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { getSeverityInfo, getStatusStyle, calculateSeverityBreakdown } from '../../utils/severity';
import CivicMap from '../../components/Map/CivicMap';
import { 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  TrendingUp, 
  Filter, 
  Sparkles, 
  Clock, 
  ShieldAlert, 
  Check, 
  Plus, 
  Minus, 
  RefreshCw, 
  Zap, 
  Activity, 
  Layers, 
  Wrench, 
  Radio
} from 'lucide-react';

export default function AdminDashboardPage() {
  const {
    incidents,
    resources,
    allocations,
    activities,
    adminStats,
    dispatchIncident,
    resolveIncident,
    updateResourceQuantity,
    recalculatePriorities,
    simulateNewSevereReport
  } = useIncidents();

  // Selected Incident State (defaults to first incident)
  const [selectedId, setSelectedId] = useState(incidents[0]?.id || 'INC-2041');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [selectedTeam, setSelectedTeam] = useState('Road Maintenance Unit');

  const selectedIncident = incidents.find(i => String(i.id) === String(selectedId)) || incidents[0];
  const severityInfo = selectedIncident ? getSeverityInfo(selectedIncident.severity) : getSeverityInfo(88);
  const statusStyle = selectedIncident ? getStatusStyle(selectedIncident.status) : getStatusStyle('PENDING');
  const breakdown = selectedIncident ? calculateSeverityBreakdown(selectedIncident) : { factors: [], total: 88 };

  // Summary Cards Configuration (Section 9)
  const summaryCards = [
    {
      id: 'critical',
      number: adminStats.criticalIncidents,
      change: adminStats.criticalChange,
      label: 'CRITICAL INCIDENTS',
      bgColor: 'bg-[#FF4F87]',
      textColor: 'text-white',
      icon: AlertTriangle
    },
    {
      id: 'active',
      number: adminStats.activeCases,
      change: adminStats.activeChange,
      label: 'ACTIVE CASES',
      bgColor: 'bg-[#FF9F1C]',
      textColor: 'text-white',
      icon: Activity
    },
    {
      id: 'reports',
      number: adminStats.reportsToday,
      change: adminStats.reportsChange,
      label: 'REPORTS TODAY',
      bgColor: 'bg-[#4C5CFF]',
      textColor: 'text-white',
      icon: FileText
    },
    {
      id: 'resolution',
      number: `${adminStats.resolutionRate}%`,
      change: adminStats.resolutionChange,
      label: 'RESOLUTION RATE',
      bgColor: 'bg-[#00D66B]',
      textColor: 'text-[#050505]',
      icon: CheckCircle2
    }
  ];

  const filteredIncidents = incidents.filter(i => {
    if (filterCategory === 'ALL') return true;
    return i.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      {/* 1. Admin Summary Cards (Section 9) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="neo-box p-4 flex items-center justify-between hover:-translate-y-1 transition-all"
            >
              <div className="space-y-1">
                <span className="font-mono font-bold text-xs uppercase text-gray-700 block">
                  {card.label}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-3xl md:text-4xl text-[#050505] leading-none">
                    {card.number}
                  </span>
                  <span className="font-mono font-extrabold text-xs text-[#00D66B] bg-[#050505] px-1.5 py-0.5">
                    {card.change}
                  </span>
                </div>
              </div>

              <div className={`w-12 h-12 ${card.bgColor} border-3 border-[#050505] shadow-[3px_3px_0_#050505] flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Command Center Main Workspace (3 columns layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Incidents List (3 cols) */}
        <div className="lg:col-span-3 neo-box p-3.5 flex flex-col h-[640px]">
          <div className="flex items-center justify-between pb-2 mb-3 border-b-3 border-[#050505]">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#FF4F87]" />
              <h3 className="font-display font-black text-base uppercase text-[#050505]">
                INCIDENTS
              </h3>
            </div>
            <Filter className="w-4 h-4 text-gray-600 cursor-pointer" />
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex gap-1 pb-2 mb-2 border-b border-gray-200 overflow-x-auto">
            {['ALL', 'INFRASTRUCTURE', 'PUBLIC SAFETY', 'UTILITIES'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2 py-0.5 font-mono text-[10px] font-black uppercase border border-[#050505] whitespace-nowrap cursor-pointer ${
                  filterCategory === cat ? 'bg-[#050505] text-[#B7FF2A]' : 'bg-white text-gray-700'
                }`}
              >
                {cat === 'PUBLIC SAFETY' ? 'SAFETY' : cat}
              </button>
            ))}
          </div>

          {/* Incident Items */}
          <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
            {filteredIncidents.map((inc) => {
              const sev = getSeverityInfo(inc.severity);
              const isSelected = inc.id === selectedId;

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedId(inc.id)}
                  className={`p-3 border-3 border-[#050505] transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFD83D] shadow-[4px_4px_0_#050505] translate-x-1'
                      : 'bg-white shadow-[2px_2px_0_#050505] hover:bg-[#F8F1E5]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-black text-xs text-[#050505]">
                      #{inc.id}
                    </span>
                    <span className={`font-mono text-[9px] font-black px-1.5 py-0.5 border border-[#050505] ${sev.badgeBg} ${sev.badgeText}`}>
                      {inc.severity} SEV
                    </span>
                  </div>

                  <h4 className="font-display font-black text-xs uppercase leading-tight text-[#050505] truncate">
                    {inc.title}
                  </h4>

                  <div className="flex items-center justify-between font-mono text-[10px] text-gray-700 mt-2 pt-1 border-t border-[#050505]/20">
                    <span>{inc.areaName ? inc.areaName.substring(0, 14) : 'SEC-4'}</span>
                    <span className="font-black text-[#050505]">{inc.reportCount} reports</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column: Admin Live Map (5 cols) */}
        <div className="lg:col-span-5 h-[640px]">
          <CivicMap
            incidents={incidents}
            onSelectIncident={(inc) => setSelectedId(inc.id)}
          />
        </div>

        {/* Right Column: Selected Incident Details Panel (4 cols) */}
        <div className="lg:col-span-4 neo-box p-4 flex flex-col h-[640px] overflow-y-auto space-y-4">
          {selectedIncident ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b-3 border-[#050505]">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm bg-[#050505] text-[#B7FF2A] px-2 py-0.5">
                    #{selectedIncident.id}
                  </span>
                  <span className={`font-mono text-xs font-black px-2 py-0.5 border border-[#050505] ${severityInfo.badgeBg} ${severityInfo.badgeText}`}>
                    SEV {selectedIncident.severity}
                  </span>
                </div>

                <span className={`font-mono text-xs font-black px-2 py-0.5 border border-[#050505] ${statusStyle.bg} ${statusStyle.text}`}>
                  {statusStyle.label}
                </span>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                <div className="bg-white border-2 border-[#050505] p-2 shadow-[2px_2px_0_#050505]">
                  <span className="font-black text-base text-[#050505] block">{selectedIncident.reportCount}</span>
                  <span className="text-[9px] text-gray-600 uppercase">REPORTS</span>
                </div>

                <div className="bg-white border-2 border-[#050505] p-2 shadow-[2px_2px_0_#050505]">
                  <span className="font-black text-base text-[#4C5CFF] block">8</span>
                  <span className="text-[9px] text-gray-600 uppercase">EVIDENCE</span>
                </div>

                <div className="bg-[#B7FF2A] border-2 border-[#050505] p-2 shadow-[2px_2px_0_#050505]">
                  <span className="font-black text-base text-[#050505] block">{Math.min(99, selectedIncident.severity + 4)}</span>
                  <span className="text-[9px] text-[#050505] font-black uppercase">PRIORITY</span>
                </div>
              </div>

              {/* Title & Location */}
              <div>
                <h3 className="font-display font-black text-lg text-[#050505] uppercase leading-snug">
                  {selectedIncident.title}
                </h3>
                <p className="font-mono text-xs text-gray-700 font-bold mt-0.5">
                  📍 {selectedIncident.areaName}
                </p>
              </div>

              {/* AI Evidence Section (Section 13) */}
              <div className="bg-white border-2 border-[#050505] p-3 shadow-[2px_2px_0_#050505] space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-[#050505]">
                  <span className="font-mono font-black text-xs uppercase text-[#050505] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#4C5CFF]" /> AI EVIDENCE
                  </span>
                  <span className="font-mono text-[10px] font-extrabold text-[#00D66B]">94% CONFIDENCE</span>
                </div>

                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between py-0.5 border-b border-gray-100">
                    <span className="text-gray-700">Standing water depth:</span>
                    <span className="font-bold text-[#050505]">0.8m (High hazard)</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-gray-100">
                    <span className="text-gray-700">Electrical grid proximity:</span>
                    <span className="font-black text-[#FF4F87]">15m (Risk detected)</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-gray-100">
                    <span className="text-gray-700">Stranded vehicles:</span>
                    <span className="font-bold text-[#050505]">3 sedans, 2 bikes</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-gray-700">Road coverage:</span>
                    <span className="font-bold text-[#050505]">80% lane blockage</span>
                  </div>
                </div>
              </div>

              {/* Explainable Severity Breakdown (Section 14 - Real ML Pipeline) */}
              <div className="bg-[#F8F1E5] border-2 border-[#050505] p-3 shadow-[2px_2px_0_#050505] space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-[#050505]">
                  <span className="font-mono font-black text-xs uppercase text-[#050505] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#4C5CFF]" /> EXPLAINABLE SEVERITY BREAKDOWN
                  </span>
                  <span className="text-[10px] bg-[#4C5CFF] text-white px-1.5 py-0.5 font-bold">
                    {breakdown.modelVersion || 'civicpulse-v1'}
                  </span>
                </div>

                {/* ML Prediction & Confidence */}
                <div className="grid grid-cols-2 gap-2 bg-white p-2 border border-[#050505]">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block">ML PREDICTION</span>
                    <span className="font-display font-black text-sm text-[#050505]">
                      {breakdown.mlPredictedPriority} — {selectedIncident.severity}/100
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 font-bold block">MODEL CONFIDENCE</span>
                    <span className="font-display font-black text-sm text-[#00D66B] bg-[#050505] px-1.5 py-0.5 inline-block">
                      {breakdown.mlConfidence}%
                    </span>
                  </div>
                </div>

                {/* ML Factors */}
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-600 font-black uppercase block">RISK WEIGHT FACTORS</span>
                  {breakdown.factors.map((item) => (
                    <div key={item.label} className="flex justify-between text-[11px]">
                      <span className="text-gray-700">{item.label}:</span>
                      <span className="font-black text-[#4C5CFF]">+{item.score}</span>
                    </div>
                  ))}
                </div>

                {/* Civic Context */}
                <div className="pt-1 border-t border-gray-300">
                  <span className="text-[10px] text-gray-600 font-black uppercase block mb-1">CIVIC CONTEXT</span>
                  <div className="grid grid-cols-3 gap-1 text-[10px]">
                    <div className="bg-white p-1 border border-gray-300">
                      <span className="text-gray-500 block">Rainfall</span>
                      <span className="font-black text-[#050505]">{breakdown.context?.rainfall || '12.4 mm'}</span>
                    </div>
                    <div className="bg-white p-1 border border-gray-300">
                      <span className="text-gray-500 block">Traffic</span>
                      <span className="font-black text-[#050505]">{breakdown.context?.traffic || '72/100'}</span>
                    </div>
                    <div className="bg-white p-1 border border-gray-300">
                      <span className="text-gray-500 block">Population</span>
                      <span className="font-black text-[#050505]">{breakdown.context?.population || '45,000'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-1 border-t border-[#050505] font-black text-sm text-[#050505]">
                  <span>TOTAL ML SEVERITY:</span>
                  <span>{selectedIncident.severity}</span>
                </div>
              </div>

              {/* Recommendation Card (Section 15) */}
              <div className="bg-[#FFD83D] border-3 border-[#050505] p-3 shadow-[3px_3px_0_#050505] space-y-1.5">
                <span className="font-mono font-black text-[10px] uppercase text-[#050505] block">
                  {selectedIncident.assignedTeam ? 'ASSIGNED FIELD UNIT:' : 'SELECT UNIT TO DISPATCH:'}
                </span>
                {selectedIncident.assignedTeam ? (
                  <p className="font-display font-black text-sm uppercase text-[#050505] bg-[#B7FF2A] px-2 py-1 border border-black inline-block">
                    ✓ {selectedIncident.assignedTeam}
                  </p>
                ) : (
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-full bg-white border-2 border-[#050505] p-1.5 font-mono font-bold text-xs shadow-[2px_2px_0_#050505]"
                  >
                    <option value="Road Maintenance Unit">Road Maintenance Unit</option>
                    <option value="BBMP Rapid Action Team">BBMP Rapid Action Team</option>
                    <option value="Water & Drainage Unit">Water & Drainage Unit</option>
                    <option value="Electrical Maintenance Unit">Electrical Maintenance Unit</option>
                  </select>
                )}
              </div>

              {/* Action Buttons (Section 16) */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => dispatchIncident(selectedIncident.id, selectedIncident.assignedTeam || selectedTeam)}
                  className="py-2.5 bg-[#4C5CFF] text-white border-2 border-[#050505] shadow-[2px_2px_0_#050505] font-display font-black text-xs uppercase hover:bg-[#3848e8] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>DISPATCH</span>
                </button>

                <button
                  onClick={() => resolveIncident(selectedIncident.id)}
                  className="py-2.5 bg-[#00D66B] text-[#050505] border-2 border-[#050505] shadow-[2px_2px_0_#050505] font-display font-black text-xs uppercase hover:bg-[#00be5e] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>RESOLVE</span>
                </button>
              </div>

              {/* Timeline (Section 17) */}
              <div className="bg-white border-2 border-[#050505] p-3 shadow-[2px_2px_0_#050505]">
                <span className="font-mono font-black text-xs uppercase text-[#050505] block pb-1 border-b border-[#050505] mb-2 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#4C5CFF]" /> INCIDENT TIMELINE
                </span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {(selectedIncident.timeline || [
                    { time: '10:00', text: 'CREATED' },
                    { time: '10:11', text: '+3 REPORTS' },
                    { time: '10:24', text: 'IMG EVIDENCE' },
                    { time: '10:31', text: 'HAZARD' }
                  ]).map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="font-black bg-[#FFD83D] border border-[#050505] px-1 text-[10px]">{t.time}</span>
                      <span className="font-bold text-gray-800">{t.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500 font-mono text-xs">
              Select an incident from the list.
            </div>
          )}
        </div>
      </div>

      {/* 3. Resource Management & Live Reprioritization Simulation (Section 18 & 19 & 20) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Resource Quantity Controls (6 cols) */}
        <div className="lg:col-span-6 neo-box p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b-3 border-[#050505]">
            <div>
              <h3 className="font-display font-black text-lg text-[#050505] uppercase">
                RESOURCE UNITS INVENTORY
              </h3>
              <p className="font-mono text-xs text-gray-600 font-bold">
                Adjust available field deployment units & recompute priority matrix.
              </p>
            </div>

            <button
              onClick={recalculatePriorities}
              className="px-3.5 py-2 bg-[#FFD83D] text-[#050505] border-2 border-[#050505] shadow-[2px_2px_0_#050505] font-display font-black text-xs uppercase hover:bg-[#ffe169] cursor-pointer flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RECOMPUTE PRIORITIES</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
            {Object.entries(resources).map(([type, res]) => (
              <div key={type} className="bg-white border-2 border-[#050505] p-3 shadow-[2px_2px_0_#050505] flex items-center justify-between">
                <div>
                  <span className="font-black text-[#050505] block">{type}</span>
                  <span className="text-[10px] text-gray-500">{res.unitName}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateResourceQuantity(type, -1)}
                    className="w-6 h-6 bg-[#F8F1E5] border border-[#050505] font-black flex items-center justify-center hover:bg-[#FF4F87] hover:text-white cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <span className="w-6 text-center font-black text-sm text-[#050505]">
                    {res.count}
                  </span>

                  <button
                    onClick={() => updateResourceQuantity(type, 1)}
                    className="w-6 h-6 bg-[#F8F1E5] border border-[#050505] font-black flex items-center justify-center hover:bg-[#B7FF2A] cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Hackathon Simulation CTA (Section 20) */}
          <div className="p-3.5 bg-[#B7FF2A] border-3 border-[#050505] shadow-[3px_3px_0_#050505] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-mono font-black text-xs uppercase text-[#050505] block">
                ⚡ DEMO REPRIORITIZATION SIMULATION:
              </span>
              <p className="font-sans font-bold text-xs text-[#050505] mt-0.5">
                Simulate 5 incoming severe reports on selected incident ({selectedId}).
              </p>
            </div>

            <button
              onClick={() => simulateNewSevereReport(selectedId)}
              className="px-4 py-2.5 bg-[#FF4F87] text-white border-2 border-[#050505] shadow-[2px_2px_0_#050505] font-display font-black text-xs uppercase hover:bg-[#ff3574] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>SIMULATE NEW SEVERE REPORT</span>
            </button>
          </div>
        </div>

        {/* Resource Allocations Panel (6 cols) */}
        <div className="lg:col-span-6 neo-box p-4 space-y-3">
          <h3 className="font-display font-black text-lg text-[#050505] uppercase pb-2 border-b-3 border-[#050505]">
            FIELD TEAM RESOURCE ALLOCATIONS
          </h3>

          <div className="space-y-2.5 font-mono text-xs overflow-y-auto max-h-[220px]">
            {allocations.map((alloc) => (
              <div key={alloc.incidentId} className="bg-white border-2 border-[#050505] p-3 shadow-[2px_2px_0_#050505] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-black text-[#4C5CFF]">#{alloc.incidentId}</span>
                  <span className="font-bold text-[#050505] ml-2">{alloc.incidentTitle}</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {alloc.teams.map((t, i) => (
                      <span key={i} className="bg-[#F8F1E5] text-gray-800 text-[10px] font-bold px-1.5 py-0.5 border border-[#050505]">
                        → {t}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="font-black text-[10px] bg-[#00D66B] text-[#050505] px-2 py-1 border border-[#050505] self-start sm:self-auto">
                  {alloc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Recent Activity Feed (Section 21) */}
      <div className="neo-box p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b-3 border-[#050505]">
          <h3 className="font-display font-black text-lg text-[#050505] uppercase">
            RECENT ACTIVITY
          </h3>
          <span className="font-mono font-bold text-xs bg-[#050505] text-[#B7FF2A] px-2.5 py-0.5">
            LAST 30 MINUTES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
          {activities.map((act) => (
            <div
              key={act.id}
              className="bg-white border-2 border-[#050505] p-3 shadow-[2px_2px_0_#050505] flex flex-col justify-between space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span 
                  className="font-black text-[10px] px-1.5 py-0.5 border border-[#050505]"
                  style={{ backgroundColor: act.color, color: act.color === '#050505' ? '#FFF' : '#050505' }}
                >
                  {act.source}
                </span>
                <span className="text-[10px] font-bold text-gray-500">{act.timestamp}</span>
              </div>

              <p className="font-bold text-xs text-[#050505] leading-snug">
                {act.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
