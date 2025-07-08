import { NextRequest, NextResponse } from 'next/server';
import { nextCache } from './cache';

export interface CacheMiddlewareOptions {
  ttlSeconds?: number;
  keyPrefix?: string;
  skipCache?: (req: NextRequest) => boolean;
}

export function withCache(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>,
  options: CacheMiddlewareOptions = {}
) {
  return async (req: NextRequest, context?: any): Promise<NextResponse> => {
    const { ttlSeconds = 300, keyPrefix = 'api', skipCache } = options;

    // Verificar se deve pular o cache
    if (skipCache && skipCache(req)) {
      return handler(req, context);
    }

    // Criar chave de cache baseada na URL e parâmetros
    const url = new URL(req.url);
    const cacheKey = `${keyPrefix}:${url.pathname}:${url.search}`;

    // Tentar buscar do cache
    const cached = await nextCache.get<{ body: any; headers: any; status: number }>(cacheKey);
    if (cached) {
      return NextResponse.json(cached.body, { 
        status: cached.status,
        headers: cached.headers 
      });
    }

    // Executar o handler original
    const response = await handler(req, context);
    
    // Se a resposta for bem-sucedida, salvar no cache
    if (response.status >= 200 && response.status < 300) {
      const body = await response.json();
      await nextCache.set(cacheKey, {
        body,
        headers: Object.fromEntries(response.headers.entries()),
        status: response.status
      }, ttlSeconds);
    }

    return response;
  };
} 