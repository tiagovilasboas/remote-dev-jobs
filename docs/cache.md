# Sistema de Cache

Este documento descreve o sistema de cache implementado no projeto Remote Dev Jobs.

## Arquitetura

O sistema de cache foi implementado em múltiplas camadas para otimizar a performance:

### 1. Cache no Core (`packages/core/src/cache/`)

- **Interface `Cache`**: Define a interface genérica para implementações de cache
- **`MemoryCache`**: Implementação em memória com TTL automático e limpeza periódica

### 2. Cache na Infraestrutura (`packages/infra/CachedJobRepo.ts`)

- **`CachedJobRepo`**: Wrapper que adiciona cache aos repositórios de jobs
- Cacheia chamadas para `listAll()` e `getById()` com TTL de 5 minutos

### 3. Cache na Aplicação (`packages/application/src/get-jobs/CachedGetJobs.ts`)

- **`CachedGetJobs`**: Versão com cache do caso de uso GetJobs
- Cacheia resultados de buscas com filtros e paginação

### 4. Cache no Next.js (`apps/web/src/lib/`)

- **`nextCache`**: Instância global de cache para o Next.js
- **`cacheMiddleware`**: Middleware para adicionar cache às rotas da API
- **`cacheUtils`**: Utilitários para gerenciar o cache

## Configuração

### TTL (Time To Live)

- **Repositórios**: 5 minutos (300 segundos)
- **Casos de uso**: 5 minutos (300 segundos)
- **APIs Next.js**: 5 minutos (300 segundos)

### Limpeza Automática

O cache em memória executa limpeza automática a cada 60 segundos para remover entradas expiradas.

## Uso

### Cache Automático

O cache é aplicado automaticamente em:

1. **Repositórios**: Todas as chamadas para APIs externas
2. **Casos de uso**: Resultados de buscas com filtros
3. **Rotas da API**: Respostas das APIs `/api/jobs` e `/api/jobs/[id]`

### Gerenciamento Manual

#### Invalidar Cache

```typescript
import { CacheManager } from "@/lib/cacheUtils";

// Invalidar cache de um job específico
await CacheManager.invalidateJobCache("job-id");

// Invalidar cache de todos os jobs
await CacheManager.invalidateJobsCache();

// Invalidar cache da lista de jobs
await CacheManager.invalidateJobsListCache();
```

#### API de Gerenciamento

- `GET /api/cache` - Obter estatísticas do cache
- `DELETE /api/cache?jobId=123` - Invalidar cache de um job específico
- `DELETE /api/cache?type=jobs` - Invalidar cache de todos os jobs

## Benefícios

1. **Performance**: Reduz chamadas desnecessárias para APIs externas
2. **Latência**: Respostas mais rápidas para dados frequentemente acessados
3. **Rate Limiting**: Reduz o risco de atingir limites de taxa das APIs
4. **Experiência do usuário**: Carregamento mais rápido da interface

## Considerações

### Memória

O cache em memória é adequado para desenvolvimento e pequenas aplicações. Para produção com alto tráfego, considere:

- Redis para cache distribuído
- Cache em disco para persistência
- Configuração de limites de memória

### Consistência

- Os dados podem estar desatualizados por até 5 minutos
- Use invalidação manual quando necessário
- Considere implementar cache warming para dados críticos

### Monitoramento

- Monitore o uso de memória do cache
- Implemente métricas de hit/miss ratio
- Configure alertas para problemas de performance

## Próximos Passos

1. **Cache distribuído**: Implementar Redis para ambientes de produção
2. **Cache warming**: Pré-carregar dados frequentemente acessados
3. **Métricas**: Adicionar monitoramento detalhado do cache
4. **TTL dinâmico**: Ajustar TTL baseado na frequência de acesso
5. **Cache tags**: Implementar sistema de tags para invalidação seletiva
