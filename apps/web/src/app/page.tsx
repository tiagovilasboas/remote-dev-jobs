import { JobList } from '@remote-dev-jobs/ui';
import { getJobsAction } from './actions/getJobs';

export default async function HomePage({ searchParams }: { searchParams?: { [key: string]: string } }) {
  const filters: any = {};
  const set = (k:string,v?:string)=>{if(v) filters[k]=v};
  set('stack', searchParams?.stack);
  set('seniority', searchParams?.seniority);
  set('location', searchParams?.location);
  set('query', searchParams?.q);
  const pageNum = Number(searchParams?.page ?? '1');
  const { items, total } = await getJobsAction(filters, { page: pageNum });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-6 text-3xl font-bold text-center">Remote Dev Jobs</h1>
      <form className="mb-6 flex justify-center gap-2" method="get">
        <input
          type="text"
          name="q"
          placeholder="Pesquisar por título ou empresa"
          defaultValue={filters.query ?? ''}
          className="w-64 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Buscar
        </button>
      </form>
      <JobList jobs={items} />
      <div className="mt-6 flex justify-center gap-4">
        {pageNum > 1 && (
          <a href={`/?${new URLSearchParams({ ...filters, page: String(pageNum - 1) }).toString()}`} className="text-blue-600 hover:underline">
            ← Anterior
          </a>
        )}
        {pageNum * 20 < total && (
          <a href={`/?${new URLSearchParams({ ...filters, page: String(pageNum + 1) }).toString()}`} className="text-blue-600 hover:underline">
            Próxima →
          </a>
        )}
      </div>
    </main>
  );
} 