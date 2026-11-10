'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Shuffle,
  Trophy,
  Grid,
  CheckCircle2,
} from 'lucide-react';
import { playTimerSound } from '@/lib/sound';
import { parseParticipantLines, shuffleArray } from '@/lib/calculators/time-calculators';

export type CommunityActivityVariant =
  | 'chess-clock'
  | 'quiz-timer'
  | 'classroom-scoreboard'
  | 'bingo-caller'
  | 'seating-chart-maker';

export default function CommunityActivityToolsComponent({
  variant,
}: {
  variant: CommunityActivityVariant;
}) {
  if (variant === 'chess-clock') return <ChessClockView />;
  if (variant === 'quiz-timer') return <QuizTimerView />;
  if (variant === 'classroom-scoreboard') return <ClassroomScoreboardView />;
  if (variant === 'bingo-caller') return <BingoCallerView />;
  return <SeatingChartMakerView />;
}

// ============================================================================
// 1. CHESS CLOCK (Two-player split clock with Fischer increment)
// ============================================================================
function ChessClockView() {
  const [baseMinutes, setBaseMinutes] = useState<number>(5);
  const [incrementSec, setIncrementSec] = useState<number>(3);
  const [whiteMs, setWhiteMs] = useState<number>(300000);
  const [blackMs, setBlackMs] = useState<number>(300000);
  const [activePlayer, setActivePlayer] = useState<'white' | 'black' | null>(null);
  const [whiteMoves, setWhiteMoves] = useState<number>(0);
  const [blackMoves, setBlackMoves] = useState<number>(0);

  useEffect(() => {
    if (!activePlayer) return;
    const interval = setInterval(() => {
      if (activePlayer === 'white') {
        setWhiteMs((prev) => {
          if (prev <= 100) {
            playTimerSound('bell');
            setActivePlayer(null);
            return 0;
          }
          return prev - 100;
        });
      } else {
        setBlackMs((prev) => {
          if (prev <= 100) {
            playTimerSound('bell');
            setActivePlayer(null);
            return 0;
          }
          return prev - 100;
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, [activePlayer]);

  const handleSwitchTurn = (pressedBy: 'white' | 'black') => {
    if (whiteMs <= 0 || blackMs <= 0) return;
    playTimerSound('count321');
    if (pressedBy === 'white') {
      if (activePlayer === 'white') {
        setWhiteMs((m) => m + incrementSec * 1000);
        setWhiteMoves((c) => c + 1);
      }
      setActivePlayer('black');
    } else {
      if (activePlayer === 'black') {
        setBlackMs((m) => m + incrementSec * 1000);
        setBlackMoves((c) => c + 1);
      }
      setActivePlayer('white');
    }
  };

  const handleReset = (mins = baseMinutes) => {
    setActivePlayer(null);
    setWhiteMs(mins * 60000);
    setBlackMs(mins * 60000);
    setWhiteMoves(0);
    setBlackMoves(0);
  };

  const fmt = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${tenths}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Player 1 (White) */}
        <button
          type="button"
          onClick={() => handleSwitchTurn('white')}
          className={`p-8 rounded-2xl border-2 text-center transition-all cursor-pointer ${
            activePlayer === 'white'
              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xl'
              : 'bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-widest opacity-80">
            Player 1 (White) · Moves: {whiteMoves}
          </div>
          <div className="text-5xl sm:text-6xl font-black font-mono tabular-nums my-4">
            {fmt(whiteMs)}
          </div>
          <div className="text-xs font-semibold">
            {activePlayer === 'white' ? 'Tap to End Turn (+' + incrementSec + 's)' : 'Tap to Start Opponent'}
          </div>
        </button>

        {/* Player 2 (Black) */}
        <button
          type="button"
          onClick={() => handleSwitchTurn('black')}
          className={`p-8 rounded-2xl border-2 text-center transition-all cursor-pointer ${
            activePlayer === 'black'
              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xl'
              : 'bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-widest opacity-80">
            Player 2 (Black) · Moves: {blackMoves}
          </div>
          <div className="text-5xl sm:text-6xl font-black font-mono tabular-nums my-4">
            {fmt(blackMs)}
          </div>
          <div className="text-xs font-semibold">
            {activePlayer === 'black' ? 'Tap to End Turn (+' + incrementSec + 's)' : 'Tap to Start Opponent'}
          </div>
        </button>
      </div>

      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: 'Bullet 1+0', m: 1, inc: 0 },
            { label: 'Blitz 3+2', m: 3, inc: 2 },
            { label: 'Blitz 5+3', m: 5, inc: 3 },
            { label: 'Rapid 10+0', m: 10, inc: 0 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setBaseMinutes(preset.m);
                setIncrementSec(preset.inc);
                handleReset(preset.m);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-slate-200 cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActivePlayer(null)}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold cursor-pointer"
          >
            Pause Clock
          </button>
          <button
            type="button"
            onClick={() => handleReset(baseMinutes)}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold cursor-pointer"
          >
            Reset Clocks
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. QUIZ TIMER (Per-question rapid countdown with auto-advance)
// ============================================================================
function QuizTimerView() {
  const [secPerQuestion, setSecPerQuestion] = useState<number>(30);
  const [totalQuestions, setTotalQuestions] = useState<number>(10);
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [remainingSec, setRemainingSec] = useState<number>(30);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          playTimerSound('bell');
          if (autoAdvance && currentQuestion < totalQuestions) {
            setCurrentQuestion((q) => q + 1);
            return secPerQuestion;
          }
          setIsRunning(false);
          return 0;
        }
        if (prev <= 4) playTimerSound('count321');
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, autoAdvance, currentQuestion, totalQuestions, secPerQuestion]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 bg-[#0F172A] text-white rounded-2xl p-8 text-center space-y-6">
        <div className="text-xs font-bold uppercase tracking-widest text-blue-400">
          Question {currentQuestion} of {totalQuestions}
        </div>
        <div className="text-7xl font-black font-mono tabular-nums">{remainingSec}s</div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setIsRunning((prev) => !prev)}
            className="h-12 px-6 rounded-xl bg-[#2563EB] text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Pause (Buzz-In)' : 'Start Question'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentQuestion((q) => Math.min(totalQuestions, q + 1));
              setRemainingSec(secPerQuestion);
            }}
            className="h-12 px-5 rounded-xl bg-slate-800 text-white font-semibold text-sm cursor-pointer"
          >
            Next Question →
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRunning(false);
              setCurrentQuestion(1);
              setRemainingSec(secPerQuestion);
            }}
            className="h-12 px-4 rounded-xl bg-slate-800 text-slate-300 text-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-bold">Quiz Settings</h3>
        <div>
          <label className="block text-xs font-bold mb-1">Seconds per Question</label>
          <input
            type="number"
            min={5}
            max={300}
            value={secPerQuestion}
            onChange={(e) => {
              const v = Math.max(5, Number(e.target.value) || 30);
              setSecPerQuestion(v);
              if (!isRunning) setRemainingSec(v);
            }}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1">Total Questions</label>
          <input
            type="number"
            min={1}
            max={100}
            value={totalQuestions}
            onChange={(e) => setTotalQuestions(Math.max(1, Number(e.target.value) || 10))}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
          <input
            type="checkbox"
            checked={autoAdvance}
            onChange={(e) => setAutoAdvance(e.target.checked)}
          />
          <span>Auto-advance to next question when timer hits 0</span>
        </label>
      </div>
    </div>
  );
}

// ============================================================================
// 3. CLASSROOM SCOREBOARD (Multi-team points & round timer)
// ============================================================================
function ClassroomScoreboardView() {
  const [teams, setTeams] = useState([
    { id: 't1', name: 'Team Alpha', score: 0 },
    { id: 't2', name: 'Team Beta', score: 0 },
    { id: 't3', name: 'Team Gamma', score: 0 },
    { id: 't4', name: 'Team Delta', score: 0 },
  ]);

  const adjustScore = (id: string, delta: number) => {
    playTimerSound('count321');
    setTeams((prev) =>
      prev.map((t) => (t.id === id ? { ...t, score: t.score + delta } : t))
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 text-center space-y-4 shadow-2xs"
          >
            <input
              type="text"
              value={team.name}
              onChange={(e) =>
                setTeams((prev) =>
                  prev.map((t) => (t.id === team.id ? { ...t, name: e.target.value } : t))
                )
              }
              className="w-full text-center text-base font-extrabold bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#2563EB] focus:outline-hidden"
            />
            <div className="text-5xl font-black font-mono tabular-nums text-[#2563EB]">
              {team.score}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => adjustScore(team.id, -1)}
                className="h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center justify-center cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" /> 1
              </button>
              <button
                type="button"
                onClick={() => adjustScore(team.id, 1)}
                className="h-9 rounded-xl bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> 1
              </button>
              <button
                type="button"
                onClick={() => adjustScore(team.id, 5)}
                className="h-9 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center cursor-pointer"
              >
                +5
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })))}
          className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Scores</span>
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 4. BINGO CALLER (1–75 B-I-N-G-O caller with master board)
// ============================================================================
function BingoCallerView() {
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);

  const getLetter = (num: number) => {
    if (num <= 15) return 'B';
    if (num <= 30) return 'I';
    if (num <= 45) return 'N';
    if (num <= 60) return 'G';
    return 'O';
  };

  const handleDrawNext = () => {
    if (calledNumbers.length >= 75) return;
    const remaining: number[] = [];
    for (let i = 1; i <= 75; i++) {
      if (!calledNumbers.includes(i)) remaining.push(i);
    }
    const next = remaining[Math.floor(Math.random() * remaining.length)];
    playTimerSound('marimba');
    setCalledNumbers((prev) => [next, ...prev]);
  };

  const currentCall = calledNumbers[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 bg-[#0F172A] text-white rounded-2xl p-6 text-center space-y-5">
        <div className="text-xs font-bold uppercase tracking-widest text-blue-400">
          Current Bingo Call ({calledNumbers.length} / 75 Drawn)
        </div>
        <div className="text-6xl font-black font-mono tabular-nums">
          {currentCall ? `${getLetter(currentCall)}-${currentCall}` : 'READY'}
        </div>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={handleDrawNext}
            disabled={calledNumbers.length >= 75}
            className="h-12 px-6 rounded-xl bg-[#2563EB] hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            <span>Draw Next Ball</span>
          </button>
          <button
            type="button"
            onClick={() => setCalledNumbers([])}
            className="h-12 px-4 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold cursor-pointer"
          >
            Reset Board
          </button>
        </div>
      </div>

      <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
          <span>1–75 Master Verification Grid</span>
        </h3>
        <div className="grid grid-cols-15 gap-1 text-center font-mono text-xs">
          {Array.from({ length: 75 }, (_, i) => i + 1).map((n) => {
            const isCalled = calledNumbers.includes(n);
            return (
              <div
                key={n}
                className={`py-1.5 rounded-md font-bold ${
                  isCalled
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {n}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. SEATING CHART MAKER (Randomized classroom grid layout)
// ============================================================================
function SeatingChartMakerView() {
  const [rawNames, setRawNames] = useState<string>(
    [
      'Alex',
      'Bianca',
      'Carlos',
      'Diana',
      'Elena',
      'Farhan',
      'Grace',
      'Hugo',
      'Iris',
      'Jonah',
      'Kira',
      'Leo',
    ].join('\n')
  );
  const [columns, setColumns] = useState<number>(4);
  const [seed, setSeed] = useState<number>(0);

  const students = parseParticipantLines(rawNames, true);
  const seated = React.useMemo(() => {
    void seed;
    return shuffleArray(students);
  }, [students, seed]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-4 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <h3 className="text-sm font-bold">Student / Attendee List ({students.length})</h3>
        <textarea
          rows={9}
          value={rawNames}
          onChange={(e) => setRawNames(e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold">Desks per Row (Columns):</span>
          <input
            type="number"
            min={2}
            max={8}
            value={columns}
            onChange={(e) => setColumns(Math.max(2, Math.min(8, Number(e.target.value) || 4)))}
            className="w-20 h-9 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-center"
          />
        </div>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="w-full h-10 rounded-xl bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          <Shuffle className="w-4 h-4" />
          <span>Randomize Seating Chart</span>
        </button>
      </div>

      <div className="lg:col-span-8 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="w-full py-2 rounded-xl bg-slate-900 text-white text-center text-xs font-bold uppercase tracking-widest">
          Front of Room / Whiteboard / Stage
        </div>
        <div
          className="grid gap-3 pt-2"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {seated.map((student, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center"
            >
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1">
                <Grid className="w-3 h-3" />
                <span>Desk #{idx + 1}</span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">
                {student}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
