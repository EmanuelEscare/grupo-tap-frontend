export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiPaginatedCollection<T> {
  data: T[];
  meta?: Record<string, unknown>;
  links?: Record<string, unknown>;
}

export interface ApiCollectionResponse<T> {
  data?: T[] | ApiPaginatedCollection<T>;
  meta?: Record<string, unknown>;
  links?: Record<string, unknown>;
}

const COLLECTION_KEYS = [
  'data',
  'items',
  'result',
  'results',
  'records',
  'collection',
  'products',
  'productos',
  'users',
  'usuarios',
  'profiles',
  'perfiles',
  'sections',
  'secciones',
];

export function getCollectionData<T>(response: unknown, collectionKey?: string): T[] {
  return findCollection<T>(response, collectionKey ? [collectionKey, ...COLLECTION_KEYS] : COLLECTION_KEYS) ?? [];
}

function findCollection<T>(value: unknown, keys: string[]): T[] | null {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (!isRecord(value)) {
    return null;
  }

  for (const key of keys) {
    const collection = findCollection<T>(value[key], keys);
    if (collection) {
      return collection;
    }
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
