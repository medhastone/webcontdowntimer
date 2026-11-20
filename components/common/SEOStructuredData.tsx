import React from 'react';

type StepItem = string | { step?: number; title?: string; description: string };

interface SEOStructuredDataProps {
  toolName: string;
  description: string;
  url: string;
  faqs?: Array<{ question: string; answer: string }>;
  breadcrumbs?: Array<{ name: string; item: string }>;
  steps?: StepItem[];
  applicationCategory?: string;
  featureList?: string[];
  extraNodes?: Record<string, unknown>[];
}

export default function SEOStructuredData({
  toolName,
  description,
  url,
  faqs = [],
  breadcrumbs = [],
  applicationCategory = 'UtilitiesApplication',
  featureList = [],
  extraNodes = [],
}: SEOStructuredDataProps) {
  const normalizedBreadcrumbs =
    breadcrumbs.length > 0
      ? breadcrumbs
      : [
          { name: 'Home', item: 'https://webcountdowntimer.com' },
          { name: 'Tools', item: 'https://webcountdowntimer.com/tools' },
          { name: toolName, item: url },
        ];

  const webApplicationNode: Record<string, unknown> = {
    '@type': 'WebApplication',
    '@id': `${url}#app`,
    name: toolName,
    url: url,
    description: description,
    applicationCategory,
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Works in modern desktop and mobile browsers.',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    ...(featureList.length > 0 ? { featureList } : {}),
  };

  const breadcrumbListNode = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: normalizedBreadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };

  const graphNodes: Record<string, unknown>[] = [
    webApplicationNode,
    ...extraNodes,
    ...(faqs.length > 0
      ? [
          {
            '@type': 'FAQPage',
            '@id': `${url}#faq`,
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          },
        ]
      : []),
    breadcrumbListNode,
  ];

  const structuredDataGraph = {
    '@context': 'https://schema.org',
    '@graph': graphNodes,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataGraph) }}
    />
  );
}
