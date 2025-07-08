import { CachedGetJobs } from "./CachedGetJobs";
import { GetJobs } from "./GetJobs";
import { MemoryCache } from "@remote-dev-jobs/core";
import { AggregateRepoFactory } from "@remote-dev-jobs/infra/factory/AggregateRepoFactory";
import { IndexedDBAggregateRepo } from "@remote-dev-jobs/infra/cache/IndexedDBAggregateRepo";
import { getEnabledSources } from "@remote-dev-jobs/infra/sources/JobSources";

// Cache compartilhado para toda a aplicação (apenas servidor)
const sharedCache = new MemoryCache({
  ttlSeconds: 300, // 5 minutos
  prefix: "jobs",
});

// Iniciar limpeza automática do cache
sharedCache.startCleanup();

export const getJobsFactory = () => {
  // Verificar se está no cliente (browser) ou servidor (Node.js)
  const isClient = typeof window !== 'undefined';
  
  if (isClient) {
    try {
      // No cliente, usar IndexedDB para melhor performance
      const enabledSources = getEnabledSources();
      const aggregateRepo = new IndexedDBAggregateRepo(enabledSources);
      return new GetJobs(aggregateRepo);
    } catch (error) {
      console.warn('Erro ao inicializar IndexedDB, usando fallback:', error);
      // Fallback para cache em memória no cliente
      const aggregateRepo = AggregateRepoFactory.createAggregateJobRepo();
      return new CachedGetJobs(aggregateRepo, sharedCache, 300);
    }
  } else {
    // No servidor, usar APIs externas com cache em memória
    const aggregateRepo = AggregateRepoFactory.createAggregateJobRepo();
    return new CachedGetJobs(aggregateRepo, sharedCache, 300);
  }
};

export { GetJobs } from "./GetJobs";
export type {
  GetJobsFilters,
  PaginationOptions,
  GetJobsResult,
} from "./GetJobs";
export { CachedGetJobs } from "./CachedGetJobs";
