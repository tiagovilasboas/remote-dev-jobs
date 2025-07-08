import { IndexedDBCache } from "./IndexedDBCache";
import { Job, JobRepository } from "@remote-dev-jobs/core";

export class IndexedDBJobRepo implements JobRepository {
  public readonly source: string;
  private readonly cache: IndexedDBCache;

  constructor(source: string) {
    this.source = source;
    this.cache = new IndexedDBCache();
  }

  async listAll(): Promise<Job[]> {
    try {
      const jobs = await this.cache.get<Job[]>(`${this.source}-jobs`);
      return jobs || [];
    } catch (error) {
      console.error(`[${this.source}] Erro ao ler do IndexedDB:`, error);
      return [];
    }
  }

  async getById(id: string): Promise<Job | null> {
    try {
      const jobs = await this.cache.get<Job[]>(`${this.source}-jobs`);
      if (!jobs) return null;

      return jobs.find((job) => job.id.value === id) || null;
    } catch (error) {
      console.error(
        `[${this.source}] Erro ao buscar vaga específica do IndexedDB:`,
        error,
      );
      return null;
    }
  }

  // Método para verificar se há dados disponíveis
  async hasData(): Promise<boolean> {
    try {
      const jobs = await this.cache.get<Job[]>(`${this.source}-jobs`);
      return jobs !== null && jobs.length > 0;
    } catch (error) {
      return false;
    }
  }

  // Método para obter timestamp da última atualização
  async getLastUpdateTime(): Promise<number | null> {
    try {
      return await this.cache.getLastRequestTime(this.source);
    } catch (error) {
      return null;
    }
  }

  // Método para obter estatísticas
  async getStats(): Promise<{
    totalJobs: number;
    lastUpdate: number | null;
    hasData: boolean;
  }> {
    try {
      const jobs = await this.cache.get<Job[]>(`${this.source}-jobs`);
      const lastUpdate = await this.cache.getLastRequestTime(this.source);

      return {
        totalJobs: jobs?.length || 0,
        lastUpdate,
        hasData: jobs !== null && jobs.length > 0,
      };
    } catch (error) {
      return {
        totalJobs: 0,
        lastUpdate: null,
        hasData: false,
      };
    }
  }
}
