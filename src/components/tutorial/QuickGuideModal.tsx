import { AlertOctagon, HeartHandshake, Store, X } from 'lucide-react';
import React from 'react';
import { RatingFaceIcon } from '../common/RatingFaceIcon';
import { useApp } from '../../context/AppContext';

export const QuickGuideModal: React.FC = () => {
  const { isTutorialOpen, setIsTutorialOpen } = useApp();

  if (!isTutorialOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-xs animate-fade-in"
      onClick={() => setIsTutorialOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[430px] rounded-t-[28px] bg-[#F2F2F7] p-5 pb-8 text-slate-900 shadow-2xl animate-sheet"
      >
        <div className="mx-auto mb-3 h-1.5 w-9 rounded-full bg-slate-300" />

        <div className="flex items-center justify-between pb-3">
          <div>
            <h2 id="guide-modal-title" className="text-lg font-bold tracking-tight">
              Tu barrio en VecinOS
            </h2>
            <p className="text-xs text-slate-500">Todo a menos de 10 minutos caminando</p>
          </div>
          <button
            type="button"
            onClick={() => setIsTutorialOpen(false)}
            aria-label="Cerrar guía"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/80 text-slate-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-2 space-y-2.5 text-xs">
          <div className="flex items-start gap-3 rounded-2xl bg-white p-3.5 shadow-xs">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Store className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <p className="font-bold text-slate-900">Oficios, comida casera y trueque</p>
              <p className="leading-relaxed text-slate-500">
                Contacta al cerrajero de la cuadra o pide comida casera. Puedes pagar en efectivo,
                Yape/Plin o proponer un trueque, y calificar cómo te fue:
              </p>
              <div className="dark-surface inline-flex items-center gap-3 rounded-2xl bg-[#0B0E14] px-3 py-2">
                <RatingFaceIcon sentiment="happy" size="sm" showLabel />
                <RatingFaceIcon sentiment="neutral" size="sm" showLabel />
                <RatingFaceIcon sentiment="angry" size="sm" showLabel />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-white p-3.5 shadow-xs">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <HeartHandshake className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Favores y pool escolar</p>
              <p className="mt-0.5 leading-relaxed text-slate-500">
                Pide prestadas muletas o herramientas sin gastar dinero y coordina rutas al colegio
                con otros padres de tu manzana.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-white p-3.5 shadow-xs">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertOctagon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Apoyo en emergencias S.O.S.</p>
              <p className="mt-0.5 leading-relaxed text-slate-500">
                En caso de sismo o lluvias intensas, ubica puntos con agua potable, comparte baldes
                y apoya a los adultos mayores de tu cuadra incluso sin internet.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsTutorialOpen(false)}
          className="mt-4 w-full min-h-[48px] rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md transition active:scale-98"
        >
          Empezar
        </button>
      </div>
    </div>
  );
};
