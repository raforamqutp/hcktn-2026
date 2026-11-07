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
    html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:9999px;background:${bgHex};color:#ffffff;font-weight:700;font-size:10px;border:2px solid #ffffff;box-shadow:0 4px 10px rgba(0,0,0,0.3);">${pulseRing}<span style="position:relative;z-index:2;">${label}</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -14],
  });
}

const BOUNDS: L.LatLngBoundsExpression = [
  [NEIGHBORHOOD_CENTER.lat - 0.012, NEIGHBORHOOD_CENTER.lng - 0.012],
  [NEIGHBORHOOD_CENTER.lat + 0.012, NEIGHBORHOOD_CENTER.lng + 0.012],
];

interface CommunityMapProps {
  compact?: boolean;
  heightClassName?: string;
}

export const CommunityMap: React.FC<CommunityMapProps> = ({
  compact = false,
  heightClassName,
}) => {
  const { mode, isOnline, services, favors, emergencyItems, joinEmergencyResponse } = useApp();
  const isEmergency = mode === 'emergency';

  const defaultHeight = compact
    ? 'h-[240px] sm:h-[260px]'
    : 'h-[460px] md:h-[620px] lg:h-[700px]';

  const containerHeight = heightClassName || defaultHeight;

  return (
    <div
      className={`overflow-hidden rounded-2xl md:rounded-3xl border-2 transition-all ${
        isEmergency
          ? 'border-slate-700 bg-[#121826] shadow-lg shadow-red-950/20'
          : 'border-slate-200 bg-white shadow-xs'
      }`}
    >
      <div
        className={`flex items-center justify-between gap-2 px-4 py-2.5 text-xs border-b-2 ${
          isEmergency
            ? 'border-slate-700 text-slate-200 bg-slate-900'
            : 'border-slate-200 text-slate-950 bg-slate-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="font-black text-slate-950 dark:text-white">
            {compact ? 'Radar del Barrio' : 'Mapa Comunitario Interactivo'}
          </span>
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
            (&lt; 10 min a pie)
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {!isEmergency ? (
            <>
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-950">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                <span>Servicios ({services.length})</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-bold text-indigo-950">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                <span>Favores ({favors.length})</span>
              </span>
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-1.5 font-black text-red-500">
                <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-ping" />
                Urgencias ({emergencyItems.filter((i) => i.urgency === 'critica').length})
              </span>
              <span className="inline-flex items-center gap-1.5 font-bold text-amber-500">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                Puntos de apoyo
              </span>
            </>
          )}
        </div>
      </div>

      {!isOnline && (
        <div className="bg-amber-400 px-3 py-1.5 text-center text-xs font-black text-slate-950">
          Sin conexión a internet · Mostrando coordenadas guardadas en caché
        </div>
      )}

      <div className={`${containerHeight} w-full relative`}>
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
              <div className="p-1 text-xs space-y-1">
                <p className="font-bold text-slate-900">Tu punto vecinal</p>
                <p className="text-slate-600">{NEIGHBORHOOD_CENTER.name}</p>
                <p className="text-[10px] text-emerald-600 font-medium">Ubicación verificada</p>
              </div>
            </Popup>
          </Marker>

          {!isEmergency &&
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
                      {srv.providerName} · {srv.location.walkingMinutes} min a pie
                    </p>
                    <p className="font-semibold text-emerald-700">{srv.priceRange}</p>
                    {srv.paymentMethods.includes('trueque') && (
                      <span className="inline-block rounded bg-amber-100 text-amber-800 px-1.5 py-0.5 text-[10px] font-medium">
                        Acepta trueque
                      </span>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}

          {!isEmergency &&
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
                      {fav.authorName} · {fav.location.walkingMinutes} min a pie
                    </p>
                    <p className="text-[11px] font-medium text-indigo-700">
                      {fav.direction === 'ofrezco' ? 'Vecino ofrece ayuda' : 'Vecino necesita apoyo'}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}

          {isEmergency &&
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
                        fillOpacity: 0.16,
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
                          A {emg.location.walkingMinutes} min ({emg.location.distanceMeters}m)
                        </p>
                        {emg.isSensitiveProtected && (
                          <p className="text-[10px] text-slate-500">
                            Zona aproximada por protección de privacidad
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => joinEmergencyResponse(emg.id)}
                          className="w-full rounded-lg bg-red-600 px-2 py-1 text-center font-semibold text-white transition hover:bg-red-700"
                        >
                          Voy a ayudar ({emg.responders.length})
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
