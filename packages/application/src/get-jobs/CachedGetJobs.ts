import {
  GetJobs,
  GetJobsFilters,
  PaginationOptions,
  GetJobsResult,
} from "./GetJobs";
import { JobRepository, Cache } from "@remote-dev-jobs/core";

export class CachedGetJobs extends GetJobs {
  constructor(
    jobRepo: JobRepository,
    private readonly cache: Cache,
    private readonly ttlSeconds: number = 300, // 5 minutos
  ) {
    super(jobRepo);
  }

  private getCacheKey(
    filters: GetJobsFilters,
    pagination: PaginationOptions,
  ): string {
    const filterStr = JSON.stringify(filters);
    const paginationStr = JSON.stringify(pagination);
    return `getJobs:${filterStr}:${paginationStr}`;
  }

  async execute(
    filters: GetJobsFilters = {},
    pagination: PaginationOptions = {},
  ): Promise<GetJobsResult> {
    const cacheKey = this.getCacheKey(filters, pagination);

    // Tentar buscar do cache
    const cached = await this.cache.get<GetJobsResult>(cacheKey);
    if (cached) {
      return cached;
    }

    // Se não estiver no cache, executar a busca
    const result = await super.execute(filters, pagination);

    // Salvar no cache
    await this.cache.set(cacheKey, result, this.ttlSeconds);

    return result;
  }
}
