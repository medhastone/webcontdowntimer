import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const apiDir = path.join(root, 'app', 'api');
const tmpApiDir = path.join(root, '.gh-pages-tmp-api');
const outDir = path.join(root, 'out');
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '');

const KEPT_MINUTES = new Set([1, 5, 10, 15, 30, 60]);
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

function buildRedirectHtml(destinationPath) {
  const fullDest = `${basePath}${destinationPath}`;
  const canonicalUrl = `https://WebCountDownTimer.com${destinationPath}`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta http-equiv="refresh" content="0; url=${fullDest}" />
    <title>Redirecting to ${canonicalUrl}</title>
    <script>
      window.location.replace(${JSON.stringify(fullDest)});
    </script>
  </head>
  <body>
    <p>Redirecting to <a href="${fullDest}">${fullDest}</a>...</p>
  </body>
</html>
`;
}

function writeStaticRedirect(sourcePath, destinationPath) {
  const cleanSource = sourcePath.replace(/^\/+|\/+$/g, '');
  if (!cleanSource) return;

  const html = buildRedirectHtml(destinationPath);

  // Support both /slug and /slug/ on GitHub Pages static hosting
  const htmlFile = path.join(outDir, `${cleanSource}.html`);
  fs.mkdirSync(path.dirname(htmlFile), { recursive: true });
  fs.writeFileSync(htmlFile, html, 'utf8');

  const dirIndex = path.join(outDir, cleanSource, 'index.html');
  fs.mkdirSync(path.dirname(dirIndex), { recursive: true });
  fs.writeFileSync(dirIndex, html, 'utf8');
}

let movedApi = false;

try {
  // Next.js static export forbids POST API Route Handlers under app/api.
  // Move app/api temporarily for the static build and always restore it in finally.
  if (fs.existsSync(apiDir)) {
    if (fs.existsSync(tmpApiDir)) {
      fs.rmSync(tmpApiDir, { recursive: true, force: true });
    }
    fs.renameSync(apiDir, tmpApiDir);
    movedApi = true;
  }

  console.log('Running Next.js static export build for GitHub Pages...');
  execSync('npx next build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      GITHUB_PAGES: 'true',
    },
  });

  if (fs.existsSync(outDir)) {
    // Prevent GitHub Pages Jekyll from ignoring _next/ assets
    fs.writeFileSync(path.join(outDir, '.nojekyll'), '', 'utf8');

    // Optional CNAME support when CUSTOM_DOMAIN env var is provided
    const customDomain = (process.env.CUSTOM_DOMAIN || '').trim();
    if (customDomain) {
      fs.writeFileSync(path.join(outDir, 'CNAME'), `${customDomain}\n`, 'utf8');
    }

    // Generate static HTML redirect pages for canonicalized/removed URLs
    const staticRedirects = [
      ['/international-meeting-planner', '/meeting-planner'],
      ['/education', '/category/education'],
      ['/category/everyday', '/category/timers'],
      ['/category/stage', '/category/events'],
      ['/category/world-clock', '/category/world'],
      ['/timers/visual-timer', '/visual-timer'],
      ...VISUAL_TIMER_SUBPATH_SLUGS.map((slug) => [`/${slug}`, `/timers/${slug}`]),
    ];

    for (let m = 2; m <= 90; m++) {
      if (!KEPT_MINUTES.has(m)) {
        staticRedirects.push([`/${m}-minute-timer`, `/countdown-timer?m=${m}`]);
      }
    }

    for (const [src, dest] of staticRedirects) {
      writeStaticRedirect(src, dest);
    }

    console.log(
      `GitHub Pages static export ready in ./out (${staticRedirects.length} static redirect stubs added).`
    );
  }
} finally {
  if (movedApi && fs.existsSync(tmpApiDir) && !fs.existsSync(apiDir)) {
    fs.renameSync(tmpApiDir, apiDir);
  }
}
