import {
  AlertOctagon,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  HeartHandshake,
  MessageSquare,
  Repeat,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Store,
  Users,
  WifiOff,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { storageService } from '../../services/storageService';
import { RatingFaceIcon } from '../common/RatingFaceIcon';

export const QuickGuideModal: React.FC = () => {
  const { isTutorialOpen, setIsTutorialOpen } = useApp();
  const [currentStep, setCurrentStep] = useState<number>(1);

  if (!isTutorialOpen) return null;

  const handleClose = () => {
    storageService.markQuickGuideSeen();
    setIsTutorialOpen(false);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[500px] rounded-t-[28px] sm:rounded-3xl bg-[#F8FAFC] p-5 pb-8 sm:p-6 text-slate-900 shadow-2xl animate-sheet sm:animate-scale-in max-h-[94vh] overflow-y-auto no-scrollbar border border-slate-300"
      >
        <div className="mx-auto mb-3 h-1.5 w-9 rounded-full bg-slate-300 sm:hidden" />

        {/* Encabezado y Barra de Pasos */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-black text-xs">
              V
            </span>
            <div>
              <h2 id="guide-modal-title" className="text-base font-black tracking-tight text-slate-950">
                Guía Rápida VecinOS
              </h2>
              <p className="text-[11px] font-semibold text-slate-500">
                Tu barrio conectado a menos de 10 minutos a pie
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar guía"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Indicador de 3 Pasos */}
        <div className="mt-3.5 grid grid-cols-3 gap-2">
          {[
            { step: 1, title: '1. Servicios & Trueque' },
            { step: 2, title: '2. Favores & Pool' },
            { step: 3, title: '3. S.O.S. & Emergencias' },
          ].map((item) => {
            const isActive = currentStep === item.step;
            const isCompleted = currentStep > item.step;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => setCurrentStep(item.step)}
                className={`flex flex-col items-center gap-1 rounded-xl p-2 text-left transition border ${
                  isActive
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-black'
                    : isCompleted
                    ? 'bg-slate-100 border-slate-300 text-slate-700 font-bold'
                    : 'bg-white border-slate-200 text-slate-400 font-medium'
                }`}
              >
                <div className="flex items-center gap-1">
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                  ) : (
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-black ${
                        isActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.step}
                    </span>
                  )}
                  <span className="text-[11px] truncate">{item.title.split('. ')[1]}</span>
                </div>
                <div
                  className={`h-1 w-full rounded-full ${
                    isActive ? 'bg-emerald-600' : isCompleted ? 'bg-emerald-400' : 'bg-slate-200'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* CONTENIDO DEL PASO 1 */}
        {currentStep === 1 && (
          <div className="mt-4 space-y-3.5 animate-fade-in text-xs">
            <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-xs border border-slate-200">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                <Store className="h-6 w-6 stroke-[2.2]" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="font-black text-slate-950 text-sm">
                  Economía Local & Oficios de Confianza
                </p>
                <p className="leading-relaxed font-medium text-slate-600">
                  Encuentra desde lasañas caseras de la vecina hasta cerrajeros y enfermeros avalados por personas de tu propia cuadra.
                </p>
              </div>
            </div>

            {/* Reputación Vecinal */}
            <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 text-slate-200">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  Reputación Vecinal Basada en Confianza
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  Opinión comunitaria real
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
                Califica la atención de manera sencilla: Feliz, Conforme o Desconforme. La opinión de vecinos con mayor arraigo en la cuadra brinda un respaldo sólido a la comunidad:
              </p>
              <div className="flex items-center justify-around gap-2 pt-1">
                <RatingFaceIcon sentiment="happy" size="sm" showLabel />
                <RatingFaceIcon sentiment="neutral" size="sm" showLabel />
                <RatingFaceIcon sentiment="angry" size="sm" showLabel />
              </div>
            </div>

            {/* Métodos de Pago y Trueque */}
            <div className="rounded-2xl bg-white p-3.5 shadow-xs border border-slate-200">
              <p className="font-black text-slate-900 text-xs mb-2 flex items-center gap-1.5">
                <Repeat className="h-4 w-4 text-emerald-600" />
                <span>3 Formas de Pago: Efectivo, Yape y Trueque Solidario</span>
              </p>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-2 text-slate-700">
                  💵 Efectivo
                </div>
                <div className="rounded-xl bg-purple-50 border border-purple-200 p-2 text-purple-800">
                  📱 Yape / Plin
                </div>
                <div className="rounded-xl bg-emerald-50 border border-emerald-300 p-2 text-emerald-800">
                  🤝 Trueque / Favor
                </div>
              </div>
              <p className="mt-2 text-[11px] text-slate-500 font-medium">
                Al elegir Trueque se despliega un espacio para proponer qué producto, favor o habilidad ofreces a cambio.
              </p>
            </div>
          </div>
        )}

        {/* CONTENIDO DEL PASO 2 */}
        {currentStep === 2 && (
          <div className="mt-4 space-y-3.5 animate-fade-in text-xs">
            <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-xs border border-slate-200">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-800">
                <HeartHandshake className="h-6 w-6 stroke-[2.2]" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="font-black text-slate-950 text-sm">
                  Cadena de Favores & Préstamos Solidarios
                </p>
                <p className="leading-relaxed font-medium text-slate-600">
                  Préstamo gratuito de implementos médicos (muletas, sillas) y herramientas (taladros, escaleras) sin costo alguno.
                </p>
              </div>
            </div>

            {/* Pool Escolar */}
            <div className="rounded-2xl bg-indigo-50 border-2 border-indigo-200 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Users className="h-5 w-5 text-indigo-700" />
                <p className="font-black text-indigo-950 text-xs">
                  Pool Escolar y Rutas Seguras
                </p>
              </div>
              <p className="text-[11px] font-medium text-indigo-900 leading-relaxed">
                Coordina traslados compartidos con padres del barrio para llevar a los niños al colegio de forma segura, reduciendo tráfico y ahorrando combustible.
              </p>
            </div>

            {/* Publicación en 3 Pasos */}
            <div className="rounded-2xl bg-white p-3.5 shadow-xs border border-slate-200">
              <p className="font-black text-slate-900 text-xs mb-2">
                Publicación sencilla en 3 pasos:
              </p>
              <div className="space-y-1.5 text-[11px] font-medium text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-white font-bold text-[10px]">1</span>
                  <span>Elige qué compartir: Oficio, Favor o Alerta S.O.S.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-white font-bold text-[10px]">2</span>
                  <span>Escribe un título y descripción (o elige una sugerencia rápida).</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-white font-bold text-[10px]">3</span>
                  <span>Presiona "Publicar" con Punto Seguro de Encuentro.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTENIDO DEL PASO 3 */}
        {currentStep === 3 && (
          <div className="mt-4 space-y-3.5 animate-fade-in text-xs">
            <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-xs border border-slate-200">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-800">
                <AlertOctagon className="h-6 w-6 stroke-[2.2]" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="font-black text-slate-950 text-sm">
                  Alertas S.O.S. y Apoyo Comunitario
                </p>
                <p className="leading-relaxed font-medium text-slate-600">
                  En emergencias como sismos o lluvias intensas, VecinOS permite coordinar auxilio rápido y compartir recursos vitales (agua, energía, abrigo).
                </p>
              </div>
            </div>

            {/* Privacidad de Vecinos */}
            <div className="rounded-2xl bg-amber-50 border border-amber-300 p-3.5">
              <p className="font-black text-amber-950 text-xs flex items-center gap-1.5 mb-1">
                <ShieldAlert className="h-4 w-4 text-amber-700" />
                <span>Privacidad y Protección Barrial</span>
              </p>
              <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                La dirección exacta de adultos mayores o casos médicos se resguarda en un radio general aproximado para proteger su intimidad y seguridad.
              </p>
            </div>

            {/* Resiliencia sin Conexión */}
            <div className="rounded-2xl bg-white p-3.5 shadow-xs border border-slate-200">
              <p className="font-black text-slate-900 text-xs mb-1.5 flex items-center gap-1.5">
                <Smartphone className="h-4 w-4 text-emerald-700" />
                <span>Funciona incluso sin Internet</span>
              </p>
              <div className="space-y-2 text-[11px] font-medium text-slate-600">
                <div className="flex items-center gap-2">
                  <WifiOff className="h-4 w-4 text-slate-500" />
                  <span>El mapa vectorial y tus publicaciones quedan guardados en tu celular y se envían apenas vuelva la señal.</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-emerald-600" />
                  <span>Incluye botón para enviar ubicación y pedido de auxilio por mensaje SMS de texto tradicional.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botones Inferiores */}
        <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex min-h-[46px] items-center gap-1.5 rounded-2xl bg-slate-200 hover:bg-slate-300 px-4 py-2.5 text-xs font-bold text-slate-800 transition active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition px-2 py-2"
            >
              Omitir guía
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="flex-1 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-black text-white shadow-md transition active:scale-95"
          >
            {currentStep < 3 ? (
              <>
                <span>Siguiente ({currentStep}/3)</span>
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Entendido, ir al barrio</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
