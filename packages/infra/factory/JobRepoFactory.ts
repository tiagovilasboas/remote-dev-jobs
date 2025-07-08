import { ArbeitnowRepo } from "../arbeitnow/ArbeitnowRepo";
import { IndexedDBAggregateRepo } from "../cache/IndexedDBAggregateRepo";
import { IndexedDBJobRepo } from "../cache/IndexedDBJobRepo";
import { RateLimitedJobRepo } from "../cache/RateLimitedJobRepo";
import { CathoRepo } from "../catho/CathoRepo";
import { CoodeshRepo } from "../coodesh/CoodeshRepo";
import { GitHubVagasRepo } from "../github/GitHubVagasRepo";
import { GreenhouseRepo } from "../greenhouse/GreenhouseRepo";
import { GupyRepo } from "../gupy/GupyRepo";
import { HipstersRepo } from "../hipsters/HipstersRepo";
import { IndeedRepo } from "../indeed/IndeedRepo";
import { InfoJobsRepo } from "../infojobs/InfoJobsRepo";
import { LeverRepo } from "../lever/LeverRepo";
import { RemotarRepo } from "../remotar/RemotarRepo";
// Importar todos os repositórios
import { RemotiveRepo } from "../remotive/RemotiveRepo";
import {
  JobSource,
  getEnabledSources,
  getSourceConfig,
} from "../sources/JobSources";
import { TramposRepo } from "../trampos/TramposRepo";
import { VagasComRepo } from "../vagascom/VagasComRepo";
import { WorkableRepo } from "../workable/WorkableRepo";
import { JobRepository } from "@remote-dev-jobs/core";

// Mapeamento de fontes para suas classes de repositório
const REPO_CLASSES: Record<JobSource, new () => JobRepository> = {
  [JobSource.REMOTIVE]: RemotiveRepo,
  [JobSource.ARBEITNOW]: ArbeitnowRepo,
  [JobSource.GREENHOUSE]: GreenhouseRepo,
  [JobSource.LEVER]: LeverRepo,
  [JobSource.WORKABLE]: WorkableRepo,
  [JobSource.GUPY]: GupyRepo,
  [JobSource.VAGAS_COM]: VagasComRepo,
  [JobSource.INFOJOBS]: InfoJobsRepo,
  [JobSource.CATHO]: CathoRepo,
  [JobSource.REMOTAR]: RemotarRepo,
  [JobSource.TRAMPOS]: TramposRepo,
  [JobSource.HIPSTERS]: HipstersRepo,
  [JobSource.COODESH]: CoodeshRepo,
  [JobSource.INDEED]: IndeedRepo,
  [JobSource.GITHUB_VAGAS]: GitHubVagasRepo,
};

export class JobRepoFactory {
  /**
   * Cria um repositório com rate limiting para uma fonte específica
   */
  static createRateLimitedRepo(source: JobSource): RateLimitedJobRepo {
    const config = getSourceConfig(source);
    const RepoClass = REPO_CLASSES[source];

    if (!RepoClass) {
      throw new Error(`Repositório não encontrado para fonte: ${source}`);
    }

    return new RateLimitedJobRepo(
      new RepoClass(),
      config.cacheKey,
      config.rateLimitMinutes,
    );
  }

  /**
   * Cria repositório que lê apenas do IndexedDB para uma fonte específica
   */
  static createIndexedDBRepo(source: JobSource): IndexedDBJobRepo {
    return new IndexedDBJobRepo(source);
  }

  /**
   * Cria repositório agregado que lê apenas do IndexedDB
   */
  static createIndexedDBAggregateRepo(
    sources?: JobSource[],
  ): IndexedDBAggregateRepo {
    const sourcesToUse = sources || getEnabledSources();
    return new IndexedDBAggregateRepo(sourcesToUse);
  }

  /**
   * Verifica se uma fonte tem repositório implementado
   */
  static hasRepoImplementation(source: JobSource): boolean {
    return REPO_CLASSES[source] !== undefined;
  }

  /**
   * Lista todas as fontes com implementação disponível
   */
  static getAvailableSources(): JobSource[] {
    return Object.values(JobSource).filter((source) =>
      this.hasRepoImplementation(source),
    );
  }

  /**
   * Lista fontes habilitadas mas sem implementação
   */
  static getMissingImplementations(): JobSource[] {
    const enabledSources = getEnabledSources();
    return enabledSources.filter(
      (source) => !this.hasRepoImplementation(source),
    );
  }
}
