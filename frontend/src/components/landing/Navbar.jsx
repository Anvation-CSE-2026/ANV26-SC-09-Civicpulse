import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeartHandshake, Menu, X, ArrowRight, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDashboardClick = () => {
    if (role === 'MUNICIPAL_WORKER') {
      navigate('/admin');
    } else {
      navigate('/citizen');
    }
  };

  const navLinks = [
    { label: 'HOME', href: '#home' },
    { label: 'HOW IT WORKS', href: '#how-it-works' },
    { label: 'FEATURES', href: '#features' },
    { label: 'FOR MUNICIPALITIES', href: '#municipalities' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#F8F1E5] border-b-4 border-[#050505] px-4 md:px-8 py-3.5 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-[#B7FF2A] border-3 border-[#050505] shadow-[3px_3px_0_#050505] flex items-center justify-center font-black group-hover:bg-[#FFD83D] transition-colors shrink-0">
            <HeartHandshake className="w-6 h-6 text-[#050505]" />
          </div>
          <div>
            <h1 className="font-display font-black text-xl md:text-2xl leading-none text-[#050505]">
              CIVICPULSE
            </h1>
            <p className="font-mono font-bold text-[10px] text-gray-700 uppercase tracking-widest mt-0.5">
              SMART CIVIC INCIDENT RESPONSE
            </p>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 font-display font-bold text-xs uppercase tracking-wider">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#050505] hover:text-[#4C5CFF] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 font-display font-black text-xs uppercase text-[#050505] hover:text-[#4C5CFF]"
              >
                LOGIN
              </Link>
              <Link
                to="/login"
                className="px-5 py-2.5 bg-[#B7FF2A] text-[#050505] border-3 border-[#050505] shadow-[3px_3px_0_#050505] font-display font-black text-xs uppercase hover:bg-[#a3f015] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={handleDashboardClick}
                className="px-5 py-2.5 bg-[#B7FF2A] text-[#050505] border-3 border-[#050505] shadow-[3px_3px_0_#050505] font-display font-black text-xs uppercase hover:bg-[#a3f015] flex items-center gap-1.5 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>GO TO DASHBOARD</span>
              </button>
              <button
                onClick={logout}
                className="px-3 py-2 bg-white text-[#050505] border-2 border-[#050505] font-mono font-bold text-xs uppercase hover:bg-[#FF4F87] hover:text-white cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden w-10 h-10 bg-[#FFD83D] border-3 border-[#050505] shadow-[2px_2px_0_#050505] flex items-center justify-center font-bold"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t-3 border-[#050505] space-y-3 font-display font-bold text-sm">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-1 text-[#050505] uppercase hover:bg-[#FFD83D]"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-2 border-t-2 border-[#050505] flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="w-full py-2.5 text-center bg-white border-2 border-[#050505] font-black uppercase text-xs shadow-[2px_2px_0_#050505]"
                >
                  LOGIN
                </Link>
                <Link
                  to="/login"
                  className="w-full py-2.5 text-center bg-[#B7FF2A] border-3 border-[#050505] font-black uppercase text-xs shadow-[3px_3px_0_#050505]"
                >
                  GET STARTED
                </Link>
              </>
            ) : (
              <button
                onClick={handleDashboardClick}
                className="w-full py-2.5 text-center bg-[#B7FF2A] border-3 border-[#050505] font-black uppercase text-xs shadow-[3px_3px_0_#050505]"
              >
                GO TO DASHBOARD →
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
