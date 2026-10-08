import React from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="neo-box p-5 bg-[#FF4F87] text-white flex justify-between items-center">
        <div>
          <h1 className="font-display font-black text-2xl uppercase">CITY CIVIC ANALYTICS & SLA PERFORMANCE</h1>
          <p className="font-mono text-xs font-bold text-gray-100 mt-1">Resolution time trends, category breakdown, & ward response matrix.</p>
        </div>
        <span className="font-mono font-black text-xs bg-[#B7FF2A] text-black px-3 py-1 border border-black">
          OCTOBER 2026 METRICS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="neo-box p-5 bg-white space-y-2">
          <h3 className="font-mono font-black text-xs text-gray-500 uppercase">AVG RESOLUTION TIME</h3>
          <p className="font-display font-black text-4xl text-[#050505]">2.4 HRS</p>
          <span className="font-mono text-xs font-bold text-[#00D66B] bg-black px-1.5 py-0.5">↓ 18% FASTER</span>
        </div>

        <div className="neo-box p-5 bg-white space-y-2">
          <h3 className="font-mono font-black text-xs text-gray-500 uppercase">AI CONFIDENCE ACCURACY</h3>
          <p className="font-display font-black text-4xl text-[#4C5CFF]">94.2%</p>
          <span className="font-mono text-xs font-bold text-[#B7FF2A] bg-black px-1.5 py-0.5">HIGH PRECISION</span>
        </div>

        <div className="neo-box p-5 bg-white space-y-2">
          <h3 className="font-mono font-black text-xs text-gray-500 uppercase">CITIZEN SATISFACTION</h3>
          <p className="font-display font-black text-4xl text-[#FFD83D]">4.8 / 5</p>
          <span className="font-mono text-xs font-bold text-[#00D66B] bg-black px-1.5 py-0.5">★ EXCELLENT</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="neo-box p-5 bg-white space-y-3">
          <h3 className="font-display font-black text-lg uppercase border-b-2 border-black pb-2">TOP INCIDENT CATEGORIES</h3>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span>WATERLOGGING & DRAINS</span>
              <span className="font-black text-[#4C5CFF]">38%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span>POTHOLES & ROAD DAMAGE</span>
              <span className="font-black text-[#FF4F87]">29%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span>POWER & STREETLIGHTS</span>
              <span className="font-black text-[#FFD83D]">18%</span>
            </div>
            <div className="flex justify-between py-1">
              <span>GARBAGE & SEWAGE SPILLS</span>
              <span className="font-black text-[#00D66B]">15%</span>
            </div>
          </div>
        </div>

        <div className="neo-box p-5 bg-white space-y-3">
          <h3 className="font-display font-black text-lg uppercase border-b-2 border-black pb-2">WARD RESPONSE SPEED</h3>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span>KORAMANGALA (WARD 151)</span>
              <span className="font-black text-[#00D66B]">1.2 hrs avg</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span>INDIRANAGAR (WARD 112)</span>
              <span className="font-black text-[#00D66B]">1.8 hrs avg</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span>HSR LAYOUT (WARD 174)</span>
              <span className="font-black text-[#FFD83D]">2.1 hrs avg</span>
            </div>
            <div className="flex justify-between py-1">
              <span>WHITEFIELD (WARD 84)</span>
              <span className="font-black text-[#FF4F87]">3.5 hrs avg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
