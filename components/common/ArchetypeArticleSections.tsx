import React from 'react';
import { getPractitionerArchetype } from '@/lib/practitioner-archetypes';
import {
  CheckCircle2,
  Presentation,
  Calculator,
  Clock,
  Globe,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface ArchetypeArticleSectionsProps {
  slug: string;
  toolName: string;
  categorySlug: string;
  renderFullArticle?: boolean;
}

export default function ArchetypeArticleSections({
  slug,
  toolName,
  categorySlug,
  renderFullArticle = true,
}: ArchetypeArticleSectionsProps) {
  const data = getPractitionerArchetype(slug, toolName, categorySlug);

  return (
    <div className="space-y-12">
      {/* 1. LEAD PRACTITIONER ESSAY (Rendered when renderFullArticle is true) */}
      {renderFullArticle && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#B7804C] dark:text-[#cda06f]">
            <span>{data.kicker}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] leading-tight font-normal text-[#252B27] dark:text-white text-balance">
            {data.leadHeading}
          </h2>
          <div className="space-y-3.5 text-sm sm:text-base text-[#252B27]/85 dark:text-slate-300 leading-relaxed">
            {data.leadParagraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </section>
      )}

      {/* 2. ARCHETYPE-SPECIFIC SIGNATURE STRUCTURAL BLOCK */}
      {data.archetype === 'run-of-show' && data.runOfShow && (
        <section className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] p-6 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E1D9] dark:border-[#2D352F] pb-4">
            <div>
              <div className="text-xs font-medium text-[#252B27]/60 dark:text-slate-400">
                Live Production Cue Sheet · Signal Transitions
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#252B27] dark:text-white mt-0.5">
                {data.runOfShow.slotLabel}
              </h3>
            </div>
            <Presentation className="w-5 h-5 text-[#365C4B] dark:text-[#5E917A] shrink-0" />
          </div>

          {/* 3-Stage Signal Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="rounded-xl border border-emerald-700/25 dark:border-emerald-500/30 bg-emerald-950/5 dark:bg-emerald-950/30 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-1">
                Green Phase · On Pace
              </div>
              <div className="font-mono tabular-nums text-xs sm:text-sm font-semibold text-[#252B27] dark:text-white">
                {data.runOfShow.greenMark}
              </div>
            </div>

            <div className="rounded-xl border border-amber-700/25 dark:border-amber-500/30 bg-amber-950/5 dark:bg-amber-950/30 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1">
                Amber Warning · Wrap Cue
              </div>
              <div className="font-mono tabular-nums text-xs sm:text-sm font-semibold text-[#252B27] dark:text-white">
                {data.runOfShow.amberMark}
              </div>
            </div>

            <div className="rounded-xl border border-rose-700/25 dark:border-rose-500/30 bg-rose-950/5 dark:bg-rose-950/30 p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 mb-1">
                Red Signal · Hard Stop
              </div>
              <div className="font-mono tabular-nums text-xs sm:text-sm font-semibold text-[#252B27] dark:text-white">
                {data.runOfShow.redMark}
              </div>
            </div>
          </div>

          <div className="pt-2 text-xs sm:text-sm text-[#252B27]/80 dark:text-slate-300 space-y-2">
            <div>
              <strong className="font-semibold text-[#252B27] dark:text-white">
                At 00:00 Overtime Rule:
              </strong>{' '}
              {data.runOfShow.overtimeRule}
            </div>
            <ul className="space-y-1.5 pt-1">
              {data.runOfShow.boothNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#365C4B] dark:text-[#5E917A] shrink-0 mt-0.5" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {data.archetype === 'formula-ledger' && data.workedLedger && (
        <section className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] p-6 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E1D9] dark:border-[#2D352F] pb-4">
            <div>
              <div className="text-xs font-medium text-[#252B27]/60 dark:text-slate-400">
                Verified Formula & Worked Calculation Ledger
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#252B27] dark:text-white mt-0.5">
                {data.workedLedger.formulaTitle}
              </h3>
            </div>
            <Calculator className="w-5 h-5 text-[#365C4B] dark:text-[#5E917A] shrink-0" />
          </div>

          {/* Mathematical Formula Box */}
          <div className="rounded-xl bg-[#F7F6F2] dark:bg-[#141816] border border-[#E4E1D9] dark:border-[#2D352F] p-4 font-mono tabular-nums text-xs sm:text-sm text-[#252B27] dark:text-emerald-200 overflow-x-auto">
            {data.workedLedger.formulaExpression}
          </div>

          {/* Worked Scenario */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#365C4B] dark:text-[#5E917A]">
              Worked Scenario: {data.workedLedger.scenarioName}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {data.workedLedger.inputs.map((inp, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-[#FAF9F6] dark:bg-[#1D2420] p-3.5"
                >
                  <div className="text-[11px] text-[#252B27]/60 dark:text-slate-400">
                    {inp.label}
                  </div>
                  <div className="font-mono tabular-nums text-xs sm:text-sm font-bold text-[#252B27] dark:text-white mt-0.5">
                    {inp.value}
                  </div>
                </div>
              ))}
            </div>

            <ol className="space-y-2 pt-2 font-mono tabular-nums text-xs sm:text-sm text-[#252B27]/85 dark:text-slate-300">
              {data.workedLedger.mathSteps.map((step, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-lg bg-[#F7F6F2]/70 dark:bg-[#161B18] border border-[#E4E1D9]/60 dark:border-[#262E29]"
                >
                  {step}
                </li>
              ))}
            </ol>

            <div className="p-4 rounded-xl bg-[#E7EDE7]/70 dark:bg-[#212B25] border border-[#C9D6CA] dark:border-[#324238] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#365C4B] dark:text-[#70A98E]">
                Verified Output
              </span>
              <span className="font-mono tabular-nums text-xs sm:text-sm font-bold text-[#252B27] dark:text-white">
                {data.workedLedger.finalOutput}
              </span>
            </div>

            <p className="text-xs text-[#252B27]/75 dark:text-slate-400 pt-1">
              <strong className="font-semibold text-[#252B27] dark:text-slate-200">
                Audit Note:
              </strong>{' '}
              {data.workedLedger.auditWarning}
            </p>
          </div>
        </section>
      )}

      {data.archetype === 'coach-brief' && data.coachPhases && (
        <section className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] p-6 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E1D9] dark:border-[#2D352F] pb-4">
            <div>
              <div className="text-xs font-medium text-[#252B27]/60 dark:text-slate-400">
                Session Pacing Split · Coach’s Protocol
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#252B27] dark:text-white mt-0.5">
                {data.coachPhases.blueprintTitle}
              </h3>
            </div>
            <Clock className="w-5 h-5 text-[#365C4B] dark:text-[#5E917A] shrink-0" />
          </div>

          {/* Proportional Visual Split Bar */}
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#E4E1D9] dark:bg-[#2D352F]">
            {data.coachPhases.phases.map((p, idx) => {
              const bgColors = [
                'bg-[#365C4B]',
                'bg-[#B7804C]',
                'bg-[#5E917A]',
              ];
              return (
                <div
                  key={idx}
                  style={{ width: `${p.sharePercent}%` }}
                  className={`${bgColors[idx % bgColors.length]} h-full`}
                  title={`${p.phase} (${p.sharePercent}%)`}
                />
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.coachPhases.phases.map((p, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-[#FAF9F6] dark:bg-[#161B18] p-4 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-[#252B27]/60 dark:text-slate-400 font-mono tabular-nums">
                  <span>{p.window}</span>
                  <span>{p.sharePercent}%</span>
                </div>
                <div className="font-bold text-sm text-[#252B27] dark:text-white">
                  {p.phase}
                </div>
                <p className="text-xs text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                  {p.cue}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E4E1D9] dark:border-[#2D352F]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#B7804C] dark:text-[#cda06f] mb-2.5">
              {data.coachPhases.pacingMistakesTitle}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#252B27]/80 dark:text-slate-300">
              {data.coachPhases.pacingMistakes.map((mistake, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="font-mono font-bold text-[#B7804C] shrink-0">
                    0{idx + 1}.
                  </span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {data.archetype === 'sensory-studio' && data.sensoryMatrix && (
        <section className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] p-6 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E1D9] dark:border-[#2D352F] pb-4">
            <div>
              <div className="text-xs font-medium text-[#252B27]/60 dark:text-slate-400">
                Classroom & Sensory Environment Specification
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#252B27] dark:text-white mt-0.5">
                Room Setup & Three Field-Tested Routines
              </h3>
            </div>
            <Sparkles className="w-5 h-5 text-[#365C4B] dark:text-[#5E917A] shrink-0" />
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-[#FAF9F6] dark:bg-[#161B18] p-3.5">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-[#252B27]/60 dark:text-slate-400">
                Optimal Viewing Distance
              </dt>
              <dd className="text-xs sm:text-sm font-medium text-[#252B27] dark:text-white mt-1">
                {data.sensoryMatrix.viewingDistance}
              </dd>
            </div>
            <div className="rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-[#FAF9F6] dark:bg-[#161B18] p-3.5">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-[#252B27]/60 dark:text-slate-400">
                Surface & Contrast Profile
              </dt>
              <dd className="text-xs sm:text-sm font-medium text-[#252B27] dark:text-white mt-1">
                {data.sensoryMatrix.ambientContrast}
              </dd>
            </div>
            <div className="rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-[#FAF9F6] dark:bg-[#161B18] p-3.5">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-[#252B27]/60 dark:text-slate-400">
                Acoustic & Motion Spec
              </dt>
              <dd className="text-xs sm:text-sm font-medium text-[#252B27] dark:text-white mt-1">
                {data.sensoryMatrix.soundProfile}
              </dd>
            </div>
          </dl>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            {data.sensoryMatrix.routines.map((r, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] p-4 space-y-1.5"
              >
                <div className="font-mono tabular-nums text-xs font-semibold text-[#365C4B] dark:text-[#5E917A]">
                  {r.timing}
                </div>
                <h4 className="font-bold text-sm text-[#252B27] dark:text-white">
                  {r.title}
                </h4>
                <p className="text-xs text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                  {r.setup}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.archetype === 'global-desk' && data.globalCorridor && (
        <section className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] p-6 sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E1D9] dark:border-[#2D352F] pb-4">
            <div>
              <div className="text-xs font-medium text-[#252B27]/60 dark:text-slate-400">
                International Scheduling Corridor & DST Briefing
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#252B27] dark:text-white mt-0.5">
                {data.globalCorridor.corridorLabel}
              </h3>
            </div>
            <Globe className="w-5 h-5 text-[#365C4B] dark:text-[#5E917A] shrink-0" />
          </div>

          <div className="rounded-xl bg-[#F7F6F2] dark:bg-[#141816] border border-[#E4E1D9] dark:border-[#2D352F] p-4 font-mono tabular-nums text-xs sm:text-sm text-[#252B27] dark:text-emerald-200">
            {data.globalCorridor.utcFormula}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.globalCorridor.playbooks.map((pb, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#E4E1D9] dark:border-[#2D352F] bg-[#FAF9F6] dark:bg-[#161B18] p-4 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-[#252B27] dark:text-white">
                    {pb.regionPair}
                  </span>
                  <span className="font-mono tabular-nums text-xs font-semibold text-[#365C4B] dark:text-[#5E917A]">
                    {pb.bestSlotUtc}
                  </span>
                </div>
                <div className="font-mono tabular-nums text-xs text-[#252B27]/80 dark:text-slate-300">
                  {pb.localTimes}
                </div>
                <p className="text-xs text-[#252B27]/70 dark:text-slate-400 pt-1">
                  {pb.tip}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs sm:text-sm text-[#252B27]/80 dark:text-slate-300">
            <strong className="font-semibold text-[#252B27] dark:text-white">
              Seasonal DST Trap to Watch:
            </strong>{' '}
            {data.globalCorridor.dstTrapWarning}
          </p>
        </section>
      )}

      {/* 3. PRACTITIONER EXECUTION CHECKLIST (Rendered when renderFullArticle is true) */}
      {renderFullArticle && (
        <section className="space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white">
            {data.executionHeading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.executionSteps.map((step, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] bg-white dark:bg-[#1A201C] p-5 space-y-2"
              >
                <div className="font-mono tabular-nums text-xs font-bold text-[#365C4B] dark:text-[#5E917A]">
                  0{idx + 1}. STEP
                </div>
                <h3 className="font-bold text-sm sm:text-base text-[#252B27] dark:text-white">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#252B27]/75 dark:text-slate-300 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. BESPOKE DOMAIN REFERENCE TABLE (Unique columns & data per tool) */}
      <section className="space-y-3.5">
        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#252B27] dark:text-white">
          {data.tableSectionTitle}
        </h2>
        <p className="text-sm sm:text-base text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
          {data.tableSectionIntro}
        </p>
        <div className="rounded-2xl border border-[#E4E1D9] dark:border-[#2D352F] overflow-hidden bg-white dark:bg-[#1A201C]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
              <thead>
                <tr className="bg-[#365C4B] text-white">
                  <th scope="col" className="py-3.5 px-4 font-semibold">
                    {data.tableColumns[0]}
                  </th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">
                    {data.tableColumns[1]}
                  </th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">
                    {data.tableColumns[2]}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E1D9] dark:divide-[#2D352F]">
                {data.tableRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={
                      idx % 2 === 0
                        ? 'bg-transparent'
                        : 'bg-[#F7F6F2]/55 dark:bg-[#1D2420]/50'
                    }
                  >
                    <td className="py-3.5 px-4 font-semibold text-[#252B27] dark:text-white">
                      {row[0]}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-[#252B27]/85 dark:text-slate-300">
                      {row[1]}
                    </td>
                    <td className="py-3.5 px-4 text-[#252B27]/75 dark:text-slate-400">
                      {row[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. PRACTITIONER FIELD NOTES */}
      <section className="rounded-2xl border border-[#E8DEC8] dark:border-[#353E37] bg-[#FAF6F0] dark:bg-[#202521] p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#B7804C] dark:text-[#cda06f]">
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>{data.fieldNotesTitle}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.fieldNotes.map((fn, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#E8DEC8] dark:border-[#353E37] bg-white/80 dark:bg-[#181D1A]/80 p-4 space-y-1.5"
            >
              <h3 className="font-bold text-sm text-[#252B27] dark:text-white">
                {fn.label}
              </h3>
              <p className="text-xs sm:text-sm text-[#252B27]/80 dark:text-slate-300 leading-relaxed">
                {fn.note}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
