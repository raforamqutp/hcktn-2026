import { FileText, Shield, ShieldCheck, X } from 'lucide-react';
import React from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] rounded-t-[28px] sm:rounded-3xl bg-white p-5 pb-8 sm:p-6 text-slate-900 shadow-2xl animate-sheet sm:animate-scale-in max-h-[85vh] overflow-y-auto no-scrollbar border border-slate-200"
      >
        <div className="mx-auto mb-3 h-1.5 w-9 rounded-full bg-slate-300 sm:hidden" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h2 id="terms-title" className="text-sm font-black text-slate-950">
                Términos y Condiciones
              </h2>
              <p className="text-[11px] font-semibold text-slate-500">
                Información de uso y convivencia comunitaria
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar términos"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-xs text-slate-700 leading-relaxed font-normal">
          <div className="rounded-2xl bg-emerald-50/70 p-3.5 border border-emerald-200/80">
            <p className="font-bold text-emerald-950 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>1. Protección de Datos Personales (Ley N.° 29733)</span>
            </p>
            <p className="text-[11px] text-emerald-900">
              Tu DNI solo se utiliza para verificar tu condición de vecino mayor de edad ante el padrón comunitario. En reportes de auxilio médico o personas vulnerables, la ubicación exacta se resguarda mediante un radio de privacidad de ~150 metros para evitar la exposición pública y caduca en 72 horas.
            </p>
          </div>

          <div className="space-y-1 rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
            <p className="font-bold text-slate-950 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-slate-700 shrink-0" />
              <span>2. Intermediación y Acuerdos de Buena Fe</span>
            </p>
            <p className="text-[11px] text-slate-600">
              VecinOS es una herramienta hiperlocal de coordinación comunitaria y fomento del trueque solidario. Los acuerdos de intercambio y servicios entre vecinos se realizan de mutuo acuerdo y bajo el principio de buena fe vecinal.
            </p>
          </div>

          <div className="space-y-1 rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
            <p className="font-bold text-slate-950">3. Puntos Seguros de Encuentro</p>
            <p className="text-[11px] text-slate-600">
              Para intercambio de herramientas, víveres o trueques, recomendamos utilizar puntos visibles y transitados del barrio: Parque Central de Yanahuara, casetas de serenazgo o exteriores de la parroquia.
            </p>
          </div>

          <div className="space-y-1 rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
            <p className="font-bold text-slate-950">4. Excepción Humanitaria S.O.S.</p>
            <p className="text-[11px] text-slate-600">
              Cualquier habitante del barrio (incluyendo menores o vecinos no registrados) puede acceder de forma directa al canal de emergencias S.O.S. en caso de sismo, incendio o riesgo vital inminente.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full min-h-[44px] rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-black shadow-sm transition active:scale-95"
        >
          Entendido y de acuerdo
        </button>
      </div>
    </div>
  );
};
