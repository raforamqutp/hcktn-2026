import React, { useRef, useState } from 'react';
import {
  AlertOctagon,
  ArrowRight,
  ChevronRight,
  HeartHandshake,
  HelpCircle,
  LogOut,
  Map,
  MapPin,
  Plus,
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
import { VecinosBrandLogo } from '../common/VecinosBrandLogo';
import { CommunityMap } from '../map/CommunityMap';
import { ServicesView } from '../../features/services/ServicesView';
import { FavorsView } from '../../features/favors/FavorsView';
import { EmergencyView } from '../../features/emergency/EmergencyView';

export const DesktopCraftLayout: React.FC = () => {
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
    favors,
    services,
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
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

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { id: 'services', label: 'Oficios y Servicios', icon: Store, count: services.length },
    { id: 'favors', label: 'Cadena de Favores', icon: HeartHandshake, count: favors.filter((f) => f.status === 'disponible').length },
    { id: 'emergency', label: 'Alertas Barriales S.O.S.', icon: AlertOctagon, count: activeEmergenciesCount },
    { id: 'map', label: 'Mapa en Tiempo Real', icon: Map },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isEmergency ? 'bg-[#050811] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* 1. Header de Escritorio de Alta Fidelidad */}
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-xl transition-colors ${
          isEmergency
            ? 'bg-[#090d16]/95 border-slate-800'
            : 'bg-white/95 border-slate-200/90 shadow-2xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo y Distrito */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLogoClick}
              className="flex items-center gap-3 text-left group focus:outline-none"
              title="VecinOS — Yanahuara, Arequipa (Clic para inicio)"
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
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`block text-[11px] font-black tracking-wide leading-tight ${isEmergency ? 'text-slate-300' : 'text-emerald-800'}`}>
                    Tu barrio conectado
                  </span>
                  {!isOnline && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded-full leading-none">
                      P2P ({pendingSyncCount})
                    </span>
                  )}
                </div>
              </div>
            </button>

            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200/90 text-xs font-bold text-emerald-900">
              <MapPin className="h-3.5 w-3.5 text-emerald-700" />
              <span>Urb. Los Perales / Yanahuara</span>
            </div>
          </div>

          {/* Navegación Rápida Central */}
          <nav
            aria-label="Navegación de secciones"
            className={`hidden md:flex items-center gap-1 p-1 rounded-2xl border ${
              isEmergency
                ? 'bg-slate-900 border-slate-800'
                : 'bg-slate-200/80 border-slate-300/80'
            }`}
          >
            {navItems.map((item) => {
              const active = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? isEmergency
                        ? 'bg-slate-800 text-white shadow-xs font-black'
                        : 'bg-white text-slate-950 shadow-xs font-black ring-1 ring-slate-950/5'
                      : isEmergency
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? (item.id === 'emergency' ? 'text-red-600' : 'text-emerald-700') : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {Boolean(item.count && item.count > 0) && (
                    <span
                      className={`flex h-4 min-w-4 px-1 items-center justify-center rounded-full text-[10px] font-black ${
                        item.id === 'emergency'
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-slate-300 text-slate-800'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Controles del Lado Derecho */}
          <div className="flex items-center gap-3">
            {/* Botón Publicar */}
            <button
              type="button"
              onClick={() => openPublishModal()}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition active:scale-95"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Publicar en el Barrio</span>
            </button>

            {/* Toggle Modo Senior - Botón 'T' como Anthony */}
            <button
              type="button"
              onClick={toggleSeniorMode}
              className={`h-9 w-9 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl text-sm font-black border transition-all active:scale-95 ${
                isSeniorMode
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                  : isEmergency
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
              }`}
              title={isSeniorMode ? 'Letra grande activada' : 'Activar letra grande'}
              aria-label="Cambiar tamaño de texto"
            >
              <Type className="h-4 w-4" />
            </button>

            {/* Tutorial */}
            <button
              type="button"
              onClick={() => setIsTutorialOpen(true)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition active:scale-95 ${
                isEmergency
                  ? 'bg-slate-800 border-slate-700 text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Guía rápida"
            >
              <HelpCircle className="h-4 w-4" />
            </button>

            {/* Perfil */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className={`flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl border transition active:scale-95 ${
                isEmergency
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-white font-black text-xs">
                {initials}
              </div>
              <div className="text-left hidden lg:block">
                <span className={`block text-xs font-bold truncate max-w-[110px] ${isEmergency ? 'text-white' : 'text-slate-950'}`}>
                  {currentUser.fullName.split(' ')[0]}
                </span>
                <span className="block text-[10px] text-slate-500 font-medium">
                  {maskedDni}
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Workspace Multi-Columna Asimétrico de Escritorio */}
      <div className="max-w-7xl mx-auto px-6 py-6 w-full flex-1">
        {activeTab === 'map' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-2xl font-black tracking-tight ${isEmergency ? 'text-white' : 'text-slate-950'}`}>
                  Mapa Comunitario de Yanahuara
                </h1>
                <p className={`text-sm ${isEmergency ? 'text-slate-400' : 'text-slate-500'}`}>
                  Visualiza oficios, favores y alertas geolocalizadas a menos de 10 minutos a pie.
                </p>
              </div>
            </div>
            <CommunityMap heightClassName="h-[calc(100vh-220px)] min-h-[500px]" />
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* Feed Principal Central (Col-span 8) */}
            <main className="col-span-12 lg:col-span-8 space-y-6">
              {activeTab === 'services' && <ServicesView />}
              {activeTab === 'favors' && <FavorsView />}
              {activeTab === 'emergency' && <EmergencyView />}
            </main>

            {/* Panel Lateral de Acompañamiento y Seguridad (Col-span 4) */}
            <aside aria-label="Información complementaria del barrio" className="hidden lg:flex lg:col-span-4 flex-col gap-5 sticky top-24">
              {/* Widget de Teléfonos de Auxilio Rápido en formato columna limpia */}
              <EmergencyHotlinePanel
                columns={1}
                compact={true}
                title="Teléfonos de Auxilio Rápido"
                subtitle="Centrales oficiales de Yanahuara y Arequipa disponibles 24/7."
              />

              {/* Mini Preview de Mapa Interactivo */}
              <div
                className={`rounded-3xl border p-4 shadow-xs space-y-3 ${
                  isEmergency
                    ? 'bg-slate-900 border-slate-800 text-slate-100'
                    : 'bg-white border-slate-200/90 text-slate-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-lg ${
                        isEmergency ? 'bg-emerald-950 text-emerald-400' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <MapPin className="h-3.5 w-3.5" />
                    </span>
                    <h3 className={`text-sm font-black tracking-tight ${isEmergency ? 'text-white' : 'text-slate-950'}`}>
                      Barrio Yanahuara en Vivo
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('map')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                  >
                    <span>Ver mapa completo</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner">
                  <CommunityMap heightClassName="h-44" />
                </div>
                <p className={`text-[11px] font-medium ${isEmergency ? 'text-slate-400' : 'text-slate-500'}`}>
                  {services.length} servicios y {favors.length} favores activos a tu alrededor.
                </p>
              </div>

              {/* Tarjeta de Confianza Vecinal y Resiliencia */}
              <div
                className={`rounded-3xl border p-4 shadow-xs space-y-2.5 ${
                  isEmergency
                    ? 'bg-slate-900 border-slate-800 text-slate-100'
                    : 'bg-white border-slate-200/90 text-slate-950'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  <h4 className={`text-xs font-black uppercase tracking-wider ${isEmergency ? 'text-white' : 'text-slate-950'}`}>
                    Identidad y Seguridad RENIEC
                  </h4>
                </div>
                <p className={`text-xs leading-relaxed ${isEmergency ? 'text-slate-400' : 'text-slate-600'}`}>
                  Cada vecino en la plataforma ha validado su DNI y es mayor de edad. Los datos sensibles permanecen protegidos y encriptados localmente.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 font-semibold">
                  <span>Yanahuara Seguro</span>
                  <span className="text-emerald-700 font-bold">100% Cero Comisiones</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* 3. Modal de Perfil de Vecino */}
      {isProfileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fade-in"
        >
          <div
            className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border animate-scale-in ${
              isEmergency
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-950'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-base shadow-xs">
                  {initials}
                </div>
                <div>
                  <h3 className={`text-base font-black ${isEmergency ? 'text-white' : 'text-slate-950'}`}>
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
                    Vecino Verificado de Yanahuara
                  </span>
                  <span className="text-emerald-900/80 text-[11px] leading-relaxed">
                    Nivel vecinal: {currentUser.accountTier} • Antigüedad: {currentUser.seniorityMonths} meses • Peso reputacional: {currentUser.reputationWeight}x.
                  </span>
                </div>
              </div>

              {/* Botón para abrir ajustes del demo / host config */}
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

              {/* Simular estado de red */}
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
                    Conexión Local
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
                  {isOnline ? 'Online' : 'Offline'}
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
