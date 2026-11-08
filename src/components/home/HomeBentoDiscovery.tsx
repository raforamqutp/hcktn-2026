import React, { useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  Bus,
  CookingPot,
  HandHeart,
  ShieldCheck,
  Siren,
  Wrench,
} from 'lucide-react';
import { RatingFaceIcon } from '../common/RatingFaceIcon';
import { useApp } from '../../context/AppContext';
import { FavorCategory, ServiceCategory } from '../../types';

interface BentoCategory {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  tag: string;
  tagBg: string;
  tagText: string;
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
      icon: CookingPot,
      iconBg: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      iconColor: 'text-emerald-700',
      title: 'Cocina Casera',
      subtitle: 'Lasañas, postres y viandas',
      tag: 'A 2 min · S/ 14',
      tagBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      tagText: 'text-emerald-800',
      cardBg: 'bg-white hover:bg-emerald-50/50',
      cardBorder: 'border-slate-200/90 hover:border-emerald-300',
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
      icon: Wrench,
      iconBg: 'bg-amber-100 text-amber-800 border border-amber-200',
      iconColor: 'text-amber-700',
      title: 'Oficios del Hogar',
      subtitle: 'Cerrajería, gasfitería, luz',
      tag: 'A 3 min · Desde S/ 25',
      tagBg: 'bg-amber-50 text-amber-800 border-amber-200',
      tagText: 'text-amber-800',
      cardBg: 'bg-white hover:bg-amber-50/50',
      cardBorder: 'border-slate-200/90 hover:border-amber-300',
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
      icon: Bus,
      iconBg: 'bg-teal-100 text-teal-800 border border-teal-200',
      iconColor: 'text-teal-700',
      title: 'Pool Escolar',
      subtitle: 'Rutas hacia colegios Cayma',
      tag: '2 cupos libres',
      tagBg: 'bg-teal-50 text-teal-800 border-teal-200',
      tagText: 'text-teal-800',
      cardBg: 'bg-white hover:bg-teal-50/50',
      cardBorder: 'border-slate-200/90 hover:border-teal-300',
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
      icon: HandHeart,
      iconBg: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      iconColor: 'text-emerald-700',
      title: 'Préstamo Barrial',
      subtitle: 'Muletas, taladro, escalera',
      tag: '100% Gratuito',
      tagBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      tagText: 'text-emerald-800',
      cardBg: 'bg-white hover:bg-emerald-50/50',
      cardBorder: 'border-slate-200/90 hover:border-emerald-300',
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
      icon: ArrowLeftRight,
      iconBg: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
      iconColor: 'text-emerald-800',
      title: 'Trueque Solidario',
      subtitle: 'Intercambio sin dinero',
      tag: '3 ofertas activas',
      tagBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      tagText: 'text-emerald-800',
      cardBg: 'bg-white hover:bg-emerald-50/40',
      cardBorder: 'border-slate-200/90 hover:border-emerald-300',
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
      icon: Siren,
      iconBg: 'bg-red-100 text-red-700 border border-red-200',
      iconColor: 'text-red-700',
      title: 'Auxilio S.O.S.',
      subtitle: 'Serenazgo, Bomberos, SAMU',
      tag: 'Directo · 24/7',
      tagBg: 'bg-red-50 text-red-700 border-red-200',
      tagText: 'text-red-700',
      cardBg: 'bg-red-50/30 hover:bg-red-50/70',
      cardBorder: 'border-red-200 hover:border-red-300',
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
      {/* 1. Header con Saludo Cálido y Limpio */}
      <div className="pt-1">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <div className="flex items-center gap-1.5 font-medium tracking-wide">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="uppercase text-[10px] tracking-wider font-extrabold text-emerald-800">
              Yanahuara · Red Activa
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-400">Radio 500m</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
          {greeting}, {firstName}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-medium mt-0.5 leading-snug">
          Tu barrio despierta en calma y solidaridad.
        </p>
      </div>

      {/* 2. Tarjeta Cívica Vecinal Elegante (Fondo blanco, acentos esmeralda) */}
      <div className="rounded-2xl sm:rounded-3xl bg-white text-slate-900 p-4 shadow-sm border border-slate-200/90 transition">
        {/* Vista Móvil */}
        <div className="sm:hidden flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-xs">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block leading-tight">
                DNI Verificado RENIEC
              </span>
              <h2 className="text-sm font-black text-slate-950 tracking-tight mt-0.5 truncate">
                Yanahuara · Urb. Los Perales
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] text-slate-500 font-medium">A tu alrededor:</span>
                <span className="font-extrabold text-emerald-700 text-xs">
                  {services.length} oficios · {favors.length} favores
                </span>
              </div>
            </div>
          </div>

          {/* Bloque Reputación Móvil Humana y Amigable */}
          <div className="shrink-0 flex flex-col items-center justify-center rounded-2xl bg-emerald-50/80 border border-emerald-200 px-3 py-2 text-center min-w-[90px] shadow-2xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 mb-1">
              Vecino Ejemplar
            </span>
            <div className="drop-shadow-xs">
              <RatingFaceIcon sentiment="happy" size="md" bare={true} />
            </div>
          </div>
        </div>

        {/* Vista Web / Desktop */}
        <div className="hidden sm:flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-xs">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                Identidad Cívica Verificada RENIEC
              </span>
              <h2 className="text-base font-black text-slate-950 tracking-tight">
                Yanahuara · Urb. Los Perales
              </h2>
            </div>
          </div>

          {/* Centro: Pastilla destacada Reputación Ejemplar */}
          <div className="flex items-center justify-center flex-1">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-emerald-50/90 px-5 py-2 border border-emerald-300 text-emerald-900 shadow-2xs">
              <RatingFaceIcon sentiment="happy" size="sm" bare={true} />
              <span className="text-xs sm:text-sm font-black tracking-wide text-emerald-900">
                Conducta Vecinal Ejemplar
              </span>
            </div>
          </div>

          {/* Lado Derecho: A tu alrededor */}
          <div className="border-l border-slate-200 pl-4 text-xs shrink-0">
            <span className="block text-[10px] uppercase text-slate-400 font-bold tracking-wider">
              En tu cuadra
            </span>
            <span className="font-black text-emerald-800 text-sm">
              {services.length} oficios · {favors.length} favores
            </span>
          </div>
        </div>
      </div>

      {/* 3. Retícula Bento de 6 Tarjetas con Íconos Reales y Elegantes */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">
            Explora por Categoría
          </span>
          <span className="text-xs text-slate-400 font-medium">6 accesos directos</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {bentoCategories.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className={`rounded-2xl border p-3.5 text-left transition-all duration-200 shadow-xs ${
                  transitioningId === item.id
                    ? 'scale-95 ring-2 ring-emerald-500/60 shadow-inner brightness-95'
                    : 'hover:shadow-md hover:-translate-y-0.5 active:scale-95'
                } ${item.cardBg} ${item.cardBorder}`}
              >
                {/* Cabecera de la tarjeta: Ícono elegante a la izquierda + Badge a la derecha */}
                <div className="flex items-center justify-between gap-1.5 mb-2.5">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-2xs ${item.iconBg}`}
                  >
                    <IconComponent className={`h-5 w-5 ${item.iconColor}`} />
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border truncate max-w-[110px] ${item.tagBg}`}
                  >
                    {item.tag}
                  </span>
                </div>

                {/* Título y Subtítulo legibles */}
                <h3 className="text-sm font-black text-slate-950 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5 leading-snug line-clamp-1">
                  {item.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
