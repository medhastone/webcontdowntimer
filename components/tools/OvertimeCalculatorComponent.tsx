'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Calculator, Copy, Check, BarChart3, TrendingUp, SlidersHorizontal } from 'lucide-react';
import { calculateOvertime } from '@/lib/calculators/time-calculators';

interface DailyAllocation {
  day: string;
  shortDay: string;
  hours: number;
}

interface HoveredTooltip {
  title: string;
  subtitle: string;
  regularLabel: string;
  overtimeLabel: string;
  totalLabel: string;
  x: number;
  y: number;
}

const SCHEDULE_PRESETS: { id: string; label: string; weights: number[] }[] = [
  { id: 'standard-ot', label: '5-Day + Late Shifts', weights: [0.19, 0.2, 0.21, 0.21, 0.19, 0, 0] },
  { id: 'six-day', label: '6-Day Saturday OT', weights: [0.17, 0.17, 0.17, 0.17, 0.17, 0.15, 0] },
  { id: 'compressed', label: '4×10h + Friday OT', weights: [0.22, 0.22, 0.22, 0.22, 0.12, 0, 0] },
  { id: 'seven-day', label: '7-Day Sprint', weights: [0.16, 0.16, 0.16, 0.16, 0.16, 0.11, 0.09] },
];

const DAYS_META = [
  { day: 'Monday', shortDay: 'Mon' },
  { day: 'Tuesday', shortDay: 'Tue' },
  { day: 'Wednesday', shortDay: 'Wed' },
  { day: 'Thursday', shortDay: 'Thu' },
  { day: 'Friday', shortDay: 'Fri' },
  { day: 'Saturday', shortDay: 'Sat' },
  { day: 'Sunday', shortDay: 'Sun' },
];

export default function OvertimeCalculatorComponent() {
  const [totalHoursWorked, setTotalHoursWorked] = useState<number>(46.5);
  const [regularThresholdHours, setRegularThresholdHours] = useState<number>(40);
  const [overtimeMultiplier, setOvertimeMultiplier] = useState<number>(1.5);
  const [hourlyRate, setHourlyRate] = useState<number>(32);
  const [activePreset, setActivePreset] = useState<string>('standard-ot');
  const [customDailyHours, setCustomDailyHours] = useState<number[] | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // D3 Chart Refs & Responsive Width State
  const hoursChartContainerRef = useRef<HTMLDivElement | null>(null);
  const hoursSvgRef = useRef<SVGSVGElement | null>(null);
  const earningsChartContainerRef = useRef<HTMLDivElement | null>(null);
  const earningsSvgRef = useRef<SVGSVGElement | null>(null);

  const [hoursChartWidth, setHoursChartWidth] = useState<number>(520);
  const [earningsChartWidth, setEarningsChartWidth] = useState<number>(520);
  const [hoursTooltip, setHoursTooltip] = useState<HoveredTooltip | null>(null);
  const [earningsTooltip, setEarningsTooltip] = useState<HoveredTooltip | null>(null);

  const result = calculateOvertime({
    totalHoursWorked,
    regularThresholdHours,
    overtimeMultiplier,
    hourlyRate,
  });

  // Compute daily hours distribution across Mon-Sun
  const dailyDistribution: DailyAllocation[] = useMemo(() => {
    if (customDailyHours && customDailyHours.length === 7) {
      return DAYS_META.map((d, i) => ({
        day: d.day,
        shortDay: d.shortDay,
        hours: Number(customDailyHours[i].toFixed(2)),
      }));
    }
    const preset = SCHEDULE_PRESETS.find((p) => p.id === activePreset) || SCHEDULE_PRESETS[0];
    let allocated = 0;
    return DAYS_META.map((d, idx) => {
      const weight = preset.weights[idx];
      if (weight === 0) {
        return { day: d.day, shortDay: d.shortDay, hours: 0 };
      }
      const isLastActive = preset.weights.slice(idx + 1).every((w) => w === 0);
      const raw = isLastActive
        ? Math.max(0, totalHoursWorked - allocated)
        : Math.round(totalHoursWorked * weight * 4) / 4;
      allocated += raw;
      return {
        day: d.day,
        shortDay: d.shortDay,
        hours: Number(raw.toFixed(2)),
      };
    });
  }, [totalHoursWorked, activePreset, customDailyHours]);

  // Split each day into Regular vs Overtime hours
  const dailyBreakdownData = useMemo(() => {
    let runningTotal = 0;
    const dailyCap = regularThresholdHours / 5;
    return dailyDistribution.map((item) => {
      const prevTotal = runningTotal;
      runningTotal += item.hours;

      let regHours = 0;
      let otHours = 0;
      if (runningTotal <= regularThresholdHours) {
        if (totalHoursWorked > regularThresholdHours && item.hours > dailyCap) {
          regHours = Number(Math.min(item.hours, dailyCap).toFixed(2));
          otHours = Number(Math.max(0, item.hours - dailyCap).toFixed(2));
        } else {
          regHours = item.hours;
          otHours = 0;
        }
      } else if (prevTotal >= regularThresholdHours) {
        regHours = 0;
        otHours = item.hours;
      } else {
        regHours = Number(Math.max(0, regularThresholdHours - prevTotal).toFixed(2));
        otHours = Number(Math.max(0, item.hours - regHours).toFixed(2));
      }

      const dayRegPay = Number((regHours * hourlyRate).toFixed(2));
      const dayOtPay = Number((otHours * hourlyRate * overtimeMultiplier).toFixed(2));

      return {
        ...item,
        regHours,
        otHours,
        dayRegPay,
        dayOtPay,
        dayTotalPay: Number((dayRegPay + dayOtPay).toFixed(2)),
      };
    });
  }, [dailyDistribution, regularThresholdHours, totalHoursWorked, hourlyRate, overtimeMultiplier]);

  // Compute Overtime Earnings Trends across workload tiers
  const earningsTrendData = useMemo(() => {
    const baseStepHours = [
      Math.max(20, regularThresholdHours - 5),
      regularThresholdHours,
      regularThresholdHours + 4,
      regularThresholdHours + 8,
      regularThresholdHours + 12,
      regularThresholdHours + 16,
      regularThresholdHours + 20,
    ];
    const uniqueHours = Array.from(
      new Set([...baseStepHours, Number(totalHoursWorked.toFixed(1))])
    ).sort((a, b) => a - b);

    return uniqueHours.map((hrs) => {
      const calc = calculateOvertime({
        totalHoursWorked: hrs,
        regularThresholdHours,
        overtimeMultiplier,
        hourlyRate,
      });
      return {
        label: `${hrs}h`,
        hours: hrs,
        isCurrent: Math.abs(hrs - totalHoursWorked) < 0.05,
        regularPay: calc.regularPay,
        overtimePay: calc.overtimePay,
        totalPay: calc.totalEstimatedPay,
        effectiveRate: calc.effectiveHourlyRate,
        overtimeHours: calc.overtimeHours,
      };
    });
  }, [totalHoursWorked, regularThresholdHours, overtimeMultiplier, hourlyRate]);

  // Observe container widths for responsive D3 rendering
  useEffect(() => {
    const hoursEl = hoursChartContainerRef.current;
    const earningsEl = earningsChartContainerRef.current;
    if (!hoursEl && !earningsEl) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(280, Math.floor(entry.contentRect.width));
        if (entry.target === hoursEl) setHoursChartWidth(w);
        if (entry.target === earningsEl) setEarningsChartWidth(w);
      }
    });

    if (hoursEl) ro.observe(hoursEl);
    if (earningsEl) ro.observe(earningsEl);
    return () => ro.disconnect();
  }, []);

  // Render D3 Chart 1: Weekly Hours Distribution (Mon-Sun Stacked Bar Chart)
  useEffect(() => {
    const svgEl = hoursSvgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const height = 260;
    const margin = { top: 24, right: 20, bottom: 36, left: 44 };
    const innerWidth = Math.max(200, hoursChartWidth - margin.left - margin.right);
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('width', hoursChartWidth).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand<string>()
      .domain(dailyBreakdownData.map((d) => d.shortDay))
      .range([0, innerWidth])
      .padding(0.28);

    const maxDayHours = Math.max(
      12,
      d3.max(dailyBreakdownData, (d) => d.hours) || 10,
      regularThresholdHours / 5 + 2
    );

    const y = d3.scaleLinear().domain([0, maxDayHours]).nice().range([innerHeight, 0]);

    // Horizontal grid lines
    g.append('g')
      .attr('class', 'grid-lines')
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

    // Axes
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

    // Regular Hours Bars
    g.selectAll('.bar-reg')
      .data(dailyBreakdownData)
      .join('rect')
      .attr('class', 'bar-reg')
      .attr('x', (d) => x(d.shortDay) || 0)
      .attr('width', x.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', '#3B82F6')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        const [mx, my] = d3.pointer(event, svgEl);
        setHoursTooltip({
          title: `${d.day} (${d.hours}h total)`,
          subtitle: `Est. Daily Pay: $${d.dayTotalPay.toFixed(2)}`,
          regularLabel: `Regular: ${d.regHours}h ($${d.dayRegPay.toFixed(2)})`,
          overtimeLabel: `Overtime: ${d.otHours}h ($${d.dayOtPay.toFixed(2)})`,
          totalLabel: `Rate: $${hourlyRate}/hr (${overtimeMultiplier}x OT)`,
          x: mx,
          y: Math.max(20, my - 10),
        });
      })
      .on('mouseleave', () => setHoursTooltip(null))
      .transition()
      .duration(450)
      .attr('y', (d) => y(d.regHours))
      .attr('height', (d) => Math.max(0, innerHeight - y(d.regHours)));

    // Overtime Hours Bars (stacked on top of Regular Hours)
    g.selectAll('.bar-ot')
      .data(dailyBreakdownData)
      .join('rect')
      .attr('class', 'bar-ot')
      .attr('x', (d) => x(d.shortDay) || 0)
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.regHours))
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', '#F59E0B')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        const [mx, my] = d3.pointer(event, svgEl);
        setHoursTooltip({
          title: `${d.day} (${d.hours}h total)`,
          subtitle: `Est. Daily Pay: $${d.dayTotalPay.toFixed(2)}`,
          regularLabel: `Regular: ${d.regHours}h ($${d.dayRegPay.toFixed(2)})`,
          overtimeLabel: `Overtime: ${d.otHours}h ($${d.dayOtPay.toFixed(2)})`,
          totalLabel: `Rate: $${hourlyRate}/hr (${overtimeMultiplier}x OT)`,
          x: mx,
          y: Math.max(20, my - 10),
        });
      })
      .on('mouseleave', () => setHoursTooltip(null))
      .transition()
      .duration(500)
      .attr('y', (d) => y(d.regHours + d.otHours))
      .attr('height', (d) => Math.max(0, y(d.regHours) - y(d.regHours + d.otHours)));

    // Value labels above bars
    g.selectAll('.bar-label')
      .data(dailyBreakdownData)
      .join('text')
      .attr('class', 'bar-label')
      .attr('x', (d) => (x(d.shortDay) || 0) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.hours) - 6)
      .attr('text-anchor', 'middle')
      .attr('fill', '#CBD5E1')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('font-weight', '700')
      .text((d) => (d.hours > 0 ? `${d.hours}h` : ''));

    // Standard Daily Reference Line (e.g. 8h/day)
    const stdDaily = Number((regularThresholdHours / 5).toFixed(1));
    if (stdDaily > 0 && stdDaily <= maxDayHours) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', y(stdDaily))
        .attr('y2', y(stdDaily))
        .attr('stroke', '#10B981')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5,4');

      g.append('text')
        .attr('x', innerWidth - 4)
        .attr('y', y(stdDaily) - 5)
        .attr('text-anchor', 'end')
        .attr('fill', '#34D399')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .text(`Std ${stdDaily}h/day`);
    }
  }, [dailyBreakdownData, hoursChartWidth, regularThresholdHours, hourlyRate, overtimeMultiplier]);

  // Render D3 Chart 2: Overtime Earnings Trends Across Workload Scenarios
  useEffect(() => {
    const svgEl = earningsSvgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const height = 260;
    const margin = { top: 24, right: 20, bottom: 36, left: 56 };
    const innerWidth = Math.max(200, earningsChartWidth - margin.left - margin.right);
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('width', earningsChartWidth).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand<string>()
      .domain(earningsTrendData.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.26);

    const maxPay = Math.max(500, d3.max(earningsTrendData, (d) => d.totalPay) || 1000) * 1.12;
    const y = d3.scaleLinear().domain([0, maxPay]).nice().range([innerHeight, 0]);

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
    xAxis
      .selectAll('text')
      .attr('fill', (d) => {
        const match = earningsTrendData.find((item) => item.label === d);
        return match?.isCurrent ? '#38BDF8' : '#94A3B8';
      })
      .attr('font-size', '11px')
      .attr('font-family', 'monospace')
      .attr('font-weight', '700');
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

    // Regular Pay Bars
    g.selectAll('.bar-pay-reg')
      .data(earningsTrendData)
      .join('rect')
      .attr('class', 'bar-pay-reg')
      .attr('x', (d) => x(d.label) || 0)
      .attr('width', x.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', (d) => (d.isCurrent ? '#2563EB' : '#1E40AF'))
      .attr('stroke', (d) => (d.isCurrent ? '#38BDF8' : 'none'))
      .attr('stroke-width', (d) => (d.isCurrent ? 1.5 : 0))
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        const [mx, my] = d3.pointer(event, svgEl);
        setEarningsTooltip({
          title: `${d.hours} Weekly Hours ${d.isCurrent ? '(Active)' : ''}`,
          subtitle: `Total Gross Pay: $${d.totalPay.toFixed(2)}`,
          regularLabel: `Regular Pay: $${d.regularPay.toFixed(2)}`,
          overtimeLabel: `Overtime Bonus (${d.overtimeHours}h): +$${d.overtimePay.toFixed(2)}`,
          totalLabel: `Effective Rate: $${d.effectiveRate.toFixed(2)}/hr`,
          x: mx,
          y: Math.max(20, my - 10),
        });
      })
      .on('mouseleave', () => setEarningsTooltip(null))
      .transition()
      .duration(450)
      .attr('y', (d) => y(d.regularPay))
      .attr('height', (d) => Math.max(0, innerHeight - y(d.regularPay)));

    // Overtime Pay Stacked Bars
    g.selectAll('.bar-pay-ot')
      .data(earningsTrendData)
      .join('rect')
      .attr('class', 'bar-pay-ot')
      .attr('x', (d) => x(d.label) || 0)
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.regularPay))
      .attr('height', 0)
      .attr('rx', 4)
      .attr('fill', (d) => (d.isCurrent ? '#F59E0B' : '#D97706'))
      .attr('stroke', (d) => (d.isCurrent ? '#FDE68A' : 'none'))
      .attr('stroke-width', (d) => (d.isCurrent ? 1.5 : 0))
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        const [mx, my] = d3.pointer(event, svgEl);
        setEarningsTooltip({
          title: `${d.hours} Weekly Hours ${d.isCurrent ? '(Active)' : ''}`,
          subtitle: `Total Gross Pay: $${d.totalPay.toFixed(2)}`,
          regularLabel: `Regular Pay: $${d.regularPay.toFixed(2)}`,
          overtimeLabel: `Overtime Bonus (${d.overtimeHours}h): +$${d.overtimePay.toFixed(2)}`,
          totalLabel: `Effective Rate: $${d.effectiveRate.toFixed(2)}/hr`,
          x: mx,
          y: Math.max(20, my - 10),
        });
      })
      .on('mouseleave', () => setEarningsTooltip(null))
      .transition()
      .duration(500)
      .attr('y', (d) => y(d.totalPay))
      .attr('height', (d) => Math.max(0, y(d.regularPay) - y(d.totalPay)));

    // Total Pay Labels above bars
    g.selectAll('.pay-label')
      .data(earningsTrendData)
      .join('text')
      .attr('class', 'pay-label')
      .attr('x', (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.totalPay) - 6)
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => (d.isCurrent ? '#38BDF8' : '#CBD5E1'))
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('font-weight', '700')
      .text((d) => `$${Math.round(d.totalPay)}`);
  }, [earningsTrendData, earningsChartWidth]);

  const handleDailyHourChange = (dayIndex: number, newHours: number) => {
    const safeHours = Math.max(0, Math.min(24, Number(newHours) || 0));
    const base = customDailyHours
      ? [...customDailyHours]
      : dailyDistribution.map((d) => d.hours);
    base[dayIndex] = safeHours;
    setCustomDailyHours(base);
    const sum = Number(base.reduce((acc, v) => acc + v, 0).toFixed(2));
    setTotalHoursWorked(sum);
  };

  const handleSelectPreset = (presetId: string) => {
    setActivePreset(presetId);
    setCustomDailyHours(null);
  };

  const handleCopy = () => {
    const summary = `Overtime Estimate: Regular ${result.regularHours}h ($${result.regularPay}) + Overtime ${result.overtimeHours}h @ ${overtimeMultiplier}x ($${result.overtimePay}) = Total $${result.totalEstimatedPay}`;
    navigator.clipboard?.writeText(summary).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 6 Cols: Configurable Inputs */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xs">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#2563EB]" />
            <span>Configure Hours, Threshold &amp; Multiplier</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Total Hours Worked
              </label>
              <input
                type="number"
                step="0.25"
                min={0}
                max={168}
                value={totalHoursWorked}
                onChange={(e) => {
                  setCustomDailyHours(null);
                  setTotalHoursWorked(Math.max(0, Number(e.target.value) || 0));
                }}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Overtime Threshold (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min={1}
                max={168}
                value={regularThresholdHours}
                onChange={(e) => setRegularThresholdHours(Math.max(0, Number(e.target.value) || 40))}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Overtime Multiplier
              </label>
              <div className="flex gap-2">
                {[1.5, 2.0].map((mult) => (
                  <button
                    key={mult}
                    type="button"
                    onClick={() => setOvertimeMultiplier(mult)}
                    className={`px-3 h-11 rounded-xl text-xs font-bold border cursor-pointer ${
                      overtimeMultiplier === mult
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {mult}x
                  </button>
                ))}
                <input
                  type="number"
                  step="0.1"
                  min={1}
                  max={5}
                  value={overtimeMultiplier}
                  onChange={(e) => setOvertimeMultiplier(Math.max(1, Number(e.target.value) || 1.5))}
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Base Hourly Rate (Optional)
              </label>
              <input
                type="number"
                step="0.5"
                min={0}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Math.max(0, Number(e.target.value) || 0))}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base font-mono font-bold"
              />
            </div>
          </div>

          {/* Weekly Distribution Profile Controls */}
          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Weekly Shift Distribution Profile</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Adjust daily hours below to customize chart
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {SCHEDULE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    activePreset === preset.id && !customDailyHours
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {dailyBreakdownData.map((d, idx) => (
                <div key={d.shortDay} className="text-center">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    {d.shortDay}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min={0}
                    max={24}
                    value={d.hours}
                    onChange={(e) => handleDailyHourChange(idx, Number(e.target.value))}
                    className="w-full h-9 px-1 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>Important Disclosure:</strong> All figures are mathematical estimates based on your configured threshold and multiplier. Employment laws, overtime eligibility, daily vs. weekly thresholds, and tax withholdings vary by country, state, and collective bargaining agreements.
          </div>
        </div>

        {/* Right 6 Cols: Breakdown Card */}
        <div className="lg:col-span-6 bg-[#0F172A] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg space-y-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Regular vs. Overtime Breakdown
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Regular Hours (1.0x)</div>
              <div className="text-2xl font-black font-mono tabular-nums mt-1">
                {result.regularHours} hrs
              </div>
              <div className="text-xs font-mono text-slate-400 mt-1">
                Est. Pay: ${result.regularPay.toFixed(2)}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-amber-400">
                Overtime Hours ({overtimeMultiplier}x)
              </div>
              <div className="text-2xl font-black font-mono tabular-nums text-amber-300 mt-1">
                {result.overtimeHours} hrs
              </div>
              <div className="text-xs font-mono text-slate-400 mt-1">
                Est. Pay: ${result.overtimePay.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Total Estimated Gross Pay</div>
              <div className="text-3xl font-black font-mono tabular-nums text-emerald-400 mt-0.5">
                ${result.totalEstimatedPay.toFixed(2)}
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs text-slate-400">Effective Rate</div>
              <div className="text-lg font-bold text-white">
                ${result.effectiveHourlyRate.toFixed(2)}/hr
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full h-11 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Breakdown Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Overtime Breakdown</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive D3.js Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* D3 Chart 1: Weekly Hours Distribution */}
        <div className="lg:col-span-6 bg-[#0F172A] text-white rounded-2xl p-6 border border-slate-800 shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400">
                D3.js Interactive Visualization
              </span>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 mt-0.5">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span>Weekly Hours Distribution (Mon–Sun)</span>
              </h3>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-500 inline-block" />
                Regular (1.0x)
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" />
                Overtime ({overtimeMultiplier}x)
              </span>
            </div>
          </div>

          <div ref={hoursChartContainerRef} className="relative w-full overflow-hidden">
            <svg
              ref={hoursSvgRef}
              className="w-full block select-none"
              role="img"
              aria-label="Weekly Hours Distribution D3 Bar Chart"
            />
            {hoursTooltip && (
              <div
                style={{
                  left: Math.min(hoursChartWidth - 190, Math.max(8, hoursTooltip.x - 80)),
                  top: Math.max(8, hoursTooltip.y - 78),
                }}
                className="pointer-events-none absolute z-20 rounded-xl bg-slate-950/95 border border-slate-700 px-3 py-2 text-xs font-mono text-white shadow-xl space-y-0.5"
              >
                <div className="font-bold text-blue-300">{hoursTooltip.title}</div>
                <div className="text-emerald-400 font-bold">{hoursTooltip.subtitle}</div>
                <div className="text-slate-300">{hoursTooltip.regularLabel}</div>
                <div className="text-amber-300">{hoursTooltip.overtimeLabel}</div>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Hover over any daily bar to inspect regular vs. overtime hours and estimated daily earnings.
          </p>
        </div>

        {/* D3 Chart 2: Overtime Earnings Trends Across Workload Scenarios */}
        <div className="lg:col-span-6 bg-[#0F172A] text-white rounded-2xl p-6 border border-slate-800 shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
                D3.js Earnings Curve
              </span>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 mt-0.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Overtime Earnings Trends by Weekly Hours</span>
              </h3>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 inline-block" />
                Base Pay
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" />
                OT Premium
              </span>
            </div>
          </div>

          <div ref={earningsChartContainerRef} className="relative w-full overflow-hidden">
            <svg
              ref={earningsSvgRef}
              className="w-full block select-none"
              role="img"
              aria-label="Overtime Earnings Trends D3 Bar Chart"
            />
            {earningsTooltip && (
              <div
                style={{
                  left: Math.min(earningsChartWidth - 200, Math.max(8, earningsTooltip.x - 90)),
                  top: Math.max(8, earningsTooltip.y - 78),
                }}
                className="pointer-events-none absolute z-20 rounded-xl bg-slate-950/95 border border-slate-700 px-3 py-2 text-xs font-mono text-white shadow-xl space-y-0.5"
              >
                <div className="font-bold text-sky-300">{earningsTooltip.title}</div>
                <div className="text-emerald-400 font-bold">{earningsTooltip.subtitle}</div>
                <div className="text-slate-300">{earningsTooltip.regularLabel}</div>
                <div className="text-amber-300">{earningsTooltip.overtimeLabel}</div>
                <div className="text-slate-400">{earningsTooltip.totalLabel}</div>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Compares total weekly pay across workload tiers ({regularThresholdHours}h threshold @ {overtimeMultiplier}x multiplier). Your active {totalHoursWorked}h schedule is highlighted.
          </p>
        </div>
      </div>
    </div>
  );
}
