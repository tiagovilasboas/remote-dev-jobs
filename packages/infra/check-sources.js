const { JobSource } = require('./sources/JobSources.ts');

// Fontes que têm implementação no factory
const IMPLEMENTED_SOURCES = [
  'Remotive',
  'Arbeitnow', 
  'Greenhouse',
  'Lever',
  'Workable',
  'Gupy',
  'Vagas.com',
  'InfoJobs',
  'Catho',
  'Remotar',
  'Trampos.co',
  'Hipsters.jobs',
  'Coodesh',
  'Indeed Brasil',
  'GitHub frontendbr/vagas'
];

// Fontes habilitadas (enabled: true) - baseado no arquivo JobSources.ts
const ENABLED_SOURCES = [
  'Remotive',
  'Arbeitnow',
  'Greenhouse', 
  'Lever',
  'Workable',
  'JSearch',
  'Gupy',
  'Trampos.co',
  'Hipsters.jobs',
  'GitHub frontendbr/vagas'
];

// Todas as fontes definidas
const ALL_SOURCES = [
  'Remotive',
  'Arbeitnow',
  'Greenhouse',
  'Lever',
  'Workable',
  'JSearch',
  'Gupy',
  'Vagas.com',
  'InfoJobs',
  'Catho',
  'Remotar',
  'Trampos.co',
  'Hipsters.jobs',
  'Coodesh',
  'Indeed Brasil',
  'GitHub frontendbr/vagas'
];

console.log('=== Fontes habilitadas ===');
console.log(ENABLED_SOURCES);

console.log('\n=== Fontes com implementação ===');
console.log(IMPLEMENTED_SOURCES);

console.log('\n=== Fontes habilitadas sem implementação ===');
const missing = ENABLED_SOURCES.filter(source => !IMPLEMENTED_SOURCES.includes(source));
console.log(missing);

console.log('\n=== Fontes desabilitadas ===');
const disabled = ALL_SOURCES.filter(source => !ENABLED_SOURCES.includes(source));
console.log(disabled);

console.log('\n=== Resumo ===');
console.log(`Total de fontes: ${ALL_SOURCES.length}`);
console.log(`Habilitadas: ${ENABLED_SOURCES.length}`);
console.log(`Desabilitadas: ${disabled.length}`);
console.log(`Com implementação: ${IMPLEMENTED_SOURCES.length}`);
console.log(`Sem implementação: ${missing.length}`); 