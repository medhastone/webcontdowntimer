import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import { normalizeTextKey, translateSync, type LanguageCode } from '@/lib/i18n';

const serverTranslationCache = new Map<string, string>();

// Hydrate server cache from prebuilt dictionary if present
try {
  if (fs.existsSync('/tmp/prebuilt-translations.json')) {
    const raw = fs.readFileSync('/tmp/prebuilt-translations.json', 'utf8');
    const parsed = JSON.parse(raw) as Record<string, Record<string, string>>;
    for (const [lang, entries] of Object.entries(parsed)) {
      for (const [orig, trans] of Object.entries(entries)) {
        if (trans) {
          serverTranslationCache.set(`${lang}::${normalizeTextKey(orig)}`, trans);
        }
      }
    }
  }
} catch {
  // Ignore file read errors
}

const ENDPOINTS = [
  'https://clients5.google.com/translate_a/t?client=dict-chrome-ex',
  'https://translate.googleapis.com/translate_a/t?client=gtx',
];

async function translateMultiQueryChunk(
  chunk: string[],
  targetLang: LanguageCode
): Promise<string[] | null> {
  const params = new URLSearchParams();
  for (const text of chunk) {
    params.append('q', text);
  }
  const body = params.toString();

  for (const baseUrl of ENDPOINTS) {
    try {
      const url = `${baseUrl}&sl=en&tl=${encodeURIComponent(targetLang)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        },
        body,
      });

      if (!res.ok) continue;
      const data = await res.json();
      if (!Array.isArray(data)) continue;

      const extracted: string[] = data.map((entry: unknown) => {
        if (typeof entry === 'string') return entry.trim();
        if (Array.isArray(entry) && typeof entry[0] === 'string') return entry[0].trim();
        return '';
      });

      if (extracted.length === chunk.length) {
        return extracted;
      }
    } catch {
      // Try next endpoint
    }
  }

  return null;
}

async function translateBatchArray(
  texts: string[],
  targetLang: LanguageCode
): Promise<Record<string, string>> {
  const output: Record<string, string> = {};
  if (texts.length === 0) return output;

  const CHUNK_SIZE = 100;
  const chunks: string[][] = [];
  for (let i = 0; i < texts.length; i += CHUNK_SIZE) {
    chunks.push(texts.slice(i, i + CHUNK_SIZE));
  }

  await Promise.all(
    chunks.map(async (chunk) => {
      const translatedArr = await translateMultiQueryChunk(chunk, targetLang);
      if (translatedArr && translatedArr.length === chunk.length) {
        for (let i = 0; i < chunk.length; i++) {
          const orig = chunk[i];
          const trans = translatedArr[i];
          if (trans) {
            serverTranslationCache.set(`${targetLang}::${orig}`, trans);
            output[orig] = trans;
          }
        }
      }
    })
  );

  return output;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawTexts: string[] = Array.isArray(body?.texts) ? body.texts : [];
    const targetLang = (body?.targetLang || 'en') as LanguageCode;

    if (targetLang === 'en' || rawTexts.length === 0) {
      const identityMap: Record<string, string> = {};
      for (const t of rawTexts) {
        const norm = normalizeTextKey(t);
        if (norm) identityMap[norm] = norm;
      }
      return NextResponse.json({ translations: identityMap });
    }

    const translations: Record<string, string> = {};
    const uncached: string[] = [];

    for (const rawText of rawTexts) {
      const norm = normalizeTextKey(rawText);
      if (!norm) continue;

      const syncMatch = translateSync(norm, targetLang);
      if (syncMatch) {
        translations[norm] = syncMatch;
        continue;
      }

      const cacheKey = `${targetLang}::${norm}`;
      const cached = serverTranslationCache.get(cacheKey);
      if (cached) {
        translations[norm] = cached;
      } else if (!uncached.includes(norm)) {
        uncached.push(norm);
      }
    }

    if (uncached.length > 0) {
      const batchResult = await translateBatchArray(uncached, targetLang);
      for (const [orig, trans] of Object.entries(batchResult)) {
        translations[orig] = trans;
      }
    }

    return NextResponse.json({ translations });
  } catch (err) {
    console.error('Translation API error:', err);
    return NextResponse.json({ translations: {} }, { status: 200 });
  }
}
