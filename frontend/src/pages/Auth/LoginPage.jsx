import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeartHandshake, ShieldCheck, ArrowRight, User, Building2, Key, Mail, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { login, quickDemoLogin, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('jane.citizen@example.com');
  const [password, setPassword] = useState('CitizenPass123!');
  const [selectedRole, setSelectedRole] = useState('CITIZEN');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  // If already authenticated, redirect to appropriate dashboard immediately
  useEffect(() => {
    if (isAuthenticated) {
      const isWorker = role === 'ADMIN' || role === 'MUNICIPAL_WORKER' || role === 'MUNICIPAL';
      navigate(isWorker ? '/admin' : '/citizen', { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  const handleRoleSelect = (roleName) => {
    setSelectedRole(roleName);
    if (roleName === 'CITIZEN') {
      setEmail('jane.citizen@example.com');
      setPassword('CitizenPass123!');
    } else {
      setEmail('admin@civicpulse.local');
      setPassword('AdminPass123!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please fill in both Email and Password.');
      return;
    }

    try {
      const res = await login(email, password);
      if (res.success) {
        const isWorker = res.user.role === 'ADMIN' || res.user.role === 'MUNICIPAL_WORKER' || res.user.role === 'MUNICIPAL';
        navigate(isWorker ? '/admin' : '/citizen', { replace: true });
      } else {
        setErrorMessage(res.error || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check credentials.');
    }
  };

  const handleQuickLogin = async (targetRole) => {
    setErrorMessage('');
    try {
      const user = await quickDemoLogin(targetRole);
      if (user) {
        const isWorker = user.role === 'ADMIN' || user.role === 'MUNICIPAL_WORKER' || user.role === 'MUNICIPAL';
        navigate(isWorker ? '/admin' : '/citizen', { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Quick login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F1E5] text-[#050505] flex flex-col justify-between p-4 md:p-8 font-sans selection:bg-[#B7FF2A]">
      {/* Top Brand Bar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-4 border-b-4 border-[#050505]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#B7FF2A] border-3 border-[#050505] shadow-[3px_3px_0_#050505] flex items-center justify-center font-black">
            <HeartHandshake className="w-7 h-7 text-[#050505]" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl md:text-3xl leading-none tracking-tight text-[#050505]">
              CIVICPULSE
            </h1>
            <p className="font-mono font-bold text-xs uppercase tracking-widest text-gray-700 mt-1">
              SMART CIVIC INCIDENT RESPONSE
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono font-bold text-xs bg-white border-3 border-[#050505] px-3 py-1.5 shadow-[3px_3px_0_#050505]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00D66B] animate-pulse"></span>
          <span>SYSTEM OPERATIONAL</span>
        </div>
      </header>

      {/* Centered Main Authentication Card */}
      <main className="max-w-md mx-auto w-full my-8">
        <div className="neo-box p-6 md:p-8 bg-white space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-2 pb-4 border-b-4 border-[#050505]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFD83D] border-2 border-[#050505] font-mono font-black text-[11px] uppercase shadow-[2px_2px_0_#050505]">
              <Sparkles className="w-3.5 h-3.5" />
              AUTHENTICATION PORTAL
            </div>
            <h2 className="font-display font-black text-3xl text-[#050505] uppercase tracking-tight">
              CIVICPULSE
            </h2>
            <p className="font-sans font-bold text-xs text-gray-700 italic">
              "Report problems. Track incidents. Improve Bengaluru."
            </p>
          </div>

          {/* Quick Demo One-Click Accounts Section (Section 4) */}
          <div className="bg-[#F8F1E5] border-3 border-[#050505] p-3.5 shadow-[3px_3px_0_#050505] space-y-2">
            <span className="font-mono font-black text-[11px] uppercase text-[#050505] block text-center">
              ⚡ HACKATHON DEMO ONE-CLICK LOGIN:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('CITIZEN')}
                className="py-2 px-2.5 bg-[#B7FF2A] text-[#050505] border-2 border-[#050505] shadow-[2px_2px_0_#050505] font-display font-black text-[11px] uppercase hover:bg-[#a5f013] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <span>LOGIN AS CITIZEN</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('MUNICIPAL_WORKER')}
                className="py-2 px-2.5 bg-[#4C5CFF] text-white border-2 border-[#050505] shadow-[2px_2px_0_#050505] font-display font-black text-[11px] uppercase hover:bg-[#3848e8] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <span>LOGIN AS WORKER</span>
              </button>
            </div>
          </div>

          {/* Success Banner if redirected from registration */}
          {successMessage && (
            <div className="p-3 bg-[#B7FF2A] text-[#050505] border-2 border-[#050505] font-mono font-bold text-xs shadow-[2px_2px_0_#050505] flex items-center justify-between">
              <span>✓ {successMessage}</span>
              <button type="button" onClick={() => setSuccessMessage('')} className="font-black cursor-pointer">✕</button>
            </div>
          )}

          {/* Error Banner if any */}
          {errorMessage && (
            <div className="p-3 bg-[#FF4F87] text-white border-2 border-[#050505] font-mono font-bold text-xs shadow-[2px_2px_0_#050505]">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Switcher */}
            <div>
              <label className="block font-mono font-black text-xs uppercase text-[#050505] mb-1.5">
                SELECT ROLE *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('CITIZEN')}
                  className={`py-2.5 px-3 border-3 border-[#050505] font-display font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedRole === 'CITIZEN'
                      ? 'bg-[#B7FF2A] text-[#050505] shadow-[3px_3px_0_#050505]'
                      : 'bg-gray-100 text-gray-600 hover:bg-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>CITIZEN</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('MUNICIPAL_WORKER')}
                  className={`py-2.5 px-3 border-3 border-[#050505] font-display font-black text-xs uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedRole === 'MUNICIPAL_WORKER'
                      ? 'bg-[#4C5CFF] text-white shadow-[3px_3px_0_#050505]'
                      : 'bg-gray-100 text-gray-600 hover:bg-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>MUNICIPAL WORKER</span>
                </button>
              </div>
            </div>

            {/* Email / Username */}
            <div>
              <label className="block font-mono font-black text-xs uppercase text-[#050505] mb-1">
                EMAIL / USERNAME *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. citizen@civicpulse.com"
                  className="w-full bg-[#F8F1E5] border-3 border-[#050505] pl-9 pr-3 py-2.5 font-sans font-bold text-sm text-[#050505] focus:outline-none focus:ring-2 focus:ring-[#B7FF2A]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-mono font-black text-xs uppercase text-[#050505]">
                  PASSWORD *
                </label>
                <button
                  type="button"
                  onClick={() => alert("Password reset link requested. Placeholder active.")}
                  className="font-mono font-bold text-[11px] text-[#4C5CFF] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#F8F1E5] border-3 border-[#050505] pl-9 pr-3 py-2.5 font-sans font-bold text-sm text-[#050505] focus:outline-none focus:ring-2 focus:ring-[#B7FF2A]"
                />
              </div>
            </div>

            {/* Login CTA Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#FF4F87] text-white border-3 border-[#050505] shadow-[5px_5px_0_#050505] font-display font-black text-base uppercase tracking-wider hover:bg-[#ff3574] hover:shadow-[7px_7px_0_#050505] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_#050505] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>LOGIN NOW →</span>
            </button>
          </form>

          {/* Signup Navigation Link */}
          <div className="pt-4 border-t-2 border-[#050505] text-center font-sans font-bold text-xs text-gray-700">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-display font-black text-sm text-[#4C5CFF] hover:underline uppercase ml-1"
            >
              SIGN UP
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full pt-4 border-t-4 border-[#050505] flex flex-wrap items-center justify-between text-xs font-mono font-bold text-gray-700">
        <div>© 2026 CIVICPULSE — CITIZEN & ADMIN INCIDENT RESPONSE</div>
        <div className="flex items-center gap-3">
          <span>BENGALURU URBAN</span>
          <span>•</span>
          <span>OPENSTREETMAP</span>
        </div>
      </footer>
    </div>
  );
}
