import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WebCountDownTimer',
    short_name: 'CountDownTimer',
    description:
      'Free online countdown timer, stage confidence monitor, classroom timer, and visual timers.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F6F2',
    theme_color: '#153326',
    icons: [
      {
        src: '/favicon-48x48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
