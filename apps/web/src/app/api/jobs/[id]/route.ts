import { NextResponse } from 'next/server';
import { GetJobDetailsUseCase } from '@remote-dev-jobs/application/get-job-details';
import { RemotiveRepo } from '@remote-dev-jobs/infra/remotive/RemotiveRepo';
import { GreenhouseRepo } from '@remote-dev-jobs/infra/greenhouse/GreenhouseRepo';
import { WorkableRepo } from '@remote-dev-jobs/infra/workable/WorkableRepo';
import { ArbeitnowRepo } from '@remote-dev-jobs/infra/arbeitnow/ArbeitnowRepo';
import { nextCache } from '../../../../lib/cache';

function getJobDetailsFactory() {
  const remotiveRepo = new RemotiveRepo();
  const greenhouseRepo = new GreenhouseRepo();
  const workableRepo = new WorkableRepo();
  const arbeitnowRepo = new ArbeitnowRepo();

  const useCase = new GetJobDetailsUseCase({
    [remotiveRepo.source]: remotiveRepo,
    [greenhouseRepo.source]: greenhouseRepo,
    [workableRepo.source]: workableRepo,
    [arbeitnowRepo.source]: arbeitnowRepo,
  });

  return useCase;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  // Criar chave de cache
  const cacheKey = `api:job:${id}`;
  
  // Tentar buscar do cache
  const cached = await nextCache.get(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const useCase = getJobDetailsFactory();
  const job = await useCase.execute(id);

  if (!job) {
    return NextResponse.json({ message: 'Job not found' }, { status: 404 });
  }

  const result = job.toPrimitives();
  
  // Salvar no cache
  await nextCache.set(cacheKey, result, 300);
  
  return NextResponse.json(result);
} 