import { getJobsFactory, GetJobsFilters } from '@tiago/application/get-jobs';

export const getJobsAction = async (filters: GetJobsFilters = {}) => getJobsFactory().execute(filters); 