import { CheckCircle2, Footprints, HandHeart, MapPin } from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FavorCategory } from '../../types';

const FAVOR_CATEGORIES: { id: 'all' | FavorCategory; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'prestamo_salud_herramienta', label: 'Muletas y herramientas' },
  { id: 'movilidad_pool', label: 'Pool escolar' },
  { id: 'intercambio_trueque', label: 'Intercambio' },
  { id: 'ayuda_temporal', label: 'Apoyo puntual' },
];

export const FavorsView: React.FC = () => {
  const { favors, markFavorStatus, mode } = useApp();
  const [directionFilter, setDirectionFilter] = useState<'all' | 'ofrezco' | 'solicito'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | FavorCategory>('all');
  const isEmergency = mode === 'emergency';

  const filtered = favors.filter((fav) => {
    if (directionFilter !== 'all' && fav.direction !== directionFilter) return false;
    if (categoryFilter !== 'all' && fav.category !== categoryFilter) return false;
    return true;
  });

  return (
    <section aria-label="Favores y rutas compartidas" className="space-y-3.5">
      <div className="space-y-2.5">
        <div
          className={`grid grid-cols-3 rounded-2xl p-1 ${
            isEmergency ? 'bg-slate-900 border border-slate-800' : 'bg-slate-200/75'
          }`}
        >
          {[
            { id: 'all', label: 'Todos' },
            { id: 'ofrezco', label: 'Ofrecen' },
            { id: 'solicito', label: 'Necesitan' },
          ].map((dir) => {
            const active = directionFilter === dir.id;
            return (
              <button
                key={dir.id}
                type="button"
                onClick={() => setDirectionFilter(dir.id as 'all' | 'ofrezco' | 'solicito')}
                className={`rounded-xl py-1.5 text-xs font-semibold transition ${
                  active
                    ? isEmergency
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                {dir.label}
              </button>
            );
          })}
        </div>

        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {FAVOR_CATEGORIES.map((cat) => {
            const active = categoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? isEmergency
                      ? 'bg-white text-slate-950'
                      : 'bg-slate-900 text-white'
                    : isEmergency
                    ? 'bg-slate-900 text-slate-300 border border-slate-800'
                    : 'bg-white text-slate-600 border border-slate-200/70'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((fav) => (
          <article
            key={fav.id}
            className={`rounded-3xl p-4 transition ${
              isEmergency
                ? 'bg-[#121826] border border-slate-800 text-slate-100'
                : 'bg-white border border-slate-200/60 text-slate-900 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    fav.direction === 'ofrezco'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-500/15 text-amber-800 dark:text-amber-300'
                  }`}
                >
                  {fav.direction === 'ofrezco' ? 'Ofrece' : 'Necesita'}
                </span>
                <span className="tabular inline-flex items-center gap-1 text-slate-500">
                  <Footprints className="h-3.5 w-3.5" aria-hidden="true" />A{' '}
                  {fav.location.walkingMinutes} min ({fav.location.distanceMeters}m)
                </span>
              </div>

              <span className="text-[11px] text-slate-400">{fav.createdAt}</span>
            </div>

            <h3 className="heading-tight mt-2 text-[16px] font-bold leading-snug">{fav.title}</h3>
            <p className={`mt-0.5 text-xs ${isEmergency ? 'text-slate-400' : 'text-slate-500'}`}>
              {fav.authorName}
            </p>

            <p
              className={`readable-prose mt-2 text-[13px] leading-relaxed ${
                isEmergency ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {fav.description}
            </p>

            {fav.exchangeNote && (
              <p
                className={`mt-2.5 rounded-2xl px-3 py-2 text-xs ${
                  isEmergency ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-600'
                }`}
              >
                <span className="font-semibold">Acuerdo:</span> {fav.exchangeNote}
              </p>
            )}

            <div className="mt-3 flex items-center justify-between gap-2 pt-1">
              <div className="min-w-0 flex-1 text-xs text-slate-500">
                <p className="flex items-center gap-1 truncate">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                  <span className="truncate">
                    {fav.safeMeetingPoint || fav.location.reference}
                  </span>
                </p>
              </div>

              {fav.status === 'disponible' ? (
                <button
                  type="button"
                  onClick={() => markFavorStatus(fav.id, 'en_curso')}
                  className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition active:scale-95"
                >
                  <HandHeart className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {fav.category === 'movilidad_pool'
                      ? 'Unirme al pool'
                      : fav.direction === 'ofrezco'
                      ? 'Pedir prestado'
                      : 'Apoyar'}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => markFavorStatus(fav.id, 'completado')}
                  className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-2xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>En coordinación ({fav.helpedByCount})</span>
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
