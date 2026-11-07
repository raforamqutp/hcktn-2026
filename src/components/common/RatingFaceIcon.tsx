import React from 'react';
import { SentimentScore } from '../../types';

interface RatingFaceIconProps {
  sentiment: SentimentScore;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  showLabel?: boolean;
  isDarkTheme?: boolean;
}

export const RatingFaceIcon: React.FC<RatingFaceIconProps> = ({
  sentiment,
  size = 'md',
  active = false,
  showLabel = false,
  isDarkTheme = false,
}) => {
  const pixelSize = size === 'sm' ? 32 : size === 'lg' ? 48 : 38;

  const configs = {
    light: {
      happy: {
        label: 'BIEN',
        title: 'Buen servicio',
        bg: active ? 'bg-emerald-200 ring-2 ring-emerald-600' : 'bg-emerald-100/90 hover:bg-emerald-200/90 border border-emerald-300',
        stroke: '#059669',
        fill: '#047857',
        textClass: 'text-emerald-900',
      },
      neutral: {
        label: 'REGULAR',
        title: 'Servicio regular',
        bg: active ? 'bg-amber-200 ring-2 ring-amber-600' : 'bg-amber-100/90 hover:bg-amber-200/90 border border-amber-300',
        stroke: '#d97706',
        fill: '#b45309',
        textClass: 'text-amber-900',
      },
      angry: {
        label: 'A MEJORAR',
        title: 'A mejorar',
        bg: active ? 'bg-rose-200 ring-2 ring-rose-600' : 'bg-rose-100/90 hover:bg-rose-200/90 border border-rose-300',
        stroke: '#e11d48',
        fill: '#be123c',
        textClass: 'text-rose-900',
      },
    },
    dark: {
      happy: {
        label: 'BIEN',
        title: 'Buen servicio',
        bg: active ? 'bg-emerald-950 ring-2 ring-emerald-400' : 'bg-slate-900/90 hover:bg-emerald-950/60 border border-emerald-800/60',
        stroke: '#34d399',
        fill: '#10b981',
        textClass: 'text-emerald-400',
      },
      neutral: {
        label: 'REGULAR',
        title: 'Servicio regular',
        bg: active ? 'bg-amber-950 ring-2 ring-amber-400' : 'bg-slate-900/90 hover:bg-amber-950/60 border border-amber-800/60',
        stroke: '#fbbf24',
        fill: '#f59e0b',
        textClass: 'text-amber-400',
      },
      angry: {
        label: 'A MEJORAR',
        title: 'A mejorar',
        bg: active ? 'bg-rose-950 ring-2 ring-rose-400' : 'bg-slate-900/90 hover:bg-rose-950/60 border border-rose-800/60',
        stroke: '#fb7185',
        fill: '#f43f5e',
        textClass: 'text-rose-400',
      },
    },
  };

  const currentTheme = isDarkTheme ? configs.dark : configs.light;
  const config = currentTheme[sentiment];

  return (
    <div className="inline-flex flex-col items-center gap-1 select-none">
      <div
        className={`inline-flex items-center justify-center rounded-xl p-1 transition-all duration-150 shadow-2xs ${config.bg} ${
          active ? 'scale-105' : 'hover:scale-102'
        }`}
      >
        <svg
          role="img"
          aria-label={config.title}
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke={config.stroke}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title>{config.title}</title>
          {/* Circular Face */}
          <circle cx="12" cy="12" r="10" />

          {sentiment === 'happy' && (
            <>
              {/* Happy Eyes */}
              <circle cx="8.5" cy="9.5" r="1.5" fill={config.fill} stroke="none" />
              <circle cx="15.5" cy="9.5" r="1.5" fill={config.fill} stroke="none" />
              {/* Friendly Smile */}
              <path d="M7.5 14c1.2 2 3.1 3 4.5 3s3.3-1 4.5-3" strokeWidth="2.3" />
            </>
          )}

          {sentiment === 'neutral' && (
            <>
              {/* Neutral Eyes */}
              <circle cx="8.5" cy="9.5" r="1.5" fill={config.fill} stroke="none" />
              <circle cx="15.5" cy="9.5" r="1.5" fill={config.fill} stroke="none" />
              {/* Straight Line Mouth */}
              <line x1="8" y1="15" x2="16" y2="15" strokeWidth="2.3" />
            </>
          )}

          {sentiment === 'angry' && (
            <>
              {/* Eyes */}
              <circle cx="8.5" cy="10" r="1.5" fill={config.fill} stroke="none" />
              <circle cx="15.5" cy="10" r="1.5" fill={config.fill} stroke="none" />
              {/* Serious / Sad Mouth */}
              <path d="M8 16c1.2-1.8 2.8-2.5 4-2.5s2.8.7 4 2.5" strokeWidth="2.3" />
            </>
          )}
        </svg>
      </div>

      {showLabel && (
        <span className={`text-[10px] font-black tracking-tight ${config.textClass}`}>
          {config.label}
        </span>
      )}
    </div>
  );
};
