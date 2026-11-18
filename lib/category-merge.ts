import type { CategoryData, CategoryToolItem } from '@/lib/category-data';
import { TOOLS_REGISTRY, getToolCanonicalPath } from '@/lib/tools-registry';
import { APPROVED_DURATION_SLUGS, getDurationPageData } from '@/lib/duration-timers-data';

export function mergeCategoryToolsForPage(data: CategoryData): CategoryData {
  const existingHrefs = new Set(data.tools.map((t) => t.href));
  const extras: CategoryToolItem[] = [];
  const catSlug = data.slug;

  for (const regTool of TOOLS_REGISTRY) {
    const canonicalHref = getToolCanonicalPath(regTool.slug);
    if (existingHrefs.has(canonicalHref) || existingHrefs.has(`/${regTool.slug}`)) {
      continue;
    }

    const isFitness =
      regTool.slug === 'tabata-timer' ||
      regTool.slug === 'boxing-timer' ||
      regTool.slug === 'meditation-timer' ||
      regTool.slug === 'breathing-timer' ||
      regTool.slug === 'interval-timer' ||
      regTool.slug === 'multi-stopwatch' ||
      regTool.slug === 'heart-timer';

    const isEducation =
      regTool.slug === 'classroom-timer' ||
      regTool.slug === 'random-name-picker' ||
      regTool.slug === 'random-group-generator' ||
      regTool.slug === 'classroom-noise-meter' ||
      regTool.slug === 'quiz-timer' ||
      regTool.slug === 'classroom-scoreboard' ||
      regTool.slug === 'bingo-caller' ||
      regTool.slug === 'seating-chart-maker' ||
      regTool.slug === 'visual-timer' ||
      regTool.slug === 'picture-reveal-timer' ||
      regTool.slug === 'rainbow-timer';

    const isCalculator =
      regTool.slug.includes('calculator') ||
      regTool.slug === 'time-converter' ||
      regTool.slug === 'minutes-to-hours' ||
      regTool.slug === 'seconds-to-minutes' ||
      regTool.slug === 'hours-to-minutes' ||
      regTool.slug === 'what-time-will-it-be' ||
      regTool.slug === 'unix-timestamp-converter';

    let matchesHub = false;
    if (catSlug === 'education' && isEducation) matchesHub = true;
    else if ((catSlug === 'events' || catSlug === 'stage') && regTool.category === 'stage' && !isEducation) matchesHub = true;
    else if (catSlug === 'fitness' && isFitness) matchesHub = true;
    else if (catSlug === 'productivity' && regTool.category === 'productivity' && !isFitness) matchesHub = true;
    else if (catSlug === 'calculators' && isCalculator) matchesHub = true;
    else if ((catSlug === 'world' || catSlug === 'world-clock') && regTool.category === 'world') matchesHub = true;
    else if ((catSlug === 'timers' || catSlug === 'everyday') && regTool.category === 'everyday') matchesHub = true;

    if (matchesHub) {
      existingHrefs.add(canonicalHref);
      extras.push({
        name: regTool.name,
        description: regTool.description,
        href: canonicalHref,
        iconName: regTool.icon || 'Clock',
        badge: regTool.badge,
      });
    }
  }

  if (catSlug === 'timers' || catSlug === 'everyday') {
    for (const durSlug of APPROVED_DURATION_SLUGS) {
      const durHref = `/${durSlug}`;
      if (!existingHrefs.has(durHref)) {
        const durData = getDurationPageData(durSlug);
        if (durData) {
          existingHrefs.add(durHref);
          extras.push({
            name: `${durData.unitLabel} Timer`,
            description: durData.metaDescription,
            href: durHref,
            iconName: 'Clock',
            tier: 'hot',
          });
        }
      }
    }
  }

  return {
    ...data,
    tools: [...data.tools, ...extras],
  };
}
