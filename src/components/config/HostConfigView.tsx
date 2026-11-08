import {
  AlertOctagon,
  ArrowLeft,
  CheckCircle2,
  Database,
  Navigation,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Type,
  Users,
  Wifi,
  WifiOff,
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OFFLINE_DNI_DIRECTORY } from '../../services/dniService';
import { storageService } from '../../services/storageService';
import { AccountTier, ActiveTab, UserProfile } from '../../types';

interface HostConfigViewProps {
  onExit: () => void;
}

export const HostConfigView: React.FC<HostConfigViewProps> = ({ onExit }) => {
  const {
    currentUser,
    setCurrentUser,
    isOnline,
    setIsOnline,
    mode,
    setMode,
    isSeniorMode,
    toggleSeniorMode,
    pendingSyncCount,
    syncNow,
    activeTab,
    setActiveTab,
    setIsOnboardingActive,
    designVariant,
    setDesignVariant,
  } = useApp();

  const [customDni, setCustomDni] = useState('');
  const [customName, setCustomName] = useState('');
  const [customIsAdult, setCustomIsAdult] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const selectPredefinedUser = (dni: string) => {
    const entry = OFFLINE_DNI_DIRECTORY[dni];
    if (!entry) return;

    const tier: AccountTier = entry.tier || (entry.isMinor ? 'nuevo' : 'activo');
    const weight = tier === 'referente' ? 1.5 : tier === 'activo' ? 1.0 : 0.25;

    const updated: UserProfile = {
      id: `usr-${dni}`,
      dni,
      fullName: entry.fullName,
      neighborhood: 'Urb. Los Perales / Yanahuara',
      accountTier: tier,
      seniorityMonths: tier === 'referente' ? 18 : tier === 'activo' ? 6 : 0,
      reputationWeight: weight,
      isVerifiedAdult: !entry.isMinor,
    };

    setCurrentUser(updated);
    storageService.saveUserProfile(updated);
    showToast(`Usuario cambiado a: ${entry.fullName}`);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDni.trim() || !customName.trim()) return;

    const updated: UserProfile = {
      id: `usr-${customDni}`,
      dni: customDni.trim(),
      fullName: customName.trim(),
      neighborhood: 'Urb. Los Perales / Yanahuara',
      accountTier: 'nuevo',
      seniorityMonths: 0,
      reputationWeight: 0.25,
      isVerifiedAdult: customIsAdult,
    };

    setCurrentUser(updated);
    storageService.saveUserProfile(updated);
    setCustomDni('');
    setCustomName('');
    showToast(`Nuevo usuario creado: ${updated.fullName}`);
  };

  const handleTierChange = (tier: AccountTier) => {
    const weight = tier === 'referente' ? 1.5 : tier === 'activo' ? 1.0 : 0.25;
    const months = tier === 'referente' ? 18 : tier === 'activo' ? 6 : 0;
    const updated: UserProfile = {
      ...currentUser,
      accountTier: tier,
      reputationWeight: weight,
      seniorityMonths: months,
    };
    setCurrentUser(updated);
    storageService.saveUserProfile(updated);
    showToast(`Nivel cambiado a: ${tier.toUpperCase()} (${weight}x peso)`);
  };

  const toggleMinorProtected = () => {
    const updated: UserProfile = {
      ...currentUser,
      isVerifiedAdult: !currentUser.isVerifiedAdult,
    };
    setCurrentUser(updated);
    storageService.saveUserProfile(updated);
    showToast(
      updated.isVerifiedAdult
        ? 'Cuenta configurada como Mayor de Edad'
        : 'Cuenta en Modo Protegido (Menor de Edad)'
    );
  };

  const handleFactoryReset = () => {
    if (window.confirm('¿Seguro que deseas restablecer todos los datos locales a los valores de fábrica?')) {
      storageService.resetAllToFactoryDefaults();
      showToast('Datos locales restablecidos.');
      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 800);
    }
  };

  const handleForceColdStart = () => {
    storageService.clearUserProfile();
    setIsOnboardingActive(true);
    onExit();
  };

  return (
    <div className="min-h-dvh bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Toast Notificación */}
      {actionMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-2xl bg-emerald-600 text-white px-4 py-2.5 font-bold text-xs shadow-2xl border border-emerald-400 flex items-center gap-2 animate-scale-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{actionMessage}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Cabecera del Panel Host */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-800">
                HOST ENDPOINT · /config
              </span>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                Solo Anfitrión / Jurado
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              Consola de Configuración y Pruebas
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Administra usuarios, niveles de reputación, simulación offline y datos de demostración.
            </p>
          </div>

          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 text-xs font-black shadow-lg transition active:scale-95 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver a VecinOS</span>
          </button>
        </div>

        {/* Estado Actual del Usuario */}
        <div className="rounded-3xl bg-slate-800/80 border border-slate-700 p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Usuario activo en sesión
              </span>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                {currentUser.fullName}
                {currentUser.isVerifiedAdult ? (
                  <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700">
                    Adulto Verificado
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-700">
                    Menor · Modo Protegido
                  </span>
                )}
              </h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
                DNI: <strong>{currentUser.dni}</strong>
              </span>
              <span className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 text-indigo-300">
                Tier: <strong>{currentUser.accountTier}</strong> ({currentUser.reputationWeight}x)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SECCIÓN 1: CAMBIAR USUARIOS DEL PADRÓN */}
          <div className="rounded-3xl bg-slate-800/80 border border-slate-700 p-5 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <Users className="h-5 w-5" />
              <h3 className="text-sm font-black text-white">Cambiar de Vecino en 1 Clic</h3>
            </div>
            <p className="text-xs text-slate-400">
              Selecciona cualquiera de las identidades precargadas del equipo o padrón:
            </p>

            <div className="space-y-2">
              {Object.entries(OFFLINE_DNI_DIRECTORY).map(([dni, entry]) => {
                const isSelected = currentUser.dni === dni;
                return (
                  <button
                    key={dni}
                    type="button"
                    onClick={() => selectPredefinedUser(dni)}
                    className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-950/90 border-indigo-500 text-white ring-1 ring-indigo-500'
                        : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:bg-slate-900 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">
                        {entry.fullName}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        DNI {dni} · {entry.roleDescription || 'Vecino'}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Crear Vecino al vuelo */}
            <form onSubmit={handleCreateCustom} className="pt-3 border-t border-slate-700 space-y-2.5">
              <span className="text-xs font-bold text-slate-300 block">
                O simular un vecino personalizado:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  maxLength={8}
                  placeholder="DNI (8 dígitos)"
                  value={customDni}
                  onChange={(e) => setCustomDni(e.target.value.replace(/\D/g, ''))}
                  className="rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Nombre y apellido"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customIsAdult}
                    onChange={(e) => setCustomIsAdult(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-indigo-600"
                  />
                  <span>Es mayor de 18 años</span>
                </label>
                <button
                  type="submit"
                  disabled={customDni.length !== 8 || !customName.trim()}
                  className="rounded-xl bg-indigo-600 disabled:opacity-50 hover:bg-indigo-500 text-white px-3 py-1.5 text-xs font-bold transition"
                >
                  Crear y Activar
                </button>
              </div>
            </form>
          </div>

          {/* SECCIÓN 2: PARÁMETROS DE REPUTACIÓN Y SIMULACIÓN */}
          <div className="space-y-6">
            {/* Ponderación del Voto Vecinal */}
            <div className="rounded-3xl bg-slate-800/80 border border-slate-700 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Sparkles className="h-5 w-5" />
                <h3 className="text-sm font-black text-white">Nivel de Reputación y Peso de Voto</h3>
              </div>
              <p className="text-xs text-slate-400">
                Demuestra en vivo cómo varía el impacto del voto en la calificación de servicios:
              </p>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'nuevo', label: 'Nuevo', weight: '0.25x' },
                  { id: 'activo', label: 'Activo', weight: '1.0x' },
                  { id: 'referente', label: 'Referente', weight: '1.5x' },
                ].map((tier) => {
                  const active = currentUser.accountTier === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => handleTierChange(tier.id as AccountTier)}
                      className={`p-3 rounded-2xl border text-center transition ${
                        active
                          ? 'bg-emerald-950 border-emerald-500 text-white ring-1 ring-emerald-500'
                          : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <span className="block text-xs font-black">{tier.label}</span>
                      <span className="block text-[11px] font-mono text-emerald-400 mt-0.5">
                        {tier.weight}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Toggle Modo Protegido de Menor */}
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Modo Protegido (Menor de Edad)</p>
                  <p className="text-[11px] text-slate-400">
                    Restringe transacciones de oficios/favores; mantiene solo SOS y mapa
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleMinorProtected}
                  className={`px-3 py-1.5 rounded-full text-xs font-black transition ${
                    !currentUser.isVerifiedAdult
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {!currentUser.isVerifiedAdult ? 'Activo' : 'Inactivo'}
                </button>
              </div>
            </div>

            {/* Selector de Motor de Diseño / Layout Engine */}
            <div className="rounded-3xl bg-slate-800/80 border border-slate-700 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Sparkles className="h-5 w-5" />
                  <h3 className="text-sm font-black text-white">Motor de Diseño y Experiencia</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  {designVariant === 'craft' ? 'Diseño Artesanal Activo' : 'Diseño Clásico'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Alterna entre el nuevo diseño nativo móvil y de escritorio basado en OpenDesign y Apple HIG, o regresa al diseño clásico anterior.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setDesignVariant('craft');
                    showToast('Cambiado a diseño Apple Craft (Doble Layout + Hold-to-Call)');
                  }}
                  className={`p-3 rounded-2xl border text-left transition ${
                    designVariant === 'craft'
                      ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500/50'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-emerald-400">🎨 Apple Craft (Nuevo)</span>
                    {designVariant === 'craft' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Shell móvil nativo con Segmented Control, Hold-to-Call 1s en emergencias y canvas de escritorio asimétrico.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDesignVariant('classic');
                    showToast('Cambiado a diseño Clásico (Anterior)');
                  }}
                  className={`p-3 rounded-2xl border text-left transition ${
                    designVariant === 'classic'
                      ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500/50'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-indigo-400">🏛 Clásico (Anterior)</span>
                    {designVariant === 'classic' && <CheckCircle2 className="h-4 w-4 text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Diseño previo con tarjetas estándar y panel de acompañamiento clásico.
                  </p>
                </button>
              </div>
            </div>

            {/* Simulación de Red y Modos */}
            <div className="rounded-3xl bg-slate-800/80 border border-slate-700 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Wifi className="h-5 w-5" />
                <h3 className="text-sm font-black text-white">Simulación de Entorno y Red</h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsOnline(!isOnline)}
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 transition text-left ${
                    isOnline
                      ? 'bg-emerald-950/70 border-emerald-600 text-emerald-200'
                      : 'bg-amber-950/70 border-amber-600 text-amber-200'
                  }`}
                >
                  {isOnline ? <Wifi className="h-5 w-5 text-emerald-400" /> : <WifiOff className="h-5 w-5 text-amber-400" />}
                  <div>
                    <span className="block text-xs font-black">
                      {isOnline ? 'En Línea (Online)' : 'Modo Offline'}
                    </span>
                    <span className="text-[10px] opacity-80">
                      {isOnline ? 'Internet disponible' : `${pendingSyncCount} pendientes en cola`}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode(mode === 'emergency' ? 'normal' : 'emergency')}
                  className={`p-3 rounded-2xl border flex items-center gap-2.5 transition text-left ${
                    mode === 'emergency'
                      ? 'bg-red-950/70 border-red-600 text-red-200'
                      : 'bg-slate-900 border-slate-700 text-slate-300'
                  }`}
                >
                  <AlertOctagon className={`h-5 w-5 ${mode === 'emergency' ? 'text-red-400' : 'text-slate-400'}`} />
                  <div>
                    <span className="block text-xs font-black">
                      {mode === 'emergency' ? 'Modo S.O.S. Activo' : 'Modo Normal'}
                    </span>
                    <span className="text-[10px] opacity-80">Alto contraste</span>
                  </div>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Type className="h-4 w-4 text-indigo-400" />
                  <span>Modo Letra Grande (Senior)</span>
                </div>
                <button
                  type="button"
                  onClick={toggleSeniorMode}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    isSeniorMode ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {isSeniorMode ? 'Activado' : 'Desactivado'}
                </button>
              </div>

              {pendingSyncCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    syncNow();
                    showToast('Cola local sincronizada.');
                  }}
                  className="w-full mt-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white py-2 text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Forzar Sincronización Inmediata ({pendingSyncCount})</span>
                </button>
              )}
            </div>

            {/* Navegación Rápida para el Anfitrión */}
            <div className="rounded-3xl bg-slate-800/80 border border-slate-700 p-5 space-y-3">
              <div className="flex items-center gap-2 text-sky-400">
                <Navigation className="h-5 w-5" />
                <h3 className="text-sm font-black text-white">Navegación Rápida a Módulos</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'services', label: 'Oficios y Ventas' },
                  { id: 'favors', label: 'Favores y Rutas' },
                  { id: 'map', label: 'Mapa Comunitario' },
                  { id: 'emergency', label: 'Emergencias S.O.S.' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id as ActiveTab);
                      showToast(`Navegando a: ${tab.label}`);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition text-left ${
                      activeTab === tab.id
                        ? 'bg-sky-950 border-sky-500 text-sky-200'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Acciones de Demo & Limpieza */}
            <div className="rounded-3xl bg-slate-800/80 border border-slate-700 p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-400">
                <Database className="h-5 w-5" />
                <h3 className="text-sm font-black text-white">Reinicio y Preparación de Demo</h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleForceColdStart}
                  className="flex-1 rounded-2xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700 text-indigo-200 py-3 px-4 text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Probar Login / Registro Inicial</span>
                </button>

                <button
                  type="button"
                  onClick={handleFactoryReset}
                  className="flex-1 rounded-2xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-200 py-3 px-4 text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Database className="h-4 w-4" />
                  <span>Restablecer Datos de Fábrica</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
