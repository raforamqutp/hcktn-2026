import {
  AlertTriangle,
  ArrowLeftRight,
  Check,
  CheckCircle2,
  HandHeart,
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
      label: 'Lasaña / comida casera',
      title: 'Lasañas artesanales y pastelitos recién horneados',
      description: 'Preparadas en casa con insumos frescos para compartir entre vecinos de la cuadra.',
      serviceCategory: 'gastronomia_vecinal',
      priceRange: 'Porción S/ 14 · Fuente familiar S/ 42',
      barterInterest: 'Acepto insumos de repostería, frutas o clases de inglés para mi nieto',
    },
    {
      label: 'Cerrajería / gasfitería',
      title: 'Cerrajería rápida 24h y reparaciones del hogar',
      description: 'Apertura de puertas sin daño, cambio de chapas y solución a fugas de agua.',
      serviceCategory: 'oficio_hogar',
      priceRange: 'Urgencia vecinal desde S/ 25',
      barterInterest: 'Acepto herramientas en desuso, pintura o apoyo contable',
    },
    {
      label: 'Clases de matemáticas',
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
      label: 'Presto muletas',
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
      label: 'Presto taladro / herramientas',
      title: 'Presto taladro percutor Bosch y escalera de 6 pasos',
      description: 'Disponibles hoy para vecinos que necesiten colgar cuadros o hacer arreglos.',
      favorCategory: 'prestamo_salud_herramienta',
      direction: 'ofrezco',
      safeMeetingPoint: 'Caseta de Vigilancia Mz. I',
      barterInterest: 'Devolver limpio el mismo día antes de las 8:00 p.m.',
    },
    {
      label: 'Encargos farmacia / compras',
      title: 'Encargos de farmacia y mercado para adultos mayores',
      description: 'Salgo a las 9:00 a.m. al mercado y botica. Puedo traer encargos a vecinos de la cuadra.',
      favorCategory: 'movilidad_pool',
      direction: 'ofrezco',
      safeMeetingPoint: 'Entrega en puerta en la cuadra',
      barterInterest: 'Apoyo voluntario y solidario para adultos mayores',
    },
    {
      label: 'Solicito apoyo / baldes',
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
      label: 'Faltan baldes por lluvia El Niño',
      title: 'Se necesitan baldes grandes y sacos terreros por filtración',
      description: 'Buzón colapsado en la esquina, requerimos apoyo urgente de vecinos con palas y sacos.',
      edanCategory: 'inundacion_lluvia',
      tags: ['Baldes', 'Sacos terreros', 'Lluvias El Niño'],
    },
    {
      label: 'Adulto mayor necesita insulina',
      title: 'Adulto mayor necesita conservar insulina por corte de luz',
      description: 'Urgente: requerimos cooler con hielo o generador para mantener medicamento frío.',
      edanCategory: 'salud_vida',
      tags: ['Insulina', 'Adulto mayor', 'Frío / Batería'],
    },
    {
      label: 'Comparto agua y carga',
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

  const [intent, setIntent] = useState<'service' | 'favor' | 'emergency'>(publishDefaultType);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [barterText, setBarterText] = useState('');
  const [safeMeetingPoint, setSafeMeetingPoint] = useState('');
  const [payments, setPayments] = useState<PaymentMethod[]>([
    'efectivo',
    'billetera_virtual',
    'trueque',
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState<QuickTemplate | null>(null);

  // Sincronizar estado inicial cuando se abre el modal
  useEffect(() => {
    setIntent(publishDefaultType);
    const defaultTpl = TEMPLATES[publishDefaultType][0];
    setSelectedTemplate(defaultTpl);
    setTitle(defaultTpl.title);
    setDescription(defaultTpl.description);
    setBarterText(defaultTpl.barterInterest || '');
    setSafeMeetingPoint(defaultTpl.safeMeetingPoint || 'Parque Central Los Perales');
  }, [publishDefaultType, isPublishOpen]);

  if (!isPublishOpen) return null;

  // Paso 1: Seleccionar intención
  const handleSelectIntent = (nextIntent: 'service' | 'favor' | 'emergency') => {
    setIntent(nextIntent);
    const tpl = TEMPLATES[nextIntent][0];
    setSelectedTemplate(tpl);
    setTitle(tpl.title);
    setDescription(tpl.description);
    setBarterText(tpl.barterInterest || '');
    setSafeMeetingPoint(tpl.safeMeetingPoint || 'Parque Central Los Perales');
  };

  // Paso 2: Seleccionar plantilla inteligente
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

  // CLIC 3: CONFIRMAR Y PUBLICAR
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = createNeighborhoodPoint(
      (Math.random() - 0.5) * 0.0025,
      (Math.random() - 0.5) * 0.0025,
      currentUser.neighborhood,
      intent === 'emergency' ? 150 : undefined
    );

    if (intent === 'service') {
      addService({
        providerName: currentUser.fullName,
        tradeTitle: title.trim() || 'Servicio vecinal',
        category: selectedTemplate?.serviceCategory || 'oficio_hogar',
        description: description.trim() || 'Disponible para vecinos de la cuadra.',
        phone: '958001122',
        priceRange: selectedTemplate?.priceRange || 'Tarifa a tratar',
        paymentMethods: payments.length > 0 ? payments : ['efectivo', 'billetera_virtual', 'trueque'],
        barterInterest: payments.includes('trueque') && barterText.trim() ? barterText : undefined,
        trustBadges: ['Vecino Verificado de la Cuadra'],
        isEmergencySupport: false,
        location: loc,
      });
    } else if (intent === 'favor') {
      addFavor({
        authorName: currentUser.fullName,
        direction: selectedTemplate?.direction || 'ofrezco',
        category: selectedTemplate?.favorCategory || 'prestamo_salud_herramienta',
        title: title.trim() || 'Favor entre vecinos',
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
        title: title.trim() || 'Alerta vecinal urgente',
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
        className="w-full max-w-xl rounded-t-[32px] sm:rounded-3xl bg-white p-5 pb-8 sm:p-7 text-slate-950 shadow-2xl animate-sheet sm:animate-scale-in max-h-[92vh] overflow-y-auto no-scrollbar border-2 border-slate-200"
      >
        {/* Barra táctil para deslizar en móviles */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300 sm:hidden" />

        {/* Encabezado del Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 id="publish-sheet-title" className="text-lg font-black text-slate-950 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              Publicación en 3 Clics
            </h2>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">
              1. Intención · 2. Plantilla Inteligente · 3. Confirmar
            </p>
          </div>
          <button
            type="button"
            onClick={closePublishModal}
            aria-label="Cerrar modal"
            className="h-11 w-11 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* PASO 1: INTENCIÓN */}
          <div>
            <span className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
              1. ¿Qué deseas compartir o solicitar?
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
                },
                {
                  id: 'favor',
                  label: 'Favor / Pool',
                  desc: 'Muletas, pool, taladro',
                  icon: HandHeart,
                  colorClass: 'text-indigo-700',
                  activeClass: 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-500',
                },
                {
                  id: 'emergency',
                  label: 'Alerta S.O.S.',
                  desc: 'Urgencia o El Niño',
                  icon: AlertTriangle,
                  colorClass: 'text-rose-700',
                  activeClass: 'bg-rose-600 text-white shadow-md ring-2 ring-rose-500',
                },
              ].map((tab) => {
                const active = intent === tab.id;
                const IconComp = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleSelectIntent(tab.id as 'service' | 'favor' | 'emergency')}
                    className={`flex flex-col items-center justify-center rounded-2xl p-3 text-center transition-all active:scale-95 border-2 ${
                      active
                        ? tab.activeClass + ' border-transparent'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    } ${isSeniorMode ? 'min-h-[72px]' : 'min-h-[64px]'}`}
                  >
                    <IconComp className={`h-5 w-5 mb-1 ${active ? 'text-white' : tab.colorClass}`} />
                    <span className="text-xs font-black leading-tight">{tab.label}</span>
                    <span className={`text-[10px] mt-0.5 font-medium ${active ? 'text-white/80' : 'text-slate-500'}`}>
                      {tab.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PASO 2: PLANTILLAS INTELIGENTES */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="block text-[11px] font-black uppercase tracking-wider text-slate-500">
                2. Plantillas rápidas sugeridas
              </span>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                Autocompleta en 1 toque
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
                    className={`shrink-0 min-h-[40px] inline-flex items-center rounded-full px-4 py-2 text-xs font-bold transition active:scale-95 border ${
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

          {/* Campos editables con la información precargada */}
          <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-slate-50 border-2 border-slate-200 shadow-2xs">
            <div className="p-3">
              <label htmlFor="pub-title" className="block text-[11px] font-black text-slate-600">
                Título del anuncio (precargado)
              </label>
              <input
                id="pub-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm font-black text-slate-950 focus:outline-none"
              />
            </div>

            <div className="p-3">
              <label htmlFor="pub-desc" className="block text-[11px] font-black text-slate-600">
                Detalle para los vecinos
              </label>
              <textarea
                id="pub-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none resize-none"
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
                  Punto Seguro de Encuentro (Recomendado para seguridad vecinal)
                </label>
                <input
                  id="pub-safe-point"
                  type="text"
                  value={safeMeetingPoint}
                  onChange={(e) => setSafeMeetingPoint(e.target.value)}
                  placeholder="Ej. Parque Central, Garita Mz. I, Mi puerta"
                  className="mt-1 w-full bg-transparent text-xs font-bold text-emerald-950 placeholder:text-emerald-700/60 focus:outline-none"
                />
              </div>
            )}

            {/* Espacio para escribir trueque o acuerdo */}
            {intent !== 'emergency' && (
              <div className="p-3 bg-indigo-50/40">
                <label
                  htmlFor="pub-barter"
                  className="block text-[11px] font-black text-indigo-950 flex items-center gap-1.5"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5 text-indigo-700" />
                  ¿Aceptas algún trueque, favor o condición a cambio? (Opcional)
                </label>
                <input
                  id="pub-barter"
                  type="text"
                  value={barterText}
                  onChange={(e) => setBarterText(e.target.value)}
                  placeholder="Ej. Insumos de repostería, turnos de pool, herramientas..."
                  className="mt-1 w-full bg-transparent text-xs font-bold text-indigo-950 placeholder:text-indigo-400 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Métodos de Pago para Servicios con Autoselección */}
          {intent === 'service' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl bg-slate-50 p-3 border-2 border-slate-200">
              <span className="text-xs font-black text-slate-800">Métodos de pago aceptados:</span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'efectivo', label: 'Efectivo' },
                  { id: 'billetera_virtual', label: 'Yape / Plin' },
                  { id: 'trueque', label: 'Trueque 🤝' },
                ].map((pm) => {
                  const active = payments.includes(pm.id as PaymentMethod);
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => togglePayment(pm.id as PaymentMethod)}
                      className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black transition active:scale-95 border ${
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

          {/* PASO 3: CONFIRMAR Y PUBLICAR */}
          <div>
            <span className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
              3. Confirmar y publicar
            </span>
            <button
              type="submit"
              className={`w-full min-h-[52px] rounded-2xl py-3 px-6 text-sm font-black text-white shadow-lg transition active:scale-98 flex items-center justify-center gap-2 ${
                intent === 'emergency'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-950/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-950/20'
              }`}
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>
                {intent === 'emergency'
                  ? 'Enviar alerta S.O.S. al barrio'
                  : 'Publicar en mi cuadra'}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
