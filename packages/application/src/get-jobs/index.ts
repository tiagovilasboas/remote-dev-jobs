import { GetJobs } from './GetJobs';
import { AggregateJobRepo, RemotiveRepo, ArbeitnowRepo, GreenhouseRepo, LeverRepo, WorkableRepo, GupyRepo } from '@remote-dev-jobs/infra';

export const getJobsFactory = () =>
  new GetJobs(
    new AggregateJobRepo([
      new RemotiveRepo(),
      new ArbeitnowRepo(),
      new GreenhouseRepo(),
      new LeverRepo(),
      new WorkableRepo(),
      new GupyRepo(),
    ]),
  );

export { GetJobs } from './GetJobs';
export type { GetJobsFilters } from './GetJobs';
export type { PaginationOptions, GetJobsResult } from './GetJobs'; 