import { Job } from './Job';
import { JobId } from './JobId';

export interface JobRepository {
  source: string;
  listAll(): Promise<Job[]>;
  getById(id: string): Promise<Job | null>;
} 