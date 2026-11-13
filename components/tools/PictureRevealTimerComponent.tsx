'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Eye,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  Clock,
  Settings,
  GraduationCap,
  Users,
  Gift,
  Brain,
  Sparkles,
  Smile,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';

type GridSizeOption = 4 | 5 | 6 | 8 | 10;
type RevealStyle = 'random' | 'sequential' | 'spiral' | 'center-outward';

interface SampleImage {
  id: string;
  label: string;
  url: string;
  hint: string;
}

const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'golden-retriever',
    label: 'Golden Retriever',
    url: '/images/reveal/golden-retriever.webp',
    hint: 'Friendly dog in nature',
  },
  {
    id: 'mountain-lake',
    label: 'Mountain Lake',
    url: '/images/reveal/mountain-lake.webp',
    hint: 'Alpine peaks & reflection',
  },
  {
    id: 'macaw-parrot',
    label: 'Macaw Parrot',
    url: '/images/reveal/macaw-parrot.webp',
    hint: 'Tropical blue & gold bird',
  },
  {
    id: 'tabby-cat',
    label: 'Tabby Cat',
    url: '/images/reveal/tabby-cat.webp',
    hint: 'Curious whiskered feline',
  },
  {
    id: 'sunflowers',
    label: 'Sunflowers',
    url: '/images/reveal/sunflowers.webp',
    hint: 'Bright yellow summer blooms',
  },
  {
    id: 'red-sports-car',
    label: 'Red Sports Car',
    url: '/images/reveal/red-sports-car.webp',
    hint: 'Classic red supercar',
  },
  {
    id: 'birthday-cake',
    label: 'Birthday Cake',
    url: '/images/reveal/birthday-cake.webp',
    hint: 'Celebration cake with candles',
  },
  {
    id: 'eiffel-tower',
    label: 'Eiffel Tower',
    url: '/images/reveal/eiffel-tower.webp',
    hint: 'Iconic Paris landmark',
  },
];

// Deterministic seeded shuffle so the random reveal order stays stable until Reset or Reshuffle
function createSeededOrder(totalTiles: number, seed: number): number[] {
  const arr = Array.from({ length: totalTiles }, (_, i) => i);
  let s = seed || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    const j = s % (i + 1);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

// Compute tile reveal order based on selected RevealStyle
function computeRevealOrder(gridSize: number, style: RevealStyle, seed: number): number[] {
  const total = gridSize * gridSize;
  if (style === 'sequential') {
    return Array.from({ length: total }, (_, i) => i);
  }
  if (style === 'center-outward') {
    const center = (gridSize - 1) / 2;
    const indices = Array.from({ length: total }, (_, i) => i);
    return indices.sort((a, b) => {
      const rA = Math.floor(a / gridSize);
      const cA = a % gridSize;
      const rB = Math.floor(b / gridSize);
      const cB = b % gridSize;
      const distA = Math.hypot(rA - center, cA - center);
      const distB = Math.hypot(rB - center, cB - center);
      return distA - distB || a - b;
    });
  }
  if (style === 'spiral') {
    const result: number[] = [];
    let top = 0;
    let bottom = gridSize - 1;
    let left = 0;
    let right = gridSize - 1;
    while (top <= bottom && left <= right) {
      for (let c = left; c <= right; c++) result.push(top * gridSize + c);
      top++;
      for (let r = top; r <= bottom; r++) result.push(r * gridSize + right);
      right--;
      if (top <= bottom) {
        for (let c = right; c >= left; c--) result.push(bottom * gridSize + c);
        bottom--;
      }
      if (left <= right) {
        for (let r = bottom; r >= top; r--) result.push(r * gridSize + left);
        left--;
      }
    }
    return result;
  }
  // Default: random reveal
  return createSeededOrder(total, seed);
}

// Initial preview tiles revealed in the 6x6 golden retriever demo state before pressing Start
// Matches the reference design where the dog's face in the center-right is partially visible in preview mode
const INITIAL_6X6_PREVIEW_REVEALED = new Set<number>([
  2, 3, 4, 5,
  8, 9, 10, 11,
  14, 15, 16, 17,
  21, 22, 23,
  27, 28,
  34, 35,
]);

export default function PictureRevealTimerComponent() {
  // Duration state (default 5 minutes = 300s matching the 5 min active pill)
  const [selectedPresetSec, setSelectedPresetSec] = useState<number | 'custom'>(300);
  const [customMinutes, setCustomMinutes] = useState<number>(5);
  const [totalSeconds, setTotalSeconds] = useState<number>(300);
  const [remainingMs, setRemainingMs] = useState<number>(300 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hasStartedOnce, setHasStartedOnce] = useState<boolean>(false);

  // Image state (processed 100% locally in browser)
  const [imageUrl, setImageUrl] = useState<string>(SAMPLE_IMAGES[0].url);
  const [imageLabel, setImageLabel] = useState<string>(SAMPLE_IMAGES[0].label);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(SAMPLE_IMAGES[0].id);
  const [isCustomUpload, setIsCustomUpload] = useState<boolean>(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  // Grid & Reveal settings
  const [gridSize, setGridSize] = useState<GridSizeOption>(6);
  const [revealStyle, setRevealStyle] = useState<RevealStyle>('random');
  const [randomSeed, setRandomSeed] = useState<number>(42);
  const [previewModeBeforeStart, setPreviewModeBeforeStart] = useState<boolean>(true);

  // Toggles
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Cleanup any blob URL on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  // Fullscreen listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Timer loop
  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    endTimeRef.current = performance.now() + remainingMs;

    const tick = (now: number) => {
      if (!endTimeRef.current) return;
      const left = Math.max(0, endTimeRef.current - now);
      setRemainingMs(left);

      if (left <= 0) {
        setIsRunning(false);
        setIsCompleted(true);
        if (soundEnabled) {
          playTimerSound('chime');
        }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, soundEnabled]);

  // Apply preset duration in seconds
  const applyDurationSeconds = useCallback((seconds: number, presetKey: number | 'custom') => {
    const clampedSec = Math.max(5, Math.min(7200, seconds));
    setIsRunning(false);
    setIsCompleted(false);
    setHasStartedOnce(false);
    setSelectedPresetSec(presetKey);
    if (clampedSec >= 60) {
      setCustomMinutes(Math.round(clampedSec / 60));
    }
    setTotalSeconds(clampedSec);
    setRemainingMs(clampedSec * 1000);
  }, []);

  const handleCustomMinutesChange = (val: number) => {
    const clamped = Math.max(1, Math.min(180, val));
    setIsRunning(false);
    setIsCompleted(false);
    setHasStartedOnce(false);
    setSelectedPresetSec('custom');
    setCustomMinutes(clamped);
    setTotalSeconds(clamped * 60);
    setRemainingMs(clamped * 60 * 1000);
  };

  const handleStartPause = () => {
    if (!imageUrl) {
      setUploadError('Please upload an image or pick a sample photo below before starting.');
      return;
    }
    if (isCompleted || remainingMs <= 0) {
      setRemainingMs(totalSeconds * 1000);
      setIsCompleted(false);
      setHasStartedOnce(true);
      setPreviewModeBeforeStart(false);
      setIsRunning(true);
      return;
    }
    if (!hasStartedOnce) {
      setHasStartedOnce(true);
      setPreviewModeBeforeStart(false);
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setHasStartedOnce(false);
    setRemainingMs(totalSeconds * 1000);
    setRandomSeed((prev) => (prev * 1103515245 + 12345) & 0x7fffffff);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && !isFullscreen) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        try {
          const orientation = screen.orientation as unknown as { lock?: (mode: string) => Promise<void> };
          if (orientation?.lock) await orientation.lock('landscape');
        } catch {
          // ignore
        }
        setIsFullscreen(true);
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
        try {
          const orientation = screen.orientation as unknown as { unlock?: () => void };
          if (orientation?.unlock) orientation.unlock();
        } catch {
          // ignore
        }
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  // Validate and process uploaded image locally in the browser
  const processLocalFile = (file: File) => {
    setUploadError(null);

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Unsupported file format. Please upload a JPG, PNG or WebP image.');
      return;
    }

    const maxBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxBytes) {
      setUploadError('File is too large. Maximum allowed file size is 5 MB.');
      return;
    }

    const nextObjectUrl = URL.createObjectURL(file);
    const probe = new window.Image();

    probe.onload = () => {
      if (probe.naturalWidth < 100 || probe.naturalHeight < 100) {
        URL.revokeObjectURL(nextObjectUrl);
        setUploadError('Image dimensions are too small. Please choose an image at least 100 × 100 px.');
        return;
      }
      if (probe.naturalWidth > 8000 || probe.naturalHeight > 8000) {
        URL.revokeObjectURL(nextObjectUrl);
        setUploadError('Image dimensions exceed 8000 × 8000 px. Please use a smaller image.');
        return;
      }

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      objectUrlRef.current = nextObjectUrl;

      setImageDimensions({ width: probe.naturalWidth, height: probe.naturalHeight });
      setImageUrl(nextObjectUrl);
      setImageLabel(file.name);
      setSelectedSampleId(null);
      setIsCustomUpload(true);
      setIsRunning(false);
      setIsCompleted(false);
      setHasStartedOnce(false);
      setPreviewModeBeforeStart(false);
      setRemainingMs(totalSeconds * 1000);
    };

    probe.onerror = () => {
      URL.revokeObjectURL(nextObjectUrl);
      setUploadError('Could not read the selected image file. Please try another photo.');
    };

    probe.src = nextObjectUrl;
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processLocalFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processLocalFile(file);
    }
  };

  const handleRemoveImage = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setIsRunning(false);
    setIsCompleted(false);
    setHasStartedOnce(false);
    setImageUrl('');
    setImageLabel('');
    setSelectedSampleId(null);
    setIsCustomUpload(false);
    setImageDimensions(null);
    setUploadError(null);
  };

  const handleSelectSample = (sample: SampleImage) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setUploadError(null);
    setImageUrl(sample.url);
    setImageLabel(sample.label);
    setSelectedSampleId(sample.id);
    setIsCustomUpload(false);
    setImageDimensions(null);
    setIsRunning(false);
    setIsCompleted(false);
    setHasStartedOnce(false);
    setRemainingMs(totalSeconds * 1000);
  };

  // Calculate revealed tiles
  const totalTiles = gridSize * gridSize;
  const totalMs = Math.max(1000, totalSeconds * 1000);
  const elapsedFraction = Math.min(1, Math.max(0, 1 - remainingMs / totalMs));

  const revealOrder = useMemo(
    () => computeRevealOrder(gridSize, revealStyle, randomSeed),
    [gridSize, revealStyle, randomSeed]
  );

  const revealedTileIndices = useMemo(() => {
    if (isCompleted || remainingMs <= 0) {
      return new Set<number>(Array.from({ length: totalTiles }, (_, i) => i));
    }

    // When idle before first start and preview mode is active, show a preview window so the user can see how tiles reveal the image
    if (!hasStartedOnce && previewModeBeforeStart && imageUrl) {
      if (gridSize === 6 && selectedSampleId === 'golden-retriever') {
        return INITIAL_6X6_PREVIEW_REVEALED;
      }
      // For other grid sizes or images in preview mode, show ~45% revealed from the chosen order
      const previewCount = Math.floor(totalTiles * 0.45);
      return new Set<number>(revealOrder.slice(0, previewCount));
    }

    const revealedCount = Math.floor(elapsedFraction * totalTiles);
    return new Set<number>(revealOrder.slice(0, revealedCount));
  }, [
    isCompleted,
    remainingMs,
    totalTiles,
    hasStartedOnce,
    previewModeBeforeStart,
    imageUrl,
    gridSize,
    selectedSampleId,
    revealOrder,
    elapsedFraction,
  ]);

  // Formatted countdown string
  const totalSecLeft = Math.ceil(remainingMs / 1000);
  const mins = Math.floor(totalSecLeft / 60);
  const secs = totalSecLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const revealedPercentage = Math.round((revealedTileIndices.size / totalTiles) * 100);

  return (
    <div className="space-y-10">
      {/* Hidden local file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Main Interactive Workspace Card */}
      <div className="rounded-3xl border border-[#E4DEC9] dark:border-slate-800 bg-[#FDFBF7] dark:bg-[#161B18] p-4 sm:p-6 lg:p-7 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT COLUMN (5 cols): Picture Reveal Grid Stage */}
          <div className="lg:col-span-5">
            <div
              ref={stageRef}
              className={`relative aspect-[4/3.6] w-full overflow-hidden rounded-2xl border-4 border-[#33383B] bg-[#282C2F] shadow-md select-none flex flex-col justify-between ${
                isFullscreen ? 'timer-fullscreen-stage aspect-auto border-0' : ''
              }`}
            >
              {isFullscreen && (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="fixed top-4 right-4 z-50 inline-flex items-center gap-1.5 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/20 px-4 py-2 text-xs font-bold text-white shadow-lg transition cursor-pointer"
                  aria-label="Exit Fullscreen"
                >
                  <Minimize2 className="h-4 w-4" />
                  <span>Exit Fullscreen</span>
                </button>
              )}
              {imageUrl ? (
                <>
                  {/* Underlying Image (Processed locally in browser) */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={imageLabel || 'Hidden picture reveal'}
                    width={800}
                    height={533}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {/* Tile Grid Overlay */}
                  <div
                    className="relative z-10 grid h-full w-full"
                    style={{
                      gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                      gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
                    }}
                  >
                    {Array.from({ length: totalTiles }, (_, index) => {
                      const isRevealed = revealedTileIndices.has(index);
                      return (
                        <div
                          key={index}
                          className={`border border-white/35 ${
                            reducedMotion ? '' : 'transition-opacity duration-500 ease-out'
                          } ${
                            isRevealed
                              ? 'opacity-0 pointer-events-none'
                              : 'opacity-100 bg-[#353A3E]'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* Subtle HUD Bar at Bottom of Canvas when running or previewing */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between gap-2 pointer-events-none">
                    <div className="pointer-events-auto inline-flex items-center gap-2 rounded-lg bg-black/70 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white shadow">
                      <Clock className="w-3.5 h-3.5 text-[#5CE1A6]" />
                      <span className={`tabular-nums tracking-wider ${isFullscreen ? 'text-xl sm:text-2xl' : 'text-sm'} font-bold`}>
                        {formattedTime}
                      </span>
                      {!isFullscreen && (
                        <>
                          <span className="text-white/60">•</span>
                          <span className="text-white/90 text-[11px]">
                            {hasStartedOnce
                              ? `${revealedPercentage}% revealed`
                              : previewModeBeforeStart
                              ? 'Preview Mode'
                              : 'Hidden (0%)'}
                          </span>
                        </>
                      )}
                    </div>

                    {!hasStartedOnce && !isFullscreen && (
                      <button
                        type="button"
                        onClick={() => setPreviewModeBeforeStart((prev) => !prev)}
                        className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg bg-black/70 hover:bg-black/85 backdrop-blur-md px-2.5 py-1.5 text-[11px] font-semibold text-white transition cursor-pointer shadow"
                        title="Toggle preview vs fully covered grid before starting"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-300" />
                        {previewModeBeforeStart ? 'Hide Preview' : 'Show Preview'}
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-white/80">
                  <ImageIcon className="w-12 h-12 text-white/40 mb-3" />
                  <p className="text-base font-bold text-white mb-1">No Image Selected</p>
                  <p className="text-xs text-white/65 max-w-xs mb-4">
                    Upload a photo from your device or choose one of the sample images below to begin the picture reveal countdown.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1F4E3B] hover:bg-[#183E2F] px-4 py-2 text-xs font-bold text-white transition cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    Upload Photo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (7 cols): Step 1 Upload, Step 2 Timer Settings, Step 3 Grid Settings & Controls */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            {/* 1. Upload an Image */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-[#1C242B] dark:text-white">
                  1. <span className="ml-1">Upload an Image</span>
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1F4E3B] dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Processed locally in your browser
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-stretch">
                {/* Dashed Dropzone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(true);
                  }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`sm:col-span-7 rounded-2xl border-2 border-dashed p-5 flex flex-col items-center justify-center text-center transition cursor-pointer ${
                    isDraggingOver
                      ? 'border-[#1F4E3B] dark:border-emerald-500 bg-[#EAF5F0] dark:bg-emerald-950/30'
                      : 'border-[#B8D8DF] dark:border-slate-700 bg-[#F1F8FA] dark:bg-slate-900/60 hover:bg-[#E7F3F7] dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800 border border-[#D3E6EC] dark:border-slate-700 flex items-center justify-center mb-2 shadow-xs">
                    <UploadCloud className="w-5 h-5 text-[#1F2D3A] dark:text-emerald-400" />
                  </div>
                  <p className="text-sm font-bold text-[#1C242B] dark:text-white">Click to upload an image</p>
                  <p className="text-xs text-[#606B74] dark:text-slate-400 mt-0.5">JPG, PNG or WebP (Max 5 MB)</p>
                  {imageDimensions && isCustomUpload && (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-white dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-[#1F4E3B] dark:text-emerald-400 border border-[#D4E6DD] dark:border-slate-700">
                      <CheckCircle2 className="w-3 h-3" />
                      {imageDimensions.width} × {imageDimensions.height} px
                    </span>
                  )}
                </div>

                {/* Right Thumbnail Preview & Change / Remove Buttons */}
                <div className="sm:col-span-5 flex flex-col justify-between space-y-2">
                  <div className="relative h-28 sm:h-full min-h-[104px] w-full overflow-hidden rounded-xl border border-[#DFD8C8] dark:border-slate-700 bg-[#EFECE4] dark:bg-slate-900">
                    {imageUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl}
                          alt={imageLabel || 'Current image preview'}
                          width={800}
                          height={533}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          aria-label="Remove image"
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-[#222] dark:text-slate-200 flex items-center justify-center shadow-sm transition cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center text-xs text-[#7D7669] dark:text-slate-400">
                        <ImageIcon className="w-5 h-5 mb-1 opacity-50" />
                        No image
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#B9D5C7] dark:border-emerald-800/60 bg-[#F2F9F5] dark:bg-emerald-950/30 hover:bg-[#E4F3EB] dark:hover:bg-emerald-950/50 px-2.5 py-1.5 text-xs font-bold text-[#1F4E3B] dark:text-emerald-400 transition cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      Change Image
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={!imageUrl}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#F0C7C7] dark:border-red-900/60 bg-[#FDF4F4] dark:bg-red-950/30 hover:bg-[#FBE5E5] dark:hover:bg-red-950/50 disabled:opacity-45 px-2.5 py-1.5 text-xs font-bold text-[#C93B3B] dark:text-red-400 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {uploadError && (
                <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 px-3 py-2 text-xs font-medium text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* 2. Timer Settings & 3. Grid Settings Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-1 border-t border-[#ECE6D8] dark:border-slate-800">
              {/* 2. Timer Settings (7 cols) */}
              <div className="md:col-span-7 space-y-3">
                <h2 className="text-sm font-bold text-[#1C242B] dark:text-white">
                  2. <span className="ml-1">Timer Settings</span>
                </h2>

                {/* Duration Preset Pills */}
                <div className="grid grid-cols-6 gap-1.5">
                  {[
                    { label: '30 sec', sec: 30 },
                    { label: '1 min', sec: 60 },
                    { label: '3 min', sec: 180 },
                    { label: '5 min', sec: 300 },
                    { label: '10 min', sec: 600 },
                  ].map((item) => {
                    const isActive = selectedPresetSec === item.sec;
                    return (
                      <button
                        key={item.sec}
                        type="button"
                        onClick={() => applyDurationSeconds(item.sec, item.sec)}
                        className={`py-2 px-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          isActive
                            ? 'bg-[#1F4E3B] text-white border-[#1F4E3B] shadow-xs'
                            : 'bg-white dark:bg-slate-900 text-[#222] dark:text-slate-200 border-[#E4DEC9] dark:border-slate-700 hover:border-[#1F4E3B]/40'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPresetSec('custom');
                      customInputRef.current?.focus();
                    }}
                    className={`py-2 px-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      selectedPresetSec === 'custom'
                        ? 'bg-[#1F4E3B] text-white border-[#1F4E3B] shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-[#222] dark:text-slate-200 border-[#E4DEC9] dark:border-slate-700 hover:border-[#1F4E3B]/40'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {/* Minutes Stepper Input */}
                <div className="flex items-center gap-3 pt-0.5">
                  <div className="relative flex items-center w-28 rounded-xl border border-[#DFD8C8] dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 shadow-2xs">
                    <input
                      ref={customInputRef}
                      type="number"
                      min={1}
                      max={180}
                      value={customMinutes}
                      onChange={(e) => handleCustomMinutesChange(parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-transparent text-base font-bold text-[#1A241E] dark:text-white focus:outline-none tabular-nums"
                      aria-label="Duration in minutes"
                    />
                    <div className="flex flex-col -mr-1">
                      <button
                        type="button"
                        onClick={() => handleCustomMinutesChange(customMinutes + 1)}
                        className="text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                        aria-label="Increase minutes"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCustomMinutesChange(Math.max(1, customMinutes - 1))}
                        className="text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                        aria-label="Decrease minutes"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-[#555] dark:text-slate-300">minutes</span>
                </div>
              </div>

              {/* 3. Grid Settings (5 cols) */}
              <div className="md:col-span-5 space-y-2.5">
                <h2 className="text-sm font-bold text-[#1C242B] dark:text-white">
                  3. <span className="ml-1">Grid Settings</span>
                </h2>

                <div>
                  <select
                    value={gridSize}
                    onChange={(e) => {
                      const nextSize = Number(e.target.value) as GridSizeOption;
                      setGridSize(nextSize);
                    }}
                    aria-label="Grid density"
                    className="w-full rounded-xl border border-[#DFD8C8] dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-[#1C242B] dark:text-white shadow-2xs focus:border-[#1F4E3B] focus:outline-none cursor-pointer"
                  >
                    <option value={4}>4 × 4 (16 tiles)</option>
                    <option value={5}>5 × 5 (25 tiles)</option>
                    <option value={6}>6 × 6 (36 tiles)</option>
                    <option value={8}>8 × 8 (64 tiles)</option>
                    <option value={10}>10 × 10 (100 tiles)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C242B] dark:text-slate-300 mb-1">
                    Reveal Style
                  </label>
                  <select
                    value={revealStyle}
                    onChange={(e) => setRevealStyle(e.target.value as RevealStyle)}
                    aria-label="Reveal style"
                    className="w-full rounded-xl border border-[#DFD8C8] dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-[#1C242B] dark:text-white shadow-2xs focus:border-[#1F4E3B] focus:outline-none cursor-pointer"
                  >
                    <option value="random">Random Reveal</option>
                    <option value="sequential">Sequential (Top to Bottom)</option>
                    <option value="spiral">Spiral (Outside In)</option>
                    <option value="center-outward">Center Outward</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons: Start | Pause | Reset */}
            <div className="grid grid-cols-12 gap-3 pt-1">
              <button
                type="button"
                onClick={handleStartPause}
                className="col-span-12 sm:col-span-5 py-3 rounded-xl bg-[#1F4E3B] hover:bg-[#183E2F] text-white font-bold text-base shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    {hasStartedOnce && remainingMs < totalSeconds * 1000 && !isCompleted
                      ? 'Resume'
                      : 'Start'}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsRunning(false)}
                disabled={!isRunning}
                className="col-span-6 sm:col-span-4 py-3 rounded-xl bg-[#F3EFE6] dark:bg-slate-800 hover:bg-[#E8E2D5] dark:hover:bg-slate-700 disabled:opacity-50 text-[#222] dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="col-span-6 sm:col-span-3 py-3 rounded-xl bg-[#F3EFE6] dark:bg-slate-800 hover:bg-[#E8E2D5] dark:hover:bg-slate-700 text-[#222] dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>

            {/* Bottom Toggles Bar: Sound Alert | Fullscreen | Reduced Motion */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs font-semibold text-[#444] dark:text-slate-300">
              {/* Sound Alert */}
              <div className="flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#1F4E3B] dark:text-emerald-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-stone-400" />
                )}
                <span>Sound Alert</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={soundEnabled}
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    soundEnabled ? 'bg-[#1F4E3B]' : 'bg-stone-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                      soundEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Fullscreen */}
              <div className="flex items-center gap-2">
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 text-[#1F4E3B] dark:text-emerald-400" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-[#1F4E3B] dark:text-emerald-400" />
                )}
                <span>Fullscreen</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isFullscreen}
                  onClick={toggleFullscreen}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    isFullscreen ? 'bg-[#1F4E3B]' : 'bg-stone-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                      isFullscreen ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#1F4E3B] dark:text-emerald-400" />
                <span>Reduced Motion</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={reducedMotion}
                  onClick={() => setReducedMotion((prev) => !prev)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    reducedMotion ? 'bg-[#1F4E3B]' : 'bg-stone-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                      reducedMotion ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Presets Section */}
      <section aria-labelledby="quick-presets-heading" className="space-y-3">
        <div>
          <h2
            id="quick-presets-heading"
            className="text-xl font-bold font-serif text-[#18221D] dark:text-white"
          >
            Quick Presets
          </h2>
          <p className="text-xs text-[#606A64] dark:text-slate-400">
            Start with a common time and grid setup.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              title: '30 Seconds',
              sub: 'Quick game',
              sec: 30,
              grid: 4 as GridSizeOption,
              key: 30 as const,
            },
            {
              title: '1 Minute',
              sub: 'Short reveal',
              sec: 60,
              grid: 5 as GridSizeOption,
              key: 60 as const,
            },
            {
              title: '3 Minutes',
              sub: 'Classroom activity',
              sec: 180,
              grid: 6 as GridSizeOption,
              key: 180 as const,
              featured: true,
            },
            {
              title: '5 Minutes',
              sub: 'Group game',
              sec: 300,
              grid: 6 as GridSizeOption,
              key: 300 as const,
            },
            {
              title: '10 Minutes',
              sub: 'Detailed reveal',
              sec: 600,
              grid: 8 as GridSizeOption,
              key: 600 as const,
            },
            {
              title: 'Custom',
              sub: 'Set your own time',
              sec: customMinutes * 60,
              grid: gridSize,
              key: 'custom' as const,
              isCustomCard: true,
            },
          ].map((preset) => {
            const isSelected = selectedPresetSec === preset.key;
            return (
              <button
                key={preset.title}
                type="button"
                onClick={() => {
                  if (preset.isCustomCard) {
                    setSelectedPresetSec('custom');
                    customInputRef.current?.focus();
                  } else {
                    setGridSize(preset.grid);
                    applyDurationSeconds(preset.sec, preset.key);
                  }
                }}
                className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition cursor-pointer ${
                  isSelected
                    ? 'border-[#1F4E3B] bg-[#F3FAF6] dark:bg-emerald-950/30 shadow-xs'
                    : 'border-[#E6E0D0] dark:border-slate-800 bg-white dark:bg-[#161B18] hover:border-[#1F4E3B]/40'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-[#FDF5EC] dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {preset.isCustomCard ? (
                    <Settings className="w-4 h-4 text-[#1F4E3B] dark:text-emerald-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-[#E06D2B]" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#1C242B] dark:text-white truncate">
                    {preset.title}
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      isSelected ? 'text-[#1F4E3B] dark:text-emerald-400 font-semibold' : 'text-[#6A726E] dark:text-slate-400'
                    }`}
                  >
                    {preset.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Try a Sample Image Section */}
      <section aria-labelledby="sample-images-heading" className="space-y-3">
        <div>
          <h2
            id="sample-images-heading"
            className="text-xl font-bold font-serif text-[#18221D] dark:text-white"
          >
            Try a Sample Image
          </h2>
          <p className="text-xs text-[#606A64] dark:text-slate-400">
            Use one of these sample images or upload your own.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {SAMPLE_IMAGES.map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                title={sample.label}
                className={`group relative aspect-[16/10] w-full overflow-hidden rounded-xl border-2 transition cursor-pointer ${
                  isSelected
                    ? 'border-[#1F4E3B] dark:border-emerald-400 ring-2 ring-[#1F4E3B]/25 shadow-sm'
                    : 'border-transparent hover:border-[#1F4E3B]/50'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sample.url}
                  alt={sample.label}
                  width={800}
                  height={533}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-2 py-1 text-left">
                  <span className="block truncate text-[10px] font-bold text-white">
                    {sample.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Popular Uses Section */}
      <section
        aria-labelledby="popular-uses-heading"
        className="rounded-3xl bg-[#F2F6F3] dark:bg-slate-900/40 border border-[#E0E8E2] dark:border-slate-800 p-5 sm:p-6 space-y-4"
      >
        <div>
          <h2
            id="popular-uses-heading"
            className="text-xl font-bold font-serif text-[#18221D] dark:text-white"
          >
            Popular Uses
          </h2>
          <p className="text-xs text-[#5B6660] dark:text-slate-400">
            A picture reveal timer is great for many fun and educational activities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            {
              title: 'Classroom Activities',
              desc: 'Perfect for teachers and students.',
              icon: GraduationCap,
            },
            {
              title: 'Guessing Games',
              desc: 'Reveal pictures and make it fun.',
              icon: Users,
            },
            {
              title: 'Party Surprises',
              desc: 'Great for birthdays and events.',
              icon: Gift,
            },
            {
              title: 'Quizzes and Trivia',
              desc: 'Test knowledge with picture clues.',
              icon: Brain,
            },
            {
              title: 'Product Reveals',
              desc: 'Show a product image gradually.',
              icon: Sparkles,
            },
            {
              title: 'Fun Group Activities',
              desc: 'Keep everyone engaged.',
              icon: Smile,
            },
          ].map((use) => {
            const Icon = use.icon;
            return (
              <div
                key={use.title}
                className="flex items-start gap-3 rounded-2xl border border-[#E2E8E4] dark:border-slate-800 bg-white dark:bg-[#161B18] p-3.5 shadow-2xs"
              >
                <div className="w-9 h-9 rounded-xl bg-[#EBF5EE] dark:bg-emerald-950/50 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#1F4E3B] dark:text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-[#1C242B] dark:text-white leading-snug">
                    {use.title}
                  </h3>
                  <p className="text-[11px] text-[#606A64] dark:text-slate-400 leading-snug mt-0.5">
                    {use.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
