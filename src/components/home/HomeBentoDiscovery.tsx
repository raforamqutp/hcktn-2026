import React, { useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { RatingFaceIcon } from '../common/RatingFaceIcon';
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
  const [transitioningId, setTransitioningId] = useState<string | null>(null);

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
        setTransitioningId('cocina');
        setTimeout(() => {
          if (onSelectCategory) onSelectCategory('gastronomia_vecinal');
          setTransitioningId(null);
          setTimeout(() => {
            const el = document.getElementById('servicios-feed');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 50);
        }, 120);
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
        setTransitioningId('oficios');
        setTimeout(() => {
          if (onSelectCategory) onSelectCategory('oficio_hogar');
          setTransitioningId(null);
          setTimeout(() => {
            const el = document.getElementById('servicios-feed');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 50);
        }, 120);
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
        setTransitioningId('pool');
        setTimeout(() => {
          setActiveTab('favors');
          if (onSelectFavorCategory) onSelectFavorCategory('movilidad_pool');
          setTransitioningId(null);
          setTimeout(() => {
            const el = document.getElementById('favores-feed');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 80);
        }, 180);
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
        setTransitioningId('herramientas');
        setTimeout(() => {
          setActiveTab('favors');
          if (onSelectFavorCategory) onSelectFavorCategory('prestamo_salud_herramienta');
          setTransitioningId(null);
          setTimeout(() => {
            const el = document.getElementById('favores-feed');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 80);
        }, 180);
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
        setTransitioningId('trueque');
        setTimeout(() => {
          setActiveTab('favors');
          if (onSelectFavorCategory) onSelectFavorCategory('intercambio_trueque');
          setTransitioningId(null);
          setTimeout(() => {
            const el = document.getElementById('favores-feed');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 80);
        }, 180);
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
        setTransitioningId('sos');
        setTimeout(() => {
          if (onOpenSos) {
            onOpenSos();
          } else {
            setActiveTab('emergency');
            setTimeout(() => {
              const el = document.getElementById('emergencia-feed');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 80);
          }
          setTransitioningId(null);
        }, 180);
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

      {/* 2. Anchor Bento Card: Pulso del Barrio */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#181816] text-white p-3.5 sm:p-4 shadow-md border border-neutral-800">
        {/* Vista Móvil (sm:hidden) - Fiel a Imagen 3 B */}
        <div className="sm:hidden flex items-stretch justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#E45826] text-white font-extrabold text-sm shadow-inner mt-0.5">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block leading-tight">
                DNI Verificado RENIEC
              </span>
              <h2 className="text-sm font-bold text-neutral-100 tracking-tight truncate mt-0.5">
                {currentUser.neighborhood}
              </h2>
              <div className="mt-2 pt-2 border-t border-neutral-800/80">
                <span className="block text-[9.5px] uppercase text-neutral-400 tracking-wider font-sans leading-none mb-0.5">
                  A tu alrededor
                </span>
                <span className="font-bold text-emerald-400 text-xs font-mono">
                  {services.length} oficios · {favors.length} favores
                </span>
              </div>
            </div>
          </div>

          {/* Bloque Reputación Móvil (Cuadrante vertical derecho - Imagen 3 B) */}
          <div className="shrink-0 flex flex-col items-center justify-center rounded-2xl bg-[#12231C] border border-emerald-600/40 px-3.5 py-2 text-center min-w-[96px] shadow-inner">
            <span className="text-[10.5px] font-black uppercase tracking-wider text-emerald-400 mb-1">
              Reputación
            </span>
            <div className="drop-shadow-xs">
              <RatingFaceIcon sentiment="happy" size="md" bare={true} />
            </div>
          </div>
        </div>

        {/* Vista Web / Desktop (hidden sm:flex) - Fiel a Imagen 1 B */}
        <div className="hidden sm:flex items-center justify-between gap-4">
          {/* Lado Izquierdo: Escudo + DNI Verificado + Ubicación (sin pastilla adyacente) */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E45826] text-white font-extrabold text-sm shadow-inner">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                DNI Verificado RENIEC
              </span>
              <h2 className="text-base font-bold text-neutral-100 tracking-tight">
                {currentUser.neighborhood}
              </h2>
            </div>
          </div>

          {/* Centro: Pastilla destacada Reputación Ejemplar con carita (Imagen 1 B) */}
          <div className="flex items-center justify-center flex-1">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-[#12231C] px-5 py-2 border-2 border-emerald-500/50 text-emerald-300 shadow-md">
              <RatingFaceIcon sentiment="happy" size="sm" bare={true} />
              <span className="text-xs sm:text-sm font-black tracking-wide text-emerald-300">
                Reputación Ejemplar
              </span>
            </div>
          </div>

          {/* Lado Derecho: A tu alrededor */}
          <div className="border-l border-neutral-800 pl-4 text-xs font-mono shrink-0">
            <span className="block text-[10px] uppercase text-neutral-400 tracking-wider font-sans">
              A tu alrededor
            </span>
            <span className="font-bold text-emerald-400 text-sm">
              {services.length} oficios · {favors.length} favores
            </span>
          </div>
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
              className={`rounded-2xl border p-3 text-left transition-all duration-200 ${
                transitioningId === item.id
                  ? 'scale-95 ring-2 ring-emerald-500/60 shadow-inner brightness-95'
                  : 'active:scale-95 hover:shadow-xs shadow-2xs'
              } flex flex-col justify-between min-h-[96px] sm:min-h-[102px] ${item.cardBg} ${item.cardBorder} group`}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg font-extrabold text-xs shadow-xs ${item.badgeBg} ${item.badgeText}`}
                >
                  {item.badgeLetter}
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-white/85 text-neutral-800 border border-black/5">
                  {item.tag}
                </span>
              </div>

              <div className="mt-2">
                <h3 className="font-extrabold text-xs sm:text-sm text-[#1A1917] tracking-tight leading-snug group-hover:text-[#E45826] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[10.5px] sm:text-[11px] text-neutral-600 line-clamp-1 mt-0.5 leading-tight">
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
