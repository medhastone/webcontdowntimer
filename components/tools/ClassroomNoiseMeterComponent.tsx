'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Search,
  Globe,
  ExternalLink,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';
import {
  buildFallbackClassroomContext,
  type SearchGroundingResponse,
} from '@/lib/search-grounding-fallback';

const CLASSROOM_GROUNDING_TOPICS = [
  {
    id: 'transitions',
    label: 'Quiet Transition Strategies',
    query: 'Evidence-based quiet classroom transition strategies after loud group work',
  },
  {
    id: 'acoustics',
    label: 'ASHA & WHO Acoustic Standards',
    query: 'ASHA and WHO classroom decibel acoustics standards for student focus and speech intelligibility',
  },
  {
    id: 'sensory',
    label: 'Sensory & Neurodivergent Calming',
    query: 'Sensory regulation and calming classroom acoustic strategies for neurodivergent learners',
  },
  {
    id: 'stem-groups',
    label: 'Collaborative Group Voice Levels',
    query: 'Managing classroom voice levels during collaborative STEM and partner activities',
  },
];

export default function ClassroomNoiseMeterComponent() {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [relativeLevel, setRelativeLevel] = useState<number>(0); // 0 to 100 relative ambient level
  const [peakLevel, setPeakLevel] = useState<number>(0);
  const [threshold, setThreshold] = useState<number>(65); // Configurable relative threshold
  const [alertChime, setAlertChime] = useState<boolean>(false);
  const [exceedCount, setExceedCount] = useState<number>(0);
  const [permissionError, setPermissionError] = useState<string>('');

  // Search Grounding State
  const [searchQuery, setSearchQuery] = useState<string>(CLASSROOM_GROUNDING_TOPICS[0].query);
  const [activeTopicId, setActiveTopicId] = useState<string>(CLASSROOM_GROUNDING_TOPICS[0].id);
  const [groundingData, setGroundingData] = useState<SearchGroundingResponse | null>(null);
  const [isLoadingGrounding, setIsLoadingGrounding] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastAlertTimeRef = useRef<number>(0);

  const stopMonitoring = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsListening(false);
    setRelativeLevel(0);
  };

  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, []);

  const fetchGroundedContext = useCallback(
    async (queryToRun: string, currentLevel: number, currentThreshold: number, alerts: number) => {
      setIsLoadingGrounding(true);
      try {
        const res = await fetch('/api/search-grounding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tool: 'classroom-noise-meter',
            query: queryToRun,
            noiseLevel: currentLevel,
            threshold: currentThreshold,
            exceedCount: alerts,
          }),
        });
        if (res.ok) {
          const data: SearchGroundingResponse = await res.json();
          setGroundingData(data);
        } else {
          setGroundingData(
            buildFallbackClassroomContext(queryToRun, currentLevel, currentThreshold, alerts)
          );
        }
      } catch {
        setGroundingData(
          buildFallbackClassroomContext(queryToRun, currentLevel, currentThreshold, alerts)
        );
      } finally {
        setIsLoadingGrounding(false);
      }
    },
    []
  );

  // Initial search-grounded context fetch on mount
  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchGroundedContext(CLASSROOM_GROUNDING_TOPICS[0].query, 0, 65, 0);
    }, 0);
    return () => clearTimeout(timerId);
  }, [fetchGroundedContext]);

  const startMonitoring = async () => {
    setPermissionError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.82;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      setIsListening(true);

      const updateMeter = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(dataArray);

        let sumSquares = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const normalized = (dataArray[i] - 128) / 128;
          sumSquares += normalized * normalized;
        }
        const rms = Math.sqrt(sumSquares / dataArray.length);
        const scaled = Math.min(100, Math.max(0, Math.round(Math.pow(rms, 0.45) * 115)));

        setRelativeLevel(scaled);
        setPeakLevel((prev) => Math.max(prev, scaled));

        if (scaled >= threshold) {
          const now = Date.now();
          if (now - lastAlertTimeRef.current > 3500) {
            lastAlertTimeRef.current = now;
            setExceedCount((c) => c + 1);
            if (alertChime) {
              playTimerSound('warning');
            }
          }
        }

        rafRef.current = requestAnimationFrame(updateMeter);
      };

      rafRef.current = requestAnimationFrame(updateMeter);
    } catch {
      setPermissionError(
        'Microphone access was declined or is unavailable. Please grant browser microphone permission and click Start Monitoring again.'
      );
      setIsListening(false);
    }
  };

  const handleTopicSelect = (topic: (typeof CLASSROOM_GROUNDING_TOPICS)[number]) => {
    setActiveTopicId(topic.id);
    setSearchQuery(topic.query);
    fetchGroundedContext(topic.query, relativeLevel, threshold, exceedCount);
  };

  const handleCustomSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveTopicId('custom');
    fetchGroundedContext(searchQuery.trim(), relativeLevel, threshold, exceedCount);
  };

  const isLoud = isListening && relativeLevel >= threshold;
  const isWarning =
    isListening && relativeLevel >= threshold - 15 && relativeLevel < threshold;

  const statusText = !isListening
    ? 'MICROPHONE OFF (READY)'
    : isLoud
    ? 'TOO LOUD – PLEASE LOWER VOICES'
    : isWarning
    ? 'APPROACHING NOISE LIMIT'
    : 'QUIET & FOCUSED';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Live Ambient Level Visualizer */}
        <div className="lg:col-span-7 bg-[#0F172A] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-400">
                Relative Ambient Microphone Level (0–100 Scale)
              </span>
              <h2 className="text-xl font-extrabold text-white mt-0.5 flex items-center gap-2">
                {isLoud ? (
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                <span>{statusText}</span>
              </h2>
            </div>

            <div className="text-right font-mono">
              <div className="text-4xl sm:text-5xl font-black tabular-nums">
                {relativeLevel}
                <span className="text-lg text-slate-400 font-normal">/100</span>
              </div>
            </div>
          </div>

          {/* 20-Segment Visual Level Meter with Threshold Marker */}
          <div className="space-y-2">
            <div className="grid grid-cols-20 gap-1 h-16 p-2 bg-slate-900 rounded-2xl border border-slate-800">
              {Array.from({ length: 20 }, (_, i) => {
                const barValue = (i + 1) * 5;
                const active = isListening && relativeLevel >= barValue - 3;
                const isOverThreshold = barValue > threshold;
                const isNearThreshold = barValue > threshold - 15 && barValue <= threshold;

                const colorClass = isOverThreshold
                  ? 'bg-red-500'
                  : isNearThreshold
                  ? 'bg-amber-400'
                  : 'bg-emerald-500';

                return (
                  <div
                    key={i}
                    className={`rounded-md transition-all duration-75 ${
                      active ? colorClass : 'bg-slate-800/70'
                    }`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>0 (Silent)</span>
              <span>Limit: {threshold}/100</span>
              <span>100 (Max)</span>
            </div>
          </div>

          {/* Start / Stop Microphone Action */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            {!isListening ? (
              <button
                type="button"
                onClick={startMonitoring}
                className="h-12 px-6 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-md cursor-pointer"
              >
                <Mic className="w-5 h-5" />
                <span>Start Microphone Monitoring</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopMonitoring}
                className="h-12 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-md cursor-pointer"
              >
                <MicOff className="w-5 h-5" />
                <span>Stop Monitoring</span>
              </button>
            )}

            <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
              <span>Session Peak: {peakLevel}/100</span>
              <span>Threshold Alerts: {exceedCount}</span>
            </div>
          </div>

          {permissionError && (
            <div className="p-4 rounded-xl bg-red-950/70 border border-red-700/80 text-xs text-red-200 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{permissionError}</span>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Threshold Settings & Privacy / Calibration Notice */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            Noise Threshold &amp; Alert Settings
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Maximum Acceptable Level</span>
              <span className="font-mono text-[#2563EB]">{threshold} / 100</span>
            </div>
            <input
              type="range"
              min={20}
              max={95}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-[#2563EB] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Silent Exam (35)</span>
              <span>Partner Work (65)</span>
              <span>Group Activity (80)</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Play gentle chime when threshold exceeded
            </span>
            <button
              type="button"
              onClick={() => setAlertChime((prev) => !prev)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {alertChime ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#2563EB]" />
                  <span>Chime On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span>Visual Only</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
            <p>
              <strong>Privacy Guarantee:</strong> Audio is analyzed in real time strictly inside your browser using the Web Audio API. No audio is ever recorded, stored, or transmitted over the network.
            </p>
            <p>
              <strong>Measurement Note:</strong> Because consumer device microphones vary in hardware sensitivity, readings are displayed on a relative 0–100 ambient intensity scale rather than calibrated SPL decibels (dBA).
            </p>
          </div>
        </div>
      </div>

      {/* Live Search-Grounded Classroom Management & Acoustic Context Panel */}
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#2563EB] dark:text-blue-400">
              <Globe className="w-3.5 h-3.5" />
              <span>Live Search-Grounded Educator Context</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#2563EB]" />
              <span>Classroom Management Tips &amp; Acoustic Standards</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Retrieve up-to-date, search-grounded classroom management routines, acoustic standards, and transition cues tailored to your active noise threshold ({threshold}/100).
            </p>
          </div>

          {/* Search Grounding Query Input */}
          <form onSubmit={handleCustomSearchSubmit} className="flex items-center gap-2 w-full md:w-96">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search classroom management or acoustic tips..."
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={isLoadingGrounding}
              className="h-10 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-600 disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingGrounding ? 'animate-spin' : ''}`} />
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* Topic Quick-Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1">Quick Topics:</span>
          {CLASSROOM_GROUNDING_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => handleTopicSelect(topic)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                activeTopicId === topic.id
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400'
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>

        {/* Grounded Results Body */}
        {isLoadingGrounding && !groundingData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-32 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4"
              />
            ))}
          </div>
        ) : groundingData ? (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-slate-900 border border-blue-200/70 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {groundingData.summary}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {groundingData.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <span className="inline-block text-[10px] font-mono uppercase tracking-wider font-bold text-[#2563EB] dark:text-blue-400">
                      {item.tag}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Verified Grounding Sources */}
            {groundingData.sources && groundingData.sources.length > 0 && (
              <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">
                    Grounded Web Sources:
                  </span>
                  {groundingData.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition-colors"
                    >
                      <span className="truncate max-w-[220px]">{src.title}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                    </a>
                  ))}
                </div>

                <span className="text-[11px] font-mono text-slate-400">
                  {groundingData.groundedWith}
                </span>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
