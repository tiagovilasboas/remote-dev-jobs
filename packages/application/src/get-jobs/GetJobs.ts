import { JobRepository } from '@tiago/core/jobs/JobRepository';
import { Job } from '@tiago/core/jobs/Job';

export class GetJobs {
  constructor(private readonly jobRepo: JobRepository) {}

  async execute(): Promise<Job[]> {
    return this.jobRepo.listAll();
  }
} 