import { Job, JobId } from '@remote-dev-jobs/core';
import { JobRepository } from '@remote-dev-jobs/core';
import { fetchLeverJobs, mapToJobProps } from './LeverApi';
import { LEVER_BR_COMPANIES } from '../brCompanies';

export class LeverRepo implements JobRepository {
  constructor(private readonly companies: string[] = LEVER_BR_COMPANIES) {}

  async listAll(): Promise<Job[]> {
    if (this.companies.length === 0) {
      return [];
    }
    const results = await fetchLeverJobs(this.companies);
    return results.flatMap(({ company, jobs }) => jobs.map(j => Job.create(mapToJobProps(j, company))));
  }

  async findById(id: JobId): Promise<Job | null> {
    const jobs = await this.listAll();
    return jobs.find(j => j.id.value === id.value) ?? null;
  }
} 