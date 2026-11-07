import {
  AlertTriangle,
  HelpCircle,
  MapPin,
  ShieldCheck,
  UserCheck,
  Wifi,
  WifiOff,
} from 'lucide-react';
import React from 'react';
import { useApp } from '../../context/AppContext';
import { AccountTier } from '../../types';

export const Header: React.FC = () => {
  const {
    mode,
    toggleEmergencyMode,
    isOnline,
    setIsOnline,
    pendingSyncCount,
    currentUser,
    switchDemoUserTier,
    setIsAuthModalOpen,
    setIsTutorialOpen,
    isSeniorMode,
    toggleSeniorMode,
  } = useApp();

  const isEmergency = mode === 'emergency';

  return (
    <header
      className={`sticky top-0 z-30 border-b transition-colors duration-200 ${
        isEmergency
          ? 'dark-surface bg-slate-950 border-red-500/40 text-slate-100'
          : 'bg-white/95 backdrop-blur border-slate-200 text-slate-900'
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl font-black text-white shadow-sm ${
              isEmergency ? 'bg-red-600 animate-pulse' : 'bg-emerald-600'
            }`}
          >
            {isEmergency ? 'SOS' : 'V'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight">VecinOS</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  isEmergency
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isEmergency ? 'Central de Crisis Activa' : 'Red Hiperlocal'}
              </span>
            </div>
            <p
              className={`flex items-center gap-1 text-xs ${
                isEmergency ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{currentUser.neighborhood}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs ${
              isEmergency ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            <label htmlFor="tier-select" className="font-medium">
              Cuenta:
            </label>
            <select
              id="tier-select"
              value={currentUser.accountTier}
              onChange={(e) => switchDemoUserTier(e.target.value as AccountTier)}
              className="rounded bg-transparent font-semibold focus:outline-none"
            >
              <option value="referente" className="text-slate-900">
                Vecino Antiguo (Peso 1.5x)
              </option>
              <option value="activo" className="text-slate-900">
                Vecino Activo (Peso 1.0x)
              </option>
              <option value="nuevo" className="text-slate-900">
                Cuenta Nueva (Peso 0.25x)
              </option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              isEmergency
                ? 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            <span>Validar DNI ({currentUser.dni})</span>
          </button>

          <button
            type="button"
            aria-pressed={!isOnline}
            onClick={() => setIsOnline(!isOnline)}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              isOnline
                ? isEmergency
                  ? 'border-emerald-500/40 bg-emerald-950/50 text-emerald-300'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-amber-400 bg-amber-500 text-slate-950'
            }`}
          >
            {isOnline ? (
              <Wifi className="h-4 w-4" aria-hidden="true" />
            ) : (
              <WifiOff className="h-4 w-4" aria-hidden="true" />
            )}
            <span>
              {isOnline
                ? 'Online'
                : `Offline (${pendingSyncCount} en cola)`}
            </span>
          </button>

          <button
            type="button"
            aria-pressed={isSeniorMode}
            onClick={toggleSeniorMode}
            className={`inline-flex min-h-[44px] items-center rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              isSeniorMode
                ? 'border-indigo-500 bg-indigo-600 text-white'
                : isEmergency
                ? 'border-slate-700 bg-slate-900 text-slate-200'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Letra A+</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTutorialOpen(true)}
            aria-label="Abrir Guía Rápida"
            className={`inline-flex min-h-[44px] items-center gap-1 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition ${
              isEmergency
                ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Guía</span>
          </button>

          <button
            type="button"
            aria-pressed={isEmergency}
            onClick={toggleEmergencyMode}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold shadow-sm transition ${
              isEmergency
                ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            <span>{isEmergency ? 'Volver a Modo Día a Día' : 'Modo Emergencia S.O.S.'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
