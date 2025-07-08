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
    const all = await this.jobRepo.listAll();
    return all.filter(job => {
      if (filters.stack && !job.title.toLowerCase().includes(filters.stack.toLowerCase())) {
        return false;
      }
      if (
        filters.seniority &&
        !job.title.toLowerCase().includes(filters.seniority.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.location &&
        !job.location.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }
} 