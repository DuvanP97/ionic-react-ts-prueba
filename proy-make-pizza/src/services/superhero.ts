// src/services/superhero.ts
export type ApiSearchResult =
  | { response: 'success'; results: any[] }
  | { response: 'error'; error: string };

const TOKEN = (import.meta as any).env?.VITE_HERO_TOKEN as string | undefined;

// En dev usamos el proxy de Vite; en iOS/prod vamos directo a HTTPS
const USE_PROXY_IN_DEV = true;
const BASE = (import.meta as any).env?.DEV && USE_PROXY_IN_DEV
  ? `/heroapi/api/${TOKEN ?? ''}`
  : `https://www.superheroapi.com/api/${TOKEN ?? ''}`;

function ensureToken(): string | never {
  if (!TOKEN || TOKEN === 'undefined' || TOKEN.trim() === '') {
    throw new Error('Missing VITE_HERO_TOKEN at build time');
  }
  return TOKEN;
}

export async function searchHeroesByName(name: string): Promise<{ results: any[]; error?: string }> {
  try {
    ensureToken();
  } catch (e: any) {
    return { results: [], error: e.message || 'Missing token' };
  }

  const url = `${BASE}/search/${encodeURIComponent(name)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return { results: [], error: `HTTP ${res.status}` };
    const data = (await res.json()) as ApiSearchResult;
    if (data.response === 'error') return { results: [], error: data.error };
    return { results: data.results ?? [] };
  } catch (err: any) {
    return { results: [], error: err?.message || 'Network error' };
  }
}

export async function getHeroById(id: number | string): Promise<{ hero?: any; error?: string }> {
  try {
    ensureToken();
  } catch (e: any) {
    return { error: e.message || 'Missing token' };
  }

  const url = `${BASE}/${id}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return { error: `HTTP ${res.status}` };
    const data = await res.json();
    if (data.response === 'error') return { error: data.error };
    return { hero: data };
  } catch (err: any) {
    return { error: err?.message || 'Network error' };
  }
}