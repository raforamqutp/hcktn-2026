import { AlertTriangle, CheckCircle2, ShieldAlert, X } from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { validatePeruvianDni } from '../../services/dniService';

export const RegisterDniModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    isOnline,
    currentUser,
    setCurrentUser,
    triggerEmergencyBypass,
  } = useApp();

  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [swornAdult, setSwornAdult] = useState(true);
  const [loading, setLoading] = useState(false);
  const [minorBlockedError, setMinorBlockedError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMinorBlockedError(null);
    setGeneralError(null);

    if (!swornAdult) {
      setGeneralError('Confirma que eres mayor de 18 años para continuar.');
      return;
    }

    setLoading(true);
    const result = await validatePeruvianDni(dni, isOnline);
    setLoading(false);

    if (result.isMinorBlocked) {
      setMinorBlockedError(
        result.errorMessage ||
          'El registro titular está habilitado únicamente para mayores de 18 años.'
      );
      return;
    }

    if (!result.success || !result.fullName) {
      setGeneralError(result.errorMessage || 'Verifica los 8 dígitos de tu DNI.');
      return;
    }

    setCurrentUser({
      ...currentUser,
      dni: result.dni,
      fullName: result.fullName,
      isVerifiedAdult: true,
    });
    setIsAuthModalOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dni-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] rounded-t-[28px] sm:rounded-3xl bg-[#F8FAFC] p-5 pb-8 sm:p-6 text-slate-900 shadow-2xl animate-sheet sm:animate-scale-in max-h-[92vh] overflow-y-auto no-scrollbar border border-slate-200/60"
      >
        <div className="mx-auto mb-3 h-1.5 w-9 rounded-full bg-slate-300 sm:hidden" />

        <div className="flex items-center justify-between pb-3">
          <h2 id="dni-modal-title" className="text-lg font-bold tracking-tight text-slate-900">
            Identificación vecinal
          </h2>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            aria-label="Cerrar modal"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 transition"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Ingresa tu DNI para validar tu identidad y reputación con tus vecinos de la cuadra.
        </p>

        {minorBlockedError && (
          <div
            role="alert"
            className="mt-3 space-y-2.5 rounded-2xl border border-red-300 bg-red-50 p-3.5 text-xs text-red-950 animate-fade-in"
          >
            <div className="flex items-start gap-2">
              <ShieldAlert className="h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
              <div>
                <p className="font-bold text-red-800">Solo para mayores de 18 años</p>
                <p className="mt-0.5 text-red-700">{minorBlockedError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={triggerEmergencyBypass}
              className="flex w-full min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-3 py-2 text-xs font-bold text-white transition active:scale-95"
            >
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              <span>Reportar una emergencia de todas formas</span>
            </button>
          </div>
        )}

        {generalError && (
          <p
            role="alert"
            className="mt-3 rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs font-semibold text-amber-900 animate-fade-in"
          >
            {generalError}
          </p>
        )}

        <form onSubmit={handleValidate} className="mt-3 space-y-3">
          <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-xs border border-slate-200/60">
            <div className="p-3">
              <label htmlFor="dni-input" className="block text-[11px] font-medium text-slate-400">
                Número de DNI
              </label>
              <input
                id="dni-input"
                type="text"
                inputMode="numeric"
                maxLength={8}
                required
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                placeholder="8 dígitos"
                className="mt-0.5 w-full bg-transparent font-mono text-base font-bold text-slate-900 focus:outline-none"
              />
            </div>

            <div className="p-3">
              <label htmlFor="dni-pwd" className="block text-[11px] font-medium text-slate-400">
                Contraseña
              </label>
              <input
                id="dni-pwd"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-0.5 w-full bg-transparent text-sm text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-1 flex-wrap">
            <span className="text-[11px] text-slate-400">DNI Demo:</span>
            <button
              type="button"
              onClick={() => {
                setDni('70448548');
                setPassword('vecinos2026');
              }}
              className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition"
            >
              70448548 (Rafael)
            </button>
            <button
              type="button"
              onClick={() => {
                setDni('72393204');
                setPassword('vecinos2026');
              }}
              className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition"
            >
              72393204 (Bryan)
            </button>
            <button
              type="button"
              onClick={() => {
                setDni('81234567');
                setPassword('vecinos2026');
              }}
              className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium text-red-600 border border-red-200 hover:bg-red-50 transition"
            >
              81234567 (Menor)
            </button>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 rounded-2xl bg-white p-3 text-xs font-medium text-slate-700 shadow-xs border border-slate-200/60">
            <input
              type="checkbox"
              checked={swornAdult}
              onChange={(e) => setSwornAdult(e.target.checked)}
              className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Declaro ser mayor de 18 años y residir en la cuadra.</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3 text-sm font-bold text-white shadow-md transition active:scale-95"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <span>{loading ? 'Validando con Reniec...' : 'Confirmar identificación'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
