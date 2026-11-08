import {
  ArrowLeftRight,
  Bus,
  CheckCircle2,
  Clock,
  Footprints,
  HandHeart,
  HeartHandshake,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wrench,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AccountTier, FavorCategory } from '../../types';

const FAVOR_CATEGORIES: { id: 'all' | FavorCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'Todos', icon: HeartHandshake },
  { id: 'prestamo_salud_herramienta', label: 'Muletas y herramientas', icon: Wrench },
  { id: 'movilidad_pool', label: 'Pool escolar y rutas', icon: Bus },
  { id: 'donacion_material', label: 'Donaciones', icon: HandHeart },
  { id: 'intercambio_trueque', label: 'Trueque solidario', icon: ArrowLeftRight },
  { id: 'ayuda_temporal', label: 'Apoyo puntual', icon: Footprints },
];

export const FavorsView: React.FC = () => {
  const { favors, markFavorStatus, isSeniorMode, openPublishModal, mode, activeTab, currentUser } = useApp();
  const isMinor = !currentUser.isVerifiedAdult;
  const [directionFilter, setDirectionFilter] = useState<'all' | 'ofrezco' | 'solicito'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | FavorCategory>('all');
  const [search, setSearch] = useState('');
  const [onlyClose, setOnlyClose] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const isEmergency = mode === 'emergency' || activeTab === 'emergency';

  const filtered = useMemo(() => {
    return favors.filter((fav) => {
      if (directionFilter !== 'all' && fav.direction !== directionFilter) return false;
      if (categoryFilter !== 'all' && fav.category !== categoryFilter) return false;
      if (onlyClose && fav.location.walkingMinutes > 5) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = fav.title.toLowerCase().includes(q);
        const matchesAuthor = fav.authorName.toLowerCase().includes(q);
        const matchesDesc = fav.description.toLowerCase().includes(q);
        const matchesPoint = fav.safeMeetingPoint?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAuthor && !matchesDesc && !matchesPoint) return false;
      }
      return true;
    });
  }, [favors, directionFilter, categoryFilter, onlyClose, search]);

  const poolCount = useMemo(
    () => favors.filter((f) => f.category === 'movilidad_pool' && f.status !== 'completado').length,
    [favors]
  );

  const handleStatusChange = (favorId: string, nextStatus: 'en_curso' | 'completado', title: string) => {
    markFavorStatus(favorId, nextStatus);
    const msg =
      nextStatus === 'en_curso'
        ? `¡Te has conectado para coordinar: "${title}"!`
        : `¡Favor completado con éxito! Gracias por hacer comunidad.`;
    setActionNotice(msg);
    setTimeout(() => {
      setActionNotice(null);
    }, 4500);
  };

  const getTierInfo = (tier: AccountTier) => {
    switch (tier) {
      case 'referente':
        return {
          label: 'Vecino Referente',
          badgeClass: isEmergency
            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
            : 'bg-emerald-50 text-emerald-900 border-emerald-200',
          icon: ShieldCheck,
        };
      case 'activo':
        return {
          label: 'Vecino Verificado',
          badgeClass: isEmergency
            ? 'bg-blue-950/80 text-blue-300 border-blue-700'
            : 'bg-blue-50 text-blue-900 border-blue-200',
          icon: UserCheck,
        };
      case 'nuevo':
      default:
        return {
          label: 'Vecino del Barrio',
          badgeClass: isEmergency
            ? 'bg-slate-800 text-slate-300 border-slate-700'
            : 'bg-slate-100 text-slate-800 border-slate-200',
          icon: Sparkles,
        };
    }
  };

  return (
    <section aria-label="Cadena de favores y pool escolar" className="space-y-4">
      {/* Toast Notificación */}
      {actionNotice && (
        <div
          role="status"
          className="fixed top-20 right-4 z-50 max-w-sm rounded-2xl bg-emerald-600 text-white p-4 shadow-xl border border-emerald-400 flex items-start gap-3 animate-scale-in"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-100" />
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-100">
              Coordinación Vecinal
            </p>
            <p className="text-xs font-bold mt-0.5 leading-snug">{actionNotice}</p>
          </div>
        </div>
      )}

      {/* 1. Header Principal y Resumen */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2
                className={`font-black tracking-tight ${
                  isSeniorMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                } ${isEmergency ? 'text-white' : 'text-slate-950'}`}
              >
                Cadena de Favores y Rutas
              </h2>
              <span className="rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200 px-2.5 py-0.5 text-xs font-black">
                {filtered.length} activ{filtered.length === 1 ? 'o' : 'os'}
              </span>
            </div>
            <p className={`text-xs font-medium mt-0.5 ${isEmergency ? 'text-slate-400' : 'text-slate-500'}`}>
              Préstamo gratuito de herramientas, muletas, pool escolar matutino y apoyo directo entre vecinos
            </p>
          </div>

          <button
            type="button"
            onClick={() => openPublishModal('favor')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition active:scale-95 shrink-0"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Pedir u Ofrecer Favor</span>
          </button>
        </div>

        {/* 2. Banner Editorial de Pool Escolar Yanahuara */}
        <div
          className={`rounded-2xl p-4 border transition-colors ${
            isEmergency
              ? 'bg-slate-900/95 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200/90 text-slate-950 shadow-2xs'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-900 border border-indigo-200">
                  <Bus className="h-3 w-3 text-indigo-600" /> Movilidad Vecinal
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  {poolCount} ruta{poolCount === 1 ? '' : 's'} hacia colegios activas
                </span>
              </div>
              <h3 className={`text-sm sm:text-base font-black tracking-tight ${isEmergency ? 'text-white' : 'text-slate-950'}`}>
                Pool Escolar y Rutas Matutinas (Yanahuara y Cayma)
              </h3>
              <p className={`text-xs leading-relaxed max-w-[65ch] ${isEmergency ? 'text-slate-400' : 'text-slate-600'}`}>
                Comparte asientos hacia colegios y paraderos entre vecinos verificados. Mayor seguridad para los niños y ahorro mutuo en traslados.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCategoryFilter(categoryFilter === 'movilidad_pool' ? 'all' : 'movilidad_pool')}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition active:scale-95 ${
                categoryFilter === 'movilidad_pool'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-indigo-950 border-slate-200'
              }`}
            >
              {categoryFilter === 'movilidad_pool' ? 'Ver todos los favores' : 'Ver solo rutas de pool'}
            </button>
          </div>
        </div>

        {/* 3. Buscador y Filtros de Dirección */}
        <div className="space-y-2 pt-1">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar muletas, pool escolar, taladro, escalera, medicinas..."
                className={`w-full rounded-2xl py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium transition focus:outline-none border ${
                  isEmergency
                    ? 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-400'
                    : 'bg-white border-slate-200/90 text-slate-950 placeholder:text-slate-400 shadow-2xs focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500/20'
                }`}
              />
            </div>

            {/* Segmento: Todos / Ofrecen / Necesitan */}
            <div
              className={`grid grid-cols-3 rounded-2xl p-1 shrink-0 border ${
                isEmergency ? 'bg-slate-900 border-slate-800' : 'bg-slate-200/80 border-slate-300/80'
              }`}
            >
              {[
                { id: 'all', label: 'Todos' },
                { id: 'ofrezco', label: 'Ofrecen' },
                { id: 'solicito', label: 'Necesitan' },
              ].map((dir) => {
                const active = directionFilter === dir.id;
                return (
                  <button
                    key={dir.id}
                    type="button"
                    onClick={() => setDirectionFilter(dir.id as 'all' | 'ofrezco' | 'solicito')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? isEmergency
                          ? 'bg-slate-800 text-white shadow-xs font-black'
                          : 'bg-white text-slate-950 shadow-xs font-black'
                        : isEmergency
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    {dir.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chips de Categorías */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
            <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-full">
              {FAVOR_CATEGORIES.map((cat) => {
                const active = categoryFilter === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                      active
                        ? isEmergency
                          ? 'bg-white text-slate-950 shadow-xs'
                          : 'bg-slate-950 text-white shadow-xs'
                        : isEmergency
                        ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                        : 'bg-white text-slate-700 border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${active ? (isEmergency ? 'text-slate-950' : 'text-indigo-400') : 'text-slate-400'}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              aria-pressed={onlyClose}
              onClick={() => setOnlyClose(!onlyClose)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 border ${
                onlyClose
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                  : isEmergency
                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                  : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
              }`}
            >
              <Footprints className="h-3 w-3 text-emerald-600" />
              <span>&lt; 5 min a pie</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Feed de Favores en Inset Grouped Swiss Cards */}
      <div className="space-y-3">
        {filtered.map((fav) => {
          const tier = getTierInfo(fav.authorTier);
          const isPool = fav.category === 'movilidad_pool';
          const isTool = fav.category === 'prestamo_salud_herramienta';

          return (
            <article
              key={fav.id}
              className={`rounded-2xl border transition-all p-4 sm:p-5 ${
                isEmergency
                  ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-xs'
                  : 'bg-white border-slate-200/90 text-slate-950 shadow-2xs hover:border-slate-300'
              }`}
            >
              {/* Encabezado: Autor + Dirección + Proximidad */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-sm shadow-2xs ${
                      fav.direction === 'ofrezco' ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {fav.authorName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold truncate ${isEmergency ? 'text-slate-200' : 'text-slate-900'}`}>
                        {fav.authorName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${tier.badgeClass}`}>
                        {tier.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="truncate">{fav.location.reference}</span>
                      <span>•</span>
                      <span className="tabular inline-flex items-center gap-1 text-emerald-700 font-semibold shrink-0">
                        <Footprints className="h-3 w-3" />
                        {fav.location.walkingMinutes} min a pie ({fav.location.distanceMeters}m)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badge de Dirección */}
                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      fav.direction === 'ofrezco'
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                        : 'bg-amber-50 text-amber-950 border-amber-200'
                    }`}
                  >
                    {fav.direction === 'ofrezco' ? 'Ofrece apoyo' : 'Necesita apoyo'}
                  </span>
                  {fav.syncStatus === 'pending' && (
                    <span className="block text-[10px] text-amber-600 font-medium mt-0.5">
                      Local
                    </span>
                  )}
                </div>
              </div>

              {/* Título y Descripción */}
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-1">
                  {isPool && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-900 border border-indigo-200">
                      <Bus className="h-3 w-3 text-indigo-600" /> Pool Escolar
                    </span>
                  )}
                  {isTool && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-teal-900 border border-teal-200">
                      <Wrench className="h-3 w-3 text-teal-600" /> Préstamo
                    </span>
                  )}
                </div>

                <h3 className={`text-base sm:text-lg font-black tracking-tight leading-snug ${isEmergency ? 'text-white' : 'text-slate-950'}`}>
                  {fav.title}
                </h3>
                <p className={`mt-1.5 text-xs sm:text-sm leading-relaxed max-w-[65ch] ${isEmergency ? 'text-slate-300' : 'text-slate-600'}`}>
                  {fav.description}
                </p>
              </div>

              {/* Punto Seguro de Encuentro */}
              {fav.safeMeetingPoint && (
                <div
                  className={`mt-3 p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                    isEmergency
                      ? 'bg-slate-800/80 border-slate-700 text-emerald-200'
                      : 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  <div className="text-[11px] min-w-0">
                    <span className="font-bold text-emerald-950">Punto Seguro de Encuentro: </span>
                    <span className="font-medium text-emerald-900">{fav.safeMeetingPoint}</span>
                  </div>
                </div>
              )}

              {/* Línea Divisoria y Botones de Acción */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Publicado {fav.createdAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  {isMinor ? (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-1 text-[11px] font-bold text-amber-900"
                      title="Modo Protegido: Los favores y coordinación directa están reservados para cuentas de adultos"
                    >
                      <Lock className="h-3.5 w-3.5 text-amber-700" />
                      <span>Solo adultos</span>
                    </span>
                  ) : fav.status === 'disponible' ? (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(fav.id, 'en_curso', fav.title)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black text-white shadow-2xs transition active:scale-95 ${
                        fav.direction === 'ofrezco'
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {fav.direction === 'ofrezco' ? 'Pedir este apoyo' : 'Ayudar a este vecino'}
                    </button>
                  ) : (
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      En coordinación
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
