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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-xs animate-fade-in"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[430px] rounded-t-[28px] bg-[#F2F2F7] p-5 pb-8 text-slate-900 shadow-2xl animate-sheet"
      >
        <div className="mx-auto mb-3 h-1.5 w-9 rounded-full bg-slate-300" />

        <div className="flex items-center justify-between pb-3">
          <h2 id="dni-modal-title" className="text-lg font-bold tracking-tight">
            Identificación vecinal
          </h2>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            aria-label="Cerrar"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/80 text-slate-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Ingresa tu DNI para validar tu nombre con tu vecindario.
        </p>

        {minorBlockedError && (
          <div
            role="alert"
            className="mt-3 space-y-2.5 rounded-2xl border border-red-300 bg-red-50 p-3.5 text-xs text-red-950"
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
              className="flex w-full min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white"
            >
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              <span>Reportar una emergencia ahora</span>
            </button>
          </div>
        )}

        {generalError && (
          <p
            role="alert"
            className="mt-3 rounded-2xl bg-amber-50 p-3 text-xs font-medium text-amber-900"
          >
            {generalError}
          </p>
        )}

        <form onSubmit={handleValidate} className="mt-3 space-y-3">
          <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-xs">
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

          <div className="flex items-center gap-1.5 px-1">
            <span className="text-[11px] text-slate-400">Autocompletar:</span>
            <button
              type="button"
              onClick={() => {
                setDni('70448548');
                setPassword('vecinos2026');
              }}
              className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-600 shadow-2xs"
            >
              70448548
            </button>
            <button
              type="button"
              onClick={() => {
                setDni('73477590');
                setPassword('vecinos2026');
              }}
              className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-600 shadow-2xs"
            >
              73477590
            </button>
            <button
              type="button"
              onClick={() => {
                setDni('81234567');
                setPassword('vecinos2026');
              }}
              className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-600 shadow-2xs"
            >
              81234567 (Menor)
            </button>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 rounded-2xl bg-white p-3 text-xs font-medium text-slate-700 shadow-xs">
            <input
              type="checkbox"
              checked={swornAdult}
              onChange={(e) => setSwornAdult(e.target.checked)}
              className="h-4 w-4 rounded text-emerald-600"
            />
            <span>Declaro ser mayor de 18 años y residir en el barrio.</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md transition active:scale-98"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <span>{loading ? 'Validando...' : 'Continuar'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
