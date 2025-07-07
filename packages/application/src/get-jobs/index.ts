import { GetJobs } from './GetJobs';
import { RemotiveRepo } from '@remote-dev-jobs/infra';

export const getJobsFactory = () => new GetJobs(new RemotiveRepo());

export { GetJobs } from './GetJobs'; 