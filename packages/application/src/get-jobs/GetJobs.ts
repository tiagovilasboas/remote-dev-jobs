import { JobRepository } from '@tiago/core/jobs/JobRepository';
import { Job } from '@tiago/core/jobs/Job';

export interface GetJobsFilters {
  stack?: string;
  seniority?: string;
  location?: string;
}

export class GetJobs {
  constructor(private readonly jobRepo: JobRepository) {}

  async execute(filters: GetJobsFilters = {}): Promise<Job[]> {
    const effectiveFilters = { location: 'brazil', ...filters } as GetJobsFilters;
    const all = await this.jobRepo.listAll();
    return all.filter(job => {
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
  }
} 