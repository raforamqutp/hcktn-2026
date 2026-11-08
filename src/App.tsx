import React, { useEffect, useState } from 'react';
import { LoginOnboardingView } from './components/auth/LoginOnboardingView';
import { HostConfigView } from './components/config/HostConfigView';
import { BottomNav } from './components/layout/BottomNav';
import { DesktopCompanionPanel } from './components/layout/DesktopCompanionPanel';
import { Header } from './components/layout/Header';
import { CommunityMap } from './components/map/CommunityMap';
import { QuickPublishSheet } from './components/publish/QuickPublishSheet';
import { QuickGuideModal } from './components/tutorial/QuickGuideModal';
import { AppProvider, useApp } from './context/AppContext';
import { EmergencyView } from './features/emergency/EmergencyView';
import { FavorsView } from './features/favors/FavorsView';
import { ServicesView } from './features/services/ServicesView';

const checkIsConfigRoute = (): boolean => {
  if (typeof window === 'undefined') return false;
  const p = window.location.pathname.toLowerCase();
  const h = window.location.hash.toLowerCase();
  const s = window.location.search.toLowerCase();
  return (
    p === '/config' ||
    p.startsWith('/config/') ||
    h === '#/config' ||
    h.startsWith('#/config') ||
    s.includes('config=true')
  );
};

const MainShell: React.FC = () => {
  const { activeTab, mode, isSeniorMode, isOnboardingActive, setIsOnboardingActive } = useApp();
  const isEmergency = mode === 'emergency' || activeTab === 'emergency';

  const [isConfigView, setIsConfigView] = useState<boolean>(checkIsConfigRoute);

  // Escuchar cambios de URL, popstate y hashchange
  useEffect(() => {
    const handleUrlChange = () => {
      setIsConfigView(checkIsConfigRoute());
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    // Atajo de teclado de conveniencia para la demo: Ctrl + Alt + C abre el host config
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        setIsConfigView((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleExitConfig = () => {
    setIsConfigView(false);
    if (window.location.hash.includes('config')) {
      window.location.hash = '';
    }
    if (window.location.pathname.includes('config')) {
      window.history.pushState(null, '', '/');
    }
  };

  // 1. Endpoint Oculto para Host / Pruebas de la Demo (/config)
  if (isConfigView) {
    return <HostConfigView onExit={handleExitConfig} />;
  }

  // 2. Pantalla de Entrada en Frío / Registro Inicial (DNI + Contraseña)
  if (isOnboardingActive) {
    return <LoginOnboardingView onSuccess={() => setIsOnboardingActive(false)} />;
  }

  // 3. Aplicación Principal VecinOS
  return (
    <div
      className={`min-h-dvh transition-colors duration-200 ${
        isEmergency ? 'bg-[#050811] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      <a
        href="#main-content"
        className="visually-hidden rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        Ir al contenido
      </a>

      {/* Main Responsive Header */}
      <Header />

      {/* Responsive Main Container */}
      <main
        id="main-content"
        tabIndex={-1}
        className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-24 md:pb-12 focus:outline-none transition-all ${
          isSeniorMode ? 'text-base leading-relaxed' : 'text-sm'
        }`}
      >
        <h1 className="visually-hidden">VecinOS — Tu barrio conectado</h1>

        {activeTab === 'map' ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className={`text-xl md:text-2xl font-black tracking-tight ${isEmergency ? 'text-white' : 'text-slate-950'}`}>
                  Mapa del Barrio en Tiempo Real
                </h2>
                <p className="text-xs md:text-sm text-slate-500">
                  Explora servicios vecinales, favores activos y alertas a menos de 10 min a pie.
                </p>
              </div>
            </div>
            <CommunityMap heightClassName="h-[480px] md:h-[640px] lg:h-[720px]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Feed Principal */}
            <div className="lg:col-span-8 w-full min-w-0">
              {activeTab === 'services' && <ServicesView />}
              {activeTab === 'favors' && <FavorsView />}
              {activeTab === 'emergency' && <EmergencyView />}
            </div>

            {/* Panel Lateral de Acompañamiento en Escritorio */}
            <div className="hidden lg:block lg:col-span-4 w-full">
              <DesktopCompanionPanel />
            </div>
          </div>
        )}
      </main>

      {/* Navegación Móvil Inferior */}
      <BottomNav />

      {/* Modales Globales */}
      <QuickPublishSheet />
      <QuickGuideModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainShell />
    </AppProvider>
  );
}

export default App;
