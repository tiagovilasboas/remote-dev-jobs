import { Job, JobRepository, Cache } from '@remote-dev-jobs/core';

export class CachedJobRepo implements JobRepository {
  public readonly source: string;

  constructor(
    private readonly repo: JobRepository,
    private readonly cache: Cache,
    private readonly ttlSeconds: number = 300 // 5 minutos
  ) {
    this.source = repo.source;
  }

  private getCacheKey(method: string, params?: string): string {
    return `${this.source}:${method}${params ? `:${params}` : ''}`;
  }

  async listAll(): Promise<Job[]> {
    const cacheKey = this.getCacheKey('listAll');
    
    // Tentar buscar do cache
    const cached = await this.cache.get<Job[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Se não estiver no cache, buscar do repositório
    const jobs = await this.repo.listAll();
    
    // Salvar no cache
    await this.cache.set(cacheKey, jobs, this.ttlSeconds);
    
    return jobs;
  }

  async getById(id: string): Promise<Job | null> {
    const cacheKey = this.getCacheKey('getById', id);
    
    // Tentar buscar do cache
    const cached = await this.cache.get<Job | null>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // Se não estiver no cache, buscar do repositório
    const job = await this.repo.getById(id);
    
    // Salvar no cache (mesmo se for null)
    await this.cache.set(cacheKey, job, this.ttlSeconds);
    
    return job;
  }

  async findById(id: any): Promise<Job | null> {
    return this.getById(id.value);
  }
} 