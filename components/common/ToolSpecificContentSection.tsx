import React from 'react';
import { getToolSpecificContent } from '@/lib/tool-specific-content';
import { CheckCircle2, HelpCircle, ListOrdered } from 'lucide-react';

interface ToolSpecificContentSectionProps {
  slug: string;
  toolName: string;
  extraFaqs?: Array<{ question: string; answer: string }>;
}

export default function ToolSpecificContentSection({
  slug,
  toolName,
  extraFaqs = [],
}: ToolSpecificContentSectionProps) {
  const content = getToolSpecificContent(slug);
  if (!content) return null;

  const seenQuestions = new Set<string>();
  const combinedFaqs: Array<{ question: string; answer: string }> = [];

  for (const faq of [...content.faqs, ...extraFaqs]) {
    const normalized = faq.question.trim().toLowerCase();
    if (!seenQuestions.has(normalized)) {
      seenQuestions.add(normalized);
      combinedFaqs.push(faq);
    }
  }

  return (
    <div className="space-y-8">
      {/* Real Use Cases + How to Use Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real Use Cases */}
        <section
          aria-labelledby="use-cases-heading"
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h2
              id="use-cases-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white"
            >
              {toolName} Use Cases &amp; Best Applications
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            {content.useCasesIntro}
          </p>
          <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {content.useCases.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Short How to Use Section */}
        <section
          aria-labelledby="how-to-use-heading"
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ListOrdered className="w-4 h-4" />
            </div>
            <h2
              id="how-to-use-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white"
            >
              How to Use the {toolName}
            </h2>
          </div>
          {content.howToUseNarrative && content.howToUseNarrative.length > 0 && (
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {content.howToUseNarrative.map((para, pIdx) => (
                <p key={pIdx}>{para}</p>
              ))}
            </div>
          )}
          <ol className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {content.howToUse.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-slate-200 dark:border-slate-700">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Expanded Direct-Answer FAQs */}
      <section
        aria-labelledby="faq-heading"
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h2
              id="faq-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white"
            >
              {toolName}: Frequently Asked Questions
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Direct answers for users &amp; AI search assistants
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {combinedFaqs.map((faq, idx) => (
            <article
              key={idx}
              data-faq-item="true"
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
