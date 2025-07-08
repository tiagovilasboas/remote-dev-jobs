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
  static filterJobs(jobs: Job[], filters: JobFilters): Job[] {
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

      // Filtro por remoto
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

      return true;
    });
  }

  /**
   * Verifica se o job corresponde à query de busca
   */
  private static matchesQuery(job: Job, query: string): boolean {
    const searchText = query.toLowerCase();
    return [
      job.title.toLowerCase(),
      job.company.toLowerCase(),
      job.location.toLowerCase(),
    ].some((text) => text.includes(searchText));
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
