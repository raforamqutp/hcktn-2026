import React from 'react';

interface VecinosBrandLogoProps {
  isEmergency?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VecinosBrandLogo: React.FC<VecinosBrandLogoProps> = ({
  isEmergency = false,
  size = 'md',
  className = '',
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const containerSize = isSm
    ? 'h-9 w-9 rounded-xl'
    : isLg
    ? 'h-12 w-12 rounded-2xl'
    : 'h-10 w-10 sm:h-11 sm:w-11 rounded-[14px]';

  const svgSize = isSm ? 'h-5 w-5' : isLg ? 'h-7 w-7' : 'h-6 w-6';

  return (
    <div
      className={`relative flex items-center justify-center text-white shadow-md transition-all duration-200 group-hover:scale-105 shrink-0 ${containerSize} ${
        isEmergency
          ? 'bg-gradient-to-br from-rose-500 via-red-600 to-red-800 shadow-red-900/30 ring-1 ring-white/25'
          : 'bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 shadow-emerald-900/25 ring-1 ring-white/30'
      } ${className}`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none ${
          isSm ? 'rounded-t-xl' : 'rounded-t-[14px]'
        }`}
      />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`${svgSize} text-white drop-shadow-xs`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Techo de la casa */}
        <path
          d="M3 10.2L12 3L21 10.2"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Cuerpo de la casa */}
        <path
          d="M6.5 10.8V17.2C6.5 19.3 8.2 21 10.3 21H13.7C15.8 21 17.5 19.3 17.5 17.2V10.8"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* Pin de ubicación / Corazón comunitario */}
        <path
          d="M9.2 13.8L12 17.2L14.8 13.8"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="8.6" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
};
