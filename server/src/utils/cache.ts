interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class SimpleCache<T> {
  private cache: Map<string, CacheItem<T>>;
  private cacheDuration: number;

  constructor(cacheDuration: number = 15000) {
    this.cache = new Map();
    this.cacheDuration = cacheDuration;
  }

  get(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    if (Date.now() - item.timestamp > this.cacheDuration) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() - item.timestamp > this.cacheDuration) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

export const stockPriceCache = new SimpleCache<number>(15000);
