import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeartHandshake, User, Building2, CheckCircle2, ArrowLeft, Mail, Lock, Phone, Sparkles } from 'lucide-react';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('CITIZEN');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password confirmation does not match.');
      return;
    }

    const res = signup({
      fullName,
      email,
      phone,
      password,
      role
    });

    if (res.success) {
      // Redirect to login with state message
      navigate('/login', { state: { message: 'Account created successfully. Please login.' } });
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
              ACCOUNT REGISTRATION
            </p>
          </div>
        </div>

        <Link
          to="/login"
          className="flex items-center gap-1.5 font-mono font-bold text-xs bg-white border-3 border-[#050505] px-3.5 py-2 shadow-[3px_3px_0_#050505] hover:bg-[#FFD83D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO LOGIN</span>
        </Link>
      </header>

      {/* Main Registration Card */}
      <main className="max-w-2xl mx-auto w-full my-8">
        <div className="neo-box p-6 md:p-8 bg-white space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 pb-4 border-b-4 border-[#050505]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#B7FF2A] border-2 border-[#050505] font-mono font-black text-[11px] uppercase shadow-[2px_2px_0_#050505]">
              <Sparkles className="w-3.5 h-3.5" />
              JOIN CIVICPULSE BENGALURU
            </div>
            <h2 className="font-display font-black text-2xl md:text-3xl text-[#050505] uppercase tracking-tight">
              CREATE YOUR CIVICPULSE ACCOUNT
            </h2>
          </div>

          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-[#FF4F87] text-white border-2 border-[#050505] font-mono font-bold text-xs shadow-[2px_2px_0_#050505]">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Cards (Section 2) */}
            <div>
              <label className="block font-mono font-black text-xs uppercase text-[#050505] mb-2">
                CHOOSE YOUR ACCOUNT ROLE *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Citizen Card */}
                <div
                  onClick={() => setRole('CITIZEN')}
                  className={`border-3 border-[#050505] p-4 shadow-[4px_4px_0_#050505] cursor-pointer transition-all ${
                    role === 'CITIZEN'
                      ? 'bg-[#B7FF2A] translate-y-[-2px] shadow-[6px_6px_0_#050505]'
                      : 'bg-[#F8F1E5] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <User className="w-6 h-6 text-[#050505]" />
                    {role === 'CITIZEN' && (
                      <span className="font-mono text-[10px] font-black bg-[#050505] text-[#B7FF2A] px-2 py-0.5">
                        SELECTED
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-black text-base text-[#050505] uppercase">
                    CITIZEN
                  </h3>
                  <p className="font-sans font-bold text-xs text-gray-800 mt-1">
                    Report civic issues and track your reports.
                  </p>
                </div>

                {/* Municipal Worker Card */}
                <div
                  onClick={() => setRole('MUNICIPAL_WORKER')}
                  className={`border-3 border-[#050505] p-4 shadow-[4px_4px_0_#050505] cursor-pointer transition-all ${
                    role === 'MUNICIPAL_WORKER'
                      ? 'bg-[#4C5CFF] text-white translate-y-[-2px] shadow-[6px_6px_0_#050505]'
                      : 'bg-[#F8F1E5] hover:bg-white text-[#050505]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Building2 className="w-6 h-6" />
                    {role === 'MUNICIPAL_WORKER' && (
                      <span className="font-mono text-[10px] font-black bg-white text-[#4C5CFF] px-2 py-0.5">
                        SELECTED
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-black text-base uppercase">
                    MUNICIPAL WORKER
                  </h3>
                  <p className="font-sans font-bold text-xs mt-1 opacity-90">
                    Monitor incidents, allocate resources and manage responses.
                  </p>
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono font-black text-xs uppercase text-[#050505] mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#F8F1E5] border-3 border-[#050505] p-2.5 font-sans font-bold text-sm text-[#050505] focus:outline-none focus:ring-2 focus:ring-[#B7FF2A]"
                />
              </div>

              <div>
                <label className="block font-mono font-black text-xs uppercase text-[#050505] mb-1">
                  EMAIL ADDRESS *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#F8F1E5] border-3 border-[#050505] pl-9 pr-3 py-2.5 font-sans font-bold text-sm text-[#050505] focus:outline-none focus:ring-2 focus:ring-[#B7FF2A]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-mono font-black text-xs uppercase text-[#050505] mb-1">
                PHONE NUMBER
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#F8F1E5] border-3 border-[#050505] pl-9 pr-3 py-2.5 font-sans font-bold text-sm text-[#050505] focus:outline-none focus:ring-2 focus:ring-[#B7FF2A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono font-black text-xs uppercase text-[#050505] mb-1">
                  PASSWORD (MIN 6 CHARS) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F8F1E5] border-3 border-[#050505] pl-9 pr-3 py-2.5 font-sans font-bold text-sm text-[#050505] focus:outline-none focus:ring-2 focus:ring-[#B7FF2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono font-black text-xs uppercase text-[#050505] mb-1">
                  CONFIRM PASSWORD *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F8F1E5] border-3 border-[#050505] pl-9 pr-3 py-2.5 font-sans font-bold text-sm text-[#050505] focus:outline-none focus:ring-2 focus:ring-[#B7FF2A]"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#FF4F87] text-white border-3 border-[#050505] shadow-[5px_5px_0_#050505] font-display font-black text-base uppercase tracking-wider hover:bg-[#ff3574] hover:shadow-[7px_7px_0_#050505] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_#050505] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>CREATE ACCOUNT NOW</span>
              </button>

              <Link
                to="/login"
                className="w-full py-2.5 bg-white text-[#050505] border-3 border-[#050505] shadow-[3px_3px_0_#050505] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#FFD83D] transition-all flex items-center justify-center gap-1.5"
              >
                <span>BACK TO LOGIN</span>
              </Link>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full pt-4 border-t-4 border-[#050505] flex flex-wrap items-center justify-between text-xs font-mono font-bold text-gray-700">
        <div>© 2026 CIVICPULSE — BENGALURU URBAN REGISTRATION</div>
        <div className="flex items-center gap-3">
          <span>BBMP COMPLIANT</span>
          <span>•</span>
          <span>SECURE AUTH</span>
        </div>
      </footer>
    </div>
  );
}
