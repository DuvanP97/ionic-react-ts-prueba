import { Preferences } from '@capacitor/preferences';

export type FavoriteHero = {
  id: string;              // id de la API (string)
  name: string;
  publisher?: string;
  alignment?: string;      // good/bad/neutral
  img?: string;
  note?: string;           // texto libre
  category?: string;       // etiqueta propia
  pinned?: boolean;        // destacado
};

const KEY = 'favorite_heroes_v1';

export async function listFavorites(): Promise<FavoriteHero[]> {
  const { value } = await Preferences.get({ key: KEY });
  return value ? JSON.parse(value) as FavoriteHero[] : [];
}

async function saveAll(list: FavoriteHero[]) {
  await Preferences.set({ key: KEY, value: JSON.stringify(list) });
}

export async function addFavorite(item: FavoriteHero) {
  const all = await listFavorites();
  if (!all.find(h => h.id === item.id)) {
    all.unshift(item);
    await saveAll(all);
  }
}

export async function updateFavorite(id: string, patch: Partial<FavoriteHero>) {
  const all = await listFavorites();
  const i = all.findIndex(h => h.id === id);
  if (i === -1) return;
  all[i] = { ...all[i], ...patch };
  await saveAll(all);
}

export async function removeFavorite(id: string) {
  const all = await listFavorites();
  const next = all.filter(h => h.id !== id);
  await saveAll(next);
}

export async function getFavorite(id: string) {
  const all = await listFavorites();
  return all.find(h => h.id === id) ?? null;
}