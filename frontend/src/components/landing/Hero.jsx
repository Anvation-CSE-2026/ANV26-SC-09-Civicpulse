import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ArrowRight, ShieldAlert, AlertTriangle, Layers, Flame, MapPin } from 'lucide-react';
import { LANDING_INCIDENTS } from '../../data/landingIncidents';
import { getSeverityInfo } from '../../utils/severity';

export default function Hero() {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const handleAction = (targetPath) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(targetPath);
    }
  };

  return (
    <section id="home" className="py-12 md:py-16 px-4 md:px-8 border-b-4 border-[#050505]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Text Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FFD83D] border-3 border-[#050505] shadow-[3px_3px_0_#050505] font-mono font-black text-xs uppercase">
            <Sparkles className="w-4 h-4 text-[#050505]" />
            BENGALURU · REAL-TIME CIVIC INCIDENT RESPONSE
          </div>

          <div>
            <span className="font-display font-black text-2xl md:text-3xl text-[#4C5CFF] block mb-1">
              CIVICPULSE
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#050505] uppercase leading-[0.95] tracking-tight">
              SMARTER CITIES. <br/>
              <span className="bg-[#B7FF2A] px-2 py-0.5 border-3 border-[#050505] shadow-[4px_4px_0_#050505] inline-block mt-1">
                FASTER RESPONSE.
              </span>
            </h1>
          </div>

          <p className="font-display font-black text-lg md:text-xl text-[#050505] italic">
            "Turn citizen reports into real-time, evidence-backed incidents."
          </p>

          <p className="font-sans font-bold text-sm md:text-base text-gray-800 leading-relaxed max-w-2xl">
            CivicPulse connects citizens and municipal teams through intelligent incident correlation, AI-powered evidence analysis, live severity scoring and resource-aware response prioritization.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => handleAction(role === 'MUNICIPAL_WORKER' ? '/admin' : '/citizen')}
              className="px-6 py-3.5 bg-[#FF4F87] text-white border-3 border-[#050505] shadow-[5px_5px_0_#050505] font-display font-black text-sm uppercase tracking-wider hover:bg-[#ff3574] hover:shadow-[7px_7px_0_#050505] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_#050505] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>REPORT AN ISSUE</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleAction(role === 'CITIZEN' ? '/citizen' : '/admin')}
              className="px-6 py-3.5 bg-[#4C5CFF] text-white border-3 border-[#050505] shadow-[5px_5px_0_#050505] font-display font-black text-sm uppercase tracking-wider hover:bg-[#3848e8] hover:shadow-[7px_7px_0_#050505] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_#050505] transition-all cursor-pointer flex items-center gap-2"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>COMMAND CENTER</span>
            </button>
          </div>
        </div>

        {/* Right Hero Visual Column (5 cols - Mini Command Center Preview) */}
        <div className="lg:col-span-5">
          <div className="neo-box p-4 md:p-5 bg-white space-y-4">
            {/* Visual Top Header */}
            <div className="flex items-center justify-between pb-2 border-b-3 border-[#050505]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF4F87] animate-ping"></span>
                <span className="font-mono font-black text-xs uppercase text-[#050505]">
                  MINI COMMAND CENTER PREVIEW
                </span>
              </div>
              <span className="font-mono text-[10px] font-black bg-[#B7FF2A] border border-[#050505] px-2 py-0.5">
                BENGALURU GRID
              </span>
            </div>

            {/* Simulated Live Incident Cards */}
            <div className="space-y-3">
              {LANDING_INCIDENTS.map((inc) => {
                const sev = getSeverityInfo(inc.severity);
                return (
                  <div
                    key={inc.id}
                    className="p-3 bg-[#F8F1E5] border-3 border-[#050505] shadow-[3px_3px_0_#050505] flex items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-[10px] font-black px-1.5 py-0.5 border border-[#050505] ${sev.badgeBg} ${sev.badgeText}`}>
                          ● {sev.level}
                        </span>
                        <span className="font-mono font-black text-xs text-[#050505]">
                          #{inc.id}
                        </span>
                      </div>
                      <h4 className="font-display font-black text-xs uppercase text-[#050505]">
                        {inc.title}
                      </h4>
                      <p className="font-mono text-[10px] text-gray-600 font-bold">
                        📍 {inc.areaName}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-display font-black text-xl text-[#050505] block leading-none">
                        {inc.severity}
                      </span>
                      <span className="font-mono text-[9px] font-bold text-gray-500">
                        SEVERITY
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Severity Legend Footer */}
            <div className="pt-2 border-t-2 border-[#050505] flex items-center justify-between font-mono text-[10px] font-black">
              <span className="text-[#00D66B]">🟢 NORMAL (0-30)</span>
              <span className="text-[#FFD83D]">🟡 MEDIUM (31-60)</span>
              <span className="text-[#FF9F1C]">🟠 HIGH (61-80)</span>
              <span className="text-[#FF4F87]">🔴 CRITICAL (81-100)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
