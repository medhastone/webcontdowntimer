import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export function BrandLogo({
  size = 'md',
  className = '',
}: BrandLogoProps) {
  const iconDimensions =
    size === 'sm'
      ? 'w-8 h-8 rounded-xl'
      : size === 'lg'
      ? 'w-10 h-10 rounded-2xl'
      : 'w-9 h-9 rounded-xl';

  const svgDimensions =
    size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-9 h-9' : 'w-8 h-8';

  const titleSize =
    size === 'sm'
      ? 'text-[16px]'
      : size === 'lg'
      ? 'text-[20px]'
      : 'text-[17px] sm:text-[18px]';

  return (
    <span className={`inline-flex items-center gap-2.5 select-none group ${className}`}>
      {/* Precision Horology Chronograph Shield */}
      <span
        className={`relative ${iconDimensions} bg-gradient-to-br from-[#1E4635] via-[#153326] to-[#0D2118] border border-emerald-400/35 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-emerald-400/60 transition-all duration-200`}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          className={svgDimensions}
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="brandArcGrad"
              x1="14"
              y1="12"
              x2="52"
              y2="52"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="65%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>

          {/* Stopwatch Top Crown & Tactile Side Pusher */}
          <rect x="26.5" y="6" width="11" height="3.8" rx="1.9" fill="#A7F3D0" />
          <line
            x1="32"
            y1="9.8"
            x2="32"
            y2="13.5"
            stroke="#A7F3D0"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <line
            x1="46"
            y1="14.5"
            x2="49.2"
            y2="11.3"
            stroke="#FBBF24"
            strokeWidth="2.6"
            strokeLinecap="round"
          />

          {/* Recessed Dial Track */}
          <circle
            cx="32"
            cy="35.5"
            r="19.5"
            stroke="#FFFFFF"
            strokeOpacity="0.16"
            strokeWidth="3.8"
          />

          {/* Active 270° Swept Countdown Arc */}
          <path
            d="M 32 16 A 19.5 19.5 0 1 1 12.5 35.5"
            stroke="url(#brandArcGrad)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Precision Cardinal Dial Indices */}
          <line
            x1="32"
            y1="19.5"
            x2="32"
            y2="22.2"
            stroke="#E2E8F0"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <line
            x1="48"
            y1="35.5"
            x2="45.3"
            y2="35.5"
            stroke="#E2E8F0"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <line
            x1="32"
            y1="51.5"
            x2="32"
            y2="48.8"
            stroke="#E2E8F0"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <line
            x1="16"
            y1="35.5"
            x2="18.7"
            y2="35.5"
            stroke="#E2E8F0"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Precision Minute & Second Chronometer Hands */}
          <line
            x1="32"
            y1="35.5"
            x2="32"
            y2="23.5"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="32"
            y1="35.5"
            x2="41"
            y2="40.8"
            stroke="#6EE7B7"
            strokeWidth="2.6"
            strokeLinecap="round"
          />

          {/* Leading Countdown Pulse Indicator & Center Jewel */}
          <circle cx="12.5" cy="35.5" r="3.2" fill="#FBBF24" />
          <circle cx="32" cy="35.5" r="3.3" fill="#FFFFFF" />
          <circle cx="32" cy="35.5" r="1.5" fill="#153326" />
        </svg>
      </span>

      {/* Brand Wordmark */}
      <span
        className={`font-extrabold tracking-tight ${titleSize} text-[#1C2420] dark:text-white flex items-baseline leading-none`}
      >
        <span>WebCountDown</span>
        <span className="text-[#2D6A4F] dark:text-[#4ADE80]">Timer</span>
      </span>
    </span>
  );
}
