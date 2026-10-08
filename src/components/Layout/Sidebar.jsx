import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  MapPin, 
  Bell, 
  HelpCircle, 
  LogOut, 
  HeartHandshake,
  User,
  X 
} from 'lucide-react';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  onOpenReportModal, 
  onOpenAccountModal,
  mobileOpen, 
  setMobileOpen,
  unreadCount,
  currentUser,
  onLogout 
}) {
  const navItems = [
    { id: 'home', label: 'HOME', icon: LayoutDashboard },
    { id: 'report-issue', label: 'REPORT ISSUE', icon: PlusCircle, isAction: true },
    { id: 'my-reports', label: 'MY REPORTS', icon: FileText },
    { id: 'nearby', label: 'NEARBY ISSUES', icon: MapPin },
    { id: 'notifications', label: 'NOTIFICATIONS', icon: Bell, badge: unreadCount },
    { id: 'help', label: 'HELP', icon: HelpCircle },
  ];

  const handleNavClick = (item) => {
    if (item.isAction) {
      onOpenReportModal();
    } else {
      setCurrentTab(item.id);
    }
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#F8F1E5] border-r-4 border-[#050505] flex flex-col justify-between p-4 transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Top Logo Section */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b-4 border-[#050505]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#B7FF2A] border-3 border-[#050505] shadow-[3px_3px_0_#050505] flex items-center justify-center font-black">
                <HeartHandshake className="w-7 h-7 text-[#050505]" />
              </div>
              <div>
                <h1 className="font-display font-black text-2xl leading-none tracking-tight text-[#050505]">
                  CIVICPULSE
                </h1>
                <p className="font-mono font-bold text-xs uppercase tracking-wider text-gray-700 mt-1">
                  CITIZEN PORTAL
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button 
              onClick={() => setMobileOpen(false)}
              className="md:hidden w-9 h-9 bg-[#FF4F87] border-2 border-[#050505] shadow-[2px_2px_0_#050505] flex items-center justify-center font-bold"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id && !item.isAction;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center justify-between px-4 py-3 font-display font-bold text-sm tracking-wide transition-all border-3 cursor-pointer ${
                    isActive
                      ? 'bg-[#050505] text-white border-[#050505] shadow-[4px_4px_0_#B7FF2A] translate-x-1'
                      : 'bg-white text-[#050505] border-[#050505] shadow-[3px_3px_0_#050505] hover:bg-[#B7FF2A]/30 hover:translate-x-0.5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon 
                      className={`w-5 h-5 ${
                        isActive ? 'text-[#B7FF2A]' : item.isAction ? 'text-[#FF4F87]' : 'text-[#050505]'
                      }`} 
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-mono font-black bg-[#FF4F87] text-white border-2 border-[#050505]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Working Account card & Logout */}
        <div className="pt-4 border-t-4 border-[#050505] space-y-3">
          <div 
            onClick={onOpenAccountModal}
            className="bg-[#FFD83D] border-3 border-[#050505] p-3 shadow-[3px_3px_0_#050505] flex items-center gap-3 cursor-pointer hover:bg-[#ffe169] transition-all"
            title="Click to view Account Profile"
          >
            <div className="w-9 h-9 rounded-full bg-[#050505] text-white font-mono font-black text-sm flex items-center justify-center border-2 border-[#050505] shrink-0">
              {currentUser?.initials || 'CU'}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm text-[#050505] truncate">{currentUser?.name || 'Citizen User'}</p>
              <p className="font-mono text-[10px] font-bold text-gray-800 truncate">{currentUser?.ward || 'Bengaluru Urban'}</p>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#050505] border-3 border-[#050505] shadow-[3px_3px_0_#050505] font-bold text-xs uppercase tracking-wider hover:bg-[#FF4F87] hover:text-white transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>
    </>
  );
}
