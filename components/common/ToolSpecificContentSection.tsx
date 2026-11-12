import React from 'react';
import { getToolSpecificContent } from '@/lib/tool-specific-content';
import { CheckCircle2, HelpCircle, ListOrdered } from 'lucide-react';

interface ToolSpecificContentSectionProps {
  slug: string;
  toolName: string;
}

export default function ToolSpecificContentSection({
  slug,
  toolName,
}: ToolSpecificContentSectionProps) {
  const content = getToolSpecificContent(slug);
  if (!content) return null;

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
              {toolName} Use Cases
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

      {/* 3 Unique FAQs */}
      <section
        aria-labelledby="faq-heading"
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm"
      >
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h2
            id="faq-heading"
            className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white"
          >
            {toolName} FAQs
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {content.faqs.map((faq, idx) => (
            <div
              key={idx}
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
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
