import {
  ArrowLeftRight,
  Banknote,
  Flag,
  Footprints,
  Phone,
  Search,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import React, { useState } from 'react';
import { RatingFaceIcon } from '../../components/common/RatingFaceIcon';
import { useApp } from '../../context/AppContext';
import { ServiceCategory } from '../../types';

const CATEGORY_LABELS: { id: 'all' | ServiceCategory; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'gastronomia_vecinal', label: 'Gastronomía Casera' },
  { id: 'oficio_hogar', label: 'Cerrajería y Hogar' },
  { id: 'educacion_clases', label: 'Clases y Educación' },
  { id: 'salud_auxilio', label: 'Salud y Auxilio' },
  { id: 'cuidado_paseo', label: 'Cuidado y Paseo' },
];

const QUICK_BARTER_CHIPS = [
  'Ofrezco 2 porciones de lasaña casera',
  'Ofrezco clases de matemáticas / inglés',
  'Cambio por mantenimiento de PC / laptop',
  'Cambio por insumos o materiales de casa',
];

export const ServicesView: React.FC = () => {
  const {
    services,
    mode,
    currentUser,
    rateServiceWithFace,
    submitBarterProposal,
    reportItem,
    openPublishModal,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ServiceCategory>('all');
  const [onlyBarter, setOnlyBarter] = useState(false);
  const [onlyClose, setOnlyClose] = useState(false);
  const [activeBarterServiceId, setActiveBarterServiceId] = useState<string | null>(null);
  const [barterText, setBarterText] = useState('');

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
      if (mode === 'emergency' && a.isEmergencySupport !== b.isEmergencySupport) {
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
    <section aria-labelledby="services-heading" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="services-heading" className="text-xl font-extrabold tracking-tight">
            {mode === 'emergency'
              ? 'Oficios y Brigadas de Soporte en Emergencia'
              : 'Servicios y Productos Avalados por tu Cuadra'}
          </h2>
          <p className="text-xs text-slate-600">
            Reputación ponderada: tu cuenta actual (<strong>{currentUser.accountTier}</strong>) vota
            con peso <strong>{currentUser.reputationWeight}x</strong>
          </p>
        </div>
        <button
          type="button"
          onClick={() => openPublishModal('service')}
          className="min-h-[44px] rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
        >
          + Publicar Oficio / Producto
        </button>
      </div>

      <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <label htmlFor="service-search" className="visually-hidden">
            Buscar oficio, producto o vecino
          </label>
          <input
            id="service-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cerrajero, lasaña casera, gasfitero, clases..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORY_LABELS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`min-h-[38px] rounded-xl px-3 py-1 text-xs font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            aria-pressed={onlyBarter}
            onClick={() => setOnlyBarter(!onlyBarter)}
            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold transition ${
              onlyBarter
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Solo Acepta Trueque / Favor</span>
          </button>

          <button
            type="button"
            aria-pressed={onlyClose}
            onClick={() => setOnlyClose(!onlyClose)}
            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold transition ${
              onlyClose
                ? 'border-emerald-600 bg-emerald-600 text-white'
                : 'border-slate-200 bg-white text-slate-700'
            }`}
          >
            <Footprints className="h-3.5 w-3.5" aria-hidden="true" />
            <span>A menos de 5 min a pie</span>
          </button>
        </div>
      </div>

      <div className="space-y-3.5">
        {filtered.map((srv) => (
          <article
            key={srv.id}
            className={`rounded-2xl border bg-white p-4 shadow-sm transition ${
              srv.isEmergencySupport && mode === 'emergency'
                ? 'border-red-500 ring-1 ring-red-500/40'
                : 'border-slate-200/90'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                    A {srv.location.walkingMinutes} min caminando ({srv.location.distanceMeters}m)
                  </span>
                  {srv.isEmergencySupport && (
                    <span className="rounded-lg bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-800">
                      Soporte de Emergencia 24h
                    </span>
                  )}
                  {srv.syncStatus === 'pending' && (
                    <span className="rounded-lg bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                      Guardado Offline (En cola)
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900">{srv.tradeTitle}</h3>
                <p className="text-xs font-semibold text-slate-600">
                  Por {srv.providerName} · {srv.location.reference}
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block rounded-xl bg-slate-900 px-2.5 py-1 text-xs font-bold text-emerald-400">
                  {srv.weightedScore}% Visto Bueno
                </span>
                <p className="mt-1 text-xs font-bold text-slate-800">{srv.priceRange}</p>
              </div>
            </div>

            <p className="mt-2.5 text-sm text-slate-700">{srv.description}</p>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {srv.trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-700"
                >
                  <ShieldCheck className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
              <span className="text-xs font-semibold text-slate-500">Medios de pago:</span>
              {srv.paymentMethods.includes('efectivo') && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-800">
                  <Banknote className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> Efectivo
                </span>
              )}
              {srv.paymentMethods.includes('billetera_virtual') && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2 py-1 text-xs font-semibold text-purple-800 border border-purple-200">
                  <Smartphone className="h-3.5 w-3.5 text-purple-600" aria-hidden="true" /> Billetera
                  Virtual (Yape/Plin)
                </span>
              )}
              {srv.paymentMethods.includes('trueque') && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-800 border border-indigo-200">
                  <ArrowLeftRight className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />{' '}
                  Acepta Pago en Trueque / Favor
                </span>
              )}
            </div>

            {srv.barterInterest && (
              <div className="mt-2.5 rounded-xl border border-indigo-200/80 bg-indigo-50/60 p-2.5 text-xs text-indigo-950">
                <p className="font-semibold">
                  Interés de Trueque: <span className="font-normal">{srv.barterInterest}</span>
                </p>
              </div>
            )}

            <div className="dark-surface mt-3.5 rounded-2xl border border-slate-800 bg-slate-950 p-3.5 text-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Evalúa este servicio (Peso actual: {currentUser.reputationWeight}x)
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Avalado por:{' '}
                    {srv.ratings
                      .slice(0, 2)
                      .map((r) => r.userName)
                      .join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => rateServiceWithFace(srv.id, 'happy')}
                    aria-label={`Calificar Feliz (${srv.happyCount} votos)`}
                    className="group flex min-h-[48px] items-center gap-1.5 rounded-xl px-1.5"
                  >
                    <RatingFaceIcon
                      sentiment="happy"
                      size="sm"
                      active={srv.userVote === 'happy'}
                      showLabel
                    />
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      {srv.happyCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => rateServiceWithFace(srv.id, 'neutral')}
                    aria-label={`Calificar Neutral (${srv.neutralCount} votos)`}
                    className="group flex min-h-[48px] items-center gap-1.5 rounded-xl px-1.5"
                  >
                    <RatingFaceIcon
                      sentiment="neutral"
                      size="sm"
                      active={srv.userVote === 'neutral'}
                      showLabel
                    />
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {srv.neutralCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => rateServiceWithFace(srv.id, 'angry')}
                    aria-label={`Calificar Enojado (${srv.angryCount} votos)`}
                    className="group flex min-h-[48px] items-center gap-1.5 rounded-xl px-1.5"
                  >
                    <RatingFaceIcon
                      sentiment="angry"
                      size="sm"
                      active={srv.userVote === 'angry'}
                      showLabel
                    />
                    <span className="font-mono text-xs font-bold text-red-400">
                      {srv.angryCount}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {srv.barterProposals.length > 0 && (
              <div className="mt-3 space-y-1.5 rounded-xl bg-slate-50 p-2.5 text-xs">
                <p className="font-bold text-slate-700">Propuestas de Trueque / Favor recientes:</p>
                {srv.barterProposals.map((bp) => (
                  <div
                    key={bp.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5"
                  >
                    <span>
                      <strong>{bp.proposerName}:</strong> "{bp.offeredExchangeText}"
                    </span>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      {bp.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`tel:${srv.phone}`}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Llamar ({srv.phone})</span>
                </a>

                {srv.paymentMethods.includes('trueque') && (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveBarterServiceId(activeBarterServiceId === srv.id ? null : srv.id)
                    }
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-indigo-300 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-900 hover:bg-indigo-100"
                  >
                    <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Escribir Propuesta de Trueque / Favor</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => reportItem(srv.id, 'Revisión solicitada')}
                className="inline-flex min-h-[40px] items-center gap-1 rounded-lg px-2 text-[11px] font-medium text-slate-400 hover:text-red-600"
              >
                <Flag className="h-3 w-3" aria-hidden="true" />
                <span>{srv.isReported ? 'Reportado a Junta Vecinal' : 'Reportar'}</span>
              </button>
            </div>

            {activeBarterServiceId === srv.id && (
              <div className="mt-3 space-y-2.5 rounded-xl border border-indigo-200 bg-indigo-50/70 p-3">
                <label
                  htmlFor={`barter-input-${srv.id}`}
                  className="block text-xs font-bold text-indigo-950"
                >
                  Escribe qué favor, habilidad o producto ofreces en intercambio:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_BARTER_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setBarterText(chip)}
                      className="rounded-lg border border-indigo-200 bg-white px-2 py-1 text-[11px] font-medium text-indigo-800 hover:bg-indigo-100"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    id={`barter-input-${srv.id}`}
                    type="text"
                    value={barterText}
                    onChange={(e) => setBarterText(e.target.value)}
                    placeholder="Ej. Te cambio por 2 horas de clases de matemáticas o almuerzo casero..."
                    className="flex-1 rounded-xl border border-indigo-300 bg-white px-3 py-2 text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendBarter(srv.id)}
                    className="min-h-[40px] rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                  >
                    Enviar Propuesta
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
