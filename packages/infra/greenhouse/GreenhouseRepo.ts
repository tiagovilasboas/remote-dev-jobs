import {
  fetchGreenhouseJobs,
  fetchGreenhouseJobById,
  mapToJobProps,
} from "./GreenhouseApi";
import { Job } from "@remote-dev-jobs/core";
import { JobRepository } from "@remote-dev-jobs/core";

export class GreenhouseRepo implements JobRepository {
  public readonly source = "greenhouse";

  constructor() {}

  async listAll(): Promise<Job[]> {
    const ghJobs = await fetchGreenhouseJobs();
    return ghJobs.map((gj) => {
      const jobProps = mapToJobProps(gj);
      return Job.create(jobProps);
    });
  }

  async getById(id: string): Promise<Job | null> {
    const [company, jobId] = id.split("::");
    if (!company || !jobId) return null;

    const jobWithDetails = await fetchGreenhouseJobById(`${company}::${jobId}`);
    if (!jobWithDetails) return null;

    const jobProps = mapToJobProps(jobWithDetails);
    return Job.create(jobProps);
  }
}
