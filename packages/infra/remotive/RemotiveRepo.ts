import { Job, JobId } from '@remote-dev-jobs/core';
import { JobRepository } from '@remote-dev-jobs/core';
import { fetchRemotiveJobs, mapToJobProps } from './RemotiveApi';

export class RemotiveRepo implements JobRepository {
  async listAll(): Promise<Job[]> {
    const remoteJobs = await fetchRemotiveJobs();
    return remoteJobs.map(rj => Job.create(mapToJobProps(rj)));
  }

  async findById(id: JobId): Promise<Job | null> {
    const jobs = await this.listAll();
    return jobs.find(j => j.id.value === id.value) ?? null;
  }
} 