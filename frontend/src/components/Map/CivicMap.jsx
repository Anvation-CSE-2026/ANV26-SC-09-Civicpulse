import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import HeatmapLayer from './HeatmapLayer';
import MapLegend from './MapLegend';
import { getSeverityInfo, getStatusStyle } from '../../utils/severity';
import { MapPin, Layers, Flame, Eye, Navigation } from 'lucide-react';

// Location Picker component for handling map clicks
function LocationPickerHandler({ isSelectingLocation, onLocationSelected }) {
  useMapEvents({
    click(e) {
      if (isSelectingLocation && onLocationSelected) {
        onLocationSelected({
          lat: Math.round(e.latlng.lat * 10000) / 10000,
          lng: Math.round(e.latlng.lng * 10000) / 10000
        });
      }
    },
  });
  return null;
}

export default function CivicMap({ 
  incidents = [], 
  onSelectIncident,
  selectedLocation,
  isSelectingLocation,
  onLocationSelected
}) {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);

  const bengaluruCenter = [12.9716, 77.5946];

  // Helper to create custom Leaflet div icons for incidents
  const createIncidentIcon = (incident) => {
    const info = getSeverityInfo(incident.severity);
    const isCritical = info.level === 'CRITICAL';
    const isHigh = info.level === 'HIGH';

    const pulsingClass = isCritical ? 'critical-pulsing-marker' : '';

    const html = `
      <div class="relative group cursor-pointer">
        <div class="w-8 h-8 md:w-9 md:h-9 bg-[${info.markerBg}] border-3 border-[#050505] shadow-[3px_3px_0_#050505] ${pulsingClass} flex items-center justify-center font-mono font-black text-xs text-[${info.markerText}] transform transition-transform group-hover:scale-110">
          ${incident.severity}
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-leaflet-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });
  };

  // Selected Location icon for creation mode
  const selectedLocationIcon = L.divIcon({
    html: `
      <div class="w-10 h-10 bg-[#FF4F87] border-3 border-[#050505] shadow-[4px_4px_0_#050505] flex items-center justify-center animate-bounce text-white font-black">
        📍
      </div>
    `,
    className: 'selected-location-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  const activeCount = incidents.filter(i => i.status !== 'RESOLVED').length;

  return (
    <div className="neo-box overflow-hidden flex flex-col h-full relative">
      {/* Map Header Toolbar */}
      <div className="bg-white border-b-4 border-[#050505] p-3 md:p-4 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#4C5CFF] border-2 border-[#050505] shadow-[2px_2px_0_#050505] flex items-center justify-center text-white">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-black text-lg md:text-xl text-[#050505] tracking-tight uppercase leading-none">
              NEARBY ISSUES
            </h2>
            <p className="font-mono text-xs font-bold text-gray-600 mt-0.5">
              BENGALURU URBAN MAP
            </p>
          </div>
        </div>

        {/* Right Header Status & Controls */}
        <div className="flex items-center gap-2">
          {isSelectingLocation && (
            <span className="font-mono font-black text-xs bg-[#FF4F87] text-white px-3 py-1 border-2 border-[#050505] shadow-[2px_2px_0_#050505] animate-pulse">
              CLICK MAP TO SELECT LOCATION
            </span>
          )}

          <span className="font-mono font-black text-xs bg-[#B7FF2A] border-2 border-[#050505] px-3 py-1 shadow-[2px_2px_0_#050505] text-[#050505]">
            ● {activeCount} ACTIVE
          </span>

          {/* Toggle Heatmap */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1 font-mono font-bold text-xs border-2 border-[#050505] shadow-[2px_2px_0_#050505] flex items-center gap-1.5 cursor-pointer transition-all ${
              showHeatmap ? 'bg-[#FFD83D] text-[#050505]' : 'bg-gray-100 text-gray-500 line-through'
            }`}
            title="Toggle Severity Heatmap"
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HEATMAP</span>
          </button>

          {/* Toggle Markers */}
          <button
            onClick={() => setShowMarkers(!showMarkers)}
            className={`px-3 py-1 font-mono font-bold text-xs border-2 border-[#050505] shadow-[2px_2px_0_#050505] flex items-center gap-1.5 cursor-pointer transition-all ${
              showMarkers ? 'bg-[#4C5CFF] text-white' : 'bg-gray-100 text-gray-500 line-through'
            }`}
            title="Toggle Markers"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">MARKERS</span>
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative flex-1 min-h-[420px] lg:min-h-[500px] w-full">
        <MapContainer
          center={bengaluruCenter}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-full min-h-[420px] lg:min-h-[500px]"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationPickerHandler 
            isSelectingLocation={isSelectingLocation} 
            onLocationSelected={onLocationSelected} 
          />

          {/* Heatmap Layer */}
          {showHeatmap && <HeatmapLayer incidents={incidents} />}

          {/* Incident Markers */}
          {showMarkers && incidents.map((incident) => {
            const severityInfo = getSeverityInfo(incident.severity);
            const statusStyle = getStatusStyle(incident.status);

            return (
              <Marker
                key={incident.id}
                position={[incident.latitude, incident.longitude]}
                icon={createIncidentIcon(incident)}
              >
                <Popup>
                  <div className="p-3 w-64 bg-white font-sans">
                    {/* Header ID */}
                    <div className="flex items-center justify-between pb-1 mb-2 border-b-2 border-[#050505]">
                      <span className="font-mono font-black text-xs text-[#050505]">
                        INCIDENT #{incident.id}
                      </span>
                      <span className={`font-mono text-[10px] font-black px-1.5 py-0.5 border border-[#050505] ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.label}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-black text-sm text-[#050505] uppercase leading-tight mb-2">
                      {incident.title}
                    </h3>

                    {/* Meta info */}
                    <div className="space-y-1 font-mono text-xs mb-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Severity:</span>
                        <span className={`font-bold px-1 text-[10px] border border-[#050505] ${severityInfo.badgeBg} ${severityInfo.badgeText}`}>
                          {incident.severity} / 100 ({severityInfo.level})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Citizen reports:</span>
                        <span className="font-bold text-[#050505]">{incident.reportCount} reports</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Updated:</span>
                        <span className="font-bold text-gray-800">{incident.updatedAt}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => onSelectIncident && onSelectIncident(incident)}
                      className="w-full py-1.5 bg-[#4C5CFF] text-white border-2 border-[#050505] shadow-[2px_2px_0_#050505] font-display font-black text-xs uppercase hover:bg-[#3b4bdc] transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>VIEW INCIDENT →</span>
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Selected Temporary Location Pin */}
          {selectedLocation && (
            <Marker 
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={selectedLocationIcon}
            >
              <Popup>
                <div className="p-2 font-mono font-bold text-xs text-[#050505]">
                  📍 Selected Location<br/>
                  Lat: {selectedLocation.lat}, Lng: {selectedLocation.lng}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Legend Overlay */}
        <MapLegend />
      </div>
    </div>
  );
}
