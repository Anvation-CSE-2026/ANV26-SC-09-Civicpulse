import React, { useState } from 'react';
import { X, User, ShieldCheck, Award, MapPin, Mail, Phone, Bell, LogOut, CheckCircle2, FileText, Settings } from 'lucide-react';

export default function AccountModal({ 
  isOpen, 
  onClose, 
  user, 
  stats, 
  onLogout 
}) {
  if (!isOpen) return null;

  const [smsNotif, setSmsNotif] = useState(true);
  const [anonMode, setAnonMode] = useState(false);

  const currentUser = user || {
    name: 'Citizen User',
    email: 'citizen.bengaluru@civicpulse.gov.in',
    phone: '+91 98765 43210',
    ward: 'Koramangala 5th Block (Ward 151)',
    initials: 'CU',
    level: 'LEVEL 4 CIVIC GUARDIAN',
    joinedDate: 'Joined Oct 2025'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="neo-box w-full max-w-xl bg-[#F8F1E5] my-8 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#4C5CFF] text-white p-4 border-b-4 border-[#050505] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-6 h-6" />
            <h2 className="font-display font-black text-xl uppercase tracking-wide">
              CITIZEN ACCOUNT PROFILE
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 bg-[#FF4F87] text-white border-2 border-white font-bold flex items-center justify-center cursor-pointer hover:bg-[#ff3574]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* User Hero Identity */}
          <div className="bg-white border-3 border-[#050505] p-5 shadow-[4px_4px_0_#050505] flex flex-col sm:flex-row items-center gap-4">
            <div className="w-16 h-16 bg-[#FFD83D] text-[#050505] border-3 border-[#050505] shadow-[3px_3px_0_#050505] font-mono font-black text-2xl flex items-center justify-center shrink-0">
              {currentUser.initials}
            </div>

            <div className="text-center sm:text-left overflow-hidden w-full">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="font-display font-black text-2xl text-[#050505] uppercase leading-tight">
                  {currentUser.name}
                </h3>
                <span className="font-mono text-[10px] font-black bg-[#00D66B] text-[#050505] px-2 py-0.5 border border-[#050505] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED
                </span>
              </div>

              <p className="font-mono text-xs font-bold text-[#4C5CFF] mt-1">
                {currentUser.level}
              </p>
              <p className="font-sans font-bold text-xs text-gray-600 mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF4F87]" />
                <span>{currentUser.ward}</span>
              </p>
            </div>
          </div>

          {/* Civic Stats & Points Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#B7FF2A] border-3 border-[#050505] p-3 shadow-[3px_3px_0_#050505] text-center">
              <span className="font-display font-black text-2xl text-[#050505] block">
                {stats?.civicPoints || 240}
              </span>
              <span className="font-mono font-black text-[10px] uppercase text-[#050505]">
                CIVIC POINTS
              </span>
            </div>

            <div className="bg-white border-3 border-[#050505] p-3 shadow-[3px_3px_0_#050505] text-center">
              <span className="font-display font-black text-2xl text-[#050505] block">
                {stats?.totalReports || 8}
              </span>
              <span className="font-mono font-black text-[10px] uppercase text-[#050505]">
                REPORTS
              </span>
            </div>

            <div className="bg-[#FFD83D] border-3 border-[#050505] p-3 shadow-[3px_3px_0_#050505] text-center">
              <span className="font-display font-black text-2xl text-[#050505] block">
                {stats?.resolvedReports || 5}
              </span>
              <span className="font-mono font-black text-[10px] uppercase text-[#050505]">
                RESOLVED
              </span>
            </div>
          </div>

          {/* Account Information Details */}
          <div className="bg-white border-3 border-[#050505] p-4 shadow-[3px_3px_0_#050505] space-y-2 font-mono text-xs">
            <h4 className="font-display font-black text-sm text-[#050505] uppercase border-b-2 border-[#050505] pb-1.5 mb-2">
              CONTACT DETAILS
            </h4>

            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#050505]" /> EMAIL:
              </span>
              <span className="font-bold text-[#050505]">{currentUser.email}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-gray-200">
              <span className="text-gray-600 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#050505]" /> PHONE:
              </span>
              <span className="font-bold text-[#050505]">{currentUser.phone}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-gray-600 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#050505]" /> MEMBER SINCE:
              </span>
              <span className="font-bold text-[#050505]">{currentUser.joinedDate}</span>
            </div>
          </div>

          {/* Citizen Preferences */}
          <div className="bg-white border-3 border-[#050505] p-4 shadow-[3px_3px_0_#050505] space-y-3 font-mono text-xs">
            <h4 className="font-display font-black text-sm text-[#050505] uppercase border-b-2 border-[#050505] pb-1.5 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-[#4C5CFF]" />
              CITIZEN PREFERENCES
            </h4>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[#050505]">SMS & WhatsApp Alerts</p>
                <p className="text-[10px] text-gray-500">Receive live status updates on your reports</p>
              </div>
              <button
                onClick={() => setSmsNotif(!smsNotif)}
                className={`w-12 h-6 border-2 border-[#050505] font-black text-[10px] flex items-center p-0.5 transition-all cursor-pointer ${
                  smsNotif ? 'bg-[#00D66B] justify-end text-black' : 'bg-gray-300 justify-start text-gray-600'
                }`}
              >
                <span className="w-4 h-4 bg-white border border-[#050505] flex items-center justify-center">
                  {smsNotif ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div>
                <p className="font-bold text-[#050505]">Anonymous Reporting Mode</p>
                <p className="text-[10px] text-gray-500">Hide your citizen name on public map pins</p>
              </div>
              <button
                onClick={() => setAnonMode(!anonMode)}
                className={`w-12 h-6 border-2 border-[#050505] font-black text-[10px] flex items-center p-0.5 transition-all cursor-pointer ${
                  anonMode ? 'bg-[#FF4F87] justify-end text-white' : 'bg-gray-300 justify-start text-gray-600'
                }`}
              >
                <span className="w-4 h-4 bg-white border border-[#050505] flex items-center justify-center">
                  {anonMode ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full py-3 bg-[#FF4F87] text-white border-3 border-[#050505] shadow-[4px_4px_0_#050505] font-display font-black text-sm uppercase hover:bg-[#ff3574] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span>LOG OUT & CLOSE DASHBOARD</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
