import { Job, JobId } from '@remote-dev-jobs/core';
import { JobRepository } from '@remote-dev-jobs/core';
import { fetchWorkableJobs, mapToJobProps } from './WorkableApi';
import { WORKABLE_BR_COMPANIES } from '../brCompanies';

export class WorkableRepo implements JobRepository {
  constructor(private readonly companies: string[] = WORKABLE_BR_COMPANIES) {}

  async listAll(): Promise<Job[]> {
    if (this.companies.length === 0) return [];
    const results = await fetchWorkableJobs(this.companies);
    return results.flatMap(({ company, jobs }) => jobs.map(j => Job.create(mapToJobProps(j, company))));
  }

  async findById(id: JobId): Promise<Job | null> {
    const jobs = await this.listAll();
    return jobs.find(j => j.id.value === id.value) ?? null;
  }
} 