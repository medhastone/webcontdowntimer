/**
 * Safe URL Configuration Encoding & Decoding for Shareable Timers
 */

import { ShareableTimerParams } from './types';

/**
 * Encode timer parameters into query string
 * e.g., ?d=900&w=120&ot=1&title=Keynote
 */
export function encodeTimerParams(params: ShareableTimerParams): string {
  const searchParams = new URLSearchParams();

  if (params.d && params.d > 0) {
    searchParams.set('d', String(Math.floor(params.d)));
  }

  if (params.w && params.w > 0) {
    searchParams.set('w', String(Math.floor(params.w)));
  }

  if (params.ot) {
    searchParams.set('ot', '1');
  }

  if (params.title && params.title.trim()) {
    // Sanitize string to prevent injection
    searchParams.set('title', params.title.trim().slice(0, 100));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

/**
 * Safely parse and validate timer parameters from URL search string
 */
export function decodeTimerParams(queryStringOrParams: string | URLSearchParams): ShareableTimerParams {
  const searchParams =
    typeof queryStringOrParams === 'string'
      ? new URLSearchParams(queryStringOrParams.startsWith('?') ? queryStringOrParams.slice(1) : queryStringOrParams)
      : queryStringOrParams;

  const result: ShareableTimerParams = {};

  const dRaw = searchParams.get('d');
  if (dRaw) {
    const dNum = parseInt(dRaw, 10);
    if (!isNaN(dNum) && dNum > 0 && dNum <= 86400 * 7) {
      result.d = dNum;
    }
  }

  const wRaw = searchParams.get('w');
  if (wRaw) {
    const wNum = parseInt(wRaw, 10);
    if (!isNaN(wNum) && wNum > 0 && (!result.d || wNum < result.d)) {
      result.w = wNum;
    }
  }

  const otRaw = searchParams.get('ot');
  if (otRaw === '1' || otRaw === 'true') {
    result.ot = true;
  }

  const titleRaw = searchParams.get('title');
  if (titleRaw) {
    result.title = titleRaw.trim().slice(0, 100);
  }

  return result;
}
