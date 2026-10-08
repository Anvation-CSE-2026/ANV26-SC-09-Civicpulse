import React from 'react';
import { Shield, Phone, MapPin, CheckCircle, Users } from 'lucide-react';

export default function AdminTeamsPage() {
  const teams = [
    { id: 'T-101', name: 'BBMP Stormwater Rapid Unit A', leader: 'Inspector Rajesh Kumar', area: 'Koramangala Zone', status: 'ON FIELD', members: 6, contact: '+91 98450 11223' },
    { id: 'T-102', name: 'BESCOM High Tension Line Squad 2', leader: 'Engineer Suresh V', area: 'Indiranagar Substation', status: 'ON FIELD', members: 4, contact: '+91 98450 33445' },
    { id: 'T-103', name: 'BWSSB Suction Tanker Crew B', leader: 'Supervisor Mohan Das', area: 'Majestic / Central', status: 'DEPLOYED', members: 5, contact: '+91 98450 55667' },
    { id: 'T-104', name: 'BBMP Asphalt Patching Gang 4', leader: 'Foreman Anand Swamy', area: 'Whitefield & ORR', status: 'STANDBY', members: 8, contact: '+91 98450 77889' }
  ];

  return (
    <div className="space-y-6">
      <div className="neo-box p-5 bg-[#4C5CFF] text-white flex justify-between items-center">
        <div>
          <h1 className="font-display font-black text-2xl uppercase">FIELD DEPLOYMENT TEAMS</h1>
          <p className="font-mono text-xs text-gray-200 mt-1">Zonal municipal crews & emergency response dispatch units.</p>
        </div>
        <span className="font-mono font-black text-xs bg-[#B7FF2A] text-black px-3 py-1 border border-black">
          {teams.length} TEAMS ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {teams.map((t) => (
          <div key={t.id} className="neo-box p-5 space-y-3 bg-white">
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <span className="font-mono font-black text-xs text-[#4C5CFF]">#{t.id}</span>
              <span className="font-mono font-black text-xs bg-[#00D66B] px-2 py-0.5 border border-black text-black">
                {t.status}
              </span>
            </div>

            <h3 className="font-display font-black text-lg text-[#050505] uppercase">{t.name}</h3>

            <div className="font-mono text-xs space-y-1 text-gray-700">
              <p>👤 <strong>Team Leader:</strong> {t.leader}</p>
              <p>📍 <strong>Assigned Area:</strong> {t.area}</p>
              <p>👥 <strong>Members:</strong> {t.members} Personnel</p>
              <p>📞 <strong>Direct Line:</strong> {t.contact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
