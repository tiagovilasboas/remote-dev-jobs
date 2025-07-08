import { nextCache } from "../../../../lib/cache";
import { GetJobDetailsUseCase } from "@remote-dev-jobs/application/get-job-details";
import { JobRepository } from "@remote-dev-jobs/core";
import { JobRepoFactory } from "@remote-dev-jobs/infra/factory/JobRepoFactory";
import { getEnabledSources } from "@remote-dev-jobs/infra/sources/JobSources";
import { NextRequest, NextResponse } from "next/server";

function getJobDetailsFactory(): GetJobDetailsUseCase {
  const enabledSources = getEnabledSources();
  const repositories: Record<string, JobRepository> = {};

  enabledSources.forEach((source) => {
    try {
      const repo = JobRepoFactory.createRateLimitedRepo(source);
      repositories[repo.source] = repo;
    } catch (error) {
      console.error(`Erro ao criar repositório para ${source}:`, error);
    }
  });

  return new GetJobDetailsUseCase(repositories);
}

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = context.params;
  if (!id) {
    return NextResponse.json(
      { message: "Job ID is required" },
      { status: 400 },
    );
  }

  // Criar chave de cache
  const cacheKey = `api:job:${id}`;

  // Tentar buscar do cache
  const cached = await nextCache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const getJobDetails = getJobDetailsFactory();
  const job = await getJobDetails.execute(id);

  if (!job) {
    return NextResponse.json({ message: "Job not found" }, { status: 404 });
  }

  const result = job.toPrimitives();

  // Salvar no cache
  await nextCache.set(cacheKey, result, 300);

  return NextResponse.json(result);
}
