'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useJobsStore } from '../stores/useJobsStore';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

const defaultFilters: FilterConfig[] = [
  { key: 'query', label: 'Buscar', type: 'text', placeholder: 'Cargo, empresa ou stack...' },
  { key: 'location', label: 'Localização', type: 'text', placeholder: 'Cidade, estado ou país...' },
  { key: 'company', label: 'Empresa', type: 'text', placeholder: 'Nome da empresa...' },
  // Exemplo de select:
  // { key: 'jobType', label: 'Tipo de vaga', type: 'select', options: [ { value: 'clt', label: 'CLT' }, ... ] }
];

export const JobFilters = ({ filtersConfig = defaultFilters }: { filtersConfig?: FilterConfig[] }) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const { filters, setFilters } = useJobsStore();

  const handleChange = useDebouncedCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (value) {
      params.set(key === 'query' ? 'q' : key, value);
    } else {
      params.delete(key === 'query' ? 'q' : key);
    }
    replace(`${pathname}?${params.toString()}`);
    setFilters({ ...filters, [key]: value });
  }, 300);

  // Separar busca principal dos filtros secundários
  const mainSearch = filtersConfig.find(f => f.key === 'query');
  const secondaryFilters = filtersConfig.filter(f => f.key !== 'query');

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      {/* Busca principal em destaque */}
      {mainSearch && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {mainSearch.label}
          </label>
          <input
            type="text"
            placeholder={mainSearch.placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            onChange={e => handleChange(mainSearch.key, e.target.value)}
            defaultValue={searchParams.get(mainSearch.key === 'query' ? 'q' : mainSearch.key)?.toString()}
          />
        </div>
      )}

      {/* Filtros secundários em linha horizontal */}
      {secondaryFilters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {secondaryFilters.map((filter) => (
            <div key={filter.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {filter.label}
              </label>
              {filter.type === 'text' && (
                <input
                  type="text"
                  placeholder={filter.placeholder}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  onChange={e => handleChange(filter.key, e.target.value)}
                  defaultValue={searchParams.get(filter.key === 'query' ? 'q' : filter.key)?.toString()}
                />
              )}
              {filter.type === 'select' && filter.options && (
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  onChange={e => handleChange(filter.key, e.target.value)}
                  defaultValue={searchParams.get(filter.key)?.toString() || ''}
                >
                  <option value="">Selecione...</option>
                  {filter.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
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