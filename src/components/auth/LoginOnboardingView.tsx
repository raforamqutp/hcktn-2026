import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Lock,
  Search,
  ShieldAlert,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { validatePeruvianDni } from '../../services/dniService';
import { storageService } from '../../services/storageService';
import { TermsModal } from './TermsModal';

interface LoginOnboardingViewProps {
  onSuccess?: () => void;
}

export const LoginOnboardingView: React.FC<LoginOnboardingViewProps> = ({ onSuccess }) => {
  const { isOnline, currentUser, setCurrentUser, triggerEmergencyBypass } = useApp();

  const [dni, setDni] = useState('');
  const [swornAdult, setSwornAdult] = useState(true);
  const [loading, setLoading] = useState(false);
  const [livePreview, setLivePreview] = useState<{
    fullName: string;
    source: 'api_reniec' | 'offline_heuristic';
  } | null>(null);
  const [minorBlockedError, setMinorBlockedError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Consulta automática en tiempo real al ingresar los 8 dígitos
  useEffect(() => {
    if (dni.length === 8) {
      let isMounted = true;
      setLoading(true);
      setMinorBlockedError(null);
      setGeneralError(null);
      setLivePreview(null);

      validatePeruvianDni(dni, isOnline).then((res) => {
        if (!isMounted) return;
        setLoading(false);

        if (res.isMinorBlocked) {
          setLivePreview(null);
          setMinorBlockedError(
            res.errorMessage ||
              'DNI no habilitado o perteneciente a menor de edad. El registro titular requiere ser mayor de 18 años.'
          );
        } else if (res.success && res.fullName) {
          setMinorBlockedError(null);
          setLivePreview({
            fullName: res.fullName,
            source: res.source,
          });
        } else {
          setLivePreview(null);
          setGeneralError(res.errorMessage || 'No se pudo verificar el DNI en el padrón.');
        }
      });

      return () => {
        isMounted = false;
      };
    } else {
      setLivePreview(null);
      setMinorBlockedError(null);
      setGeneralError(null);
      setLoading(false);
    }
  }, [dni, isOnline]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!swornAdult) {
      setGeneralError('Debes confirmar la declaración jurada de mayoría de edad.');
      return;
    }
    if (dni.length !== 8) {
      setGeneralError('Ingresa los 8 dígitos de tu DNI.');
      return;
    }
    if (minorBlockedError) return;
    if (!livePreview) {
      setGeneralError('Espera a que el sistema verifique el DNI.');
      return;
    }

    const updatedUser = {
      ...currentUser,
      dni,
      fullName: livePreview.fullName,
      isVerifiedAdult: true,
      neighborhood: 'Urb. Los Perales / Yanahuara',
    };

    setCurrentUser(updatedUser);
    storageService.saveUserProfile(updatedUser);

    if (onSuccess) {
      onSuccess();
    }
  };

  const isFormValid =
    dni.length === 8 &&
    !loading &&
    livePreview !== null &&
    !minorBlockedError &&
    swornAdult;

  return (
    <div className="min-h-dvh w-full bg-[#FAFAFA] text-slate-900 flex flex-col justify-between p-4 sm:p-6 transition-all selection:bg-slate-900 selection:text-white">
      {/* Contenedor Central */}
      <div className="w-full max-w-[400px] mx-auto my-auto py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/80 space-y-5 animate-scale-in">
          {/* Cabecera Minimalista */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest font-mono">
              VecinOS · Yanahuara
            </span>
            <h1 className="text-2xl font-black text-slate-950 tracking-tight">
              Identifícate
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Ingresa tu DNI para verificar tu cuenta y conectarte con tu cuadra.
            </p>
          </div>

          {/* ALERTA: Menor de edad bloqueado */}
          {minorBlockedError && (
            <div
              role="alert"
              className="rounded-2xl bg-red-50 p-4 border border-red-200/80 text-xs space-y-2.5 text-red-950 animate-fade-in"
            >
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-black text-red-900">Acceso Titular Restringido</p>
                  <p className="text-[11px] font-medium text-red-800 leading-snug mt-0.5">
                    {minorBlockedError}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={triggerEmergencyBypass}
                className="w-full min-h-[40px] bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Pedir auxilio S.O.S. (Bypass Humanitario)</span>
              </button>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo DNI Manual */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <label htmlFor="dni-input" className="font-semibold text-slate-700">
                  DNI Peruano
                </label>
                <span className="font-mono text-[11px] font-bold text-slate-400">
                  {dni.length}/8
                </span>
              </div>

              <div className="relative">
                <input
                  id="dni-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  autoFocus
                  required
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ingresa 8 dígitos"
                  className="w-full rounded-2xl bg-slate-100/80 border border-slate-200/80 focus:border-slate-400 focus:bg-white p-3.5 pr-10 font-mono text-xl font-bold tracking-wider text-slate-950 placeholder:text-slate-400 placeholder:text-base placeholder:tracking-normal focus:outline-none transition"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-slate-700" />
                  ) : dni.length === 8 && livePreview ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Search className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Indicador de carga sutil */}
              {loading && (
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 font-medium animate-pulse">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-ping" />
                  <span>Consultando en el padrón oficial...</span>
                </div>
              )}

              {/* Nombre Encontrado en Base de Datos */}
              {livePreview && (
                <div className="rounded-2xl bg-emerald-50/90 border border-emerald-200/90 p-3.5 flex items-center justify-between text-xs animate-fade-in shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-black text-slate-950 truncate text-[13px]">
                      {livePreview.fullName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full shrink-0">
                    {livePreview.source === 'api_reniec' ? 'RENIEC Oficial' : 'Padrón Local'}
                  </span>
                </div>
              )}

              {/* Error general */}
              {generalError && (
                <p className="text-xs font-bold text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 animate-fade-in">
                  {generalError}
                </p>
              )}
            </div>

            {/* Declaración Jurada */}
            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-1 group">
              <input
                type="checkbox"
                checked={swornAdult}
                onChange={(e) => setSwornAdult(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-900 cursor-pointer"
              />
              <span className="text-[11px] text-slate-600 leading-snug group-hover:text-slate-900 transition">
                Declaro bajo juramento ser <strong className="text-slate-900">mayor de 18 años</strong> y vecino residente de la zona.
              </span>
            </label>

            {/* Botón de Ingreso: Estrictamente bloqueado hasta validar */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full min-h-[50px] rounded-2xl font-bold text-sm transition active:scale-[0.98] flex items-center justify-center gap-2 shadow-xs ${
                isFormValid
                  ? 'bg-slate-950 hover:bg-black text-white cursor-pointer shadow-md'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verificando identidad...</span>
                </>
              ) : isFormValid ? (
                <>
                  <span>Continuar al Barrio</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 opacity-50" />
                  <span>Ingresa tu DNI para continuar</span>
                </>
              )}
            </button>
          </form>

          {/* Enlace a Términos y Privacidad (Ley 29733) */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setIsTermsOpen(true)}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Términos de Convivencia y Privacidad (Ley N.° 29733)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer: Excepción Humanitaria S.O.S. */}
      <div className="w-full max-w-[400px] mx-auto pb-2 text-center">
        <button
          type="button"
          onClick={triggerEmergencyBypass}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition active:scale-95 py-2 px-3 rounded-full hover:bg-red-50"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>¿Estás en una emergencia? Acceso directo S.O.S. sin DNI</span>
        </button>
      </div>

      {/* Modal de Términos */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </div>
  );
};
