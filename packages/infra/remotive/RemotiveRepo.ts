import { Job, JobId } from '@remote-dev-jobs/core';
import { JobRepository } from '@remote-dev-jobs/core';
import { fetchRemotiveJobs, mapToJobProps } from './RemotiveApi';

export class RemotiveRepo implements JobRepository {
  public readonly source = 'remotive';

  async listAll(): Promise<Job[]> {
    const remoteJobs = await fetchRemotiveJobs();
    return remoteJobs.map(rj => Job.create(mapToJobProps(rj)));
  }

  async getById(id: string): Promise<Job | null> {
    const [, jobId] = id.split('::');
    if (!jobId) return null;

    const jobs = await this.listAll();
    return jobs.find(j => j.id.value === id) ?? null;
  }
} 