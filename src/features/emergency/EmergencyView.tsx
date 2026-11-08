import {
  AlertTriangle,
  Droplets,
  Footprints,
  HeartPulse,
  Lock,
  MessageSquare,
  PackageCheck,
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
  { id: 'salud_vida', label: 'Salud y Adultos Mayores', icon: HeartPulse },
  { id: 'inundacion_lluvia', label: 'Lluvias e Inundaciones', icon: Droplets },
  { id: 'infraestructura_energia', label: 'Sismo / Estructura', icon: Zap },
  { id: 'agua_alimento', label: 'Agua potable y Víveres', icon: Sparkles },
];

export const EmergencyView: React.FC = () => {
  const { emergencyItems, joinEmergencyResponse, currentUser, mode, openPublishModal, activeTab } = useApp();
  const [section, setSection] = useState<'alerts' | 'resources'>('alerts');
  const [category, setCategory] = useState<'all' | EdanCategory>('all');
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
    <section aria-label="Emergencias y S.O.S. del barrio" className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isEmergency ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800'
              }`}
            >
              <AlertTriangle className="h-3 w-3" />
              Protocolo S.O.S.
            </span>
            <span
              className={`text-xs font-mono font-medium ${
                isEmergency ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {humanitarianAlerts.length} activos
            </span>
          </div>
          <h2
            className={`text-2xl md:text-3xl font-black tracking-tight mt-1 ${
              isEmergency ? 'text-white' : 'text-slate-950'
            }`}
          >
            S.O.S. y Respuestas Barriales
          </h2>
          <p
            className={`text-xs md:text-sm mt-0.5 ${
              isEmergency ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Red comunitaria directa para socorrer emergencias sin depender de central telefónica
          </p>
        </div>

        <button
          type="button"
          onClick={() => openPublishModal('emergency')}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2.5 text-xs font-black text-white shadow-sm transition active:scale-95 shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Reportar Alerta S.O.S.</span>
        </button>
      </div>

      {/* Confirmation notification banner */}
      {joinedNotice && (
        <div className="flex items-center gap-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3 text-xs font-bold text-emerald-950 animate-scale-in">
          <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{joinedNotice}</span>
        </div>
      )}

      {/* Segment tabs + category chip filters */}
      <div id="emergencia-feed" className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 scroll-mt-20">
        <div
          className={`inline-flex rounded-xl p-1 border ${
            isEmergency ? 'bg-slate-900 border-slate-800' : 'bg-slate-100/80 border-slate-200/80'
          }`}
        >
          <button
            type="button"
            onClick={() => setSection('alerts')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition active:scale-95 ${
              section === 'alerts'
                ? 'bg-red-600 text-white shadow-xs'
                : isEmergency
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            Urgencias ({humanitarianAlerts.length})
          </button>
          <button
            type="button"
            onClick={() => setSection('resources')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition active:scale-95 ${
              section === 'resources'
                ? 'bg-teal-600 text-white shadow-xs'
                : isEmergency
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-700 hover:text-slate-950'
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
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition active:scale-95 ${
                  active
                    ? 'bg-red-600 text-white shadow-xs'
                    : isEmergency
                    ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <IconComp className="h-3 w-3" />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards Feed */}
      {section === 'alerts' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {humanitarianAlerts.map((item) => {
            const isJoined = item.responders.includes(currentUser.fullName);
            return (
              <article
                key={item.id}
                className={`rounded-2xl border p-4 sm:p-5 transition-all flex flex-col justify-between ${
                  isEmergency
                    ? 'bg-[#121622] border-red-500/30 text-slate-100 shadow-sm'
                    : 'bg-white border-slate-200/90 text-slate-950 shadow-xs hover:border-red-300 hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Top metadata row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white ${
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
                        className={`tabular inline-flex items-center gap-1 text-[11px] font-mono font-medium ${
                          isEmergency ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        <Footprints className="h-3.5 w-3.5 text-red-600" aria-hidden="true" />
                        {item.location.walkingMinutes} min ({item.location.distanceMeters}m)
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{item.createdAt}</span>
                  </div>

                  {/* Title & Author */}
                  <h3
                    className={`mt-2.5 text-base sm:text-lg font-bold tracking-tight leading-snug ${
                      isEmergency ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-xs mt-0.5 ${
                      isEmergency ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    Reportado por <span className="font-semibold">{item.authorName}</span>
                  </p>

                  {/* Description */}
                  <p
                    className={`mt-2 text-xs sm:text-sm leading-relaxed ${
                      isEmergency ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    {item.description}
                  </p>

                  {/* Tags */}
                  {item.resourceTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.resourceTags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                            isEmergency
                              ? 'bg-slate-800 text-slate-300 border border-slate-700'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Location notice & active responders */}
                  <div
                    className={`mt-3.5 rounded-xl p-3 text-xs border ${
                      isEmergency
                        ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                        : 'bg-slate-50/90 border-slate-200/80 text-slate-800'
                    }`}
                  >
                    <p className="flex items-center gap-1.5 font-medium">
                      {item.isSensitiveProtected && !isJoined ? (
                        <Lock className="h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
                      ) : (
                        <Shield className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                      )}
                      <span>
                        {item.isSensitiveProtected && !isJoined
                          ? 'Ubicación aproximada por privacidad (~150m) · Confirma tu apoyo para ver la casa exacta'
                          : item.location.reference}
                      </span>
                    </p>
                    <p
                      className={`mt-1.5 flex items-center gap-1.5 font-bold text-[11px] ${
                        isEmergency ? 'text-emerald-400' : 'text-emerald-700'
                      }`}
                    >
                      <Users className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>
                        {item.responders.length} vecinos acudiendo ({item.responders.join(', ')})
                      </span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div
                  className={`mt-4 pt-3 border-t flex items-center gap-2 ${
                    isEmergency ? 'border-slate-800' : 'border-slate-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleJoin(item.id, item.title)}
                    className={`inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition active:scale-95 ${
                      isJoined
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                    }`}
                  >
                    <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                    <span>{isJoined ? '🛡 Apoyo confirmado' : 'Voy a ayudar'}</span>
                  </button>

                  <a
                    href={buildSmsHref(item.title, item.location.lat, item.location.lng)}
                    title="Enviar alerta SMS sin internet"
                    className={`inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold border transition active:scale-95 ${
                      isEmergency
                        ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
                    <span>SMS</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {sharedResources.map((item) => {
            const isJoined = item.responders.includes(currentUser.fullName);
            return (
              <article
                key={item.id}
                className={`rounded-2xl border p-4 sm:p-5 transition-all flex flex-col justify-between ${
                  isEmergency
                    ? 'bg-[#121922] border-teal-500/30 text-slate-100 shadow-sm'
                    : 'bg-white border-slate-200/90 text-slate-950 shadow-xs hover:border-teal-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-teal-700 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                      Punto Comunitario
                    </span>
                    <span
                      className={`tabular inline-flex items-center gap-1 text-[11px] font-mono font-medium ${
                        isEmergency ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      <Footprints className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
                      {item.location.walkingMinutes} min ({item.location.distanceMeters}m)
                    </span>
                  </div>

                  <h3
                    className={`mt-2.5 text-base sm:text-lg font-bold tracking-tight leading-snug ${
                      isEmergency ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-xs mt-0.5 ${
                      isEmergency ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    Coordinado por <span className="font-semibold">{item.authorName}</span> · {item.location.reference}
                  </p>

                  <p
                    className={`mt-2 text-xs sm:text-sm leading-relaxed ${
                      isEmergency ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    {item.description}
                  </p>

                  {item.resourceTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.resourceTags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                            isEmergency
                              ? 'bg-teal-900/40 text-teal-300 border border-teal-700/50'
                              : 'bg-teal-50 text-teal-800 border border-teal-200'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 ${
                    isEmergency ? 'border-slate-800' : 'border-slate-100'
                  }`}
                >
                  <span
                    className={`text-xs font-mono ${
                      isEmergency ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {item.responders.length} voluntarios
                  </span>
                  <button
                    type="button"
                    onClick={() => handleJoin(item.id, item.title)}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 px-4 py-2 text-xs font-bold text-white transition active:scale-95 shadow-xs"
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
