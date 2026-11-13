import React from 'react';
import { getCanonicalUrl } from '@/lib/seo-metadata';

export interface BreadcrumbCrumb {
  name: string;
  path: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbCrumb[];
}

export default function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  if (!items || items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.path.startsWith('http') ? crumb.path : getCanonicalUrl(crumb.path),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
