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
    <section aria-label="Directorio del barrio" className="space-y-3.5">
      <div className="space-y-2.5">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
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
            placeholder="Buscar cerrajero, lasaña, clases..."
            className={`w-full rounded-2xl border py-2.5 pl-10 pr-4 text-sm transition focus:outline-none ${
              isEmergency
                ? 'border-slate-800 bg-slate-900 text-white placeholder:text-slate-500'
                : 'border-slate-200/80 bg-white text-slate-900 placeholder:text-slate-400 shadow-2xs'
            }`}
          />
        </div>

        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {CATEGORY_LABELS.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? isEmergency
                      ? 'bg-white text-slate-950'
                      : 'bg-slate-900 text-white'
                    : isEmergency
                    ? 'bg-slate-900 text-slate-300 border border-slate-800'
                    : 'bg-white text-slate-600 border border-slate-200/70'
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
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
              onlyBarter
                ? 'bg-indigo-600 text-white'
                : isEmergency
                ? 'bg-slate-900 text-slate-300 border border-slate-800'
                : 'bg-white/80 text-slate-600 border border-slate-200/80'
            }`}
          >
            <ArrowLeftRight className="h-3 w-3" aria-hidden="true" />
            <span>Acepta trueque</span>
          </button>

          <button
            type="button"
            aria-pressed={onlyClose}
            onClick={() => setOnlyClose(!onlyClose)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
              onlyClose
                ? 'bg-emerald-600 text-white'
                : isEmergency
                ? 'bg-slate-900 text-slate-300 border border-slate-800'
                : 'bg-white/80 text-slate-600 border border-slate-200/80'
            }`}
          >
            <Footprints className="h-3 w-3" aria-hidden="true" />
            <span>A menos de 5 min</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((srv) => (
          <article
            key={srv.id}
            className={`rounded-3xl p-4 transition ${
              isEmergency
                ? 'bg-[#121826] border border-slate-800 text-slate-100'
                : 'bg-white border border-slate-200/60 text-slate-900 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="tabular inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <Footprints className="h-3.5 w-3.5" aria-hidden="true" />A{' '}
                {srv.location.walkingMinutes} min a pie ({srv.location.distanceMeters}m)
              </span>

              <div className="flex items-center gap-1.5">
                {srv.syncStatus === 'pending' && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    Guardado
                  </span>
                )}
                <span
                  className={`tabular rounded-full px-2.5 py-0.5 font-semibold ${
                    isEmergency ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {srv.priceRange}
                </span>
              </div>
            </div>

            <h3 className="heading-tight mt-1.5 text-[16px] font-bold leading-snug">{srv.tradeTitle}</h3>
            <p className={`mt-0.5 text-xs ${isEmergency ? 'text-slate-400' : 'text-slate-500'}`}>
              {srv.providerName} · {srv.location.reference}
            </p>

            <p
              className={`readable-prose mt-2 text-[13px] leading-relaxed ${
                isEmergency ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {srv.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {srv.paymentMethods.includes('efectivo') && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    isEmergency ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Banknote className="h-3 w-3 text-emerald-500" aria-hidden="true" /> Efectivo
                </span>
              )}
              {srv.paymentMethods.includes('billetera_virtual') && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    isEmergency ? 'bg-purple-950/60 text-purple-300' : 'bg-purple-50 text-purple-700'
                  }`}
                >
                  <Smartphone className="h-3 w-3 text-purple-500" aria-hidden="true" /> Yape / Plin
                </span>
              )}
              {srv.paymentMethods.includes('trueque') && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    isEmergency ? 'bg-indigo-950/70 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                  }`}
                >
                  <ArrowLeftRight className="h-3 w-3 text-indigo-500" aria-hidden="true" /> Trueque
                </span>
              )}
            </div>

            {srv.barterInterest && (
              <p
                className={`mt-2 rounded-2xl px-3 py-2 text-xs ${
                  isEmergency
                    ? 'bg-indigo-950/40 text-indigo-200 border border-indigo-800/40'
                    : 'bg-indigo-50/70 text-indigo-900'
                }`}
              >
                <span className="font-semibold">Acepta en trueque:</span> {srv.barterInterest}
              </p>
            )}

            <div className="dark-surface mt-3 rounded-2xl border border-slate-800/90 bg-[#0B0E14] px-3.5 py-3 text-slate-100">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#22FF66]">{srv.weightedScore}%</span>
                    <span className="text-xs font-medium text-slate-300">recomendado</span>
                  </div>
                  <p className="truncate text-[11px] text-slate-400">
                    {srv.ratings.length > 0
                      ? `Por ${srv.ratings.map((r) => r.userName.split(' ')[0]).join(', ')}`
                      : 'Sé el primero en opinar'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => rateServiceWithFace(srv.id, 'happy')}
                    aria-label={`Calificar Feliz (${srv.happyCount})`}
                    className="flex items-center gap-1 rounded-xl p-0.5"
                  >
                    <RatingFaceIcon
                      sentiment="happy"
                      size="sm"
                      active={srv.userVote === 'happy'}
                      showLabel
                    />
                    <span className="font-mono text-[11px] font-bold text-[#22FF66]">
                      {srv.happyCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => rateServiceWithFace(srv.id, 'neutral')}
                    aria-label={`Calificar Neutral (${srv.neutralCount})`}
                    className="flex items-center gap-1 rounded-xl p-0.5"
                  >
                    <RatingFaceIcon
                      sentiment="neutral"
                      size="sm"
                      active={srv.userVote === 'neutral'}
                      showLabel
                    />
                    <span className="font-mono text-[11px] font-bold text-[#FFC425]">
                      {srv.neutralCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => rateServiceWithFace(srv.id, 'angry')}
                    aria-label={`Calificar Enojado (${srv.angryCount})`}
                    className="flex items-center gap-1 rounded-xl p-0.5"
                  >
                    <RatingFaceIcon
                      sentiment="angry"
                      size="sm"
                      active={srv.userVote === 'angry'}
                      showLabel
                    />
                    <span className="font-mono text-[11px] font-bold text-[#FF2E4C]">
                      {srv.angryCount}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {srv.barterProposals.length > 0 && (
              <div
                className={`mt-2.5 space-y-1 rounded-2xl p-2.5 text-xs ${
                  isEmergency ? 'bg-slate-900' : 'bg-slate-50'
                }`}
              >
                {srv.barterProposals.map((bp) => (
                  <div key={bp.id} className="flex items-center justify-between gap-2">
                    <span className="truncate">
                      <strong>{bp.proposerName.split(' ')[0]}:</strong> "{bp.offeredExchangeText}"
                    </span>
                    <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                      {bp.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex flex-1 items-center gap-2">
                <a
                  href={`tel:${srv.phone}`}
                  className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition active:scale-98"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Llamar</span>
                </a>

                {srv.paymentMethods.includes('trueque') && (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveBarterServiceId(activeBarterServiceId === srv.id ? null : srv.id)
                    }
                    className={`inline-flex min-h-[42px] flex-1 items-center justify-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-semibold transition active:scale-98 ${
                      isEmergency
                        ? 'bg-indigo-950 text-indigo-200 border border-indigo-800'
                        : 'bg-indigo-50 text-indigo-700'
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
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:text-red-500"
              >
                <Flag className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            {activeBarterServiceId === srv.id && (
              <div
                className={`mt-3 space-y-2 rounded-2xl p-3 ${
                  isEmergency ? 'bg-slate-900 border border-slate-800' : 'bg-slate-50'
                }`}
              >
                <p className="text-xs font-semibold">¿Qué ofreces a cambio?</p>
                <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
                  {QUICK_BARTER_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setBarterText(chip)}
                      className="shrink-0 rounded-full border border-indigo-200 bg-white px-2.5 py-1 text-[11px] font-medium text-indigo-700"
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
                    placeholder="Ej. Te cambio por clases de inglés o almuerzo..."
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendBarter(srv.id)}
                    className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};
