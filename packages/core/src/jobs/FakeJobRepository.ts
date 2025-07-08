import { Job } from "./Job";
import { JobId } from "./JobId";
import { JobRepository } from "./JobRepository";

export class FakeJobRepository implements JobRepository {
  public readonly source = "fake";

  constructor(private readonly jobs: Job[] = []) {}

  async listAll(): Promise<Job[]> {
    return this.jobs;
  }

  async getById(id: string): Promise<Job | null> {
    return this.jobs.find((j) => j.id.value === id) ?? null;
  }

  async findById(id: JobId): Promise<Job | null> {
    return this.getById(id.value);
  }
}
