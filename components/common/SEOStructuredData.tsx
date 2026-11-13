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
}

export default function SEOStructuredData({
  toolName,
  description,
  url,
  faqs = [],
  breadcrumbs = [],
  steps = [],
  applicationCategory = 'UtilitiesApplication',
}: SEOStructuredDataProps) {
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: toolName,
    url: url,
    description: description,
    applicationCategory: applicationCategory || 'UtilitiesApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const faqSchema =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  const breadcrumbSchema =
    breadcrumbs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((crumb, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: crumb.name,
            item: crumb.item,
          })),
        }
      : null;

  const howToSchema =
    steps.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: `How to Use ${toolName}`,
          description: description,
          step: steps.map((item, idx) => {
            if (typeof item === 'string') {
              return {
                '@type': 'HowToStep',
                position: idx + 1,
                name: `Step ${idx + 1}`,
                text: item,
              };
            }
            return {
              '@type': 'HowToStep',
              position: item.step ?? idx + 1,
              name: item.title || `Step ${idx + 1}`,
              text: item.description,
            };
          }),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
    </>
  );
}
