import { Job, JobId, JobRepository } from "@remote-dev-jobs/core";

export class VagasComRepo implements JobRepository {
  public readonly source = "Vagas.com";
  private readonly baseUrl = "https://www.vagas.com.br";

  async listAll(): Promise<Job[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/vagas-de-programador-remoto`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      return this.parseJobs(html);
    } catch (error) {
      console.error("Erro ao buscar vagas do Vagas.com:", error);
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
      console.error("Erro ao buscar vaga específica do Vagas.com:", error);
      return null;
    }
  }

  private parseJobs(html: string): Job[] {
    const jobs: Job[] = [];
    const jobRegex =
      /<div class="job-item"[^>]*>.*?<h3[^>]*>.*?<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>.*?<span[^>]*class="company"[^>]*>([^<]*)<\/span>.*?<span[^>]*class="location"[^>]*>([^<]*)<\/span>/gs;

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
    const titleMatch = html.match(/<h1[^>]*>([^<]*)<\/h1>/);
    const companyMatch = html.match(
      /<span[^>]*class="company"[^>]*>([^<]*)<\/span>/,
    );
    const locationMatch = html.match(
      /<span[^>]*class="location"[^>]*>([^<]*)<\/span>/,
    );
    const descriptionMatch = html.match(
      /<div[^>]*class="job-description"[^>]*>([\s\S]*?)<\/div>/,
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
