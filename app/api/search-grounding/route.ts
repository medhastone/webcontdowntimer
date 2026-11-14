import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import {
  buildFallbackClassroomContext,
  buildFallbackMeetingContext,
  type GroundingSource,
  type SearchGroundingResponse,
} from '@/lib/search-grounding-fallback';

export type { GroundingSource, SearchGroundingResponse };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tool: 'classroom-noise-meter' | 'meeting-planner' =
      body.tool === 'meeting-planner' ? 'meeting-planner' : 'classroom-noise-meter';
    const rawQuery = typeof body.query === 'string' && body.query.trim()
      ? body.query.trim()
      : tool === 'classroom-noise-meter'
      ? 'Classroom management tips and acoustic voice level strategies for teachers'
      : 'Global meeting scheduling trends, DST transitions, and regional work hours etiquette';

    const noiseLevel = Number(body.noiseLevel) || 0;
    const threshold = Number(body.threshold) || 65;
    const exceedCount = Number(body.exceedCount) || 0;
    const cities: string[] = Array.isArray(body.cities) ? body.cities : [];
    const utcHour = Number.isFinite(Number(body.utcHour)) ? Number(body.utcHour) : 14;

    const apiKey = process.env.GEMINI_API_KEY;
    const hasValidApiKey =
      Boolean(apiKey) &&
      apiKey !== 'MY_GEMINI_API_KEY' &&
      apiKey!.trim().length > 10;

    if (hasValidApiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
        });

        const contextualPrompt =
          tool === 'classroom-noise-meter'
            ? `You are providing real-time, search-grounded classroom management and acoustic insights for an educator using a Classroom Noise Meter.
Current session context: Ambient level ${noiseLevel}/100, threshold ${threshold}/100, threshold alerts triggered: ${exceedCount}.
User query: "${rawQuery}"

Provide:
1. A concise 2-3 sentence summary grounded in current educational research and acoustic standards.
2. Exactly 3 actionable, practical tips formatted as bullet points with a short title and 1-2 sentence explanation.
Keep the tone practical, authoritative, and educator-focused.`
            : `You are providing real-time, search-grounded global scheduling context and regional event/holiday/time-zone trends for a distributed team using a World Meeting Planner.
Current session context: Participant cities: ${cities.join(', ') || 'San Francisco, London, Berlin, Singapore'}. Selected meeting time: ${String(utcHour).padStart(2, '0')}:00 UTC.
User query: "${rawQuery}"

Provide:
1. A concise 2-3 sentence summary grounded in current global scheduling practices, upcoming regional holidays/events, or DST rules.
2. Exactly 3 actionable insights formatted as bullet points with a short title and 1-2 sentence explanation.
Keep the tone executive, practical, and globally aware.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contextualPrompt,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        const text = response.text?.trim() || '';
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const extractedSources: GroundingSource[] = [];

        for (const chunk of chunks) {
          if (chunk.web?.uri && chunk.web?.title) {
            if (!extractedSources.some((s) => s.uri === chunk.web!.uri)) {
              extractedSources.push({
                title: chunk.web.title,
                uri: chunk.web.uri,
              });
            }
          }
        }

        if (text) {
          const fallback =
            tool === 'classroom-noise-meter'
              ? buildFallbackClassroomContext(rawQuery, noiseLevel, threshold, exceedCount)
              : buildFallbackMeetingContext(rawQuery, cities, utcHour);

          const lines = text
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean);
          const summaryPara =
            lines.find((l) => !l.startsWith('*') && !l.startsWith('-') && !/^\d+\./.test(l) && l.length > 40) ||
            fallback.summary;

          const bulletLines = lines.filter(
            (l) => l.startsWith('*') || l.startsWith('-') || /^\d+\./.test(l)
          );

          const highlights =
            bulletLines.length >= 2
              ? bulletLines.slice(0, 3).map((b, idx) => {
                  const cleaned = b.replace(/^(\*|-|\d+\.)\s*/, '').replace(/\*\*/g, '');
                  const colonIdx = cleaned.indexOf(':');
                  if (colonIdx > 2 && colonIdx < 65) {
                    return {
                      title: cleaned.slice(0, colonIdx).trim(),
                      detail: cleaned.slice(colonIdx + 1).trim(),
                      tag: idx === 0 ? 'Primary Insight' : idx === 1 ? 'Actionable Tip' : 'Best Practice',
                    };
                  }
                  return {
                    title: fallback.highlights[idx]?.title || `Grounded Insight ${idx + 1}`,
                    detail: cleaned,
                    tag: fallback.highlights[idx]?.tag || 'Grounded Context',
                  };
                })
              : fallback.highlights;

          return NextResponse.json({
            query: rawQuery,
            tool,
            summary: summaryPara.replace(/\*\*/g, ''),
            highlights,
            sources: extractedSources.length > 0 ? extractedSources.slice(0, 5) : fallback.sources,
            timestamp: new Date().toISOString(),
            groundedWith: 'Gemini Search Grounding',
          } satisfies SearchGroundingResponse);
        }
      } catch {
        // Fall through to deterministic grounded fallback
      }
    }

    const fallbackResponse =
      tool === 'classroom-noise-meter'
        ? buildFallbackClassroomContext(rawQuery, noiseLevel, threshold, exceedCount)
        : buildFallbackMeetingContext(rawQuery, cities, utcHour);

    try {
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
        rawQuery
      )}&limit=2&namespace=0&format=json`;
      const wikiRes = await fetch(wikiUrl, { signal: AbortSignal.timeout(2500) });
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        const titles: string[] = Array.isArray(wikiData?.[1]) ? wikiData[1] : [];
        const urls: string[] = Array.isArray(wikiData?.[3]) ? wikiData[3] : [];
        titles.forEach((title, idx) => {
          const uri = urls[idx];
          if (title && uri && !fallbackResponse.sources.some((s) => s.uri === uri)) {
            fallbackResponse.sources.push({
              title: `${title} — Reference Overview`,
              uri,
            });
          }
        });
      }
    } catch {
      // Ignore network timeout on auxiliary source enrichment
    }

    return NextResponse.json(fallbackResponse);
  } catch {
    return NextResponse.json(
      buildFallbackClassroomContext('Classroom management & acoustic guidelines'),
      { status: 200 }
    );
  }
}
