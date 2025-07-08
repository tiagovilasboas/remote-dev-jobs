"use client";

import { useJobsStore } from "../stores/useJobsStore";
import { JobFilters } from "./JobFilters";
import { JobCard } from "@remote-dev-jobs/ui/src/JobCard";
import { Spinner } from "@remote-dev-jobs/ui/src/Spinner";
import { GetJobsFilters } from "@tiago/application/get-jobs";
import { JobItem } from "@remote-dev-jobs/ui/src/JobItem";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function JobsSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    jobs,
    loading,
    filters,
    getJobs,
    setFilters,
  } = useJobsStore();

  useEffect(() => {
    const urlFilters: Partial<GetJobsFilters> = {};
    const q = searchParams.get("q");
    const workType = searchParams.get("workType");
    const datePosted = searchParams.get("datePosted");
    const page = searchParams.get("page");

    if (q) urlFilters.query = q;
    if (workType) urlFilters.workType = workType;
    if (datePosted) urlFilters.datePosted = datePosted;
    if (page) setCurrentPage(parseInt(page));

    setFilters(urlFilters);
    getJobs(urlFilters, page ? parseInt(page) : 1);
  }, [searchParams, setFilters, getJobs]);

  const handleFilterChange = (newFilters: Partial<GetJobsFilters>) => {
    setFilters(newFilters);
    setCurrentPage(1);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key === "query" ? "q" : key, value);
      }
    });
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const totalPages = jobs ? Math.ceil(jobs.total / 20) : 1;
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <div className="space-y-6">
      {/* Filtros no topo */}
      <div className="w-full">
        <JobFilters onFilterChange={handleFilterChange} filters={filters} />
      </div>

      {/* Feedback da quantidade de vagas */}
      {!loading && jobs && (
        <div className="text-sm text-gray-700 font-medium px-2">
          {jobs.total > 0
            ? `${jobs.total} vaga${jobs.total === 1 ? '' : 's'} encontrada${jobs.total === 1 ? '' : 's'}`
            : 'Nenhuma vaga encontrada com os filtros aplicados.'}
        </div>
      )}

      {/* Lista de vagas */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs?.items.map((job) => (
              <a
                key={job.id.value}
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <JobCard job={job} />
              </a>
            ))}
          </div>

          {/* Paginação */}
          {jobs && jobs.items.length > 0 && (
            <div className="flex justify-center items-center space-x-2 py-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPrevPage}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
