# Remote Dev Jobs – Monorepo (Turbo + pnpm)

> **Atenção**: o boilerplate genérico e independente de domínio está na **`boilerplate`** branch. A branch `main` que você está lendo agora contém uma implementação de exemplo para o domínio Remote-Dev-Jobs.

+[![PWA Ready](https://img.shields.io/badge/PWA-ready-brightgreen)](https://web.dev/measure/) [![i18n Ready](https://img.shields.io/badge/i18n-ready-blue)]() [![Unlighthouse ≥95](https://img.shields.io/badge/Unlighthouse-%E2%89%A595-success)]()
+[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)](https://nextjs.org) [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org) [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com) [![TurboRepo](https://img.shields.io/badge/TurboRepo-build-black?logo=vercel) ](https://turbo.build/repo) [![pnpm](https://img.shields.io/badge/pnpm-workspaces-F69220?logo=pnpm)](https://pnpm.io) [![Jest](https://img.shields.io/badge/Jest-testing-C21325?logo=jest)](https://jestjs.io)

## Propósito

Este repositório mostra, na prática, como construir uma plataforma de **vagas remotas** com tecnologia de ponta, mantendo **qualidade**, **performance** e **escala**:

* Arquitetura **DDD** enxuta — camadas **Core → Application → Infra → Web** isoladas por regras ESLint.
* Pipeline de qualidade automatizado: **Jest** (unit/integration), Turbo cache, Husky + lint-staged.
* UI moderna com **Next.js 14 (App Router)**, **TailwindCSS** e componentes reutilizáveis do pacote `ui`.
* Segurança e performance de produção (CSP via `@next-safe/middleware`, PWA scores ≥95 no Unlighthouse).

Use-o como ponto de partida em novos projetos ou como vitrine do que já dominamos 🚀

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
   • `@remote-dev-jobs/<pkg>` ou `@tiago/<pkg>` → `packages/<pkg>/` (aliases duplicados para transição)
🔹 Segurança: middleware `@next-safe/middleware` com CSP básico.
🔹 Lint extra: `eslint-plugin-unused-imports`, `prettier-plugin-tailwindcss`.
🔹 Pirâmide de testes:
   • **unit** – core & application (Jest + contratos)
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

## Revisão de Arquitetura e SRP (Maio 2025)

Nós auditamos periodicamente o repositório para garantir que ele continue honrando os princípios documentados acima.

### ✅ O que está funcionando bem
1. **Single-Responsibility Principle (SRP)**  
   • `packages/core` mantém somente entidade/VO e contratos.  
   • `packages/application` apenas orquestra casos de uso.  
   • `packages/infra` contém detalhes de integração externos.  
   • `apps/web` concentra UI + BFF embutido (Route Handlers).  
   Cada diretório tem um motivo único para mudar.
2. **Camadas protegidas**  
   `eslint-plugin-boundaries` impede dependências ilegais (ex.: infra → web).  
   Alias de paths claros (`@remote-dev-jobs/*`, `@tiago/*`).
3. **Clean-Code rules**  
   – Funções curtas (<20 linhas) e claras.  
   – Convenção `verboSubstantivo` nos métodos (`toggleFavorite`, `listAll`).  
   – Sem *utils* genéricos; `lib/` está restrito ao domínio de UI.
4. **Pirâmide de Teste**  
   – Contrato de repositório no core.  
   – Testes unitários no core/application.  
   – Infra possui integração mock (Remotive).  
   – Web focará em E2E.

### 🚧 Oportunidades de melhoria
1. **Coverage** – adicionar métricas de cobertura no CI para core/application.
2. **Naming** – padronizar textos i18n já no início para evitar literais.
3. **Error handling** – centralizar mappers de erro em infra para não vazar detalhes externos.
4. **Domain events** – avaliar necessidade quando favoritos persistirem em Supabase.

> Próxima revisão arquitetural planejada após introdução de autenticação real e favoritos em Supabase. 

## Por que este repositório é um Boilerplate completo?

Este projeto serve como ponto de partida para qualquer aplicação full-stack Next.js + TypeScript porque já entrega:

| Pilar | O que já vem pronto | Benefício |
|-------|--------------------|-----------|
| Produtividade | Next 14 (App Router), Tailwind, Plop generators | Comece a codar em minutos |
| Arquitetura | Camadas Core → Application → Infra → Web; regras `boundaries` | Escala e testes sem dívidas |
| Qualidade | ESLint (+jsx-a11y, formatjs, unused-imports), Prettier, Tailwind sorting | Código limpo por padrão |
| Testes | Jest unit + contract; Infra integração; E2E (slot) | Pirâmide de testes pronta |
| CI & Performance | Turbo cache, Unlighthouse ≥95, Husky + lint-staged | Feedback rápido e confiável |
| Segurança | `@next-safe/middleware` (CSP), dependabot ready | Boas práticas desde o início |
| Versionamento | Changesets para publicar pacotes (ex.: `ui`) | Reuso dentro ou fora do mono |

> Basta focar na lógica de negócio e UI; infraestrutura e boas práticas já estão pavimentadas. 