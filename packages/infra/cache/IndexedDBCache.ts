export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class IndexedDBCache {
  private readonly dbName = "RemoteDevJobsCache";
  private readonly version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store para cache de vagas
        if (!db.objectStoreNames.contains("jobs")) {
          const jobsStore = db.createObjectStore("jobs", { keyPath: "key" });
          jobsStore.createIndex("timestamp", "timestamp", { unique: false });
        }

        // Store para rate limiting
        if (!db.objectStoreNames.contains("rateLimit")) {
          const rateLimitStore = db.createObjectStore("rateLimit", {
            keyPath: "source",
          });
          rateLimitStore.createIndex("lastRequest", "lastRequest", {
            unique: false,
          });
        }
      };
    });
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["jobs"], "readonly");
      const store = transaction.objectStore("jobs");
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const entry: CacheEntry<T> | undefined = request.result;
        if (!entry) {
          resolve(null);
          return;
        }

        const now = Date.now();
        if (now - entry.timestamp > entry.ttl) {
          // Cache expirado, remover
          this.delete(key);
          resolve(null);
          return;
        }

        resolve(entry.data);
      };
    });
  }

  async set<T>(key: string, data: T, ttlMs: number): Promise<void> {
    if (!this.db) await this.init();

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["jobs"], "readwrite");
      const store = transaction.objectStore("jobs");
      const request = store.put(entry);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async delete(key: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["jobs"], "readwrite");
      const store = transaction.objectStore("jobs");
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["jobs"], "readwrite");
      const store = transaction.objectStore("jobs");
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // Rate limiting methods
  async canMakeRequest(
    source: string,
    minIntervalMs: number = 20 * 60 * 1000,
  ): Promise<boolean> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["rateLimit"], "readonly");
      const store = transaction.objectStore("rateLimit");
      const request = store.get(source);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const entry = request.result;
        if (!entry) {
          resolve(true); // Primeira requisição
          return;
        }

        const now = Date.now();
        const timeSinceLastRequest = now - entry.lastRequest;
        resolve(timeSinceLastRequest >= minIntervalMs);
      };
    });
  }

  async recordRequest(source: string): Promise<void> {
    if (!this.db) await this.init();

    const entry = {
      source,
      lastRequest: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["rateLimit"], "readwrite");
      const store = transaction.objectStore("rateLimit");
      const request = store.put(entry);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getLastRequestTime(source: string): Promise<number | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["rateLimit"], "readonly");
      const store = transaction.objectStore("rateLimit");
      const request = store.get(source);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const entry = request.result;
        resolve(entry ? entry.lastRequest : null);
      };
    });
  }
}
