import React from 'react';
import {
  Bell,
  Briefcase,
  Hammer,
  Smartphone,
  Monitor,
  MapPin,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';

export const TopBar: React.FC = () => {
  const {
    role,
    notifications,
    logout,
    deviceMode,
    setDeviceMode,
    setActiveWorkerTab,
    setActiveEmployerTab,
    currentWorker,
    currentEmployer,
    firebaseUser,
  } = useApp();

  const unreadCount = notifications.filter(
    (n) => n.recipientRole === role && !n.read
  ).length;

  const handleAlertsClick = () => {
    if (role === 'worker') {
      setActiveWorkerTab('alerts');
    } else {
      setActiveEmployerTab('my-jobs');
    }
  };

  const displayName =
    role === 'worker'
      ? currentWorker?.name || firebaseUser?.displayName || 'Worker'
      : currentEmployer?.name || firebaseUser?.displayName || 'Employer';

  const displaySubtitle =
    role === 'worker'
      ? currentWorker?.primarySkill || 'Tradesperson'
      : currentEmployer?.businessType || 'Employer';

  const avatarUrl =
    role === 'worker'
      ? currentWorker?.avatar || firebaseUser?.photoURL || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80'
      : currentEmployer?.logo || firebaseUser?.photoURL || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=150&q=80';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md text-slate-900 border-b border-slate-200/80 shadow-2xs select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-6">
        
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <img
            src="/src/assets/images/logo.svg"
            alt="Jobnexa Logo"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-contain shadow-xs"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 leading-tight">
              Jobnexa
            </span>
            <span className="text-[10px] text-slate-500 hidden sm:inline-block leading-none">
              Bangalore Local Workforce
            </span>
          </div>
        </div>

        {/* Locked Role Badge (Configured only at Login / Registration) */}
        <div className="flex items-center gap-2">
          {role === 'worker' ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-lg text-xs font-semibold">
              <Hammer className="w-3.5 h-3.5 text-amber-700" />
              <span>Worker</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold">
              <Briefcase className="w-3.5 h-3.5 text-slate-700" />
              <span>Employer</span>
            </div>
          )}
        </div>

        {/* Right Actions: Viewport Toggle, Notifications & Authenticated Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Device Frame View Toggle */}
          <button
            onClick={() => setDeviceMode(deviceMode === 'responsive' ? 'mobile-pwa' : 'responsive')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title={deviceMode === 'responsive' ? 'Preview inside mobile PWA frame' : 'Switch to responsive desktop view'}
          >
            {deviceMode === 'responsive' ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden lg:inline">Mobile Frame</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden lg:inline">Desktop View</span>
              </>
            )}
          </button>

          {/* Location indicator */}
          <div className="hidden xl:flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Bangalore, IN</span>
          </div>

          {/* Notifications button */}
          <button
            onClick={handleAlertsClick}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-amber-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Real Authenticated Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
              referrerPolicy="no-referrer"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                {displayName}
              </span>
              <span className="text-[10px] text-slate-500 leading-none truncate max-w-[120px]">
                {displaySubtitle}
              </span>
            </div>

            <button
              onClick={logout}
              title="Sign out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
