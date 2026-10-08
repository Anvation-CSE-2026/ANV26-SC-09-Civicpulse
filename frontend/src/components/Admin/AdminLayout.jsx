import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import NotificationDrawer from '../Notifications/NotificationDrawer';
import AccountModal from '../Account/AccountModal';
import { useIncidents } from '../../context/IncidentContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { notifications, clearNotifications, adminStats } = useIncidents();
  const { currentUser, logout } = useAuth();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F8F1E5] text-[#050505] font-sans antialiased flex">
      {/* Admin Navigation Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        unreadCount={unreadCount}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        {/* Sticky Header */}
        <AdminHeader
          onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
          onToggleNotifications={() => setNotificationsOpen(prev => !prev)}
          unreadCount={unreadCount}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onOpenAccountModal={() => setAccountModalOpen(true)}
        />

        {/* Dynamic Route View */}
        <main className="flex-1 p-4 md:p-8 space-y-6 overflow-x-hidden">
          <Outlet context={{ searchTerm, setSearchTerm }} />
        </main>
      </div>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onClearNotifications={clearNotifications}
        onSelectIncidentById={() => setNotificationsOpen(false)}
      />

      {/* Admin Profile Account Modal */}
      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        user={currentUser}
        stats={{
          totalReports: adminStats.reportsToday,
          resolvedReports: Math.round(adminStats.reportsToday * 0.86),
          civicPoints: 950
        }}
        onLogout={() => {
          setAccountModalOpen(false);
          logout();
        }}
      />
    </div>
  );
}
