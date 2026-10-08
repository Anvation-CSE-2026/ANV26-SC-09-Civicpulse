import React, { useState } from 'react';
import { HeartHandshake, ShieldCheck, ArrowRight, Sparkles, MapPin, Key, Mail, Lock, UserCheck, Flame } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('citizen.bengaluru@civicpulse.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [ward, setWard] = useState('Koramangala 5th Block (Ward 151)');
  const [role, setRole] = useState('CITIZEN');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAuthenticate({
      name: role === 'OFFICER' ? 'BBMP Zonal Officer' : 'Citizen User',
      email: email || 'citizen.bengaluru@civicpulse.gov.in',
      phone: '+91 98765 43210',
      ward: ward,
      initials: role === 'OFFICER' ? 'BO' : 'CU',
      level: role === 'OFFICER' ? 'MUNICIPAL OFFICER (BBMP)' : 'LEVEL 4 CIVIC GUARDIAN',
      joinedDate: 'Member since Oct 2025'
    });
  };

  const handleAuthenticate = (userData) => {
    onLoginSuccess(userData);
  };

  return (
    <div className="min-h-screen bg-[#F8F1E5] text-[#050505] flex flex-col justify-between p-4 md:p-8 font-sans selection:bg-[#B7FF2A]">
      {/* Top Brand Bar */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 border-b-4 border-[#050505]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#B7FF2A] border-3 border-[#050505] shadow-[3px_3px_0_#050505] flex items-center justify-center font-black">
            <HeartHandshake className="w-7 h-7 text-[#050505]" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl md:text-3xl leading-none tracking-tight text-[#050505]">
              CIVICPULSE
            </h1>
            <p className="font-mono font-bold text-xs uppercase tracking-widest text-gray-700 mt-1">
              CITIZEN PORTAL · BENGALURU URBAN
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono font-bold text-xs bg-white border-3 border-[#050505] px-3 py-1.5 shadow-[3px_3px_0_#050505]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00D66B] animate-pulse"></span>
          <span>BENGALURU CIVIC GRID ONLINE</span>
        </div>
      </header>

      {/* Main Login Workspace Grid */}
      <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-stretch">
        {/* Left Side: Hero Info & Feature Badges (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFD83D] border-3 border-[#050505] shadow-[3px_3px_0_#050505] font-mono font-black text-xs uppercase">
              <Sparkles className="w-4 h-4 text-[#050505]" />
              OFFICIAL CITIZEN REPORTING PLATFORM
            </div>

            <h2 className="font-display font-black text-3xl md:text-5xl lg:text-6xl text-[#050505] uppercase leading-[0.95] tracking-tight">
              REPORT ISSUES. <br/>
              TRACK MAP HEATMAP. <br/>
              IMPROVE YOUR CITY.
            </h2>

            <p className="font-sans font-bold text-base md:text-lg text-gray-800 max-w-xl leading-relaxed">
              CivicPulse allows Bengaluru citizens to report potholes, waterlogging, sewage leaks, broken streetlights, and safety hazards with real-time severity scoring.
            </p>
          </div>

          {/* Neo-brutalist Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-white border-3 border-[#050505] p-4 shadow-[4px_4px_0_#050505] space-y-1">
              <div className="w-8 h-8 bg-[#4C5CFF] text-white border-2 border-[#050505] flex items-center justify-center font-bold mb-2">
                📍
              </div>
              <h4 className="font-display font-black text-base uppercase text-[#050505]">
                REAL OPENSTREETMAP
              </h4>
              <p className="font-mono text-xs text-gray-700 font-bold">
                Live OpenStreetMap tiles centered on Bengaluru with zero paid API keys.
              </p>
            </div>

            <div className="bg-white border-3 border-[#050505] p-4 shadow-[4px_4px_0_#050505] space-y-1">
              <div className="w-8 h-8 bg-[#FF4F87] text-white border-2 border-[#050505] flex items-center justify-center font-bold mb-2">
                🔥
              </div>
              <h4 className="font-display font-black text-base uppercase text-[#050505]">
                SEVERITY HEATMAP
              </h4>
              <p className="font-mono text-xs text-gray-700 font-bold">
                Dynamic 0-100 severity heat points (Normal, Medium, High, Critical).
              </p>
            </div>

            <div className="bg-white border-3 border-[#050505] p-4 shadow-[4px_4px_0_#050505] space-y-1">
              <div className="w-8 h-8 bg-[#B7FF2A] text-[#050505] border-2 border-[#050505] flex items-center justify-center font-bold mb-2">
                🤖
              </div>
              <h4 className="font-display font-black text-base uppercase text-[#050505]">
                SIMULATED AI ANALYSIS
              </h4>
              <p className="font-mono text-xs text-gray-700 font-bold">
                Upload image evidence to automatically generate object & confidence weights.
              </p>
            </div>

            <div className="bg-white border-3 border-[#050505] p-4 shadow-[4px_4px_0_#050505] space-y-1">
              <div className="w-8 h-8 bg-[#FFD83D] text-[#050505] border-2 border-[#050505] flex items-center justify-center font-bold mb-2">
                🏆
              </div>
              <h4 className="font-display font-black text-base uppercase text-[#050505]">
                CIVIC REPUTATION
              </h4>
              <p className="font-mono text-xs text-gray-700 font-bold">
                Earn +25 civic points per verified report & level up your citizen guardian badge.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form & Demo Accounts (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="neo-box p-6 md:p-8 bg-white space-y-6">
            {/* Header */}
            <div className="pb-4 border-b-4 border-[#050505]">
              <h3 className="font-display font-black text-2xl text-[#050505] uppercase tracking-wide">
                CITIZEN SIGN IN
              </h3>
              <p className="font-mono font-bold text-xs text-gray-600 mt-1">
                Enter your credentials or click a Quick Demo Login to access the dashboard.
              </p>
            </div>

            {/* Quick Demo One-Click Login Buttons */}
            <div className="space-y-2">
              <span className="font-mono font-black text-[11px] uppercase text-[#050505] block">
                ⚡ QUICK DEMO ONE-CLICK LOGIN:
              </span>

              <button
                type="button"
                onClick={() => handleAuthenticate({
                  name: 'Citizen User',
                  email: 'citizen.bengaluru@civicpulse.gov.in',
                  phone: '+91 98765 43210',
                  ward: 'Koramangala 5th Block (Ward 151)',
                  initials: 'CU',
                  level: 'LEVEL 4 CIVIC GUARDIAN',
                  joinedDate: 'Member since Oct 2025'
                })}
                className="w-full py-2.5 px-3 bg-[#B7FF2A] text-[#050505] border-3 border-[#050505] shadow-[3px_3px_0_#050505] font-display font-black text-xs uppercase hover:bg-[#a5f013] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-between"
              >
                <span>🟢 LOGIN AS CITIZEN (Koramangala)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleAuthenticate({
                  name: 'BBMP Zonal Officer',
                  email: 'officer.bbmp@civicpulse.gov.in',
                  phone: '+91 98111 22334',
                  ward: 'BBMP South Control Room',
                  initials: 'BO',
                  level: 'MUNICIPAL OFFICER (BBMP)',
                  joinedDate: 'BBMP Official'
                })}
                className="w-full py-2.5 px-3 bg-[#4C5CFF] text-white border-3 border-[#050505] shadow-[3px_3px_0_#050505] font-display font-black text-xs uppercase hover:bg-[#3848e8] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-between"
              >
                <span>🔵 LOGIN AS MUNICIPAL OFFICER (BBMP)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t-2 border-[#050505]"></div>
              <span className="flex-shrink mx-3 font-mono font-black text-xs text-gray-500 uppercase">OR WITH EMAIL</span>
              <div className="flex-grow border-t-2 border-[#050505]"></div>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono font-black text-xs uppercase text-[#050505] mb-1">
                  EMAIL / CITIZEN ID *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F8F1E5] border-3 border-[#050505] pl-9 pr-3 py-2.5 font-sans font-bold text-sm text-[#050505] focus:outline-none focus:ring-2 focus:ring-[#B7FF2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono font-black text-xs uppercase text-[#050505] mb-1">
                  PASSWORD *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#F8F1E5] border-3 border-[#050505] pl-9 pr-3 py-2.5 font-sans font-bold text-sm text-[#050505] focus:outline-none focus:ring-2 focus:ring-[#B7FF2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono font-black text-xs uppercase text-[#050505] mb-1">
                  SELECT RESIDENTIAL WARD / AREA
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-[#F8F1E5] border-3 border-[#050505] px-3 py-2.5 font-mono font-bold text-xs text-[#050505] focus:outline-none"
                >
                  <option value="Koramangala 5th Block (Ward 151)">Koramangala 5th Block (Ward 151)</option>
                  <option value="Indiranagar 100ft Road (Ward 112)">Indiranagar 100ft Road (Ward 112)</option>
                  <option value="HSR Layout Sector 1 (Ward 174)">HSR Layout Sector 1 (Ward 174)</option>
                  <option value="BTM Layout 2nd Stage (Ward 176)">BTM Layout 2nd Stage (Ward 176)</option>
                  <option value="Whitefield Main Road (Ward 84)">Whitefield Main Road (Ward 84)</option>
                  <option value="Yelahanka New Town (Ward 4)">Yelahanka New Town (Ward 4)</option>
                </select>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#FF4F87] text-white border-3 border-[#050505] shadow-[5px_5px_0_#050505] font-display font-black text-base uppercase tracking-wider hover:bg-[#ff3574] hover:shadow-[7px_7px_0_#050505] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_#050505] transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                <UserCheck className="w-5 h-5" />
                <span>SIGN IN & OPEN DASHBOARD →</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full pt-6 border-t-4 border-[#050505] flex flex-wrap items-center justify-between text-xs font-mono font-bold text-gray-700">
        <div>© 2026 CIVICPULSE — BENGALURU CITIZEN PORTAL</div>
        <div className="flex items-center gap-4">
          <span>BBMP COMPLIANT</span>
          <span>•</span>
          <span>OPENSTREETMAP TILES</span>
          <span>•</span>
          <span>PRIVACY FIRST</span>
        </div>
      </footer>
    </div>
  );
}
