import {
  Job,
  JobRepository,
  JobFilterService,
  JobFilters,
} from "@remote-dev-jobs/core";

export type GetJobsFilters = {
  query?: string;
  workType?: string;
  datePosted?: string;
  stack?: string;
  seniority?: string;
  location?: string;
};

export type PaginationOptions = {
  page?: number;
  limit?: number;
};

export interface GetJobsResult {
  items: Job[];
  total: number;
}

export class GetJobs {
  constructor(private readonly jobRepo: JobRepository) {}

  async execute(
    filters: GetJobsFilters = {},
    pagination: PaginationOptions = {},
  ): Promise<GetJobsResult> {
    const effectiveFilters: JobFilters = {
      ...filters,
      location: filters.location ?? "brazil",
    };

    const all = await this.jobRepo.listAll();
    const filtered = JobFilterService.filterJobs(all, effectiveFilters);
    const sorted = JobFilterService.sortByDate(filtered);

    const page = Math.max(1, pagination.page ?? 1);
    const size = Math.max(1, pagination.limit ?? 20);
    const items = JobFilterService.paginate(sorted, page, size);

    return { items, total: filtered.length };
  }
}
