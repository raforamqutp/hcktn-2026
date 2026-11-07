import React from 'react';
import { RegisterDniModal } from './components/auth/RegisterDniModal';
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

const MainShell: React.FC = () => {
  const { activeTab, mode, isSeniorMode } = useApp();
  const isEmergency = mode === 'emergency';

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

      {/* Responsive Main Container: Full width on desktop, ergonomic on mobile */}
      <main
        id="main-content"
        tabIndex={-1}
        className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-24 md:pb-12 focus:outline-none transition-all ${
          isSeniorMode ? 'text-base leading-relaxed' : 'text-sm'
        }`}
      >
        <h1 className="visually-hidden">VecinOS — Tu barrio conectado</h1>

        {activeTab === 'map' ? (
          /* Expansive full-width Map view for desktop and mobile */
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
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
          /* Dual-Column Responsive Layout for desktop, single column for mobile */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Main Content Feed (takes 8 cols on large screens, or full width on mobile) */}
            <div className="lg:col-span-8 w-full min-w-0">
              {activeTab === 'services' && <ServicesView />}
              {activeTab === 'favors' && <FavorsView />}
              {activeTab === 'emergency' && <EmergencyView />}
            </div>

            {/* Desktop Companion Side Panel (takes 4 cols on large screens, hidden on mobile) */}
            <div className="hidden lg:block lg:col-span-4 w-full">
              <DesktopCompanionPanel />
            </div>
          </div>
        )}
      </main>

      {/* Mobile Floating Bottom Navigation (hidden on desktop) */}
      <BottomNav />

      {/* Global Modals & Dialogs (centered dialogs on desktop, bottom sheets on mobile) */}
      <QuickPublishSheet />
      <RegisterDniModal />
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
