"use client";

import { GetJobsFilters } from "@tiago/application/get-jobs";
import { useDebouncedCallback } from "use-debounce";

export interface FilterConfig {
  key: keyof GetJobsFilters;
  label: string;
  type: "text" | "select";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

const defaultFilters: FilterConfig[] = [
  {
    key: "query",
    label: "Buscar",
    type: "text",
    placeholder: "Cargo, empresa ou stack...",
  },
  {
    key: "workType",
    label: "Tipo de trabalho",
    type: "select",
    options: [
      { value: "remote", label: "Remoto" },
      { value: "on-site", label: "Presencial" },
      { value: "hybrid", label: "Híbrido" },
    ],
  },
  {
    key: "datePosted",
    label: "Data de publicação",
    type: "select",
    options: [
      { value: "1", label: "Últimas 24h" },
      { value: "7", label: "Última semana" },
      { value: "30", label: "Último mês" },
    ],
  },
];

interface JobFiltersProps {
  filters: Partial<GetJobsFilters>;
  onFilterChange: (filters: Partial<GetJobsFilters>) => void;
  filtersConfig?: FilterConfig[];
}

export const JobFilters = ({
  filters,
  onFilterChange,
  filtersConfig = defaultFilters,
}: JobFiltersProps) => {
  const handleChange = useDebouncedCallback(
    (key: keyof GetJobsFilters, value: string) => {
      onFilterChange({
        ...filters,
        [key]: value,
      });
    },
    300,
  );

  const mainSearch = filtersConfig.find((f) => f.key === "query");
  const secondaryFilters = filtersConfig.filter((f) => f.key !== "query");

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      {mainSearch && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {mainSearch.label}
          </label>
          <input
            type="text"
            placeholder={mainSearch.placeholder}
            className="w-full rounded-lg border border-gray-300 p-3 text-base focus:border-transparent focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleChange(mainSearch.key, e.target.value)}
            value={filters[mainSearch.key] || ""}
          />
        </div>
      )}

      {secondaryFilters.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {secondaryFilters.map((filter) => (
            <div key={filter.key}>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {filter.label}
              </label>
              {filter.type === "text" && (
                <input
                  type="text"
                  placeholder={filter.placeholder}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleChange(filter.key, e.target.value)}
                  value={filters[filter.key] || ""}
                />
              )}
              {filter.type === "select" && filter.options && (
                <select
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleChange(filter.key, e.target.value)}
                  value={filters[filter.key] || ""}
                >
                  <option value="">Selecione...</option>
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
