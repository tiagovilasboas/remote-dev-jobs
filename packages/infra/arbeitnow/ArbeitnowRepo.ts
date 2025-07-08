import { Job, JobId } from '@remote-dev-jobs/core';
import { JobRepository } from '@remote-dev-jobs/core';
import { fetchArbeitnowJobs, mapToJobProps } from './ArbeitnowApi';

export class ArbeitnowRepo implements JobRepository {
  async listAll(): Promise<Job[]> {
    const arbeitnowJobs = await fetchArbeitnowJobs();
    return arbeitnowJobs.map(aj => Job.create(mapToJobProps(aj)));
  }

  async findById(id: JobId): Promise<Job | null> {
    const jobs = await this.listAll();
    return jobs.find(j => j.id.value === id.value) ?? null;
  }
} 