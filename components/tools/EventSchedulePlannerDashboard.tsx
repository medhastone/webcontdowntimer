'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Globe,
  MapPin,
  Users,
  Plus,
  X,
  Pencil,
  MoreVertical,
  GripVertical,
  Share2,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Settings,
  Download,
  ChevronDown,
  FileText,
  List,
  Tv,
  Presentation,
  Monitor,
  MessageCircle,
  Coffee,
  HelpCircle,
  ArrowLeftRight,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';

interface AgendaSession {
  id: string;
  title: string;
  subtitle: string;
  durationMin: number;
  iconType: 'welcome' | 'keynote' | 'demo' | 'panel' | 'break' | 'qa';
}

interface ParticipantCity {
  id: string;
  city: string;
  tzLabel: string;
  flag: string;
  workHours: string;
}

const INITIAL_SESSIONS: AgendaSession[] = [
  {
    id: 'sess-1',
    title: 'Welcome',
    subtitle: 'Opening remarks and event overview',
    durationMin: 15,
    iconType: 'welcome',
  },
  {
    id: 'sess-2',
    title: 'Opening Keynote',
    subtitle: 'The future of global product development',
    durationMin: 30,
    iconType: 'keynote',
  },
  {
    id: 'sess-3',
    title: 'Product Demonstration',
    subtitle: 'Live demo of key features',
    durationMin: 30,
    iconType: 'demo',
  },
  {
    id: 'sess-4',
    title: 'Panel Discussion',
    subtitle: 'Industry experts and customer stories',
    durationMin: 30,
    iconType: 'panel',
  },
  {
    id: 'sess-5',
    title: 'Break',
    subtitle: 'Networking and refreshments',
    durationMin: 15,
    iconType: 'break',
  },
  {
    id: 'sess-6',
    title: 'Audience Questions',
    subtitle: 'Open Q&A with the team',
    durationMin: 30,
    iconType: 'qa',
  },
];

const INITIAL_CITIES: ParticipantCity[] = [
  {
    id: 'ny',
    city: 'New York',
    tzLabel: 'EDT (UTC −4)',
    flag: '🇺🇸',
    workHours: '9:00 AM – 5:00 PM',
  },
  {
    id: 'ldn',
    city: 'London',
    tzLabel: 'GMT (UTC +0)',
    flag: '🇬🇧',
    workHours: '9:00 AM – 5:00 PM',
  },
  {
    id: 'mum',
    city: 'Mumbai',
    tzLabel: 'IST (UTC +5:30)',
    flag: '🇮🇳',
    workHours: '9:00 AM – 5:00 PM',
  },
  {
    id: 'tyo',
    city: 'Tokyo',
    tzLabel: 'JST (UTC +9)',
    flag: '🇯🇵',
    workHours: '9:00 AM – 5:00 PM',
  },
];

const EXTRA_CITIES: ParticipantCity[] = [
  {
    id: 'sfo',
    city: 'San Francisco',
    tzLabel: 'PDT (UTC −7)',
    flag: '🇺🇸',
    workHours: '9:00 AM – 5:00 PM',
  },
  {
    id: 'ber',
    city: 'Berlin',
    tzLabel: 'CEST (UTC +2)',
    flag: '🇩🇪',
    workHours: '9:00 AM – 5:00 PM',
  },
  {
    id: 'sin',
    city: 'Singapore',
    tzLabel: 'SGT (UTC +8)',
    flag: '🇸🇬',
    workHours: '9:00 AM – 5:00 PM',
  },
  {
    id: 'syd',
    city: 'Sydney',
    tzLabel: 'AEST (UTC +10)',
    flag: '🇦🇺',
    workHours: '9:00 AM – 5:00 PM',
  },
];

function parseStartTimeToMinutes(startTimeStr: string): number {
  const match = startTimeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 9 * 60; // default 09:00 AM
  let hours = parseInt(match[1], 10);
  const mins = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + mins;
}

function formatMinutesToTime(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${String(hours12).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${period}`;
}

export default function EventSchedulePlannerDashboard() {
  // Event Details State
  const [eventName, setEventName] = useState('Global Product Summit');
  const [isEditingHeaderTitle, setIsEditingHeaderTitle] = useState(false);
  const [eventDate, setEventDate] = useState('October 27, 2026');
  const [timeZone, setTimeZone] = useState('(GMT+0) London, United Kingdom');
  const [eventStartTime, setEventStartTime] = useState('09:00 AM');
  const [eventType, setEventType] = useState('Hybrid (Online & In-Person)');
  const [eventLocation, setEventLocation] = useState('Main Hall, Convention Center');

  // Participant Locations State
  const [cities, setCities] = useState<ParticipantCity[]>(INITIAL_CITIES);

  // Agenda Sessions State
  const [sessions, setSessions] = useState<AgendaSession[]>(INITIAL_SESSIONS);
  const [currentSessionId, setCurrentSessionId] = useState<string>('sess-2');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editDuration, setEditDuration] = useState(30);

  // Live Countdown State (Default 12:45 remaining = 765 seconds)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(12 * 60 + 45);
  const [isLiveRunning, setIsLiveRunning] = useState<boolean>(false);
  const [isFullscreenStage, setIsFullscreenStage] = useState<boolean>(false);
  const [attendeeViewMode, setAttendeeViewMode] = useState<boolean>(false);

  // Share Link State
  const [shareLink] = useState('https://WebCountDownTimer.com/event/abc123');
  const [copiedLink, setCopiedLink] = useState(false);

  // Suggested Meeting Slot Feedback
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Live timer interval when running
  useEffect(() => {
    if (!isLiveRunning) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isLiveRunning]);

  // Compute scheduled start/end times for each session
  const scheduledSessions = useMemo(() => {
    const baseMin = parseStartTimeToMinutes(eventStartTime);
    return sessions.map((sess, idx) => {
      const offsetMin = sessions
        .slice(0, idx)
        .reduce((acc, prev) => acc + prev.durationMin, 0);
      const startMin = baseMin + offsetMin;
      const endMin = startMin + sess.durationMin;
      return {
        ...sess,
        index: idx + 1,
        startTimeStr: formatMinutesToTime(startMin),
        endTimeStr: formatMinutesToTime(endMin),
      };
    });
  }, [sessions, eventStartTime]);

  // Active current session & next session
  const currentSessionObj = useMemo(() => {
    return (
      scheduledSessions.find((s) => s.id === currentSessionId) ||
      scheduledSessions[0] || {
        id: 'none',
        index: 1,
        title: 'No Session',
        subtitle: '',
        durationMin: 30,
        startTimeStr: '09:00 AM',
        endTimeStr: '09:30 AM',
        iconType: 'keynote' as const,
      }
    );
  }, [scheduledSessions, currentSessionId]);

  const nextSessionObj = useMemo(() => {
    const idx = scheduledSessions.findIndex((s) => s.id === currentSessionObj.id);
    if (idx !== -1 && idx + 1 < scheduledSessions.length) {
      return scheduledSessions[idx + 1];
    }
    return null;
  }, [scheduledSessions, currentSessionObj]);

  // Format MM:SS
  const formatCountdown = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Handlers
  const handleAddSession = () => {
    const newId = `sess-${Date.now()}`;
    const newSession: AgendaSession = {
      id: newId,
      title: `New Session ${sessions.length + 1}`,
      subtitle: 'Session topic and discussion details',
      durationMin: 30,
      iconType: 'demo',
    };
    setSessions((prev) => [...prev, newSession]);
  };

  const handleStartEditSession = (sess: AgendaSession) => {
    setEditingSessionId(sess.id);
    setEditTitle(sess.title);
    setEditSubtitle(sess.subtitle);
    setEditDuration(sess.durationMin);
  };

  const handleSaveEditSession = (id: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              title: editTitle.trim() || s.title,
              subtitle: editSubtitle.trim() || s.subtitle,
              durationMin: Math.max(5, editDuration || 15),
            }
          : s
      )
    );
    setEditingSessionId(null);
  };

  const handleDeleteSession = (id: string) => {
    if (sessions.length <= 1) return;
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (currentSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      if (remaining[0]) setCurrentSessionId(remaining[0].id);
    }
  };

  const handleRemoveCity = (id: string) => {
    if (cities.length <= 1) return;
    setCities((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddCity = () => {
    const unused = EXTRA_CITIES.find((ec) => !cities.some((c) => c.id === ec.id));
    if (unused) {
      setCities((prev) => [...prev, unused]);
    } else {
      const initialUnused = INITIAL_CITIES.find((ic) => !cities.some((c) => c.id === ic.id));
      if (initialUnused) setCities((prev) => [...prev, initialUnused]);
    }
  };

  const handleCopyShareLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareLink).catch(() => {});
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportSchedule = () => {
    const csvRows = [
      ['Order', 'Start Time', 'End Time', 'Duration (min)', 'Title', 'Description'].join(','),
      ...scheduledSessions.map((s) =>
        [
          s.index,
          `"${s.startTimeStr}"`,
          `"${s.endTimeStr}"`,
          s.durationMin,
          `"${s.title}"`,
          `"${s.subtitle}"`,
        ].join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventName.toLowerCase().replace(/\s+/g, '-')}-schedule.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderSessionIcon = (type: AgendaSession['iconType']) => {
    switch (type) {
      case 'welcome':
        return (
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Presentation className="w-4 h-4" />
          </div>
        );
      case 'keynote':
        return (
          <div className="w-8 h-8 rounded-lg bg-purple-100/80 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Presentation className="w-4 h-4" />
          </div>
        );
      case 'demo':
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shrink-0">
            <Monitor className="w-4 h-4" />
          </div>
        );
      case 'panel':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4" />
          </div>
        );
      case 'break':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Coffee className="w-4 h-4" />
          </div>
        );
      case 'qa':
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 pb-12">
      {/* ================================================================= */}
      {/* SECONDARY DARK SUB-HEADER BAR: Event Name + Quick Stage Actions    */}
      {/* ================================================================= */}
      <div className="w-full bg-[#111827] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Left: Calendar Icon Badge + Event Name + Date/Location */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-slate-200 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {isEditingHeaderTitle ? (
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    onBlur={() => setIsEditingHeaderTitle(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingHeaderTitle(false)}
                    autoFocus
                    className="bg-slate-800 text-white font-bold text-base px-2 py-0.5 rounded border border-blue-500 outline-none"
                  />
                ) : (
                  <>
                    <span className="font-bold text-base sm:text-[17px] tracking-tight text-white">
                      {eventName}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingHeaderTitle(true)}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Edit event name"
                      aria-label="Edit event name"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>Oct 27, 2026</span>
                <span>•</span>
                <span>Online &amp; In-Person Event</span>
              </div>
            </div>
          </div>

          {/* Right: 3 Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setAttendeeViewMode(!attendeeViewMode)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-2 cursor-pointer ${
                attendeeViewMode
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{attendeeViewMode ? 'Viewing as Attendee' : 'View as Attendee'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyShareLink}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-[#2563EB] transition-colors flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Schedule'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreenStage(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2563EB] hover:bg-blue-600 text-white transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fullscreen Stage Timer</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* MAIN CONTENT CONTAINER                                            */}
      {/* ================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-5">
        {/* PAGE INTRODUCTION HEADER ROW */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F0FE] dark:bg-blue-950/80 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-[#2563EB] shrink-0 shadow-2xs">
              <Calendar className="w-7 h-7 stroke-[2]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Plan Every <span className="text-[#2563EB]">Session</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Build a schedule, manage session timings and coordinate people across time zones.
              </p>
            </div>
          </div>

          {/* Right Action Controls: Templates, Export, + Add Session */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setSessions(INITIAL_SESSIONS);
                setCurrentSessionId('sess-2');
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#2563EB] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Templates</span>
            </button>

            <button
              type="button"
              onClick={handleExportSchedule}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#2563EB] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={handleAddSession}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2563EB] hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Session</span>
            </button>
          </div>
        </div>

        {/* =============================================================== */}
        {/* 3-COLUMN WORKSPACE: 3 cols (Details) | 5 cols (Agenda) | 4 cols */}
        {/* =============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* LEFT PANEL: EVENT DETAILS (3 of 12 cols) */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
            <div className="space-y-4">
              {/* Panel Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2563EB]" />
                  <h2 className="font-bold text-[15px] text-slate-900 dark:text-white">
                    Event Details
                  </h2>
                </div>
                <Settings className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
              </div>

              {/* Event Name */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Event Name
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Date
                </label>
                <div className="relative flex items-center">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Time Zone */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Time Zone
                </label>
                <div className="relative flex items-center">
                  <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                  <select
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full pl-8 pr-7 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="(GMT+0) London, United Kingdom">
                      (GMT+0) London, United Kingdom
                    </option>
                    <option value="(UTC-4) New York, United States">
                      (UTC-4) New York, United States
                    </option>
                    <option value="(UTC+5:30) Mumbai, India">(UTC+5:30) Mumbai, India</option>
                    <option value="(UTC+9) Tokyo, Japan">(UTC+9) Tokyo, Japan</option>
                    <option value="(UTC+1) Berlin, Germany">(UTC+1) Berlin, Germany</option>
                  </select>
                </div>
              </div>

              {/* Event Start Time */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Event Start Time
                </label>
                <div className="relative flex items-center">
                  <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                  <select
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    className="w-full pl-8 pr-7 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Event Type */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Event Type
                </label>
                <div className="relative flex items-center">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full pl-8 pr-7 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Hybrid (Online & In-Person)">
                      Hybrid (Online &amp; In-Person)
                    </option>
                    <option value="Online Webinar">Online Webinar</option>
                    <option value="In-Person Conference">In-Person Conference</option>
                  </select>
                </div>
              </div>

              {/* Event Location (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Event Location <span className="font-normal text-slate-400">(Optional)</span>
                </label>
                <div className="relative flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Participant Locations */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Participant Locations
                </label>
                <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800/60 flex items-start gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400 mt-1 shrink-0" />
                  <div className="flex flex-wrap items-center gap-1.5">
                    {cities.map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-200"
                      >
                        <span>{c.city}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCity(c.id)}
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                          aria-label={`Remove ${c.city}`}
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddCity}
                      className="text-[11px] font-semibold text-[#2563EB] hover:underline flex items-center gap-0.5 px-1 py-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Location</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CENTRAL PANEL: EVENT AGENDA (5 of 12 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
            <div>
              {/* Agenda Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4 text-[#2563EB]" />
                  <h2 className="font-bold text-[15px] text-slate-900 dark:text-white">
                    Event Agenda
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Total Duration: 3h 00m</span>
                  <MoreVertical className="w-4 h-4 text-slate-400 cursor-pointer" />
                </div>
              </div>

              {/* Agenda Session Rows */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {scheduledSessions.map((sess) => {
                  const isCurrent = sess.id === currentSessionId;
                  const isEditing = sess.id === editingSessionId;

                  return (
                    <div
                      key={sess.id}
                      onClick={() => {
                        if (!isEditing) {
                          setCurrentSessionId(sess.id);
                        }
                      }}
                      className={`py-3 px-2.5 transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isCurrent
                          ? 'bg-[#EFF6FF]/90 dark:bg-blue-950/40 rounded-xl border border-blue-200/80 dark:border-blue-800/70 border-l-4 border-l-[#2563EB] my-1 shadow-2xs'
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40 rounded-lg'
                      }`}
                    >
                      {/* Left: Drag Handle + Number Circle + Start Time & Duration Pill */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        <GripVertical
                          className={`w-3.5 h-3.5 cursor-grab ${
                            isCurrent ? 'text-[#2563EB]' : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />

                        <div
                          className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                            isCurrent
                              ? 'bg-[#2563EB] text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {sess.index}
                        </div>

                        <div className="w-16 text-center">
                          <div className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                            {sess.startTimeStr}
                          </div>
                          <div className="mt-0.5 inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            {sess.durationMin} min
                          </div>
                        </div>
                      </div>

                      {/* Middle: Session Icon + Editable Title & Subtitle */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {renderSessionIcon(sess.iconType)}

                        {isEditing ? (
                          <div
                            className="flex-1 space-y-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full px-2 py-1 text-xs font-bold rounded border border-blue-400 bg-white dark:bg-slate-900"
                              placeholder="Session title"
                            />
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editSubtitle}
                                onChange={(e) => setEditSubtitle(e.target.value)}
                                className="flex-1 px-2 py-1 text-[11px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                                placeholder="Subtitle"
                              />
                              <input
                                type="number"
                                min={5}
                                max={240}
                                value={editDuration}
                                onChange={(e) => setEditDuration(parseInt(e.target.value) || 15)}
                                className="w-14 px-2 py-1 text-[11px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveEditSession(sess.id)}
                                className="px-2.5 py-1 rounded bg-[#2563EB] text-white text-[11px] font-semibold"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3
                                className={`text-xs sm:text-[13px] font-bold truncate ${
                                  isCurrent
                                    ? 'text-[#2563EB] dark:text-blue-400'
                                    : 'text-slate-900 dark:text-white'
                                }`}
                              >
                                {sess.title}
                              </h3>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-md bg-[#2563EB] text-white text-[10px] font-semibold leading-none shrink-0">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {sess.subtitle}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right: Edit Pencil + Delete/Menu Icon */}
                      {!attendeeViewMode && (
                        <div
                          className="flex items-center gap-1.5 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleStartEditSession(sess)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit session"
                            aria-label={`Edit ${sess.title}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSession(sess.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Remove session"
                            aria-label={`More actions for ${sess.title}`}
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Add Session Button */}
            <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleAddSession}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 bg-[#F8FAFC] dark:bg-slate-800/50 hover:bg-blue-50/50 text-[#2563EB] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Session</span>
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: LIVE EVENT STATUS + SHARE SCHEDULE (4 of 12 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-5">
            {/* TOP CARD: LIVE EVENT STATUS */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tv className="w-4 h-4 text-[#2563EB]" />
                  <h2 className="font-bold text-[15px] text-slate-900 dark:text-white">
                    Live Event Status
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live</span>
                </span>
              </div>

              {/* Current Session Box */}
              <div className="p-4 rounded-xl bg-[#F1F5F9]/90 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Presentation className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">
                    Current Session
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                    {currentSessionObj.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {currentSessionObj.startTimeStr} – {currentSessionObj.endTimeStr} (
                    {currentSessionObj.durationMin} min)
                  </p>

                  {/* Countdown Readout + Interactive Play/Pause */}
                  <div className="mt-3 flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
                        {formatCountdown(remainingSeconds)}
                      </span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        remaining
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setIsLiveRunning(!isLiveRunning)}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-[#2563EB] transition-colors cursor-pointer"
                        title={isLiveRunning ? 'Pause live countdown' : 'Start live countdown'}
                        aria-label="Toggle live countdown"
                      >
                        {isLiveRunning ? (
                          <Pause className="w-3 h-3" />
                        ) : (
                          <Play className="w-3 h-3 fill-current" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsLiveRunning(false);
                          setRemainingSeconds(12 * 60 + 45);
                        }}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-[#2563EB] transition-colors cursor-pointer"
                        title="Reset countdown"
                        aria-label="Reset countdown"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Session Progress Bar */}
                  <div className="mt-2.5 w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2563EB] h-full rounded-full transition-all duration-300"
                      style={{ width: '42%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Next Session Row */}
              {nextSessionObj && (
                <div className="flex items-start gap-3.5 px-1">
                  <div className="w-9 h-9 rounded-xl bg-purple-100/80 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                      Next Session
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {nextSessionObj.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {nextSessionObj.startTimeStr} – {nextSessionObj.endTimeStr} (
                      {nextSessionObj.durationMin} min)
                    </p>
                  </div>
                </div>
              )}

              {/* Total Schedule Progress */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Total Schedule Progress
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    1 of {scheduledSessions.length} sessions
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2563EB] h-full rounded-full transition-all"
                      style={{ width: '17%' }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                    17%
                  </span>
                </div>
              </div>

              {/* Open Fullscreen Stage Timer Button */}
              <button
                type="button"
                onClick={() => setIsFullscreenStage(true)}
                className="w-full py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Open Fullscreen Stage Timer</span>
              </button>
            </div>

            {/* BOTTOM CARD: SHARE SCHEDULE */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#2563EB]" />
                <h2 className="font-bold text-[15px] text-slate-900 dark:text-white">
                  Share Schedule
                </h2>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Share this link with attendees:
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  aria-label="Shareable schedule URL"
                  className="flex-1 min-w-0 px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 shadow-2xs transition-colors cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>Anyone with the link can view the schedule</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="font-semibold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Settings className="w-3 h-3" />
                  <span>Customize</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* BOTTOM FULL-WIDTH CARD: MEETING PLANNER & OVERLAPPING TIMES      */}
        {/* =============================================================== */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left 7 Cols: Participant Time Zones & Working Hours */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="flex items-start gap-2.5">
                <Users className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-bold text-[15px] text-slate-900 dark:text-white leading-tight">
                    Meeting Planner
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Find the best meeting time for your team across different time zones.
                  </p>
                </div>
              </div>

              {/* 5-Column City Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5">
                {cities.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800/40 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-base leading-none">{c.flag}</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {c.city}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCity(c.id)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                        aria-label={`Remove ${c.city}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      {c.tzLabel}
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                      {c.workHours}
                    </div>
                  </div>
                ))}

                {/* + Add Location Card */}
                <button
                  type="button"
                  onClick={handleAddCity}
                  className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-slate-900 hover:bg-blue-50/40 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#2563EB] transition-colors cursor-pointer min-h-[84px]"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Location</span>
                </button>
              </div>
            </div>

            {/* Right 5 Cols: Suggested Meeting Times */}
            <div className="lg:col-span-5 lg:border-l lg:border-slate-200/80 dark:lg:border-slate-800 lg:pl-6 space-y-3.5">
              {/* Top Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Suggested Meeting Times
                </span>

                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{eventDate}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedSlot('02:00 PM')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    Find Overlapping Times
                  </button>
                </div>
              </div>

              {/* 2 Overlapping Slot Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Slot 1: 02:00 PM - 03:00 PM */}
                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    selectedSlot === '02:00 PM'
                      ? 'border-[#2563EB] bg-blue-50/40 dark:bg-blue-950/30'
                      : 'border-slate-200/80 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                        02:00 PM – 03:00 PM
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Tue, Oct 27
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSlot('02:00 PM');
                        setEventStartTime('02:00 PM');
                      }}
                      className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#2563EB] text-[#2563EB] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {selectedSlot === '02:00 PM' ? 'Selected' : 'Select'}
                    </button>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-600 text-white dark:fill-emerald-500" />
                    <span>Works for all ({cities.length})</span>
                  </div>
                </div>

                {/* Slot 2: 03:00 PM - 04:00 PM */}
                <div
                  className={`p-3.5 rounded-xl border transition-all ${
                    selectedSlot === '03:00 PM'
                      ? 'border-[#2563EB] bg-blue-50/40 dark:bg-blue-950/30'
                      : 'border-slate-200/80 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                        03:00 PM – 04:00 PM
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Tue, Oct 27
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSlot('03:00 PM');
                        setEventStartTime('03:00 PM');
                      }}
                      className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#2563EB] text-[#2563EB] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {selectedSlot === '03:00 PM' ? 'Selected' : 'Select'}
                    </button>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-600 text-white dark:fill-emerald-500" />
                    <span>Works for all ({cities.length})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* FULLSCREEN STAGE TIMER OVERLAY MODAL                              */}
      {/* ================================================================= */}
      {isFullscreenStage && (
        <div className="fixed inset-0 z-50 bg-[#111827] text-white flex flex-col justify-between p-8 sm:p-14 animate-in fade-in">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="text-center sm:text-left">
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400">
                {eventName}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {currentSessionObj.title}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreenStage(false)}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Exit Fullscreen Stage Timer"
            >
              <Minimize2 className="w-6 h-6" />
            </button>
          </div>

          {/* Giant Center Countdown */}
          <div className="my-auto text-center">
            <div className="font-sans font-black text-[20vw] leading-none tracking-tight tabular-nums select-none text-white">
              {formatCountdown(remainingSeconds)}
            </div>
            <div className="text-sm sm:text-base font-bold tracking-[0.25em] uppercase text-slate-400 mt-4">
              TIME REMAINING
            </div>
          </div>

          {/* Bottom Progress & Up Next */}
          <div className="space-y-4">
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
              <div className="bg-[#2563EB] h-full rounded-full" style={{ width: '42%' }} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-400">
                {nextSessionObj
                  ? `UP NEXT: ${nextSessionObj.title} (${nextSessionObj.startTimeStr})`
                  : 'FINAL SESSION OF SCHEDULE'}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsLiveRunning(!isLiveRunning)}
                  className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  {isLiveRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isLiveRunning ? 'Pause' : 'Start'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLiveRunning(false);
                    setRemainingSeconds(12 * 60 + 45);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
