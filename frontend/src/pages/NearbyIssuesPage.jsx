import React, { useState } from 'react';
import { MapPin, Navigation, Eye, Flame } from 'lucide-react';
import { getSeverityInfo, getStatusStyle } from '../utils/severity';
import { calculateDistance, formatDistance } from '../utils/geo';
import CivicMap from '../components/Map/CivicMap';

export default function NearbyIssuesPage({ incidents, onSelectIncident }) {
  // Center near Koramangala
  const userLat = 12.9352;
  const userLng = 77.6245;

  const incidentsWithDistance = incidents.map(inc => ({
    ...inc,
    distanceKm: calculateDistance(userLat, userLng, inc.latitude, inc.longitude)
  })).sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="neo-box p-6 bg-[#FFD83D] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl text-[#050505] uppercase tracking-tight">
            NEARBY CIVIC ISSUES
          </h1>
          <p className="font-mono text-xs font-bold text-[#050505] mt-1">
            Displaying active infrastructure, safety, & utility incidents near your current location.
          </p>
        </div>
        <div className="px-4 py-2 bg-white border-3 border-[#050505] font-mono font-black text-xs">
          📍 CURRENT: KORAMANGALA (12.9352, 77.6245)
        </div>
      </div>

      {/* Grid: Map & Distance List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-h-[500px]">
          <CivicMap
            incidents={incidents}
            onSelectIncident={onSelectIncident}
          />
        </div>

        {/* Distance sorted list */}
        <div className="lg:col-span-1 neo-box p-4 space-y-3 max-h-[600px] overflow-y-auto">
          <h2 className="font-display font-black text-lg text-[#050505] uppercase border-b-3 border-[#050505] pb-2">
            PROXIMITY RADIAL LIST
          </h2>

          {incidentsWithDistance.slice(0, 10).map((inc) => {
            const sev = getSeverityInfo(inc.severity);
            const statusStyle = getStatusStyle(inc.status);

            return (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc)}
                className="bg-white border-3 border-[#050505] p-3 shadow-[3px_3px_0_#050505] hover:-translate-y-1 transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs text-[#4C5CFF]">
                    {formatDistance(inc.distanceKm)}
                  </span>
                  <span className={`font-mono text-[10px] font-black px-1.5 py-0.5 border border-[#050505] ${sev.badgeBg} ${sev.badgeText}`}>
                    {sev.level}
                  </span>
                </div>

                <h3 className="font-display font-black text-sm text-[#050505] uppercase leading-tight">
                  {inc.title}
                </h3>

                <div className="flex items-center justify-between font-mono text-[11px] text-gray-600 pt-1 border-t border-gray-200">
                  <span>{inc.areaName}</span>
                  <span className="font-bold text-[#050505]">{inc.reportCount} reports</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
