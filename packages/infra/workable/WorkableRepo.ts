import { Job } from '@remote-dev-jobs/core';
import { JobRepository } from '@remote-dev-jobs/core';
import {
  fetchWorkableJobs,
  fetchWorkableJobById,
  mapToJobProps,
} from './WorkableApi';
import { WORKABLE_BR_COMPANIES } from '../brCompanies';

export class WorkableRepo implements JobRepository {
  public readonly source = 'workable';

  constructor(private readonly companies: string[] = WORKABLE_BR_COMPANIES) {}

  async listAll(): Promise<Job[]> {
    if (this.companies.length === 0) return [];
    const workableJobs = await fetchWorkableJobs(this.companies);
    return workableJobs.map(wj => {
      const jobProps = mapToJobProps(wj);
      return Job.create(jobProps);
    });
  }

  async getById(id: string): Promise<Job | null> {
    const jobWithDetails = await fetchWorkableJobById(id);
    if (!jobWithDetails) return null;

    const jobProps = mapToJobProps(jobWithDetails);
    return Job.create(jobProps);
  }
} 