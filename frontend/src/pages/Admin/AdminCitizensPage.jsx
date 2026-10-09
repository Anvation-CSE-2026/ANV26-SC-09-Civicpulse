import React, { useState, useEffect } from 'react';
import { Users, Award, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { apiService } from '../../services/api';

export default function AdminCitizensPage() {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchTerm } = useOutletContext() || {};

  const loadCitizens = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getCitizens();
      setCitizens(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load citizens:', err);
      setError('Unable to load citizens');
      setCitizens([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCitizens();
  }, []);

  const filteredCitizens = citizens.filter((c) => {
    if (!searchTerm || !searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.residentialWard && c.residentialWard.toLowerCase().includes(term)) ||
      String(c.id).includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="neo-box p-5 bg-[#4C5CFF] text-white flex justify-between items-center">
        <div>
          <h1 className="font-display font-black text-2xl uppercase">CITIZEN REPUTATION & GUARDIANS DIRECTORY</h1>
          <p className="font-mono text-xs font-bold text-gray-200 mt-1">Verified resident accounts, civic point rewards, & leaderboard rankings.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadCitizens}
            disabled={loading}
            title="Refresh Citizens"
            className="p-1.5 bg-white text-black border border-black hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="font-mono font-black text-xs bg-[#B7FF2A] text-black px-3 py-1 border border-black">
            {citizens.length} GUARDIANS LISTED
          </span>
        </div>
      </div>

      <div className="neo-box p-4 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs font-bold">
            <thead>
              <tr className="bg-[#050505] text-white border-b-2 border-black">
                <th className="p-3">USER ID</th>
                <th className="p-3">FULL NAME & EMAIL</th>
                <th className="p-3">RESIDENTIAL WARD</th>
                <th className="p-3">CIVIC POINTS</th>
                <th className="p-3">GUARDIAN LEVEL</th>
                <th className="p-3 text-right">REPORTS</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {loading && citizens.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 font-bold">
                    Loading citizens from database...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#FF4F87] font-bold">
                    <div className="flex items-center justify-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCitizens.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 font-bold">
                    {searchTerm ? 'No matching citizens found.' : 'No citizens registered yet.'}
                  </td>
                </tr>
              ) : (
                filteredCitizens.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F8F1E5]">
                    <td className="p-3 text-[#4C5CFF]">#USR-{String(c.id).padStart(3, '0')}</td>
                    <td className="p-3">
                      <p className="font-black text-black">{c.name}</p>
                      <p className="text-[10px] text-gray-600">{c.email}</p>
                    </td>
                    <td className="p-3">{c.residentialWard || 'Not specified'}</td>
                    <td className="p-3 font-black text-base text-[#050505]">{c.civicPoints ?? 0} PTS</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-[#B7FF2A] border border-black text-black font-black">
                        LEVEL 1 CITIZEN
                      </span>
                    </td>
                    <td className="p-3 text-right font-black">{c.reportCount ?? 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
