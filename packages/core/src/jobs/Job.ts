import { JobId } from './JobId';

export interface JobProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  url: string;
  publishedAt: Date;
}

export class Job {
  public readonly id: JobId;
  public readonly title: string;
  public readonly company: string;
  public readonly location: string;
  public readonly salary?: string;
  public readonly url: string;
  public readonly publishedAt: Date;

  private constructor(props: JobProps) {
    this.id = JobId.create(props.id);
    this.title = props.title;
    this.company = props.company;
    this.location = props.location;
    this.salary = props.salary;
    this.url = props.url;
    this.publishedAt = props.publishedAt;
  }

  public static create(props: JobProps): Job {
    return new Job(props);
  }

  public isRemote(): boolean {
    return /remote/i.test(this.location);
  }
} 