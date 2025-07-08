import { JobId } from "./JobId";

export interface JobProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  url: string;
  publishedAt: Date;
  description?: string;
}

export class Job {
  public readonly id: JobId;
  public readonly title: string;
  public readonly company: string;
  public readonly location: string;
  public readonly salary?: string;
  public readonly url: string;
  public readonly publishedAt: Date;
  public readonly description?: string;

  private constructor(props: JobProps) {
    this.id = JobId.create(props.id);
    this.title = props.title;
    this.company = props.company;
    this.location = props.location;
    this.salary = props.salary;
    this.url = props.url;
    this.publishedAt = props.publishedAt;
    this.description = props.description;
  }

  public static create(props: JobProps): Job {
    return new Job(props);
  }

  public isRemote(): boolean {
    return /remote/i.test(this.location);
  }

  public toPrimitives() {
    return {
      id: this.id.value,
      title: this.title,
      company: this.company,
      location: this.location,
      salary: this.salary,
      url: this.url,
      publishedAt: this.publishedAt,
      description: this.description,
    };
  }
}
