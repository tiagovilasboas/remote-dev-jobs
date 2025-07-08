export interface JobItem {
  id: { value: string };
  title: string;
  company: string;
  location: string;
  publishedAt: Date | string;
  url: string;
  salary?: string;
  description?: string;
}
