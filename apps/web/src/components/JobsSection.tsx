"use client";

import { useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { JobList } from '@remote-dev-jobs/ui/src/JobList';
import { JobCard } from '@remote-dev-jobs/ui/src/JobCard';
import { JobDetails } from '@remote-dev-jobs/ui/src/JobDetails';
import { JobFilters, FilterConfig } from './JobFilters';
import { useJobsStore } from '../stores/useJobsStore';
import { useDebounce } from '../hooks/useDebounce';

const filtersConfig: FilterConfig[] = [
  { key: 'query', label: 'Buscar', type: 'text', placeholder: 'Cargo, empresa ou stack...' },
  { key: 'workType', label: 'Tipo de trabalho', type: 'select', options: [
    { value: 'remote', label: 'Remoto' },
    { value: 'on-site', label: 'Presencial' },
    { value: 'hybrid', label: 'Híbrido' },
  ] },
  { key: 'datePosted', label: 'Data de publicação', type: 'select', options: [
    { value: '1', label: 'Últimas 24h' },
    { value: '7', label: 'Última semana' },
    { value: '30', label: 'Último mês' },
    { value: '90', label: 'Últimos 3 meses' },
  ] },
];

export function JobsSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const {
    jobs,
    selectedJob,
    loading,
    loadingDetails,
    filters,
    page,
    fetchJobs,
    selectJob,
    setFilters,
    setPage
  } = useJobsStore();

  // Debounce filters to avoid excessive API calls
  const debouncedFilters = useDebounce(filters, 500);

  // Sync URL params with store state
  useEffect(() => {
    const urlFilters: any = {};
    filtersConfig.forEach(f => {
      const v = searchParams.get(f.key === 'query' ? 'q' : f.key);
      if (v) urlFilters[f.key] = v;
    });
    const urlPage = searchParams.get('page');
    const jobId = searchParams.get('id');
    const newPage = urlPage ? parseInt(urlPage, 10) : 1;
    if (JSON.stringify(urlFilters) !== JSON.stringify(filters)) setFilters(urlFilters);
    if (newPage !== page) setPage(newPage);
    if (jobId && jobId !== 'undefined' && jobId !== 'null') selectJob(jobId);
  }, [searchParams, filters, page, setFilters, setPage, selectJob]);

  // Fetch jobs when debounced filters or page changes
  useEffect(() => {
    fetchJobs(debouncedFilters, page);
  }, [debouncedFilters, page, fetchJobs]);

  // Update URL when filters or page changes
  const updateURL = useCallback((newFilters: any, newPage: number, jobId?: string) => {
    const params = new URLSearchParams();
    filtersConfig.forEach(f => {
      const v = newFilters[f.key];
      if (v) params.set(f.key === 'query' ? 'q' : f.key, v);
    });
    if (newPage > 1) params.set('page', String(newPage));
    if (jobId) params.set('id', jobId);
    const newURL = params.toString() ? `/?${params.toString()}` : '/';
    router.push(newURL);
  }, [router]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    updateURL(newFilters, 1);
  }, [setFilters, updateURL]);

  // Handle page changes
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    updateURL(filters, newPage);
  }, [setPage, updateURL, filters]);

  // Handle job selection
  const handleJobSelect = useCallback((job: any) => {
    const jobId = job.id.value;
    selectJob(jobId);
    updateURL(filters, page, jobId);
  }, [selectJob, updateURL, filters, page]);

  // Limpar filtros
  const handleClearFilters = () => {
    setFilters({});
    updateURL({}, 1);
  };

  // Chips de filtros ativos
  const filtersRecord: Record<string, string> = filters as Record<string, string>;
  const activeFilterChips = filtersConfig.filter(f => filtersRecord[f.key]).map(f => ({
    key: f.key,
    label: f.label,
    value: filtersRecord[f.key],
    display: f.options ? (f.options.find(opt => opt.value === filtersRecord[f.key])?.label || filtersRecord[f.key]) : filtersRecord[f.key],
  }));

  const handleRemoveChip = (key: string) => {
    const newFilters = { ...filtersRecord };
    delete newFilters[key];
    setFilters(newFilters);
    updateURL(newFilters, 1);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Filtros e chips no topo */}
      <div className="mb-6">
        <JobFilters filtersConfig={filtersConfig} />
        {activeFilterChips.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {activeFilterChips.map(chip => (
              <span key={chip.key} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {chip.label}: {chip.display}
                <button onClick={() => handleRemoveChip(chip.key)} className="ml-2 text-blue-600 hover:text-blue-900">×</button>
              </span>
            ))}
            <button onClick={handleClearFilters} className="ml-2 text-xs text-gray-600 underline">Limpar filtros</button>
          </div>
        )}
      </div>
      
      {/* Lista de vagas e detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <JobList jobs={jobs?.items || []} isLoading={loading}>
            {(job) => (
              <div onClick={() => handleJobSelect(job)} className="cursor-pointer">
                <JobCard 
                  job={job} 
                  isSelected={selectedJob?.id.value === job.id.value}
                />
              </div>
            )}
          </JobList>
          
          {/* Pagination */}
          {jobs && jobs.total > 20 && (
            <div className="mt-6 flex justify-center gap-4">
              {page > 1 && (
                <button
                  onClick={() => handlePageChange(page - 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Anterior
                </button>
              )}
              {page < Math.ceil(jobs.total / 20) && (
                <button
                  onClick={() => handlePageChange(page + 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Próximo
                </button>
              )}
            </div>
          )}
        </div>
        
        <div>
          {selectedJob ? (
            <JobDetails job={selectedJob} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Selecione uma vaga para ver os detalhes
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 