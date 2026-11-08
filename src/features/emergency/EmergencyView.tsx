import {
  ChevronDown,
  ChevronUp,
  Droplets,
  Flame,
  Footprints,
  HeartPulse,
  Lock,
  MessageSquare,
  PackageCheck,
  PhoneCall,
  Plus,
  Shield,
  ShieldAlert,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EdanCategory } from '../../types';

interface FilterDef {
  id: 'all' | EdanCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const EMERGENCY_FILTERS: FilterDef[] = [
  { id: 'all', label: 'Todos los reportes', icon: Shield },
  { id: 'salud_vida', label: 'Salud y Vulnerables', icon: HeartPulse },
  { id: 'inundacion_lluvia', label: 'Lluvias / Fenómeno El Niño', icon: Droplets },
  { id: 'infraestructura_energia', label: 'Sismo / Infraestructura', icon: Zap },
  { id: 'agua_alimento', label: 'Agua potable y Carga', icon: Sparkles },
];

const EMERGENCY_HOTLINES = [
  { name: 'Bomberos CGBVP', number: '116', icon: Flame, color: 'text-red-500' },
  { name: 'SAMU Urgencias', number: '106', icon: HeartPulse, color: 'text-rose-500' },
  { name: 'Serenazgo Yanahuara', number: '054270000', display: '(054) 270000', icon: Shield, color: 'text-emerald-500' },
  { name: 'Policía Nacional', number: '105', icon: PhoneCall, color: 'text-blue-500' },
];

export const EmergencyView: React.FC = () => {
  const { emergencyItems, joinEmergencyResponse, currentUser, mode, openPublishModal, activeTab } = useApp();
  const [section, setSection] = useState<'alerts' | 'resources'>('alerts');
  const [category, setCategory] = useState<'all' | EdanCategory>('all');
  const [showHotlines, setShowHotlines] = useState(false);
  const [joinedNotice, setJoinedNotice] = useState<string | null>(null);

  const isEmergency = mode === 'emergency' || activeTab === 'emergency';

  const filtered = useMemo(() => {
    return emergencyItems.filter(
      (item) => category === 'all' || item.edanCategory === category
    );
  }, [emergencyItems, category]);

  const humanitarianAlerts = useMemo(() => {
    return filtered.filter(
      (i) => i.type === 'vecino_vulnerable' || i.type === 'alerta_peligro'
    );
  }, [filtered]);

  const sharedResources = useMemo(() => {
    return filtered.filter(
      (i) => i.type === 'recurso_compartido' || i.type === 'brigada_vecinal'
    );
  }, [filtered]);

  const buildSmsHref = (title: string, lat: number, lng: number) => {
    const body = encodeURIComponent(
      `[S.O.S. VecinOS] ${title} - Ubicación: https://maps.google.com/?q=${lat},${lng}`
    );
    return `sms:?body=${body}`;
  };

  const handleJoin = (itemId: string, title: string) => {
    joinEmergencyResponse(itemId);
    setJoinedNotice(`¡Apoyo confirmado para: "${title}"!`);
    setTimeout(() => {
      setJoinedNotice(null);
    }, 4000);
  };

  return (
    <section aria-label="Emergencias del barrio" className="space-y-4">
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2
              className={`text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5 ${
                isEmergency ? 'text-white' : 'text-slate-950'
              }`}
            >
              <ShieldAlert className="h-7 w-7 text-red-600 shrink-0" />
              <span>S.O.S. y Emergencias Barriales</span>
            </h2>
            <p
              className={`text-xs md:text-sm font-semibold mt-0.5 ${
                isEmergency ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Protocolo comunitario de respuesta rápida ante sismo, inundaciones y apoyo a vulnerables
            </p>
          </div>

          <button
            type="button"
            onClick={() => openPublishModal('emergency')}
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 px-5 py-2.5 text-xs font-black text-white shadow-lg transition active:scale-95 shrink-0"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>+ Reportar Alerta S.O.S.</span>
          </button>
        </div>

        {joinedNotice && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/40 p-3 text-xs font-bold text-emerald-950 animate-scale-in">
            <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{joinedNotice}</span>
          </div>
        )}

        <div
          className={`overflow-hidden rounded-2xl border-2 transition-all ${
            isEmergency
              ? 'bg-[#10141f] border-slate-800 text-slate-200'
              : 'bg-white border-slate-200 text-slate-900 shadow-2xs'
          }`}
        >
          <button
            type="button"
            onClick={() => setShowHotlines(!showHotlines)}
            className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-black transition hover:opacity-90"
          >
            <span className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-red-500" />
              <span>Teléfonos de Auxilio Rápido (Llamada Directa)</span>
            </span>
            {showHotlines ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {showHotlines && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 pt-0 border-t border-slate-200/40">
              {EMERGENCY_HOTLINES.map((h) => {
                const IconComponent = h.icon;
                return (
                  <a
                    key={h.number}
                    href={`tel:${h.number}`}
                    className={`flex items-center gap-2.5 rounded-xl p-2.5 border transition active:scale-95 ${
                      isEmergency
                        ? 'bg-slate-900/90 border-slate-700 hover:bg-slate-800 text-white'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-900'
                    }`}
                  >
                    <IconComponent className={`h-4 w-4 shrink-0 ${h.color}`} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase truncate">
                        {h.name}
                      </p>
                      <p className="text-xs font-black truncate">{h.display || h.number}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
          <div
            className={`grid grid-cols-2 rounded-2xl p-1 max-w-sm border-2 ${
              isEmergency ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-300'
            }`}
          >
            <button
              type="button"
              onClick={() => setSection('alerts')}
              className={`rounded-xl py-2 text-xs font-black transition active:scale-95 ${
                section === 'alerts'
                  ? 'bg-red-600 text-white shadow-xs'
                  : isEmergency
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-800 hover:text-slate-950'
              }`}
            >
              Urgencias ({humanitarianAlerts.length})
            </button>
            <button
              type="button"
              onClick={() => setSection('resources')}
              className={`rounded-xl py-2 text-xs font-black transition active:scale-95 ${
                section === 'resources'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : isEmergency
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-800 hover:text-slate-950'
              }`}
            >
              Puntos de apoyo ({sharedResources.length})
            </button>
          </div>

          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {EMERGENCY_FILTERS.map((f) => {
              const active = category === f.id;
              const IconComp = f.icon;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCategory(f.id)}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition active:scale-95 ${
                    active
                      ? 'bg-red-600 text-white shadow-xs'
                      : isEmergency
                      ? 'bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800'
                      : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <IconComp className="h-3.5 w-3.5" />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {section === 'alerts' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {humanitarianAlerts.map((item) => {
            const isJoined = item.responders.includes(currentUser.fullName);
            return (
              <article
                key={item.id}
                className={`rounded-3xl border-2 p-5 transition-all flex flex-col justify-between ${
                  isEmergency
                    ? 'bg-[#141118] border-red-500/40 text-slate-100 shadow-md shadow-red-950/20'
                    : 'bg-white border-red-300 text-slate-950 shadow-xs hover:border-red-400 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-0.5 text-[11px] font-black uppercase text-white tracking-wider ${
                          item.urgency === 'critica'
                            ? 'bg-red-600 animate-pulse'
                            : item.urgency === 'alta'
                            ? 'bg-amber-600'
                            : 'bg-blue-600'
                        }`}
                      >
                        {item.urgency === 'critica'
                          ? 'Urgente'
                          : item.urgency === 'alta'
                          ? 'Prioritario'
                          : 'Moderado'}
                      </span>
                      <span
                        className={`tabular inline-flex items-center gap-1 font-bold ${
                          isEmergency ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        <Footprints className="h-4 w-4 text-red-600" aria-hidden="true" />A{' '}
                        {item.location.walkingMinutes} min ({item.location.distanceMeters}m)
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">{item.createdAt}</span>
                  </div>

                  <h3
                    className={`heading-tight mt-2.5 text-[18px] font-black leading-snug ${
                      isEmergency ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`mt-0.5 text-xs font-semibold ${
                      isEmergency ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {item.authorName}
                  </p>

                  <p
                    className={`readable-prose mt-2.5 text-xs font-normal leading-relaxed ${
                      isEmergency ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    {item.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.resourceTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-3 py-0.5 text-[11px] font-black bg-red-100 text-red-950 border border-red-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div
                    className={`mt-3.5 rounded-2xl p-3 text-xs border-2 ${
                      isEmergency
                        ? 'bg-slate-900/90 text-slate-200 border-slate-700'
                        : 'bg-slate-50 text-slate-900 border-slate-200'
                    }`}
                  >
                    <p className="flex items-center gap-1.5 font-bold">
                      {item.isSensitiveProtected && !isJoined ? (
                        <Lock className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
                      ) : (
                        <Shield className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                      )}
                      <span>
                        {item.isSensitiveProtected && !isJoined
                          ? 'Ubicación aproximada por privacidad (Radio ~150m) · Confirma tu apoyo para ver la casa exacta'
                          : item.location.reference}
                      </span>
                    </p>
                    <p
                      className={`mt-1.5 flex items-center gap-1.5 font-black ${
                        isEmergency ? 'text-emerald-400' : 'text-emerald-800'
                      }`}
                    >
                      <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>
                        {item.responders.length} vecinos acudiendo ({item.responders.join(', ')})
                      </span>
                    </p>
                  </div>
                </div>

                <div
                  className={`mt-4 pt-3 border-t flex items-center gap-2 ${
                    isEmergency ? 'border-slate-800' : 'border-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleJoin(item.id, item.title)}
                    className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-1.5 rounded-2xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-black text-white transition active:scale-95 shadow-xs"
                  >
                    <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                    <span>{isJoined ? '🛡 Apoyo confirmado' : 'Voy a ayudar'}</span>
                  </button>

                  <a
                    href={buildSmsHref(item.title, item.location.lat, item.location.lng)}
                    title="Enviar alerta SMS sin internet"
                    className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition active:scale-95"
                  >
                    <MessageSquare className="h-4 w-4 text-amber-600" aria-hidden="true" />
                    <span>SMS</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sharedResources.map((item) => {
            const isJoined = item.responders.includes(currentUser.fullName);
            return (
              <article
                key={item.id}
                className={`rounded-3xl border-2 p-5 transition-all flex flex-col justify-between ${
                  isEmergency
                    ? 'bg-[#101920] border-teal-500/40 text-slate-100 shadow-md shadow-teal-950/20'
                    : 'bg-white border-teal-300 text-slate-950 shadow-xs hover:border-teal-400 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="rounded-full bg-teal-700 px-3 py-0.5 text-[11px] font-black text-white">
                      Punto de Apoyo Activo
                    </span>
                    <span
                      className={`tabular inline-flex items-center gap-1 font-bold ${
                        isEmergency ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      <Footprints className="h-4 w-4 text-teal-700" aria-hidden="true" />A{' '}
                      {item.location.walkingMinutes} min ({item.location.distanceMeters}m)
                    </span>
                  </div>

                  <h3
                    className={`heading-tight mt-2.5 text-[18px] font-black leading-snug ${
                      isEmergency ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`mt-0.5 text-xs font-semibold ${
                      isEmergency ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {item.authorName} · {item.location.reference}
                  </p>

                  <p
                    className={`readable-prose mt-2.5 text-xs font-normal leading-relaxed ${
                      isEmergency ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    {item.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.resourceTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-3 py-0.5 text-[11px] font-black bg-teal-100 text-teal-950 border border-teal-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 ${
                    isEmergency ? 'border-slate-800' : 'border-slate-200'
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${
                      isEmergency ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {item.responders.length} voluntarios en el punto
                  </span>
                  <button
                    type="button"
                    onClick={() => handleJoin(item.id, item.title)}
                    className="inline-flex min-h-[42px] items-center gap-1.5 rounded-2xl bg-teal-700 hover:bg-teal-800 px-4 py-2 text-xs font-black text-white transition active:scale-95 shadow-xs"
                  >
                    <PackageCheck className="h-4 w-4" aria-hidden="true" />
                    <span>{isJoined ? 'Voluntario activo' : 'Sumarme al punto'}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
