import { JobRepoFactory } from "../factory/JobRepoFactory";
import {
  JobSource,
  SourceType,
  SOURCE_CONFIGS,
  getEnabledSources,
  getSourceConfig,
} from "./JobSources";

export class SourceManager {
  /**
   * Habilita uma fonte
   */
  static enableSource(source: JobSource): void {
    SOURCE_CONFIGS[source].enabled = true;
  }

  /**
   * Desabilita uma fonte
   */
  static disableSource(source: JobSource): void {
    SOURCE_CONFIGS[source].enabled = false;
  }

  /**
   * Habilita múltiplas fontes
   */
  static enableSources(sources: JobSource[]): void {
    sources.forEach((source) => this.enableSource(source));
  }

  /**
   * Desabilita múltiplas fontes
   */
  static disableSources(sources: JobSource[]): void {
    sources.forEach((source) => this.disableSource(source));
  }

  /**
   * Habilita apenas fontes de um tipo específico
   */
  static enableOnlyType(type: SourceType): void {
    Object.values(JobSource).forEach((source) => {
      const config = SOURCE_CONFIGS[source];
      config.enabled = config.type === type;
    });
  }

  /**
   * Habilita apenas fontes brasileiras
   */
  static enableOnlyBrazilian(): void {
    Object.values(JobSource).forEach((source) => {
      const config = SOURCE_CONFIGS[source];
      config.enabled = config.tags.includes("brasil");
    });
  }

  /**
   * Habilita apenas APIs (sem scrapers)
   */
  static enableOnlyAPIs(): void {
    Object.values(JobSource).forEach((source) => {
      const config = SOURCE_CONFIGS[source];
      config.enabled = config.type === SourceType.API;
    });
  }

  /**
   * Habilita apenas scrapers (sem APIs)
   */
  static enableOnlyScrapers(): void {
    Object.values(JobSource).forEach((source) => {
      const config = SOURCE_CONFIGS[source];
      config.enabled = config.type === SourceType.SCRAPER;
    });
  }

  /**
   * Habilita apenas fontes com uma tag específica
   */
  static enableOnlyWithTag(tag: string): void {
    Object.values(JobSource).forEach((source) => {
      const config = SOURCE_CONFIGS[source];
      config.enabled = config.tags.includes(tag);
    });
  }

  /**
   * Configura rate limit para uma fonte
   */
  static setRateLimit(source: JobSource, minutes: number): void {
    SOURCE_CONFIGS[source].rateLimitMinutes = minutes;
  }

  /**
   * Configura rate limit para múltiplas fontes
   */
  static setRateLimitForMultiple(sources: JobSource[], minutes: number): void {
    sources.forEach((source) => this.setRateLimit(source, minutes));
  }

  /**
   * Configura rate limit para um tipo específico
   */
  static setRateLimitForType(type: SourceType, minutes: number): void {
    Object.values(JobSource).forEach((source) => {
      const config = SOURCE_CONFIGS[source];
      if (config.type === type) {
        config.rateLimitMinutes = minutes;
      }
    });
  }

  /**
   * Obtém estatísticas das fontes
   */
  static getSourceStats(): {
    total: number;
    enabled: number;
    disabled: number;
    byType: Record<SourceType, number>;
    byTag: Record<string, number>;
    missingImplementations: JobSource[];
  } {
    const allSources = Object.values(JobSource);
    const enabledSources = getEnabledSources();
    const disabledSources = allSources.filter(
      (source) => !enabledSources.includes(source),
    );

    const byType: Record<SourceType, number> = {
      [SourceType.API]: 0,
      [SourceType.SCRAPER]: 0,
      [SourceType.GITHUB]: 0,
    };

    const byTag: Record<string, number> = {};

    enabledSources.forEach((source) => {
      const config = getSourceConfig(source);
      byType[config.type]++;

      config.tags.forEach((tag) => {
        byTag[tag] = (byTag[tag] || 0) + 1;
      });
    });

    const missingImplementations = JobRepoFactory.getMissingImplementations();

    return {
      total: allSources.length,
      enabled: enabledSources.length,
      disabled: disabledSources.length,
      byType,
      byTag,
      missingImplementations,
    };
  }

  /**
   * Lista fontes por tipo
   */
  static getSourcesByType(type: SourceType): JobSource[] {
    return Object.values(JobSource).filter((source) => {
      const config = SOURCE_CONFIGS[source];
      return config.enabled && config.type === type;
    });
  }

  /**
   * Lista fontes por tag
   */
  static getSourcesByTag(tag: string): JobSource[] {
    return Object.values(JobSource).filter((source) => {
      const config = SOURCE_CONFIGS[source];
      return config.enabled && config.tags.includes(tag);
    });
  }

  /**
   * Lista fontes brasileiras
   */
  static getBrazilianSources(): JobSource[] {
    return this.getSourcesByTag("brasil");
  }

  /**
   * Lista fontes internacionais
   */
  static getInternationalSources(): JobSource[] {
    return Object.values(JobSource).filter((source) => {
      const config = SOURCE_CONFIGS[source];
      return (
        config.enabled &&
        (config.tags.includes("internacional") ||
          config.tags.includes("europa"))
      );
    });
  }

  /**
   * Lista apenas APIs
   */
  static getAPISources(): JobSource[] {
    return this.getSourcesByType(SourceType.API);
  }

  /**
   * Lista apenas scrapers
   */
  static getScraperSources(): JobSource[] {
    return this.getSourcesByType(SourceType.SCRAPER);
  }

  /**
   * Lista apenas fontes remotas
   */
  static getRemoteSources(): JobSource[] {
    return this.getSourcesByTag("remoto");
  }

  /**
   * Verifica se uma fonte está habilitada
   */
  static isEnabled(source: JobSource): boolean {
    return SOURCE_CONFIGS[source].enabled;
  }

  /**
   * Verifica se uma fonte tem implementação
   */
  static hasImplementation(source: JobSource): boolean {
    return JobRepoFactory.hasRepoImplementation(source);
  }

  /**
   * Obtém configuração de uma fonte
   */
  static getConfig(source: JobSource) {
    return SOURCE_CONFIGS[source];
  }

  /**
   * Lista todas as configurações
   */
  static getAllConfigs() {
    return Object.values(SOURCE_CONFIGS);
  }
}
