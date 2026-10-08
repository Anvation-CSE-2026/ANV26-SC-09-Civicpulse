import React, { useState } from 'react';
import Header from '../Layout/Header';
import Sidebar from '../Layout/Sidebar';
import ReportModal from '../Reports/ReportModal';
import IncidentDetailsModal from '../Incidents/IncidentDetailsModal';
import NotificationDrawer from '../Notifications/NotificationDrawer';
import AccountModal from '../Account/AccountModal';
import SimulationControl from '../SimulationControl';

import { useIncidents } from '../../context/IncidentContext';
import { useAuth } from '../../context/AuthContext';
import DashboardPage from '../../pages/DashboardPage';
import MyReportsPage from '../../pages/MyReportsPage';
import NearbyIssuesPage from '../../pages/NearbyIssuesPage';

export default function CitizenLayout({ tab = 'home' }) {
  const { 
    incidents, 
    userReports, 
    notifications, 
    addReport, 
    clearNotifications,
    simulateNewSevereReport
  } = useIncidents();

  const { currentUser, logout } = useAuth();

  const [currentTab, setCurrentTab] = useState(tab);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Location Picker State
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Toast Notification Banner
  const [toastMessage, setToastMessage] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const showToast = (msg, bg = '#B7FF2A') => {
    setToastMessage({ text: msg, bg });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleCreateReport = async (newReportData) => {
    try {
      const { reportId } = await addReport(newReportData, currentUser?.name);
      showToast(`Report #${reportId} submitted! +25 Civic Points awarded.`);
      setSelectedLocation(null);
    } catch (err) {
      showToast(`Error submitting report: ${err.message}`, '#FF4F87');
      throw err;
    }
  };

  const stats = {
    totalReports: userReports.length,
    resolvedReports: userReports.filter(r => r.status === 'RESOLVED').length,
    activeReports: userReports.filter(r => r.status !== 'RESOLVED').length,
    civicPoints: 240 + userReports.length * 25
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F8F1E5] text-[#050505] font-sans antialiased flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
        mobileOpen={isMobileSidebarOpen}
        setMobileOpen={setIsMobileSidebarOpen}
        unreadCount={unreadNotificationsCount}
        currentUser={currentUser}
        onLogout={logout}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col md:pl-72 min-w-0">
        {/* Sticky Header */}
        <Header
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          onToggleNotifications={() => setIsNotificationsDrawerOpen(prev => !prev)}
          unreadCount={unreadNotificationsCount}
          isSimulating={isSimulating}
          onOpenAccountModal={() => setIsAccountModalOpen(true)}
          currentUser={currentUser}
        />

        {/* Live Toast Banner */}
        {toastMessage && (
          <div 
            className="mx-4 md:mx-8 mt-4 p-3 border-3 border-[#050505] shadow-[4px_4px_0_#050505] font-mono font-black text-xs text-[#050505] animate-bounce flex items-center justify-between z-20"
            style={{ backgroundColor: toastMessage.bg }}
          >
            <span>{toastMessage.text}</span>
            <button 
              onClick={() => setToastMessage(null)}
              className="ml-2 font-black text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Active Tab Content */}
        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-x-hidden">
          {currentTab === 'home' && (
            <DashboardPage
              incidents={incidents}
              userReports={userReports}
              stats={stats}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              severityFilter={severityFilter}
              setSeverityFilter={setSeverityFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onResetFilters={() => {
                setSearchTerm('');
                setCategoryFilter('ALL');
                setSeverityFilter('ALL');
                setStatusFilter('ALL');
              }}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
              onSelectReport={(rep) => {
                const found = incidents.find(i => i.id === rep.incidentId || i.id === rep.id);
                if (found) setSelectedIncident(found);
              }}
              selectedLocation={selectedLocation}
              isSelectingLocation={isSelectingLocation}
              onLocationSelected={(loc) => {
                setSelectedLocation(loc);
                setIsSelectingLocation(false);
                setIsReportModalOpen(true);
                showToast(`📍 Location pinned on map: Lat ${loc.lat}, Lng ${loc.lng}`);
              }}
            />
          )}

          {currentTab === 'my-reports' && (
            <MyReportsPage
              userReports={userReports}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onSelectReport={(rep) => {
                const found = incidents.find(i => i.id === rep.incidentId || i.id === rep.id);
                if (found) setSelectedIncident(found);
              }}
            />
          )}

          {currentTab === 'nearby' && (
            <NearbyIssuesPage
              incidents={incidents}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
            />
          )}

          {currentTab === 'notifications' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="neo-box p-4 bg-[#FFD83D] flex items-center justify-between">
                <h1 className="font-display font-black text-2xl uppercase">ALL NOTIFICATIONS</h1>
                <button
                  onClick={clearNotifications}
                  className="px-3 py-1 bg-white border-2 border-black font-mono text-xs font-bold shadow-[2px_2px_0_#050505] cursor-pointer"
                >
                  CLEAR ALL
                </button>
              </div>

              {notifications.map((n) => (
                <div key={n.id} className="neo-box p-4 space-y-1">
                  <div className="flex justify-between font-mono text-xs font-bold">
                    <span className="bg-[#050505] text-[#B7FF2A] px-2 py-0.5">{n.type}</span>
                    <span className="text-gray-600">{n.timestamp}</span>
                  </div>
                  <p className="font-bold text-sm text-[#050505]">{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Floating Simulation Control Toolbar */}
      <SimulationControl
        isSimulating={isSimulating}
        onToggleSimulation={() => {
          setIsSimulating(prev => !prev);
          if (!isSimulating) simulateNewSevereReport(incidents[0]?.id);
          showToast(!isSimulating ? '▶️ Live simulation started!' : '🛑 Live simulation stopped.');
        }}
      />

      {/* Modals & Drawers */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleCreateReport}
        onStartMapPick={() => {
          setIsSelectingLocation(true);
          setCurrentTab('home');
          showToast('📍 CLICK ANYWHERE ON THE MAP to pick incident location', '#FFD83D');
        }}
        selectedLocation={selectedLocation}
      />

      <IncidentDetailsModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        allIncidents={incidents}
        onSelectIncident={(inc) => setSelectedIncident(inc)}
      />

      <NotificationDrawer
        isOpen={isNotificationsDrawerOpen}
        onClose={() => setIsNotificationsDrawerOpen(false)}
        notifications={notifications}
        onClearNotifications={clearNotifications}
        onSelectIncidentById={(incId) => {
          const found = incidents.find(i => i.id === incId);
          if (found) setSelectedIncident(found);
        }}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        user={currentUser}
        stats={stats}
        onLogout={logout}
      />
    </div>
  );
}
