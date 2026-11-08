import React, { useRef, useState } from 'react';
import {
  AlertOctagon,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  HeartHandshake,
  HelpCircle,
  LogOut,
  Map,
  MapPin,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Store,
  Type,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';
import { EmergencyHotlinePanel } from '../common/EmergencyHotlinePanel';
import { CommunityMap } from '../map/CommunityMap';
import { ServicesView } from '../../features/services/ServicesView';
import { FavorsView } from '../../features/favors/FavorsView';
import { EmergencyView } from '../../features/emergency/EmergencyView';

export const MobileLayout: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    mode,
    currentUser,
    isSeniorMode,
    toggleSeniorMode,
    isOnline,
    setIsOnline,
    pendingSyncCount,
    logout,
    setIsTutorialOpen,
    openPublishModal,
    emergencyItems,
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showHotlinesMobile, setShowHotlinesMobile] = useState(false);
  const isEmergency = mode === 'emergency' || activeTab === 'emergency';

  // 4 clics en el logo para ir al panel host secreto (/config)
  const logoClickCountRef = useRef(0);
  const logoClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    logoClickCountRef.current += 1;
    if (logoClickTimerRef.current) clearTimeout(logoClickTimerRef.current);
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

  const activeEmergenciesCount = emergencyItems.filter((i) => i.status === 'activo').length;

  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'services', label: 'Oficios', icon: Store },
    { id: 'favors', label: 'Favores', icon: HeartHandshake },
    { id: 'emergency', label: 'S.O.S.', icon: AlertOctagon, badge: activeEmergenciesCount },
    { id: 'map', label: 'Mapa', icon: Map },
  ];

  return (
    <div
      className={`min-h-[100dvh] flex flex-col transition-colors duration-200 ${
        isEmergency ? 'bg-[#050811] text-slate-100' : 'bg-[#F4F6F8] text-slate-900'
      }`}
      style={{ touchAction: 'manipulation' }}
    >
      {/* 1. Header Nativo Móvil */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${
          isEmergency
            ? 'bg-[#090d16]/95 border-slate-800'
            : 'bg-white/95 border-slate-200/90 shadow-2xs'
        }`}
      >
        <div className="px-4 py-2.5 flex items-center justify-between gap-2">
          {/* Logo y Ubicación */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleLogoClick}
              className="flex items-center gap-2 text-left active:scale-95 transition"
              title="VecinOS Yanahuara"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-lg shadow-xs">
                V
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className={`font-black text-base tracking-tight ${isEmergency ? 'text-white' : 'text-slate-950'}`}>
                    VecinOS
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-sm">
                    Yanahuara
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span className={`text-[10px] font-semibold ${isEmergency ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isOnline ? 'Red Vecinal Activa' : `Offline (${pendingSyncCount} pendientes)`}
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Acciones de la barra superior */}
          <div className="flex items-center gap-1.5">
            {/* Toggle Modo Senior */}
            <button
              type="button"
              onClick={toggleSeniorMode}
              className={`flex h-8 px-2 items-center gap-1 rounded-xl text-xs font-bold border transition active:scale-95 ${
                isSeniorMode
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : isEmergency
                  ? 'bg-slate-800 border-slate-700 text-slate-200'
                  : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}
              title="Modo Texto Grande para Adultos Mayores"
            >
              <Type className="h-3.5 w-3.5" />
              <span className="text-[10px] font-black">{isSeniorMode ? 'Fácil' : 'Normal'}</span>
            </button>

            {/* Ayuda / Tutorial */}
            <button
              type="button"
              onClick={() => setIsTutorialOpen(true)}
              className={`flex h-8 w-8 items-center justify-center rounded-xl active:scale-95 transition border ${
                isEmergency
                  ? 'bg-slate-800 border-slate-700 text-slate-200'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title="Guía rápida"
            >
              <HelpCircle className="h-4 w-4" />
            </button>

            {/* Perfil del Vecino */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-700 text-white font-black text-xs shadow-xs active:scale-95 transition border border-emerald-600"
              title="Perfil del Vecino"
            >
              {initials}
            </button>
          </div>
        </div>

        {/* 2. iOS Segmented Control */}
        <div className="px-4 pb-2.5 pt-0.5">
          <div
            role="tablist"
            className={`grid grid-cols-4 gap-1 p-1 rounded-2xl border ${
              isEmergency
                ? 'bg-slate-900 border-slate-800'
                : 'bg-slate-200/80 border-slate-300/80'
            }`}
          >
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    active
                      ? isEmergency
                        ? 'bg-slate-800 text-white shadow-xs font-black'
                        : 'bg-white text-slate-950 shadow-xs font-black ring-1 ring-slate-950/5'
                      : isEmergency
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${active ? (tab.id === 'emergency' ? 'text-red-600' : 'text-emerald-700') : 'text-slate-500'}`} />
                  <span className="truncate">{tab.label}</span>
                  {Boolean(tab.badge && tab.badge > 0) && (
                    <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-white text-[9px] font-black">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 3. Contenido Principal */}
      <main className="flex-1 px-4 pt-3 pb-32">
        {/* Auxilio Rápido Móvil (En S.O.S. siempre abierto; en otras pestañas barra colapsable para no tapar el feed) */}
        {activeTab === 'emergency' ? (
          <div className="mb-4">
            <EmergencyHotlinePanel
              columns={2}
              compact={true}
              title="Auxilio Rápido (Yanahuara)"
              subtitle="Mantén presionado 1s sobre cualquiera para llamar directo."
            />
          </div>
        ) : (
          <div className="mb-3.5">
            <div
              className={`rounded-2xl border transition-all ${
                isEmergency
                  ? 'bg-slate-900 border-slate-800 text-slate-200'
                  : 'bg-white border-slate-200/90 text-slate-900 shadow-2xs'
              }`}
            >
              <button
                type="button"
                onClick={() => setShowHotlinesMobile((prev) => !prev)}
                className="w-full flex items-center justify-between px-3.5 py-2 text-xs transition hover:opacity-90"
                aria-expanded={showHotlinesMobile}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-red-100 text-red-600">
                    <ShieldAlert className="h-3 w-3" />
                  </span>
                  <span className="font-bold truncate text-[11px] sm:text-xs">
                    Auxilio Rápido: <span className="font-normal text-slate-500">Serenazgo 270000 · Bomberos 116</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 text-[10px] font-bold text-red-600">
                  <span>{showHotlinesMobile ? 'Ocultar' : 'Mantén 1s'}</span>
                  {showHotlinesMobile ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </button>

              {showHotlinesMobile && (
                <div className="p-3 pt-0 border-t border-slate-100">
                  <div className="pt-2">
                    <EmergencyHotlinePanel
                      columns={2}
                      compact={true}
                      title="Llamada Inmediata (Yanahuara)"
                      subtitle="Mantén presionado 1s sobre cualquiera para llamar directo."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vista activa */}
        <div className={isSeniorMode ? 'text-base' : 'text-sm'}>
          {activeTab === 'services' && <ServicesView />}
          {activeTab === 'favors' && <FavorsView />}
          {activeTab === 'emergency' && <EmergencyView />}
          {activeTab === 'map' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-black tracking-tight ${isEmergency ? 'text-white' : 'text-slate-950'}`}>
                  Mapa Comunitario
                </h2>
                <span className={`text-xs font-semibold ${isEmergency ? 'text-slate-400' : 'text-slate-500'}`}>
                  Arequipa • Radio 1 km
                </span>
              </div>
              <CommunityMap heightClassName="h-[calc(100dvh-320px)] min-h-[400px]" />
            </div>
          )}
        </div>
      </main>

      {/* 4. Dock Inferior Flotante de Cristal (Apple Style Floating Dock) */}
      <nav
        aria-label="Navegación Móvil Principal"
        className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-2 pointer-events-none"
      >
        <div className="max-w-md mx-auto pointer-events-auto">
          <div
            className={`flex items-center justify-between gap-1 px-3 py-2 rounded-3xl backdrop-blur-2xl border shadow-xl ${
              isEmergency
                ? 'bg-slate-900/95 border-slate-800 shadow-red-950/20'
                : 'bg-white/95 border-slate-200/90 shadow-slate-900/10'
            }`}
          >
            {/* Botón Oficios */}
            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`flex-1 flex flex-col items-center py-1 rounded-2xl transition active:scale-90 ${
                activeTab === 'services'
                  ? 'text-emerald-700 font-black'
                  : isEmergency
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              <Store className="h-5 w-5" />
              <span className="text-[10px] mt-0.5">Oficios</span>
            </button>

            {/* Botón Favores */}
            <button
              type="button"
              onClick={() => setActiveTab('favors')}
              className={`flex-1 flex flex-col items-center py-1 rounded-2xl transition active:scale-90 ${
                activeTab === 'favors'
                  ? 'text-emerald-700 font-black'
                  : isEmergency
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              <HeartHandshake className="h-5 w-5" />
              <span className="text-[10px] mt-0.5">Favores</span>
            </button>

            {/* Botón Central: Publicar */}
            <button
              type="button"
              onClick={() => openPublishModal()}
              aria-label="Publicar necesidad o servicio en Yanahuara"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-90 text-white shadow-lg shadow-emerald-600/30 transition -translate-y-2 border-2 border-white"
            >
              <Plus className="h-6 w-6 stroke-[3]" />
            </button>

            {/* Botón S.O.S. */}
            <button
              type="button"
              onClick={() => setActiveTab('emergency')}
              className={`flex-1 flex flex-col items-center py-1 rounded-2xl transition active:scale-90 ${
                activeTab === 'emergency'
                  ? 'text-red-600 font-black'
                  : isEmergency
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              <div className="relative">
                <AlertOctagon className="h-5 w-5" />
                {activeEmergenciesCount > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-white text-[8px] font-black">
                    {activeEmergenciesCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">S.O.S.</span>
            </button>

            {/* Botón Mapa */}
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className={`flex-1 flex flex-col items-center py-1 rounded-2xl transition active:scale-90 ${
                activeTab === 'map'
                  ? 'text-emerald-700 font-black'
                  : isEmergency
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              <MapPin className="h-5 w-5" />
              <span className="text-[10px] mt-0.5">Mapa</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 5. Modal de Perfil Limpio del Vecino */}
      {isProfileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in"
        >
          <div
            className={`w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border animate-sheet max-h-[90vh] overflow-y-auto ${
              isEmergency
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-950'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-sm">
                  {initials}
                </div>
                <div>
                  <h3 className={`text-base font-black leading-tight ${isEmergency ? 'text-white' : 'text-slate-950'}`}>
                    {currentUser.fullName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    DNI: {maskedDni}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-950 block">
                    Identidad Verificada
                  </span>
                  <span className="text-emerald-900/80 text-[11px] leading-relaxed">
                    Vecino registrado en Yanahuara con DNI validado. Nivel: {currentUser.accountTier} • Antigüedad: {currentUser.seniorityMonths} meses • Peso reputacional: {currentUser.reputationWeight}x.
                  </span>
                </div>
              </div>

              {/* Botón para abrir panel de configuración si es host */}
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  window.location.hash = '#/config';
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border transition ${
                  isEmergency
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <span className="font-bold">
                  Ajustes y Opciones del Demo
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>

              {/* Estado de conectividad */}
              <div className={`flex items-center justify-between p-3 rounded-2xl border ${
                isEmergency ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  {isOnline ? (
                    <Wifi className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-amber-600" />
                  )}
                  <span className={`font-semibold ${isEmergency ? 'text-slate-200' : 'text-slate-700'}`}>
                    Conexión Vecinal
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOnline(!isOnline)}
                  className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                    isOnline
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {isOnline ? 'Online' : 'Simular Offline'}
                </button>
              </div>

              {/* Cerrar Sesión */}
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50 text-red-700 border border-red-200 font-bold active:scale-95 transition mt-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
