import React, { useState } from 'react';
import { useIncidents } from '../../context/IncidentContext';
import CivicMap from '../../components/Map/CivicMap';
import { getSeverityInfo, getStatusStyle } from '../../utils/severity';
import { Map, Layers, ShieldAlert, Eye } from 'lucide-react';

export default function AdminMapPage() {
  const { incidents, dispatchIncident, resolveIncident } = useIncidents();
  const [selectedInc, setSelectedInc] = useState(incidents[0] || null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="neo-box p-5 bg-[#FFD83D] text-[#050505] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl uppercase">
            FULLSCREEN MUNICIPAL COMMAND MAP
          </h1>
          <p className="font-mono text-xs font-bold text-[#050505] mt-1">
            Real-time Leaflet OpenStreetMap view with active severity heatmap & cluster pins.
          </p>
        </div>
        <span className="font-mono font-black text-xs bg-white border-2 border-[#050505] px-3 py-1 shadow-[2px_2px_0_#050505]">
          BENGALURU URBAN GRID
        </span>
      </div>

      {/* Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 min-h-[560px]">
          <CivicMap
            incidents={incidents}
            onSelectIncident={(inc) => setSelectedInc(inc)}
          />
        </div>

        {/* Selected Incident Drawer */}
        <div className="lg:col-span-4 neo-box p-4 space-y-4">
          <h3 className="font-display font-black text-lg uppercase pb-2 border-b-3 border-[#050505]">
            SELECTED MAP INCIDENT
          </h3>

          {selectedInc ? (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-[#4C5CFF]">#{selectedInc.id}</span>
                <span className="px-2 py-0.5 border border-[#050505] bg-[#FF4F87] text-white font-black">
                  {selectedInc.severity} SEV
                </span>
              </div>

              <h4 className="font-display font-black text-base uppercase text-[#050505]">
                {selectedInc.title}
              </h4>

              <p className="font-sans font-bold text-xs text-gray-700">
                {selectedInc.description}
              </p>

              <div className="bg-white border-2 border-[#050505] p-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-bold text-[#050505]">{selectedInc.areaName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reports:</span>
                  <span className="font-bold text-[#050505]">{selectedInc.reportCount} verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-bold text-[#4C5CFF]">{selectedInc.status}</span>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => dispatchIncident(selectedInc.id, 'BBMP Unit 1')}
                  className="py-2 bg-[#4C5CFF] text-white border-2 border-[#050505] font-black text-xs uppercase"
                >
                  DISPATCH
                </button>
                <button
                  onClick={() => resolveIncident(selectedInc.id)}
                  className="py-2 bg-[#00D66B] text-[#050505] border-2 border-[#050505] font-black text-xs uppercase"
                >
                  RESOLVE
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 font-mono text-xs">Click a map pin to inspect details.</p>
          )}
        </div>
      </div>
    </div>
  );
}
