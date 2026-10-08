import React from 'react';
import CivicMap from '../Map/CivicMap';
import { useIncidents } from '../../context/IncidentContext';
import { MapPin } from 'lucide-react';

export default function LandingMap() {
  const { incidents } = useIncidents();

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 border-b-4 border-[#050505] bg-[#F8F1E5]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="font-mono font-black text-xs uppercase bg-[#B7FF2A] text-[#050505] px-3 py-1 border border-[#050505] inline-block shadow-[2px_2px_0_#050505]">
            GEOSPATIAL HEATMAP
          </span>
          <h2 className="font-display font-black text-3xl md:text-5xl uppercase text-[#050505]">
            SEE WHERE YOUR CITY NEEDS HELP.
          </h2>
          <p className="font-sans font-bold text-sm md:text-base text-gray-700">
            Real OpenStreetMap tiles with live Leaflet severity heatmap layer centered over Bengaluru Urban.
          </p>
        </div>

        {/* Real Leaflet Map Container */}
        <div className="h-[480px] lg:h-[540px]">
          <CivicMap incidents={incidents} />
        </div>
      </div>
    </section>
  );
}
