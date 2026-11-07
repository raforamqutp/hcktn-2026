import React from 'react';
import { SentimentScore } from '../../types';

interface RatingFaceIconProps {
  sentiment: SentimentScore;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  showLabel?: boolean;
}

const PIXEL_CIRCLE = [
  'M6 1H14V2H16V3H17V4H18V6H19V14H18V16H17V17H16V18H14V19H6V18H4V17H3V16H2V14H1V6H2V4H3V3H4V2H6V1Z',
  'M6 2H14V3H16V4H17V6H18V14H17V16H16V17H14V18H6V17H4V16H3V14H2V6H3V4H4V3H6V2Z',
];

export const RatingFaceIcon: React.FC<RatingFaceIconProps> = ({
  sentiment,
  size = 'md',
  active = false,
  showLabel = false,
}) => {
  const dimensions = size === 'sm' ? 34 : size === 'lg' ? 54 : 42;

  const config = {
    happy: {
      label: 'FELIZ',
      title: 'Feliz',
      color: '#22FF66',
      innerFill: 'rgba(16, 78, 38, 0.55)',
      glow: active
        ? 'drop-shadow(0 0 8px rgba(34, 255, 102, 0.9))'
        : 'drop-shadow(0 0 5px rgba(34, 255, 102, 0.55))',
      ringClass: active
        ? 'ring-1 ring-emerald-400/80 bg-[#0c1410]'
        : 'bg-[#0b0e14]/90 hover:bg-[#0c1410]',
      textClass: 'text-[#34FF74]',
    },
    neutral: {
      label: 'NEUTRAL',
      title: 'Neutral',
      color: '#FFC425',
      innerFill: 'rgba(82, 58, 10, 0.55)',
      glow: active
        ? 'drop-shadow(0 0 8px rgba(255, 196, 37, 0.9))'
        : 'drop-shadow(0 0 5px rgba(255, 196, 37, 0.55))',
      ringClass: active
        ? 'ring-1 ring-amber-400/80 bg-[#16120a]'
        : 'bg-[#0b0e14]/90 hover:bg-[#16120a]',
      textClass: 'text-[#FFC425]',
    },
    angry: {
      label: 'ENOJADO',
      title: 'Enojado',
      color: '#FF2E4C',
      innerFill: 'rgba(88, 14, 26, 0.55)',
      glow: active
        ? 'drop-shadow(0 0 8px rgba(255, 46, 76, 0.9))'
        : 'drop-shadow(0 0 5px rgba(255, 46, 76, 0.55))',
      ringClass: active
        ? 'ring-1 ring-rose-500/80 bg-[#180b0e]'
        : 'bg-[#0b0e14]/90 hover:bg-[#180b0e]',
      textClass: 'text-[#FF3B56]',
    },
  }[sentiment];

  return (
    <div className="inline-flex flex-col items-center gap-1 select-none">
      <div
        className={`dark-surface inline-flex items-center justify-center rounded-2xl p-1.5 transition-all duration-150 ${config.ringClass} ${
          active ? 'scale-105' : 'opacity-85 hover:opacity-100'
        }`}
      >
        <svg
          role="img"
          aria-label={config.title}
          width={dimensions}
          height={dimensions}
          viewBox="0 0 20 20"
          fill="none"
          shapeRendering="crispEdges"
          style={{ filter: config.glow }}
        >
          <title>{config.title}</title>
          <path d={PIXEL_CIRCLE[1]} fill={config.innerFill} />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={`${PIXEL_CIRCLE[0]} ${PIXEL_CIRCLE[1]}`}
            fill={config.color}
          />

          {sentiment === 'happy' && (
            <g fill={config.color}>
              <rect x="6" y="7" width="2" height="1" />
              <rect x="5" y="8" width="1" height="2" />
              <rect x="8" y="8" width="1" height="2" />

              <rect x="12" y="7" width="2" height="1" />
              <rect x="11" y="8" width="1" height="2" />
              <rect x="14" y="8" width="1" height="2" />

              <rect x="6" y="12" width="8" height="1" />
              <rect x="6" y="13" width="1" height="1" />
              <rect x="13" y="13" width="1" height="1" />
              <rect x="7" y="14" width="1" height="1" />
              <rect x="12" y="14" width="1" height="1" />
              <rect x="8" y="15" width="4" height="1" />
            </g>
          )}

          {sentiment === 'neutral' && (
            <g fill={config.color}>
              <rect x="7" y="7" width="1" height="1" />
              <rect x="6" y="8" width="3" height="2" />

              <rect x="12" y="7" width="1" height="1" />
              <rect x="11" y="8" width="3" height="2" />

              <rect x="6" y="13" width="8" height="1" />
            </g>
          )}

          {sentiment === 'angry' && (
            <g fill={config.color}>
              <rect x="5" y="6" width="1" height="1" />
              <rect x="6" y="7" width="2" height="1" />
              <rect x="8" y="8" width="1" height="1" />

              <rect x="14" y="6" width="1" height="1" />
              <rect x="12" y="7" width="2" height="1" />
              <rect x="11" y="8" width="1" height="1" />

              <rect x="6" y="9" width="2" height="2" />
              <rect x="12" y="9" width="2" height="2" />

              <rect x="8" y="13" width="4" height="1" />
              <rect x="7" y="14" width="1" height="1" />
              <rect x="12" y="14" width="1" height="1" />
              <rect x="6" y="15" width="1" height="1" />
              <rect x="13" y="15" width="1" height="1" />
            </g>
          )}
        </svg>
      </div>
      {showLabel && (
        <span className={`font-mono text-[9px] font-bold tracking-widest ${config.textClass}`}>
          {config.label}
        </span>
      )}
    </div>
  );
};
