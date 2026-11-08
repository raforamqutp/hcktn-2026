import { AlertOctagon, HeartHandshake, Map, Plus, Store } from 'lucide-react';
import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, mode, openPublishModal, emergencyItems } = useApp();
  const isEmergency = mode === 'emergency';

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'services',
      label: 'Servicios',
      icon: <Store className="h-5 w-5" aria-hidden="true" />,
    },
    {
      id: 'favors',
      label: 'Favores',
      icon: <HeartHandshake className="h-5 w-5" aria-hidden="true" />,
    },
    {
      id: 'map',
      label: 'Mapa',
      icon: <Map className="h-5 w-5" aria-hidden="true" />,
    },
    {
      id: 'emergency',
      label: 'S.O.S.',
      icon: <AlertOctagon className="h-5 w-5" aria-hidden="true" />,
      badge: emergencyItems.filter((i) => i.status === 'activo').length,
    },
  ];

  return (
    <div className="md:hidden pointer-events-none fixed bottom-0 left-0 right-0 z-30 mx-auto max-w-[430px] px-4 pb-4">
      <div className="flex items-center gap-2.5">
        <nav
          aria-label="Navegación principal móvil"
          className={`pointer-events-auto flex flex-1 items-center justify-around rounded-full border p-1.5 shadow-lg backdrop-blur-xl transition-colors ${
            isEmergency
              ? 'dark-surface bg-[#111726]/90 border-slate-800 text-slate-300'
              : 'bg-white/95 border-slate-300 text-slate-700 shadow-md'
          }`}
        >
          {navItems.map((item) => {
            const active = activeTab === item.id;
            const isSosTab = item.id === 'emergency';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`relative flex min-h-[46px] flex-1 flex-col items-center justify-center rounded-full py-1 text-[11px] font-semibold transition active:scale-95 ${
                  active
                    ? isSosTab || isEmergency
                      ? 'bg-red-500/15 text-red-500'
                      : 'bg-emerald-500/12 text-emerald-700'
                    : 'text-slate-700 hover:text-slate-950 font-bold'
                }`}
              >
                {item.icon}
                <span className="mt-0.5 leading-none">{item.label}</span>
                {item.badge ? (
                  <span className="absolute right-3.5 top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => openPublishModal()}
          aria-label="Crear publicación"
          className={`pointer-events-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-lg transition active:scale-95 ${
            isEmergency ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'
          }`}
        >
          <Plus className="h-6 w-6 stroke-[2.5]" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
