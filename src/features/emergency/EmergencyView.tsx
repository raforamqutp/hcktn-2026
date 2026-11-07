import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Footprints,
  Lock,
  MapPin,
  MessageSquare,
  PackageCheck,
  Plus,
  ShieldAlert,
  Users,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EdanCategory, EmergencyItem } from '../../types';

type EmergencyFilter = 'all' | EdanCategory;
type EmergencySection = 'alerts' | 'resources';

const EMERGENCY_FILTERS: { id: EmergencyFilter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'salud_vida', label: 'Salud y vulnerables' },
  { id: 'inundacion_lluvia', label: 'Lluvias / El Niño' },
  { id: 'infraestructura_energia', label: 'Sismo / infraestructura' },
  { id: 'agua_alimento', label: 'Recursos compartidos' },
];

const isHumanitarianAlert = (item: EmergencyItem) =>
  item.type === 'vecino_vulnerable' || item.type === 'alerta_peligro';

const isSharedResource = (item: EmergencyItem) =>
  item.type === 'recurso_compartido' || item.type === 'brigada_vecinal';

const getUrgencyLabel = (urgency: EmergencyItem['urgency']) => {
  switch (urgency) {
    case 'critica':
      return 'Crítica';
    case 'alta':
      return 'Alta';
    case 'moderada':
      return 'Moderada';
    default:
      return 'Informativa';
  }
};

const getUrgencyClasses = (urgency: EmergencyItem['urgency'], dark: boolean) => {
  if (urgency === 'critica' || urgency === 'alta') {
    return 'bg-red-600 text-white border-red-500';
  }
  if (urgency === 'moderada') {
    return dark
      ? 'bg-amber-400/15 text-amber-200 border-amber-400/40'
      : 'bg-amber-50 text-amber-900 border-amber-300';
  }
  return dark
    ? 'bg-slate-700 text-slate-100 border-slate-600'
    : 'bg-slate-100 text-slate-700 border-slate-300';
};

const buildSmsHref = (item: EmergencyItem) => {
  const message = [
    `ALERTA VECINOS: ${item.title}`,
    item.description,
    `Ubicación: https://maps.google.com/?q=${item.location.lat},${item.location.lng}`,
    'Solicito apoyo comunitario.',
  ].join('\n');

  return `sms:?body=${encodeURIComponent(message)}`;
};

const formatCreatedAt = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

interface EmergencyCardProps {
  item: EmergencyItem;
  dark: boolean;
  senior: boolean;
  currentUserName: string;
  onJoin: (id: string) => void;
}

const EmergencyCard: React.FC<EmergencyCardProps> = ({
  item,
  dark,
  senior,
  currentUserName,
  onJoin,
}) => {
  const joined = item.responders.includes(currentUserName);
  const protectedLocation = item.isSensitiveProtected && !joined;
  return (
    <article
      className={`flex h-full flex-col justify-between rounded-3xl border p-4 shadow-sm transition sm:p-5 ${
        dark
          ? 'border-red-400/30 bg-slate-900 text-slate-100 shadow-red-950/10'
          : 'border-red-200 bg-white text-slate-950 hover:border-red-300 hover:shadow-md'
      }`}
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-extrabold uppercase tracking-wide ${
              senior ? 'text-xs' : 'text-[10px]'
            } ${getUrgencyClasses(item.urgency, dark)}`}
          >
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            {getUrgencyLabel(item.urgency)}
          </span>
          <span className={`flex items-center gap-1 font-semibold ${senior ? 'text-sm' : 'text-xs'} ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            {formatCreatedAt(item.createdAt)}
          </span>
        </div>

        <h3 className={`mt-3 font-black leading-snug ${senior ? 'text-xl' : 'text-lg'} ${dark ? 'text-white' : 'text-slate-950'}`}>
          {item.title}
        </h3>
        <p className={`mt-1 font-semibold ${senior ? 'text-base' : 'text-xs'} ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
          Publicado por {item.authorName}
        </p>
        <p className={`mt-3 leading-relaxed ${senior ? 'text-base' : 'text-sm'} ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
          {item.description}
        </p>

        {item.resourceTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.resourceTags.map((tag) => (
              <span
                key={tag}
                className={`rounded-full border px-3 py-1 font-bold ${senior ? 'text-sm' : 'text-xs'} ${
                  dark
                    ? 'border-red-400/30 bg-red-400/10 text-red-100'
                    : 'border-red-200 bg-red-50 text-red-900'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className={`mt-4 rounded-2xl border p-3 ${dark ? 'border-slate-700 bg-slate-950/70' : 'border-slate-200 bg-slate-50'}`}>
          {protectedLocation ? (
            <div className="flex items-start gap-2">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
              <div>
                <p className={`font-extrabold ${senior ? 'text-sm' : 'text-xs'} ${dark ? 'text-amber-200' : 'text-amber-900'}`}>
                  Ubicación protegida · Radio aproximado de 150 m
                </p>
                <p className={`mt-1 ${senior ? 'text-sm' : 'text-xs'} ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                  La dirección exacta se muestra después de confirmar que vas a apoyar. Este reporte caduca en 72 horas.
                </p>
              </div>
            </div>
          ) : (
            <p className={`flex items-start gap-2 font-semibold ${senior ? 'text-sm' : 'text-xs'} ${dark ? 'text-slate-200' : 'text-slate-800'}`}>
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
              {item.location.reference}
            </p>
          )}
          <div className={`mt-2 flex items-center gap-2 ${senior ? 'text-sm' : 'text-xs'} ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
            <Footprints className="h-4 w-4 shrink-0" aria-hidden="true" />
            A {item.location.walkingMinutes} min caminando · {item.location.distanceMeters} m aprox.
          </div>
          <div className={`mt-2 flex items-center gap-2 font-bold ${senior ? 'text-sm' : 'text-xs'} ${dark ? 'text-emerald-300' : 'text-emerald-800'}`}>
            <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
            {item.responders.length} vecinos confirmaron apoyo
          </div>
        </div>
      </div>

      <div className={`mt-4 grid grid-cols-1 gap-2 border-t pt-4 sm:grid-cols-2 ${dark ? 'border-slate-700' : 'border-slate-200'}`}>
        <button
          type="button"
          onClick={() => onJoin(item.id)}
          disabled={joined}
          className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 py-3 font-extrabold text-white transition focus:outline-none focus:ring-4 focus:ring-red-500/30 disabled:cursor-default disabled:bg-emerald-700 ${
            senior ? 'text-base' : 'text-sm'
          } ${joined ? '' : 'bg-red-600 hover:bg-red-700 active:scale-[0.98]'}`}
        >
          {joined ? <CheckCircle2 className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
          {joined ? 'Apoyo confirmado' : 'Voy a apoyar'}
        </button>
        <a
          href={buildSmsHref(item)}
          className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-4 py-3 font-extrabold transition focus:outline-none focus:ring-4 focus:ring-amber-500/30 ${
            senior ? 'text-base' : 'text-sm'
          } ${
            dark
              ? 'border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700'
              : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
          }`}
          aria-label={`Enviar por SMS la alerta ${item.title}`}
        >
          <MessageSquare className="h-5 w-5 text-amber-500" />
          Enviar S.O.S. por SMS
        </a>
      </div>
    </article>
  );
};

interface ResourceCardProps {
  item: EmergencyItem;
  dark: boolean;
  senior: boolean;
  currentUserName: string;
  onJoin: (id: string) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  item,
  dark,
  senior,
  currentUserName,
  onJoin,
}) => {
  const joined = item.responders.includes(currentUserName);

  return (
    <article
      className={`flex h-full flex-col justify-between rounded-3xl border p-4 shadow-sm transition sm:p-5 ${
        dark
          ? 'border-teal-400/30 bg-slate-900 text-slate-100'
          : 'border-teal-200 bg-white text-slate-950 hover:border-teal-300 hover:shadow-md'
      }`}
    >
      <div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-extrabold ${senior ? 'text-sm' : 'text-xs'} ${dark ? 'bg-teal-400/10 text-teal-200' : 'bg-teal-50 text-teal-900'}`}>
          <PackageCheck className="h-4 w-4" aria-hidden="true" />
          {item.type === 'brigada_vecinal' ? 'Brigada vecinal' : 'Recurso compartido'}
        </span>
        <h3 className={`mt-3 font-black leading-snug ${senior ? 'text-xl' : 'text-lg'} ${dark ? 'text-white' : 'text-slate-950'}`}>
          {item.title}
        </h3>
        <p className={`mt-1 font-semibold ${senior ? 'text-base' : 'text-xs'} ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
          Publicado por {item.authorName}
        </p>
        <p className={`mt-3 leading-relaxed ${senior ? 'text-base' : 'text-sm'} ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
          {item.description}
        </p>

        {item.resourceTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.resourceTags.map((tag) => (
              <span
                key={tag}
                className={`rounded-full border px-3 py-1 font-bold ${senior ? 'text-sm' : 'text-xs'} ${
                  dark
                    ? 'border-teal-400/30 bg-teal-400/10 text-teal-100'
                    : 'border-teal-200 bg-teal-50 text-teal-900'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className={`mt-4 flex flex-wrap gap-3 ${senior ? 'text-sm' : 'text-xs'} ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-teal-600" />
            {item.location.reference}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Footprints className="h-4 w-4 text-teal-600" />
            {item.location.walkingMinutes} min · {item.location.distanceMeters} m
          </span>
        </div>
      </div>

      <div className={`mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between ${dark ? 'border-slate-700' : 'border-slate-200'}`}>
        <span className={`font-bold ${senior ? 'text-sm' : 'text-xs'} ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
          {item.responders.length} vecinos se sumaron
        </span>
        <button
          type="button"
          onClick={() => onJoin(item.id)}
          disabled={joined}
          className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 py-3 font-extrabold text-white transition focus:outline-none focus:ring-4 focus:ring-teal-500/30 disabled:cursor-default disabled:bg-emerald-700 ${
            senior ? 'text-base' : 'text-sm'
          } ${joined ? '' : 'bg-teal-700 hover:bg-teal-800 active:scale-[0.98]'}`}
        >
          {joined ? <CheckCircle2 className="h-5 w-5" /> : <Users className="h-5 w-5" />}
          {joined ? 'Ya estás participando' : 'Sumarme al apoyo'}
        </button>
      </div>
    </article>
  );
};

export const EmergencyView: React.FC = () => {
  const {
    emergencyItems,
    joinEmergencyResponse,
    currentUser,
    mode,
    openPublishModal,
    isOnline,
    isSeniorMode,
  } = useApp();

  const [section, setSection] = useState<EmergencySection>('alerts');
  const [category, setCategory] = useState<EmergencyFilter>('all');
  const dark = mode === 'emergency';

  const filteredItems = useMemo(
    () =>
      emergencyItems.filter(
        (item) => category === 'all' || item.edanCategory === category,
      ),
    [emergencyItems, category],
  );

  const humanitarianAlerts = filteredItems.filter(isHumanitarianAlert);
  const sharedResources = filteredItems.filter(isSharedResource);

  const criticalAlert = emergencyItems.find(
    (item) => isHumanitarianAlert(item) && item.urgency === 'critica',
  );

  const visibleItems =
    section === 'alerts' ? humanitarianAlerts : sharedResources;

  return (
    <section aria-label="Emergencias del barrio" className="space-y-5">
      <header
        className={`rounded-3xl border p-4 sm:p-5 ${
          dark
            ? 'border-red-500/30 bg-gradient-to-br from-[#241217] to-slate-950 text-white'
            : 'border-red-200 bg-gradient-to-br from-red-50 to-white text-slate-950'
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-xl bg-red-600 p-2 text-white">
                <ShieldAlert className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h2 className={`font-black tracking-tight ${isSeniorMode ? 'text-2xl' : 'text-xl sm:text-2xl'}`}>
                  Emergencia S.O.S.
                </h2>
                <p className={`${isSeniorMode ? 'text-sm' : 'text-xs'} ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Ayuda humanitaria y recursos de respuesta vecinal
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:min-w-[220px]">
            <button
              type="button"
              onClick={() => openPublishModal('emergency')}
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 font-extrabold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/30 active:scale-[0.98] ${
                isSeniorMode ? 'text-base' : 'text-sm'
              }`}
            >
              <Plus className="h-5 w-5" aria-hidden="true" />
              Publicar alerta S.O.S.
            </button>
            {criticalAlert && (
              <a
                href={buildSmsHref(criticalAlert)}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-4 py-3 font-extrabold transition ${
                  isSeniorMode ? 'text-base' : 'text-sm'
                } ${
                  dark
                    ? 'border-red-300/40 bg-red-950/40 text-red-100 hover:bg-red-900/50'
                    : 'border-red-300 bg-white text-red-800 hover:bg-red-50'
                }`}
              >
                <MessageSquare className="h-5 w-5" aria-hidden="true" />
                SMS de alerta crítica
              </a>
            )}
          </div>
        </div>

        <div
          role="status"
          className={`mt-4 flex items-center gap-2 rounded-2xl border px-3 py-2 font-semibold ${
            isSeniorMode ? 'text-sm' : 'text-xs'
          } ${
            isOnline
              ? dark
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                : 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : dark
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                : 'border-amber-200 bg-amber-50 text-amber-900'
          }`}
        >
          {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
          {isOnline
            ? 'Con conexión: puedes consultar y publicar reportes.'
            : 'Modo sin conexión: los reportes locales siguen visibles. El SMS requiere señal celular.'}
        </div>
      </header>

      <div className="space-y-3">
        <div className={`grid grid-cols-2 gap-2 rounded-2xl border p-1 ${
          dark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-slate-100'
        }`}>
          <button
            type="button"
            aria-pressed={section === 'alerts'}
            onClick={() => setSection('alerts')}
            className={`min-h-12 rounded-xl px-3 font-extrabold transition ${
              isSeniorMode ? 'text-sm' : 'text-xs'
            } ${
              section === 'alerts'
                ? 'bg-red-600 text-white shadow-sm'
                : dark
                  ? 'text-slate-300 hover:bg-slate-800'
                  : 'text-slate-700 hover:bg-white'
            }`}
          >
            Ayuda humanitaria ({humanitarianAlerts.length})
          </button>
          <button
            type="button"
            aria-pressed={section === 'resources'}
            onClick={() => setSection('resources')}
            className={`min-h-12 rounded-xl px-3 font-extrabold transition ${
              isSeniorMode ? 'text-sm' : 'text-xs'
            } ${
              section === 'resources'
                ? 'bg-teal-700 text-white shadow-sm'
                : dark
                  ? 'text-slate-300 hover:bg-slate-800'
                  : 'text-slate-700 hover:bg-white'
            }`}
          >
            Recursos y brigadas ({sharedResources.length})
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar emergencias por categoría">
          {EMERGENCY_FILTERS.map((filter) => {
            const active = category === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(filter.id)}
                className={`min-h-11 shrink-0 rounded-full border px-4 font-bold transition ${
                  isSeniorMode ? 'text-sm' : 'text-xs'
                } ${
                  active
                    ? 'border-red-600 bg-red-600 text-white'
                    : dark
                      ? 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {visibleItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {section === 'alerts'
            ? humanitarianAlerts.map((item) => (
                <EmergencyCard
                  key={item.id}
                  item={item}
                  dark={dark}
                  senior={isSeniorMode}
                  currentUserName={currentUser.fullName}
                  onJoin={joinEmergencyResponse}
                />
              ))
            : sharedResources.map((item) => (
                <ResourceCard
                  key={item.id}
                  item={item}
                  dark={dark}
                  senior={isSeniorMode}
                  currentUserName={currentUser.fullName}
                  onJoin={joinEmergencyResponse}
                />
              ))}
        </div>
      ) : (
        <div className={`rounded-3xl border border-dashed p-8 text-center ${
          dark ? 'border-slate-700 bg-slate-900/60 text-slate-200' : 'border-slate-300 bg-white text-slate-700'
        }`}>
          <PackageCheck className="mx-auto h-10 w-10 opacity-60" aria-hidden="true" />
          <h3 className={`mt-3 font-black ${isSeniorMode ? 'text-xl' : 'text-lg'}`}>
            No hay reportes en esta categoría
          </h3>
          <p className={`mt-1 ${isSeniorMode ? 'text-sm' : 'text-xs'} ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Puedes cambiar el filtro o publicar una nueva alerta para tu comunidad.
          </p>
          <button
            type="button"
            onClick={() => openPublishModal('emergency')}
            className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-red-700"
          >
            <Plus className="h-5 w-5" />
            Publicar alerta
          </button>
        </div>
      )}
    </section>
  );
};

export default EmergencyView;