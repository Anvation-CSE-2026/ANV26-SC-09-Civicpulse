import React from 'react';
import WelcomeBanner from '../components/Dashboard/WelcomeBanner';
import StatsCards from '../components/Dashboard/StatsCards';
import FilterBar from '../components/Dashboard/FilterBar';
import CivicMap from '../components/Map/CivicMap';
import ReportsList from '../components/Reports/ReportsList';

export default function DashboardPage({
  incidents,
  userReports,
  stats,
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  severityFilter,
  setSeverityFilter,
  statusFilter,
  setStatusFilter,
  onResetFilters,
  onOpenReportModal,
  onSelectIncident,
  onSelectReport,
  selectedLocation,
  isSelectingLocation,
  onLocationSelected
}) {
  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <WelcomeBanner
        activeReportsCount={stats.activeReports}
        onOpenReportModal={onOpenReportModal}
      />

      {/* Filter Toolbar */}
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        severityFilter={severityFilter}
        setSeverityFilter={setSeverityFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onResetFilters={onResetFilters}
      />

      {/* Main Grid: Map Section (Left ~65-70%) & My Reports Panel (Right ~30-35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Panel spanning 2 columns on desktop */}
        <div className="lg:col-span-2">
          <CivicMap
            incidents={incidents}
            onSelectIncident={onSelectIncident}
            selectedLocation={selectedLocation}
            isSelectingLocation={isSelectingLocation}
            onLocationSelected={onLocationSelected}
          />
        </div>

        {/* Right Side "MY REPORTS" Panel */}
        <div className="lg:col-span-1">
          <ReportsList
            userReports={userReports}
            onSelectReport={onSelectReport}
          />
        </div>
      </div>

      {/* Statistics Section Below Map */}
      <div className="pt-2">
        <StatsCards
          totalReports={stats.totalReports}
          resolvedReports={stats.resolvedReports}
          civicPoints={stats.civicPoints}
        />
      </div>
    </div>
  );
}
