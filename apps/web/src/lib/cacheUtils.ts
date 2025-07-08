import { nextCache } from "./cache";

export class CacheManager {
  static async invalidateJobsCache(): Promise<void> {
    // Invalidar cache de jobs (implementação simples - limpar tudo)
    // Em uma implementação mais robusta, você poderia usar padrões de chave
    await nextCache.clear();
  }

  static async invalidateJobCache(jobId: string): Promise<void> {
    const cacheKey = `api:job:${jobId}`;
    await nextCache.delete(cacheKey);
  }

  static async invalidateJobsListCache(): Promise<void> {
    // Invalidar cache da lista de jobs
    // Como as chaves são baseadas nos parâmetros, seria necessário
    // implementar um sistema de tags ou padrões de chave
    await nextCache.clear();
  }

  static async getCacheStats(): Promise<{
    totalEntries: number;
    memoryUsage?: number;
  }> {
    // Esta é uma implementação básica
    // Em uma implementação real, você teria acesso às estatísticas do cache
    return {
      totalEntries: 0,
      memoryUsage: 0,
    };
  }
}
