import { AlertOctagon, Check, HeartHandshake, Wrench, X } from 'lucide-react';
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
  edanCategory?: EdanCategory;
  tags?: string[];
}

const TEMPLATES: Record<'service' | 'favor' | 'emergency', QuickTemplate[]> = {
  service: [
    {
      label: 'Lasaña / Postres caseros',
      title: 'Porciones de Lasaña Casera y Postres del Día',
      description: 'Recién horneados en casa para vecinos de la manzana.',
      serviceCategory: 'gastronomia_vecinal',
      priceRange: 'S/ 14 porción',
      barterInterest: 'Acepto trueque por insumos de cocina o clases particulares.',
    },
    {
      label: 'Cerrajería / Gasfitería rápida',
      title: 'Servicio de Cerrajería y Gasfitería de Urgencia',
      description: 'Atención inmediata a menos de 5 minutos caminando.',
      serviceCategory: 'oficio_hogar',
      priceRange: 'Desde S/ 20',
      barterInterest: 'Acepto pago en efectivo, Yape o trueque por materiales.',
    },
    {
      label: 'Clases de Matemáticas',
      title: 'Nivelación en Matemáticas y Física a domicilio',
      description: 'Refuerzo escolar paciente y garantizado en el barrio.',
      serviceCategory: 'educacion_clases',
      priceRange: 'S/ 18 / hora',
      barterInterest: 'Acepto intercambio por almuerzo casero o revisión de PC.',
    },
  ],
  favor: [
    {
      label: 'Presto Muletas / Silla',
      title: 'Presto par de muletas ortopédicas sin costo',
      description: 'Disponibles para vecino lesionado que las necesite temporalmente.',
      favorCategory: 'prestamo_salud_herramienta',
      direction: 'ofrezco',
    },
    {
      label: 'Hago Pool Escolar al Colegio',
      title: 'Pool Escolar matutino (2 asientos disponibles)',
      description: 'Salgo 7:10 a.m. rumbo a zona de colegios para compartir ruta entre vecinos.',
      favorCategory: 'movilidad_pool',
      direction: 'ofrezco',
    },
    {
      label: 'Presto Taladro / Escalera',
      title: 'Presto taladro percutor y caja de herramientas',
      description: 'Para arreglos puntuales en casa dentro de la cuadra.',
      favorCategory: 'prestamo_salud_herramienta',
      direction: 'ofrezco',
    },
  ],
  emergency: [
    {
      label: 'Necesito Baldes / Sacos (Lluvia)',
      title: 'Urgente: Necesitamos baldes y sacos terreros por filtración de lluvia',
      description: 'Ingreso de agua en vivienda del pasaje, requerimos apoyo inmediato.',
      edanCategory: 'inundacion_lluvia',
      tags: ['Baldes', 'Sacos Terreros', 'El Niño'],
    },
    {
      label: 'Adulto Mayor / Insulina S.O.S.',
      title: 'Adulto mayor vulnerable requiere conservar insulina / soporte médico',
      description: 'Requerimos hielo/batería o asistencia de enfermería en la manzana.',
      edanCategory: 'salud_vida',
      tags: ['Insulina', 'Adulto Mayor', 'Primeros Auxilios'],
    },
    {
      label: 'Comparto Agua / Generador',
      title: 'Punto vecinal con agua potable y carga de baterías de emergencia',
      description: 'Compartimos agua almacenada y electricidad para celulares.',
      edanCategory: 'agua_alimento',
      tags: ['Agua Potable', 'Carga Celular', 'Botiquín'],
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
  } = useApp();

  const [intent, setIntent] = useState<'service' | 'favor' | 'emergency'>(publishDefaultType);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [barterText, setBarterText] = useState('Acepto intercambio solidario por favor o insumo.');
  const [payments, setPayments] = useState<PaymentMethod[]>([
    'efectivo',
    'billetera_virtual',
    'trueque',
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState<QuickTemplate | null>(null);

  useEffect(() => {
    setIntent(publishDefaultType);
    const defaultTpl = TEMPLATES[publishDefaultType][0];
    setSelectedTemplate(defaultTpl);
    setTitle(defaultTpl.title);
    setDescription(defaultTpl.description);
    if (defaultTpl.barterInterest) {
      setBarterText(defaultTpl.barterInterest);
    }
  }, [publishDefaultType, isPublishOpen]);

  if (!isPublishOpen) return null;

  const handleSelectIntent = (nextIntent: 'service' | 'favor' | 'emergency') => {
    setIntent(nextIntent);
    const tpl = TEMPLATES[nextIntent][0];
    setSelectedTemplate(tpl);
    setTitle(tpl.title);
    setDescription(tpl.description);
    if (tpl.barterInterest) {
      setBarterText(tpl.barterInterest);
    }
  };

  const handleSelectTemplate = (tpl: QuickTemplate) => {
    setSelectedTemplate(tpl);
    setTitle(tpl.title);
    setDescription(tpl.description);
    if (tpl.barterInterest) {
      setBarterText(tpl.barterInterest);
    }
  };

  const togglePayment = (pm: PaymentMethod) => {
    setPayments((prev) =>
      prev.includes(pm) ? prev.filter((item) => item !== pm) : [...prev, pm]
    );
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = createNeighborhoodPoint(
      (Math.random() - 0.5) * 0.0025,
      (Math.random() - 0.5) * 0.0025,
      `${currentUser.neighborhood} (Ubicación GPS automática)`,
      intent === 'emergency' ? 150 : undefined
    );

    if (intent === 'service') {
      addService({
        providerName: currentUser.fullName,
        tradeTitle: title.trim() || 'Servicio Vecinal',
        category: selectedTemplate?.serviceCategory || 'oficio_hogar',
        description: description.trim() || 'Disponible en la cuadra.',
        phone: '958001122',
        priceRange: selectedTemplate?.priceRange || 'Precio solidario / A tratar',
        paymentMethods: payments.length > 0 ? payments : ['efectivo', 'trueque'],
        barterInterest: payments.includes('trueque') ? barterText : undefined,
        trustBadges: ['Vecino Verificado DNI'],
        isEmergencySupport: false,
        location: loc,
      });
    } else if (intent === 'favor') {
      addFavor({
        authorName: currentUser.fullName,
        direction: selectedTemplate?.direction || 'ofrezco',
        category: selectedTemplate?.favorCategory || 'prestamo_salud_herramienta',
        title: title.trim() || 'Apoyo Solidario Vecinal',
        description: description.trim() || 'Coordinación directa en la manzana.',
        exchangeNote: barterText,
        safeMeetingPoint: 'Parque Central / Garita de la cuadra',
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
        title: title.trim() || 'Alerta S.O.S. Vecinal',
        description: description.trim() || 'Se requiere soporte inmediato de vecinos cercanos.',
        resourceTags: selectedTemplate?.tags || ['Apoyo Inmediato'],
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 sm:items-center sm:p-4"
    >
      <form
        onSubmit={handlePublish}
        className="w-full max-w-xl rounded-t-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800">
              Diseño Rápido en 3 Clics
            </span>
            <h2 id="publish-sheet-title" className="mt-1 text-lg font-extrabold text-slate-900">
              Publicar en tu Cuadra
            </h2>
          </div>
          <button
            type="button"
            onClick={closePublishModal}
            aria-label="Cerrar ventana de publicación"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-3 space-y-3.5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Clic 1: Elige qué deseas publicar
            </p>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectIntent('service')}
                className={`flex min-h-[52px] flex-col items-center justify-center rounded-xl border p-2 text-xs font-bold transition ${
                  intent === 'service'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/30'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <Wrench className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                <span>1. Oficio / Comida</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectIntent('favor')}
                className={`flex min-h-[52px] flex-col items-center justify-center rounded-xl border p-2 text-xs font-bold transition ${
                  intent === 'favor'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/30'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <HeartHandshake className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                <span>2. Favor / Pool</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectIntent('emergency')}
                className={`flex min-h-[52px] flex-col items-center justify-center rounded-xl border p-2 text-xs font-bold transition ${
                  intent === 'emergency'
                    ? 'border-red-600 bg-red-50 text-red-900 ring-2 ring-red-500/30'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <AlertOctagon className="h-4 w-4 text-red-600" aria-hidden="true" />
                <span>3. Alerta S.O.S.</span>
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Clic 2: Toca una plantilla rápida (o personaliza el texto)
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {TEMPLATES[intent].map((tpl) => (
                <button
                  key={tpl.label}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`min-h-[38px] rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                    selectedTemplate?.label === tpl.label
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 rounded-2xl bg-slate-50 p-3">
            <div>
              <label htmlFor="pub-title" className="block text-xs font-bold text-slate-700">
                Título del anuncio:
              </label>
              <input
                id="pub-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900"
              />
            </div>

            {intent !== 'emergency' && (
              <div>
                <label htmlFor="pub-barter" className="block text-xs font-bold text-indigo-900">
                  Espacio para escribir acuerdo de Trueque / Favor:
                </label>
                <input
                  id="pub-barter"
                  type="text"
                  value={barterText}
                  onChange={(e) => setBarterText(e.target.value)}
                  placeholder="Escribe qué aceptas o propones como intercambio solidario..."
                  className="mt-1 w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs text-slate-900"
                />
              </div>
            )}

            {intent === 'service' && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-slate-600">Acepto:</span>
                {[
                  { id: 'efectivo', label: 'Efectivo' },
                  { id: 'billetera_virtual', label: 'Yape / Plin' },
                  { id: 'trueque', label: 'Pago en Trueque' },
                ].map((pm) => {
                  const active = payments.includes(pm.id as PaymentMethod);
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => togglePayment(pm.id as PaymentMethod)}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                        active
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {active && <Check className="h-3 w-3" aria-hidden="true" />}
                      {pm.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`w-full min-h-[52px] rounded-2xl px-4 py-3 text-sm font-extrabold text-white shadow-lg transition ${
              intent === 'emergency'
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            Clic 3: Publicar en mi Cuadra (Geolocalización Automática)
          </button>
        </div>
      </form>
    </div>
  );
};
