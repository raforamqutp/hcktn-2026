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
    <section aria-label="Favores y rutas compartidas" className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2
              className={`text-2xl md:text-3xl font-black tracking-tight ${
                isEmergency ? 'text-white' : 'text-slate-950'
              }`}
            >
              Favores y Red Solidaria
            </h2>
            <p
              className={`text-xs md:text-sm font-semibold mt-0.5 ${
                isEmergency ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Préstamo de herramientas, asientos de pool escolar y ayuda recíproca entre vecinos
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
          <div
            className={`grid grid-cols-3 rounded-2xl p-1 max-w-xs border-2 ${
              isEmergency ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-300'
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
                  className={`rounded-xl py-2 text-xs font-black transition active:scale-95 ${
                    active
                      ? isEmergency
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'bg-white text-slate-950 shadow-xs ring-1 ring-slate-300'
                      : 'text-slate-700 hover:text-slate-950'
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
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition active:scale-95 ${
                    active
                      ? isEmergency
                        ? 'bg-white text-slate-950 shadow-xs'
                        : 'bg-slate-950 text-white shadow-xs'
                      : isEmergency
                      ? 'bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800'
                      : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grilla de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((fav) => (
          <article
            key={fav.id}
            className={`rounded-3xl p-5 transition-all flex flex-col justify-between ${
              isEmergency
                ? 'bg-[#121826] border-2 border-slate-800 text-slate-100 shadow-md shadow-red-950/10'
                : 'bg-white border-2 border-slate-200/90 text-slate-950 shadow-xs hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-0.5 text-[11px] font-black border ${
                      fav.direction === 'ofrezco'
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
                        : 'bg-amber-100 border-amber-300 text-amber-950'
                    }`}
                  >
                    {fav.direction === 'ofrezco' ? 'Vecino ofrece' : 'Vecino necesita'}
                  </span>
                  <span className="tabular inline-flex items-center gap-1 font-bold text-slate-700">
                    <Footprints className="h-4 w-4 text-emerald-700" aria-hidden="true" />A{' '}
                    {fav.location.walkingMinutes} min ({fav.location.distanceMeters}m)
                  </span>
                </div>

                <span className="text-[11px] font-semibold text-slate-500">{fav.createdAt}</span>
              </div>

              <h3 className="heading-tight mt-2.5 text-[18px] font-black leading-snug text-slate-950 dark:text-white">
                {fav.title}
              </h3>
              <p
                className={`mt-0.5 text-xs font-semibold ${
                  isEmergency ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {fav.authorName} · {fav.location.reference}
              </p>

              <p
                className={`readable-prose mt-2.5 text-xs font-normal leading-relaxed ${
                  isEmergency ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                {fav.description}
              </p>

              {fav.exchangeNote && (
                <div
                  className={`mt-3 rounded-2xl p-2.5 text-xs border ${
                    isEmergency
                      ? 'bg-slate-900 border-slate-700 text-slate-200'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <p className="font-bold text-slate-950">
                    Acuerdo vecinal:{' '}
                    <span className="font-normal text-slate-800">{fav.exchangeNote}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1 text-xs text-slate-600">
                <p className="flex items-center gap-1.5 truncate font-semibold text-xs">
                  <MapPin className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                  <span className="truncate">
                    {fav.safeMeetingPoint || fav.location.reference}
                  </span>
                </p>
              </div>

              {fav.status === 'disponible' ? (
                <button
                  type="button"
                  onClick={() => markFavorStatus(fav.id, 'en_curso')}
                  className="inline-flex min-h-[42px] shrink-0 items-center gap-1.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-black text-white transition active:scale-95 shadow-xs"
                >
                  <HandHeart className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {fav.category === 'movilidad_pool'
                      ? 'Unirme al pool'
                      : fav.direction === 'ofrezco'
                      ? 'Pedir prestado'
                      : 'Ofrecer apoyo'}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => markFavorStatus(fav.id, 'completado')}
                  className="inline-flex min-h-[42px] shrink-0 items-center gap-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-black text-white transition active:scale-95 shadow-xs"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
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
