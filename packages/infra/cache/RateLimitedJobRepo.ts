import { IndexedDBCache } from "./IndexedDBCache";
import { Job, JobRepository } from "@remote-dev-jobs/core";

export class RateLimitedJobRepo implements JobRepository {
  public readonly source: string;
  private readonly cache: IndexedDBCache;
  private readonly minIntervalMs: number;

  constructor(
    private readonly repo: JobRepository,
    private readonly cacheKey: string,
    minIntervalMinutes: number = 20,
  ) {
    this.source = repo.source;
    this.cache = new IndexedDBCache();
    this.minIntervalMs = minIntervalMinutes * 60 * 1000;
  }

  async listAll(): Promise<Job[]> {
    try {
      // Verificar se pode fazer request
      const canRequest = await this.cache.canMakeRequest(
        this.source,
        this.minIntervalMs,
      );

      if (!canRequest) {
        // Tentar buscar do cache
        const cachedJobs = await this.cache.get<Job[]>(this.cacheKey);
        if (cachedJobs) {
          console.log(
            `[${this.source}] Usando cache - próxima atualização em ${this.getTimeUntilNextRequest()} minutos`,
          );
          return cachedJobs;
        }

        // Se não há cache, aguardar um pouco e tentar novamente
        const lastRequestTime = await this.cache.getLastRequestTime(
          this.source,
        );
        if (lastRequestTime) {
          const waitTime = this.minIntervalMs - (Date.now() - lastRequestTime);
          if (waitTime > 0) {
            console.log(
              `[${this.source}] Aguardando ${Math.ceil(waitTime / 60000)} minutos para próxima requisição`,
            );
            await new Promise((resolve) =>
              setTimeout(resolve, Math.min(waitTime, 60000)),
            ); // Máximo 1 minuto
          }
        }
      }

      // Fazer request
      console.log(`[${this.source}] Fazendo nova requisição`);
      const jobs = await this.repo.listAll();

      // Salvar no cache e registrar request
      await Promise.all([
        this.cache.set(this.cacheKey, jobs, this.minIntervalMs),
        this.cache.recordRequest(this.source),
      ]);

      return jobs;
    } catch (error) {
      console.error(`[${this.source}] Erro ao buscar vagas:`, error);

      // Em caso de erro, tentar usar cache
      const cachedJobs = await this.cache.get<Job[]>(this.cacheKey);
      if (cachedJobs) {
        console.log(`[${this.source}] Usando cache devido a erro`);
        return cachedJobs;
      }

      return [];
    }
  }

  async getById(id: string): Promise<Job | null> {
    try {
      // Para getById, sempre tentar buscar do cache primeiro
      const cachedJobs = await this.cache.get<Job[]>(this.cacheKey);
      if (cachedJobs) {
        const job = cachedJobs.find((j) => j.id.value === id);
        if (job) return job;
      }

      // Se não encontrou no cache, verificar se pode fazer request
      const canRequest = await this.cache.canMakeRequest(
        this.source,
        this.minIntervalMs,
      );

      if (!canRequest) {
        console.log(`[${this.source}] Rate limit ativo para getById`);
        return null;
      }

      // Fazer request
      const job = await this.repo.getById(id);

      // Registrar request mesmo se não encontrou
      await this.cache.recordRequest(this.source);

      return job;
    } catch (error) {
      console.error(`[${this.source}] Erro ao buscar vaga específica:`, error);
      return null;
    }
  }

  private getTimeUntilNextRequest(): number {
    // Método auxiliar para calcular tempo até próxima requisição
    return Math.ceil(this.minIntervalMs / 60000);
  }

  // Método para forçar atualização (útil para testes)
  async forceRefresh(): Promise<Job[]> {
    await this.cache.delete(this.cacheKey);
    return this.listAll();
  }

  // Método para verificar status do cache
  async getCacheStatus(): Promise<{
    hasCache: boolean;
    timeUntilNextRequest: number;
    lastRequestTime: number | null;
  }> {
    const cachedJobs = await this.cache.get<Job[]>(this.cacheKey);
    const lastRequestTime = await this.cache.getLastRequestTime(this.source);

    let timeUntilNextRequest = 0;
    if (lastRequestTime) {
      const timeSinceLastRequest = Date.now() - lastRequestTime;
      timeUntilNextRequest = Math.max(
        0,
        this.minIntervalMs - timeSinceLastRequest,
      );
    }

    return {
      hasCache: !!cachedJobs,
      timeUntilNextRequest: Math.ceil(timeUntilNextRequest / 60000),
      lastRequestTime,
    };
  }
}
