import React from 'react';
import { Settings, Save, Shield, MapPin, Key } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="neo-box p-5 bg-[#FFD83D] text-[#050505] flex justify-between items-center">
        <div>
          <h1 className="font-display font-black text-2xl uppercase">COMMAND CENTER SETTINGS</h1>
          <p className="font-mono text-xs font-bold text-[#050505] mt-1">Configure Spring Boot API base URLs, dispatch thresholds, & ward boundaries.</p>
        </div>
        <button
          onClick={() => alert("Settings saved successfully!")}
          className="px-4 py-2 bg-black text-white font-mono text-xs font-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0_#050505]"
        >
          <Save className="w-4 h-4" /> SAVE SETTINGS
        </button>
      </div>

      <div className="neo-box p-5 bg-white space-y-4 font-mono text-xs">
        <h3 className="font-display font-black text-lg text-[#050505] uppercase border-b-2 border-black pb-2">
          API & BACKEND INTEGRATION
        </h3>

        <div>
          <label className="block font-black uppercase mb-1">SPRING BOOT API BASE URL (VITE_API_BASE_URL)</label>
          <input
            type="text"
            defaultValue="http://localhost:8080/api"
            className="w-full bg-[#F8F1E5] border-2 border-black p-2.5 font-bold"
          />
        </div>

        <div>
          <label className="block font-black uppercase mb-1">OPENSTREETMAP TILE SERVER URL</label>
          <input
            type="text"
            defaultValue="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="w-full bg-[#F8F1E5] border-2 border-black p-2.5 font-bold"
          />
        </div>

        <div>
          <label className="block font-black uppercase mb-1">CRITICAL ESCALATION THRESHOLD SCORE</label>
          <input
            type="number"
            defaultValue={80}
            className="w-32 bg-[#F8F1E5] border-2 border-black p-2.5 font-bold"
          />
        </div>
      </div>
    </div>
  );
}
