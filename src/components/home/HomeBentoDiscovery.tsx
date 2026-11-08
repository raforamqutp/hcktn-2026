import React, { useMemo } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FavorCategory, ServiceCategory } from '../../types';

interface BentoCategory {
  id: string;
  badgeLetter: string;
  badgeBg: string;
  badgeText: string;
  title: string;
  subtitle: string;
  tag: string;
  cardBg: string;
  cardBorder: string;
  action: () => void;
}

interface HomeBentoDiscoveryProps {
  onSelectCategory?: (category: ServiceCategory | 'all') => void;
  onSelectFavorCategory?: (category: FavorCategory | 'all') => void;
  onOpenSos?: () => void;
}

export const HomeBentoDiscovery: React.FC<HomeBentoDiscoveryProps> = ({
  onSelectCategory,
  onSelectFavorCategory,
  onOpenSos,
}) => {
  const { currentUser, services, favors, setActiveTab } = useApp();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }, []);

  const firstName = currentUser.fullName.split(' ')[0] || 'Vecino';

  const bentoCategories: BentoCategory[] = [
    {
      id: 'cocina',
      badgeLetter: 'C',
      badgeBg: 'bg-[#E45826]',
      badgeText: 'text-white',
      title: 'Cocina Casera',
      subtitle: 'Lasañas, postres y viandas',
      tag: 'A 2 min · S/ 14',
      cardBg: 'bg-[#FFF3EB] hover:bg-[#FFE8DA]',
      cardBorder: 'border-[#FDE0D0]',
      action: () => {
        if (onSelectCategory) onSelectCategory('gastronomia_vecinal');
      },
    },
    {
      id: 'oficios',
      badgeLetter: 'O',
      badgeBg: 'bg-[#D97706]',
      badgeText: 'text-white',
      title: 'Oficios del Hogar',
      subtitle: 'Cerrajería, gasfitería, luz',
      tag: 'A 3 min · Desde S/ 25',
      cardBg: 'bg-[#FEF9E7] hover:bg-[#FDF3CC]',
      cardBorder: 'border-[#FDEEB4]',
      action: () => {
        if (onSelectCategory) onSelectCategory('oficio_hogar');
      },
    },
    {
      id: 'pool',
      badgeLetter: 'P',
      badgeBg: 'bg-[#2563EB]',
      badgeText: 'text-white',
      title: 'Pool Escolar',
      subtitle: 'Rutas hacia colegios Cayma',
      tag: '2 cupos libres',
      cardBg: 'bg-[#EFF6FF] hover:bg-[#DBEAFE]',
      cardBorder: 'border-[#BFDBFE]',
      action: () => {
        setActiveTab('favors');
        if (onSelectFavorCategory) onSelectFavorCategory('movilidad_pool');
      },
    },
    {
      id: 'herramientas',
      badgeLetter: 'H',
      badgeBg: 'bg-[#16A34A]',
      badgeText: 'text-white',
      title: 'Préstamo Barrial',
      subtitle: 'Muletas, taladro, escalera',
      tag: '100% Gratuito',
      cardBg: 'bg-[#F0FDF4] hover:bg-[#DCFCE7]',
      cardBorder: 'border-[#BBF7D0]',
      action: () => {
        setActiveTab('favors');
        if (onSelectFavorCategory) onSelectFavorCategory('prestamo_salud_herramienta');
      },
    },
    {
      id: 'trueque',
      badgeLetter: 'T',
      badgeBg: 'bg-[#7C3AED]',
      badgeText: 'text-white',
      title: 'Trueque Solidario',
      subtitle: 'Intercambio sin dinero',
      tag: '3 ofertas activas',
      cardBg: 'bg-[#F5F3FF] hover:bg-[#EDE9FE]',
      cardBorder: 'border-[#DDD6FE]',
      action: () => {
        setActiveTab('favors');
        if (onSelectFavorCategory) onSelectFavorCategory('intercambio_trueque');
      },
    },
    {
      id: 'sos',
      badgeLetter: 'S',
      badgeBg: 'bg-[#DC2626]',
      badgeText: 'text-white',
      title: 'Auxilio S.O.S.',
      subtitle: 'Serenazgo, Bomberos, SAMU',
      tag: 'Directo · 24/7',
      cardBg: 'bg-[#FFF1F2] hover:bg-[#FFE4E6]',
      cardBorder: 'border-[#FECDD3]',
      action: () => {
        if (onOpenSos) onOpenSos();
        else setActiveTab('emergency');
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Header con Saludo Cálido y Editorial */}
      <div className="pt-1">
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
          <div className="flex items-center gap-1.5 font-medium tracking-wide">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="uppercase text-[10px] tracking-wider font-bold text-neutral-600">
              Yanahuara · Red Activa
            </span>
          </div>
          <span className="font-mono text-[11px] text-neutral-400">Radio 500m</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171615] tracking-tight leading-tight">
          {greeting}, {firstName}
        </h1>
        <p className="font-editorial-serif italic text-lg sm:text-xl text-[#7A6B58] mt-0.5 leading-snug">
          Tu barrio despierta en calma y solidaridad.
        </p>
      </div>

      {/* 2. Anchor Bento Card: Pulso del Barrio (Inspirado en el widget de nivel oscuro) */}
      <div className="rounded-3xl bg-[#181816] text-white p-4 sm:p-5 shadow-lg border border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E45826] text-white font-extrabold text-sm shadow-inner">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  DNI Verificado RENIEC
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-extrabold text-emerald-300 border border-emerald-500/30">
                  Referente 1.5x
                </span>
              </div>
              <h2 className="text-base font-bold text-neutral-100 tracking-tight">
                {currentUser.neighborhood}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:border-l sm:border-neutral-800 sm:pl-4 text-xs font-mono">
            <div>
              <span className="block text-[10px] uppercase text-neutral-400 tracking-wider font-sans">
                A tu alrededor
              </span>
              <span className="font-bold text-emerald-400 text-sm">
                {services.length} oficios · {favors.length} favores
              </span>
            </div>
          </div>
        </div>

        {/* Micro barra de confianza barrial */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
          <span className="text-neutral-400 text-[11px]">
            Red vecinal activa sin comisiones ni intermediarios
          </span>
          <span className="font-mono text-emerald-400 font-bold text-[11px]">
            100% Verificado
          </span>
        </div>
      </div>

      {/* 3. Retícula Bento de 6 Tarjetas Pastel (Fiel al diseño editorial del usuario) */}
      <div>
        <div className="flex items-center justify-between mb-2 px-0.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
            Explora por Categoría
          </span>
          <span className="text-xs text-neutral-400 font-medium">6 accesos directos</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {bentoCategories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              className={`rounded-2xl border p-3.5 text-left transition-all duration-200 active:scale-95 flex flex-col justify-between min-h-[118px] ${item.cardBg} ${item.cardBorder} shadow-2xs hover:shadow-xs group`}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl font-extrabold text-sm shadow-xs ${item.badgeBg} ${item.badgeText}`}
                >
                  {item.badgeLetter}
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-white/80 text-neutral-800 border border-black/5">
                  {item.tag}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="font-extrabold text-sm text-[#1A1917] tracking-tight leading-snug group-hover:text-[#E45826] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-neutral-600 line-clamp-1 mt-0.5 leading-tight">
                  {item.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
