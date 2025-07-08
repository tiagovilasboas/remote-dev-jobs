import { CachedGetJobs } from "./CachedGetJobs";
import { GetJobs } from "./GetJobs";
import { MemoryCache } from "@remote-dev-jobs/core";
import { AggregateRepoFactory } from "@remote-dev-jobs/infra/factory/AggregateRepoFactory";

// Cache compartilhado para toda a aplicação
const sharedCache = new MemoryCache({
  ttlSeconds: 300, // 5 minutos
  prefix: "jobs",
});

// Iniciar limpeza automática do cache
sharedCache.startCleanup();

export const getJobsFactory = () => {
  const aggregateRepo = AggregateRepoFactory.createAggregateJobRepo();
  return new CachedGetJobs(aggregateRepo, sharedCache, 300);
};

export { GetJobs } from "./GetJobs";
export type {
  GetJobsFilters,
  PaginationOptions,
  GetJobsResult,
} from "./GetJobs";
export { CachedGetJobs } from "./CachedGetJobs";
