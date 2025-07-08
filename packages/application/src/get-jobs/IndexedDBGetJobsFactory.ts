import { IndexedDBAggregateRepo } from "@remote-dev-jobs/infra/cache/IndexedDBAggregateRepo";
import { JobRepoFactory } from "@remote-dev-jobs/infra/factory/JobRepoFactory";
import { getEnabledSources } from "@remote-dev-jobs/infra/sources/JobSources";

export const createIndexedDBGetJobsFactory = () => {
  // Criar repositório agregado que lê apenas do IndexedDB
  const enabledSources = getEnabledSources();
  const aggregateRepo = new IndexedDBAggregateRepo(enabledSources);

  return {
    // Método principal para buscar todas as vagas
    async getAllJobs() {
      return aggregateRepo.listAll();
    },

    // Método para buscar vaga específica
    async getJobById(id: string) {
      return aggregateRepo.getById(id);
    },

    // Método para filtrar vagas
    async filterJobs(filters: {
      remote?: boolean;
      location?: string;
      company?: string;
      title?: string;
    }) {
      return aggregateRepo.filterJobs(filters);
    },

    // Método para obter estatísticas
    async getStats() {
      return aggregateRepo.getAllStats();
    },

    // Método para verificar se há dados
    async hasData() {
      return aggregateRepo.hasAnyData();
    },

    // Método para buscar vagas de uma fonte específica
    async getJobsBySource(source: string) {
      return aggregateRepo.getJobsBySource(source);
    },

    // Método para obter lista de fontes disponíveis
    getAvailableSources() {
      return getEnabledSources();
    },
  };
};

// Factory padrão para uso direto
export const indexedDBGetJobs = createIndexedDBGetJobsFactory();
