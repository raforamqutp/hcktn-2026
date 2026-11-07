import { Car, CheckCircle2, HandHeart, MapPin, Shield, Wrench } from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FavorCategory } from '../../types';

const FAVOR_CATEGORIES: { id: 'all' | FavorCategory; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'prestamo_salud_herramienta', label: 'Muletas / Herramientas' },
  { id: 'movilidad_pool', label: 'Pool Escolar / Ruta Solidaria' },
  { id: 'intercambio_trueque', label: 'Trueque de Habilidades' },
  { id: 'donacion_material', label: 'Donación de Materiales' },
  { id: 'ayuda_temporal', label: 'Ayuda Temporal' },
];

export const FavorsView: React.FC = () => {
  const { favors, markFavorStatus, openPublishModal } = useApp();
  const [directionFilter, setDirectionFilter] = useState<'all' | 'ofrezco' | 'solicito'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | FavorCategory>('all');

  const filtered = favors.filter((fav) => {
    if (directionFilter !== 'all' && fav.direction !== directionFilter) return false;
    if (categoryFilter !== 'all' && fav.category !== categoryFilter) return false;
    return true;
  });

  return (
    <section aria-labelledby="favors-heading" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="favors-heading" className="text-xl font-extrabold tracking-tight">
            Cadena de Favores y Economía Solidaria (Sin Dinero)
          </h2>
          <p className="text-xs text-slate-600">
            Préstamo de muletas y herramientas, Pool Escolar entre vecinos y apoyo mutuo
          </p>
        </div>
        <button
          type="button"
          onClick={() => openPublishModal('favor')}
          className="min-h-[44px] rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
        >
          + Ofrecer o Pedir Favor
        </button>
      </div>

      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/80 p-3.5 text-xs text-indigo-950">
        <div className="flex items-center gap-2 font-bold">
          <Car className="h-4 w-4 text-indigo-600" aria-hidden="true" />
          <span>Pool Escolar y Movilidad Solidaria Activa en tu Manzana</span>
        </div>
        <p className="mt-1 text-indigo-900">
          Comparte auto rumbo al colegio de tus hijos o avisa si vas a la farmacia/mercado para
          ahorrar transporte entre vecinos verificados.
        </p>
      </div>

      <div className="space-y-2.5 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Todos los favores' },
            { id: 'ofrezco', label: 'Vecinos que Ofrecen' },
            { id: 'solicito', label: 'Vecinos que Necesitan' },
          ].map((dir) => (
            <button
              key={dir.id}
              type="button"
              onClick={() => setDirectionFilter(dir.id as 'all' | 'ofrezco' | 'solicito')}
              className={`min-h-[38px] rounded-xl px-3 py-1 text-xs font-bold transition ${
                directionFilter === dir.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {dir.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {FAVOR_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`min-h-[36px] rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                categoryFilter === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((fav) => (
          <article
            key={fav.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={`rounded-lg px-2 py-0.5 text-[11px] font-bold uppercase ${
                      fav.direction === 'ofrezco'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {fav.direction === 'ofrezco' ? 'Vecino Ofrece' : 'Vecino Solicita'}
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                    A {fav.location.walkingMinutes} min a pie ({fav.location.distanceMeters}m)
                  </span>
                  {fav.syncStatus === 'pending' && (
                    <span className="rounded-lg bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                      En cola Offline
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-900">{fav.title}</h3>
                <p className="text-xs font-medium text-slate-500">
                  Por {fav.authorName} (Nivel: {fav.authorTier}) · {fav.createdAt}
                </p>
              </div>

              <span
                className={`rounded-xl px-2.5 py-1 text-xs font-bold ${
                  fav.status === 'disponible'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : fav.status === 'en_curso'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {fav.status === 'disponible'
                  ? 'Disponible'
                  : fav.status === 'en_curso'
                  ? 'En coordinación'
                  : 'Completado'}
              </span>
            </div>

            <p className="mt-2.5 text-sm text-slate-700">{fav.description}</p>

            {fav.exchangeNote && (
              <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-700">
                <Wrench className="mr-1 inline h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
                <strong>Condición solidaria:</strong> {fav.exchangeNote}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
              <div className="flex flex-wrap items-center gap-3 text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  {fav.location.reference}
                </span>
                {fav.safeMeetingPoint && (
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                    <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                    Punto seguro: {fav.safeMeetingPoint}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {fav.status === 'disponible' ? (
                  <button
                    type="button"
                    onClick={() => markFavorStatus(fav.id, 'en_curso')}
                    className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                  >
                    <HandHeart className="h-4 w-4" aria-hidden="true" />
                    <span>
                      {fav.direction === 'ofrezco' ? 'Solicitar Préstamo / Cupo' : 'Yo te apoyo'}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => markFavorStatus(fav.id, 'completado')}
                    className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <span>Marcar Resuelto ({fav.helpedByCount} vecinos)</span>
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
