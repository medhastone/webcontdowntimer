'use client';

import React, { useEffect, useRef, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import {
  LANGUAGE_CODE_MAP,
  SUPPORTED_LANGUAGES,
  getLanguageSnapshot,
  getServerLanguageSnapshot,
  normalizeTextKey,
  subscribeLanguage,
  translateSync,
  type LanguageCode,
} from '@/lib/i18n';

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'TEXTAREA']);
const NATIVE_LANG_NAMES = new Set<string>(SUPPORTED_LANGUAGES);
const BRAND_NAMES = new Set([
  'WebCountDownTimer',
  'WebCountDownTimer.com',
  'WebCountDownTimers',
]);

const NON_TRANSLATABLE_REGEX = /^[0-9:\s.,+\-–—•▶/()%#°|×÷=<>!&?[\]{}'"`~^\\]+$/;
const TIME_TOKEN_REGEX = /^(AM|PM|UTC|GMT|EST|PST|CST|MST|IST|JST|CET|BST|AEST|[A-Z0-9]{1,2})$/;

const originalTextMap = new WeakMap<Text, string>();
const appliedTextMap = new WeakMap<Text, string>();

interface AttrRecord {
  orig: string;
  applied: string;
}
const elementAttrMap = new WeakMap<Element, Record<string, AttrRecord>>();

const clientCache = new Map<string, string>();
const inFlightClientKeys = new Set<string>();
const TRANSLATABLE_ATTRS = ['placeholder', 'title', 'aria-label'] as const;
const STORAGE_CACHE_KEY = 'timetools_i18n_cache_v4';

function shouldSkipText(raw: string): boolean {
  const norm = normalizeTextKey(raw);
  if (!norm) return true;
  if (norm.length <= 1) return true;
  if (NATIVE_LANG_NAMES.has(norm)) return true;
  if (BRAND_NAMES.has(norm)) return true;
  if (NON_TRANSLATABLE_REGEX.test(norm)) return true;
  if (TIME_TOKEN_REGEX.test(norm)) return true;
  return false;
}

function preserveWhitespace(originalRaw: string, translatedTrimmed: string): string {
  const leadingMatch = originalRaw.match(/^\s*/);
  const trailingMatch = originalRaw.match(/\s*$/);
  const leading = leadingMatch ? leadingMatch[0] : '';
  const trailing = trailingMatch ? trailingMatch[0] : '';
  return `${leading}${translatedTrimmed}${trailing}`;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const currentLang = useSyncExternalStore(
    subscribeLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot
  );
  const pathname = usePathname();
  const isMutatingDomRef = useRef(false);
  const activeLangRef = useRef<LanguageCode>('en');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem('timetools_i18n_cache_v1');
      sessionStorage.removeItem('timetools_i18n_cache_v3');
      const saved = sessionStorage.getItem(STORAGE_CACHE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, string>;
        for (const [k, v] of Object.entries(parsed)) {
          if (v) clientCache.set(k, v);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const langCode: LanguageCode = LANGUAGE_CODE_MAP[currentLang] || 'en';
    activeLangRef.current = langCode;
    document.documentElement.lang = langCode;

    const persistCache = () => {
      try {
        if (clientCache.size > 0 && clientCache.size < 5000) {
          const obj: Record<string, string> = {};
          clientCache.forEach((v, k) => {
            obj[k] = v;
          });
          sessionStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(obj));
        }
      } catch {
        // Ignore quota errors
      }
    };

    const scanAndApplyDom = (): string[] => {
      if (typeof document === 'undefined' || !document.body) return [];

      const missingNormSet = new Set<string>();
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
          if (parent.closest('[data-no-translate="true"]')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      isMutatingDomRef.current = true;
      try {
        let currentNode = walker.nextNode() as Text | null;
        while (currentNode) {
          const currentVal = currentNode.nodeValue || '';
          const lastApplied = appliedTextMap.get(currentNode);

          // Record original English source only if never seen before or if React updated it to a new value
          if (!originalTextMap.has(currentNode)) {
            originalTextMap.set(currentNode, currentVal);
          } else if (lastApplied !== undefined && currentVal !== lastApplied) {
            originalTextMap.set(currentNode, currentVal);
          }

          const origRaw = originalTextMap.get(currentNode) ?? currentVal;
          const origNorm = normalizeTextKey(origRaw);

          if (!shouldSkipText(origRaw)) {
            if (langCode === 'en') {
              if (currentNode.nodeValue !== origRaw) {
                currentNode.nodeValue = origRaw;
              }
              appliedTextMap.set(currentNode, origRaw);
            } else {
              const syncResult = translateSync(origNorm, langCode);
              if (syncResult) {
                const formatted = preserveWhitespace(origRaw, syncResult);
                if (currentNode.nodeValue !== formatted) {
                  currentNode.nodeValue = formatted;
                }
                appliedTextMap.set(currentNode, formatted);
              } else {
                const cacheKey = `${langCode}::${origNorm}`;
                const cached = clientCache.get(cacheKey);
                if (cached) {
                  const formatted = preserveWhitespace(origRaw, cached);
                  if (currentNode.nodeValue !== formatted) {
                    currentNode.nodeValue = formatted;
                  }
                  appliedTextMap.set(currentNode, formatted);
                } else if (!inFlightClientKeys.has(cacheKey)) {
                  missingNormSet.add(origNorm);
                }
              }
            }
          }

          currentNode = walker.nextNode() as Text | null;
        }

        const allElements = document.body.querySelectorAll(
          '[placeholder], [title], [aria-label]'
        );
        allElements.forEach((el) => {
          if (el.closest('[data-no-translate="true"]')) return;
          let record = elementAttrMap.get(el);
          if (!record) {
            record = {};
            elementAttrMap.set(el, record);
          }

          for (const attr of TRANSLATABLE_ATTRS) {
            const val = el.getAttribute(attr);
            if (!val) continue;
            const prev = record[attr];
            if (!prev) {
              record[attr] = { orig: val, applied: val };
            } else if (val !== prev.applied) {
              record[attr] = { orig: val, applied: val };
            }
            const origVal = record[attr].orig;
            const origNorm = normalizeTextKey(origVal);
            if (shouldSkipText(origVal)) continue;

            if (langCode === 'en') {
              if (el.getAttribute(attr) !== origVal) {
                el.setAttribute(attr, origVal);
              }
              record[attr].applied = origVal;
            } else {
              const syncRes = translateSync(origNorm, langCode);
              if (syncRes) {
                if (el.getAttribute(attr) !== syncRes) {
                  el.setAttribute(attr, syncRes);
                }
                record[attr].applied = syncRes;
              } else {
                const cacheKey = `${langCode}::${origNorm}`;
                const cached = clientCache.get(cacheKey);
                if (cached) {
                  if (el.getAttribute(attr) !== cached) {
                    el.setAttribute(attr, cached);
                  }
                  record[attr].applied = cached;
                } else if (!inFlightClientKeys.has(cacheKey)) {
                  missingNormSet.add(origNorm);
                }
              }
            }
          }
        });
      } finally {
        isMutatingDomRef.current = false;
      }

      return Array.from(missingNormSet);
    };

    const runTranslationCycle = async () => {
      const missing = scanAndApplyDom();
      if (langCode === 'en' || missing.length === 0) return;

      for (const norm of missing) {
        inFlightClientKeys.add(`${langCode}::${norm}`);
      }

      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            texts: missing,
            targetLang: langCode,
          }),
        });

        if (!res.ok) return;
        const data = await res.json();
        const translations: Record<string, string> = data?.translations || {};

        for (const [origNorm, trans] of Object.entries(translations)) {
          if (trans) {
            clientCache.set(`${langCode}::${origNorm}`, trans);
          }
        }
        persistCache();

        if (activeLangRef.current === langCode) {
          scanAndApplyDom();
        }
      } catch {
        // Ignore network errors
      } finally {
        for (const norm of missing) {
          inFlightClientKeys.delete(`${langCode}::${norm}`);
        }
      }
    };

    runTranslationCycle();

    // Also run a follow-up check after 350ms to catch any lazy-mounted client components
    const initialFollowUp = setTimeout(() => {
      runTranslationCycle();
    }, 350);

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const observer = new MutationObserver((mutations) => {
      if (isMutatingDomRef.current) return;

      let hasTranslatableMutation = false;
      for (const m of mutations) {
        if (m.type === 'childList') {
          for (let i = 0; i < m.addedNodes.length; i++) {
            const added = m.addedNodes[i];
            if (added.nodeType === Node.TEXT_NODE) {
              const txt = added.nodeValue || '';
              if (!shouldSkipText(txt) && txt !== appliedTextMap.get(added as Text)) {
                hasTranslatableMutation = true;
                break;
              }
            } else if (added.nodeType === Node.ELEMENT_NODE) {
              const el = added as Element;
              if (
                !SKIP_TAGS.has(el.tagName) &&
                !el.closest('[data-no-translate="true"]') &&
                !shouldSkipText(el.textContent || '')
              ) {
                hasTranslatableMutation = true;
                break;
              }
            }
          }
        } else if (m.type === 'characterData') {
          const targetNode = m.target as Text;
          const currentVal = targetNode.nodeValue || '';
          if (!shouldSkipText(currentVal) && currentVal !== appliedTextMap.get(targetNode)) {
            hasTranslatableMutation = true;
          }
        }
        if (hasTranslatableMutation) break;
      }

      if (!hasTranslatableMutation) return;

      if (!debounceTimer) {
        debounceTimer = setTimeout(() => {
          debounceTimer = null;
          runTranslationCycle();
        }, 120);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      clearTimeout(initialFollowUp);
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, [currentLang, pathname]);

  return <>{children}</>;
}
