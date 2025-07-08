import { IndexedDBCache } from "@remote-dev-jobs/infra/cache/IndexedDBCache";
import { RateLimitedJobRepo } from "@remote-dev-jobs/infra/cache/RateLimitedJobRepo";
import { JobRepoFactory } from "@remote-dev-jobs/infra/factory/JobRepoFactory";
import {
  JobSource,
  getEnabledSources,
  getSourceConfig,
} from "@remote-dev-jobs/infra/sources/JobSources";

export class JobSyncService {
  private readonly cache: IndexedDBCache;
  private readonly sources: Array<{
    name: JobSource;
    repo: RateLimitedJobRepo;
  }>;

  constructor() {
    this.cache = new IndexedDBCache();

    // Criar repositórios usando o factory
    const enabledSources = getEnabledSources();
    this.sources = enabledSources
      .map((source) => {
        try {
          const repo = JobRepoFactory.createRateLimitedRepo(source);
          return {
            name: source,
            repo,
          };
        } catch (error) {
          console.error(`Erro ao criar repositório para ${source}:`, error);
          return null;
        }
      })
      .filter(
        (source): source is { name: JobSource; repo: RateLimitedJobRepo } =>
          source !== null,
      );
  }

  async syncAllSources(): Promise<{
    success: string[];
    failed: string[];
    totalJobs: number;
  }> {
    const success: string[] = [];
    const failed: string[] = [];
    let totalJobs = 0;

    console.log("🔄 Iniciando sincronização de todas as fontes...");

    for (const source of this.sources) {
      try {
        console.log(`📡 Sincronizando ${source.name}...`);
        const jobs = await source.repo.listAll();

        if (jobs.length > 0) {
          await this.cache.set(`${source.name}-jobs`, jobs, 20 * 60 * 1000); // 20 minutos
          success.push(source.name);
          totalJobs += jobs.length;
          console.log(`✅ ${source.name}: ${jobs.length} vagas sincronizadas`);
        } else {
          failed.push(`${source.name} (sem dados)`);
          console.log(`⚠️ ${source.name}: Nenhuma vaga encontrada`);
        }
      } catch (error) {
        failed.push(source.name);
        console.error(`❌ Erro ao sincronizar ${source.name}:`, error);
      }
    }

    console.log(
      `🎉 Sincronização concluída: ${success.length} sucessos, ${failed.length} falhas, ${totalJobs} vagas totais`,
    );

    return { success, failed, totalJobs };
  }

  async syncSpecificSource(sourceName: string): Promise<{
    success: boolean;
    jobsCount: number;
    error?: string;
  }> {
    const source = this.sources.find((s) => s.name === sourceName);
    if (!source) {
      return { success: false, jobsCount: 0, error: "Fonte não encontrada" };
    }

    try {
      console.log(`📡 Sincronizando ${sourceName}...`);
      const jobs = await source.repo.listAll();

      if (jobs.length > 0) {
        await this.cache.set(`${sourceName}-jobs`, jobs, 20 * 60 * 1000);
        console.log(`✅ ${sourceName}: ${jobs.length} vagas sincronizadas`);
        return { success: true, jobsCount: jobs.length };
      } else {
        console.log(`⚠️ ${sourceName}: Nenhuma vaga encontrada`);
        return {
          success: false,
          jobsCount: 0,
          error: "Nenhuma vaga encontrada",
        };
      }
    } catch (error) {
      console.error(`❌ Erro ao sincronizar ${sourceName}:`, error);
      return {
        success: false,
        jobsCount: 0,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      };
    }
  }

  async getSyncStatus(): Promise<{
    sources: Array<{
      name: string;
      hasData: boolean;
      lastUpdate: number | null;
      jobsCount: number;
      canSync: boolean;
    }>;
  }> {
    const sources = await Promise.all(
      this.sources.map(async (source) => {
        const hasData = (await this.cache.get(`${source.name}-jobs`)) !== null;
        const lastUpdate = await this.cache.getLastRequestTime(source.name);
        const jobs =
          ((await this.cache.get(`${source.name}-jobs`)) as any[]) || [];
        const canSync = await source.repo
          .getCacheStatus()
          .then((status) => status.timeUntilNextRequest === 0);

        return {
          name: source.name,
          hasData,
          lastUpdate,
          jobsCount: jobs.length,
          canSync,
        };
      }),
    );

    return { sources };
  }

  async forceRefreshAll(): Promise<{
    success: string[];
    failed: string[];
    totalJobs: number;
  }> {
    console.log("🔄 Forçando atualização de todas as fontes...");

    // Limpar cache de rate limiting para forçar refresh
    for (const source of this.sources) {
      await this.cache.delete(`${source.name}-jobs`);
    }

    return this.syncAllSources();
  }

  async getTotalJobsCount(): Promise<number> {
    let total = 0;

    for (const source of this.sources) {
      const jobs =
        ((await this.cache.get(`${source.name}-jobs`)) as any[]) || [];
      total += jobs.length;
    }

    return total;
  }
}
