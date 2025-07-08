import {
  GetJobsFilters,
  GetJobsResult,
} from "@remote-dev-jobs/application/get-jobs";
import { Job } from "@remote-dev-jobs/core";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface JobsSlice {
  jobs: GetJobsResult | null;
  selectedJob: Job | null;
  loading: boolean;
  error: string | null;
  getJobs: (filters: GetJobsFilters, page: number) => Promise<void>;
  getJobDetails: (id: string) => Promise<void>;
  selectJob: (jobId: string | null) => void;
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
    selectedJob: null,
    loading: false,
    error: null,
    filters: {},
    page: 1,

    getJobs: async (filters, page) => {
      set({ loading: true, error: null });
      try {
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

    getJobDetails: async (id) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch(`/api/jobs/${id}`);
        if (!response.ok) throw new Error("Failed to fetch job details");
        const data: Job = await response.json();
        set({ selectedJob: data, loading: false });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "An unknown error occurred";
        set({ error: message, loading: false });
      }
    },

    selectJob: (jobId) => {
      if (!jobId) {
        set({ selectedJob: null });
        return;
      }
      const job = get().jobs?.items.find((j) => j.id.value === jobId);
      set({ selectedJob: job || null });
    },

    setFilters: (filters) => {
      set({ filters, page: 1 });
    },

    setPage: (page) => {
      set({ page });
    },
  })),
);
