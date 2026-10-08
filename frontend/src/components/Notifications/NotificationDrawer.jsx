import React from 'react';
import { X, Bell, AlertTriangle, TrendingUp, CheckCircle, Radio } from 'lucide-react';

export default function NotificationDrawer({ 
  isOpen, 
  onClose, 
  notifications = [], 
  onClearNotifications,
  onSelectIncidentById 
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#F8F1E5] border-l-4 border-[#050505] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-[#FFD83D] border-b-4 border-[#050505] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#050505]" />
            <h2 className="font-display font-black text-xl text-[#050505] uppercase tracking-wide">
              NOTIFICATIONS & ALERTS
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 bg-[#FF4F87] text-white border-2 border-[#050505] shadow-[2px_2px_0_#050505] font-bold flex items-center justify-center cursor-pointer hover:bg-[#ff3574]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {notifications.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-[#050505] bg-white">
              <p className="font-bold text-sm text-[#050505]">NO UNREAD ALERTS</p>
              <p className="font-mono text-xs text-gray-500 mt-1">You are all caught up with live civic updates.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (notif.incidentId) {
                    onSelectIncidentById(notif.incidentId);
                    onClose();
                  }
                }}
                className="bg-white border-3 border-[#050505] p-3.5 shadow-[3px_3px_0_#050505] hover:-translate-y-0.5 transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span 
                    className="font-mono font-black text-[10px] uppercase px-2 py-0.5 border border-[#050505]"
                    style={{ backgroundColor: notif.color || '#B7FF2A', color: '#050505' }}
                  >
                    {notif.type}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-gray-500">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="font-sans font-bold text-xs text-[#050505] leading-snug">
                  {notif.message}
                </p>

                {notif.incidentId && (
                  <p className="font-mono text-[10px] font-extrabold text-[#4C5CFF] underline pt-0.5">
                    VIEW INCIDENT #{notif.incidentId} →
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t-4 border-[#050505] bg-white">
            <button
              onClick={onClearNotifications}
              className="w-full py-2 bg-[#050505] text-white font-mono font-bold text-xs uppercase border-2 border-[#050505] shadow-[2px_2px_0_#050505] hover:bg-[#B7FF2A] hover:text-[#050505] cursor-pointer transition-colors"
            >
              CLEAR ALL NOTIFICATIONS
            </button>
          </div>
        )}
      </div>
    </>
  );
}
