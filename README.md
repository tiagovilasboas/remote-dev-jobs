# Remote Dev Jobs – Monorepo (Turbo + pnpm)
+[![PWA Ready](https://img.shields.io/badge/PWA-ready-brightgreen)](https://web.dev/measure/) [![i18n Ready](https://img.shields.io/badge/i18n-ready-blue)]() [![Unlighthouse ≥95](https://img.shields.io/badge/Unlighthouse-%E2%89%A595-success)]()

## Estrutura

1. **root** – pnpm workspace configurado (Turbo, Husky, Commitlint, ESLint/Prettier, Changesets)
2. **apps/web** – Next.js 14 (App Router) + TypeScript + Tailwind
3. **packages/core** – Domínio puro (entidades, value-objects, repositórios)
4. **packages/application** – Casos de uso orquestrando o domínio
5. **packages/infra** – Implementações externas (Remotive API, Supabase, etc.)
6. **packages/ui** – Biblioteca de componentes React compartilhados
7. **packages/config** – Presets ESLint + Prettier + boundaries rules

## Clean Code & Arquitetura

🔹 Funções com **máx. 20 linhas** e **apenas 1 nível** de abstração interna.
🔹 Métodos de ação seguem padrão **verboSubstantivo** (`toggleFavorite`, `getJobs`).
🔹 Evite `utils` genéricos – prefira nomes de domínio (ex.: `DateRange`).
🔹 **Core depende só de interfaces**; implementações concretas ficam em *infra*.
🔹 Camadas (via `eslint-plugin-boundaries`):
   • core → nenhum
   • application → core
   • infra → core
   • web → application
🔹 Alias de importação:
   • `@/*` → `apps/web/src/*`
   • `@tiago/<pkg>` → `packages/<pkg>/`
🔹 Segurança: middleware `@next-safe/middleware` com CSP básico.
🔹 Lint extra: `eslint-plugin-unused-imports`, `prettier-plugin-tailwindcss`.
🔹 Pirâmide de testes:
   • **unit** – core & application (Vitest + contratos)
   • **integration** – infra (mock externo mínimo)
   • **e2e** – web (Cypress/Playwright)

> Siga estas práticas em novas features e PRs.

## Fluxo de Camadas

```mermaid
flowchart TD;
  UI["UI Components (Next.js / Tailwind)"] --> Hooks["Hooks & Actions"];
  Hooks --> Store["Zustand Store"];
  Store --> Services["Application Services (Use Cases)"];
  Services --> Domain["Domain (Entities / Value Objects)"];
  Services --> Repos["Infra Repositories"];
  Repos --> APIs["External APIs (Remotive / Supabase)"];
``` 

## Architecture & SRP Review (May 2025)

We periodically audit the codebase to ensure it still honours the principles documented above.

### ✅ What's working well
1. **Single-Responsibility Principle (SRP)**  
   • `packages/core` mantém somente entidade/VO e contratos.  
   • `packages/application` apenas orquestra casos de uso.  
   • `packages/infra` contém detalhes de integração externos.  
   • `apps/web` concentra UI + BFF embutido (Route Handlers).  
   Cada diretório tem um motivo único para mudar.
2. **Camadas protegidas**  
   `eslint-plugin-boundaries` impede dependências ilegais (ex.: infra → web).  
   Alias de paths claros (`@tiago/*`, `@/*`).
3. **Clean-Code rules**  
   – Funções curtas (<20 linhas) e claras.  
   – Convenção `verboSubstantivo` nos métodos (`toggleFavorite`, `listAll`).  
   – Sem *utils* genéricos; `lib/` está restrito ao domínio de UI.
4. **Test Pyramid**  
   – Contrato de repositório no core.  
   – Unit tests no core/application.  
   – Infra possui integração mock (Remotive).  
   – Web focará em E2E.

### 🚧 Oportunidades de melhoria
1. **Coverage** – adicionar métricas de cobertura no CI para core/application.
2. **Naming** – padronizar textos i18n já no início para evitar literais.
3. **Error handling** – centralizar mappers de erro em infra para não vazar detalhes externos.
4. **Domain events** – avaliar necessidade quando favoritos persistirem em Supabase.

> Próxima revisão arquitetural planejada após introdução de autenticação real e favoritos em Supabase. 