import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Map, 
  Bell, 
  Users, 
  Wrench, 
  Shield, 
  FileText, 
  BarChart3, 
  Cpu, 
  Settings, 
  LogOut, 
  HeartHandshake,
  X
} from 'lucide-react';

export default function AdminSidebar({ mobileOpen, setMobileOpen, unreadCount }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navSections = [
    {
      title: 'MAIN',
      items: [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
        { path: '/admin/incidents', label: 'Incidents', icon: AlertTriangle },
        { path: '/admin/map', label: 'Live Map', icon: Map },
        { path: '/admin/alerts', label: 'Alerts', icon: Bell, badge: unreadCount }
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        { path: '/admin/citizens', label: 'Citizens', icon: Users },
        { path: '/admin/resources', label: 'Resources', icon: Wrench },
        { path: '/admin/teams', label: 'Teams', icon: Shield },
        { path: '/admin/reports', label: 'Reports', icon: FileText }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/admin/ai-engine', label: 'AI Engine', icon: Cpu },
        { path: '/admin/settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#F8F1E5] border-r-4 border-[#050505] flex flex-col justify-between p-3.5 transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto pr-1">
          {/* Top Logo */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b-4 border-[#050505]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-[#FF4F87] text-white border-3 border-[#050505] shadow-[3px_3px_0_#050505] flex items-center justify-center font-black shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-display font-black text-xl leading-none text-[#050505]">
                  CIVICPULSE
                </h1>
                <p className="font-mono font-black text-[10px] text-[#4C5CFF] uppercase tracking-wider mt-0.5">
                  COMMAND CENTER
                </p>
              </div>
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden w-8 h-8 bg-[#FF4F87] text-white border-2 border-[#050505] shadow-[2px_2px_0_#050505] flex items-center justify-center font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Sections */}
          <div className="space-y-4">
            {navSections.map((sec) => (
              <div key={sec.title}>
                <p className="font-mono font-black text-[10px] text-gray-600 uppercase tracking-widest px-2 mb-1.5">
                  {sec.title}
                </p>
                <div className="space-y-1.5">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exact}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3 py-2 font-display font-bold text-xs uppercase transition-all border-2 border-[#050505] ${
                            isActive
                              ? 'bg-[#050505] text-[#B7FF2A] shadow-[3px_3px_0_#B7FF2A] translate-x-0.5'
                              : 'bg-white text-[#050505] shadow-[2px_2px_0_#050505] hover:bg-[#B7FF2A]/20'
                          }`
                        }
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge > 0 && (
                          <span className="font-mono font-black text-[10px] bg-[#FF4F87] text-white px-1.5 py-0.5 border border-[#050505]">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom User Card & Logout */}
        <div className="pt-3 border-t-4 border-[#050505] space-y-2">
          <div className="bg-[#FFD83D] border-2 border-[#050505] p-2.5 shadow-[2px_2px_0_#050505] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#050505] text-white font-mono font-black text-xs flex items-center justify-center border border-[#050505] shrink-0">
              {currentUser?.initials || 'AD'}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-xs text-[#050505] truncate">{currentUser?.name || 'Admin User'}</p>
              <p className="font-mono text-[9px] font-extrabold text-gray-800 truncate">{currentUser?.role || 'MUNICIPAL_WORKER'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-[#050505] border-2 border-[#050505] shadow-[2px_2px_0_#050505] font-bold text-xs uppercase hover:bg-[#FF4F87] hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>
    </>
  );
}
