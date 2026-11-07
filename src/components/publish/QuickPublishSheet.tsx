import { Check, X } from 'lucide-react';
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
      label: 'Lasaña / comida casera',
      title: 'Porciones de lasaña casera y postres del día',
      description: 'Recién preparados en casa para vecinos de la cuadra.',
      serviceCategory: 'gastronomia_vecinal',
      priceRange: 'S/ 14',
      barterInterest: 'Insumos de cocina o clases particulares.',
    },
    {
      label: 'Cerrajería / gasfitería',
      title: 'Servicio de cerrajería y gasfitería a domicilio',
      description: 'Atención rápida a menos de 5 minutos caminando.',
      serviceCategory: 'oficio_hogar',
      priceRange: 'Desde S/ 20',
      barterInterest: 'Materiales o herramientas.',
    },
    {
      label: 'Clases de matemáticas',
      title: 'Nivelación en matemáticas y física',
      description: 'Refuerzo escolar paciente en el barrio.',
      serviceCategory: 'educacion_clases',
      priceRange: 'S/ 18 / hora',
      barterInterest: 'Almuerzo casero o revisión de laptop.',
    },
  ],
  favor: [
    {
      label: 'Presto muletas',
      title: 'Presto par de muletas regulables sin costo',
      description: 'Disponibles para vecino lesionado que las necesite temporalmente.',
      favorCategory: 'prestamo_salud_herramienta',
      direction: 'ofrezco',
    },
    {
      label: 'Pool escolar',
      title: 'Pool escolar matutino (2 asientos disponibles)',
      description: 'Salgo 7:10 a.m. rumbo a zona de colegios para compartir ruta.',
      favorCategory: 'movilidad_pool',
      direction: 'ofrezco',
    },
    {
      label: 'Presto taladro',
      title: 'Presto taladro y caja de herramientas',
      description: 'Para arreglos puntuales en casa dentro de la manzana.',
      favorCategory: 'prestamo_salud_herramienta',
      direction: 'ofrezco',
    },
  ],
  emergency: [
    {
      label: 'Faltan baldes / sacos',
      title: 'Necesitamos baldes y sacos por filtración de lluvia',
      description: 'Ingreso de agua en el pasaje, requerimos apoyo inmediato.',
      edanCategory: 'inundacion_lluvia',
      tags: ['Baldes', 'Sacos terreros'],
    },
    {
      label: 'Conservar insulina',
      title: 'Adulto mayor necesita conservar insulina por corte de luz',
      description: 'Requerimos hielo o batería portátil en la manzana.',
      edanCategory: 'salud_vida',
      tags: ['Insulina', 'Adulto mayor'],
    },
    {
      label: 'Comparto agua / carga',
      title: 'Punto vecinal con agua potable y carga de celulares',
      description: 'Compartimos agua almacenada y electricidad para emergencias.',
      edanCategory: 'agua_alimento',
      tags: ['Agua potable', 'Carga celular'],
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
  const [barterText, setBarterText] = useState('');
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
    setBarterText(defaultTpl.barterInterest || '');
  }, [publishDefaultType, isPublishOpen]);

  if (!isPublishOpen) return null;

  const handleSelectIntent = (nextIntent: 'service' | 'favor' | 'emergency') => {
    setIntent(nextIntent);
    const tpl = TEMPLATES[nextIntent][0];
    setSelectedTemplate(tpl);
    setTitle(tpl.title);
    setDescription(tpl.description);
    setBarterText(tpl.barterInterest || '');
  };

  const handleSelectTemplate = (tpl: QuickTemplate) => {
    setSelectedTemplate(tpl);
    setTitle(tpl.title);
    setDescription(tpl.description);
    setBarterText(tpl.barterInterest || '');
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
      currentUser.neighborhood,
      intent === 'emergency' ? 150 : undefined
    );

    if (intent === 'service') {
      addService({
        providerName: currentUser.fullName,
        tradeTitle: title.trim() || 'Servicio en la cuadra',
        category: selectedTemplate?.serviceCategory || 'oficio_hogar',
        description: description.trim() || 'Disponible para vecinos.',
        phone: '958001122',
        priceRange: selectedTemplate?.priceRange || 'A tratar',
        paymentMethods: payments.length > 0 ? payments : ['efectivo', 'trueque'],
        barterInterest: payments.includes('trueque') && barterText.trim() ? barterText : undefined,
        trustBadges: ['Vecino del barrio'],
        isEmergencySupport: false,
        location: loc,
      });
    } else if (intent === 'favor') {
      addFavor({
        authorName: currentUser.fullName,
        direction: selectedTemplate?.direction || 'ofrezco',
        category: selectedTemplate?.favorCategory || 'prestamo_salud_herramienta',
        title: title.trim() || 'Favor entre vecinos',
        description: description.trim() || 'Coordinación directa en la manzana.',
        exchangeNote: barterText.trim() || undefined,
        safeMeetingPoint: 'Parque Central Los Perales',
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
        title: title.trim() || 'Aviso de emergencia',
        description: description.trim() || 'Se necesita apoyo de vecinos cercanos.',
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={closePublishModal}
    >
      <form
        onSubmit={handlePublish}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[500px] rounded-t-[28px] sm:rounded-3xl bg-[#F8FAFC] p-5 pb-8 sm:p-6 text-slate-900 shadow-2xl animate-sheet sm:animate-scale-in max-h-[92vh] overflow-y-auto no-scrollbar border border-slate-200/60"
      >
        <div className="mx-auto mb-3 h-1.5 w-9 rounded-full bg-slate-300 sm:hidden" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <button
            type="button"
            onClick={closePublishModal}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition"
          >
            Cancelar
          </button>
          <h2 id="publish-sheet-title" className="text-base font-bold text-slate-900">
            Nueva publicación vecinal
          </h2>
          <button
            type="button"
            onClick={closePublishModal}
            aria-label="Cerrar modal"
            className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 space-y-3.5">
          <div className="grid grid-cols-3 rounded-2xl bg-slate-200/80 p-1">
            {[
              { id: 'service', label: 'Oficio o venta' },
              { id: 'favor', label: 'Favor o pool' },
              { id: 'emergency', label: 'Emergencia' },
            ].map((tab) => {
              const active = intent === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectIntent(tab.id as 'service' | 'favor' | 'emergency')}
                  className={`rounded-xl py-2 text-xs font-bold transition active:scale-95 ${
                    active ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div>
            <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Plantillas rápidas
            </p>
            <div className="no-scrollbar mt-1.5 flex gap-1.5 overflow-x-auto pb-1">
              {TEMPLATES[intent].map((tpl) => (
                <button
                  key={tpl.label}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition active:scale-95 ${
                    selectedTemplate?.label === tpl.label
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-xs border border-slate-200/60">
            <div className="p-3">
              <label htmlFor="pub-title" className="block text-[11px] font-medium text-slate-400">
                Título del anuncio
              </label>
              <input
                id="pub-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-0.5 w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none"
              />
            </div>

            <div className="p-3">
              <label htmlFor="pub-desc" className="block text-[11px] font-medium text-slate-400">
                Detalles para tus vecinos
              </label>
              <input
                id="pub-desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-0.5 w-full bg-transparent text-xs text-slate-700 focus:outline-none"
              />
            </div>

            {intent !== 'emergency' && (
              <div className="p-3">
                <label
                  htmlFor="pub-barter"
                  className="block text-[11px] font-medium text-indigo-600"
                >
                  ¿Aceptas algún trueque o favor a cambio? (Opcional)
                </label>
                <input
                  id="pub-barter"
                  type="text"
                  value={barterText}
                  onChange={(e) => setBarterText(e.target.value)}
                  placeholder="Ej. Insumos, clases, herramientas..."
                  className="mt-0.5 w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            )}
          </div>

          {intent === 'service' && (
            <div className="flex items-center justify-between rounded-2xl bg-white px-3.5 py-2.5 shadow-xs border border-slate-200/60">
              <span className="text-xs font-medium text-slate-500">Formas de pago</span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'efectivo', label: 'Efectivo' },
                  { id: 'billetera_virtual', label: 'Yape/Plin' },
                  { id: 'trueque', label: 'Trueque' },
                ].map((pm) => {
                  const active = payments.includes(pm.id as PaymentMethod);
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => togglePayment(pm.id as PaymentMethod)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                        active ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {active && <Check className="h-3 w-3" aria-hidden="true" />}
                      {pm.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`w-full min-h-[48px] rounded-2xl py-3 text-sm font-bold text-white shadow-md transition active:scale-98 ${
              intent === 'emergency' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {intent === 'emergency' ? 'Enviar alerta al barrio' : 'Publicar anuncio ahora'}
          </button>
        </div>
      </form>
    </div>
  );
};
