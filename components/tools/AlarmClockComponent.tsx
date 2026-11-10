'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playTimerSound } from '@/lib/sound';
import { requestWakeLock } from '@/lib/wakelock';
import { Bell, BellOff, Volume2, Clock, AlarmClock, AlertCircle } from 'lucide-react';

export default function AlarmClockComponent() {
  const [alarmTimeStr, setAlarmTimeStr] = useState('07:00');
  const [alarmLabel, setAlarmLabel] = useState('Morning Wake Up');
  const [isAlarmArmed, setIsAlarmArmed] = useState(false);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [currentSecondsStr, setCurrentSecondsStr] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [snoozeMinutes, setSnoozeMinutes] = useState(10);

  const ringIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAlarm = useCallback(() => {
    setIsAlarmRinging(true);
    requestWakeLock();
    playTimerSound('bell', 0.9);
    ringIntervalRef.current = setInterval(() => {
      playTimerSound('bell', 0.9);
    }, 2500);
  }, []);

  // Live clock tick
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const timeNow = `${hours}:${minutes}`;

      setCurrentTimeStr(timeNow);
      setCurrentSecondsStr(seconds);
      setCurrentDateStr(
        now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
      );

      // Check if alarm triggered
      if (isAlarmArmed && !isAlarmRinging && timeNow === alarmTimeStr && now.getSeconds() === 0) {
        triggerAlarm();
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isAlarmArmed, isAlarmRinging, alarmTimeStr, triggerAlarm]);

  const stopAlarm = () => {
    if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    setIsAlarmRinging(false);
    setIsAlarmArmed(false);
  };

  const handleSnooze = () => {
    if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    setIsAlarmRinging(false);

    // Calculate snooze time
    const now = new Date();
    now.setMinutes(now.getMinutes() + snoozeMinutes);
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    setAlarmTimeStr(`${h}:${m}`);
    setIsAlarmArmed(true);
  };

  const handleTestSound = () => {
    playTimerSound('bell', 0.8);
  };

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm space-y-8">
      {/* Current Live Time Card */}
      <div className="text-center py-6 bg-neutral-50 dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1">
          {currentDateStr || 'Current Local Time'}
        </div>
        <div className="flex items-baseline justify-center select-none font-mono">
          <span className="text-6xl sm:text-8xl font-black tabular-nums tracking-tight text-neutral-950 dark:text-white">
            {currentTimeStr || '00:00'}
          </span>
          <span className="text-2xl sm:text-4xl font-semibold text-neutral-400 ml-2">
            :{currentSecondsStr || '00'}
          </span>
        </div>
      </div>

      {/* Alarm Ringing Banner */}
      {isAlarmRinging && (
        <div className="p-6 rounded-2xl bg-red-600 text-white text-center space-y-4 animate-bounce">
          <div className="text-2xl sm:text-3xl font-black uppercase tracking-wider">
            ALARM: {alarmLabel}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={stopAlarm}
              className="px-6 py-3 rounded-xl bg-white text-red-600 font-bold text-sm shadow-lg hover:bg-neutral-100"
            >
              Turn Off Alarm
            </button>
            <button
              onClick={handleSnooze}
              className="px-6 py-3 rounded-xl bg-red-800 text-white font-semibold text-sm hover:bg-red-900"
            >
              Snooze ({snoozeMinutes}m)
            </button>
          </div>
        </div>
      )}

      {/* Alarm Configuration */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-neutral-500 block mb-1">Set Alarm Time</label>
          <input
            type="time"
            value={alarmTimeStr}
            onChange={(e) => setAlarmTimeStr(e.target.value)}
            disabled={isAlarmArmed}
            className="w-full py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono text-base disabled:opacity-50"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-500 block mb-1">Alarm Label</label>
          <input
            type="text"
            value={alarmLabel}
            onChange={(e) => setAlarmLabel(e.target.value)}
            disabled={isAlarmArmed}
            placeholder="e.g. Wake Up, Standup Meeting"
            className="w-full py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm disabled:opacity-50"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-neutral-500 block mb-1">Snooze Duration</label>
          <select
            value={snoozeMinutes}
            onChange={(e) => setSnoozeMinutes(parseInt(e.target.value, 10))}
            disabled={isAlarmArmed}
            className="w-full py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm disabled:opacity-50"
          >
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={15}>15 minutes</option>
          </select>
        </div>
      </div>

      {/* Arm / Disarm Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <button
          onClick={() => setIsAlarmArmed(!isAlarmArmed)}
          className={`py-3.5 px-8 rounded-xl font-bold text-sm text-white shadow-sm flex items-center gap-2 transition-transform active:scale-95 ${
            isAlarmArmed
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90'
          }`}
        >
          {isAlarmArmed ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          <span>{isAlarmArmed ? 'Disarm Alarm' : `Set Alarm for ${alarmTimeStr}`}</span>
        </button>

        <button
          onClick={handleTestSound}
          className="py-3.5 px-5 rounded-xl font-medium text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center gap-2"
        >
          <Volume2 className="w-4 h-4 text-emerald-500" />
          <span>Test Wake Chime</span>
        </button>
      </div>
    </div>
  );
}
