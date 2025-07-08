import { JobRepository } from '@tiago/core/jobs/JobRepository';
import { Job } from '@tiago/core/jobs/Job';

export interface GetJobsFilters {
  stack?: string;
  seniority?: string;
  location?: string;
  query?: string;
}

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface GetJobsResult {
  items: Job[];
  total: number;
}

export class GetJobs {
  constructor(private readonly jobRepo: JobRepository) {}

  async execute(filters: GetJobsFilters = {}, pagination: PaginationOptions = {}): Promise<GetJobsResult> {
    const effectiveFilters: GetJobsFilters = {
      ...filters,
      location: filters.location ?? 'brazil',
    };
    const all = await this.jobRepo.listAll();
    const filtered = all.filter(job => {
      if (
        effectiveFilters.query &&
        ![
          job.title.toLowerCase(),
          job.company.toLowerCase(),
        ].some(text => text.includes(effectiveFilters.query!.toLowerCase()))
      ) {
        return false;
      }
      if (effectiveFilters.stack && !job.title.toLowerCase().includes(effectiveFilters.stack.toLowerCase())) {
        return false;
      }
      if (
        effectiveFilters.seniority &&
        !job.title.toLowerCase().includes(effectiveFilters.seniority.toLowerCase())
      ) {
        return false;
      }
      if (
        effectiveFilters.location &&
        !job.location.toLowerCase().includes(effectiveFilters.location.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    const sorted = filtered.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    const page = Math.max(1, pagination.page ?? 1);
    const size = Math.max(1, pagination.pageSize ?? 20);
    const start = (page - 1) * size;
    const items = sorted.slice(start, start + size);
    return { items, total: filtered.length };
  }
} 