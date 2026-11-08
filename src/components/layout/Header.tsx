import {
  AlertOctagon,
  AlertTriangle,
  Check,
  ChevronRight,
  HeartHandshake,
  HelpCircle,
  Map,
  MapPin,
  Plus,
  Store,
  Type,
  UserCheck,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AccountTier, ActiveTab } from '../../types';


const VecinosBrandLogo: React.FC<{ isEmergency: boolean; size?: 'sm' | 'md' }> = ({
  isEmergency,
  size = 'md',
}) => {
  const isSm = size === 'sm';
  return (
    <div
      className={`relative flex items-center justify-center text-white shadow-md transition-all duration-200 group-hover:scale-105 ${
        isSm ? 'h-9 w-9 rounded-xl' : 'h-11 w-11 rounded-[14px]'
      } ${
        isEmergency
          ? 'bg-gradient-to-br from-rose-500 via-red-600 to-red-800 shadow-red-900/30 ring-1 ring-white/25'
          : 'bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 shadow-emerald-900/25 ring-1 ring-white/30'
      }`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none ${
          isSm ? 'rounded-t-xl' : 'rounded-t-[14px]'
        }`}
      />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`${isSm ? 'h-5 w-5' : 'h-6 w-6'} text-white drop-shadow-xs`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 10.2L12 3L21 10.2"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.5 10.8V17.2C6.5 19.3 8.2 21 10.3 21H13.7C15.8 21 17.5 19.3 17.5 17.2V10.8"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M9.2 13.8L12 17.2L14.8 13.8"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="8.6" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
};

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
    activeTab,
    setActiveTab,
    openPublishModal,
    emergencyItems,
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

  const desktopNavItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'services',
      label: 'Servicios',
      icon: <Store className="h-4 w-4 stroke-[2.2]" aria-hidden="true" />,
    },
    {
      id: 'favors',
      label: 'Favores',
      icon: <HeartHandshake className="h-4 w-4 stroke-[2.2]" aria-hidden="true" />,
    },
    {
      id: 'map',
      label: 'Mapa',
      icon: <Map className="h-4 w-4 stroke-[2.2]" aria-hidden="true" />,
    },
    {
      id: 'emergency',
      label: 'S.O.S.',
      icon: <AlertOctagon className="h-4 w-4 stroke-[2.2]" aria-hidden="true" />,
      badge: emergencyItems.filter((i) => i.status === 'activo').length,
    },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b-2 transition-colors duration-200 backdrop-blur-xl ${
          isEmergency
            ? 'dark-surface bg-[#090d16]/95 border-red-500/40 text-slate-100'
            : 'bg-white/95 border-slate-200 text-slate-950 shadow-xs'
        }`}
      >
        {/* BARRA DE NAVEGACIÓN ESCRITORIO (Visible en PC y tablets, oculta en celular) */}
        <div className="hidden md:flex max-w-7xl mx-auto items-center justify-between gap-3 lg:gap-4 px-4 lg:px-6 py-2.5">
          {/* Logo y Cuadra con Alto Contraste y Balance Óptico */}
          <div className="flex items-center gap-2.5 lg:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className="flex items-center gap-3 group text-left transition"
              aria-label="Ir a inicio de VecinOS"
            >
              <VecinosBrandLogo isEmergency={isEmergency} />
              <div>
                <div className="flex items-baseline tracking-tight leading-none">
                  <span className={`text-[21px] font-black tracking-tight ${isEmergency ? 'text-white' : 'text-slate-950'}`}>
                    Vecin
                  </span>
                  <span className={`text-[21px] font-black tracking-tight ${isEmergency ? 'text-red-400' : 'text-emerald-600'}`}>
                    OS
                  </span>
                </div>
                <span className={`block text-[11px] font-black tracking-wide leading-tight mt-0.5 ${isEmergency ? 'text-slate-300' : 'text-emerald-800'}`}>
                  Tu barrio conectado
                </span>
              </div>
            </button>

            <div className="hidden xl:block h-6 w-px bg-slate-200 dark:bg-slate-800" />

            {/* Ubicación clara y legible */}
            <div
              title={`Tu zona vecinal: ${currentUser.neighborhood}`}
              className={`hidden xl:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                isEmergency
                  ? 'bg-slate-900/90 border-slate-700 text-slate-200'
                  : 'bg-emerald-50/80 border-emerald-200/90 text-emerald-950'
              }`}
            >
              <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
              <span className="truncate max-w-[170px] font-black">{currentUser.neighborhood}</span>
            </div>

            {!isOnline && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2.5 py-1 text-[11px] font-black text-amber-950 animate-pulse">
                <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
                Offline{pendingSyncCount > 0 ? ` (${pendingSyncCount})` : ''}
              </span>
            )}
          </div>

          {/* Tabs Centrales de Alta Legibilidad y Perfecta Simetría (1 sola línea, sin desnivel) */}
          <nav
            aria-label="Navegación principal de escritorio"
            className={`flex items-center rounded-2xl p-1 border transition-colors shadow-2xs ${
              isEmergency
                ? 'bg-slate-900/90 border-slate-700'
                : 'bg-slate-100/90 border-slate-200'
            }`}
          >
            {desktopNavItems.map((item) => {
              const active = activeTab === item.id;
              const isSos = item.id === 'emergency';
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`relative h-10 px-3.5 lg:px-4 flex items-center justify-center gap-2 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-150 active:scale-95 ${
                    active
                      ? isSos || isEmergency
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-white text-slate-950 shadow-xs ring-1 ring-slate-300'
                      : isEmergency
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span className="ml-0.5 inline-flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white shadow-xs">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Botones de Acción Derecha Ordenados y Sincronizados (Sin saturación) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Botón Publicar */}
            <button
              type="button"
              onClick={() => openPublishModal()}
              className={`h-10 px-4 inline-flex items-center gap-1.5 rounded-full text-xs font-black text-white shadow-xs transition hover:brightness-105 active:scale-95 ${
                isEmergency ? 'bg-red-600' : 'bg-emerald-600'
              }`}
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span className="whitespace-nowrap">Publicar</span>
            </button>

            {/* Agrupación elegante de Utilidades (Accesibilidad Senior + Simulador de Red) */}
            <div
              className={`flex items-center rounded-full p-0.5 border ${
                isEmergency ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'
              }`}
            >
              {/* Accesibilidad Letra Grande */}
              <button
                type="button"
                onClick={toggleSeniorMode}
                title={isSeniorMode ? 'Letra grande activada' : 'Activar letra grande'}
                aria-label="Cambiar tamaño de texto"
                className={`h-9 w-9 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full transition-all active:scale-95 ${
                  isSeniorMode
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isEmergency
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white'
                }`}
              >
                <Type className="h-4 w-4" />
              </button>

              {/* Simulador Red */}
              <button
                type="button"
                onClick={() => setIsOnline(!isOnline)}
                title={isOnline ? 'Simular desconexión' : 'Simular conexión'}
                aria-label="Alternar estado de conexión"
                className={`h-9 w-9 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full transition-all active:scale-95 ${
                  !isOnline
                    ? 'bg-amber-500 text-white shadow-xs'
                    : isEmergency
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white'
                }`}
              >
                {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              </button>
            </div>

            {/* Botón S.O.S. */}
            <button
              type="button"
              aria-pressed={isEmergency}
              onClick={toggleEmergencyMode}
              title={isEmergency ? 'Salir del modo alerta' : 'Activar modo alerta vecinal'}
              className={`h-10 px-3.5 inline-flex items-center gap-1.5 rounded-full text-xs font-black transition active:scale-95 border-2 ${
                isEmergency
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md ring-2 ring-emerald-400/40 animate-pulse'
                  : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">{isEmergency ? 'Salir S.O.S.' : 'Modo S.O.S.'}</span>
            </button>

            {/* Chip de Perfil de Alto Contraste */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              aria-label="Abrir perfil y opciones"
              className={`h-10 flex items-center gap-2 pl-1.5 pr-3 rounded-full border-2 transition active:scale-95 ${
                isEmergency
                  ? 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-950 hover:bg-slate-50'
              }`}
            >
              <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-[11px] font-black text-white shadow-xs">
                {initials}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-white ${
                    isOnline ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>
              <span className="text-xs font-black max-w-[90px] truncate whitespace-nowrap">
                {currentUser.fullName.split(' ')[0]}
              </span>
            </button>
          </div>
        </div>

        {/* HEADER MÓVIL (Visible en celular, oculto en PC) */}
        <div className="flex md:hidden items-center justify-between gap-2 px-4 py-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
            aria-label="Ir a inicio de VecinOS"
          >
            <VecinosBrandLogo isEmergency={isEmergency} size="sm" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`text-[19px] font-black tracking-tight leading-none ${isEmergency ? 'text-white' : 'text-slate-950'}`}>
                  Vecin<span className={isEmergency ? 'text-red-400' : 'text-emerald-600'}>OS</span>
                </span>
                {!isOnline && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 border border-amber-300 px-1.5 py-0.2 text-[10px] font-bold text-amber-950">
                    <WifiOff className="h-2.5 w-2.5" aria-hidden="true" />
                    Offline
                  </span>
                )}
              </div>
              <p className={`flex items-center gap-1 truncate text-[11px] font-bold mt-0.5 ${isEmergency ? 'text-slate-300' : 'text-slate-600'}`}>
                <MapPin className="h-3 w-3 shrink-0 text-emerald-700" aria-hidden="true" />
                <span className="truncate">{currentUser.neighborhood}</span>
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              aria-pressed={isEmergency}
              onClick={toggleEmergencyMode}
              className={`inline-flex min-h-[44px] items-center gap-1 rounded-full px-3 py-2 text-xs font-black transition active:scale-95 border-2 ${
                isEmergency
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-red-50 text-red-700 border-red-500 hover:bg-red-100'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isEmergency ? 'Salir' : 'S.O.S.'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              aria-label="Abrir perfil y opciones"
              className="relative flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-xs font-black bg-slate-950 text-white shadow-sm"
            >
              {initials}
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                  isOnline ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Modal de Perfil & Ajustes */}
      {isProfileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Perfil y ajustes"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsProfileOpen(false)}
        >
          <div
            className="w-full max-w-[440px] rounded-t-[28px] sm:rounded-3xl bg-[#F8FAFC] p-5 pb-8 text-slate-900 shadow-2xl animate-sheet sm:animate-scale-in max-h-[90vh] overflow-y-auto no-scrollbar border border-slate-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1.5 w-9 rounded-full bg-slate-400 sm:hidden" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-black tracking-tight text-slate-950">Tu perfil vecinal</h2>
                <p className="text-xs font-medium text-slate-600">Configuración de cuenta y barrio</p>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                aria-label="Cerrar ajustes"
                className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-3 rounded-2xl bg-white p-4 shadow-xs border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-slate-950">{currentUser.fullName}</p>
                  <p className="text-xs font-semibold text-slate-600">
                    DNI {currentUser.dni} · {currentUser.neighborhood}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="inline-flex min-h-[44px] items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs font-black text-emerald-800 hover:bg-emerald-100 transition"
                >
                  <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Validar DNI</span>
                </button>
              </div>
            </div>

            <div className="mt-4">
              <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Cambiar cuenta activa (Simulación demo)
              </p>
              <div className="mt-1.5 divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-xs border border-slate-200">
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
                        <p className="text-sm font-black text-slate-950">{t.title}</p>
                        <p className="text-xs font-medium text-slate-600">{t.subtitle}</p>
                      </div>
                      {active && <Check className="h-4 w-4 text-emerald-700 stroke-[2.5]" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-xs border border-slate-200">
              <button
                type="button"
                onClick={() => setIsOnline(!isOnline)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-slate-900 hover:bg-slate-50 transition"
              >
                <span className="flex items-center gap-2.5">
                  {isOnline ? (
                    <Wifi className="h-4 w-4 text-emerald-700" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-amber-700" />
                  )}
                  <span>Conexión de red</span>
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-black ${
                    isOnline ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-950 border border-amber-300'
                  }`}
                >
                  {isOnline ? 'En línea' : 'Modo sin internet'}
                </span>
              </button>

              <button
                type="button"
                onClick={toggleSeniorMode}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-slate-900 hover:bg-slate-50 transition"
              >
                <span className="flex items-center gap-2.5">
                  <Type className="h-4 w-4 text-indigo-700" />
                  <span>Modo visual accesible (Letra grande)</span>
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-black ${
                    isSeniorMode ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
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
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-slate-900 hover:bg-slate-50 transition"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="h-4 w-4 text-slate-700" />
                  <span>Cómo funciona VecinOS</span>
                </span>
                <ChevronRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
