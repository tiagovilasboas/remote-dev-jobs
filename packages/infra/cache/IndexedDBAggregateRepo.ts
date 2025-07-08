import { IndexedDBJobRepo } from "./IndexedDBJobRepo";
import {
  Job,
  JobRepository,
  JobDeduplicator,
  JobFilterService,
} from "@remote-dev-jobs/core";

export class IndexedDBAggregateRepo implements JobRepository {
  public readonly source = "indexeddb-aggregate";
  private readonly repos: IndexedDBJobRepo[];

  constructor(sources: string[]) {
    this.repos = sources.map((source) => new IndexedDBJobRepo(source));
  }

  async listAll(): Promise<Job[]> {
    try {
      const allJobs = await Promise.all(
        this.repos.map((repo) => repo.listAll()),
      );

      const merged = allJobs.flat();
      return JobDeduplicator.deduplicate(merged);
    } catch (error) {
      console.error("Erro ao agregar jobs do IndexedDB:", error);
      return [];
    }
  }

  async getById(id: string): Promise<Job | null> {
    try {
      const [source] = id.split("::");
      if (!source) return null;

      const repo = this.repos.find((r) => r.source === source);
      if (!repo) return null;

      return repo.getById(id);
    } catch (error) {
      console.error("Erro ao buscar job específico do IndexedDB:", error);
      return null;
    }
  }

  // Método para obter estatísticas de todas as fontes
  async getAllStats(): Promise<{
    totalJobs: number;
    sources: Array<{
      source: string;
      totalJobs: number;
      lastUpdate: number | null;
      hasData: boolean;
    }>;
  }> {
    try {
      const stats = await Promise.all(
        this.repos.map(async (repo) => {
          const stat = await repo.getStats();
          return {
            source: repo.source,
            ...stat,
          };
        }),
      );

      const totalJobs = stats.reduce((sum, stat) => sum + stat.totalJobs, 0);

      return {
        totalJobs,
        sources: stats,
      };
    } catch (error) {
      console.error("Erro ao obter estatísticas:", error);
      return {
        totalJobs: 0,
        sources: [],
      };
    }
  }

  // Método para verificar se há dados disponíveis
  async hasAnyData(): Promise<boolean> {
    try {
      const hasDataPromises = this.repos.map((repo) => repo.hasData());
      const hasDataResults = await Promise.all(hasDataPromises);
      return hasDataResults.some((hasData) => hasData);
    } catch (error) {
      return false;
    }
  }

  // Método para obter jobs de uma fonte específica
  async getJobsBySource(source: string): Promise<Job[]> {
    try {
      const repo = this.repos.find((r) => r.source === source);
      if (!repo) return [];

      return repo.listAll();
    } catch (error) {
      console.error(`Erro ao buscar jobs da fonte ${source}:`, error);
      return [];
    }
  }

  // Método para filtrar jobs por critérios
  async filterJobs(filters: {
    remote?: boolean;
    location?: string;
    company?: string;
    title?: string;
  }): Promise<Job[]> {
    try {
      const allJobs = await this.listAll();
      return JobFilterService.filterJobs(allJobs, filters);
    } catch (error) {
      console.error("Erro ao filtrar jobs:", error);
      return [];
    }
  }
}
