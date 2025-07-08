import { Job, JobId } from "@remote-dev-jobs/core";
import { JobRepository } from "@remote-dev-jobs/core";

export interface JSearchJob {
  job_id: string;
  employer_name: string;
  job_title: string;
  job_description: string;
  job_is_remote: boolean;
  job_apply_link: string;
  job_posted_at_datetime_utc: string;
  job_city: string;
  job_country: string;
  job_employment_type: string;
  job_highlights: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
  job_required_skills?: string[];
  job_required_experience?: string;
  job_salary?: string;
  job_benefits?: string[];
  apply_options?: Array<{
    publisher: string;
    apply_link: string;
    is_direct: boolean;
  }>;
}

export interface JSearchResponse {
  status: string;
  request_id: string;
  parameters: {
    query: string;
    page: number;
    num_pages: number;
    country: string;
    language: string;
  };
  data: JSearchJob[];
}

export class JSearchRepo implements JobRepository {
  public readonly source = "JSearch";
  private apiKey: string;
  private baseUrl = "https://jsearch.p.rapidapi.com";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async listAll(): Promise<Job[]> {
    try {
      const searchQuery = "frontend developer remote";
      const url = `${this.baseUrl}/search?query=${encodeURIComponent(searchQuery)}&page=1&num_pages=1&country=BR&language=pt`;
      
      const response = await fetch(url, {
        headers: {
          "X-RapidAPI-Key": this.apiKey,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: JSearchResponse = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        console.warn("JSearch: Resposta inválida ou sem dados");
        return [];
      }

      return data.data
        .filter((job) => job.job_is_remote)
        .map((job) => this.mapToJob(job))
        .filter(Boolean) as Job[];
    } catch (error) {
      console.error("JSearch: Erro ao buscar vagas:", error);
      return [];
    }
  }

  private mapToJob(jsearchJob: JSearchJob): Job | null {
    try {
      const postedAt = new Date(jsearchJob.job_posted_at_datetime_utc);

      // Determinar o link de aplicação
      const applyLink = this.getBestApplyLink(jsearchJob);

      return Job.create({
        id: jsearchJob.job_id,
        title: jsearchJob.job_title,
        company: jsearchJob.employer_name,
        description: jsearchJob.job_description,
        location: jsearchJob.job_city || jsearchJob.job_country || "Remoto",
        salary: jsearchJob.job_salary || "Não informado",
        url: applyLink,
        publishedAt: postedAt,
      });
    } catch (error) {
      console.error("JSearch: Erro ao mapear vaga:", error, jsearchJob);
      return null;
    }
  }

  private getBestApplyLink(job: JSearchJob): string {
    // Priorizar links diretos
    if (job.apply_options && job.apply_options.length > 0) {
      const directLink = job.apply_options.find(option => option.is_direct);
      if (directLink) {
        return directLink.apply_link;
      }
      // Se não houver link direto, usar o primeiro disponível
      return job.apply_options[0].apply_link;
    }

    // Fallback para o link principal
    return job.job_apply_link;
  }

  async getById(id: string): Promise<Job | null> {
    // JSearch não suporta busca por ID individual
    // Buscar na lista completa
    const jobs = await this.listAll();
    return jobs.find(job => job.id.value === id) || null;
  }
} 