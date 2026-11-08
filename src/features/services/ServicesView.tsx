import {
  AlertCircle,
  ArrowLeftRight,
  Banknote,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Flag,
  Footprints,
  HeartPulse,
  Home,
  Phone,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Users,
  Utensils,
  Wrench,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { RatingFaceIcon } from '../../components/common/RatingFaceIcon';
import { useApp } from '../../context/AppContext';
import { SentimentScore, ServiceCategory } from '../../types';

const CATEGORY_DEFS: { id: 'all' | ServiceCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'Todos', icon: Sparkles },
  { id: 'gastronomia_vecinal', label: 'Comida casera', icon: Utensils },
  { id: 'oficio_hogar', label: 'Hogar y oficios', icon: Wrench },
  { id: 'educacion_clases', label: 'Clases', icon: BookOpen },
  { id: 'cuidado_paseo', label: 'Cuidado y paseo', icon: Users },
  { id: 'salud_auxilio', label: 'Salud', icon: HeartPulse },
  { id: 'brigada_soporte', label: 'Brigada', icon: Home },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  gastronomia_vecinal: { bg: 'bg-amber-50 text-amber-950', text: 'text-amber-800', icon: 'bg-amber-500 text-white' },
  oficio_hogar: { bg: 'bg-emerald-50 text-emerald-950', text: 'text-emerald-800', icon: 'bg-emerald-600 text-white' },
  educacion_clases: { bg: 'bg-blue-50 text-blue-950', text: 'text-blue-800', icon: 'bg-blue-600 text-white' },
  cuidado_paseo: { bg: 'bg-violet-50 text-violet-950', text: 'text-violet-800', icon: 'bg-violet-600 text-white' },
  salud_auxilio: { bg: 'bg-rose-50 text-rose-950', text: 'text-rose-800', icon: 'bg-rose-600 text-white' },
  brigada_soporte: { bg: 'bg-teal-50 text-teal-950', text: 'text-teal-800', icon: 'bg-teal-600 text-white' },
};

const QUICK_BARTER_CHIPS = [
  '2 porciones de lasaña casera',
  'Clases de matemáticas o inglés',
  'Mantenimiento de laptop / PC',
  'Insumos o materiales de casa',
  'Apoyo en arreglos del hogar',
  'Cuidado o paseo de mascotas',
];

interface VoteFeedback {
  sentiment: SentimentScore;
  weight: number;
  tier: string;
}

export const ServicesView: React.FC = () => {
  const {
    services,
    currentUser,
    mode,
    activeTab,
    isSeniorMode,
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
  const [expandedReviewsId, setExpandedReviewsId] = useState<string | null>(null);
  const [votingOpenId, setVotingOpenId] = useState<string | null>(null);
  const [reportedIds, setReportedIds] = useState<Record<string, boolean>>({});
  const [voteFeedback, setVoteFeedback] = useState<Record<string, VoteFeedback>>({});
  const [proposalSentNotice, setProposalSentNotice] = useState<string | null>(null);

  const isEmergency = mode === 'emergency' || activeTab === 'emergency';
  const isMinor = !currentUser.isVerifiedAdult;

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

  const handleVote = (serviceId: string, sentiment: SentimentScore) => {
    rateServiceWithFace(serviceId, sentiment);
    setVoteFeedback((prev) => ({
      ...prev,
      [serviceId]: {
        sentiment,
        weight: currentUser.reputationWeight,
        tier: currentUser.accountTier,
      },
    }));
  };

  const handleSendBarter = (serviceId: string) => {
    if (!barterText.trim()) return;
    submitBarterProposal(serviceId, barterText);
    setBarterText('');
    setActiveBarterServiceId(null);
    setProposalSentNotice(serviceId);
    setTimeout(() => {
      setProposalSentNotice(null);
    }, 4000);
  };

  const handleReport = (serviceId: string) => {
    reportItem(serviceId, 'Revisión comunitaria solicitada');
    setReportedIds((prev) => ({ ...prev, [serviceId]: true }));
  };

  return (
    <section aria-label="Directorio de servicios del barrio" className="space-y-4">
      {/* 1. Header con tipografía suiza y búsqueda despejada */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2
              className={`font-black tracking-tight ${
                isSeniorMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
              } ${isEmergency ? 'text-white' : 'text-slate-950'}`}
            >
              Oficios y Servicios Vecinales
            </h2>
            <p className={`text-xs font-medium mt-0.5 ${isEmergency ? 'text-slate-400' : 'text-slate-500'}`}>
              {filtered.length} anuncio{filtered.length === 1 ? '' : 's'} en Yanahuara a menos de 10 min a pie • Sin intermediarios ni comisiones
            </p>
          </div>

          <div
            className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 border self-start sm:self-auto text-xs font-semibold ${
              isEmergency
                ? 'bg-slate-900 border-slate-800 text-slate-300'
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>
              Sesión activa:{' '}
              <strong className="font-bold">
                {currentUser.accountTier === 'referente'
                  ? 'Vecino Referente'
                  : currentUser.accountTier === 'activo'
                  ? 'Vecino Verificado'
                  : 'Vecino del Barrio'}
              </strong>
            </span>
          </div>
        </div>

        {/* Barra de Búsqueda Despejada con 1px border */}
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="service-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cerrajero, comida casera, gasfitero, clases particulares..."
            className={`w-full rounded-2xl py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium transition focus:outline-none border ${
              isEmergency
                ? 'bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus:border-red-500'
                : 'bg-white border-slate-200/90 text-slate-950 placeholder:text-slate-400 shadow-2xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/20'
            }`}
          />
        </div>

        {/* Chips de Categorías y Filtros Refinados */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-0.5 max-w-full">
            {CATEGORY_DEFS.map((cat) => {
              const active = selectedCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
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
                  <Icon className={`h-3.5 w-3.5 ${active ? (isEmergency ? 'text-slate-950' : 'text-emerald-400') : 'text-slate-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-pressed={onlyBarter}
              onClick={() => setOnlyBarter(!onlyBarter)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition active:scale-95 border ${
                onlyBarter
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                  : isEmergency
                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                  : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
              }`}
            >
              <ArrowLeftRight className="h-3 w-3 text-indigo-500" />
              <span>Acepta trueque</span>
            </button>

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

      {/* 2. Feed de Servicios: Formato Inset Grouped / Swiss Cards */}
      <div className="space-y-3">
        {filtered.map((srv) => {
          const isReported = reportedIds[srv.id] || srv.isReported;
          const isBarterActive = activeBarterServiceId === srv.id;
          const isReviewsOpen = expandedReviewsId === srv.id;
          const isVotingOpen = votingOpenId === srv.id;
          const catColor = CATEGORY_COLORS[srv.category] || CATEGORY_COLORS.oficio_hogar;

          return (
            <article
              key={srv.id}
              className={`rounded-2xl border transition-all p-4 sm:p-5 ${
                isEmergency
                  ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-xs'
                  : 'bg-white border-slate-200/90 text-slate-950 shadow-2xs hover:border-slate-300'
              }`}
            >
              {/* Alerta si es brigada de emergencia */}
              {isEmergency && srv.isEmergencySupport && (
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-lg bg-red-950/70 border border-red-500/40 px-2.5 py-1 text-[11px] font-bold text-red-300">
                  <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                  <span>Soporte Comunitario Activo en Emergencia</span>
                </div>
              )}

              {/* Encabezado: Avatar + Proveedor + Distancia y Precio */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-sm shadow-2xs ${
                      catColor.icon
                    }`}
                  >
                    {srv.providerName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold truncate ${isEmergency ? 'text-slate-200' : 'text-slate-900'}`}>
                        {srv.providerName}
                      </span>
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="truncate">{srv.location.reference}</span>
                      <span>•</span>
                      <span className="tabular inline-flex items-center gap-1 text-emerald-700 font-semibold shrink-0">
                        <Footprints className="h-3 w-3" />
                        {srv.location.walkingMinutes} min a pie ({srv.location.distanceMeters}m)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Precio destacado en mono tabular */}
                <div className="text-right shrink-0">
                  <span className={`text-xs sm:text-sm font-black tabular tracking-tight ${isEmergency ? 'text-emerald-400' : 'text-slate-950'}`}>
                    {srv.priceRange}
                  </span>
                  {srv.syncStatus === 'pending' && (
                    <span className="block text-[10px] text-amber-600 font-medium mt-0.5">
                      Local
                    </span>
                  )}
                </div>
              </div>

              {/* Título y Descripción */}
              <div className="mt-3">
                <h3 className={`text-base sm:text-lg font-black tracking-tight leading-snug ${isEmergency ? 'text-white' : 'text-slate-950'}`}>
                  {srv.tradeTitle}
                </h3>
                <p className={`mt-1.5 text-xs sm:text-sm leading-relaxed max-w-[65ch] ${isEmergency ? 'text-slate-300' : 'text-slate-600'}`}>
                  {srv.description}
                </p>
              </div>

              {/* Métodos de Pago y Trueque */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {srv.paymentMethods.includes('efectivo') && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    <Banknote className="h-3 w-3 text-emerald-600" /> Efectivo
                  </span>
                )}
                {srv.paymentMethods.includes('billetera_virtual') && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-900 border border-purple-200">
                    <Smartphone className="h-3 w-3 text-purple-600" /> Yape / Plin
                  </span>
                )}
                {srv.paymentMethods.includes('trueque') && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-900 border border-indigo-200">
                    <ArrowLeftRight className="h-3 w-3 text-indigo-600" /> Trueque
                  </span>
                )}
              </div>

              {/* Interés de Trueque */}
              {srv.barterInterest && (
                <div
                  className={`mt-2.5 p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                    isEmergency
                      ? 'bg-slate-800/80 border-slate-700 text-indigo-200'
                      : 'bg-indigo-50/60 border-indigo-200/80 text-indigo-950'
                  }`}
                >
                  <ArrowLeftRight className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-indigo-900 block text-[11px]">Intercambio aceptado:</span>
                    <span className="text-[11px] leading-relaxed text-indigo-950">{srv.barterInterest}</span>
                  </div>
                </div>
              )}

              {/* Línea Divisoria Inferior y Acciones */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                {/* Lado izquierdo: Confianza comunitaria y botón calificar */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span className={`font-black tabular ${isEmergency ? 'text-emerald-400' : 'text-slate-900'}`}>
                      {srv.weightedScore}%
                    </span>
                    <span className="text-[11px] text-slate-500">
                      ({srv.ratings.length} aval{srv.ratings.length === 1 ? '' : 'es'})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setVotingOpenId(isVotingOpen ? null : srv.id)}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                  >
                    {isVotingOpen ? 'Ocultar' : 'Calificar'}
                  </button>

                  {srv.ratings.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setExpandedReviewsId(isReviewsOpen ? null : srv.id)}
                      className="text-[11px] font-medium text-slate-500 hover:text-slate-800 hover:underline flex items-center gap-0.5"
                    >
                      <span>Opiniones</span>
                      {isReviewsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                  )}
                </div>

                {/* Lado derecho: Botones de Acción Primaria */}
                <div className="flex items-center gap-2">
                  {srv.paymentMethods.includes('trueque') && !isMinor && (
                    <button
                      type="button"
                      onClick={() => setActiveBarterServiceId(isBarterActive ? null : srv.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition active:scale-95"
                    >
                      Proponer Trueque
                    </button>
                  )}

                  <a
                    href={`tel:${srv.phone}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition active:scale-95"
                  >
                    <Phone className="h-3 w-3" />
                    <span>Llamar</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleReport(srv.id)}
                    title={isReported ? 'Reportado para moderación' : 'Reportar publicación'}
                    className={`p-1.5 rounded-lg transition ${isReported ? 'text-amber-500' : 'text-slate-300 hover:text-slate-600'}`}
                  >
                    <Flag className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Panel Desplegable de Calificación (Caritas Táctiles) */}
              {isVotingOpen && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 animate-scale-in flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700">Tu valoración vecinal:</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleVote(srv.id, 'happy')}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white text-xs font-bold text-emerald-800 transition active:scale-90"
                    >
                      <RatingFaceIcon sentiment="happy" size="sm" active={srv.userVote === 'happy'} isDarkTheme={isEmergency} />
                      <span>Bien ({srv.happyCount})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVote(srv.id, 'neutral')}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white text-xs font-bold text-amber-800 transition active:scale-90"
                    >
                      <RatingFaceIcon sentiment="neutral" size="sm" active={srv.userVote === 'neutral'} isDarkTheme={isEmergency} />
                      <span>Regular ({srv.neutralCount})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVote(srv.id, 'angry')}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white text-xs font-bold text-rose-800 transition active:scale-90"
                    >
                      <RatingFaceIcon sentiment="angry" size="sm" active={srv.userVote === 'angry'} isDarkTheme={isEmergency} />
                      <span>A mejorar ({srv.angryCount})</span>
                    </button>
                  </div>
                  {voteFeedback[srv.id] && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Voto {voteFeedback[srv.id].weight}x guardado
                    </span>
                  )}
                </div>
              )}

              {/* Panel Desplegable de Opiniones */}
              {isReviewsOpen && (
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 animate-scale-in">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Avales verificados en Yanahuara
                  </h4>
                  {srv.ratings.map((r, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900">{r.userName}</span>
                        <span className="text-slate-400 font-mono">{r.createdAt}</span>
                      </div>
                      <p className="text-slate-600 text-xs italic">"{r.comment || 'Vecino cumplido y recomendado.'}"</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Panel Desplegable de Propuesta de Trueque */}
              {isBarterActive && (
                <div className="mt-3 p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 animate-scale-in space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-950">¿Qué ofreces a cambio a {srv.providerName.split(' ')[0]}?</span>
                    <button type="button" onClick={() => setActiveBarterServiceId(null)} className="text-slate-400 hover:text-slate-700">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {QUICK_BARTER_CHIPS.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setBarterText(chip)}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-900 hover:bg-indigo-100"
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
                      placeholder="Ej. Te ofrezco 2 fuentes de comida o soporte técnico..."
                      className="flex-1 rounded-xl px-3 py-1.5 text-xs bg-white border border-indigo-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendBarter(srv.id)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs"
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              )}

              {proposalSentNotice === srv.id && (
                <div className="mt-2 p-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 animate-scale-in">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>¡Propuesta de trueque enviada a {srv.providerName}!</span>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};
