'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import {
  Download,
  Copy,
  Check,
  RotateCcw,
  BarChart3,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { TimeCardShift, calculateTimeCard } from '@/lib/calculators/time-calculators';

const INITIAL_SHIFTS: TimeCardShift[] = [
  { id: 'mon', dayName: 'Monday', enabled: true, startTime: '08:30', endTime: '17:30', breakMinutes: 30 },
  { id: 'tue', dayName: 'Tuesday', enabled: true, startTime: '08:30', endTime: '18:00', breakMinutes: 30 },
  { id: 'wed', dayName: 'Wednesday', enabled: true, startTime: '08:30', endTime: '18:30', breakMinutes: 30 },
  { id: 'thu', dayName: 'Thursday', enabled: true, startTime: '08:30', endTime: '18:00', breakMinutes: 30 },
  { id: 'fri', dayName: 'Friday', enabled: true, startTime: '08:30', endTime: '17:30', breakMinutes: 30 },
  { id: 'sat', dayName: 'Saturday', enabled: true, startTime: '09:00', endTime: '13:30', breakMinutes: 15 },
  { id: 'sun', dayName: 'Sunday', enabled: false, startTime: '09:00', endTime: '13:00', breakMinutes: 0 },
];

interface TimeCardTooltip {
  title: string;
  subtitle: string;
  line1: string;
  line2: string;
  line3: string;
  x: number;
  y: number;
}

export default function TimeCardCalculatorComponent() {
  const [shifts, setShifts] = useState<TimeCardShift[]>(INITIAL_SHIFTS);
  const [hourlyRate, setHourlyRate] = useState<number>(30);
  const [dailyOtThreshold, setDailyOtThreshold] = useState<number>(8);
  const [weeklyOtThreshold, setWeeklyOtThreshold] = useState<number>(40);
  const [otMultiplier, setOtMultiplier] = useState<number>(1.5);
  const [copied, setCopied] = useState<boolean>(false);

  // D3 Refs & Responsive Widths
  const distContainerRef = useRef<HTMLDivElement | null>(null);
  const distSvgRef = useRef<SVGSVGElement | null>(null);
  const trendContainerRef = useRef<HTMLDivElement | null>(null);
  const trendSvgRef = useRef<SVGSVGElement | null>(null);

  const [distWidth, setDistWidth] = useState<number>(520);
  const [trendWidth, setTrendWidth] = useState<number>(520);
  const [distTooltip, setDistTooltip] = useState<TimeCardTooltip | null>(null);
  const [trendTooltip, setTrendTooltip] = useState<TimeCardTooltip | null>(null);

  const summary = calculateTimeCard(shifts);

  // Enrich each day with Regular vs Overtime hours & Earnings progression
  const enrichedDays = useMemo(() => {
    const baseDays = summary.days.map((day, idx) => {
      const shift = shifts[idx];
      const shortDay = day.dayName.slice(0, 3);
      const netHrs = day.netHoursDecimal;
      const breakHrs = Number((day.breakMinutes / 60).toFixed(2));

      const prevCumulative = Number(
        summary.days
          .slice(0, idx)
          .reduce((acc, d) => acc + d.netHoursDecimal, 0)
          .toFixed(2)
      );
      const cumulativeNetHours = Number((prevCumulative + netHrs).toFixed(2));

      const dailyReg = Math.min(netHrs, dailyOtThreshold);
      const dailyOt = Math.max(0, netHrs - dailyOtThreshold);

      let regHours = dailyReg;
      let otHours = dailyOt;

      if (cumulativeNetHours > weeklyOtThreshold) {
        const weeklyAllowedReg = Math.max(0, weeklyOtThreshold - prevCumulative);
        regHours = Number(Math.min(dailyReg, weeklyAllowedReg).toFixed(2));
        otHours = Number(Math.max(0, netHrs - regHours).toFixed(2));
      } else {
        regHours = Number(dailyReg.toFixed(2));
        otHours = Number(dailyOt.toFixed(2));
      }

      const regPay = Number((regHours * hourlyRate).toFixed(2));
      const otPay = Number((otHours * hourlyRate * otMultiplier).toFixed(2));
      const totalDayPay = Number((regPay + otPay).toFixed(2));

      return {
        ...day,
        shortDay,
        enabled: shift.enabled,
        startTime: shift.startTime,
        endTime: shift.endTime,
        breakHrs,
        regHours,
        otHours,
        regPay,
        otPay,
        totalDayPay,
        cumulativeNetHours,
      };
    });

    return baseDays.map((item, idx) => {
      const cumulativeEarnings = Number(
        baseDays
          .slice(0, idx + 1)
          .reduce((acc, d) => acc + d.totalDayPay, 0)
          .toFixed(2)
      );
      return {
        ...item,
        cumulativeEarnings,
      };
    });
  }, [summary.days, shifts, dailyOtThreshold, weeklyOtThreshold, hourlyRate, otMultiplier]);

  const weeklyTotals = useMemo(() => {
    const totalRegHours = Number(
      enrichedDays.reduce((acc, d) => acc + d.regHours, 0).toFixed(2)
    );
    const totalOtHours = Number(
      enrichedDays.reduce((acc, d) => acc + d.otHours, 0).toFixed(2)
    );
    const totalRegPay = Number(
      enrichedDays.reduce((acc, d) => acc + d.regPay, 0).toFixed(2)
    );
    const totalOtPay = Number(
      enrichedDays.reduce((acc, d) => acc + d.otPay, 0).toFixed(2)
    );
    const totalGrossPay = Number((totalRegPay + totalOtPay).toFixed(2));
    return {
      totalRegHours,
      totalOtHours,
      totalRegPay,
      totalOtPay,
      totalGrossPay,
    };
  }, [enrichedDays]);

  // Responsive ResizeObserver for both D3 charts
  useEffect(() => {
    const distEl = distContainerRef.current;
    const trendEl = trendContainerRef.current;
    if (!distEl && !trendEl) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(280, Math.floor(entry.contentRect.width));
        if (entry.target === distEl) setDistWidth(w);
        if (entry.target === trendEl) setTrendWidth(w);
      }
    });

    if (distEl) ro.observe(distEl);
    if (trendEl) ro.observe(trendEl);
    return () => ro.disconnect();
  }, []);

  // D3 Chart 1: Weekly Hours Distribution (Regular + Overtime + Break Hours)
  useEffect(() => {
    const svgEl = distSvgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const height = 260;
    const margin = { top: 24, right: 20, bottom: 36, left: 44 };
    const innerWidth = Math.max(200, distWidth - margin.left - margin.right);
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('width', distWidth).attr('height', height);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand<string>()
      .domain(enrichedDays.map((d) => d.shortDay))
      .range([0, innerWidth])
      .padding(0.28);

    const maxHours = Math.max(
      11,
      d3.max(enrichedDays, (d) => d.netHoursDecimal + d.breakHrs) || 10,
      dailyOtThreshold + 2
    );

    const y = d3.scaleLinear().domain([0, maxHours]).nice().range([innerHeight, 0]);

    // Grid lines
    g.append('g')
      .selectAll('line')
      .data(y.ticks(5))
      .join('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => y(d))
      .attr('y2', (d) => y(d))
      .attr('stroke', '#334155')
      .attr('stroke-opacity', 0.28)
      .attr('stroke-dasharray', '3,3');

    const xAxis = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));
    xAxis.selectAll('text').attr('fill', '#94A3B8').attr('font-size', '11px').attr('font-weight', '700');
    xAxis.selectAll('line,path').attr('stroke', '#475569');

    const yAxis = g
      .append('g')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `${d}h`)
      );
    yAxis.selectAll('text').attr('fill', '#94A3B8').attr('font-size', '11px').attr('font-family', 'monospace');
    yAxis.selectAll('line,path').attr('stroke', '#475569');

    const showTooltip = (event: MouseEvent, d: (typeof enrichedDays)[number]) => {
      const [mx, my] = d3.pointer(event, svgEl);
      setDistTooltip({
        title: `${d.dayName} (${d.enabled ? `${d.startTime}–${d.endTime}` : 'Off'})`,
        subtitle: `Net: ${d.formattedNet} (${d.netHoursDecimal}h)`,
        line1: `Regular: ${d.regHours}h | Overtime: ${d.otHours}h`,
        line2: `Unpaid Break: ${d.breakMinutes}m (${d.breakHrs}h)`,
        line3: `Cumulative Week: ${d.cumulativeNetHours}h`,
        x: mx,
        y: Math.max(20, my - 10),
      });
    };

    // Regular Hours Bar
    g.selectAll('.tc-bar-reg')
      .data(enrichedDays)
      .join('rect')
      .attr('class', 'tc-bar-reg')
      .attr('x', (d) => x(d.shortDay) || 0)
      .attr('width', x.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', '#3B82F6')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => showTooltip(event, d))
      .on('mouseleave', () => setDistTooltip(null))
      .transition()
      .duration(450)
      .attr('y', (d) => y(d.regHours))
      .attr('height', (d) => Math.max(0, innerHeight - y(d.regHours)));

    // Overtime Hours Bar
    g.selectAll('.tc-bar-ot')
      .data(enrichedDays)
      .join('rect')
      .attr('class', 'tc-bar-ot')
      .attr('x', (d) => x(d.shortDay) || 0)
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.regHours))
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', '#F59E0B')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => showTooltip(event, d))
      .on('mouseleave', () => setDistTooltip(null))
      .transition()
      .duration(500)
      .attr('y', (d) => y(d.regHours + d.otHours))
      .attr('height', (d) => Math.max(0, y(d.regHours) - y(d.regHours + d.otHours)));

    // Break Hours Bar
    g.selectAll('.tc-bar-break')
      .data(enrichedDays)
      .join('rect')
      .attr('class', 'tc-bar-break')
      .attr('x', (d) => x(d.shortDay) || 0)
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.netHoursDecimal))
      .attr('height', 0)
      .attr('rx', 3)
      .attr('fill', '#64748B')
      .attr('fill-opacity', 0.55)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => showTooltip(event, d))
      .on('mouseleave', () => setDistTooltip(null))
      .transition()
      .duration(550)
      .attr('y', (d) => y(d.netHoursDecimal + d.breakHrs))
      .attr('height', (d) =>
        Math.max(0, y(d.netHoursDecimal) - y(d.netHoursDecimal + d.breakHrs))
      );

    // Net Hours Labels above bars
    g.selectAll('.tc-label')
      .data(enrichedDays)
      .join('text')
      .attr('class', 'tc-label')
      .attr('x', (d) => (x(d.shortDay) || 0) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.netHoursDecimal + d.breakHrs) - 6)
      .attr('text-anchor', 'middle')
      .attr('fill', '#CBD5E1')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('font-weight', '700')
      .text((d) => (d.netHoursDecimal > 0 ? `${d.netHoursDecimal}h` : ''));

    // Daily Overtime Threshold Reference Line
    if (dailyOtThreshold > 0 && dailyOtThreshold <= maxHours) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', y(dailyOtThreshold))
        .attr('y2', y(dailyOtThreshold))
        .attr('stroke', '#10B981')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5,4');

      g.append('text')
        .attr('x', innerWidth - 4)
        .attr('y', y(dailyOtThreshold) - 5)
        .attr('text-anchor', 'end')
        .attr('fill', '#34D399')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .text(`Daily OT Threshold (${dailyOtThreshold}h)`);
    }
  }, [enrichedDays, distWidth, dailyOtThreshold]);

  // D3 Chart 2: Daily & Overtime Earnings Trends
  useEffect(() => {
    const svgEl = trendSvgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const height = 260;
    const margin = { top: 24, right: 20, bottom: 36, left: 52 };
    const innerWidth = Math.max(200, trendWidth - margin.left - margin.right);
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('width', trendWidth).attr('height', height);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand<string>()
      .domain(enrichedDays.map((d) => d.shortDay))
      .range([0, innerWidth])
      .padding(0.28);

    const maxDayPay = Math.max(200, d3.max(enrichedDays, (d) => d.totalDayPay) || 300) * 1.15;
    const y = d3.scaleLinear().domain([0, maxDayPay]).nice().range([innerHeight, 0]);

    // Grid lines
    g.append('g')
      .selectAll('line')
      .data(y.ticks(5))
      .join('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => y(d))
      .attr('y2', (d) => y(d))
      .attr('stroke', '#334155')
      .attr('stroke-opacity', 0.28)
      .attr('stroke-dasharray', '3,3');

    const xAxis = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));
    xAxis.selectAll('text').attr('fill', '#94A3B8').attr('font-size', '11px').attr('font-weight', '700');
    xAxis.selectAll('line,path').attr('stroke', '#475569');

    const yAxis = g
      .append('g')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `$${d}`)
      );
    yAxis.selectAll('text').attr('fill', '#94A3B8').attr('font-size', '11px').attr('font-family', 'monospace');
    yAxis.selectAll('line,path').attr('stroke', '#475569');

    const showPayTooltip = (event: MouseEvent, d: (typeof enrichedDays)[number]) => {
      const [mx, my] = d3.pointer(event, svgEl);
      setTrendTooltip({
        title: `${d.dayName} — $${d.totalDayPay.toFixed(2)}`,
        subtitle: `Cumulative Week Pay: $${d.cumulativeEarnings.toFixed(2)}`,
        line1: `Regular Pay (${d.regHours}h): $${d.regPay.toFixed(2)}`,
        line2: `Overtime Pay (${d.otHours}h @ ${otMultiplier}x): $${d.otPay.toFixed(2)}`,
        line3: `Cumulative Hours: ${d.cumulativeNetHours}h`,
        x: mx,
        y: Math.max(20, my - 10),
      });
    };

    // Regular Pay Bars
    g.selectAll('.tc-pay-reg')
      .data(enrichedDays)
      .join('rect')
      .attr('class', 'tc-pay-reg')
      .attr('x', (d) => x(d.shortDay) || 0)
      .attr('width', x.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', '#10B981')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => showPayTooltip(event, d))
      .on('mouseleave', () => setTrendTooltip(null))
      .transition()
      .duration(450)
      .attr('y', (d) => y(d.regPay))
      .attr('height', (d) => Math.max(0, innerHeight - y(d.regPay)));

    // Overtime Pay Stacked Bars
    g.selectAll('.tc-pay-ot')
      .data(enrichedDays)
      .join('rect')
      .attr('class', 'tc-pay-ot')
      .attr('x', (d) => x(d.shortDay) || 0)
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.regPay))
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', '#F59E0B')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => showPayTooltip(event, d))
      .on('mouseleave', () => setTrendTooltip(null))
      .transition()
      .duration(500)
      .attr('y', (d) => y(d.totalDayPay))
      .attr('height', (d) => Math.max(0, y(d.regPay) - y(d.totalDayPay)));

    // Daily Pay Labels above bars
    g.selectAll('.tc-pay-label')
      .data(enrichedDays)
      .join('text')
      .attr('class', 'tc-pay-label')
      .attr('x', (d) => (x(d.shortDay) || 0) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.totalDayPay) - 6)
      .attr('text-anchor', 'middle')
      .attr('fill', '#CBD5E1')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('font-weight', '700')
      .text((d) => (d.totalDayPay > 0 ? `$${Math.round(d.totalDayPay)}` : ''));
  }, [enrichedDays, trendWidth, otMultiplier]);

  const handleUpdateShift = (id: string, patch: Partial<TimeCardShift>) => {
    setShifts((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const handleExportCsv = () => {
    const rows = [
      'Day,Active,Start Time,End Time,Break (Minutes),Net Hours (HH:MM),Decimal Hours,Regular Hours,Overtime Hours,Est. Pay ($)',
    ];
    enrichedDays.forEach((day) => {
      rows.push(
        [
          day.dayName,
          day.enabled ? 'Yes' : 'No',
          day.startTime,
          day.endTime,
          day.breakMinutes,
          day.formattedNet,
          day.netHoursDecimal,
          day.regHours,
          day.otHours,
          day.totalDayPay.toFixed(2),
        ].join(',')
      );
    });
    rows.push(
      `TOTAL,,,Break Total: ${summary.totalBreakMinutes}m,,${summary.formattedTotalNet},${summary.totalNetHoursDecimal},${weeklyTotals.totalRegHours},${weeklyTotals.totalOtHours},${weeklyTotals.totalGrossPay.toFixed(2)}`
    );

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'weekly-time-card.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = () => {
    const text = `Weekly Time Card Total: ${summary.formattedTotalNet} (${summary.totalNetHoursDecimal} decimal hours | Regular: ${weeklyTotals.totalRegHours}h, Overtime: ${weeklyTotals.totalOtHours}h | Est. Gross Pay: $${weeklyTotals.totalGrossPay.toFixed(2)})`;
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Weekly Work Period Log
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Net daily hours equal (End Time − Start Time) minus unpaid Break Minutes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShifts(INITIAL_SHIFTS)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Rate & Overtime Parameters Bar for Earnings Visualization */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-[#2563EB]" />
              <span>Hourly Rate ($/hr)</span>
            </label>
            <input
              type="number"
              min={0}
              step="0.5"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Math.max(0, Number(e.target.value) || 0))}
              className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Daily OT Threshold (h)
            </label>
            <input
              type="number"
              min={1}
              max={24}
              step="0.5"
              value={dailyOtThreshold}
              onChange={(e) => setDailyOtThreshold(Math.max(1, Number(e.target.value) || 8))}
              className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              Weekly OT Threshold (h)
            </label>
            <input
              type="number"
              min={1}
              max={168}
              step="1"
              value={weeklyOtThreshold}
              onChange={(e) => setWeeklyOtThreshold(Math.max(1, Number(e.target.value) || 40))}
              className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
              OT Rate Multiplier
            </label>
            <input
              type="number"
              min={1}
              max={5}
              step="0.1"
              value={otMultiplier}
              onChange={(e) => setOtMultiplier(Math.max(1, Number(e.target.value) || 1.5))}
              className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
            />
          </div>
        </div>

        {/* Responsive Shift Rows */}
        <div className="space-y-2.5">
          {shifts.map((shift, idx) => {
            const stat = enrichedDays[idx];
            return (
              <div
                key={shift.id}
                className={`p-3.5 rounded-xl border grid grid-cols-1 sm:grid-cols-12 gap-3 items-center ${
                  shift.enabled
                    ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    : 'bg-slate-50/40 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50 opacity-60'
                }`}
              >
                <div className="sm:col-span-3 flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={shift.enabled}
                    onChange={(e) =>
                      handleUpdateShift(shift.id, { enabled: e.target.checked })
                    }
                    className="rounded border-slate-300 text-[#2563EB]"
                  />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {shift.dayName}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-500">Start</label>
                  <input
                    type="time"
                    disabled={!shift.enabled}
                    value={shift.startTime}
                    onChange={(e) =>
                      handleUpdateShift(shift.id, { startTime: e.target.value })
                    }
                    className="w-full h-9 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-500">End</label>
                  <input
                    type="time"
                    disabled={!shift.enabled}
                    value={shift.endTime}
                    onChange={(e) =>
                      handleUpdateShift(shift.id, { endTime: e.target.value })
                    }
                    className="w-full h-9 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-500">Break (min)</label>
                  <input
                    type="number"
                    min={0}
                    max={480}
                    disabled={!shift.enabled}
                    value={shift.breakMinutes}
                    onChange={(e) =>
                      handleUpdateShift(shift.id, {
                        breakMinutes: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                </div>

                <div className="sm:col-span-3 flex items-center justify-between sm:justify-end gap-4 pt-1 sm:pt-0">
                  <div className="text-right font-mono">
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {stat.formattedNet}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {stat.netHoursDecimal}h ({stat.otHours > 0 ? `+${stat.otHours}h OT` : 'reg'}) · ${stat.totalDayPay.toFixed(0)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive D3.js Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* D3 Chart 1: Weekly Hours Distribution */}
        <div className="lg:col-span-6 bg-[#0F172A] text-white rounded-2xl p-6 border border-slate-800 shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400">
                D3.js Time Card Breakdown
              </span>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 mt-0.5">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span>Weekly Hours Distribution (Mon–Sun)</span>
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-500 inline-block" />
                Regular
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" />
                Overtime
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-500 inline-block" />
                Break
              </span>
            </div>
          </div>

          <div ref={distContainerRef} className="relative w-full overflow-hidden">
            <svg
              ref={distSvgRef}
              className="w-full block select-none"
              role="img"
              aria-label="Time Card Weekly Hours Distribution D3 Bar Chart"
            />
            {distTooltip && (
              <div
                style={{
                  left: Math.min(distWidth - 200, Math.max(8, distTooltip.x - 85)),
                  top: Math.max(8, distTooltip.y - 82),
                }}
                className="pointer-events-none absolute z-20 rounded-xl bg-slate-950/95 border border-slate-700 px-3 py-2 text-xs font-mono text-white shadow-xl space-y-0.5"
              >
                <div className="font-bold text-blue-300">{distTooltip.title}</div>
                <div className="text-emerald-400 font-bold">{distTooltip.subtitle}</div>
                <div className="text-slate-200">{distTooltip.line1}</div>
                <div className="text-slate-400">{distTooltip.line2}</div>
                <div className="text-amber-300">{distTooltip.line3}</div>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Visualizes daily regular hours, overtime hours above {dailyOtThreshold}h/day (or {weeklyOtThreshold}h/week), and unpaid break deductions.
          </p>
        </div>

        {/* D3 Chart 2: Daily & Overtime Earnings Trends */}
        <div className="lg:col-span-6 bg-[#0F172A] text-white rounded-2xl p-6 border border-slate-800 shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                D3.js Payroll Projection
              </span>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 mt-0.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Daily &amp; Overtime Earnings Trends</span>
              </h3>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
                Regular Pay
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" />
                OT Bonus ({otMultiplier}x)
              </span>
            </div>
          </div>

          <div ref={trendContainerRef} className="relative w-full overflow-hidden">
            <svg
              ref={trendSvgRef}
              className="w-full block select-none"
              role="img"
              aria-label="Time Card Overtime Earnings Trends D3 Bar Chart"
            />
            {trendTooltip && (
              <div
                style={{
                  left: Math.min(trendWidth - 205, Math.max(8, trendTooltip.x - 90)),
                  top: Math.max(8, trendTooltip.y - 82),
                }}
                className="pointer-events-none absolute z-20 rounded-xl bg-slate-950/95 border border-slate-700 px-3 py-2 text-xs font-mono text-white shadow-xl space-y-0.5"
              >
                <div className="font-bold text-emerald-300">{trendTooltip.title}</div>
                <div className="text-sky-300 font-bold">{trendTooltip.subtitle}</div>
                <div className="text-slate-200">{trendTooltip.line1}</div>
                <div className="text-amber-300">{trendTooltip.line2}</div>
                <div className="text-slate-400">{trendTooltip.line3}</div>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Tracks daily regular earnings vs. {otMultiplier}x overtime premiums at ${hourlyRate}/hr across your logged shifts.
          </p>
        </div>
      </div>

      {/* Weekly Summary Footer Banner */}
      <div className="bg-[#0F172A] text-white rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Total Weekly Net Hours &amp; Estimated Pay
          </div>
          <div className="flex flex-wrap items-baseline gap-4">
            <div className="text-3xl sm:text-4xl font-black font-mono tabular-nums">
              {summary.formattedTotalNet}{' '}
              <span className="text-lg font-normal text-slate-300">
                ({summary.totalNetHoursDecimal} dec hrs)
              </span>
            </div>
            <div className="text-2xl font-black font-mono tabular-nums text-emerald-400">
              ${weeklyTotals.totalGrossPay.toFixed(2)}{' '}
              <span className="text-xs font-normal text-slate-400">
                (Reg: {weeklyTotals.totalRegHours}h · OT: {weeklyTotals.totalOtHours}h)
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            Calculation method: Sum of daily net durations. Does not automatically apply jurisdiction-specific overtime laws or payroll tax deductions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleCopySummary}
            className="h-11 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Total'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="h-11 px-5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Time Card CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}
