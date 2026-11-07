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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={() => setIsTutorialOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[460px] rounded-t-[28px] sm:rounded-3xl bg-[#F8FAFC] p-5 pb-8 sm:p-6 text-slate-900 shadow-2xl animate-sheet sm:animate-scale-in max-h-[92vh] overflow-y-auto no-scrollbar border-2 border-slate-300"
      >
        <div className="mx-auto mb-3 h-1.5 w-9 rounded-full bg-slate-300 sm:hidden" />

        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
          <div>
            <h2 id="guide-modal-title" className="text-lg font-black tracking-tight text-slate-950">
              Tu barrio en VecinOS
            </h2>
            <p className="text-xs font-semibold text-slate-600">Todo a menos de 10 minutos caminando</p>
          </div>
          <button
            type="button"
            onClick={() => setIsTutorialOpen(false)}
            aria-label="Cerrar guía"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 space-y-3 text-xs">
          <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-xs border-2 border-slate-200">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
              <Store className="h-5 w-5 stroke-[2.2]" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <p className="font-black text-slate-950 text-sm">Oficios, comida casera y trueque</p>
              <p className="leading-relaxed font-medium text-slate-700">
                Contacta al cerrajero de la cuadra o pide comida casera. Puedes pagar en efectivo,
                Yape/Plin o proponer un trueque, y calificar cómo te fue con caras táctiles:
              </p>
              <div className="inline-flex items-center gap-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 px-3 py-2">
                <RatingFaceIcon sentiment="happy" size="sm" showLabel />
                <RatingFaceIcon sentiment="neutral" size="sm" showLabel />
                <RatingFaceIcon sentiment="angry" size="sm" showLabel />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-xs border-2 border-slate-200">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-800">
              <HeartHandshake className="h-5 w-5 stroke-[2.2]" aria-hidden="true" />
            </div>
            <div>
              <p className="font-black text-slate-950 text-sm">Favores y pool escolar</p>
              <p className="mt-1 leading-relaxed font-medium text-slate-700">
                Pide prestadas muletas o herramientas sin gastar dinero y coordina rutas al colegio
                con otros padres de tu manzana.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-xs border-2 border-slate-200">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-800">
              <AlertOctagon className="h-5 w-5 stroke-[2.2]" aria-hidden="true" />
            </div>
            <div>
              <p className="font-black text-slate-950 text-sm">Apoyo en emergencias S.O.S.</p>
              <p className="mt-1 leading-relaxed font-medium text-slate-700">
                En caso de sismo o lluvias intensas, ubica puntos con agua potable, comparte baldes
                y apoya a los adultos mayores de tu cuadra incluso sin internet.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsTutorialOpen(false)}
          className="mt-4 w-full min-h-[48px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3 text-sm font-black text-white shadow-md transition active:scale-95"
        >
          Entendido, entrar al barrio
        </button>
      </div>
    </div>
  );
};
