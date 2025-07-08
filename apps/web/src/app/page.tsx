import dynamic from 'next/dynamic';
import JobsSection from '../components/JobsSection';

export default async function HomePage({ searchParams }: { searchParams?: { [key: string]: string } }) {
  const filters: any = {};
  const set = (k:string,v?:string)=>{if(v) filters[k]=v};
  set('stack', searchParams?.stack);
  set('seniority', searchParams?.seniority);
  set('location', searchParams?.location);
  set('query', searchParams?.q);
  const pageNum = Number(searchParams?.page ?? '1');

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
      <JobsSection filters={filters} page={pageNum} />
    </main>
  );
} 