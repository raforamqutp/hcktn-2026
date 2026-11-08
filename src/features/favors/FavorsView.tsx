import {
  ArrowLeftRight,
  Bus,
  CheckCircle2,
  Clock,
  Footprints,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Lock,
  MapPin,
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
  const { favors, markFavorStatus, isSeniorMode, openPublishModal, mode, currentUser } = useApp();
  const isMinor = !currentUser.isVerifiedAdult;
  const [directionFilter, setDirectionFilter] = useState<'all' | 'ofrezco' | 'solicito'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | FavorCategory>('all');
  const [search, setSearch] = useState('');
  const [onlyClose, setOnlyClose] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const isEmergency = mode === 'emergency';

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

  // Contadores para badges informativos
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
            : 'bg-emerald-100 text-emerald-950 border-emerald-300',
          icon: ShieldCheck,
        };
      case 'activo':
        return {
          label: 'Vecino Verificado',
          badgeClass: isEmergency
            ? 'bg-blue-950/80 text-blue-300 border-blue-700'
            : 'bg-blue-100 text-blue-950 border-blue-300',
          icon: UserCheck,
        };
      case 'nuevo':
      default:
        return {
          label: 'Vecino de la Cuadra',
          badgeClass: isEmergency
            ? 'bg-slate-800 text-slate-300 border-slate-700'
            : 'bg-slate-100 text-slate-800 border-slate-300',
          icon: Sparkles,
        };
    }
  };

  return (
    <section aria-label="Cadena de favores y pool escolar" className="space-y-4">
      {/* Toast / Notificación de Acción Rápida */}
      {actionNotice && (
        <div
          role="status"
          className="fixed top-20 right-4 z-50 max-w-sm rounded-2xl bg-emerald-600 text-white p-4 shadow-xl border border-emerald-400 flex items-start gap-3 animate-slide-up"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-200" />
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-100">
              Coordinación Comunitaria
            </p>
            <p className="text-sm font-bold mt-0.5 leading-snug">{actionNotice}</p>
          </div>
        </div>
      )}

      {/* Header Principal con Botón de Publicación en 3 Clics */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2
                className={`text-2xl md:text-3xl font-black tracking-tight ${
                  isEmergency ? 'text-white' : 'text-slate-950'
                } ${isSeniorMode ? 'text-3xl md:text-4xl' : ''}`}
              >
                Cadena de Favores y Rutas
              </h2>
              <span className="rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300 px-2.5 py-0.5 text-xs font-black">
                {filtered.length} disponibles
              </span>
            </div>
            <p
              className={`font-semibold mt-0.5 ${
                isEmergency ? 'text-slate-300' : 'text-slate-700'
              } ${isSeniorMode ? 'text-base' : 'text-xs md:text-sm'}`}
            >
              Préstamo gratuito de muletas, taladros, pool escolar matutino y ayuda solidaria entre vecinos
            </p>
          </div>

          <button
            type="button"
            onClick={() => openPublishModal('favor')}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-md hover:shadow-lg transition active:scale-95 shrink-0 ${
              isSeniorMode ? 'min-h-[54px] px-6 text-base' : 'min-h-[46px] px-5 text-sm'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Publicar favor / pool</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TARJETA DESTACADA: POOL ESCOLAR Y RUTA SOLIDARIA          */}
        {/* ======================================================== */}
        <div
          className={`relative overflow-hidden rounded-3xl p-5 md:p-6 transition-all border-2 ${
            isEmergency
              ? 'bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 border-indigo-700/80 text-white shadow-lg'
              : 'bg-gradient-to-r from-indigo-50 via-white to-emerald-50/70 border-indigo-300/90 text-slate-950 shadow-sm'
          }`}
        >
          {/* Acento decorativo */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 h-36 w-36 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 text-white px-3 py-0.5 text-[11px] font-black tracking-wide uppercase shadow-xs">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Ruta Escolar Comunitaria
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                    isEmergency
                      ? 'bg-slate-800 text-slate-200 border-slate-700'
                      : 'bg-white text-slate-800 border-slate-200 shadow-2xs'
                  }`}
                >
                  <Bus className="h-3.5 w-3.5 text-indigo-600" />
                  {poolCount} {poolCount === 1 ? 'ruta activa' : 'rutas activas'} en el barrio
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                    isEmergency
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Punto seguro de partida en la garita
                </span>
              </div>

              <h3
                className={`font-black tracking-tight leading-snug ${
                  isEmergency ? 'text-white' : 'text-slate-950'
                } ${isSeniorMode ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'}`}
              >
                Pool Escolar Compartido y Rutas Matutinas (Cayma y Yanahuara)
              </h3>

              <p
                className={`font-medium leading-relaxed ${
                  isEmergency ? 'text-slate-300' : 'text-slate-700'
                } ${isSeniorMode ? 'text-sm' : 'text-xs md:text-sm'}`}
              >
                Comparte asientos hacia los colegios con padres y vecinos verificados de la cuadra.
                Menos tráfico, mayor seguridad para los niños, ahorro mutuo en gasolina y apoyo para
                familias que trabajan temprano.
              </p>
            </div>

            <div className="flex flex-row lg:flex-col gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openPublishModal('favor')}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xs transition active:scale-95 ${
                  isSeniorMode ? 'min-h-[50px] px-5 text-sm' : 'min-h-[44px] px-4 text-xs'
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>Ofrecer mi auto / unirme</span>
              </button>

              <button
                type="button"
                onClick={() => setCategoryFilter('movilidad_pool')}
                className={`inline-flex items-center justify-center gap-1.5 rounded-2xl font-bold border-2 transition active:scale-95 ${
                  categoryFilter === 'movilidad_pool'
                    ? 'bg-indigo-950 text-white border-indigo-950'
                    : isEmergency
                    ? 'bg-slate-900 text-slate-100 border-slate-700 hover:bg-slate-800'
                    : 'bg-white text-indigo-950 border-indigo-300 hover:bg-indigo-50/60'
                } ${isSeniorMode ? 'min-h-[50px] px-4 text-sm' : 'min-h-[44px] px-3.5 text-xs'}`}
              >
                <Bus className="h-4 w-4 text-indigo-600" />
                <span>Ver sólo rutas de pool</span>
              </button>
            </div>
          </div>
        </div>

        {/* Buscador y Filtros Rápidos */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Input de Búsqueda */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar muletas, pool escolar, taladro, libros..."
                className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none transition border-2 ${
                  isEmergency
                    ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-400'
                    : 'bg-white border-slate-200/90 text-slate-950 placeholder:text-slate-500 focus:border-indigo-600'
                }`}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 hover:text-slate-700"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Selector de Dirección (Ofrecen vs Necesitan) */}
            <div
              className={`grid grid-cols-3 rounded-2xl p-1 shrink-0 border-2 ${
                isEmergency ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-300'
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
                    className={`rounded-xl px-3 py-2 text-xs font-black transition active:scale-95 ${
                      active
                        ? isEmergency
                          ? 'bg-slate-800 text-white shadow-xs ring-1 ring-slate-600'
                          : 'bg-white text-slate-950 shadow-xs ring-1 ring-slate-300'
                        : isEmergency
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    {dir.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtros Horizontales por Categoría */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
            <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-0.5">
              {FAVOR_CATEGORIES.map((cat) => {
                const active = categoryFilter === cat.id;
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95 ${
                      active
                        ? isEmergency
                          ? 'bg-white text-slate-950 shadow-xs font-black'
                          : 'bg-slate-950 text-white shadow-xs font-black'
                        : isEmergency
                        ? 'bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800'
                        : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <IconComponent className={`h-3.5 w-3.5 ${active ? '' : 'text-slate-500'}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Filtro Cercanía */}
            <button
              type="button"
              aria-pressed={onlyClose}
              onClick={() => setOnlyClose(!onlyClose)}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95 ${
                onlyClose
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : isEmergency
                  ? 'bg-slate-900 text-slate-200 border border-slate-700'
                  : 'bg-white text-emerald-950 border-2 border-emerald-200 hover:bg-emerald-50/50'
              }`}
            >
              <Footprints className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              <span>&lt; 5 min a pie</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mensaje de Lista Vacía si no hay coincidencias */}
      {filtered.length === 0 && (
        <div
          className={`rounded-3xl p-8 text-center border-2 border-dashed ${
            isEmergency
              ? 'bg-slate-900/60 border-slate-700 text-slate-300'
              : 'bg-slate-50 border-slate-300 text-slate-700'
          }`}
        >
          <HandHeart className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <h3 className={`text-lg font-black ${isEmergency ? 'text-white' : 'text-slate-950'}`}>
            No se encontraron favores o rutas con estos filtros
          </h3>
          <p className="text-xs font-medium mt-1 max-w-md mx-auto">
            Puedes cambiar tus filtros o ser el primer vecino en ofrecer un apoyo o solicitar una ruta escolar.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setDirectionFilter('all');
                setCategoryFilter('all');
                setSearch('');
                setOnlyClose(false);
              }}
              className="rounded-2xl border-2 border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100"
            >
              Restablecer filtros
            </button>
            <button
              type="button"
              onClick={() => openPublishModal('favor')}
              className="rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
            >
              Publicar favor ahora
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* GRILLA DE TARJETAS (Dual Layout: 1 col móvil, 2 col PC)    */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((fav) => {
          const tier = getTierInfo(fav.authorTier);
          const TierIcon = tier.icon;
          const isPool = fav.category === 'movilidad_pool';
          const isToolOrHealth = fav.category === 'prestamo_salud_herramienta';

          return (
            <article
              key={fav.id}
              className={`rounded-3xl p-5 md:p-6 transition-all flex flex-col justify-between ${
                isEmergency
                  ? 'bg-[#121826] border-2 border-slate-800 text-slate-100 shadow-md shadow-red-950/10'
                  : 'bg-white border-2 border-slate-200/90 text-slate-950 shadow-xs hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div>
                {/* Cabecera de la Tarjeta: Dirección + Reputación Ponderada + Distancia */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Badge de Dirección: Ofrece vs Solicita */}
                    <span
                      className={`rounded-full px-3 py-0.5 text-[11px] font-black border ${
                        fav.direction === 'ofrezco'
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
                          : 'bg-amber-100 border-amber-300 text-amber-950'
                      }`}
                    >
                      {fav.direction === 'ofrezco' ? 'Vecino ofrece' : 'Vecino necesita'}
                    </span>

                    {/* Badge de Categoría Destacada */}
                    {isPool && (
                      <span className="rounded-full bg-indigo-100 border border-indigo-300 px-2.5 py-0.5 text-[11px] font-bold text-indigo-950 inline-flex items-center gap-1">
                        <Bus className="h-3 w-3 text-indigo-600" /> Pool Escolar
                      </span>
                    )}

                    {isToolOrHealth && (
                      <span className="rounded-full bg-teal-100 border border-teal-300 px-2.5 py-0.5 text-[11px] font-bold text-teal-950 inline-flex items-center gap-1">
                        <Wrench className="h-3 w-3 text-teal-600" /> Préstamo
                      </span>
                    )}

                    {/* Nivel de Confianza / Reputación Vecinal */}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${tier.badgeClass}`}
                      title={`Nivel de confianza en el barrio: ${tier.label}`}
                    >
                      <TierIcon className="h-3 w-3 shrink-0" />
                      <span>{tier.label}</span>
                    </span>
                  </div>

                  {/* Tiempo y Sync */}
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                    {fav.syncStatus === 'pending' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        <Clock className="h-3 w-3" /> Local
                      </span>
                    )}
                    <span>{fav.createdAt}</span>
                  </div>
                </div>

                {/* Distancia a pie */}
                <div className="mt-2 flex items-center gap-1.5 text-xs">
                  <span className={`tabular inline-flex items-center gap-1 font-black ${
                    isEmergency ? 'text-emerald-400' : 'text-emerald-800'
                  }`}>
                    <Footprints className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                    A {fav.location.walkingMinutes} min a pie ({fav.location.distanceMeters}m)
                  </span>
                </div>

                {/* Título */}
                <h3
                  className={`heading-tight mt-2 text-[18px] md:text-[19px] font-black leading-snug ${
                    isEmergency ? 'text-white' : 'text-slate-950'
                  } ${
                    isSeniorMode ? 'text-[20px] md:text-[22px]' : ''
                  }`}
                >
                  {fav.title}
                </h3>

                {/* Autor y Ubicación aproximada */}
                <p
                  className={`mt-1 font-semibold ${
                    isEmergency ? 'text-slate-300' : 'text-slate-600'
                  } ${isSeniorMode ? 'text-sm' : 'text-xs'}`}
                >
                  {fav.authorName} · {fav.location.reference}
                </p>

                {/* Descripción */}
                <p
                  className={`readable-prose mt-2.5 font-normal leading-relaxed ${
                    isEmergency ? 'text-slate-200' : 'text-slate-800'
                  } ${isSeniorMode ? 'text-sm' : 'text-xs'}`}
                >
                  {fav.description}
                </p>

                {/* ======================================================== */}
                {/* PUNTO SEGURO DE ENCUENTRO (Requisito Crítico Prompt 2)    */}
                {/* ======================================================== */}
                <div
                  className={`mt-3 rounded-2xl p-3 border flex items-center gap-2.5 ${
                    isEmergency
                      ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                      : 'bg-emerald-50/80 border-emerald-200/90 text-emerald-950'
                  }`}
                >
                  <ShieldCheck className={`h-4 w-4 shrink-0 ${isEmergency ? 'text-emerald-400' : 'text-emerald-700'}`} />
                  <div className="min-w-0 flex-1 text-xs">
                    <p className={`font-bold leading-tight ${isEmergency ? 'text-emerald-300' : 'text-emerald-950'}`}>
                      Punto Seguro de Encuentro:
                    </p>
                    <p className={`truncate font-semibold mt-0.5 ${isEmergency ? 'text-emerald-200' : 'text-emerald-900'}`}>
                      {fav.safeMeetingPoint || 'Garita de Vigilancia / Parque Central'}
                    </p>
                  </div>
                </div>

                {/* Nota de Acuerdo Vecinal / Trueque */}
                {fav.exchangeNote && (
                  <div
                    className={`mt-2 rounded-2xl p-2.5 text-xs border ${
                      isEmergency
                        ? 'bg-slate-900 border-slate-700 text-slate-200'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <p className={`font-bold ${isEmergency ? 'text-white' : 'text-slate-950'}`}>
                      Condición o acuerdo vecinal:{' '}
                      <span className={`font-normal ${isEmergency ? 'text-slate-300' : 'text-slate-800'}`}>
                        {fav.exchangeNote}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Pie de Tarjeta y Acción Interactiva */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className={`min-w-0 text-xs ${isEmergency ? 'text-slate-400' : 'text-slate-600'}`}>
                  <p className="flex items-center gap-1.5 truncate font-semibold">
                    <MapPin className="h-4 w-4 shrink-0 text-indigo-600" aria-hidden="true" />
                    <span className="truncate">{fav.location.reference}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isMinor ? (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-2xl bg-amber-50 border border-amber-300 px-3 py-1.5 text-[11px] font-bold text-amber-900"
                      title="Modo Protegido: Los favores y coordinación directa están reservados para cuentas de adultos"
                    >
                      <Lock className="h-3.5 w-3.5 text-amber-700" />
                      <span>Solo adultos (Modo Protegido)</span>
                    </span>
                  ) : fav.status === 'disponible' ? (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(fav.id, 'en_curso', fav.title)}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black transition active:scale-95 shadow-xs ${
                        isSeniorMode
                          ? 'min-h-[50px] px-5 text-sm'
                          : 'min-h-[42px] px-4 text-xs'
                      }`}
                    >
                      <HandHeart className="h-4 w-4" aria-hidden="true" />
                      <span>
                        {isPool
                          ? 'Unirme al pool escolar'
                          : fav.direction === 'ofrezco'
                          ? 'Pedir prestado / coordinar'
                          : 'Ofrecer mi apoyo'}
                      </span>
                    </button>
                  ) : null}

                  {!isMinor && fav.status === 'en_curso' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(fav.id, 'completado', fav.title)}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black transition active:scale-95 shadow-xs ${
                        isSeniorMode
                          ? 'min-h-[50px] px-5 text-sm'
                          : 'min-h-[42px] px-4 text-xs'
                      }`}
                      title="Marcar este favor como finalizado"
                    >
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      <span>En coordinación ({fav.helpedByCount}) · Finalizar</span>
                    </button>
                  )}

                  {fav.status === 'completado' && (
                    <span className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-xs font-black ${
                      isEmergency
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Completado</span>
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
