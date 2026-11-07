import L from 'leaflet';
import React from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useApp } from '../../context/AppContext';
import { NEIGHBORHOOD_CENTER } from '../../services/geoService';

function createCustomPin(bgHex: string, label: string, pulse = false) {
  const pulseRing = pulse
    ? `<span style="position:absolute;inset:-6px;border-radius:9999px;background:${bgHex};opacity:0.45;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></span>`
    : '';

  return L.divIcon({
    className: 'custom-vecinos-pin',
    html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:9999px;background:${bgHex};color:#ffffff;font-weight:700;font-size:11px;border:2.5px solid #ffffff;box-shadow:0 4px 10px rgba(0,0,0,0.35);">${pulseRing}<span style="position:relative;z-index:2;">${label}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -16],
  });
}

const BOUNDS: L.LatLngBoundsExpression = [
  [NEIGHBORHOOD_CENTER.lat - 0.012, NEIGHBORHOOD_CENTER.lng - 0.012],
  [NEIGHBORHOOD_CENTER.lat + 0.012, NEIGHBORHOOD_CENTER.lng + 0.012],
];

export const CommunityMap: React.FC = () => {
  const { mode, isOnline, services, favors, emergencyItems, joinEmergencyResponse } = useApp();

  return (
    <div className="relative flex flex-col rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
      <div
        className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-xs font-medium ${
          mode === 'emergency'
            ? 'bg-slate-900 text-slate-100 border-b border-red-500/30'
            : 'bg-slate-100 text-slate-700 border-b border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold">{NEIGHBORHOOD_CENTER.name}</span>
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            Radio &lt; 10 min a pie
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          {mode === 'normal' ? (
            <>
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> Servicios/Productos
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" /> Favores/Pool
              </span>
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-red-600" /> Vulnerables (Radio 150m)
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Recursos S.O.S.
              </span>
            </>
          )}
        </div>
      </div>

      {!isOnline && (
        <div className="bg-amber-500/95 px-3 py-1.5 text-center text-xs font-semibold text-slate-950">
          Modo Offline Activo: Mostrando caché geoespacial del barrio y coordenadas GPS locales
        </div>
      )}

      <div className="h-[380px] w-full sm:h-[440px]">
        <MapContainer
          center={[NEIGHBORHOOD_CENTER.lat, NEIGHBORHOOD_CENTER.lng]}
          zoom={16}
          minZoom={14}
          maxZoom={18}
          maxBounds={BOUNDS}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={[NEIGHBORHOOD_CENTER.lat, NEIGHBORHOOD_CENTER.lng]}
            icon={createCustomPin('#0f172a', 'TÚ')}
          >
            <Popup>
              <div className="text-xs">
                <p className="font-bold text-slate-900">Tu ubicación actual</p>
                <p className="text-slate-600">{NEIGHBORHOOD_CENTER.name}</p>
              </div>
            </Popup>
          </Marker>

          {mode === 'normal' &&
            services.map((srv) => (
              <Marker
                key={srv.id}
                position={[srv.location.lat, srv.location.lng]}
                icon={createCustomPin('#059669', `${srv.weightedScore}%`)}
              >
                <Popup>
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-slate-900">{srv.tradeTitle}</p>
                    <p className="text-slate-600">
                      {srv.providerName} · A {srv.location.walkingMinutes} min caminando (
                      {srv.location.distanceMeters}m)
                    </p>
                    <p className="font-semibold text-emerald-700">{srv.priceRange}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

          {mode === 'normal' &&
            favors.map((fav) => (
              <Marker
                key={fav.id}
                position={[fav.location.lat, fav.location.lng]}
                icon={createCustomPin('#4f46e5', 'FAV')}
              >
                <Popup>
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-slate-900">{fav.title}</p>
                    <p className="text-slate-600">
                      {fav.authorName} · A {fav.location.walkingMinutes} min a pie
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}

          {mode === 'emergency' &&
            emergencyItems.map((emg) => {
              const isCritical = emg.urgency === 'critica' || emg.type === 'vecino_vulnerable';
              const color = isCritical ? '#dc2626' : '#d97706';
              return (
                <React.Fragment key={emg.id}>
                  {emg.isSensitiveProtected && (
                    <Circle
                      center={[emg.location.lat, emg.location.lng]}
                      radius={emg.location.privacyRadiusMeters || 150}
                      pathOptions={{
                        color: '#dc2626',
                        fillColor: '#ef4444',
                        fillOpacity: 0.18,
                      }}
                    />
                  )}
                  <Marker
                    position={[emg.location.lat, emg.location.lng]}
                    icon={createCustomPin(color, 'SOS', isCritical)}
                  >
                    <Popup>
                      <div className="space-y-1.5 text-xs">
                        <p className="font-bold text-red-700">{emg.title}</p>
                        <p className="text-slate-600">
                          A {emg.location.walkingMinutes} min caminando ({emg.location.distanceMeters}
                          m)
                        </p>
                        {emg.isSensitiveProtected && (
                          <p className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                            Radio protegido (~150m - Ley 29733)
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => joinEmergencyResponse(emg.id)}
                          className="w-full rounded bg-red-600 px-2 py-1 text-center font-semibold text-white hover:bg-red-700"
                        >
                          Voy a apoyar ({emg.responders.length})
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                </React.Fragment>
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
};
