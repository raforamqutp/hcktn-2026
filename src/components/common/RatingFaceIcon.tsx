import React from 'react';
import { SentimentScore } from '../../types';

interface RatingFaceIconProps {
  sentiment: SentimentScore;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  showLabel?: boolean;
}

export const RatingFaceIcon: React.FC<RatingFaceIconProps> = ({
  sentiment,
  size = 'md',
  active = false,
  showLabel = false,
}) => {
  const dimensions = size === 'sm' ? 32 : size === 'lg' ? 56 : 42;

  const config = {
    happy: {
      label: 'FELIZ',
      title: 'Calificación Feliz',
      color: '#22C55E',
      bgFill: 'rgba(34, 197, 94, 0.14)',
      glow: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.75))',
      borderClass: active ? 'ring-2 ring-emerald-400 bg-slate-950' : 'bg-slate-900/95',
      textClass: 'text-emerald-400',
    },
    neutral: {
      label: 'NEUTRAL',
      title: 'Calificación Neutral',
      color: '#EAB308',
      bgFill: 'rgba(234, 179, 8, 0.14)',
      glow: 'drop-shadow(0 0 8px rgba(234, 179, 8, 0.75))',
      borderClass: active ? 'ring-2 ring-amber-400 bg-slate-950' : 'bg-slate-900/95',
      textClass: 'text-amber-400',
    },
    angry: {
      label: 'ENOJADO',
      title: 'Calificación Enojado',
      color: '#EF4444',
      bgFill: 'rgba(239, 68, 68, 0.14)',
      glow: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.75))',
      borderClass: active ? 'ring-2 ring-red-500 bg-slate-950' : 'bg-slate-900/95',
      textClass: 'text-red-400',
    },
  }[sentiment];

  return (
    <div className="inline-flex flex-col items-center gap-1 select-none">
      <div
        className={`dark-surface inline-flex items-center justify-center rounded-xl p-1.5 transition-transform duration-150 ${config.borderClass} ${
          active ? 'scale-105' : 'opacity-90 hover:opacity-100 hover:scale-105'
        }`}
      >
        <svg
          role="img"
          aria-label={config.title}
          width={dimensions}
          height={dimensions}
          viewBox="0 0 24 24"
          fill="none"
          style={{ filter: config.glow }}
        >
          <title>{config.title}</title>
          <circle
            cx="12"
            cy="12"
            r="9.5"
            fill={config.bgFill}
            stroke={config.color}
            strokeWidth="2.2"
          />
          {sentiment === 'happy' && (
            <>
              <path
                d="M7.5 10.2C8 8.8 9.8 8.8 10.3 10.2"
                stroke={config.color}
                strokeWidth="2.2"
                strokeLinecap="square"
              />
              <path
                d="M13.7 10.2C14.2 8.8 16 8.8 16.5 10.2"
                stroke={config.color}
                strokeWidth="2.2"
                strokeLinecap="square"
              />
              <path
                d="M8 13.8H16C15.6 16.5 13.8 17.5 12 17.5C10.2 17.5 8.4 16.5 8 13.8Z"
                fill={config.bgFill}
                stroke={config.color}
                strokeWidth="2"
                strokeLinejoin="miter"
              />
            </>
          )}
          {sentiment === 'neutral' && (
            <>
              <rect x="7.8" y="8.5" width="2.4" height="2.6" fill={config.color} />
              <rect x="13.8" y="8.5" width="2.4" height="2.6" fill={config.color} />
              <line
                x1="8"
                y1="15.2"
                x2="16"
                y2="15.2"
                stroke={config.color}
                strokeWidth="2.2"
                strokeLinecap="square"
              />
            </>
          )}
          {sentiment === 'angry' && (
            <>
              <path d="M7.2 8.2L10.5 9.6" stroke={config.color} strokeWidth="2" strokeLinecap="square" />
              <path d="M16.8 8.2L13.5 9.6" stroke={config.color} strokeWidth="2" strokeLinecap="square" />
              <rect x="7.8" y="9.8" width="2.2" height="2.2" fill={config.color} />
              <rect x="14.0" y="9.8" width="2.2" height="2.2" fill={config.color} />
              <path
                d="M8.2 16.8C9.2 14.6 14.8 14.6 15.8 16.8"
                stroke={config.color}
                strokeWidth="2.2"
                strokeLinecap="square"
              />
            </>
          )}
        </svg>
      </div>
      {showLabel && (
        <span className={`font-mono text-[10px] font-bold tracking-wider ${config.textClass}`}>
          {config.label}
        </span>
      )}
    </div>
  );
};
