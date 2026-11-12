import type {NextConfig} from 'next';

const REDIRECTED_MINUTES = [
  2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 18, 20, 25, 35, 40, 45, 50, 55, 90,
];

const VISUAL_TIMER_SUBPATH_SLUGS = [
  'aesthetic-timer',
  'blocks-timer',
  'bubble-timer',
  'candle-timer',
  'circular-timer',
  'coral-timer',
  'flip-clock',
  'flip-timer',
  'forest-fire-timer',
  'frost-timer',
  'galaxy-timer',
  'heart-timer',
  'hourglass-timer',
  'lava-lamp-timer',
  'lichen-timer',
  'liquid-timer',
  'moon-timer',
  'picture-reveal-timer',
  'pixel-timer',
  'progress-timer',
  'radial-timer',
  'rainbow-timer',
  'rings-timer',
  'sand-timer',
  'sensory-timers',
  'snow-timer',
  'spinner-timer',
  'sun-timer',
  'train-timer',
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async redirects() {
    const explicitMinuteRedirects = REDIRECTED_MINUTES.map((m) => ({
      source: `/${m}-minute-timer`,
      destination: `/countdown-timer?m=${m}`,
      statusCode: 301 as const,
    }));

    const rootVisualTimerRedirects = VISUAL_TIMER_SUBPATH_SLUGS.map((slug) => ({
      source: `/${slug}`,
      destination: `/timers/${slug}`,
      statusCode: 301 as const,
    }));

    return [
      // Duplicate tool & category URL canonicalization (301)
      {
        source: '/international-meeting-planner',
        destination: '/meeting-planner',
        statusCode: 301,
      },
      {
        source: '/education',
        destination: '/category/education',
        statusCode: 301,
      },
      {
        source: '/category/everyday',
        destination: '/category/timers',
        statusCode: 301,
      },
      {
        source: '/category/stage',
        destination: '/category/events',
        statusCode: 301,
      },
      {
        source: '/category/world-clock',
        destination: '/category/world',
        statusCode: 301,
      },
      {
        source: '/timers/visual-timer',
        destination: '/visual-timer',
        statusCode: 301,
      },
      ...rootVisualTimerRedirects,
      ...explicitMinuteRedirects,
      // Catch any other /N-minute-timer route except the 6 kept pages (1, 5, 10, 15, 30, 60)
      {
        source: '/:n((?!1$|5$|10$|15$|30$|60$)\\d+)-minute-timer',
        destination: '/countdown-timer?m=:n',
        statusCode: 301,
      },
    ];
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: process.env.VERCEL ? undefined : 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
