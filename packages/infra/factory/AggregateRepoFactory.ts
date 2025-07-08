import { AggregateJobRepo } from "../aggregate/AggregateJobRepo";
import { IndexedDBAggregateRepo } from "../cache/IndexedDBAggregateRepo";
import { RateLimitedJobRepo } from "../cache/RateLimitedJobRepo";
import {
  JobSource,
  SourceType,
  getEnabledSources,
  getSourcesByType,
  getSourcesByTag,
  getSourceConfig,
} from "../sources/JobSources";
import { JobRepoFactory } from "./JobRepoFactory";
import { JobRepository } from "@remote-dev-jobs/core";
import { getEnvironmentConfig } from "../config/environment";

export class AggregateRepoFactory {
  /**
   * Cria repositório agregado para fontes de um tipo específico
   */
  static createIndexedDBAggregateRepoByType(
    type: SourceType,
  ): IndexedDBAggregateRepo {
    const sources = getSourcesByType(type);
    return new IndexedDBAggregateRepo(sources);
  }

  /**
   * Cria repositório agregado apenas para APIs
   */
  static createAPIAggregateRepo(): IndexedDBAggregateRepo {
    return this.createIndexedDBAggregateRepoByType(SourceType.API);
  }

  /**
   * Cria repositório agregado apenas para scrapers
   */
  static createScraperAggregateRepo(): IndexedDBAggregateRepo {
    return this.createIndexedDBAggregateRepoByType(SourceType.SCRAPER);
  }

  /**
   * Cria repositório agregado apenas para fontes brasileiras
   */
  static createBrazilianAggregateRepo(): IndexedDBAggregateRepo {
    const brazilianSources = getSourcesByTag("brasil");
    return new IndexedDBAggregateRepo(brazilianSources);
  }

  /**
   * Cria repositório agregado apenas para fontes internacionais
   */
  static createInternationalAggregateRepo(): IndexedDBAggregateRepo {
    const internationalSources = getEnabledSources().filter((source) => {
      const config = getSourceConfig(source);
      return (
        config.tags.includes("internacional") || config.tags.includes("europa")
      );
    });
    return new IndexedDBAggregateRepo(internationalSources);
  }

  /**
   * Cria repositórios com rate limiting para todas as fontes habilitadas
   */
  static createAllRateLimitedRepos(): RateLimitedJobRepo[] {
    const enabledSources = getEnabledSources();

    return enabledSources
      .map((source) => {
        try {
          return JobRepoFactory.createRateLimitedRepo(source);
        } catch (error) {
          console.error(`Erro ao criar repositório para ${source}:`, error);
          return null;
        }
      })
      .filter((repo): repo is RateLimitedJobRepo => repo !== null);
  }

  /**
   * Cria repositórios com rate limiting para fontes de um tipo específico
   */
  static createRateLimitedReposByType(type: SourceType): RateLimitedJobRepo[] {
    const sources = getSourcesByType(type);

    return sources
      .map((source) => {
        try {
          return JobRepoFactory.createRateLimitedRepo(source);
        } catch (error) {
          console.error(`Erro ao criar repositório para ${source}:`, error);
          return null;
        }
      })
      .filter((repo): repo is RateLimitedJobRepo => repo !== null);
  }

  /**
   * Cria AggregateJobRepo com todos os repositórios habilitados
   */
  static createAggregateJobRepo(): AggregateJobRepo {
    // Verificar se está rodando no servidor (Node.js) ou no cliente (browser)
    const isServer = typeof window === 'undefined';
    
    if (isServer) {
      // No servidor, usar apenas repositórios que não dependem do IndexedDB
      const serverRepos = this.createServerRepos();
      return new AggregateJobRepo(serverRepos);
    } else {
      // No cliente, usar repositórios com rate limiting
      const repos = this.createAllRateLimitedRepos();
      return new AggregateJobRepo(repos);
    }
  }

  /**
   * Cria repositórios que funcionam no servidor (sem IndexedDB)
   */
  private static createServerRepos(): JobRepository[] {
    const enabledSources = getEnabledSources();
    const config = getEnvironmentConfig();
    
    return enabledSources
      .map((source) => {
        try {
          // JSearch precisa de API key
          if (source === JobSource.JSEARCH) {
            if (!config.JSEARCH_API_KEY) {
              console.warn("JSearch API key não configurada, pulando...");
              return null;
            }
            return JobRepoFactory.createDirectRepo(source, config.JSEARCH_API_KEY);
          }
          
          return JobRepoFactory.createDirectRepo(source);
        } catch (error) {
          console.error(`Erro ao criar repositório para ${source}:`, error);
          return null;
        }
      })
      .filter((repo): repo is JobRepository => repo !== null);
  }
}
