import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { EMERGENCY_HOTLINES_DATA } from '../../data/emergencyHotlines';
import { useApp } from '../../context/AppContext';
import { HoldToCallButton } from './HoldToCallButton';

interface EmergencyHotlinePanelProps {
  compact?: boolean;
  columns?: 1 | 2;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const EmergencyHotlinePanel: React.FC<EmergencyHotlinePanelProps> = ({
  compact = false,
  columns = 2,
  title = 'Teléfonos de Auxilio Rápido',
  subtitle = 'Mantén presionado 1 segundo sobre cualquiera para llamar directo.',
  className = '',
}) => {
  const { mode } = useApp();
  const isEmergency = mode === 'emergency';

  return (
    <div
      className={`rounded-3xl border p-4 shadow-xs transition-colors ${
        isEmergency
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200/90 text-slate-950'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-lg ${
                isEmergency ? 'bg-red-950 text-red-400' : 'bg-red-100 text-red-600'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
            </span>
            <h3 className={`text-sm font-black tracking-tight ${isEmergency ? 'text-white' : 'text-slate-950'}`}>
              {title}
            </h3>
          </div>
          {subtitle && (
            <p className={`text-xs mt-1 ${isEmergency ? 'text-slate-400' : 'text-slate-500'}`}>
              {subtitle}
            </p>
          )}
        </div>

        <span
          className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            isEmergency
              ? 'text-emerald-300 bg-emerald-950/60 border-emerald-800'
              : 'text-emerald-800 bg-emerald-50 border-emerald-200'
          }`}
        >
          Yanahuara
        </span>
      </div>

      <div className={columns === 1 ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-1 sm:grid-cols-2 gap-2'}>
        {EMERGENCY_HOTLINES_DATA.map((hotline) => (
          <HoldToCallButton
            key={hotline.number}
            name={hotline.name}
            number={hotline.number}
            displayNumber={hotline.displayNumber}
            subtitle={hotline.subtitle}
            icon={hotline.icon}
            accentColor={hotline.accentColor}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
};
