import { getJobsFactory, GetJobsFilters, PaginationOptions, GetJobsResult } from '@tiago/application/get-jobs';

export const getJobsAction = async (
  filters: GetJobsFilters = {},
  pagination: PaginationOptions = {},
): Promise<GetJobsResult> => getJobsFactory().execute(filters, pagination); 