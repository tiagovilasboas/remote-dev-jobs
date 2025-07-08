import { Job } from "./Job";

export interface JobFilters {
  query?: string;
  stack?: string;
  seniority?: string;
  location?: string;
  remote?: boolean;
  company?: string;
  title?: string;
}

export class JobFilterService {
  /**
   * Filtra jobs baseado nos critérios fornecidos
   */
  static filterJobs(
    jobs: Job[],
    filters: JobFilters & { datePosted?: string; workType?: string },
  ): Job[] {
    return jobs.filter((job) => {
      // Filtro por query (busca em título e empresa)
      if (filters.query && !this.matchesQuery(job, filters.query)) {
        return false;
      }

      // Filtro por stack (busca no título)
      if (
        filters.stack &&
        !job.title.toLowerCase().includes(filters.stack.toLowerCase())
      ) {
        return false;
      }

      // Filtro por senioridade (busca no título)
      if (
        filters.seniority &&
        !job.title.toLowerCase().includes(filters.seniority.toLowerCase())
      ) {
        return false;
      }

      // Filtro por localização
      if (
        filters.location &&
        !job.location.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }

      // Filtro por tipo de trabalho (workType)
      if (filters.workType) {
        const type = filters.workType.toLowerCase();
        if (type === "remote" && !job.location.toLowerCase().includes("remote"))
          return false;
        if (type === "on-site" && job.location.toLowerCase().includes("remote"))
          return false;
        if (type === "hybrid" && !/hybrid|híbrido/i.test(job.location))
          return false;
      }

      // Filtro por remoto (legacy)
      if (filters.remote !== undefined) {
        const isRemote = job.isRemote();
        if (filters.remote && !isRemote) return false;
        if (!filters.remote && isRemote) return false;
      }

      // Filtro por empresa
      if (
        filters.company &&
        !job.company.toLowerCase().includes(filters.company.toLowerCase())
      ) {
        return false;
      }

      // Filtro por título
      if (
        filters.title &&
        !job.title.toLowerCase().includes(filters.title.toLowerCase())
      ) {
        return false;
      }

      // Filtro por data de publicação (datePosted)
      if (filters.datePosted) {
        const days = parseInt(filters.datePosted, 10);
        if (!isNaN(days)) {
          const now = new Date();
          const minDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
          if (job.publishedAt < minDate) return false;
        }
      }

      return true;
    });
  }

  /**
   * Verifica se o job corresponde à query de busca
   */
  private static matchesQuery(job: Job, query: string): boolean {
    if (!query || query.trim() === "") return true;
    
    const searchText = query.toLowerCase().trim();
    const jobText = [
      job.title.toLowerCase(),
      job.company.toLowerCase(),
      job.location.toLowerCase(),
      job.description?.toLowerCase() || "",
    ].join(" ");
    
    return jobText.includes(searchText);
  }

  /**
   * Ordena jobs por data de publicação (mais recentes primeiro)
   */
  static sortByDate(jobs: Job[]): Job[] {
    return [...jobs].sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
    );
  }

  /**
   * Aplica paginação aos jobs
   */
  static paginate(jobs: Job[], page: number = 1, pageSize: number = 20): Job[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return jobs.slice(start, end);
  }
}
