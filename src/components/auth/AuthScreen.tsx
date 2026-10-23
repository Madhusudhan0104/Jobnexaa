import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Check,
  CheckCircle2,
  Copy,
  Hammer,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { CITIES_AND_AREAS, SKILL_CATEGORIES } from '../../data/mockData.ts';
import { SkillCategory, UserRole } from '../../types.ts';

export const AuthScreen: React.FC = () => {
  const {
    signInWithGoogle,
    signInAsDemoUser,
    signInWithEmail,
    signUpWithEmail,
    authLoading,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('worker');

  // Sign In state
  const [loginError, setLoginError] = useState<string | null>(null);
  const [notRegisteredNotice, setNotRegisteredNotice] = useState<boolean>(false);
  const [showAccountNotFoundModal, setShowAccountNotFoundModal] = useState<boolean>(false);

  // Email / Password inputs
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regSkill, setRegSkill] = useState<SkillCategory>('Plumber');
  const [regArea, setRegArea] = useState('Koramangala');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regBusinessType, setRegBusinessType] = useState('Private Household');
  const [regError, setRegError] = useState<string | null>(null);

  const bangaloreAreas = CITIES_AND_AREAS['Bangalore'] || [
    'Koramangala',
    'Indiranagar',
    'HSR Layout',
    'Whitefield',
    'Jayanagar',
    'BTM Layout',
    'Electronic City',
    'Marathahalli',
  ];

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  const copyHostname = () => {
    if (navigator.clipboard && currentHostname) {
      navigator.clipboard.writeText(currentHostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    }
  };

  // Sign In with Google
  const handleGoogleSignIn = async () => {
    setLoginError(null);
    setNotRegisteredNotice(false);

    const res = await signInWithGoogle(undefined, false);
    if (!res.success) {
      if (res.notRegistered) {
        setNotRegisteredNotice(true);
        setShowAccountNotFoundModal(true);
        setLoginError('Account not found. Please register if new.');
      } else if (res.error) {
        setLoginError(res.error);
      }
    }
  };

  // Register with Google
  const handleGoogleRegister = async () => {
    setRegError(null);

    const res = await signInWithGoogle(selectedRole, true, {
      name: regName.trim() || undefined,
      phone: regPhone.trim() || undefined,
      primarySkill: selectedRole === 'worker' ? regSkill : undefined,
      area: regArea,
      companyName: selectedRole === 'employer' ? regCompanyName.trim() || undefined : undefined,
      businessType: selectedRole === 'employer' ? regBusinessType : undefined,
    });

    if (!res.success && res.error) {
      setRegError(res.error);
    }
  };

  // Sign In with Email / Username & Password
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInWithEmail) return;
    if (!emailInput.trim() || !passwordInput.trim()) {
      setLoginError('Please enter both email/username and password.');
      return;
    }
    setLoginError(null);
    const res = await signInWithEmail(emailInput.trim(), passwordInput.trim());
    if (!res.success && res.error) {
      setLoginError(res.error);
    }
  };

  // Register with Email / Username & Password
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpWithEmail) return;
    if (!emailInput.trim() || !passwordInput.trim()) {
      setRegError('Please provide an email and password to register.');
      return;
    }
    if (passwordInput.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }
    setRegError(null);
    const res = await signUpWithEmail(emailInput.trim(), passwordInput.trim(), selectedRole, {
      name: (selectedRole === 'worker' ? regName : regCompanyName).trim() || undefined,
      phone: regPhone.trim() || undefined,
      primarySkill: selectedRole === 'worker' ? regSkill : undefined,
      area: regArea,
    });
    if (!res.success && res.error) {
      setRegError(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between p-4 sm:p-6 select-none">
      
      {/* Top Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-3 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <img
            src="/src/assets/images/logo.svg"
            alt="Jobnexa Logo"
            className="w-8 h-8 rounded-xl object-contain shadow-xs"
            referrerPolicy="no-referrer"
          />
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
              Jobnexa
            </span>
            <span className="text-[11px] text-slate-500">
              Bangalore Local Trades & Workforce
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span>Bangalore, India</span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="max-w-md mx-auto w-full my-8 bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-5">
        
        {/* Title & Brand Icon */}
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xs">
            <img
              src="/src/assets/images/logo.svg"
              alt="Jobnexa"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {activeTab === 'login' ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              {activeTab === 'login'
                ? 'Sign in to access your dashboard, hire requests, and assignments.'
                : 'Join Bangalore’s verified skilled labor and employer community.'}
            </p>
          </div>
        </div>

        {/* Login / Register Segmented Toggle */}
        <div className="flex items-center p-1 bg-slate-100/90 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setLoginError(null);
              setNotRegisteredNotice(false);
              setRegError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setLoginError(null);
              setNotRegisteredNotice(false);
              setRegError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Tab 1: Sign In View */}
        {activeTab === 'login' ? (
          <div className="space-y-4">
            
            {/* If user tries to sign in without an account, ask him to register first */}
            {notRegisteredNotice && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-slate-900 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      Account Not Found
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      We couldn't find an existing account for this Google login. Please register if new to choose your account type (<strong>Worker</strong> or <strong>Employer</strong>).
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setLoginError(null);
                    setNotRegisteredNotice(false);
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-3.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs text-xs transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register Account & Choose Role</span>
                </button>
              </div>
            )}

            {!notRegisteredNotice && loginError && (
              <div
                className={`p-3.5 rounded-xl text-xs space-y-2 animate-in fade-in duration-150 ${
                  loginError.includes('Domain') || loginError.includes('unauthorized')
                    ? 'bg-amber-50 border border-amber-300 text-amber-950'
                    : 'bg-red-50/80 border border-red-200 text-red-900'
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertCircle
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      loginError.includes('Domain') || loginError.includes('unauthorized')
                        ? 'text-amber-700'
                        : 'text-red-600'
                    }`}
                  />
                  <div className="space-y-1 flex-1">
                    <p className="leading-relaxed font-semibold">
                      {loginError}
                    </p>
                    {(loginError.includes('Domain') || loginError.includes('unauthorized')) && (
                      <div className="pt-1 space-y-2">
                        <div className="flex items-center gap-2 bg-amber-100/70 p-1.5 rounded-lg border border-amber-200 font-mono text-[11px]">
                          <span className="truncate">{currentHostname}</span>
                          <button
                            type="button"
                            onClick={copyHostname}
                            className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 hover:underline shrink-0"
                          >
                            {copiedDomain ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedDomain ? 'Copied' : 'Copy Domain'}</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-amber-800">
                          Click below to bypass domain restriction and test all worker & employer workflows immediately:
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => signInAsDemoUser('worker')}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Hammer className="w-3.5 h-3.5" />
                            <span>Demo Worker</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => signInAsDemoUser('employer')}
                            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 px-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                            <span>Demo Employer</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quick 1-Click Demo Access */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Instant 1-Click Demo Testing
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Ready to test
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Test all hiring, worker task completion, and employer conclusion features instantly without Google OAuth domain whitelisting:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => signInAsDemoUser('worker')}
                  disabled={authLoading}
                  className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-semibold text-xs py-2 px-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <Hammer className="w-3.5 h-3.5 text-amber-600" />
                  <span>Demo Worker</span>
                </button>
                <button
                  type="button"
                  onClick={() => signInAsDemoUser('employer')}
                  disabled={authLoading}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 px-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                  <span>Demo Employer</span>
                </button>
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-2 text-[10px] uppercase font-bold text-slate-400">or sign in with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Google Sign In Button */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer"
              >
                {authLoading ? (
                  <span className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="w-3.5 h-3.5 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.7 0 3 .7 3.7 1.4l2.8-2.8C16.8 2.1 14.6 1.3 12 1.3 7.8 1.3 4.2 3.8 2.6 7.4l3.5 2.7C7 7.2 9.2 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M6.1 14.6c-.3-.8-.4-1.7-.4-2.6s.1-1.8.4-2.6L2.6 6.7C1.6 8.7 1 10.8 1 13s.6 4.3 1.6 6.3l3.5-2.7z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23.7c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-2.8 0-5-2.2-5.9-5.1L2.6 16.6C4.2 20.2 7.8 23.7 12 23.7z"
                      />
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>
            </div>

            {/* Email / Password collapsible toggle */}
            <div className="pt-1">
              {!showEmailForm ? (
                <button
                  type="button"
                  onClick={() => setShowEmailForm(true)}
                  className="w-full text-center text-xs font-semibold text-slate-600 hover:text-slate-900 py-1 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Sign in with Email or Username</span>
                </button>
              ) : (
                <form onSubmit={handleEmailSignIn} className="space-y-2.5 pt-1">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Email or Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="you@domain.com or username"
                        className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 px-3 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <span>Sign In with Credentials</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            <p className="text-[11px] text-center text-slate-500 pt-1">
              Protected by Google OAuth · Direct verified access
            </p>

            <div className="border-t border-slate-100 pt-3 text-center">
              <p className="text-xs text-slate-500">
                New to Jobnexa?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setLoginError(null);
                    setNotRegisteredNotice(false);
                  }}
                  className="font-semibold text-slate-900 hover:underline cursor-pointer"
                >
                  Register an account
                </button>
              </p>
            </div>
          </div>
        ) : (
          /* Tab 2: Register View */
          <div className="space-y-4">
            {regError && (
              <div
                className={`p-3.5 rounded-xl text-xs space-y-2 animate-in fade-in duration-150 ${
                  regError.includes('Domain') || regError.includes('unauthorized')
                    ? 'bg-amber-50 border border-amber-300 text-amber-950'
                    : 'bg-red-50/80 border border-red-200 text-red-900'
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertCircle
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      regError.includes('Domain') || regError.includes('unauthorized')
                        ? 'text-amber-700'
                        : 'text-red-600'
                    }`}
                  />
                  <div className="space-y-1 flex-1">
                    <p className="leading-relaxed font-semibold">{regError}</p>
                    {(regError.includes('Domain') || regError.includes('unauthorized')) && (
                      <div className="pt-1 flex gap-2">
                        <button
                          type="button"
                          onClick={() => signInAsDemoUser('worker')}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-2.5 rounded-lg text-xs cursor-pointer"
                        >
                          Continue as Demo Worker
                        </button>
                        <button
                          type="button"
                          onClick={() => signInAsDemoUser('employer')}
                          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 px-2.5 rounded-lg text-xs cursor-pointer"
                        >
                          Continue as Demo Employer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Select Role (Required during Registration) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-800 block">
                1. Select Account Type
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedRole('worker')}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-1.5 cursor-pointer ${
                    selectedRole === 'worker'
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Hammer className={`w-4 h-4 ${selectedRole === 'worker' ? 'text-amber-400' : 'text-slate-400'}`} />
                    {selectedRole === 'worker' && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <strong className="text-xs font-bold block">
                      Worker
                    </strong>
                    <span className={`text-[10px] block leading-tight mt-0.5 ${selectedRole === 'worker' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Skilled trades looking for work
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('employer')}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-1.5 cursor-pointer ${
                    selectedRole === 'employer'
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Briefcase className={`w-4 h-4 ${selectedRole === 'employer' ? 'text-sky-400' : 'text-slate-400'}`} />
                    {selectedRole === 'employer' && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <strong className="text-xs font-bold block">
                      Employer
                    </strong>
                    <span className={`text-[10px] block leading-tight mt-0.5 ${selectedRole === 'employer' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Hiring workers or contractors
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Profile Details */}
            <div className="space-y-2.5 pt-1">
              <label className="text-xs font-semibold text-slate-800 block">
                2. Details (Optional)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">
                    {selectedRole === 'worker' ? 'Full Name' : 'Company or Name'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={selectedRole === 'worker' ? regName : regCompanyName}
                      onChange={(e) =>
                        selectedRole === 'worker'
                          ? setRegName(e.target.value)
                          : setRegCompanyName(e.target.value)
                      }
                      placeholder={selectedRole === 'worker' ? 'e.g. Ramesh Kumar' : 'e.g. Nexus Enterprises'}
                      className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98450 00000"
                      className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {selectedRole === 'worker' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Primary Skill
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <Wrench className="w-3.5 h-3.5" />
                      </div>
                      <select
                        value={regSkill}
                        onChange={(e) => setRegSkill(e.target.value as SkillCategory)}
                        className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white cursor-pointer"
                      >
                        {SKILL_CATEGORIES.map((skill) => (
                          <option key={skill} value={skill}>
                            {skill}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Bangalore Area
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <select
                        value={regArea}
                        onChange={(e) => setRegArea(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white cursor-pointer"
                      >
                        {bangaloreAreas.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Business Type
                    </label>
                    <select
                      value={regBusinessType}
                      onChange={(e) => setRegBusinessType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white cursor-pointer"
                    >
                      <option value="Private Household">Private Household</option>
                      <option value="Contractor / Construction">Contractor / Construction</option>
                      <option value="Commercial / Retail">Commercial / Retail</option>
                      <option value="Facility Management">Facility Management</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Bangalore Area
                    </label>
                    <select
                      value={regArea}
                      onChange={(e) => setRegArea(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white cursor-pointer"
                    >
                      {bangaloreAreas.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Register with Google Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGoogleRegister}
                disabled={authLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer"
              >
                {authLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Registering with Google...
                  </span>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.7 0 3 .7 3.7 1.4l2.8-2.8C16.8 2.1 14.6 1.3 12 1.3 7.8 1.3 4.2 3.8 2.6 7.4l3.5 2.7C7 7.2 9.2 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M6.1 14.6c-.3-.8-.4-1.7-.4-2.6s.1-1.8.4-2.6L2.6 6.7C1.6 8.7 1 10.8 1 13s.6 4.3 1.6 6.3l3.5-2.7z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23.7c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-2.8 0-5-2.2-5.9-5.1L2.6 16.6C4.2 20.2 7.8 23.7 12 23.7z"
                      />
                    </svg>
                    <span>
                      Register with Google as {selectedRole === 'worker' ? 'Worker' : 'Employer'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Email Registration Alternative */}
            <div className="pt-1">
              {!showEmailForm ? (
                <button
                  type="button"
                  onClick={() => setShowEmailForm(true)}
                  className="w-full text-center text-xs font-semibold text-slate-600 hover:text-slate-900 py-1 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Or Register with Email & Password</span>
                </button>
              ) : (
                <form onSubmit={handleEmailRegister} className="space-y-2.5 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold pt-1">
                    <span>Credentials Registration</span>
                    <button
                      type="button"
                      onClick={() => setShowEmailForm(false)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      Hide
                    </button>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Password (min 6 characters)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 px-3 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <span>Create {selectedRole === 'worker' ? 'Worker' : 'Employer'} Account with Email</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            <p className="text-[11px] text-center text-slate-500 pt-1">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setRegError(null);
                }}
                className="font-semibold text-slate-900 hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </div>
        )}

      </main>

      {/* Footer Feature Trust Badges */}
      <footer className="max-w-2xl mx-auto w-full grid grid-cols-3 gap-4 text-center text-xs text-slate-500 py-3 border-t border-slate-200/60">
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-slate-700" />
          <span className="text-[11px] font-medium">Verified Trades</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Zap className="w-4 h-4 text-slate-700" />
          <span className="text-[11px] font-medium">Direct Hiring</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <MapPin className="w-4 h-4 text-slate-700" />
          <span className="text-[11px] font-medium">Hyperlocal Bangalore</span>
        </div>
      </footer>

      {/* Pop Up Modal: Register - Account Not Found */}
      {showAccountNotFoundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-200 text-slate-900 relative space-y-4 animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-not-found-modal-title"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowAccountNotFoundModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header with Icon */}
            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2
                  id="account-not-found-modal-title"
                  className="text-lg font-bold text-slate-900 tracking-tight"
                >
                  Account Not Found
                </h2>
                <span className="text-xs font-semibold text-amber-700 block">
                  Please register to continue
                </span>
              </div>
            </div>

            {/* Message Box */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-600 leading-relaxed">
              <p>
                We couldn't find an existing account matching your Google account in Jobnexa.
              </p>
              <p>
                Please <strong>register if new</strong> to choose whether you want to join as a <strong className="text-slate-900">Worker</strong> or an <strong className="text-slate-900">Employer</strong>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowAccountNotFoundModal(false);
                  setActiveTab('register');
                  setLoginError(null);
                  setNotRegisteredNotice(false);
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Account Now</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                type="button"
                onClick={() => setShowAccountNotFoundModal(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-lg transition-colors cursor-pointer text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
