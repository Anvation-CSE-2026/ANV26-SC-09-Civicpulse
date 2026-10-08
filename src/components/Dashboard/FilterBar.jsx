import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';

export default function FilterBar({ 
  searchTerm, 
  setSearchTerm, 
  categoryFilter, 
  setCategoryFilter, 
  severityFilter, 
  setSeverityFilter, 
  statusFilter, 
  setStatusFilter,
  onResetFilters 
}) {
  const categories = ['ALL', 'INFRASTRUCTURE', 'PUBLIC SAFETY', 'UTILITIES'];
  const severities = ['ALL', 'NORMAL', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const statuses = ['ALL', 'PENDING', 'IN PROGRESS', 'RESOLVED'];

  return (
    <div className="neo-box p-4 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search incidents by location, title, or ID..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border-3 border-[#050505] shadow-[3px_3px_0_#050505] font-sans font-bold text-sm text-[#050505] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B7FF2A]"
        />
      </div>

      {/* Filter Dropdowns / Pill Groups */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-black text-xs uppercase text-[#050505] hidden sm:inline">
            CAT:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border-3 border-[#050505] shadow-[2px_2px_0_#050505] font-mono font-bold text-xs px-3 py-2 cursor-pointer focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-black text-xs uppercase text-[#050505] hidden sm:inline">
            SEV:
          </span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-white border-3 border-[#050505] shadow-[2px_2px_0_#050505] font-mono font-bold text-xs px-3 py-2 cursor-pointer focus:outline-none"
          >
            {severities.map((sev) => (
              <option key={sev} value={sev}>{sev}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-black text-xs uppercase text-[#050505] hidden sm:inline">
            STAT:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border-3 border-[#050505] shadow-[2px_2px_0_#050505] font-mono font-bold text-xs px-3 py-2 cursor-pointer focus:outline-none"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        {(searchTerm || categoryFilter !== 'ALL' || severityFilter !== 'ALL' || statusFilter !== 'ALL') && (
          <button
            onClick={onResetFilters}
            className="px-3 py-2 bg-[#FF4F87] text-white border-2 border-[#050505] shadow-[2px_2px_0_#050505] font-mono font-bold text-xs uppercase flex items-center gap-1 hover:bg-[#ff3574] cursor-pointer"
            title="Reset Filters"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        )}
      </div>
    </div>
  );
}
