import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SoundThemeProvider } from '@/components/sound/SoundThemeProvider';
import { LanguageProvider } from '@/components/i18n/LanguageProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://WebCountDownTimer.com'),
  title: 'WebCountDownTimer – Every Second, Under Control | Precision Time Tools',
  description:
    'Free, simple and reliable time tools at WebCountDownTimer.com for work, events, learning and everyday life. Stage timer, countdown timer, stopwatch, world clock, and pomodoro timer.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: [{ url: '/apple-touch-icon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'WebCountDownTimer – Precision Time Tools',
    description:
      'Free, simple and reliable time tools at WebCountDownTimer.com for work, events, learning and everyday life. Stage timer, countdown timer, stopwatch, world clock, and pomodoro timer.',
    url: 'https://WebCountDownTimer.com',
    type: 'website',
    siteName: 'WebCountDownTimer',
    images: [{ url: '/logo.svg', width: 512, height: 512, alt: 'WebCountDownTimer Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebCountDownTimer – Precision Time Tools',
    description:
      'Free, simple and reliable time tools at WebCountDownTimer.com for work, events, learning and everyday life. Stage timer, countdown timer, stopwatch, world clock, and pomodoro timer.',
    images: ['/logo.svg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'WebCountDownTimer',
    url: 'https://WebCountDownTimer.com',
    logo: 'https://WebCountDownTimer.com/logo.svg',
    description:
      'Precision online countdown timers, visual and sensory timers, stage confidence monitors, world clocks, and date/time calculators.',
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'WebCountDownTimer',
    url: 'https://WebCountDownTimer.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://WebCountDownTimer.com/tools?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col bg-[#F7F6F2] dark:bg-[#121614] text-[#252B27] dark:text-[#E7EDE7] antialiased font-sans transition-colors"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <SoundThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </LanguageProvider>
        </SoundThemeProvider>
      </body>
    </html>
  );
}

