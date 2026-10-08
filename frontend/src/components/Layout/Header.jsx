import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

export default function Header({ 
  onToggleMobileSidebar, 
  onToggleNotifications, 
  unreadCount,
  isSimulating,
  onOpenAccountModal,
  currentUser
}) {
  return (
    <header className="sticky top-0 z-30 bg-[#F8F1E5] border-b-4 border-[#050505] px-4 md:px-8 py-4 flex items-center justify-between shadow-sm">
      {/* Left Title & Mobile Menu Toggle */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onToggleMobileSidebar}
          aria-label="Toggle Menu"
          className="md:hidden w-10 h-10 bg-[#B7FF2A] border-3 border-[#050505] shadow-[3px_3px_0_#050505] flex items-center justify-center cursor-pointer active:translate-y-0.5"
        >
          <Menu className="w-6 h-6 text-[#050505]" />
        </button>

        <div>
          <h2 className="font-display font-black text-xl md:text-2xl text-[#050505] leading-tight tracking-tight uppercase">
            CITIZEN DASHBOARD
          </h2>
          <p className="font-mono font-bold text-xs text-gray-700 tracking-wider uppercase">
            YOUR CIVIC REPORTS · BENGALURU
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* LIVE indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border-3 border-[#050505] shadow-[3px_3px_0_#050505]">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isSimulating ? 'bg-[#FF4F87]' : 'bg-[#00D66B]'
            }`} />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${
              isSimulating ? 'bg-[#FF4F87]' : 'bg-[#00D66B]'
            }`} />
          </span>
          <span className="font-mono font-black text-xs uppercase tracking-wider text-[#050505]">
            LIVE {isSimulating && '• SIM'}
          </span>
        </div>

        {/* Notifications Button */}
        <button
          onClick={onToggleNotifications}
          className="relative w-10 h-10 bg-[#FFD83D] border-3 border-[#050505] shadow-[3px_3px_0_#050505] flex items-center justify-center cursor-pointer hover:bg-[#FFD83D]/80 transition-all active:translate-y-0.5"
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-[#050505]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#FF4F87] text-white font-mono font-black text-[10px] w-5 h-5 border-2 border-[#050505] rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Working Avatar / Account Button */}
        <button
          onClick={onOpenAccountModal}
          className="w-10 h-10 bg-[#4C5CFF] text-white border-3 border-[#050505] shadow-[3px_3px_0_#050505] font-mono font-black text-sm flex items-center justify-center select-none cursor-pointer hover:bg-[#3949e6] hover:-translate-y-0.5 transition-all active:translate-y-0.5"
          title="Open Citizen Account Profile"
        >
          {currentUser?.initials || 'CU'}
        </button>
      </div>
    </header>
  );
}
