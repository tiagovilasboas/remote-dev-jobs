import {
  GetJobsFilters,
  GetJobsResult,
} from "@remote-dev-jobs/application/get-jobs";
import { JobFilterService } from "@remote-dev-jobs/core/jobs/JobFilterService";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface JobsSlice {
  jobs: GetJobsResult | null;
  loading: boolean;
  error: string | null;
  getJobs: (filters: GetJobsFilters, page: number) => Promise<void>;
}

export interface FiltersSlice {
  filters: Partial<GetJobsFilters>;
  page: number;
  setFilters: (filters: Partial<GetJobsFilters>) => void;
  setPage: (page: number) => void;
}

type JobStore = JobsSlice & FiltersSlice;

export const useJobsStore = create<JobStore>()(
  immer((set, get) => ({
    jobs: null,
    loading: false,
    error: null,
    filters: {},
    page: 1,

    getJobs: async (filters, page) => {
      console.log('[Store] getJobs chamado com:', { filters, page });
      set({ loading: true, error: null });
      try {
        // Verificar se há filtros ativos
        const hasActiveFilters = Object.values(filters).some(value => value && value !== '') || filters.query;
        console.log('[Store] hasActiveFilters:', hasActiveFilters, 'filters:', filters);
        
        if (hasActiveFilters) {
          // Com filtros, sempre usar API para garantir dados atualizados
          const params = new URLSearchParams({
            page: String(page),
            ...filters,
          });
          console.log('[Store] Fazendo requisição para API com filtros:', params.toString());
          const response = await fetch(`/api/jobs?${params.toString()}`);
          if (!response.ok) throw new Error("Failed to fetch jobs");
          const data: GetJobsResult = await response.json();
          console.log('[Store] Dados recebidos da API:', { total: data.total, items: data.items.length });
          set({ jobs: data, loading: false });
          return;
        }
        
        // Sem filtros, tentar IndexedDB primeiro para performance
        const isClient = typeof window !== 'undefined';
        if (isClient) {
          try {
            const { indexedDBGetJobs } = await import('@remote-dev-jobs/application/get-jobs/IndexedDBGetJobsFactory');
            let allJobs = await indexedDBGetJobs.getAllJobs();
            if (!allJobs || allJobs.length === 0) {
              // IndexedDB vazio, buscar da API
              const params = new URLSearchParams({
                page: String(page),
                ...filters,
              });
              const response = await fetch(`/api/jobs?${params.toString()}`);
              if (!response.ok) throw new Error("Failed to fetch jobs");
              const data: GetJobsResult = await response.json();
              set({ jobs: data, loading: false });
              return;
            }
            // Aplicar filtros usando JobFilterService (mesma lógica do backend)
            let filteredJobs = JobFilterService.filterJobs(allJobs, filters);
            
            // Paginação
            const limit = 20;
            const start = (page - 1) * limit;
            const end = start + limit;
            const paginatedJobs = filteredJobs.slice(start, end);
            const result = {
              items: paginatedJobs,
              total: filteredJobs.length,
              page,
              limit,
              totalPages: Math.ceil(filteredJobs.length / limit)
            };
            set({ jobs: result, loading: false });
            return;
          } catch (error) {
            console.warn('Erro ao usar IndexedDB, usando API:', error);
          }
        }
        
        // Fallback para API (SSR ou erro no IndexedDB)
        const params = new URLSearchParams({
          page: String(page),
          ...filters,
        });
        const response = await fetch(`/api/jobs?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data: GetJobsResult = await response.json();
        set({ jobs: data, loading: false });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "An unknown error occurred";
        set({ error: message, loading: false });
      }
    },

    setFilters: (filters) => {
      set({ filters, page: 1 });
    },

    setPage: (page) => {
      set({ page });
    },
  })),
);
