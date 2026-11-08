import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_DNI_LIST, validatePeruvianDni } from '../../services/dniService';
import { storageService } from '../../services/storageService';

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
  const [password, setPassword] = useState('vecinos2026');
  const [swornAdult, setSwornAdult] = useState(true);
  const [loading, setLoading] = useState(false);
  const [livePreview, setLivePreview] = useState<{
    fullName: string;
    source: 'api_reniec' | 'offline_heuristic';
  } | null>(null);
  const [minorBlockedError, setMinorBlockedError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ fullName: string; source: string } | null>(null);

  // Consulta automática en tiempo real apenas el usuario completa los 8 dígitos
  useEffect(() => {
    if (dni.length === 8) {
      let isMounted = true;
      setLoading(true);
      setMinorBlockedError(null);
      setGeneralError(null);

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
          setGeneralError(res.errorMessage || 'No se pudo verificar el DNI.');
        }
      });

      return () => {
        isMounted = false;
      };
    } else {
      setLivePreview(null);
      setMinorBlockedError(null);
      setGeneralError(null);
    }
  }, [dni, isOnline]);

  if (!isAuthModalOpen) return null;

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMinorBlockedError(null);
    setGeneralError(null);
    setSuccessInfo(null);

    if (!swornAdult) {
      setGeneralError('Debes confirmar la declaración jurada de mayoría de edad para continuar.');
      return;
    }

    if (dni.length !== 8) {
      setGeneralError('El DNI debe contener exactamente 8 dígitos numéricos.');
      return;
    }

    setLoading(true);
    const result = await validatePeruvianDni(dni, isOnline);
    setLoading(false);

    // Caso: Menor de edad bloqueado (Protección a menores)
    if (result.isMinorBlocked) {
      setMinorBlockedError(
        result.errorMessage ||
          'DNI no habilitado o perteneciente a menor de edad. El registro titular requiere ser mayor de 18 años.'
      );
      return;
    }

    // Caso: Error general
    if (!result.success || !result.fullName) {
      setGeneralError(result.errorMessage || 'Verifica los 8 dígitos de tu DNI.');
      return;
    }

    // Caso exitoso
    const updatedUser = {
      ...currentUser,
      dni: result.dni,
      fullName: result.fullName,
      isVerifiedAdult: true,
    };

    setCurrentUser(updatedUser);
    storageService.saveUserProfile(updatedUser);

    setSuccessInfo({
      fullName: result.fullName,
      source:
        result.source === 'api_reniec'
          ? 'RENIEC Oficial (Capa 1)'
          : 'Padrón Vecinal Offline (Capa 2)',
    });

    setTimeout(() => {
      setIsAuthModalOpen(false);
      setSuccessInfo(null);
    }, 1200);
  };

  const handleSelectDemoDni = (demoDni: string) => {
    setDni(demoDni);
    setPassword('vecinos2026');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dni-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[460px] rounded-t-[28px] sm:rounded-3xl bg-[#F8FAFC] p-5 pb-8 sm:p-6 text-slate-900 shadow-2xl animate-sheet sm:animate-scale-in max-h-[94vh] overflow-y-auto no-scrollbar border border-slate-300"
      >
        <div className="mx-auto mb-3 h-1.5 w-9 rounded-full bg-slate-300 sm:hidden" />

        {/* Encabezado del Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <UserCheck className="h-5 w-5 stroke-[2.2]" aria-hidden="true" />
            </div>
            <div>
              <h2 id="dni-modal-title" className="text-base font-black tracking-tight text-slate-950">
                Identificación Vecinal (3 Capas)
              </h2>
              <p className="text-[11px] font-medium text-slate-500">
                Consulta en vivo con RENIEC y Padrón Local
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            aria-label="Cerrar modal de identificación"
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Insignia de Estado de Red */}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200 text-xs">
          <span className="font-semibold text-slate-700">Estado de consulta:</span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
              isOnline
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-amber-100 text-amber-950 border border-amber-300'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="h-3 w-3 text-emerald-700" />
                Capa 1: RENIEC en vivo
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 text-amber-700" />
                Capa 2: Padrón Offline
              </>
            )}
          </span>
        </div>

        {/* ALERTA: BLOQUEO POR MENOR DE EDAD CON BYPASS S.O.S. */}
        {minorBlockedError && (
          <div
            role="alert"
            className="mt-3.5 space-y-3 rounded-2xl border-2 border-red-400 bg-red-50 p-4 text-xs text-red-950 animate-fade-in shadow-sm"
          >
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="h-6 w-6 shrink-0 text-red-600" aria-hidden="true" />
              <div>
                <p className="font-black text-sm text-red-900">
                  Acceso Titular Restringido — Protección Infantil
                </p>
                <p className="mt-1 text-red-800 leading-relaxed font-medium">
                  {minorBlockedError}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white/80 p-2.5 border border-red-200 text-[11px] text-red-900">
              <span className="font-bold">Norma de Seguridad:</span> El registro titular requiere ser mayor de 18 años.
            </div>

            {/* BOTÓN VITAL DE EXCEPCIÓN HUMANITARIA S.O.S. */}
            <button
              type="button"
              onClick={triggerEmergencyBypass}
              className="flex w-full min-h-[46px] items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-xs font-black text-white shadow-md transition active:scale-95"
            >
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              <span>Estoy en una Emergencia S.O.S. (Pedir auxilio sin cuenta de adulto)</span>
            </button>
          </div>
        )}

        {/* ALERTA DE ERROR GENERAL */}
        {generalError && (
          <p
            role="alert"
            className="mt-3 rounded-xl bg-amber-50 border border-amber-300 p-3 text-xs font-bold text-amber-900 animate-fade-in"
          >
            {generalError}
          </p>
        )}

        {/* MENSAJE DE ÉXITO FINAL */}
        {successInfo && (
          <div
            role="status"
            className="mt-3 space-y-1 rounded-2xl bg-emerald-50 border-2 border-emerald-400 p-3.5 text-xs text-emerald-950 animate-fade-in"
          >
            <div className="flex items-center gap-2 font-black text-sm text-emerald-900">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <span>Identidad Verificada y Guardada</span>
            </div>
            <p className="font-bold text-slate-900">{successInfo.fullName}</p>
            <p className="text-[11px] text-emerald-700 font-semibold">Fuente: {successInfo.source}</p>
          </div>
        )}

        {/* Formulario de Validación */}
        <form onSubmit={handleValidate} className="mt-3.5 space-y-3.5">
          <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-xs border border-slate-200">
            {/* Campo DNI */}
            <div className="p-3.5">
              <div className="flex items-center justify-between">
                <label htmlFor="dni-input" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Número de DNI (8 dígitos)
                </label>
                <span className="text-[11px] font-mono text-slate-400 font-bold">
                  {dni.length}/8
                </span>
              </div>
              <div className="relative mt-1 flex items-center">
                <input
                  id="dni-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  required
                  value={dni}
                  onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ej. 70448548"
                  className="w-full bg-transparent font-mono text-lg font-black text-slate-950 focus:outline-none pr-8"
                />
                {loading && (
                  <span className="absolute right-0 flex items-center text-emerald-600">
                    <Search className="h-4 w-4 animate-spin" />
                  </span>
                )}
              </div>
            </div>

            {/* VISTA PREVIA DEL NOMBRE OBTENIDO EN VIVO */}
            {livePreview && (
              <div className="p-3 bg-emerald-50/70 border-t border-emerald-100 animate-fade-in">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Nombre detectado en {livePreview.source === 'api_reniec' ? 'RENIEC Oficial' : 'Padrón Local'}:
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/60 rounded px-1.5 py-0.2">
                    {livePreview.source === 'api_reniec' ? 'Capa 1' : 'Capa 2'}
                  </span>
                </div>
                <p className="text-sm font-black text-slate-950 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{livePreview.fullName}</span>
                </p>
              </div>
            )}

            {/* Campo Contraseña o PIN de Seguridad */}
            <div className="p-3.5">
              <label htmlFor="dni-pwd" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Contraseña vecinal
              </label>
              <div className="mt-1 flex items-center gap-2">
                <Lock className="h-4 w-4 text-slate-400" />
                <input
                  id="dni-pwd"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm font-semibold text-slate-950 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* CHIPS RÁPIDOS PARA LA DEMO EN VIVO */}
          <div className="space-y-1.5 px-0.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
              <Shield className="h-3.5 w-3.5 text-slate-600" />
              <span>DNIs de demostración rápida:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DEMO_DNI_LIST.map((item) => (
                <button
                  key={item.dni}
                  type="button"
                  onClick={() => handleSelectDemoDni(item.dni)}
                  className={`inline-flex items-center min-h-[38px] rounded-full px-3 py-1.5 text-xs font-bold border transition ${
                    item.isMinor
                      ? 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* CAPA 3: DECLARACIÓN JURADA EN 1 CLIC */}
          <label className="flex cursor-pointer items-start gap-2.5 rounded-2xl bg-white p-3 text-xs font-semibold text-slate-800 shadow-xs border border-slate-200 hover:bg-slate-50/80 transition">
            <input
              type="checkbox"
              checked={swornAdult}
              onChange={(e) => setSwornAdult(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="leading-snug">
              <span className="font-black text-slate-950">Capa 3 (Declaración Jurada):</span> Declaro bajo juramento ser mayor de 18 años y vecino residente de la zona.
            </span>
          </label>

          {/* BOTÓN DE ACCIÓN PRINCIPAL */}
          <button
            type="submit"
            disabled={loading || !dni || dni.length !== 8}
            className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 py-3 text-sm font-black text-white shadow-md transition active:scale-95 cursor-pointer disabled:cursor-not-allowed"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>
              {loading
                ? 'Consultando en RENIEC...'
                : 'Confirmar Identificación Vecinal'}
            </span>
          </button>
        </form>

        {/* Resumen de las 3 capas */}
        <div className="mt-4 rounded-xl bg-slate-100 p-2.5 text-[11px] font-medium text-slate-600 border border-slate-200/80">
          <p className="font-bold text-slate-800 mb-1">Mecanismo de Confianza en 3 Capas:</p>
          <p>1. RENIEC API en vivo · 2. Padrón Vecinal Offline + Heurística · 3. Declaración Jurada 18+.</p>
        </div>
      </div>
    </div>
  );
};
