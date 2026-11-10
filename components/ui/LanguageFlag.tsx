'use client';

import React from 'react';
import type { SupportedLanguage } from '@/lib/i18n';

export const LANGUAGE_META: Record<
  SupportedLanguage,
  { code: string; country: string; emoji: string }
> = {
  English: { code: 'EN', country: 'United States', emoji: '🇺🇸' },
  Español: { code: 'ES', country: 'España', emoji: '🇪🇸' },
  Français: { code: 'FR', country: 'France', emoji: '🇫🇷' },
  Deutsch: { code: 'DE', country: 'Deutschland', emoji: '🇩🇪' },
  日本語: { code: 'JA', country: '日本', emoji: '🇯🇵' },
  Português: { code: 'PT', country: 'Portugal', emoji: '🇵🇹' },
};

export function LanguageFlag({
  lang,
  className = 'w-4 h-3',
}: {
  lang: SupportedLanguage | string;
  className?: string;
}) {
  const baseClass = `inline-flex relative overflow-hidden rounded-[2.5px] border border-black/15 dark:border-white/25 shadow-2xs shrink-0 select-none ${className}`;

  switch (lang) {
    case 'English':
      return (
        <span
          role="img"
          aria-label="English flag"
          className={`${baseClass} flex-col justify-between bg-white`}
        >
          <span className="w-full h-[14.5%] bg-[#B22234]" />
          <span className="w-full h-[14.5%] bg-[#B22234]" />
          <span className="w-full h-[14.5%] bg-[#B22234]" />
          <span className="w-full h-[14.5%] bg-[#B22234]" />
          <span className="absolute top-0 left-0 w-[46%] h-[56%] bg-[#3C3B6E] flex flex-wrap items-center justify-around p-[1px]">
            <span className="w-[1.5px] h-[1.5px] rounded-full bg-white/95" />
            <span className="w-[1.5px] h-[1.5px] rounded-full bg-white/95" />
            <span className="w-[1.5px] h-[1.5px] rounded-full bg-white/95" />
            <span className="w-[1.5px] h-[1.5px] rounded-full bg-white/95" />
          </span>
        </span>
      );

    case 'Español':
      return (
        <span
          role="img"
          aria-label="Spanish flag"
          className={`${baseClass} flex-col`}
        >
          <span className="w-full h-[25%] bg-[#AA151B]" />
          <span className="w-full h-[50%] bg-[#F1BF00] relative flex items-center">
            <span className="ml-[24%] w-[2.5px] h-[3.5px] rounded-[1px] bg-[#AA151B]/85" />
          </span>
          <span className="w-full h-[25%] bg-[#AA151B]" />
        </span>
      );

    case 'Français':
      return (
        <span
          role="img"
          aria-label="French flag"
          className={`${baseClass} flex-row`}
        >
          <span className="w-1/3 h-full bg-[#002395]" />
          <span className="w-1/3 h-full bg-white" />
          <span className="w-1/3 h-full bg-[#ED2939]" />
        </span>
      );

    case 'Deutsch':
      return (
        <span
          role="img"
          aria-label="German flag"
          className={`${baseClass} flex-col`}
        >
          <span className="w-full h-1/3 bg-[#111111]" />
          <span className="w-full h-1/3 bg-[#DD0000]" />
          <span className="w-full h-1/3 bg-[#FFCE00]" />
        </span>
      );

    case '日本語':
      return (
        <span
          role="img"
          aria-label="Japanese flag"
          className={`${baseClass} bg-white items-center justify-center`}
        >
          <span className="w-[5.5px] h-[5.5px] rounded-full bg-[#BC002D]" />
        </span>
      );

    case 'Português':
      return (
        <span
          role="img"
          aria-label="Portuguese flag"
          className={`${baseClass} flex-row`}
        >
          <span className="w-[40%] h-full bg-[#006600]" />
          <span className="w-[60%] h-full bg-[#FF0000]" />
          <span className="absolute left-[40%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-[4px] h-[4px] rounded-full bg-[#FFCC00] border border-[#AA151B]" />
        </span>
      );

    default:
      return null;
  }
}
