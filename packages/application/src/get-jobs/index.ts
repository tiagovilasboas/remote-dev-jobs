import { GetJobs } from './GetJobs';
import { CachedGetJobs } from './CachedGetJobs';
import { MemoryCache } from '@remote-dev-jobs/core';
import { CachedJobRepo } from '@remote-dev-jobs/infra/CachedJobRepo';
import {
  AggregateJobRepo,
  RemotiveRepo,
  GreenhouseRepo,
  WorkableRepo,
} from '@remote-dev-jobs/infra';

// Cache compartilhado para toda a aplicação
const sharedCache = new MemoryCache({ 
  ttlSeconds: 300, // 5 minutos
  prefix: 'jobs' 
});

// Iniciar limpeza automática do cache
sharedCache.startCleanup();

export const getJobsFactory = () => {
  // Criar repositórios com cache
  const remotiveRepo = new CachedJobRepo(new RemotiveRepo(), sharedCache, 300);
  const greenhouseRepo = new CachedJobRepo(new GreenhouseRepo(), sharedCache, 300);
  const workableRepo = new CachedJobRepo(new WorkableRepo(), sharedCache, 300);

  const aggregateRepo = new AggregateJobRepo([
    remotiveRepo,
    greenhouseRepo,
    workableRepo,
  ]);

  return new CachedGetJobs(aggregateRepo, sharedCache, 300);
};

export { GetJobs } from './GetJobs';
export type { GetJobsFilters } from './GetJobs';
export type { PaginationOptions, GetJobsResult } from './GetJobs'; 