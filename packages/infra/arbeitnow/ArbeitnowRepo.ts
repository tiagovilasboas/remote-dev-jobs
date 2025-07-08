import { Job } from '@remote-dev-jobs/core';
import { JobRepository } from '@remote-dev-jobs/core';
import { fetchArbeitnowJobs, mapToJobProps } from './ArbeitnowApi';

export class ArbeitnowRepo implements JobRepository {
  public readonly source = 'arbeitnow';

  async listAll(): Promise<Job[]> {
    const arbeitnowJobs = await fetchArbeitnowJobs();
    return arbeitnowJobs.map(aj => Job.create(mapToJobProps(aj)));
  }

  async getById(id: string): Promise<Job | null> {
    // Arbeitnow API does not have a "get by id" endpoint, so we fetch all and filter.
    const jobs = await this.listAll();
    return jobs.find(j => j.id.value === id) ?? null;
  }
} 