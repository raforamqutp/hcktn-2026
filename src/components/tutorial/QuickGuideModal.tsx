import { AlertOctagon, HeartHandshake, ShieldCheck, X } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
    >
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800">
              Bienvenido a tu cuadra
            </span>
            <h2 id="guide-modal-title" className="mt-1 text-lg font-extrabold text-slate-900">
              Guía Rápida de VecinOS en 3 Pasos
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsTutorialOpen(false)}
            aria-label="Cerrar guía rápida"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs">
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-600" aria-hidden="true" />
            <div className="space-y-1.5">
              <p className="font-extrabold text-slate-900">
                1. Servicios y Gastronomía con 3 Caritas Ponderadas y Trueque
              </p>
              <p className="text-slate-600">
                Encuentra oficios (cerrajero, gasfitero) o comida casera a menos de 10 min a pie.
                Paga en efectivo, Yape/Plin o propón un <strong>Trueque</strong>. Las cuentas con
                antigüedad pesan más al calificar:
              </p>
              <div className="dark-surface inline-flex items-center gap-3 rounded-xl bg-slate-950 px-3 py-2">
                <RatingFaceIcon sentiment="happy" size="sm" showLabel />
                <RatingFaceIcon sentiment="neutral" size="sm" showLabel />
                <RatingFaceIcon sentiment="angry" size="sm" showLabel />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <HeartHandshake className="h-6 w-6 shrink-0 text-indigo-600" aria-hidden="true" />
            <div>
              <p className="font-extrabold text-slate-900">
                2. Cadena de Favores, Muletas y Pool Escolar en 3 Clics
              </p>
              <p className="mt-0.5 text-slate-600">
                Presta muletas o herramientas sin dinero, coordina el <strong>Pool Escolar</strong>{' '}
                hacia el colegio y publica cualquier necesidad en máximo 3 toques.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/70 p-3">
            <AlertOctagon className="h-6 w-6 shrink-0 text-red-600" aria-hidden="true" />
            <div>
              <p className="font-extrabold text-red-950">
                3. Modo Emergencia S.O.S. (Funciona Offline y por SMS)
              </p>
              <p className="mt-0.5 text-red-900">
                Ante un sismo o lluvias de El Niño, ubica vecinos vulnerables (con radio de
                privacidad Ley 29733), comparte baldes/agua potable y envía alertas por SMS aunque
                caiga el internet.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsTutorialOpen(false)}
          className="mt-4 w-full min-h-[48px] rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-extrabold text-white shadow hover:bg-emerald-700"
        >
          Entendido, ingresar a mi barrio
        </button>
      </div>
    </div>
  );
};
