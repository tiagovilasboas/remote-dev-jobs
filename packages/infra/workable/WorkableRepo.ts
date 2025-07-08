import { fetchWorkableJobs, fetchWorkableJobById, mapToJobProps } from "./WorkableApi";
import { Job } from "@remote-dev-jobs/core";
import { JobRepository } from "@remote-dev-jobs/core";

export class WorkableRepo implements JobRepository {
  public readonly source = "workable";

  constructor() {}

  async listAll(): Promise<Job[]> {
    const workableJobs = await fetchWorkableJobs();
    return workableJobs.map((wj) => {
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
