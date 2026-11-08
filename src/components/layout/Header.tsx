import {
  AlertOctagon,
  AlertTriangle,
  ChevronRight,
  HeartHandshake,
  HelpCircle,
  LogOut,
  Map,
  MapPin,
  Phone,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Store,
  Type,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';

export const Header: React.FC = () => {
  const {
    mode,
    isOnline,
    setIsOnline,
    pendingSyncCount,
    currentUser,
    logout,
    setIsTutorialOpen,
    isSeniorMode,
    toggleSeniorMode,
    activeTab,
    setActiveTab,
    openPublishModal,
    emergencyItems,
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isEmergency = mode === 'emergency' || activeTab === 'emergency';

  // Contador de clics rápidos en el logo para acceso secreto a /config (para el host)
  const logoClickCountRef = useRef(0);
  const logoClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoSecretClick = () => {
    logoClickCountRef.current += 1;
    if (logoClickTimerRef.current) {
      clearTimeout(logoClickTimerRef.current);
    }
    logoClickTimerRef.current = setTimeout(() => {
      logoClickCountRef.current = 0;
    }, 1800);

    if (logoClickCountRef.current >= 4) {
      logoClickCountRef.current = 0;
      window.location.hash = '#/config';
    } else {
      setActiveTab('services');
    }
  };

  const initials = currentUser.fullName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const maskedDni =
    currentUser.dni.length === 8
      ? `•••• ${currentUser.dni.slice(-4)}`
      : currentUser.dni;

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
      label: 'Mapa del Barrio',
      icon: <Map className="h-4 w-4 stroke-[2.2]" aria-hidden="true" />,
    },
    {
      id: 'emergency',
      label: 'Emergencias S.O.S.',
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
        {/* BARRA DE NAVEGACIÓN ESCRITORIO */}
        <div className="hidden md:flex max-w-7xl mx-auto items-center justify-between gap-4 px-6 py-3.5">
          {/* Logo y Cuadra */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLogoSecretClick}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
              title="VecinOS Yanahuara"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl text-white font-black text-base shadow-sm transition group-hover:scale-105 ${
                  isEmergency ? 'bg-red-600' : 'bg-emerald-600'
                }`}
              >
                V
              </div>
              <div>
                <span className={`text-xl font-black tracking-tight leading-none ${isEmergency ? 'text-white' : 'text-slate-950'}`}>
                  VecinOS
                </span>
                <span className="block text-xs font-black text-emerald-700 leading-tight">
                  Tu barrio conectado
                </span>
              </div>
            </button>

            <div className="h-6 w-px bg-slate-300" />

            {/* Ubicación clara */}
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 bg-emerald-50 border-2 border-emerald-200/90 px-3 py-1 rounded-full">
              <MapPin className="h-3.5 w-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
              <span className="truncate max-w-[210px]">{currentUser.neighborhood}</span>
            </div>

            {/* Badge de Menor / Modo Protegido */}
            {!currentUser.isVerifiedAdult && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-xs font-black text-amber-950">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-700" />
                Menor · Modo Protegido
              </span>
            )}

            {!isOnline && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border-2 border-amber-300 px-3 py-0.5 text-xs font-black text-amber-950">
                <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
                Sin conexión{pendingSyncCount > 0 ? ` (${pendingSyncCount} pendientes)` : ''}
              </span>
            )}
          </div>

          {/* Tabs Centrales de Alta Legibilidad */}
          <nav
            aria-label="Navegación principal de escritorio"
            className={`flex items-center rounded-2xl p-1 border-2 transition-colors ${
              isEmergency
                ? 'bg-slate-900 border-slate-700'
                : 'bg-slate-100 border-slate-300'
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
                  className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition ${
                    active
                      ? isSos
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-white text-slate-950 shadow-xs ring-1 ring-slate-300'
                      : isEmergency
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                      : 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/70'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span className="ml-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Botones de Acción Derecha */}
          <div className="flex items-center gap-2.5">
            {/* Botón Publicar */}
            <button
              type="button"
              onClick={() => openPublishModal()}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black text-white shadow-xs transition hover:brightness-105 active:scale-95 ${
                isEmergency ? 'bg-red-600' : 'bg-emerald-600'
              }`}
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Publicar</span>
            </button>

            {/* Accesibilidad Letra Grande */}
            <button
              type="button"
              onClick={toggleSeniorMode}
              title={isSeniorMode ? 'Letra grande activada' : 'Activar letra grande'}
              aria-label="Cambiar tamaño de texto"
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition active:scale-95 ${
                isSeniorMode
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 font-bold'
              }`}
            >
              <Type className="h-4 w-4" />
            </button>

            {/* Ayuda Rápida */}
            <button
              type="button"
              onClick={() => setIsTutorialOpen(true)}
              title="Guía de uso vecinal"
              aria-label="Cómo usar VecinOS"
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition active:scale-95"
            >
              <HelpCircle className="h-4 w-4" />
            </button>

            {/* Simulador Red */}
            <button
              type="button"
              onClick={() => setIsOnline(!isOnline)}
              title={isOnline ? 'Simular modo sin internet' : 'Volver a estar en línea'}
              aria-label="Alternar estado de conexión"
              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition active:scale-95 ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-100 text-amber-950 border-amber-400 hover:bg-amber-200'
              }`}
            >
              {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            </button>

            {/* Chip de Perfil de Alto Contraste */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              aria-label="Abrir perfil de vecino"
              className="flex items-center gap-2 pl-2 pr-3.5 py-1 rounded-full border-2 border-slate-300 bg-white hover:bg-slate-100 transition active:scale-95"
            >
              <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-[11px] font-black text-white shadow-xs">
                {initials}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-white ${
                    isOnline ? 'bg-emerald-600' : 'bg-amber-500'
                  }`}
                />
              </span>
              <span className="text-xs font-black text-slate-950 max-w-[100px] truncate">
                {currentUser.fullName.split(' ')[0]}
              </span>
            </button>
          </div>
        </div>

        {/* HEADER MÓVIL */}
        <div className="flex md:hidden items-center justify-between gap-2 px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLogoSecretClick}
                className="text-[20px] font-black tracking-tight text-left focus:outline-none"
              >
                <span className={isEmergency ? 'text-white' : 'text-slate-950'}>VecinOS</span>
              </button>
              {!currentUser.isVerifiedAdult && (
                <span className="inline-flex items-center rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-bold text-amber-950">
                  Protegido
                </span>
              )}
              {!isOnline && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[11px] font-bold text-amber-950">
                  <WifiOff className="h-3 w-3" aria-hidden="true" />
                  Sin red
                </span>
              )}
            </div>
            <p className={`flex items-center gap-1 truncate text-xs font-bold ${isEmergency ? 'text-slate-300' : 'text-slate-700'}`}>
              <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-700" aria-hidden="true" />
              <span className="truncate">{currentUser.neighborhood}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('emergency')}
              className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-black transition active:scale-95 border-2 ${
                activeTab === 'emergency'
                  ? 'bg-red-600 text-white border-red-500 shadow-md'
                  : 'bg-red-50 text-red-700 border-red-500 hover:bg-red-100'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>S.O.S.</span>
            </button>

            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              aria-label="Abrir perfil de vecino"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-xs font-black bg-slate-950 text-white shadow-sm"
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

        {/* Franja de Información Offline Resiliente */}
        {!isOnline && (
          <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-bold flex items-center justify-center gap-2">
            <WifiOff className="h-3.5 w-3.5" />
            <span>
              Modo sin conexión activo — Tus publicaciones se guardan en tu celular y se enviarán automáticamente al volver la señal.
            </span>
          </div>
        )}
      </header>

      {/* Modal de Perfil de Vecino (100% Real, Sin controles de desarrollador) */}
      {isProfileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Perfil de vecino"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsProfileOpen(false)}
        >
          <div
            className="w-full max-w-[420px] rounded-t-[28px] sm:rounded-3xl bg-[#F8FAFC] p-5 pb-8 text-slate-900 shadow-2xl animate-sheet sm:animate-scale-in max-h-[90vh] overflow-y-auto no-scrollbar border border-slate-300 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-2 h-1.5 w-9 rounded-full bg-slate-400 sm:hidden" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-black tracking-tight text-slate-950">Tu perfil vecinal</h2>
                <p className="text-xs font-medium text-slate-600">Identidad confirmada en el padrón</p>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                aria-label="Cerrar perfil"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Tarjeta de Identidad Vecinal Protegida */}
            <div className="rounded-2xl bg-white p-4 shadow-xs border border-slate-200 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-black text-slate-950 text-base leading-snug">
                    {currentUser.fullName}
                  </p>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">
                    {currentUser.neighborhood}
                  </p>
                </div>
                {currentUser.isVerifiedAdult ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 text-[11px] font-black shrink-0">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                    {currentUser.accountTier === 'referente'
                      ? 'Vecino Referente'
                      : currentUser.accountTier === 'activo'
                      ? 'Vecino Verificado'
                      : 'Vecino del Barrio'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 px-2.5 py-0.5 text-[11px] font-black shrink-0">
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-700" />
                    Modo Protegido
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">
                    DNI Protegido
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {maskedDni}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">
                    Antigüedad
                  </span>
                  <span className="font-bold text-slate-900">
                    {currentUser.seniorityMonths > 0
                      ? `${currentUser.seniorityMonths} meses en el barrio`
                      : 'Vecino recién unido'}
                  </span>
                </div>
              </div>

              {currentUser.phone && (
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 pt-1">
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Celular registrado: {currentUser.phone}</span>
                </div>
              )}
            </div>

            {/* Ajustes de Accesibilidad y Guía */}
            <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-xs border border-slate-200">
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
                  <span>Cómo funciona VecinOS (Guía)</span>
                </span>
                <ChevronRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
              </button>

              {/* Botón Real de Cerrar Sesión */}
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-black text-rose-700 hover:bg-rose-50 transition"
              >
                <span className="flex items-center gap-2.5">
                  <LogOut className="h-4 w-4 text-rose-600" />
                  <span>Cerrar sesión / Salir</span>
                </span>
                <ChevronRight className="h-4 w-4 text-rose-400" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
