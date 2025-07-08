import { Job, JobRepository } from "@remote-dev-jobs/core";
import { HttpClient } from "../utils/httpClient";

export class CoodeshRepo implements JobRepository {
  public readonly source = "Coodesh";
  private readonly baseUrl = "https://coodesh.com";

  async listAll(): Promise<Job[]> {
    try {
      console.log(`[${this.source}] Iniciando busca de vagas...`);
      
      const html = await HttpClient.fetchWithRetry(
        `${this.baseUrl}/jobs`,
        {
          delayMs: 2000,
          maxRetries: 3,
          timeoutMs: 15000,
        }
      );

      const jobs = this.parseJobs(html);
      console.log(`[${this.source}] ${jobs.length} vagas encontradas`);
      return jobs;
    } catch (error) {
      console.error(`[${this.source}] Erro ao buscar vagas:`, error);
      return [];
    }
  }

  async getById(id: string): Promise<Job | null> {
    try {
      const html = await HttpClient.fetchWithRetry(
        `${this.baseUrl}/vaga/${id}`,
        {
          delayMs: 1000,
          maxRetries: 2,
          timeoutMs: 10000,
        }
      );
      return this.parseJobDetail(html, id);
    } catch (error) {
      console.error(`[${this.source}] Erro ao buscar vaga específica:`, error);
      return null;
    }
  }

  private parseJobs(html: string): Job[] {
    const jobs: Job[] = [];
    
    // Padrões atualizados para o Coodesh
    const patterns = [
      // Padrão principal para cards de vagas
      /<div[^>]*class="[^"]*job-card[^"]*"[^>]*>.*?<a[^>]*href="([^"]*)"[^>]*>.*?<h3[^>]*>([^<]*)<\/h3>.*?<span[^>]*class="[^"]*company[^"]*"[^>]*>([^<]*)<\/span>.*?<span[^>]*class="[^"]*location[^"]*"[^>]*>([^<]*)<\/span>/gs,
      
      // Padrão alternativo para listagem
      /<div[^>]*class="[^"]*job-item[^"]*"[^>]*>.*?<a[^>]*href="([^"]*)"[^>]*>.*?<h2[^>]*>([^<]*)<\/h2>.*?<div[^>]*class="[^"]*company[^"]*"[^>]*>([^<]*)<\/div>.*?<div[^>]*class="[^"]*location[^"]*"[^>]*>([^<]*)<\/div>/gs,
      
      // Padrão mais genérico
      /<a[^>]*href="([^"]*\/vaga\/[^"]*)"[^>]*>.*?<h[2-4][^>]*>([^<]*)<\/h[2-4]>.*?<[^>]*class="[^"]*company[^"]*"[^>]*>([^<]*)<\/[^>]*>.*?<[^>]*class="[^"]*location[^"]*"[^>]*>([^<]*)<\/[^>]*>/gs,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        const [, url, title, company, location] = match;
        
        // Validar se os dados são válidos
        if (!title || !company || !url) continue;
        
        const id = url.split("/").pop() || Math.random().toString(36).substr(2, 9);
        const fullUrl = url.startsWith("http") ? url : `${this.baseUrl}${url}`;

        jobs.push(
          Job.create({
            id,
            title: this.cleanText(title),
            company: this.cleanText(company),
            location: this.cleanText(location),
            description: "",
            url: fullUrl,
            publishedAt: new Date(),
            salary: undefined,
          }),
        );
      }
      
      // Se encontrou vagas com este padrão, para de tentar outros
      if (jobs.length > 0) break;
    }

    return jobs;
  }

  private parseJobDetail(html: string, id: string): Job | null {
    const titleMatch = html.match(
      /<h1[^>]*class="[^"]*job-title[^"]*"[^>]*>([^<]*)<\/h1>/,
    );
    const companyMatch = html.match(
      /<span[^>]*class="[^"]*company-name[^"]*"[^>]*>([^<]*)<\/span>/,
    );
    const locationMatch = html.match(
      /<span[^>]*class="[^"]*job-location[^"]*"[^>]*>([^<]*)<\/span>/,
    );
    const descriptionMatch = html.match(
      /<div[^>]*class="[^"]*job-description[^"]*"[^>]*>([\s\S]*?)<\/div>/,
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
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim();
  }
}
