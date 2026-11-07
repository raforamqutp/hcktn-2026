import { AlertOctagon, HeartHandshake, Map, PlusCircle, Wrench } from 'lucide-react';
import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, mode, openPublishModal, emergencyItems } = useApp();
  const isEmergency = mode === 'emergency';

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'services',
      label: 'Servicios y Trueque',
      icon: <Wrench className="h-5 w-5" aria-hidden="true" />,
    },
    {
      id: 'favors',
      label: 'Favores y Pool',
      icon: <HeartHandshake className="h-5 w-5" aria-hidden="true" />,
    },
    {
      id: 'map',
      label: 'Mapa Vecinal',
      icon: <Map className="h-5 w-5" aria-hidden="true" />,
    },
    {
      id: 'emergency',
      label: 'Emergencia S.O.S.',
      icon: <AlertOctagon className="h-5 w-5" aria-hidden="true" />,
      badge: emergencyItems.filter((i) => i.status === 'activo').length,
    },
  ];

  return (
    <nav
      aria-label="Navegación principal"
      className={`fixed bottom-0 left-0 right-0 z-30 border-t px-2 py-1.5 transition-colors ${
        isEmergency
          ? 'dark-surface bg-slate-950 border-red-500/40 text-slate-200'
          : 'bg-white/95 backdrop-blur border-slate-200 text-slate-700'
      }`}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-around gap-1">
        {navItems.slice(0, 2).map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-[48px] flex-1 flex-col items-center justify-center rounded-xl px-2 py-1 text-xs font-semibold transition ${
                active
                  ? isEmergency
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-emerald-50 text-emerald-700'
                  : 'opacity-75 hover:opacity-100'
              }`}
            >
              {item.icon}
              <span className="mt-0.5 truncate">{item.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => openPublishModal()}
          className={`flex min-h-[52px] items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-extrabold text-white shadow-md transition active:scale-95 ${
            isEmergency ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          <PlusCircle className="h-5 w-5" aria-hidden="true" />
          <span>Publicar (3 clics)</span>
        </button>

        {navItems.slice(2).map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              aria-current={active ? 'page' : undefined}
              className={`relative flex min-h-[48px] flex-1 flex-col items-center justify-center rounded-xl px-2 py-1 text-xs font-semibold transition ${
                active
                  ? item.id === 'emergency' || isEmergency
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-emerald-50 text-emerald-700'
                  : 'opacity-75 hover:opacity-100'
              }`}
            >
              {item.icon}
              <span className="mt-0.5 truncate">{item.label}</span>
              {item.badge ? (
                <span className="absolute right-3 top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
