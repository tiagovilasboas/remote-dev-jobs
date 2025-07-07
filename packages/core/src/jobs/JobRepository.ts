import { Job } from './Job';
import { JobId } from './JobId';

export interface JobRepository {
  listAll(): Promise<Job[]>;
  findById(id: JobId): Promise<Job | null>;
} 