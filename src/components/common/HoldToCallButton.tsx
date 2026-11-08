import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy, PhoneForwarded } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface HoldToCallProps {
  name: string;
  number: string;
  displayNumber?: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: 'emerald' | 'red' | 'rose' | 'blue';
  compact?: boolean;
}

const LIGHT_COLOR_MAP = {
  emerald: {
    bg: 'bg-emerald-50/80 hover:bg-emerald-50',
    border: 'border-emerald-200/80',
    text: 'text-emerald-950',
    number: 'text-emerald-800',
    progress: 'bg-emerald-600',
    iconBg: 'bg-emerald-600 text-white',
    badge: 'bg-white text-slate-700 border-emerald-200',
  },
  red: {
    bg: 'bg-red-50/80 hover:bg-red-50',
    border: 'border-red-200/80',
    text: 'text-red-950',
    number: 'text-red-800',
    progress: 'bg-red-600',
    iconBg: 'bg-red-600 text-white',
    badge: 'bg-white text-slate-700 border-red-200',
  },
  rose: {
    bg: 'bg-rose-50/80 hover:bg-rose-50',
    border: 'border-rose-200/80',
    text: 'text-rose-950',
    number: 'text-rose-800',
    progress: 'bg-rose-600',
    iconBg: 'bg-rose-600 text-white',
    badge: 'bg-white text-slate-700 border-rose-200',
  },
  blue: {
    bg: 'bg-blue-50/80 hover:bg-blue-50',
    border: 'border-blue-200/80',
    text: 'text-blue-950',
    number: 'text-blue-800',
    progress: 'bg-blue-600',
    iconBg: 'bg-blue-600 text-white',
    badge: 'bg-white text-slate-700 border-blue-200',
  },
};

const EMERGENCY_COLOR_MAP = {
  emerald: {
    bg: 'bg-slate-900 hover:bg-slate-800',
    border: 'border-emerald-500/40',
    text: 'text-emerald-300',
    number: 'text-emerald-400',
    progress: 'bg-emerald-500',
    iconBg: 'bg-emerald-600 text-white',
    badge: 'bg-slate-800 text-emerald-300 border-emerald-500/40',
  },
  red: {
    bg: 'bg-slate-900 hover:bg-slate-800',
    border: 'border-red-500/40',
    text: 'text-red-300',
    number: 'text-red-400',
    progress: 'bg-red-500',
    iconBg: 'bg-red-600 text-white',
    badge: 'bg-slate-800 text-red-300 border-red-500/40',
  },
  rose: {
    bg: 'bg-slate-900 hover:bg-slate-800',
    border: 'border-rose-500/40',
    text: 'text-rose-300',
    number: 'text-rose-400',
    progress: 'bg-rose-500',
    iconBg: 'bg-rose-600 text-white',
    badge: 'bg-slate-800 text-rose-300 border-rose-500/40',
  },
  blue: {
    bg: 'bg-slate-900 hover:bg-slate-800',
    border: 'border-blue-500/40',
    text: 'text-blue-300',
    number: 'text-blue-400',
    progress: 'bg-blue-500',
    iconBg: 'bg-blue-600 text-white',
    badge: 'bg-slate-800 text-blue-300 border-blue-500/40',
  },
};

const HOLD_DURATION_MS = 1000;

export const HoldToCallButton: React.FC<HoldToCallProps> = ({
  name,
  number,
  displayNumber,
  subtitle,
  icon: Icon,
  accentColor,
  compact = false,
}) => {
  const { mode, activeTab } = useApp();
  const isEmergency = mode === 'emergency' || activeTab === 'emergency';

  const [progress, setProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const updateLoopRef = useRef<() => void>(() => {});

  const colorPalette = isEmergency ? EMERGENCY_COLOR_MAP : LIGHT_COLOR_MAP;
  const colors = colorPalette[accentColor] || colorPalette.emerald;
  const display = displayNumber || number;

  const triggerCall = useCallback(() => {
    setIsCompleted(true);
    setProgress(100);

    // Haptic feedback en dispositivos móviles (vibración física)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([60, 40, 100]);
      } catch {
        // Ignorar si el navegador no permite vibrate
      }
    }

    // Redirigir al marcador telefónico nativo
    setTimeout(() => {
      window.location.href = `tel:${number}`;
    }, 150);

    // Restaurar estado visual después de 2 segundos
    setTimeout(() => {
      setIsCompleted(false);
      setProgress(0);
      setIsPressing(false);
    }, 2200);
  }, [number]);

  useEffect(() => {
    updateLoopRef.current = () => {
      if (!startTimeRef.current) return;
      const elapsed = performance.now() - startTimeRef.current;
      const currentProgress = Math.min((elapsed / HOLD_DURATION_MS) * 100, 100);

      setProgress(currentProgress);

      if (currentProgress >= 100) {
        triggerCall();
      } else {
        animationFrameRef.current = requestAnimationFrame(updateLoopRef.current);
      }
    };
  }, [triggerCall]);

  const startHold = useCallback(() => {
    if (isCompleted) return;

    setIsPressing(true);
    startTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(() => updateLoopRef.current());
  }, [isCompleted]);

  const cancelHold = useCallback(() => {
    if (isCompleted) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    startTimeRef.current = null;
    setIsPressing(false);
    setProgress(0);
  }, [isCompleted]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const remainingSeconds = Math.max(0, ((HOLD_DURATION_MS * (1 - progress / 100)) / 1000)).toFixed(1);

  return (
    <div
      ref={buttonRef}
      role="button"
      tabIndex={0}
      aria-label={`Llamar a ${name} al número ${display}. Mantén presionado un segundo.`}
      onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      onTouchCancel={cancelHold}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerCall();
        }
      }}
      className={`group relative overflow-hidden select-none cursor-pointer rounded-2xl border transition-all duration-150 ${
        colors.bg
      } ${colors.border} ${
        isPressing ? 'scale-[0.97] shadow-inner ring-2 ring-emerald-500/40' : 'hover:border-slate-300 shadow-xs'
      } ${compact ? 'p-2' : 'p-3'}`}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Barra de progreso con clip-path inset de Emil Kowalski */}
      <div
        className={`absolute inset-0 pointer-events-none transition-[clip-path] opacity-20 ${
          colors.progress
        } ${isPressing ? 'duration-0' : 'duration-200 ease-out'}`}
        style={{
          clipPath: `inset(0 ${100 - progress}% 0 0)`,
        }}
        aria-hidden="true"
      />

      {/* Indicador de Línea Inferior Dinámica */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 pointer-events-none transition-all ${
          isPressing ? 'duration-0' : 'duration-200 ease-out'
        } ${colors.progress}`}
        style={{
          width: `${progress}%`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-center justify-between gap-2.5">
        {/* Lado izquierdo: Ícono + Datos */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform duration-150 ${
              colors.iconBg
            } ${isPressing ? 'scale-90 rotate-[-4deg]' : 'group-hover:scale-105'}`}
          >
            {isCompleted ? (
              <PhoneForwarded className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse text-white" />
            ) : (
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            )}
          </div>

          <div className="min-w-0">
            <h4 className={`text-xs font-black tracking-tight truncate ${colors.text}`}>
              {name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-xs sm:text-sm font-black tabular tracking-tight ${colors.number}`}>
                {display}
              </span>
              {subtitle && !compact && (
                <span className="hidden xl:inline text-[10px] font-medium text-slate-500 truncate">
                  • {subtitle}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Lado derecho: Estado de pulsación e interacción */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Micro-badge de cuenta regresiva */}
          {isPressing && !isCompleted && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-900 text-white animate-pulse">
              <span>{remainingSeconds}s</span>
            </span>
          )}

          {isCompleted && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-600 text-white shadow-xs">
              <Check className="h-3 w-3" />
              <span>Llamando</span>
            </span>
          )}

          {!isPressing && !isCompleted && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border shadow-2xs ${colors.badge}`}>
              Mantén 1s
            </span>
          )}

          {/* Botón secundario para copiar número */}
          <button
            type="button"
            onClick={handleCopy}
            title="Copiar número"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-white/80 transition active:scale-90"
            aria-label={`Copiar número de ${name}`}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
