import { Job, JobRepository } from "@remote-dev-jobs/core";

export class IndeedRepo implements JobRepository {
  public readonly source = "Indeed Brasil";
  private readonly baseUrl = "https://br.indeed.com";

  async listAll(): Promise<Job[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/q-front-end-developer-vagas.html`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      return this.parseJobs(html);
    } catch (error) {
      console.error("Erro ao buscar vagas do Indeed:", error);
      return [];
    }
  }

  async getById(id: string): Promise<Job | null> {
    try {
      const response = await fetch(`${this.baseUrl}/vaga/${id}`);

      if (!response.ok) {
        return null;
      }

      const html = await response.text();
      return this.parseJobDetail(html, id);
    } catch (error) {
      console.error("Erro ao buscar vaga específica do Indeed:", error);
      return null;
    }
  }

  private parseJobs(html: string): Job[] {
    const jobs: Job[] = [];
    const jobRegex =
      /<div[^>]*class="[^"]*job_seen_beacon[^"]*"[^>]*>.*?<a[^>]*href="([^"]*)"[^>]*>.*?<h2[^>]*>([^<]*)<\/h2>.*?<span[^>]*class="[^"]*companyName[^"]*"[^>]*>([^<]*)<\/span>.*?<div[^>]*class="[^"]*companyLocation[^"]*"[^>]*>([^<]*)<\/div>/gs;

    let match;
    while ((match = jobRegex.exec(html)) !== null) {
      const [, url, title, company, location] = match;
      const id =
        url.split("/").pop() || Math.random().toString(36).substr(2, 9);

      jobs.push(
        Job.create({
          id,
          title: this.cleanText(title),
          company: this.cleanText(company),
          location: this.cleanText(location),
          description: "",
          url: url.startsWith("http") ? url : `${this.baseUrl}${url}`,
          publishedAt: new Date(),
          salary: undefined,
        }),
      );
    }

    return jobs;
  }

  private parseJobDetail(html: string, id: string): Job | null {
    const titleMatch = html.match(
      /<h1[^>]*class="[^"]*jobsearch-JobInfoHeader-title[^"]*"[^>]*>([^<]*)<\/h1>/,
    );
    const companyMatch = html.match(
      /<span[^>]*class="[^"]*companyName[^"]*"[^>]*>([^<]*)<\/span>/,
    );
    const locationMatch = html.match(
      /<div[^>]*class="[^"]*companyLocation[^"]*"[^>]*>([^<]*)<\/div>/,
    );
    const descriptionMatch = html.match(
      /<div[^>]*class="[^"]*jobsearch-jobDescriptionText[^"]*"[^>]*>([\s\S]*?)<\/div>/,
    );

    if (!titleMatch) return null;

    return Job.create({
      id,
      title: this.cleanText(titleMatch[1]),
      company: this.cleanText(companyMatch?.[1] || ""),
      location: this.cleanText(locationMatch?.[1] || ""),
      description: this.cleanText(descriptionMatch?.[1] || ""),
      url: `${this.baseUrl}/vaga/${id}`,
      publishedAt: new Date(),
      salary: undefined,
    });
  }

  private cleanText(text: string): string {
    return text
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
}
