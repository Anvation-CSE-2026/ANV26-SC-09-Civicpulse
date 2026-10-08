import React from 'react';
import { Search, Bell, Radio, Menu, ShieldAlert, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminHeader({ 
  onToggleMobileSidebar, 
  onToggleNotifications, 
  unreadCount,
  searchTerm,
  setSearchTerm,
  onOpenAccountModal
}) {
  const { currentUser, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#F8F1E5] border-b-4 border-[#050505] px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm">
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
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#FF4F87] text-white font-mono font-black text-[10px] border border-[#050505] uppercase">
              MUNICIPAL CONTROL
            </span>
            <span className="font-mono text-xs text-gray-700 font-bold hidden sm:inline">
              BENGALURU URBAN
            </span>
          </div>
          <h2 className="font-display font-black text-xl md:text-2xl text-[#050505] leading-tight tracking-tight uppercase">
            COMMAND CENTER
          </h2>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden lg:flex items-center relative w-72">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search incidents, sectors, IDs..."
          className="w-full bg-white border-3 border-[#050505] pl-9 pr-3 py-1.5 font-sans font-bold text-xs text-[#050505] shadow-[2px_2px_0_#050505] focus:outline-none focus:ring-2 focus:ring-[#B7FF2A]"
        />
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-3">
        {/* LIVE Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1 bg-white border-3 border-[#050505] shadow-[2px_2px_0_#050505]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4F87] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF4F87]" />
          </span>
          <span className="font-mono font-black text-xs text-[#050505]">
            LIVE • GRID
          </span>
        </div>

        {/* Notifications Icon */}
        <button
          onClick={onToggleNotifications}
          className="relative w-9 h-9 bg-[#FFD83D] border-3 border-[#050505] shadow-[2px_2px_0_#050505] flex items-center justify-center cursor-pointer hover:bg-[#FFD83D]/80 transition-all"
          title="Admin Alerts & Notifications"
        >
          <Bell className="w-4 h-4 text-[#050505]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#FF4F87] text-white font-mono font-black text-[10px] w-4.5 h-4.5 border border-[#050505] rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Admin Avatar AD button */}
        <button
          onClick={onOpenAccountModal}
          className="w-9 h-9 bg-[#4C5CFF] text-white border-3 border-[#050505] shadow-[2px_2px_0_#050505] font-mono font-black text-xs flex items-center justify-center cursor-pointer hover:bg-[#3949e6]"
          title="Admin Profile"
        >
          {currentUser?.initials || 'AD'}
        </button>
      </div>
    </header>
  );
}
