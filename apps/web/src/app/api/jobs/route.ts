import { nextCache } from "../../../lib/cache";
import { getJobsFactory } from "@remote-dev-jobs/application/get-jobs";
import { GetJobsFilters } from "@remote-dev-jobs/application/get-jobs";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 60; // ISR – revalidate every minute

export async function GET(req: NextRequest) {
  const getJobs = getJobsFactory();
  const { searchParams } = new URL(req.url);

  const filters: GetJobsFilters = {};
  const query = searchParams.get("query");
  const workType = searchParams.get("workType");
  const datePosted = searchParams.get("datePosted");

  if (query) filters.query = query;
  if (workType) filters.workType = workType;
  if (datePosted) filters.datePosted = datePosted;

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  // Criar chave de cache baseada nos parâmetros
  const cacheKey = `api:jobs:${JSON.stringify(filters)}:${page}:${limit}`;

  // Tentar buscar do cache
  const cached = await nextCache.get(cacheKey);
  if (cached) {
    console.log(`[API] Cache hit para: ${cacheKey}`);
    return NextResponse.json(cached);
  }

  console.log(`[API] Cache miss, buscando dados para: ${cacheKey}`);
  try {
    const result = await getJobs.execute(filters, { page, limit });
    
    // Salvar no cache para próximas requisições
    await nextCache.set(cacheKey, result, 300); // 5 minutos
    console.log(`[API] Dados salvos no cache: ${result.total} vagas`);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { message: "Error fetching jobs" },
      { status: 500 },
    );
  }
}
