import type { AppState } from "@/types";

/**
 * Camada de persistência.
 * Hoje: localStorage (sem autenticação).
 * Futuro: basta trocar a implementação de `storage` por chamadas de API,
 * mantendo a mesma interface `StorageAdapter`.
 */
export interface StorageAdapter {
  load(): AppState | null;
  save(state: AppState): void;
  clear(): void;
}

export const STORAGE_KEY = "matchcv:state:v1";

export const localStorageAdapter: StorageAdapter = {
  load() {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AppState) : null;
    } catch {
      return null;
    }
  },
  save(state) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota exceeded — ignorado silenciosamente */
    }
  },
  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  },
};

export const storage: StorageAdapter = localStorageAdapter;

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}
