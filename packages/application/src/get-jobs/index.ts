import { GetJobs } from './GetJobs';
import { AggregateJobRepo, RemotiveRepo, ArbeitnowRepo, GreenhouseRepo, LeverRepo } from '@remote-dev-jobs/infra';

export const getJobsFactory = () =>
  new GetJobs(
    new AggregateJobRepo([
      new RemotiveRepo(),
      new ArbeitnowRepo(),
      new GreenhouseRepo(),
      new LeverRepo(),
    ]),
  );

export { GetJobs } from './GetJobs';
export type { GetJobsFilters } from './GetJobs'; 