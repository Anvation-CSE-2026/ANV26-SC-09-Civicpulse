import React from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { Wrench, Plus, Minus, RefreshCw, Shield, Truck } from 'lucide-react';

export default function AdminResourcesPage() {
  const { resources, updateResourceQuantity, recalculatePriorities, allocations } = useIncidents();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="neo-box p-5 bg-[#B7FF2A] text-[#050505] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl md:text-3xl uppercase">
            MUNICIPAL RESOURCE & DISPATCH INVENTORY
          </h1>
          <p className="font-mono text-xs font-bold text-[#050505] mt-1">
            Manage field units, emergency vehicles, linesmen crews, and road repair machinery.
          </p>
        </div>
        <button
          onClick={recalculatePriorities}
          className="px-4 py-2 bg-[#050505] text-white border-2 border-[#050505] font-display font-black text-xs uppercase hover:bg-[#FFD83D] hover:text-[#050505] cursor-pointer flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" />
          <span>RECOMPUTE PRIORITIES</span>
        </button>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(resources).map(([type, res]) => (
          <div key={type} className="neo-box p-5 space-y-4 bg-white">
            <div className="flex items-center justify-between border-b-3 border-[#050505] pb-2">
              <div>
                <h3 className="font-display font-black text-xl text-[#050505] uppercase">{type}</h3>
                <p className="font-mono text-xs text-gray-600 font-bold">{res.unitName}</p>
              </div>
              <div className="w-10 h-10 bg-[#FFD83D] border-2 border-[#050505] shadow-[2px_2px_0_#050505] flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#050505]" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-xs font-bold text-gray-700">AVAILABLE UNITS:</span>
              <div className="flex items-center gap-2 font-mono">
                <button
                  onClick={() => updateResourceQuantity(type, -1)}
                  className="w-8 h-8 bg-[#F8F1E5] border-2 border-[#050505] font-black text-sm flex items-center justify-center hover:bg-[#FF4F87] hover:text-white cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-display font-black text-2xl text-[#050505]">{res.count}</span>
                <button
                  onClick={() => updateResourceQuantity(type, 1)}
                  className="w-8 h-8 bg-[#F8F1E5] border-2 border-[#050505] font-black text-sm flex items-center justify-center hover:bg-[#B7FF2A] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Deployments Table */}
      <div className="neo-box p-5 space-y-3 bg-white">
        <h3 className="font-display font-black text-xl text-[#050505] uppercase border-b-3 border-[#050505] pb-2">
          ACTIVE TEAM ALLOCATION MATRIX
        </h3>

        <div className="space-y-2 font-mono text-xs">
          {allocations.map((alloc) => (
            <div key={alloc.incidentId} className="p-3 border-2 border-[#050505] bg-[#F8F1E5] flex items-center justify-between">
              <div>
                <span className="font-black text-[#4C5CFF]">#{alloc.incidentId}</span>
                <span className="font-bold text-[#050505] ml-2">{alloc.incidentTitle}</span>
                <p className="text-[11px] text-gray-600 mt-0.5">Teams: {alloc.teams.join(', ')}</p>
              </div>
              <span className="px-2 py-1 bg-[#00D66B] text-black font-black text-[10px] border border-[#050505]">
                {alloc.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
