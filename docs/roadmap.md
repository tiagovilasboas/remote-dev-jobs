- **Remote Dev Jobs Hub – Roadmap**

Abaixo está a lista de tarefas pendentes para evoluirmos o projeto. Marque cada item quando concluído.

```mermaid
flowchart TD
    arbeitnow_repo["ArbeitnowRepo"]
    greenhouse_repo["GreenhouseRepo"]
    lever_repo["LeverRepo"]
    aggregate_repo["AggregateJobRepo"]
    update_factory["Atualizar getJobsFactory"]
    filters_usecase["Filtros em GetJobs/API"]
    ui_list["UI – Lista de Vagas"]
    ui_details["UI – Detalhe de Vaga"]
    test_aggregate["Testes Aggregate"]
    test_adapters["Testes Adaptadores"]
    cache_isr["Cache ISR/Rate-limit"]
    docs_update["Atualizar Docs"]

    arbeitnow_repo --> aggregate_repo
    greenhouse_repo --> aggregate_repo
    lever_repo --> aggregate_repo
    aggregate_repo --> update_factory
    update_factory --> filters_usecase
    filters_usecase --> ui_list
    ui_list --> ui_details
    aggregate_repo --> test_aggregate
    arbeitnow_repo --> test_adapters
    greenhouse_repo --> test_adapters
    lever_repo --> test_adapters
    update_factory --> cache_isr
    aggregate_repo --> docs_update
    ui_list --> docs_update
```

### Tarefas

- [ ] **Criar adaptador ArbeitnowRepo** que implementa `JobRepository` consumindo a API pública da Arbeitnow
- [ ] **Criar adaptador GreenhouseRepo** que implementa `JobRepository` consumindo a API pública da Greenhouse
- [ ] **Criar adaptador LeverRepo** que implementa `JobRepository` consumindo a API pública da Lever
- [ ] **Implementar AggregateJobRepo** que recebe múltiplos repositórios (Remotive, Arbeitnow, Greenhouse, Lever) e devolve lista unificada e deduplicada
- [ ] **Atualizar getJobsFactory** para usar `AggregateJobRepo`
- [ ] **Adicionar filtros** (por stack, senioridade, localização) ao caso de uso **GetJobs** e à rota `/api/jobs`
- [ ] **Criar componentes UI** (`JobCard`, `JobList`) e página de listagem consumindo `getJobsAction`
- [ ] **Criar página de detalhes** da vaga com redirecionamento para URL original
- [ ] **Escrever testes unitários** para `AggregateJobRepo` e deduplicação
- [ ] **Escrever testes de integração** para cada adaptador chamando API mockada
- [ ] **Configurar cache ISR e rate-limit** no BFF Next.js
- [ ] **Atualizar documentação** (README e ADRs) com novas integrações e arquitetura
