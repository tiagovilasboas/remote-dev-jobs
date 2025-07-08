// Enum para tipos de fonte
export enum SourceType {
  API = "api",
  SCRAPER = "scraper",
  GITHUB = "github",
}

// Enum para todas as fontes disponíveis
export enum JobSource {
  // APIs Internacionais
  REMOTIVE = "Remotive",
  ARBEITNOW = "Arbeitnow",
  GREENHOUSE = "Greenhouse",
  LEVER = "Lever",
  WORKABLE = "Workable",

  // APIs Brasileiras
  GUPY = "Gupy",

  // Scrapers Brasileiros
  VAGAS_COM = "Vagas.com",
  INFOJOBS = "InfoJobs",
  CATHO = "Catho",
  REMOTAR = "Remotar",
  TRAMPOS = "Trampos.co",
  HIPSTERS = "Hipsters.jobs",
  COODESH = "Coodesh",
  INDEED = "Indeed Brasil",

  // GitHub (comunidade)
  GITHUB_VAGAS = "GitHub frontendbr/vagas",
}

// Configuração de cada fonte
export interface SourceConfig {
  name: JobSource;
  type: SourceType;
  baseUrl: string;
  enabled: boolean;
  rateLimitMinutes: number;
  cacheKey: string;
  description: string;
  tags: string[];
}

// Configuração completa de todas as fontes
export const SOURCE_CONFIGS: Record<JobSource, SourceConfig> = {
  [JobSource.REMOTIVE]: {
    name: JobSource.REMOTIVE,
    type: SourceType.API,
    baseUrl: "https://remotive.com/api/remote-jobs",
    enabled: true,
    rateLimitMinutes: 20,
    cacheKey: "remotive-jobs",
    description: "Plataforma internacional de vagas remotas",
    tags: ["remoto", "internacional", "api"],
  },

  [JobSource.ARBEITNOW]: {
    name: JobSource.ARBEITNOW,
    type: SourceType.API,
    baseUrl: "https://www.arbeitnow.com/api/jobs",
    enabled: true,
    rateLimitMinutes: 20,
    cacheKey: "arbeitnow-jobs",
    description: "Plataforma europeia de vagas remotas",
    tags: ["remoto", "europa", "api"],
  },

  [JobSource.GREENHOUSE]: {
    name: JobSource.GREENHOUSE,
    type: SourceType.API,
    baseUrl: "https://boards-api.greenhouse.io/v1/boards",
    enabled: true,
    rateLimitMinutes: 20,
    cacheKey: "greenhouse-jobs",
    description: "ATS usado por grandes empresas",
    tags: ["empresas", "api", "ats"],
  },

  [JobSource.LEVER]: {
    name: JobSource.LEVER,
    type: SourceType.API,
    baseUrl: "https://api.lever.co/v0/postings",
    enabled: true,
    rateLimitMinutes: 20,
    cacheKey: "lever-jobs",
    description: "ATS popular entre startups",
    tags: ["startups", "api", "ats"],
  },

  [JobSource.WORKABLE]: {
    name: JobSource.WORKABLE,
    type: SourceType.API,
    baseUrl: "https://www.workable.com/spi/v3/accounts",
    enabled: true,
    rateLimitMinutes: 20,
    cacheKey: "workable-jobs",
    description: "Plataforma de recrutamento",
    tags: ["recrutamento", "api"],
  },

  [JobSource.GUPY]: {
    name: JobSource.GUPY,
    type: SourceType.API,
    baseUrl: "https://portal.gupy.io/api/postings",
    enabled: true,
    rateLimitMinutes: 20,
    cacheKey: "gupy-jobs",
    description: "ATS usado por grandes empresas brasileiras",
    tags: ["brasil", "empresas", "api", "ats"],
  },

  [JobSource.VAGAS_COM]: {
    name: JobSource.VAGAS_COM,
    type: SourceType.SCRAPER,
    baseUrl: "https://www.vagas.com.br",
    enabled: true,
    rateLimitMinutes: 20,
    cacheKey: "vagascom-jobs",
    description: "Uma das principais plataformas de vagas do Brasil",
    tags: ["brasil", "scraper", "vagas"],
  },

  [JobSource.INFOJOBS]: {
    name: JobSource.INFOJOBS,
    type: SourceType.SCRAPER,
    baseUrl: "https://www.infojobs.com.br",
    enabled: true,
    rateLimitMinutes: 20,
    cacheKey: "infojobs-jobs",
    description: "Plataforma tradicional de vagas brasileira",
    tags: ["brasil", "scraper", "vagas"],
  },

  [JobSource.CATHO]: {
    name: JobSource.CATHO,
    type: SourceType.SCRAPER,
    baseUrl: "https://www.catho.com.br",
    enabled: true,
    rateLimitMinutes: 20,
    cacheKey: "catho-jobs",
    description: "Plataforma de vagas brasileira",
    tags: ["brasil", "scraper", "vagas"],
  },

  [JobSource.REMOTAR]: {
    name: JobSource.REMOTAR,
    type: SourceType.SCRAPER,
    baseUrl: "https://remotar.com.br",
    enabled: true,
    rateLimitMinutes: 20,
    cacheKey: "remotar-jobs",
    description: "Especializada em vagas 100% remotas",
    tags: ["brasil", "remoto", "scraper"],
  },

  [JobSource.TRAMPOS]: {
    name: JobSource.TRAMPOS,
    type: SourceType.SCRAPER,
    baseUrl: "https://trampos.co",
    enabled: true,
    rateLimitMinutes: 20,
    cacheKey: "trampos-jobs",
    description: "Plataforma veterana em tech",
    tags: ["brasil", "tech", "scraper"],
  },

  [JobSource.HIPSTERS]: {
    name: JobSource.HIPSTERS,
    type: SourceType.SCRAPER,
    baseUrl: "https://hipsters.jobs",
    enabled: true,
    rateLimitMinutes: 20,
    cacheKey: "hipsters-jobs",
    description: "Mantido pela comunidade Alura",
    tags: ["brasil", "comunidade", "scraper"],
  },

  [JobSource.COODESH]: {
    name: JobSource.COODESH,
    type: SourceType.SCRAPER,
    baseUrl: "https://coodesh.com",
    enabled: true,
    rateLimitMinutes: 20,
    cacheKey: "coodesh-jobs",
    description: "Plataforma com testes automáticos",
    tags: ["brasil", "testes", "scraper"],
  },

  [JobSource.INDEED]: {
    name: JobSource.INDEED,
    type: SourceType.SCRAPER,
    baseUrl: "https://br.indeed.com",
    enabled: true,
    rateLimitMinutes: 20,
    cacheKey: "indeed-jobs",
    description: "Agregador generalista",
    tags: ["brasil", "agregador", "scraper"],
  },

  [JobSource.GITHUB_VAGAS]: {
    name: JobSource.GITHUB_VAGAS,
    type: SourceType.GITHUB,
    baseUrl: "https://api.github.com/repos/frontendbr/vagas/issues",
    enabled: true,
    rateLimitMinutes: 20,
    cacheKey: "github-vagas-jobs",
    description: "Repositório da comunidade Front-End BR",
    tags: ["brasil", "comunidade", "github"],
  },
};

// Funções utilitárias
export const getEnabledSources = (): JobSource[] => {
  return Object.values(JobSource).filter(
    (source) => SOURCE_CONFIGS[source].enabled,
  );
};

export const getSourcesByType = (type: SourceType): JobSource[] => {
  return Object.values(JobSource).filter(
    (source) =>
      SOURCE_CONFIGS[source].enabled && SOURCE_CONFIGS[source].type === type,
  );
};

export const getSourcesByTag = (tag: string): JobSource[] => {
  return Object.values(JobSource).filter(
    (source) =>
      SOURCE_CONFIGS[source].enabled &&
      SOURCE_CONFIGS[source].tags.includes(tag),
  );
};

export const getSourceConfig = (source: JobSource): SourceConfig => {
  return SOURCE_CONFIGS[source];
};

export const getAllSourceConfigs = (): SourceConfig[] => {
  return Object.values(SOURCE_CONFIGS).filter((config) => config.enabled);
};
