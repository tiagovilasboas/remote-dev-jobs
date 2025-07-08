import { Cache, CacheOptions } from './Cache';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache implements Cache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly defaultTtlSeconds: number;
  private readonly prefix: string;

  constructor(options: CacheOptions = {}) {
    this.defaultTtlSeconds = options.ttlSeconds ?? 300; // 5 minutos padrão
    this.prefix = options.prefix ?? '';
  }

  private getKey(key: string): string {
    return this.prefix ? `${this.prefix}:${key}` : key;
  }

  async get<T>(key: string): Promise<T | null> {
    const fullKey = this.getKey(key);
    const entry = this.cache.get(fullKey);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(fullKey);
      return null;
    }

    return entry.value;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const fullKey = this.getKey(key);
    const ttl = ttlSeconds ?? this.defaultTtlSeconds;
    const expiresAt = Date.now() + (ttl * 1000);

    this.cache.set(fullKey, { value, expiresAt });
  }

  async delete(key: string): Promise<void> {
    const fullKey = this.getKey(key);
    this.cache.delete(fullKey);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  // Método para limpar entradas expiradas
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Executar limpeza periodicamente
  startCleanup(intervalMs: number = 60000): void {
    setInterval(() => this.cleanup(), intervalMs);
  }
} 