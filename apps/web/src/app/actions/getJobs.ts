import { GetJobs, GetJobsFilters } from '@tiago/application/get-jobs';
import { RemotiveRepo } from '@tiago/infra/remotive/RemotiveRepo';

const useCase = new GetJobs(new RemotiveRepo());

export const getJobsAction = async (filters: GetJobsFilters = {}) => useCase.execute(filters); 