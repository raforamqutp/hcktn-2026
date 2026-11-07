import {
  AlertOctagon,
  ArrowRight,
  HeartHandshake,
  MapPin,
  PhoneCall,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import React from 'react';
import { useApp } from '../../context/AppContext';
import { CommunityMap } from '../map/CommunityMap';

export const DesktopCompanionPanel: React.FC = () => {
  const {
    mode,
    services,
    favors,
    emergencyItems,
    openPublishModal,
    setActiveTab,
  } = useApp();

  const isEmergency = mode === 'emergency';
  const activeAlertsCount = emergencyItems.filter((i) => i.status === 'activo').length;
  const activeBartersCount = services.filter((s) => s.paymentMethods.includes('trueque')).length;

  return (
    <aside
      aria-label="Panel lateral del barrio"
      className="hidden lg:flex lg:flex-col gap-4 sticky top-20 self-start"
    >
      {/* 1. Radar Vecinal / Mini Mapa */}
      <div
        className={`rounded-3xl border-2 overflow-hidden transition-all shadow-xs ${
          isEmergency
            ? 'border-slate-700 bg-[#111726]'
            : 'border-slate-200 bg-white'
        }`}
      >
        <div className="p-4 pb-3 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
            </span>
            <div>
              <h3
                className={`text-sm font-black tracking-tight ${
                  isEmergency ? 'text-white' : 'text-slate-950'
                }`}
              >
                Tu barrio en tiempo real
              </h3>
              <p
                className={`text-[11px] font-semibold ${
                  isEmergency ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                A menos de 10 min a pie
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-xl transition ${
              isEmergency
                ? 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span>Ver mapa grande</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="p-3">
          <CommunityMap compact heightClassName="h-[210px]" />
        </div>

        <div className="px-4 pb-3 pt-1 flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5 text-slate-800">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            Yanahuara / Los Perales
          </span>
          <span className="text-emerald-800 font-black">
            {services.length + favors.length} puntos en tu cuadra
          </span>
        </div>
      </div>

      {/* 2. Resumen Amigable del Barrio (Simple, No Saturado, Apto para Todo Público) */}
      <div
        className={`rounded-3xl border-2 p-5 space-y-3.5 transition-all shadow-xs ${
          isEmergency
            ? 'border-slate-700 bg-[#111726]'
            : 'border-slate-200 bg-white'
        }`}
      >
        <div className="flex items-center justify-between">
          <h3
            className={`text-sm font-black tracking-tight flex items-center gap-2 ${
              isEmergency ? 'text-white' : 'text-slate-950'
            }`}
          >
            <Sparkles className="h-4 w-4 text-emerald-600" />
            Tu comunidad hoy
          </h3>
          <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-900 bg-emerald-100 border border-emerald-300 rounded-full px-2.5 py-0.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" /> Cuadra Segura
          </span>
        </div>

        {/* Lista descriptiva y humana */}
        <div className="space-y-2 text-xs">
          <div className={`flex items-center gap-2.5 p-2 rounded-2xl border ${
            isEmergency
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
              : 'bg-emerald-50/70 border-emerald-200/80 text-slate-900'
          }`}>
            <Users className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-bold">
              <strong className={`font-black ${isEmergency ? 'text-emerald-100' : 'text-emerald-950'}`}>18 vecinos activos</strong> en tu radio de 500m
            </span>
          </div>

          <div className={`flex items-center gap-2.5 p-2 rounded-2xl border ${
            isEmergency
              ? 'bg-indigo-950/40 border-indigo-800 text-indigo-200'
              : 'bg-indigo-50/70 border-indigo-200/80 text-slate-900'
          }`}>
            <HeartHandshake className="h-4 w-4 text-indigo-500 shrink-0" />
            <span className="font-bold">
              <strong className={`font-black ${isEmergency ? 'text-indigo-100' : 'text-indigo-950'}`}>{activeBartersCount} trueques disponibles</strong> (¡sin dinero!)
            </span>
          </div>
        </div>

        {activeAlertsCount > 0 && (
          <div className="rounded-2xl bg-red-100/90 border-2 border-red-300 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertOctagon className="h-4 w-4 text-red-700 animate-pulse" />
              <span className="text-xs font-black text-red-950">
                {activeAlertsCount} aviso{activeAlertsCount > 1 ? 's' : ''} de urgencia en la zona
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('emergency')}
              className="text-xs font-black text-red-800 hover:text-red-950 underline"
            >
              Ver ahora
            </button>
          </div>
        )}
      </div>

      {/* 3. Botón Gigante y Amigable para Publicar (Fácil de entender) */}
      <button
        type="button"
        onClick={() => openPublishModal()}
        className={`w-full rounded-3xl p-4 text-left transition pressable shadow-sm border-2 ${
          isEmergency
            ? 'bg-red-600 hover:bg-red-700 border-red-500 text-white'
            : 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500 text-white'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlusCircle className="h-7 w-7 text-white stroke-[2.2] shrink-0" />
            <div>
              <p className="text-sm font-black leading-tight text-white">
                Publicar algo en el barrio
              </p>
              <p className={`text-xs font-semibold mt-0.5 ${isEmergency ? 'text-red-100' : 'text-emerald-100'}`}>
                Ofrece comida, presta una herramienta o pide ayuda
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-white shrink-0 ml-2" />
        </div>
      </button>

      {/* 4. Teléfonos de Emergencia Yanahuara de Alto Contraste */}
      <div
        className={`rounded-2xl p-4 border-2 text-xs space-y-2.5 ${
          isEmergency
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-slate-100/90 border-slate-300 text-slate-950'
        }`}
      >
        <p className={`font-black flex items-center gap-2 ${isEmergency ? 'text-white' : 'text-slate-950'}`}>
          <PhoneCall className="h-4 w-4 text-emerald-700" />
          Teléfonos de Auxilio Rápido (Yanahuara)
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-1.5 rounded-xl bg-white border border-slate-200">
            <span className="block text-[10px] font-bold text-slate-500 uppercase">Serenazgo:</span>
            <span className="font-black text-slate-950 text-sm">(054) 270000</span>
          </div>
          <div className="p-1.5 rounded-xl bg-white border border-slate-200">
            <span className="block text-[10px] font-bold text-slate-500 uppercase">Ambulancia:</span>
            <span className="font-black text-slate-950 text-sm">SAMU 106</span>
          </div>
          <div className="p-1.5 rounded-xl bg-white border border-slate-200">
            <span className="block text-[10px] font-bold text-slate-500 uppercase">Bomberos:</span>
            <span className="font-black text-slate-950 text-sm">116</span>
          </div>
          <div className="p-1.5 rounded-xl bg-white border border-slate-200">
            <span className="block text-[10px] font-bold text-slate-500 uppercase">Comisaría:</span>
            <span className="font-black text-slate-950 text-sm">105</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
