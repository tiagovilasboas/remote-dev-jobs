import { JobRepository } from './JobRepository';
import { Job } from './Job';
import { JobId } from './JobId';

export class FakeJobRepository implements JobRepository {
  constructor(private readonly jobs: Job[] = []) {}

  async listAll(): Promise<Job[]> {
    return this.jobs;
  }

  async findById(id: JobId): Promise<Job | null> {
    return this.jobs.find(j => j.id.value === id.value) ?? null;
  }
} 