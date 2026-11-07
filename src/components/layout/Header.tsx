import {
  AlertTriangle,
  Check,
  ChevronRight,
  HelpCircle,
  MapPin,
  Type,
  UserCheck,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
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

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isEmergency = mode === 'emergency';

  const initials = currentUser.fullName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const tierLabels: { id: AccountTier; title: string; subtitle: string }[] = [
    {
      id: 'referente',
      title: 'Rafael Ramirez',
      subtitle: 'Vecino fundador · 18 meses en el barrio',
    },
    {
      id: 'activo',
      title: 'Bryan Mango',
      subtitle: 'Vecino verificado · 6 meses en el barrio',
    },
    {
      id: 'nuevo',
      title: 'Cuenta reciente',
      subtitle: 'Recién unido a la cuadra',
    },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-30 border-b transition-colors duration-200 backdrop-blur-xl ${
          isEmergency
            ? 'dark-surface bg-[#090d16]/85 border-red-500/25 text-slate-100'
            : 'bg-white/80 border-slate-200/70 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[19px] font-bold tracking-tight">VecinOS</span>
              {!isOnline && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                  <WifiOff className="h-3 w-3" aria-hidden="true" />
                  Sin red{pendingSyncCount > 0 ? ` (${pendingSyncCount})` : ''}
                </span>
              )}
            </div>
            <p
              className={`flex items-center gap-1 truncate text-xs font-medium ${
                isEmergency ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              <MapPin className="h-3 w-3 shrink-0 text-emerald-500" aria-hidden="true" />
              <span className="truncate">{currentUser.neighborhood}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-pressed={isEmergency}
              onClick={toggleEmergencyMode}
              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition active:scale-95 ${
                isEmergency
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-red-50 text-red-600 border border-red-200/80 hover:bg-red-100'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isEmergency ? 'Salir de S.O.S.' : 'S.O.S.'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              aria-label="Abrir perfil y opciones"
              className={`relative flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition active:scale-95 ${
                isEmergency
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'bg-slate-900 text-white shadow-sm'
              }`}
            >
              {initials}
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                  isOnline ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {isProfileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Perfil y ajustes"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsProfileOpen(false)}
        >
          <div
            className="w-full max-w-[430px] rounded-t-[28px] bg-[#F2F2F7] p-5 pb-8 text-slate-900 shadow-2xl animate-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1.5 w-9 rounded-full bg-slate-300" />

            <div className="flex items-center justify-between pb-4">
              <h2 className="text-lg font-bold tracking-tight">Tu perfil vecinal</h2>
              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                aria-label="Cerrar ajustes"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/80 text-slate-600"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{currentUser.fullName}</p>
                  <p className="text-xs text-slate-500">
                    DNI {currentUser.dni} · {currentUser.neighborhood}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                >
                  <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Cambiar DNI</span>
                </button>
              </div>
            </div>

            <div className="mt-4">
              <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Cambiar cuenta activa
              </p>
              <div className="mt-1.5 divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-xs">
                {tierLabels.map((t) => {
                  const active = currentUser.accountTier === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => switchDemoUserTier(t.id)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-slate-50"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{t.title}</p>
                        <p className="text-xs text-slate-500">{t.subtitle}</p>
                      </div>
                      {active && <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-xs">
              <button
                type="button"
                onClick={() => setIsOnline(!isOnline)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-900"
              >
                <span className="flex items-center gap-2.5">
                  {isOnline ? (
                    <Wifi className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-amber-600" aria-hidden="true" />
                  )}
                  <span>Conexión de red</span>
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isOnline ? 'En línea' : 'Modo sin internet'}
                </span>
              </button>

              <button
                type="button"
                onClick={toggleSeniorMode}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-900"
              >
                <span className="flex items-center gap-2.5">
                  <Type className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                  <span>Tamaño de texto grande</span>
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    isSeniorMode ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isSeniorMode ? 'Activado' : 'Normal'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsTutorialOpen(true);
                }}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-900"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  <span>Cómo funciona VecinOS</span>
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
