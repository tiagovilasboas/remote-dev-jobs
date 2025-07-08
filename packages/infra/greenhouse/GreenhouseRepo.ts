import { Job, JobId } from '@remote-dev-jobs/core';
import { JobRepository } from '@remote-dev-jobs/core';
import { fetchGreenhouseJobs, mapToJobProps } from './GreenhouseApi';

const COMPANY_NAME_FROM_URL = /https?:\/\/boards\.greenhouse\.io\/v1\/boards\/([a-z0-9-]+)\//i;

export class GreenhouseRepo implements JobRepository {
  constructor(private readonly companies: string[] = []) {}

  async listAll(): Promise<Job[]> {
    const companies = this.companies.length > 0 ? this.companies : undefined;
    const ghJobs = await fetchGreenhouseJobs(companies);
    return ghJobs.map(gj => {
      const jobProps = mapToJobProps(gj);
      const match = COMPANY_NAME_FROM_URL.exec(jobProps.url);
      const company = match?.[1] ?? 'Unknown';
      return Job.create({ ...jobProps, company });
    });
  }

  async findById(id: JobId): Promise<Job | null> {
    const jobs = await this.listAll();
    return jobs.find(j => j.id.value === id.value) ?? null;
  }
} 