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
}

export default function SEOStructuredData({
  toolName,
  description,
  url,
  faqs = [],
  breadcrumbs = [],
}: SEOStructuredDataProps) {
  const normalizedBreadcrumbs =
    breadcrumbs.length > 0
      ? breadcrumbs
      : [
          { name: 'Home', item: 'https://webcountdowntimer.com/' },
          { name: 'Tools', item: 'https://webcountdowntimer.com/tools' },
          { name: toolName, item: url },
        ];

  const softwareApplicationNode = {
    '@type': 'SoftwareApplication',
    name: toolName,
    url: url,
    description: description,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const breadcrumbListNode = {
    '@type': 'BreadcrumbList',
    itemListElement: normalizedBreadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };

  const graphNodes: Record<string, unknown>[] = [
    softwareApplicationNode,
    ...(faqs.length > 0
      ? [
          {
            '@type': 'FAQPage',
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
