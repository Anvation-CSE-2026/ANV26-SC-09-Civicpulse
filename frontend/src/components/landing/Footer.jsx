import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] text-white pt-12 pb-8 px-4 md:px-8 border-t-4 border-[#050505]">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b-2 border-gray-800">
          {/* Col 1 Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#B7FF2A] border-2 border-white flex items-center justify-center font-black">
                <HeartHandshake className="w-6 h-6 text-[#050505]" />
              </div>
              <div>
                <h2 className="font-display font-black text-2xl uppercase text-white">CIVICPULSE</h2>
                <p className="font-mono font-bold text-xs text-[#B7FF2A] uppercase">SMART CIVIC INCIDENT RESPONSE</p>
              </div>
            </div>
            <p className="font-sans font-bold text-xs text-gray-400 max-w-md">
              CivicPulse connects citizens and municipal teams through intelligent incident correlation, AI evidence analysis, live severity scoring and resource-aware prioritization.
            </p>
          </div>

          {/* Col 2 Quick Links */}
          <div className="space-y-2 font-mono text-xs">
            <h4 className="font-black text-[#FFD83D] uppercase">NAVIGATION</h4>
            <ul className="space-y-1 text-gray-300 font-bold">
              <li><a href="#home" className="hover:text-[#B7FF2A]">HOME</a></li>
              <li><a href="#how-it-works" className="hover:text-[#B7FF2A]">HOW IT WORKS</a></li>
              <li><a href="#features" className="hover:text-[#B7FF2A]">FEATURES</a></li>
              <li><a href="#municipalities" className="hover:text-[#B7FF2A]">FOR MUNICIPALITIES</a></li>
            </ul>
          </div>

          {/* Col 3 Portals & Auth */}
          <div className="space-y-2 font-mono text-xs">
            <h4 className="font-black text-[#FF4F87] uppercase">PORTALS</h4>
            <ul className="space-y-1 text-gray-300 font-bold">
              <li><Link to="/login" className="hover:text-[#B7FF2A]">LOGIN</Link></li>
              <li><Link to="/signup" className="hover:text-[#B7FF2A]">SIGNUP</Link></li>
              <li><Link to="/citizen" className="hover:text-[#B7FF2A]">FOR CITIZENS</Link></li>
              <li><Link to="/admin" className="hover:text-[#B7FF2A]">FOR MUNICIPAL TEAMS</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs font-mono font-bold text-gray-400 gap-2">
          <div>Built for smarter, faster civic response.</div>
          <div className="text-[#B7FF2A] font-black">BENGALURU, INDIA</div>
        </div>
      </div>
    </footer>
  );
}
