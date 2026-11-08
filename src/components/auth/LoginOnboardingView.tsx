import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Search,
  ShieldAlert,
  Smartphone,
  UserCheck,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OFFLINE_DNI_DIRECTORY, validatePeruvianDni } from '../../services/dniService';
import { storageService } from '../../services/storageService';
import { VecinosBrandLogo } from '../common/VecinosBrandLogo';
import { TermsModal } from './TermsModal';

interface LoginOnboardingViewProps {
  onSuccess?: () => void;
}

export const LoginOnboardingView: React.FC<LoginOnboardingViewProps> = ({ onSuccess }) => {
  const { isOnline, currentUser, setCurrentUser, triggerEmergencyBypass } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Campos de formulario
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [swornAgreement, setSwornAgreement] = useState(true);

  // Estados de validación
  const [loading, setLoading] = useState(false);
  const [livePreview, setLivePreview] = useState<{
    fullName: string;
  } | null>(null);
  const [isMinor, setIsMinor] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [recoveryNotice, setRecoveryNotice] = useState<string | null>(null);

  // 5 clics rápidos en el cuadrado del logo para acceder a /config
  const logoClickCountRef = useRef(0);
  const logoClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoSquareClick = () => {
    logoClickCountRef.current += 1;
    if (logoClickTimerRef.current) clearTimeout(logoClickTimerRef.current);
    logoClickTimerRef.current = setTimeout(() => {
      logoClickCountRef.current = 0;
    }, 1800);

    if (logoClickCountRef.current >= 5) {
      logoClickCountRef.current = 0;
      window.location.hash = '#/config';
    }
  };

  // Consulta automática en tiempo real al ingresar 8 dígitos en modo Registro
  useEffect(() => {
    if (authMode === 'register' && dni.length === 8) {
      let isMounted = true;
      setLoading(true);
      setGeneralError(null);
      setLivePreview(null);
      setIsMinor(false);

      validatePeruvianDni(dni, isOnline).then((res) => {
        if (!isMounted) return;
        setLoading(false);

        if (res.isMinorBlocked) {
          setIsMinor(true);
          setLivePreview({
            fullName: res.fullName || 'Vecino (Menor de Edad)',
          });
        } else if (res.success && res.fullName) {
          setIsMinor(false);
          setLivePreview({
            fullName: res.fullName,
          });
        } else {
          setIsMinor(false);
          setLivePreview(null);
          setGeneralError(res.errorMessage || 'No se pudo verificar el DNI.');
        }
      });

      return () => {
        isMounted = false;
      };
    } else if (authMode === 'register') {
      setLivePreview(null);
      setIsMinor(false);
      setGeneralError(null);
      setLoading(false);
    }
  }, [dni, isOnline, authMode]);

  // Manejo de Iniciar Sesión
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (dni.length !== 8) {
      setGeneralError('Ingresa los 8 dígitos de tu DNI.');
      return;
    }
    if (!password.trim()) {
      setGeneralError('Ingresa tu contraseña para acceder.');
      return;
    }

    // Comprobar si existe en cuentas registradas locales o padrón
    const registered = storageService.loadRegisteredAccounts()[dni];
    const knownEntry = OFFLINE_DNI_DIRECTORY[dni];

    const fullName = registered?.fullName || knownEntry?.fullName || 'Vecino Verificado';
    const isUserMinor = registered?.isMinor ?? knownEntry?.isMinor ?? false;
    const tier = knownEntry?.tier || 'activo';
    const weight = tier === 'referente' ? 1.5 : tier === 'activo' ? 1.0 : 0.25;

    const userProfile = {
      ...currentUser,
      dni,
      fullName,
      phone: registered?.phone || phone || undefined,
      isVerifiedAdult: !isUserMinor,
      neighborhood: 'Urb. Los Perales / Yanahuara',
      accountTier: tier,
      reputationWeight: weight,
    };

    setCurrentUser(userProfile);
    storageService.saveUserProfile(userProfile);

    if (onSuccess) {
      onSuccess();
    }
  };

  // Manejo de Crear Cuenta
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!swornAgreement) {
      setGeneralError('Debes aceptar los términos vecinales para continuar.');
      return;
    }
    if (dni.length !== 8) {
      setGeneralError('Ingresa los 8 dígitos de tu DNI.');
      return;
    }
    if (!livePreview) {
      setGeneralError('Espera a que se verifique tu DNI.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setGeneralError('Crea una contraseña segura de al menos 4 caracteres.');
      return;
    }

    // Guardar credenciales en almacenamiento local
    storageService.saveRegisteredAccount(dni, {
      password,
      phone: phone.trim() || undefined,
      fullName: livePreview.fullName,
      isMinor,
    });

    const registeredUser = {
      ...currentUser,
      dni,
      fullName: livePreview.fullName,
      phone: phone.trim() || undefined,
      isVerifiedAdult: !isMinor,
      neighborhood: 'Urb. Los Perales / Yanahuara',
      accountTier: (isMinor ? 'nuevo' : 'activo') as 'nuevo' | 'activo',
      reputationWeight: isMinor ? 0.25 : 1.0,
    };

    setCurrentUser(registeredUser);
    storageService.saveUserProfile(registeredUser);

    if (onSuccess) {
      onSuccess();
    }
  };

  const handleForgotPassword = () => {
    if (dni.length !== 8) {
      setGeneralError('Ingresa tu DNI primero para recuperar tu contraseña.');
      return;
    }
    const accounts = storageService.loadRegisteredAccounts();
    const acc = accounts[dni];
    const registeredPhone = acc?.phone || '958 ••• •40';
    setRecoveryNotice(
      `Te enviamos un enlace de recuperación por SMS al celular asociado (${registeredPhone}). Por motivos de demostración, tu acceso sigue habilitado ingresando cualquier clave temporal.`
    );
  };

  return (
    <div className="min-h-dvh w-full bg-[#F8FAFC] text-slate-900 flex flex-col justify-between p-4 sm:p-6 transition-all selection:bg-slate-900 selection:text-white">
      {/* Contenedor Central */}
      <div className="w-full max-w-[420px] mx-auto my-auto py-6">
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-slate-200 space-y-5 animate-scale-in">
          {/* Logo y Encabezado */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleLogoSquareClick}
                  className="focus:outline-none transition transform active:scale-95"
                  title="VecinOS"
                  aria-label="Logo VecinOS (5 clics rápidos para configuración)"
                >
                  <VecinosBrandLogo size="sm" />
                </button>
                <div>
                  <div className="flex items-baseline tracking-tight leading-none">
                    <span className="text-[17px] font-black text-slate-950">
                      Vecin<span className="text-emerald-600">OS</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 leading-none block mt-0.5">
                    Yanahuara · Arequipa
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                {authMode === 'login' ? 'Bienvenido a tu barrio' : 'Registro de nuevo vecino'}
              </h1>
              <p className="text-xs font-medium text-slate-600 leading-relaxed mt-1">
                {authMode === 'login'
                  ? 'Ingresa tu DNI y contraseña para conectarte con tu cuadra.'
                  : 'Identifícate con tu DNI para verificar tu cuenta de forma segura.'}
              </p>
            </div>
          </div>

          {/* Selector de Pestañas: Iniciar Sesión vs Crear Cuenta */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-black">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setGeneralError(null);
              }}
              className={`py-2 rounded-xl transition ${
                authMode === 'login'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setGeneralError(null);
              }}
              className={`py-2 rounded-xl transition ${
                authMode === 'register'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {/* FORMULARIO DE INICIAR SESIÓN */}
          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <label htmlFor="login-dni" className="font-bold text-slate-800">
                    DNI Peruano
                  </label>
                  <span className="font-mono text-[11px] font-semibold text-slate-400">
                    {dni.length}/8 dígitos
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="login-dni"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={8}
                    autoFocus
                    required
                    value={dni}
                    onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ej. 70448548"
                    className="w-full rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-slate-400 focus:bg-white p-3.5 font-mono text-lg font-bold text-slate-950 placeholder:text-slate-400 placeholder:text-sm focus:outline-none transition"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <UserCheck className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <label htmlFor="login-password" className="font-bold text-slate-800">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    className="w-full rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-slate-400 focus:bg-white p-3.5 pr-12 text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {recoveryNotice && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-3 text-xs text-emerald-950 animate-fade-in">
                  <p className="font-medium leading-relaxed">{recoveryNotice}</p>
                </div>
              )}

              {generalError && (
                <p className="text-xs font-bold text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200 animate-fade-in">
                  {generalError}
                </p>
              )}

              <button
                type="submit"
                disabled={dni.length !== 8 || !password.trim()}
                className={`w-full min-h-[50px] rounded-2xl font-black text-sm transition active:scale-[0.98] flex items-center justify-center gap-2 shadow-md ${
                  dni.length === 8 && password.trim()
                    ? 'bg-slate-950 hover:bg-black text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Ingresar a VecinOS</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            /* FORMULARIO DE CREAR CUENTA */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* DNI con validación en vivo */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <label htmlFor="reg-dni" className="font-bold text-slate-800">
                    DNI Peruano
                  </label>
                  <span className="font-mono text-[11px] font-semibold text-slate-400">
                    {dni.length}/8 dígitos
                  </span>
                </div>

                <div className="relative">
                  <input
                    id="reg-dni"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={8}
                    autoFocus
                    required
                    value={dni}
                    onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ingresa 8 dígitos"
                    className="w-full rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-slate-400 focus:bg-white p-3.5 pr-10 font-mono text-lg font-bold text-slate-950 placeholder:text-slate-400 placeholder:text-sm focus:outline-none transition"
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

                {loading && (
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 font-medium animate-pulse">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-ping" />
                    <span>Validando identidad vecinal...</span>
                  </div>
                )}

                {/* Nombre verificado */}
                {livePreview && (
                  <div className="rounded-2xl bg-emerald-50/90 border border-emerald-200 p-3.5 flex items-center justify-between text-xs animate-fade-in">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="font-black text-slate-950 truncate text-[13px]">
                        {livePreview.fullName}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                      Verificado
                    </span>
                  </div>
                )}

                {/* Modo Protegido para Menor */}
                {isMinor && (
                  <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 space-y-1 text-xs text-amber-950 animate-fade-in">
                    <div className="flex items-center gap-2 font-bold text-amber-900">
                      <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>Cuenta de Menor de Edad</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-snug font-medium">
                      Por protección vecinal, tu cuenta tendrá <strong>Modo Protegido</strong> (acceso al mapa del barrio y reportes S.O.S.). Las transacciones de oficios o trueques están reservadas a adultos.
                    </p>
                  </div>
                )}
              </div>

              {/* Crear Contraseña */}
              <div className="space-y-1.5">
                <label htmlFor="reg-password" className="block text-xs font-bold text-slate-800">
                  Crea tu Contraseña
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 4 caracteres"
                    className="w-full rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-slate-400 focus:bg-white p-3.5 pr-12 text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Celular Opcional */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <label htmlFor="reg-phone" className="font-bold text-slate-800">
                    Número de Celular <span className="font-normal text-slate-500">(Opcional)</span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="reg-phone"
                    type="tel"
                    maxLength={9}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ej. 958 123 456"
                    className="w-full rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-slate-400 focus:bg-white p-3.5 pr-10 text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:outline-none transition"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Smartphone className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  Útil para recuperar tu clave por SMS y para que tus vecinos coordinen contigo.
                </p>
              </div>

              {/* Declaración Jurada */}
              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-1 group">
                <input
                  type="checkbox"
                  checked={swornAgreement}
                  onChange={(e) => setSwornAgreement(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-900 cursor-pointer"
                />
                <span className="text-[11px] text-slate-600 leading-snug group-hover:text-slate-900 transition">
                  {isMinor ? (
                    <>Declaro ser vecino de la zona y acceder con <strong>autorización de mi apoderado</strong>.</>
                  ) : (
                    <>Declaro bajo juramento ser <strong className="text-slate-900">mayor de 18 años</strong> y vecino residente de la zona.</>
                  )}
                </span>
              </label>

              {generalError && (
                <p className="text-xs font-bold text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200 animate-fade-in">
                  {generalError}
                </p>
              )}

              {/* Botón de Registro */}
              <button
                type="submit"
                disabled={dni.length !== 8 || !livePreview || !password.trim() || !swornAgreement}
                className={`w-full min-h-[50px] rounded-2xl font-black text-sm transition active:scale-[0.98] flex items-center justify-center gap-2 shadow-md ${
                  dni.length === 8 && livePreview && password.trim() && swornAgreement
                    ? 'bg-slate-950 hover:bg-black text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{isMinor ? 'Crear Cuenta (Modo Protegido)' : 'Crear mi cuenta e ingresar'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* Enlace a Términos y Condiciones */}
          <div className="text-center pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsTermsOpen(true)}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Términos y Condiciones del Servicio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer: Excepción Humanitaria S.O.S. */}
      <div className="w-full max-w-[420px] mx-auto pb-2 text-center">
        <button
          type="button"
          onClick={triggerEmergencyBypass}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition active:scale-95 py-2 px-3 rounded-full hover:bg-red-50"
        >
          <AlertTriangle className="h-4 w-4" />
          <span>¿Estás en una emergencia? Acceso directo S.O.S. sin DNI</span>
        </button>
      </div>

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </div>
  );
};
