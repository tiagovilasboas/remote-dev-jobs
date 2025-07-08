import { Job, JobId } from '@remote-dev-jobs/core';
import { JobRepository } from '@remote-dev-jobs/core';
import { fetchLeverJobs, mapToJobProps } from './LeverApi';
import { LEVER_BR_COMPANIES } from '../brCompanies';

export class LeverRepo implements JobRepository {
  public readonly source = 'lever';

  constructor(private readonly companies: string[] = LEVER_BR_COMPANIES) {}

  async listAll(): Promise<Job[]> {
    if (this.companies.length === 0) {
      return [];
    }
    const leverJobs = await fetchLeverJobs(this.companies);
    return leverJobs.map(lj => {
      const jobProps = mapToJobProps(lj);
      return Job.create(jobProps);
    });
  }

  async getById(id: string): Promise<Job | null> {
    const jobs = await this.listAll();
    return jobs.find(j => j.id.value === id) ?? null;
  }

  async findById(id: JobId): Promise<Job | null> {
    return this.getById(id.value);
  }
} 