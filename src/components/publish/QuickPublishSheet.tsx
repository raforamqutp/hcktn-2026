import {
  AlertTriangle,
  ArrowLeftRight,
  Check,
  CheckCircle2,
  HandHeart,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { createNeighborhoodPoint } from '../../services/geoService';
import { EdanCategory, FavorCategory, PaymentMethod, ServiceCategory } from '../../types';

interface QuickTemplate {
  label: string;
  title: string;
  description: string;
  serviceCategory?: ServiceCategory;
  priceRange?: string;
  barterInterest?: string;
  favorCategory?: FavorCategory;
  direction?: 'ofrezco' | 'solicito';
  safeMeetingPoint?: string;
  edanCategory?: EdanCategory;
  tags?: string[];
}

const TEMPLATES: Record<'service' | 'favor' | 'emergency', QuickTemplate[]> = {
  service: [
    {
      label: 'Comida casera / repostería',
      title: 'Lasañas artesanales y pastelitos recién horneados',
      description: 'Preparadas en casa con insumos frescos para compartir entre vecinos de la cuadra.',
      serviceCategory: 'gastronomia_vecinal',
      priceRange: 'Porción S/ 14 · Fuente familiar S/ 42',
      barterInterest: 'Acepto insumos de repostería, frutas o clases de inglés para mi nieto',
    },
    {
      label: 'Cerrajería / reparaciones',
      title: 'Cerrajería rápida 24h y reparaciones del hogar',
      description: 'Apertura de puertas sin daño, cambio de chapas y solución a fugas de agua.',
      serviceCategory: 'oficio_hogar',
      priceRange: 'Urgencia vecinal desde S/ 25',
      barterInterest: 'Acepto herramientas en desuso, pintura o apoyo contable',
    },
    {
      label: 'Clases de reforzamiento',
      title: 'Refuerzo escolar y nivelación en matemáticas y física',
      description: 'Profesor paciente del barrio para primaria y secundaria a dos cuadras del parque.',
      serviceCategory: 'educacion_clases',
      priceRange: 'S/ 20 por hora',
      barterInterest: 'Almuerzos caseros o soporte técnico de laptop',
    },
    {
      label: 'Tópico e inyectables',
      title: 'Tópico vecinal: inyectables, presión y primeros auxilios',
      description: 'Personal de salud colegiado brinda atención y nebulizaciones en la cuadra.',
      serviceCategory: 'salud_auxilio',
      priceRange: 'Tarifa social S/ 10 · Adultos mayores gratis',
      barterInterest: 'Material de curación descartable o insumos de botiquín',
    },
  ],
  favor: [
    {
      label: 'Préstamo de muletas',
      title: 'Presto par de muletas de aluminio regulables (Sin costo)',
      description: 'Disponibles y desinfectadas para cualquier vecino lesionado que las necesite.',
      favorCategory: 'prestamo_salud_herramienta',
      direction: 'ofrezco',
      safeMeetingPoint: 'Parque Central Los Perales o entrega en puerta',
      barterInterest: 'Solo compromiso de devolverlas al terminar su recuperación',
    },
    {
      label: 'Pool Escolar al colegio',
      title: 'Pool Escolar matutino hacia zona Colegios Yanahuara / Cayma',
      description: 'Salgo 7:10 a.m. en mi auto con 2 asientos libres para compartir ruta escolar segura.',
      favorCategory: 'movilidad_pool',
      direction: 'ofrezco',
      safeMeetingPoint: 'Garita principal Urb. Los Perales',
      barterInterest: 'Turnarnos por semanas o compartir gastos mínimos de combustible',
    },
    {
      label: 'Préstamo de taladro / herramientas',
      title: 'Presto taladro percutor Bosch y escalera de 6 pasos',
      description: 'Disponibles hoy para vecinos que necesiten colgar cuadros o hacer arreglos.',
      favorCategory: 'prestamo_salud_herramienta',
      direction: 'ofrezco',
      safeMeetingPoint: 'Caseta de Vigilancia Mz. I',
      barterInterest: 'Devolver limpio el mismo día antes de las 8:00 p.m.',
    },
    {
      label: 'Solicitud de apoyo / baldes',
      title: 'Necesito baldes grandes limpios por corte de agua',
      description: 'Vecina solicita 2 baldes o bidones limpios para almacenar agua potable hoy.',
      favorCategory: 'ayuda_temporal',
      direction: 'solicito',
      safeMeetingPoint: 'Pasaje Castilla 202',
      barterInterest: 'Ofrezco queque casero en agradecimiento a quien apoye',
    },
  ],
  emergency: [
    {
      label: 'Apoyo por lluvia intensa',
      title: 'Se necesitan baldes grandes y sacos terreros por filtración',
      description: 'Buzón colapsado en la esquina, requerimos apoyo urgente de vecinos con palas y sacos.',
      edanCategory: 'inundacion_lluvia',
      tags: ['Baldes', 'Sacos terreros', 'Lluvias El Niño'],
    },
    {
      label: 'Adulto mayor necesita apoyo',
      title: 'Adulto mayor necesita conservar insulina por corte de luz',
      description: 'Urgente: requerimos cooler con hielo o generador para mantener medicamento frío.',
      edanCategory: 'salud_vida',
      tags: ['Insulina', 'Adulto mayor', 'Frío / Batería'],
    },
    {
      label: 'Punto de agua / carga compartida',
      title: 'Punto vecinal con agua potable y carga para celulares',
      description: 'Ponemos a disposición tanque de agua y generador de respaldo en el pasaje.',
      edanCategory: 'agua_alimento',
      tags: ['Agua potable', 'Carga celular', 'Generador'],
    },
  ],
};

export const QuickPublishSheet: React.FC = () => {
  const {
    isPublishOpen,
    publishDefaultType,
    closePublishModal,
    addService,
    addFavor,
    addEmergencyItem,
    currentUser,
    isSeniorMode,
  } = useApp();

  const isMinor = !currentUser.isVerifiedAdult;

  const [intent, setIntent] = useState<'service' | 'favor' | 'emergency'>('service');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [barterText, setBarterText] = useState('');
  const [safeMeetingPoint, setSafeMeetingPoint] = useState('Parque Central Los Perales');
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<QuickTemplate | null>(null);

  // Sincronizar estado inicial al abrir el modal
  useEffect(() => {
    if (!isPublishOpen) return;

    if (isMinor) {
      setIntent('emergency');
    } else {
      setIntent(publishDefaultType);
    }

    // Comenzar con campos en blanco limpios y sin métodos preseleccionados
    setTitle('');
    setDescription('');
    setBarterText('');
    setPayments([]);
    setSafeMeetingPoint('Parque Central Los Perales');
    setSelectedTemplate(null);
  }, [publishDefaultType, isPublishOpen, isMinor]);

  if (!isPublishOpen) return null;

  const handleSelectIntent = (nextIntent: 'service' | 'favor' | 'emergency') => {
    if (isMinor && nextIntent !== 'emergency') return;
    setIntent(nextIntent);
    setSelectedTemplate(null);
  };

  const handleSelectTemplate = (tpl: QuickTemplate) => {
    setSelectedTemplate(tpl);
    setTitle(tpl.title);
    setDescription(tpl.description);
    setBarterText(tpl.barterInterest || '');
    if (tpl.safeMeetingPoint) {
      setSafeMeetingPoint(tpl.safeMeetingPoint);
    }
  };

  const togglePayment = (pm: PaymentMethod) => {
    setPayments((prev) =>
      prev.includes(pm) ? prev.filter((item) => item !== pm) : [...prev, pm]
    );
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const loc = createNeighborhoodPoint(
      (Math.random() - 0.5) * 0.0025,
      (Math.random() - 0.5) * 0.0025,
      currentUser.neighborhood,
      intent === 'emergency' ? 150 : undefined
    );

        if (intent === 'service' && !isMinor) {
      const activePayments: PaymentMethod[] = [...payments];
      if (barterText.trim() && !activePayments.includes('trueque')) {
        activePayments.push('trueque');
      }
      if (activePayments.length === 0) {
        activePayments.push('efectivo');
      }

      addService({
        providerId: currentUser.id,
        providerDni: currentUser.dni,
        providerName: currentUser.fullName,
        tradeTitle: title.trim(),
        category: selectedTemplate?.serviceCategory || 'oficio_hogar',
        description: description.trim() || 'Disponible para vecinos de la cuadra.',
        phone: currentUser.phone || '958001122',
        priceRange: selectedTemplate?.priceRange || 'A tratar',
        paymentMethods: activePayments,
        barterInterest: barterText.trim() ? barterText.trim() : undefined,
        trustBadges: ['Vecino Verificado'],
        isEmergencySupport: false,
        location: loc,
      });
    } else if (intent === 'favor' && !isMinor) {
      addFavor({
        authorId: currentUser.id,
        authorDni: currentUser.dni,
        authorName: currentUser.fullName,
        direction: selectedTemplate?.direction || 'ofrezco',
        category: selectedTemplate?.favorCategory || 'prestamo_salud_herramienta',
        title: title.trim(),
        description: description.trim() || 'Coordinación directa y solidaria en la manzana.',
        exchangeNote: barterText.trim() || undefined,
        safeMeetingPoint: safeMeetingPoint.trim() || 'Parque Central Los Perales',
        location: loc,
      });
    } else {
      addEmergencyItem({
        authorName: currentUser.fullName,
        type:
          selectedTemplate?.edanCategory === 'agua_alimento'
            ? 'recurso_compartido'
            : 'vecino_vulnerable',
        edanCategory: selectedTemplate?.edanCategory || 'salud_vida',
        urgency: 'critica',
        title: title.trim(),
        description: description.trim() || 'Se requiere apoyo inmediato en la cuadra.',
        resourceTags: selectedTemplate?.tags || ['Urgente'],
        isSensitiveProtected: true,
        expiresInHours: 72,
        location: loc,
      });
    }

    closePublishModal();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-sheet-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in"
      onClick={closePublishModal}
    >
      <form
        onSubmit={handlePublish}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-t-[32px] sm:rounded-3xl bg-white p-5 pb-16 sm:p-7 text-slate-950 shadow-2xl animate-sheet sm:animate-scale-in max-h-[92vh] overflow-y-auto no-scrollbar border-2 border-slate-200"
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300 sm:hidden" />

        {/* Encabezado */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 id="publish-sheet-title" className="text-lg font-black text-slate-950 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              Publicar en mi Cuadra
            </h2>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">
              Conecta con tus vecinos de forma rápida y segura
            </p>
          </div>
          <button
            type="button"
            onClick={closePublishModal}
            aria-label="Cerrar ventana"
            className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Aviso de Menor de Edad */}
        {isMinor && (
          <div className="mt-3 rounded-2xl bg-amber-50 border border-amber-300 p-3 flex items-start gap-2.5 text-xs text-amber-950 animate-fade-in">
            <ShieldAlert className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-amber-900">Modo Protegido Activo</p>
              <p className="text-[11px] text-amber-800 leading-snug">
                Por seguridad vecinal, las cuentas de menores de edad solo pueden emitir alertas de emergencia S.O.S. Las ofertas de servicios y préstamos están reservadas a adultos titulares.
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 space-y-4">
          {/* PASO 1: SELECCIÓN DE TIPO */}
          <div>
            <span className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
              1. ¿Qué deseas publicar?
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  id: 'service',
                  label: 'Oficio / Comida',
                  desc: 'Venta o servicio local',
                  icon: UtensilsCrossed,
                  colorClass: 'text-emerald-700',
                  activeClass: 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500',
                  disabled: isMinor,
                },
                {
                  id: 'favor',
                  label: 'Favor / Pool',
                  desc: 'Préstamo solidario o ruta',
                  icon: HandHeart,
                  colorClass: 'text-emerald-700',
                  activeClass: 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500',
                  disabled: isMinor,
                },
                {
                  id: 'emergency',
                  label: 'Alerta S.O.S.',
                  desc: 'Urgencia o lluvia',
                  icon: AlertTriangle,
                  colorClass: 'text-rose-700',
                  activeClass: 'bg-rose-600 text-white shadow-md ring-2 ring-rose-500',
                  disabled: false,
                },
              ].map((tab) => {
                const active = intent === tab.id;
                const IconComp = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    disabled={tab.disabled}
                    onClick={() => handleSelectIntent(tab.id as 'service' | 'favor' | 'emergency')}
                    className={`flex flex-col items-center justify-center rounded-2xl p-3 text-center transition-all active:scale-95 border-2 ${
                      tab.disabled
                        ? 'opacity-40 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                        : active
                        ? tab.activeClass + ' border-transparent'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    } ${isSeniorMode ? 'min-h-[72px]' : 'min-h-[64px]'}`}
                  >
                    {tab.disabled ? (
                      <Lock className="h-5 w-5 mb-1 text-slate-400" />
                    ) : (
                      <IconComp className={`h-5 w-5 mb-1 ${active ? 'text-white' : tab.colorClass}`} />
                    )}
                    <span className="text-xs font-black leading-tight">{tab.label}</span>
                    <span className={`text-[10px] mt-0.5 font-medium ${active ? 'text-white/80' : 'text-slate-500'}`}>
                      {tab.disabled ? 'Solo adultos' : tab.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PASO 2: SUGERENCIAS RÁPIDAS (OPCIONALES) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="block text-[11px] font-black uppercase tracking-wider text-slate-500">
                2. Sugerencias rápidas (Opcional)
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                Toca una para autocompletar
              </span>
            </div>

            <div className="no-scrollbar flex gap-1.5 overflow-x-auto py-1">
              {TEMPLATES[intent].map((tpl) => {
                const active = selectedTemplate?.label === tpl.label;
                return (
                  <button
                    key={tpl.label}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95 border ${
                      active
                        ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                        : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {active && <Check className="inline h-3.5 w-3.5 mr-1 text-emerald-400" />}
                    {tpl.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulario de Entrada */}
          <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-slate-50 border-2 border-slate-200 shadow-2xs">
            <div className="p-3">
              <label htmlFor="pub-title" className="block text-[11px] font-black text-slate-700">
                Título de la publicación
              </label>
              <input
                id="pub-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  intent === 'service'
                    ? 'Ej. Clases de guitarra, arreglo de tuberías, pasteles caseros...'
                    : intent === 'favor'
                    ? 'Ej. Presto muletas, busco auto para pool escolar, presto escalera...'
                    : 'Ej. Se requiere apoyo por buzón desbordado o corte de luz...'
                }
                className="mt-1 w-full bg-transparent text-sm font-black text-slate-950 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <div className="p-3">
              <label htmlFor="pub-desc" className="block text-[11px] font-black text-slate-700">
                Detalle para tus vecinos
              </label>
              <textarea
                id="pub-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Indica horarios disponibles, condiciones o qué apoyo requieres..."
                className="mt-1 w-full bg-transparent text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none"
              />
            </div>

            {/* Punto seguro de encuentro para favores y pool escolar */}
            {intent === 'favor' && (
              <div className="p-3 bg-emerald-50/60">
                <label
                  htmlFor="pub-safe-point"
                  className="block text-[11px] font-black text-emerald-950 flex items-center gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" />
                  Punto Seguro de Encuentro
                </label>
                <input
                  id="pub-safe-point"
                  type="text"
                  value={safeMeetingPoint}
                  onChange={(e) => setSafeMeetingPoint(e.target.value)}
                  placeholder="Ej. Parque Central Los Perales, Garita Mz. I, Mi puerta"
                  className="mt-1 w-full bg-transparent text-xs font-bold text-emerald-950 placeholder:text-emerald-700/60 focus:outline-none"
                />
              </div>
            )}

            {/* Trueque o acuerdo mutuo */}
            {intent !== 'emergency' && (
              <div className="p-3 bg-emerald-50/40">
                <label
                  htmlFor="pub-barter"
                  className="block text-[11px] font-black text-emerald-950 flex items-center gap-1.5"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5 text-emerald-700" />
                  ¿Aceptas trueque o favor a cambio? (Opcional)
                </label>
                <input
                  id="pub-barter"
                  type="text"
                  value={barterText}
                  onChange={(e) => setBarterText(e.target.value)}
                  placeholder="Ej. Insumos de repostería, turnos de pool, apoyo en jardinería..."
                  className="mt-1 w-full bg-transparent text-xs font-bold text-emerald-950 placeholder:text-emerald-600/50 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Métodos de Pago para Servicios */}
          {intent === 'service' && !isMinor && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl bg-slate-50 p-3 border-2 border-slate-200">
              <span className="text-xs font-black text-slate-800">Métodos aceptados:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'efectivo', label: 'Efectivo' },
                  { id: 'billetera_virtual', label: 'Yape / Plin' },
                  { id: 'trueque', label: 'Trueque' },
                ].map((pm) => {
                  const active = payments.includes(pm.id as PaymentMethod);
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => togglePayment(pm.id as PaymentMethod)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-black transition active:scale-95 border ${
                        active
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {active && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Botón de Publicar */}
          <div>
            <button
              type="submit"
              disabled={!title.trim()}
              className={`w-full min-h-[52px] rounded-2xl py-3 px-6 text-sm font-black text-white shadow-lg transition active:scale-98 flex items-center justify-center gap-2 ${
                !title.trim()
                  ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                  : intent === 'emergency'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-950/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-950/20'
              }`}
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>
                {intent === 'emergency'
                  ? 'Emitir alerta S.O.S. a la cuadra'
                  : 'Publicar anuncio en mi cuadra'}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
