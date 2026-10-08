import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, ShieldAlert } from 'lucide-react';

export default function CTASection() {
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
    <section className="py-12 md:py-16 px-4 md:px-8 border-b-4 border-[#050505] bg-[#F8F1E5]">
      <div className="max-w-5xl mx-auto neo-box p-8 md:p-12 bg-[#B7FF2A] text-[#050505] space-y-6 text-center shadow-[8px_8px_0_#050505]">
        <h2 className="font-display font-black text-3xl md:text-5xl lg:text-6xl uppercase leading-tight tracking-tight">
          YOUR CITY. YOUR REPORT. <br/>
          FASTER RESPONSE.
        </h2>

        <p className="font-sans font-bold text-base md:text-lg text-gray-900 max-w-xl mx-auto">
          Help Bengaluru respond to what matters most. Join thousands of citizens and municipal leaders on CivicPulse.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => handleAction(role === 'MUNICIPAL_WORKER' ? '/admin' : '/citizen')}
            className="px-8 py-4 bg-[#FF4F87] text-white border-3 border-[#050505] shadow-[5px_5px_0_#050505] font-display font-black text-base uppercase hover:bg-[#ff3574] active:translate-x-1 active:translate-y-1 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>REPORT AN ISSUE</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleAction(role === 'CITIZEN' ? '/citizen' : '/admin')}
            className="px-8 py-4 bg-[#4C5CFF] text-white border-3 border-[#050505] shadow-[5px_5px_0_#050505] font-display font-black text-base uppercase hover:bg-[#3848e8] active:translate-x-1 active:translate-y-1 transition-all cursor-pointer flex items-center gap-2"
          >
            <ShieldAlert className="w-5 h-5" />
            <span>FOR MUNICIPAL TEAMS</span>
          </button>
        </div>
      </div>
    </section>
  );
}
