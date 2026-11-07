import { AlertTriangle, CheckCircle2, ShieldAlert, UserCheck, X } from 'lucide-react';
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
      setGeneralError('Debes marcar la declaración jurada de mayoría de edad (Capa 3).');
      return;
    }

    setLoading(true);
    const result = await validatePeruvianDni(dni, isOnline);
    setLoading(false);

    if (result.isMinorBlocked) {
      setMinorBlockedError(
        result.errorMessage ||
          'DNI no habilitado o perteneciente a menor de edad. El registro titular requiere ser mayor de 18 años.'
      );
      return;
    }

    if (!result.success || !result.fullName) {
      setGeneralError(result.errorMessage || 'No se pudo validar el DNI ingresado.');
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
    >
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            <h2 id="dni-modal-title" className="text-base font-extrabold text-slate-900">
              Verificación Vecinal por DNI (3 Capas)
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            aria-label="Cerrar ventana de validación DNI"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-[11px] text-slate-600">
          <p className="font-bold text-slate-800">DNIs de prueba rápida para el Jurado:</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setDni('70448548')}
              className="rounded bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-900"
            >
              70448548 (Adulto)
            </button>
            <button
              type="button"
              onClick={() => setDni('73477590')}
              className="rounded bg-emerald-100 px-2 py-0.5 font-mono font-bold text-emerald-900"
            >
              73477590 (Adulto)
            </button>
            <button
              type="button"
              onClick={() => setDni('81234567')}
              className="rounded bg-red-100 px-2 py-0.5 font-mono font-bold text-red-900"
            >
              81234567 (Probar Bloqueo Menor)
            </button>
          </div>
        </div>

        {minorBlockedError && (
          <div
            role="alert"
            className="mt-3 space-y-2.5 rounded-2xl border-2 border-red-500 bg-red-50 p-3.5 text-xs text-red-950"
          >
            <div className="flex items-start gap-2">
              <ShieldAlert className="h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
              <div>
                <p className="font-extrabold text-red-800">
                  Bloqueo de Seguridad Infantil (Menor de 18 años)
                </p>
                <p className="mt-0.5">{minorBlockedError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={triggerEmergencyBypass}
              className="flex w-full min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-extrabold text-white shadow hover:bg-red-700"
            >
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              <span>Estoy en una Emergencia S.O.S. (Pedir auxilio sin cuenta titular)</span>
            </button>
          </div>
        )}

        {generalError && (
          <p role="alert" className="mt-2 rounded-xl bg-amber-50 p-2.5 text-xs font-semibold text-amber-900">
            {generalError}
          </p>
        )}

        <form onSubmit={handleValidate} className="mt-3 space-y-3">
          <div>
            <label htmlFor="dni-input" className="block text-xs font-bold text-slate-700">
              Número de DNI (8 dígitos - Consulta apis.net.pe + Heurística Offline):
            </label>
            <input
              id="dni-input"
              type="text"
              maxLength={8}
              required
              value={dni}
              onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
              placeholder="Ej. 70448548"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-mono text-sm font-bold text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="dni-pwd" className="block text-xs font-bold text-slate-700">
              Contraseña de vecino:
            </label>
            <input
              id="dni-pwd"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs font-semibold text-emerald-950">
            <input
              type="checkbox"
              checked={swornAdult}
              onChange={(e) => setSwornAdult(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded text-emerald-600"
            />
            <span>Declaro ser mayor de 18 años y vecino residente de la zona (Capa 3).</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-extrabold text-white shadow hover:bg-emerald-700"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            <span>{loading ? 'Verificando padrón...' : 'Verificar Identidad y Continuar'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
