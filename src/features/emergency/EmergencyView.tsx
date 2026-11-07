import {
  AlertOctagon,
  Clock,
  HeartPulse,
  Lock,
  MessageSquareWarning,
  PackageCheck,
  ShieldAlert,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EdanCategory } from '../../types';

const EDAN_FILTERS: { id: 'all' | EdanCategory; label: string }[] = [
  { id: 'all', label: 'Todos los Reportes' },
  { id: 'salud_vida', label: 'Salud / Vulnerables (Insulina)' },
  { id: 'inundacion_lluvia', label: 'Lluvias El Niño (Baldes / Sacos)' },
  { id: 'agua_alimento', label: 'Agua Potable y Recursos' },
  { id: 'infraestructura_energia', label: 'Sismo / Energía' },
];

export const EmergencyView: React.FC = () => {
  const { emergencyItems, joinEmergencyResponse, openPublishModal, currentUser } = useApp();
  const [edanFilter, setEdanFilter] = useState<'all' | EdanCategory>('all');

  const filtered = emergencyItems.filter(
    (item) => edanFilter === 'all' || item.edanCategory === edanFilter
  );

  const humanitarianAlerts = filtered.filter(
    (i) => i.type === 'vecino_vulnerable' || i.type === 'alerta_peligro'
  );
  const sharedResources = filtered.filter(
    (i) => i.type === 'recurso_compartido' || i.type === 'brigada_vecinal'
  );

  const buildSmsHref = (title: string, lat: number, lng: number) => {
    const body = encodeURIComponent(
      `[SOS VecinOS] ${title} - Ubicacion GPS: https://maps.google.com/?q=${lat},${lng}`
    );
    return `sms:?body=${body}`;
  };

  return (
    <section aria-labelledby="emergency-heading" className="space-y-5">
      <div className="dark-surface rounded-2xl border border-red-500/40 bg-slate-950 p-4 text-slate-100 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-bold text-red-300 border border-red-500/30">
              <AlertOctagon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Protocolo Comunitario Compatible con EDAN / SINAGERD</span>
            </div>
            <h2 id="emergency-heading" className="text-xl font-extrabold text-white">
              Central de Ayuda Humanitaria y Economía Solidaria de Crisis
            </h2>
            <p className="text-xs text-slate-300">
              Funciona Online, Offline y vía SMS celular 2G para que ningún vecino quede
              desamparado.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openPublishModal('emergency')}
              className="min-h-[48px] rounded-xl bg-red-600 px-4 py-2 text-xs font-extrabold text-white shadow hover:bg-red-500"
            >
              + Reportar Emergencia / Recurso
            </button>
          </div>
        </div>

        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {EDAN_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setEdanFilter(f.id)}
              className={`min-h-[36px] rounded-xl px-3 py-1 text-xs font-semibold transition ${
                edanFilter === f.id
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="flex items-center gap-2 text-base font-extrabold text-red-700">
          <HeartPulse className="h-5 w-5" aria-hidden="true" />
          <span>1. Tablero de Ayuda Humanitaria (Vecinos en Vulnerabilidad y Alertas)</span>
        </h3>

        {humanitarianAlerts.map((item) => {
          const isJoined = item.responders.includes(currentUser.fullName);
          return (
            <article
              key={item.id}
              className="rounded-2xl border-2 border-red-500/40 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-lg bg-red-600 px-2 py-0.5 text-[11px] font-extrabold uppercase text-white">
                      Urgencia {item.urgency}
                    </span>
                    <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-800">
                      A {item.location.walkingMinutes} min caminando ({item.location.distanceMeters}
                      m)
                    </span>
                    {item.isSensitiveProtected && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                        <Lock className="h-3 w-3" aria-hidden="true" />
                        Radio protegido ~150m (Ley 29733) · Caduca en {item.expiresInHours}h
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">{item.title}</h4>
                  <p className="text-xs font-medium text-slate-500">
                    Reportado por {item.authorName} · {item.createdAt}
                  </p>
                </div>
              </div>

              <p className="mt-2 text-sm text-slate-700">{item.description}</p>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {item.resourceTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-800 border border-red-200"
                  >
                    Necesita: {tag}
                  </span>
                ))}
              </div>

              <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-700">
                <p>
                  <strong>Ubicación:</strong>{' '}
                  {item.isSensitiveProtected && !isJoined
                    ? 'Protegida por privacidad de datos sensibles. Presiona "Voy a apoyar" para ver dirección exacta.'
                    : item.location.reference}
                </p>
                <p className="mt-1">
                  <Users className="mr-1 inline h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  <strong>Vecinos acudiendo ({item.responders.length}):</strong>{' '}
                  {item.responders.join(', ')}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => joinEmergencyResponse(item.id)}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
                >
                  <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {isJoined ? 'Ya estás anotado en apoyo' : 'Voy a apoyar (Unirme a brigada)'}
                  </span>
                </button>

                <a
                  href={buildSmsHref(item.title, item.location.lat, item.location.lng)}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800"
                >
                  <MessageSquareWarning className="h-4 w-4 text-amber-400" aria-hidden="true" />
                  <span>Enviar S.O.S. por SMS (Sin Internet)</span>
                </a>
              </div>
            </article>
          );
        })}
      </div>

      <div className="space-y-3 pt-2">
        <h3 className="flex items-center gap-2 text-base font-extrabold text-teal-800">
          <PackageCheck className="h-5 w-5" aria-hidden="true" />
          <span>2. Economía Solidaria de Emergencia (Recursos Críticos Compartidos)</span>
        </h3>

        {sharedResources.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-teal-500/40 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-lg bg-teal-700 px-2 py-0.5 text-[11px] font-bold text-white">
                    Recurso Solidario Activo
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                    A {item.location.walkingMinutes} min a pie ({item.location.distanceMeters}m)
                  </span>
                </div>
                <h4 className="mt-1 text-base font-extrabold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-500">
                  Coordinado por {item.authorName} · {item.location.reference}
                </p>
              </div>
            </div>

            <p className="mt-2 text-sm text-slate-700">{item.description}</p>

            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {item.resourceTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-900 border border-teal-200"
                >
                  Disponible: {tag}
                </span>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
              <span className="inline-flex items-center gap-1 text-slate-600">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                Voluntarios en el punto: {item.responders.join(', ')}
              </span>
              <button
                type="button"
                onClick={() => joinEmergencyResponse(item.id)}
                className="min-h-[42px] rounded-xl bg-teal-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-teal-800"
              >
                Sumarme como Voluntario ({item.responders.length})
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
