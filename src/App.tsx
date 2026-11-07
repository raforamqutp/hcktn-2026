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
      className={`min-h-dvh transition-colors duration-200 ${
        isEmergency ? 'bg-[#050811]' : 'bg-slate-200/70'
      }`}
    >
      <div
        className={`mx-auto min-h-dvh max-w-[430px] pb-28 shadow-2xl transition-colors duration-200 ${
          isSeniorMode ? 'text-base leading-relaxed' : 'text-sm'
        } ${
          isEmergency
            ? 'dark-surface bg-[#090d16] text-slate-100 ring-1 ring-slate-800'
            : 'bg-[#F2F2F7] text-slate-900 ring-1 ring-slate-300/60'
        }`}
      >
        <a
          href="#main-content"
          className="visually-hidden rounded-lg bg-emerald-600 px-4 py-2 font-bold text-white focus:fixed focus:left-4 focus:top-4 focus:z-50"
        >
          Ir al contenido
        </a>

        <Header />

        <main id="main-content" tabIndex={-1} className="px-4 pt-3 focus:outline-none">
          <h1 className="visually-hidden">VecinOS — Tu barrio conectado</h1>

          {activeTab === 'services' && <ServicesView />}
          {activeTab === 'favors' && <FavorsView />}
          {activeTab === 'emergency' && <EmergencyView />}
          {activeTab === 'map' && <CommunityMap />}
        </main>

        <BottomNav />
        <QuickPublishSheet />
        <RegisterDniModal />
        <QuickGuideModal />
      </div>
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
