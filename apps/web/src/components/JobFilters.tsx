"use client";

import { GetJobsFilters } from "@tiago/application/get-jobs";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";

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
    placeholder: "Ex: react, frontend, javascript...",
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
  const [searchValue, setSearchValue] = useState(filters.query || "");

  // Sincronizar o valor local com os filtros quando eles mudarem externamente
  useEffect(() => {
    setSearchValue(filters.query || "");
  }, [filters.query]);

  const handleSearchChange = useDebouncedCallback(
    (value: string) => {
      const newFilters = { ...filters };
      if (value) {
        newFilters.query = value;
      } else {
        delete newFilters.query;
      }
      onFilterChange(newFilters);
    },
    300,
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value); // Atualizar imediatamente o input
    handleSearchChange(value); // Debounce para a busca
  };

  const handleChange = useDebouncedCallback(
    (key: keyof GetJobsFilters, value: string) => {
      const newFilters = { ...filters };
      if (value) {
        newFilters[key] = value;
      } else {
        delete newFilters[key];
      }
      onFilterChange(newFilters);
    },
    300,
  );

  const mainSearch = filtersConfig.find((f) => f.key === "query");
  const secondaryFilters = filtersConfig.filter((f) => f.key !== "query");

  // Chips de filtros ativos
  const activeFilterChips = Object.entries(filters)
    .filter(([key, value]) => value && key !== 'query')
    .map(([key, value]) => {
      const config = filtersConfig.find((f) => f.key === key);
      const label = config?.label || key;
      const optionLabel = config?.options?.find((opt) => opt.value === value)?.label;
      return {
        key,
        label: `${label}: ${optionLabel || value}`,
      };
    });

  const hasActiveFilters = !!(filters.query || activeFilterChips.length > 0);

  const handleRemoveFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key as keyof GetJobsFilters];
    onFilterChange(newFilters);
  };

  const handleClearAll = () => {
    onFilterChange({});
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      {/* Chips de filtros ativos */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          {filters.query && (
            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
              Busca: {filters.query}
              <button
                className="ml-2 text-blue-600 hover:text-blue-900 focus:outline-none"
                onClick={() => handleRemoveFilter('query')}
                aria-label="Remover busca"
              >
                ×
              </button>
            </span>
          )}
          {activeFilterChips.map((chip) => (
            <span key={chip.key} className="inline-flex items-center bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
              {chip.label}
              <button
                className="ml-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                onClick={() => handleRemoveFilter(chip.key)}
                aria-label={`Remover filtro ${chip.label}`}
              >
                ×
              </button>
            </span>
          ))}
          <button
            className="ml-2 text-xs text-red-600 hover:underline focus:outline-none"
            onClick={handleClearAll}
            aria-label="Limpar todos os filtros"
          >
            Limpar filtros
          </button>
        </div>
      )}
      {/* Busca principal */}
      {mainSearch && (
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-gray-700">
            {mainSearch.label}
          </label>
          <input
            type="text"
            placeholder={mainSearch.placeholder || 'Busque por cargo, empresa ou tecnologia...'}
            className="w-full rounded-lg border border-gray-300 p-4 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
            onChange={handleSearchInputChange}
            value={searchValue}
            onBlur={() => { if (!searchValue) handleSearchChange(''); }}
          />
        </div>
      )}
      {/* Filtros secundários */}
      {secondaryFilters.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {secondaryFilters.map((filter) => (
            <div key={filter.key}>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {filter.label}
              </label>
              {filter.type === "text" && (
                <input
                  type="text"
                  placeholder={filter.placeholder}
                  className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleChange(filter.key, e.target.value)}
                  value={filters[filter.key] || ""}
                />
              )}
              {filter.type === "select" && filter.options && (
                <select
                  className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
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
