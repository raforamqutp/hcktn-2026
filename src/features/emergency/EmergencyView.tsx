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
    <section aria-label="Emergencias del barrio" className="space-y-3.5">
      <div className="space-y-2.5">
        <div
          className={`grid grid-cols-2 rounded-2xl p-1 ${
            isEmergency ? 'bg-slate-900 border border-slate-800' : 'bg-slate-200/75'
          }`}
        >
          <button
            type="button"
            onClick={() => setSection('alerts')}
            className={`rounded-xl py-2 text-xs font-semibold transition ${
              section === 'alerts'
                ? 'bg-red-600 text-white shadow-xs'
                : isEmergency
                ? 'text-slate-400'
                : 'text-slate-600'
            }`}
          >
            Urgencias ({humanitarianAlerts.length})
          </button>
          <button
            type="button"
            onClick={() => setSection('resources')}
            className={`rounded-xl py-2 text-xs font-semibold transition ${
              section === 'resources'
                ? 'bg-teal-600 text-white shadow-xs'
                : isEmergency
                ? 'text-slate-400'
                : 'text-slate-600'
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
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-red-600 text-white'
                    : isEmergency
                    ? 'bg-slate-900 text-slate-300 border border-slate-800'
                    : 'bg-white text-slate-600 border border-slate-200/70'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {section === 'alerts' ? (
        <div className="space-y-3">
          {humanitarianAlerts.map((item) => {
            const isJoined = item.responders.includes(currentUser.fullName);
            return (
              <article
                key={item.id}
                className={`rounded-3xl border p-4 transition ${
                  isEmergency
                    ? 'bg-[#141118] border-red-500/35 text-slate-100'
                    : 'bg-white border-red-200 text-slate-900 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-[11px] font-bold uppercase text-white">
                      {item.urgency === 'critica' ? 'Urgente' : 'Prioritario'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Footprints className="h-3.5 w-3.5" aria-hidden="true" />A{' '}
                      {item.location.walkingMinutes} min ({item.location.distanceMeters}m)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">{item.createdAt}</span>
                </div>

                <h3 className="mt-2 text-[16px] font-bold leading-snug">{item.title}</h3>
                <p className="mt-0.5 text-xs text-slate-400">{item.authorName}</p>

                <p
                  className={`mt-2 text-[13px] leading-relaxed ${
                    isEmergency ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {item.description}
                </p>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {item.resourceTags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        isEmergency
                          ? 'bg-red-950/70 text-red-200 border border-red-800/50'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div
                  className={`mt-3 rounded-2xl p-2.5 text-xs ${
                    isEmergency ? 'bg-slate-900/90 text-slate-300' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  <p className="flex items-center gap-1.5">
                    {item.isSensitiveProtected && !isJoined && (
                      <Lock className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden="true" />
                    )}
                    <span>
                      {item.isSensitiveProtected && !isJoined
                        ? 'Ubicación aproximada por privacidad · Confirma tu apoyo para ver la casa exacta'
                        : item.location.reference}
                    </span>
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <Users className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>
                      {item.responders.length} vecinos ayudando ({item.responders.join(', ')})
                    </span>
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => joinEmergencyResponse(item.id)}
                    className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-1.5 rounded-2xl bg-red-600 px-3.5 py-2 text-xs font-semibold text-white transition active:scale-98"
                  >
                    <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                    <span>{isJoined ? 'Apoyo confirmado' : 'Voy a ayudar'}</span>
                  </button>

                  <a
                    href={buildSmsHref(item.title, item.location.lat, item.location.lng)}
                    className={`inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-semibold transition active:scale-98 ${
                      isEmergency
                        ? 'bg-slate-800 text-slate-200 border border-slate-700'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                    <span>SMS</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {sharedResources.map((item) => (
            <article
              key={item.id}
              className={`rounded-3xl border p-4 transition ${
                isEmergency
                  ? 'bg-[#101920] border-teal-500/35 text-slate-100'
                  : 'bg-white border-teal-200 text-slate-900 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="rounded-full bg-teal-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                  Punto activo
                </span>
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <Footprints className="h-3.5 w-3.5" aria-hidden="true" />A{' '}
                  {item.location.walkingMinutes} min ({item.location.distanceMeters}m)
                </span>
              </div>

              <h3 className="mt-2 text-[16px] font-bold leading-snug">{item.title}</h3>
              <p className="mt-0.5 text-xs text-slate-400">
                {item.authorName} · {item.location.reference}
              </p>

              <p
                className={`mt-2 text-[13px] leading-relaxed ${
                  isEmergency ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {item.description}
              </p>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {item.resourceTags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      isEmergency
                        ? 'bg-teal-950 text-teal-200 border border-teal-800'
                        : 'bg-teal-50 text-teal-800'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 pt-1">
                <span className="text-xs text-slate-400">
                  {item.responders.length} voluntarios en el punto
                </span>
                <button
                  type="button"
                  onClick={() => joinEmergencyResponse(item.id)}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-2xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition active:scale-95"
                >
                  <PackageCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Sumarme ({item.responders.length})</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
