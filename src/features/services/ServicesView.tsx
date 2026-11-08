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
  Trash2,
  Users,
  Utensils,
  Wrench,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { RatingFaceIcon } from '../../components/common/RatingFaceIcon';
import { HomeBentoDiscovery } from '../../components/home/HomeBentoDiscovery';
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

interface ConductConfig {
  sentiment: SentimentScore;
  label: string;
  containerClass: string;
  scoreClass: string;
  badgeClass: string;
  subtitleClass: string;
  buttonClass: string;
}

function getConductConfig(score: number, isEmergency: boolean): ConductConfig {
  if (score >= 80) {
    return {
      sentiment: 'happy',
      label: 'Conducta Ejemplar',
      containerClass: isEmergency
        ? 'bg-emerald-950/40 border-2 border-emerald-600/80 text-emerald-100 shadow-xs'
        : 'bg-emerald-50/90 border-2 border-emerald-300 text-emerald-950 shadow-xs',
      scoreClass: isEmergency ? 'text-emerald-300' : 'text-emerald-900',
      badgeClass: isEmergency
        ? 'bg-emerald-900/80 text-emerald-200 border-emerald-500'
        : 'bg-emerald-100 text-emerald-950 border-emerald-400',
      subtitleClass: isEmergency ? 'text-emerald-200' : 'text-emerald-900',
      buttonClass: isEmergency
        ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-600 hover:bg-emerald-800'
        : 'bg-white text-emerald-950 border-2 border-emerald-300 hover:bg-emerald-100/70',
    };
  }
  if (score >= 60) {
    return {
      sentiment: 'neutral',
      label: 'Conducta Aceptable',
      containerClass: isEmergency
        ? 'bg-amber-950/40 border-2 border-amber-600/80 text-amber-100 shadow-xs'
        : 'bg-amber-50/90 border-2 border-amber-300 text-amber-950 shadow-xs',
      scoreClass: isEmergency ? 'text-amber-300' : 'text-amber-900',
      badgeClass: isEmergency
        ? 'bg-amber-900/80 text-amber-200 border-amber-500'
        : 'bg-amber-100 text-amber-950 border-amber-400',
      subtitleClass: isEmergency ? 'text-amber-200' : 'text-amber-900',
      buttonClass: isEmergency
        ? 'bg-amber-900/80 text-amber-200 border border-amber-600 hover:bg-amber-800'
        : 'bg-white text-amber-950 border-2 border-amber-300 hover:bg-amber-100/70',
    };
  }
  return {
    sentiment: 'angry',
    label: 'Conducta en Revisión',
    containerClass: isEmergency
      ? 'bg-rose-950/40 border-2 border-rose-700/80 text-rose-100 shadow-xs'
      : 'bg-rose-50/90 border-2 border-rose-300 text-rose-950 shadow-xs',
    scoreClass: isEmergency ? 'text-rose-300' : 'text-rose-900',
    badgeClass: isEmergency
      ? 'bg-rose-900/80 text-rose-200 border-rose-500'
      : 'bg-rose-100 text-rose-950 border-rose-400',
    subtitleClass: isEmergency ? 'text-rose-200' : 'text-rose-900',
    buttonClass: isEmergency
      ? 'bg-rose-900/80 text-rose-200 border border-rose-600 hover:bg-rose-800'
      : 'bg-white text-rose-950 border-2 border-rose-300 hover:bg-rose-100/70',
  };
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
    updateBarterProposalStatus,
    reportItem,
    deleteService,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ServiceCategory>('all');
  const [onlyBarter, setOnlyBarter] = useState(false);
  const [onlyClose, setOnlyClose] = useState(false);
  const [activeBarterServiceId, setActiveBarterServiceId] = useState<string | null>(null);
  const [barterText, setBarterText] = useState('');
  const [expandedReviewsId, setExpandedReviewsId] = useState<string | null>(null);
  const [openRatingServiceId, setOpenRatingServiceId] = useState<string | null>(null);
  const [reportedIds, setReportedIds] = useState<Record<string, boolean>>({});
  const [proposalSentNotice, setProposalSentNotice] = useState<string | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

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
    <section aria-label="Directorio de servicios del barrio" className="space-y-6">
      {/* Toast Notificación de eliminación */}
      {toastNotice && (
        <div
          role="status"
          className="fixed top-20 right-4 z-50 max-w-sm rounded-2xl bg-neutral-900 text-white p-4 shadow-xl border border-neutral-700 flex items-start gap-3 animate-scale-in"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-400" />
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-wider text-neutral-300">
              Directorio Vecinal
            </p>
            <p className="text-xs font-bold mt-0.5 leading-snug">{toastNotice}</p>
          </div>
        </div>
      )}

      {/* 0. Descubrimiento Macro Bento (Fiel a la jerarquía editorial humana) */}
      {!isEmergency && (
        <HomeBentoDiscovery onSelectCategory={(cat) => setSelectedCategory(cat)} />
      )}

      {/* 1. Header de sección y búsqueda */}
      <div id="servicios-feed" className="space-y-3 pt-1 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                Lo que comparte tu cuadra hoy
              </span>
              <span className="text-xs font-mono text-neutral-400">
                ({filtered.length} activo{filtered.length === 1 ? '' : 's'})
              </span>
            </div>
            <h2
              className={`font-editorial-serif italic text-neutral-900 leading-snug mt-0.5 ${
                isSeniorMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
              } ${isEmergency ? 'text-white' : ''}`}
            >
              Oficios y Saberes de Vecinos
            </h2>
            <p className={`text-xs font-medium mt-0.5 ${isEmergency ? 'text-slate-400' : 'text-slate-500'}`}>
              Trato directo entre familias de Yanahuara a menos de 10 min a pie • Sin intermediarios
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
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                  : isEmergency
                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                  : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300'
              }`}
            >
              <ArrowLeftRight className="h-3 w-3 text-emerald-600" />
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
          const isOwnPost = Boolean(
            (srv.providerDni && srv.providerDni === currentUser.dni) ||
            (srv.providerId && srv.providerId === currentUser.id) ||
            (srv.providerName && srv.providerName.trim().toLowerCase() === currentUser.fullName.trim().toLowerCase())
          );
          const isReported = reportedIds[srv.id] || srv.isReported;
          const isBarterActive = activeBarterServiceId === srv.id;
          const isReviewsOpen = expandedReviewsId === srv.id;
          const isRatingOpen = openRatingServiceId === srv.id;
          const catColor = CATEGORY_COLORS[srv.category] || CATEGORY_COLORS.oficio_hogar;
          const conduct = getConductConfig(srv.weightedScore, isEmergency);
          const totalOpinions = srv.happyCount + srv.neutralCount + srv.angryCount;
          const topReviewers = srv.ratings.map((r) => r.userName.split(' ')[0]).slice(0, 2).join(', ');

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
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-xs font-bold truncate ${isEmergency ? 'text-slate-200' : 'text-slate-900'}`}>
                        {srv.providerName}
                      </span>
                      {isOwnPost && (
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                          Tú
                        </span>
                      )}
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

              {/* Título y Descripción con Estilo Editorial */}
              <div className="mt-3">
                <h3 className={`font-editorial-serif italic text-lg sm:text-xl text-[#1A1917] leading-snug font-medium ${isEmergency ? 'text-white' : ''}`}>
                  "{srv.tradeTitle}"
                </h3>
                <p className={`mt-1.5 text-xs sm:text-sm leading-relaxed max-w-[65ch] ${isEmergency ? 'text-slate-300' : 'text-neutral-700'}`}>
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
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                    <ArrowLeftRight className="h-3 w-3 text-emerald-600" /> Trueque
                  </span>
                )}
              </div>

              {/* Interés de Trueque */}
              {srv.barterInterest && (
                <div
                  className={`mt-2.5 p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                    isEmergency
                      ? 'bg-slate-800/80 border-slate-700 text-emerald-200'
                      : 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
                  }`}
                >
                  <ArrowLeftRight className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-900 block text-[11px]">Intercambio aceptado:</span>
                    <span className="text-[11px] leading-relaxed text-emerald-950">{srv.barterInterest}</span>
                  </div>
                </div>
              )}

              {/* Medallón de Reputación / Estado de Publicación */}
              {/* Propuestas de Trueque Comunitario */}
              {srv.barterProposals && srv.barterProposals.length > 0 && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <ArrowLeftRight className="h-3 w-3 text-emerald-600" />
                      Propuestas de trueque ({srv.barterProposals.length})
                    </span>
                  </div>
                  {srv.barterProposals.map((prop) => (
                    <div
                      key={prop.id}
                      className={`p-2.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        prop.status === 'aceptado'
                          ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                          : prop.status === 'rechazado'
                          ? 'bg-slate-50 border-slate-200 text-slate-500'
                          : 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-[11px] text-slate-900">{prop.proposerName}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase ${
                              prop.status === 'aceptado'
                                ? 'bg-emerald-200 text-emerald-900'
                                : prop.status === 'rechazado'
                                ? 'bg-slate-200 text-slate-700'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {prop.status === 'aceptado'
                              ? '✓ Trueque acordado'
                              : prop.status === 'rechazado'
                              ? 'Declinado'
                              : 'Propuesta pendiente'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{prop.createdAt}</span>
                        </div>
                        <p className={`mt-0.5 text-xs font-medium ${prop.status === 'rechazado' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          "{prop.offeredExchangeText}"
                        </p>
                      </div>

                      {isOwnPost && prop.status === 'pendiente' && (
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => updateBarterProposalStatus(srv.id, prop.id, 'aceptado')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] shadow-2xs transition active:scale-95"
                          >
                            Aceptar trueque
                          </button>
                          <button
                            type="button"
                            onClick={() => updateBarterProposalStatus(srv.id, prop.id, 'rechazado')}
                            className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[11px] transition active:scale-95"
                          >
                            Declinar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {isOwnPost ? (
                <div className="mt-3 p-3.5 border-2 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="shrink-0 drop-shadow-xs">
                      <RatingFaceIcon
                        sentiment={conduct.sentiment}
                        size="md"
                        isDarkTheme={isEmergency}
                        showLabel={false}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-700 text-white border border-emerald-800">
                          Tu publicación activa
                        </span>
                        <span className="text-[11px] font-bold text-emerald-900">
                          {totalOpinions > 0 ? `${srv.weightedScore}% respaldo vecinal` : 'Visible en tu cuadra'}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-950/80 font-medium truncate mt-0.5">
                        {totalOpinions > 0
                          ? `Avalado por ${topReviewers} (${totalOpinions} ${totalOpinions === 1 ? 'opinión' : 'opiniones'}).`
                          : 'Aún no tiene opiniones de vecinos (publicación reciente).'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`¿Retirar "${srv.tradeTitle}" del directorio de la cuadra?`)) {
                          deleteService(srv.id);
                          setToastNotice(`Aviso "${srv.tradeTitle}" eliminado con éxito.`);
                          setTimeout(() => setToastNotice(null), 3500);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 transition active:scale-95 shadow-2xs"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Eliminar aviso</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Medallón de Reputación y Calificación 3D con Caritas (Anthony UI Polish) */
                <div className="mt-3 relative w-full h-[106px] flip-card-container">
                  <div className={`flip-card-inner ${isRatingOpen ? 'is-flipped' : ''}`}>
                    {/* Cara A (Front): Medallón de Conducta */}
                    <div
                      className={`flip-card-front p-3.5 border-2 rounded-2xl flex items-center justify-between gap-2.5 ${conduct.containerClass} ${
                        isRatingOpen ? 'pointer-events-none' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="shrink-0 drop-shadow-xs">
                          <RatingFaceIcon
                            sentiment={conduct.sentiment}
                            size="md"
                            isDarkTheme={isEmergency}
                            showLabel={false}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-xl font-black tabular leading-none ${conduct.scoreClass}`}>
                              {srv.weightedScore}%
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border ${conduct.badgeClass}`}
                            >
                              {conduct.label}
                            </span>
                          </div>
                          <p className={`text-[11px] font-bold truncate mt-1 ${conduct.subtitleClass}`}>
                            {srv.ratings.length > 0
                              ? `Avalado por ${topReviewers} (${totalOpinions} ${totalOpinions === 1 ? 'opinión' : 'opiniones'})`
                              : 'Vecino nuevo · Sin observaciones'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setOpenRatingServiceId(srv.id)}
                        aria-label={`Calificar trato de ${srv.providerName}`}
                        className={`shrink-0 inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-xs font-black transition active:scale-95 shadow-xs ${conduct.buttonClass}`}
                      >
                        <span>{srv.userVote ? 'Mi voto' : 'Calificar trato'}</span>
                      </button>
                    </div>

                    {/* Cara B (Back): Selector de Caritas */}
                    <div
                      className={`flip-card-back p-3 border-2 rounded-2xl flex flex-col justify-between ${
                        isEmergency
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-white border-slate-200/90 text-slate-950 shadow-xs'
                      } ${!isRatingOpen ? 'pointer-events-none' : ''}`}
                    >
                      <div className="flex items-center justify-between px-1">
                        <span className={`text-[10.5px] font-black uppercase tracking-wider ${isEmergency ? 'text-slate-400' : 'text-slate-500'}`}>
                          Calificar trato
                        </span>
                        <button
                          type="button"
                          onClick={() => setOpenRatingServiceId(null)}
                          aria-label="Cerrar calificación"
                          className={`h-5 w-5 flex items-center justify-center rounded-full transition-all active:scale-90 ${
                            isEmergency
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950'
                          }`}
                        >
                          <X className="h-3 w-3 stroke-[2.5]" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 w-full mt-1.5">
                        <button
                          type="button"
                          aria-pressed={srv.userVote === 'happy'}
                          onClick={() => {
                            handleVote(srv.id, 'happy');
                            setTimeout(() => setOpenRatingServiceId(null), 500);
                          }}
                          className={`h-[52px] flex flex-col items-center justify-center py-1 px-1 rounded-xl border-2 transition-all active:scale-95 ${
                            srv.userVote === 'happy'
                              ? isEmergency
                                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/30'
                                : 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs ring-2 ring-emerald-500/20'
                              : isEmergency
                              ? 'bg-slate-800/90 border-slate-700 text-slate-200 hover:border-emerald-400 hover:bg-emerald-950/40'
                              : 'bg-slate-50/90 hover:bg-emerald-50/60 border-slate-200 hover:border-emerald-400 text-slate-800 shadow-2xs'
                          }`}
                        >
                          <RatingFaceIcon sentiment="happy" size="sm" bare={true} showLabel={false} isDarkTheme={isEmergency} />
                          <span className="text-[10.5px] font-black mt-1 leading-none">Buen trato</span>
                        </button>

                        <button
                          type="button"
                          aria-pressed={srv.userVote === 'neutral'}
                          onClick={() => {
                            handleVote(srv.id, 'neutral');
                            setTimeout(() => setOpenRatingServiceId(null), 500);
                          }}
                          className={`h-[52px] flex flex-col items-center justify-center py-1 px-1 rounded-xl border-2 transition-all active:scale-95 ${
                            srv.userVote === 'neutral'
                              ? isEmergency
                                ? 'bg-amber-950/80 border-amber-400 text-amber-200 ring-2 ring-amber-500/30'
                                : 'bg-amber-50 border-amber-500 text-amber-950 shadow-xs ring-2 ring-amber-500/20'
                              : isEmergency
                              ? 'bg-slate-800/90 border-slate-700 text-slate-200 hover:border-amber-400 hover:bg-amber-950/40'
                              : 'bg-slate-50/90 hover:bg-amber-50/60 border-slate-200 hover:border-amber-400 text-slate-800 shadow-2xs'
                          }`}
                        >
                          <RatingFaceIcon sentiment="neutral" size="sm" bare={true} showLabel={false} isDarkTheme={isEmergency} />
                          <span className="text-[10.5px] font-black mt-1 leading-none">Regular</span>
                        </button>

                        <button
                          type="button"
                          aria-pressed={srv.userVote === 'angry'}
                          onClick={() => {
                            handleVote(srv.id, 'angry');
                            setTimeout(() => setOpenRatingServiceId(null), 500);
                          }}
                          className={`h-[52px] flex flex-col items-center justify-center py-1 px-1 rounded-xl border-2 transition-all active:scale-95 ${
                            srv.userVote === 'angry'
                              ? isEmergency
                                ? 'bg-rose-950/80 border-rose-400 text-rose-200 ring-2 ring-rose-500/30'
                                : 'bg-rose-50 border-rose-500 text-rose-950 shadow-xs ring-2 ring-rose-500/20'
                              : isEmergency
                              ? 'bg-slate-800/90 border-slate-700 text-slate-200 hover:border-rose-400 hover:bg-rose-950/40'
                              : 'bg-slate-50/90 hover:bg-rose-50/60 border-slate-200 hover:border-rose-400 text-slate-800 shadow-2xs'
                          }`}
                        >
                          <RatingFaceIcon sentiment="angry" size="sm" bare={true} showLabel={false} isDarkTheme={isEmergency} />
                          <span className="text-[10.5px] font-black mt-1 leading-none">A mejorar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Acciones y opiniones */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  {srv.ratings.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setExpandedReviewsId(isReviewsOpen ? null : srv.id)}
                      className="text-[11px] font-bold text-slate-600 hover:text-slate-950 hover:underline flex items-center gap-1"
                    >
                      <span>Ver opiniones ({srv.ratings.length})</span>
                      {isReviewsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isOwnPost ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-neutral-500 italic">
                        Tu aviso en el barrio
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`¿Retirar "${srv.tradeTitle}" del directorio de la cuadra?`)) {
                            deleteService(srv.id);
                            setToastNotice(`Aviso "${srv.tradeTitle}" eliminado.`);
                            setTimeout(() => setToastNotice(null), 3500);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition active:scale-95"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Eliminar mi aviso</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      {srv.paymentMethods.includes('trueque') && !isMinor && (
                        <button
                          type="button"
                          onClick={() => setActiveBarterServiceId(isBarterActive ? null : srv.id)}
                          className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 transition active:scale-95 shadow-2xs inline-flex items-center gap-1.5"
                        >
                          <ArrowLeftRight className="h-3.5 w-3.5 text-neutral-500" />
                          <span>Proponer trueque</span>
                        </button>
                      )}

                      <a
                        href={`tel:${srv.phone}`}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition active:scale-95"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>Llamar al vecino</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleReport(srv.id)}
                        title={isReported ? 'Reportado para moderación' : 'Reportar publicación'}
                        className={`p-1.5 rounded-lg transition ${isReported ? 'text-amber-500' : 'text-slate-300 hover:text-slate-600'}`}
                      >
                        <Flag className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

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
                <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 animate-scale-in space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950">¿Qué ofreces a cambio a {srv.providerName.split(' ')[0]}?</span>
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
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-900 hover:bg-emerald-100"
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
                      className="flex-1 rounded-xl px-3 py-1.5 text-xs bg-white border border-emerald-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendBarter(srv.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs"
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
