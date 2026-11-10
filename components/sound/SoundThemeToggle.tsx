'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Bell,
  Cpu,
  Feather,
  Play,
  Check,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useSoundTheme } from './SoundThemeProvider';
import { SoundTheme } from '@/lib/sound';

export default function SoundThemeToggle({ compact = false }: { compact?: boolean }) {
  const {
    soundTheme,
    setSoundTheme,
    isMuted,
    toggleMute,
    volume,
    setVolume,
    previewSound,
    soundThemes,
    currentThemeConfig,
  } = useSoundTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [playingThemeId, setPlayingThemeId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handlePreview = (themeId: SoundTheme, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingThemeId(themeId);
    previewSound(themeId, 'bell');
    setTimeout(() => {
      setPlayingThemeId(null);
    }, 1200);
  };

  const getThemeIcon = (iconName: string) => {
    switch (iconName) {
      case 'cpu':
        return <Cpu className="w-4 h-4 text-sky-500" />;
      case 'feather':
        return <Feather className="w-4 h-4 text-emerald-500" />;
      case 'bell':
      default:
        return <Bell className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
          isOpen
            ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 border-blue-200 dark:border-blue-800'
            : isMuted
            ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800'
            : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
        title={`Sound theme: ${currentThemeConfig.label} (${isMuted ? 'Muted' : 'Enabled'})`}
        aria-label="Timer sound settings"
        aria-expanded={isOpen}
      >
        {isMuted ? (
          <VolumeX className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
        )}

        {!compact && (
          <span className="hidden sm:inline-block font-semibold">
            {currentThemeConfig.label}
          </span>
        )}

        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#2563EB]' : ''
          }`}
        />
      </button>

      {/* Settings Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-88 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-1">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Timer Sound Themes
              </span>
            </div>

            {/* Quick Mute Toggle */}
            <button
              type="button"
              onClick={toggleMute}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                isMuted
                  ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3 h-3" />
                  <span>Unmute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3 h-3" />
                  <span>Mute</span>
                </>
              )}
            </button>
          </div>

          {/* Theme Choices */}
          <div className="py-2.5 space-y-1.5">
            <div className="text-[11px] font-medium text-slate-400 px-1">
              Select Sound Profile:
            </div>
            {soundThemes.map((theme) => {
              const isSelected = soundTheme === theme.id;
              const isPlaying = playingThemeId === theme.id;

              return (
                <div
                  key={theme.id}
                  onClick={() => setSoundTheme(theme.id)}
                  className={`group relative flex items-start justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-[#2563EB]/40 dark:border-blue-500/40 shadow-xs'
                      : 'border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start gap-2.5 pr-2">
                    <div
                      className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-blue-100 dark:bg-blue-900/60'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    >
                      {getThemeIcon(theme.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-bold ${
                            isSelected
                              ? 'text-[#2563EB] dark:text-blue-400'
                              : 'text-slate-800 dark:text-slate-100'
                          }`}
                        >
                          {theme.label}
                        </span>
                        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {theme.tagline}
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                        {theme.description}
                      </p>
                    </div>
                  </div>

                  {/* Audition Button */}
                  <button
                    type="button"
                    onClick={(e) => handlePreview(theme.id, e)}
                    className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-blue-600 text-white border-blue-600 animate-pulse'
                        : isSelected
                        ? 'bg-white dark:bg-slate-900 text-[#2563EB] dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                    title={`Audition ${theme.label} sound`}
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>Test</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Volume Slider Section */}
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              <span>Master Volume</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <VolumeX className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                aria-label="Volume slider"
              />
              <Volume2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-2 text-[10px] text-center text-slate-400 dark:text-slate-500">
            Automatically applies across all 47 timer tools &amp; persists in your browser.
          </div>
        </div>
      )}
    </div>
  );
}
