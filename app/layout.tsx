import type { Metadata } from 'next';
import { DM_Sans, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SoundThemeProvider } from '@/components/sound/SoundThemeProvider';
import { LanguageProvider } from '@/components/i18n/LanguageProvider';
import { REAL_SAME_AS_URLS } from '@/lib/site-config';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  variable: '--font-dm-sans',
  display: 'swap',
  preload: true,
});

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal'],
  variable: '--font-source-serif',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://webcountdowntimer.com'),
  title: 'Free Online Countdown Timer, Stage Timer & Visual Timer | WebCountDownTimer',
  description:
    'Free online countdown timer, stopwatch, stage timer, and visual timers for classrooms, meetings, workouts, and daily tasks. No sign-up required.',
  alternates: {
    canonical: 'https://webcountdowntimer.com',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'Free Online Countdown Timer, Stage Timer & Visual Timer | WebCountDownTimer',
    description:
      'Free online countdown timer, stopwatch, stage timer, and visual timers for classrooms, meetings, workouts, and daily tasks. No sign-up required.',
    url: 'https://webcountdowntimer.com',
    type: 'website',
    siteName: 'WebCountDownTimer',
    images: [{ url: '/icon-512.png', width: 512, height: 512, alt: 'WebCountDownTimer Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Countdown Timer, Stage Timer & Visual Timer | WebCountDownTimer',
    description:
      'Free online countdown timer, stopwatch, stage timer, and visual timers for classrooms, meetings, workouts, and daily tasks. No sign-up required.',
    images: ['/icon-512.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://webcountdowntimer.com/#organization',
    name: 'WebCountDownTimer',
    url: 'https://webcountdowntimer.com',
    logo: 'https://webcountdowntimer.com/icon-512.png',
    description:
      'Precision online countdown timers, visual and sensory timers, stage confidence monitors, world clocks, and date/time calculators.',
    ...(REAL_SAME_AS_URLS.length > 0 ? { sameAs: REAL_SAME_AS_URLS } : {}),
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://webcountdowntimer.com/#website',
    name: 'WebCountDownTimer',
    url: 'https://webcountdowntimer.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://webcountdowntimer.com/tools?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html
      lang="en"
      className={`h-full ${dmSans.variable} ${sourceSerif4.variable}`}
      suppressHydrationWarning
    >
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

