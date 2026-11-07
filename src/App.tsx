import React from 'react';
import { RegisterDniModal } from './components/auth/RegisterDniModal';
import { BottomNav } from './components/layout/BottomNav';
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
      className={`min-h-screen pb-24 transition-colors duration-200 ${
        isSeniorMode ? 'text-lg leading-relaxed' : 'text-sm'
      } ${isEmergency ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}
    >
      <a
        href="#main-content"
        className="visually-hidden rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        Saltar al contenido principal
      </a>

      <Header />

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto max-w-7xl px-4 pt-4 focus:outline-none"
      >
        <h1 className="visually-hidden">
          VecinOS: Plataforma de Economía Local, Favores Solidarios y Soporte en Emergencias
        </h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {activeTab === 'services' && <ServicesView />}
            {activeTab === 'favors' && <FavorsView />}
            {activeTab === 'emergency' && <EmergencyView />}
            {activeTab === 'map' && (
              <div className="space-y-3">
                <h2 className="text-xl font-extrabold">Mapa Geolocalizado de tu Barrio</h2>
                <CommunityMap />
              </div>
            )}
          </div>

          <aside
            aria-label="Mapa en tiempo real del barrio"
            className="hidden lg:col-span-5 lg:block"
          >
            <div className="sticky top-20 space-y-3">
              <CommunityMap />
            </div>
          </aside>
        </div>
      </main>

      <BottomNav />
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
