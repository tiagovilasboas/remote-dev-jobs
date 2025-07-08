import { create } from 'zustand';
import { GetJobsFilters, GetJobsResult } from '../../../../packages/application/src/get-jobs';
import { JobItem } from '@remote-dev-jobs/ui/src/JobItem';

interface JobsSlice {
  jobs: GetJobsResult | null;
  selectedJob: JobItem | null;
  loading: boolean;
  loadingDetails: boolean;
  setJobs: (jobs: GetJobsResult | null) => void;
  setSelectedJob: (job: JobItem | null) => void;
  setLoading: (loading: boolean) => void;
  setLoadingDetails: (loading: boolean) => void;
  fetchJobs: (filters?: Partial<GetJobsFilters>, page?: number) => Promise<void>;
  fetchJobDetails: (jobId: string) => Promise<void>;
  selectJob: (jobId: string) => void;
}

interface FiltersSlice {
  filters: Partial<GetJobsFilters>;
  page: number;
  setFilters: (filters: Partial<GetJobsFilters>) => void;
  setPage: (page: number) => void;
}

function createJobsSlice(set: any, get: any): JobsSlice {
  return {
    jobs: null,
    selectedJob: null,
    loading: false,
    loadingDetails: false,
    setJobs: (jobs) => set({ jobs }),
    setSelectedJob: (job) => set({ selectedJob: job }),
    setLoading: (loading) => set({ loading }),
    setLoadingDetails: (loading) => set({ loadingDetails: loading }),
    fetchJobs: async (filters = get().filters, page = get().page) => {
      set({ loading: true });
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => {
          if (v) params.set(k === 'query' ? 'q' : k, v);
        });
        params.set('page', String(page));
        const response = await fetch(`/api/jobs?${params.toString()}`);
        if (response.status === 429) throw new Error('Rate limit exceeded. Please try again later.');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const processedItems = data.items.map((j: any, index: number) => {
          let jobId = typeof j.id === 'object' ? j.id._value || j.id.value : j.id;
          if (!jobId || jobId === 'undefined' || jobId === 'null') jobId = `fallback-${index}-${Date.now()}`;
          return { ...j, id: { value: jobId }, publishedAt: new Date(j.publishedAt) };
        });
        const seenIds = new Set<string>();
        const finalItems = processedItems.map((job: any, index: number) => {
          let finalId = job.id.value;
          if (seenIds.has(finalId)) finalId = `${finalId}-${index}`;
          seenIds.add(finalId);
          return { ...job, id: { value: finalId } };
        });
        set({ jobs: { ...data, items: finalItems }, loading: false });
      } catch (error) {
        console.error('Error fetching jobs:', error);
        set({ jobs: { items: [], total: 0 }, loading: false });
      }
    },
    fetchJobDetails: async (jobId: string) => {
      if (!jobId || jobId === 'undefined' || jobId === 'null') {
        set({ selectedJob: null, loadingDetails: false });
        return;
      }
      set({ loadingDetails: true, selectedJob: null });
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        if (response.status === 429) throw new Error('Rate limit exceeded. Please try again later.');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const jobDetails = await response.json();
        set({ selectedJob: jobDetails, loadingDetails: false });
      } catch (error) {
        console.error('Error fetching job details:', error);
        set({ selectedJob: null, loadingDetails: false });
      }
    },
    selectJob: (jobId: string) => {
      const { fetchJobDetails } = get();
      fetchJobDetails(jobId);
    },
  };
}

function createFiltersSlice(set: any): FiltersSlice {
  return {
    filters: {},
    page: 1,
    setFilters: (filters) => set({ filters, page: 1 }),
    setPage: (page) => set({ page }),
  };
}

export const useJobsStore = create<JobsSlice & FiltersSlice>((set, get) => ({
  ...createJobsSlice(set, get),
  ...createFiltersSlice(set),
})); 