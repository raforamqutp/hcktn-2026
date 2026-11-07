import {
  Footprints,
  Lock,
  MessageSquare,
  PackageCheck,
  ShieldAlert,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EdanCategory } from '../../types';

const EMERGENCY_FILTERS: { id: 'all' | EdanCategory; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'salud_vida', label: 'Salud / Insulina' },
  { id: 'inundacion_lluvia', label: 'Lluvias / Baldes' },
  { id: 'agua_alimento', label: 'Agua y carga' },
];

export const EmergencyView: React.FC = () => {
  const { emergencyItems, joinEmergencyResponse, currentUser, mode } = useApp();
  const [section, setSection] = useState<'alerts' | 'resources'>('alerts');
  const [category, setCategory] = useState<'all' | EdanCategory>('all');
  const isEmergency = mode === 'emergency';

  const filtered = emergencyItems.filter(
    (item) => category === 'all' || item.edanCategory === category
  );

  const humanitarianAlerts = filtered.filter(
    (i) => i.type === 'vecino_vulnerable' || i.type === 'alerta_peligro'
  );
  const sharedResources = filtered.filter(
    (i) => i.type === 'recurso_compartido' || i.type === 'brigada_vecinal'
  );

  const buildSmsHref = (title: string, lat: number, lng: number) => {
    const body = encodeURIComponent(
      `[Urgencia VecinOS] ${title} - Ubicación: https://maps.google.com/?q=${lat},${lng}`
    );
    return `sms:?body=${body}`;
  };

  return (
    <section aria-label="Emergencias del barrio" className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2
              className={`text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5 ${
                isEmergency ? 'text-white' : 'text-slate-950'
              }`}
            >
              <ShieldAlert className="h-7 w-7 text-red-600" />
              S.O.S. y Emergencias Barriales
            </h2>
            <p
              className={`text-xs md:text-sm font-semibold mt-0.5 ${
                isEmergency ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Protocolo comunitario de respuesta rápida, vecinos vulnerables y puntos de apoyo
            </p>
          </div>
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
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCategory(f.id)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition active:scale-95 ${
                    active
                      ? 'bg-red-600 text-white shadow-xs'
                      : isEmergency
                      ? 'bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800'
                      : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grilla de Tarjetas */}
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
                      <span className="rounded-full bg-red-600 px-3 py-0.5 text-[11px] font-black uppercase text-white tracking-wider">
                        {item.urgency === 'critica' ? 'Urgente' : 'Prioritario'}
                      </span>
                      <span className="tabular inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                        <Footprints className="h-4 w-4 text-red-600" aria-hidden="true" />A{' '}
                        {item.location.walkingMinutes} min ({item.location.distanceMeters}m)
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">{item.createdAt}</span>
                  </div>

                  <h3 className="heading-tight mt-2.5 text-[18px] font-black leading-snug text-slate-950 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
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
                      {item.isSensitiveProtected && !isJoined && (
                        <Lock className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
                      )}
                      <span>
                        {item.isSensitiveProtected && !isJoined
                          ? 'Ubicación aproximada por privacidad · Confirma tu apoyo para ver la casa exacta'
                          : item.location.reference}
                      </span>
                    </p>
                    <p className="mt-1.5 flex items-center gap-1.5 font-black text-emerald-800 dark:text-emerald-400">
                      <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>
                        {item.responders.length} vecinos acudiendo ({item.responders.join(', ')})
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => joinEmergencyResponse(item.id)}
                    className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-1.5 rounded-2xl bg-red-600 hover:bg-red-700 px-4 py-2 text-xs font-black text-white transition active:scale-95 shadow-xs"
                  >
                    <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                    <span>{isJoined ? 'Apoyo confirmado' : 'Voy a ayudar'}</span>
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
          {sharedResources.map((item) => (
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
                  <span className="tabular inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                    <Footprints className="h-4 w-4 text-teal-700" aria-hidden="true" />A{' '}
                    {item.location.walkingMinutes} min ({item.location.distanceMeters}m)
                  </span>
                </div>

                <h3 className="heading-tight mt-2.5 text-[18px] font-black leading-snug text-slate-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
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

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {item.responders.length} voluntarios en el punto
                </span>
                <button
                  type="button"
                  onClick={() => joinEmergencyResponse(item.id)}
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-2xl bg-teal-700 hover:bg-teal-800 px-4 py-2 text-xs font-black text-white transition active:scale-95 shadow-xs"
                >
                  <PackageCheck className="h-4 w-4" aria-hidden="true" />
                  <span>Sumarme al punto ({item.responders.length})</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
