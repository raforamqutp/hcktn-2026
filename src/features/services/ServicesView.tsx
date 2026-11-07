import {
  ArrowLeftRight,
  Banknote,
  Clock,
  Flag,
  Footprints,
  Phone,
  Search,
  Smartphone,
} from 'lucide-react';
import React, { useState } from 'react';
import { RatingFaceIcon } from '../../components/common/RatingFaceIcon';
import { useApp } from '../../context/AppContext';
import { ServiceCategory } from '../../types';

const CATEGORY_LABELS: { id: 'all' | ServiceCategory; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'gastronomia_vecinal', label: 'Comida casera' },
  { id: 'oficio_hogar', label: 'Hogar y oficios' },
  { id: 'educacion_clases', label: 'Clases' },
  { id: 'salud_auxilio', label: 'Salud' },
];

const QUICK_BARTER_CHIPS = [
  '2 porciones de lasaña casera',
  'Clases de matemáticas o inglés',
  'Mantenimiento de laptop / PC',
  'Insumos o materiales de casa',
];

export const ServicesView: React.FC = () => {
  const {
    services,
    mode,
    rateServiceWithFace,
    submitBarterProposal,
    reportItem,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ServiceCategory>('all');
  const [onlyBarter, setOnlyBarter] = useState(false);
  const [onlyClose, setOnlyClose] = useState(false);
  const [activeBarterServiceId, setActiveBarterServiceId] = useState<string | null>(null);
  const [barterText, setBarterText] = useState('');

  const isEmergency = mode === 'emergency';

  const filtered = services
    .filter((srv) => {
      if (selectedCategory !== 'all' && srv.category !== selectedCategory) return false;
      if (onlyBarter && !srv.paymentMethods.includes('trueque')) return false;
      if (onlyClose && srv.location.walkingMinutes > 5) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          srv.tradeTitle.toLowerCase().includes(q) ||
          srv.providerName.toLowerCase().includes(q) ||
          srv.description.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (isEmergency && a.isEmergencySupport !== b.isEmergencySupport) {
        return a.isEmergencySupport ? -1 : 1;
      }
      return b.weightedScore - a.weightedScore;
    });

  const handleSendBarter = (serviceId: string) => {
    if (!barterText.trim()) return;
    submitBarterProposal(serviceId, barterText);
    setBarterText('');
    setActiveBarterServiceId(null);
  };

  return (
    <section aria-label="Directorio del barrio" className="space-y-4">
      {/* Header and Search Area */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2
              className={`text-2xl md:text-3xl font-black tracking-tight ${
                isEmergency ? 'text-white' : 'text-slate-950'
              }`}
            >
              Servicios y Oficios del Barrio
            </h2>
            <p
              className={`text-xs md:text-sm font-semibold mt-0.5 ${
                isEmergency ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {filtered.length} anuncio{filtered.length === 1 ? '' : 's'} disponible{filtered.length === 1 ? '' : 's'} a menos de 10 minutos a pie en tu cuadra
            </p>
          </div>
        </div>

        {/* Buscador de alta visibilidad */}
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
            aria-hidden="true"
          />
          <label htmlFor="service-search" className="visually-hidden">
            Buscar en tu barrio
          </label>
          <input
            id="service-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cerrajero, comida casera, gasfitero, clases particulares..."
            className={`w-full rounded-2xl border-2 py-3 pl-11 pr-4 text-sm font-medium transition focus:outline-none ${
              isEmergency
                ? 'border-slate-700 bg-slate-900 text-white placeholder:text-slate-400 focus:border-red-500'
                : 'border-slate-300 bg-white text-slate-950 placeholder:text-slate-500 shadow-xs focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
            }`}
          />
        </div>

        {/* Chips de Categorías y Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {CATEGORY_LABELS.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition active:scale-95 ${
                    active
                      ? isEmergency
                        ? 'bg-white text-slate-950 shadow-sm'
                        : 'bg-slate-950 text-white shadow-sm'
                      : isEmergency
                      ? 'bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800'
                      : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-pressed={onlyBarter}
              onClick={() => setOnlyBarter(!onlyBarter)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95 ${
                onlyBarter
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isEmergency
                  ? 'bg-slate-900 text-slate-200 border border-slate-700'
                  : 'bg-white text-indigo-900 border-2 border-indigo-200 hover:bg-indigo-50/50'
              }`}
            >
              <ArrowLeftRight className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
              <span>Acepta trueque</span>
            </button>

            <button
              type="button"
              aria-pressed={onlyClose}
              onClick={() => setOnlyClose(!onlyClose)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95 ${
                onlyClose
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isEmergency
                  ? 'bg-slate-900 text-slate-200 border border-slate-700'
                  : 'bg-white text-emerald-900 border-2 border-emerald-200 hover:bg-emerald-50/50'
              }`}
            >
              <Footprints className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              <span>&lt; 5 min a pie</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grilla de Tarjetas: 1 columna en móvil, 2 columnas en PC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((srv) => (
          <article
            key={srv.id}
            className={`rounded-3xl p-5 transition-all flex flex-col justify-between ${
              isEmergency
                ? 'bg-[#121826] border-2 border-slate-800 text-slate-100 shadow-md shadow-red-950/10'
                : 'bg-white border-2 border-slate-200/90 text-slate-950 shadow-xs hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <div>
              {/* Distancia y Precio */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <span
                  className={`tabular inline-flex items-center gap-1.5 font-black ${
                    isEmergency ? 'text-emerald-400' : 'text-emerald-800'
                  }`}
                >
                  <Footprints className="h-4 w-4" aria-hidden="true" />A{' '}
                  {srv.location.walkingMinutes} min a pie ({srv.location.distanceMeters}m)
                </span>

                <div className="flex items-center gap-1.5">
                  {srv.syncStatus === 'pending' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      Guardado
                    </span>
                  )}
                  <span
                    className={`tabular rounded-full px-3 py-1 font-black text-xs border ${
                      isEmergency
                        ? 'bg-slate-800 text-slate-100 border-slate-700'
                        : 'bg-slate-100 text-slate-950 border-slate-300'
                    }`}
                  >
                    {srv.priceRange}
                  </span>
                </div>
              </div>

              {/* Título y Proveedor */}
              <h3 className="heading-tight mt-2.5 text-[18px] font-black leading-snug text-slate-950 dark:text-white">
                {srv.tradeTitle}
              </h3>
              <p
                className={`mt-0.5 text-xs font-semibold ${
                  isEmergency ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {srv.providerName} · {srv.location.reference}
              </p>

              {/* Descripción */}
              <p
                className={`readable-prose mt-2.5 text-xs font-normal leading-relaxed ${
                  isEmergency ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                {srv.description}
              </p>

              {/* Métodos de Pago */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {srv.paymentMethods.includes('efectivo') && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                      isEmergency
                        ? 'bg-slate-800 text-slate-200 border-slate-700'
                        : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    }`}
                  >
                    <Banknote className="h-3 w-3 text-emerald-600" aria-hidden="true" /> Efectivo
                  </span>
                )}
                {srv.paymentMethods.includes('billetera_virtual') && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                      isEmergency
                        ? 'bg-purple-950/60 text-purple-200 border-purple-800'
                        : 'bg-purple-50 text-purple-900 border-purple-200'
                    }`}
                  >
                    <Smartphone className="h-3 w-3 text-purple-600" aria-hidden="true" /> Yape / Plin
                  </span>
                )}
                {srv.paymentMethods.includes('trueque') && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                      isEmergency
                        ? 'bg-indigo-950/70 text-indigo-200 border-indigo-800'
                        : 'bg-indigo-50 text-indigo-900 border-indigo-200'
                    }`}
                  >
                    <ArrowLeftRight className="h-3 w-3 text-indigo-600" aria-hidden="true" /> Trueque
                  </span>
                )}
              </div>

              {srv.barterInterest && (
                <div
                  className={`mt-2.5 rounded-2xl p-2.5 text-xs border ${
                    isEmergency
                      ? 'bg-indigo-950/50 text-indigo-200 border-indigo-800/60'
                      : 'bg-indigo-50/70 text-indigo-950 border-indigo-200/80'
                  }`}
                >
                  <p className="font-bold text-indigo-900">
                    Acepta trueque:{' '}
                    <span className="font-normal text-indigo-950">{srv.barterInterest}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Reputación Vecinal Amigable & Calificación */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-3">
              <div
                className={`rounded-2xl p-3 border transition-colors ${
                  isEmergency
                    ? 'bg-[#151c2c] border-slate-700 text-slate-100'
                    : 'bg-emerald-50/50 border-emerald-200/80 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-base font-black tabular ${
                          isEmergency ? 'text-emerald-400' : 'text-emerald-800'
                        }`}
                      >
                        {srv.weightedScore}%
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          isEmergency ? 'text-slate-200' : 'text-slate-800'
                        }`}
                      >
                        recomendado
                      </span>
                    </div>
                    <p
                      className={`truncate text-[11px] font-medium mt-0.5 ${
                        isEmergency ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {srv.ratings.length > 0
                        ? `Calificado por ${srv.ratings.map((r) => r.userName.split(' ')[0]).join(', ')}`
                        : 'Opinión de la cuadra:'}
                    </p>
                  </div>

                  {/* Caritas Amigables de Alto Contraste */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => rateServiceWithFace(srv.id, 'happy')}
                      aria-label={`Calificar Bien (${srv.happyCount})`}
                      className="flex items-center gap-1 p-0.5 transition pressable"
                    >
                      <RatingFaceIcon
                        sentiment="happy"
                        size="sm"
                        active={srv.userVote === 'happy'}
                        showLabel
                        isDarkTheme={isEmergency}
                      />
                      <span className="text-xs font-black text-emerald-800 tabular">
                        {srv.happyCount}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => rateServiceWithFace(srv.id, 'neutral')}
                      aria-label={`Calificar Regular (${srv.neutralCount})`}
                      className="flex items-center gap-1 p-0.5 transition pressable"
                    >
                      <RatingFaceIcon
                        sentiment="neutral"
                        size="sm"
                        active={srv.userVote === 'neutral'}
                        showLabel
                        isDarkTheme={isEmergency}
                      />
                      <span className="text-xs font-black text-amber-800 tabular">
                        {srv.neutralCount}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => rateServiceWithFace(srv.id, 'angry')}
                      aria-label={`Calificar A mejorar (${srv.angryCount})`}
                      className="flex items-center gap-1 p-0.5 transition pressable"
                    >
                      <RatingFaceIcon
                        sentiment="angry"
                        size="sm"
                        active={srv.userVote === 'angry'}
                        showLabel
                        isDarkTheme={isEmergency}
                      />
                      <span className="text-xs font-black text-rose-800 tabular">
                        {srv.angryCount}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {srv.barterProposals.length > 0 && (
                <div
                  className={`space-y-1.5 rounded-2xl p-2.5 text-xs border ${
                    isEmergency
                      ? 'bg-slate-900 border-slate-700 text-slate-200'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  {srv.barterProposals.map((bp) => (
                    <div key={bp.id} className="flex items-center justify-between gap-2">
                      <span className="truncate">
                        <strong>{bp.proposerName.split(' ')[0]}:</strong> "{bp.offeredExchangeText}"
                      </span>
                      <span className="shrink-0 rounded-full bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        {bp.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Botones de Acción */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-1 items-center gap-2">
                  <a
                    href={`tel:${srv.phone}`}
                    className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition active:scale-95 shadow-xs"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    <span>Llamar al vecino</span>
                  </a>

                  {srv.paymentMethods.includes('trueque') && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveBarterServiceId(activeBarterServiceId === srv.id ? null : srv.id)
                      }
                      className={`inline-flex min-h-[42px] flex-1 items-center justify-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold transition active:scale-95 border ${
                        isEmergency
                          ? 'bg-indigo-950 text-indigo-200 border-indigo-800'
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border-indigo-200'
                      }`}
                    >
                      <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Proponer trueque</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => reportItem(srv.id, 'Revisión solicitada')}
                  aria-label="Reportar anuncio"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                >
                  <Flag className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {activeBarterServiceId === srv.id && (
                <div
                  className={`mt-2 space-y-2 rounded-2xl p-3.5 border-2 animate-scale-in ${
                    isEmergency
                      ? 'bg-slate-900 border-slate-700'
                      : 'bg-indigo-50/70 border-indigo-200'
                  }`}
                >
                  <p className="text-xs font-black text-indigo-950">
                    ¿Qué ofreces a cambio de este servicio?
                  </p>
                  <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
                    {QUICK_BARTER_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setBarterText(chip)}
                        className="shrink-0 rounded-full border border-indigo-300 bg-white px-3 py-1 text-[11px] font-bold text-indigo-900 hover:bg-indigo-100 transition"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={barterText}
                      onChange={(e) => setBarterText(e.target.value)}
                      placeholder="Ej. Te ofrezco 2 porciones de postre o clases..."
                      className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-950 font-medium focus:outline-none focus:border-indigo-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendBarter(srv.id)}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white transition active:scale-95"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
