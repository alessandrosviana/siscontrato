# Tarefa 5.0: Finalização — Conectar LandingPage na rota /, remover home.tsx

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 2.0 (ResultPage criada — garante que DownloadPdfButton não se perde)
- 3.0 (LandingPage criada — pré-requisito para substituir a rota /)
- 4.0 (DisclaimerPage criada — fluxo completo precisa estar funcional)

## Estimativa

- **Tamanho**: P
- **Horas estimadas**: < 2h

## Visão Geral

Substituir a referência a `HomePage` pela nova `LandingPage` na rota `/` do `App.tsx`, e remover os arquivos `home.tsx` e `home.test.tsx` que foram completamente substituídos pelas novas páginas. Ao final desta task, o fluxo completo `/` → `/aviso` → `/formulario` estará funcional e a suite de testes passará integralmente.

<skills>
### Conformidade com Skills Padrões

- **Frontend**: React 19 + Vite + TypeScript
- **Roteamento**: React Router 7
- **Testes**: Vitest + Testing Library
- **Package mgr**: bun
</skills>

<requirements>
- RF-01 (PRD): A rota `/` deve exibir `LandingPage` — não mais `HomePage`
- `home.tsx` e `home.test.tsx` devem ser removidos do projeto
- Nenhum import de `HomePage` deve permanecer no código
- Todos os testes existentes devem passar após a remoção
- `bun run build` deve concluir sem erros de TypeScript
</requirements>

## Subtarefas

- [ ] 5.1 Atualizar `App.tsx`: trocar `HomePage` por `LandingPage` na rota `/`
- [ ] 5.2 Remover o import de `HomePage` de `App.tsx`
- [ ] 5.3 Remover o arquivo `frontend/src/pages/home.tsx`
- [ ] 5.4 Remover o arquivo `frontend/src/pages/home.test.tsx`
- [ ] 5.5 Verificar que nenhum outro arquivo importa `home.tsx` ou `HomePage`
- [ ] 5.6 Executar `bun test` e `bun run build` — todos os testes devem passar

## Detalhes de Implementação

Consulte a seção **"Sequenciamento de Desenvolvimento — Ordem de Construção"** da `techspec.md` (item 6).

Antes de remover `home.tsx`, confirme que:
- `buildPayload` foi migrado para `result-page.tsx` (Task 2.0)
- `DownloadPdfButton` foi migrado para `result-page.tsx` (Task 2.0)
- `LandingPage` cobre todos os requisitos RF-01, RF-02 e RF-03 (Task 3.0)

## Critérios de Sucesso

- `bun test` passa sem nenhum erro (suite completa)
- `bun run build` conclui sem erros de TypeScript
- Acessar `/` no browser exibe `LandingPage` (título "Gerador de Contratos para Arquitetos")
- Nenhuma referência a `home.tsx`, `HomePage` ou `home.test.tsx` existe no código
- Fluxo completo funcional: `/` → `/aviso` → `/formulario`

## Testes da Tarefa

- [ ] Testes de unidade: não há testes novos — validar que os existentes passam
- [ ] Executar `bun test` e confirmar 100% de sucesso
- [ ] Testes de integração: não aplicável
- [ ] Testes E2E: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/App.tsx` — modificar (trocar `HomePage` por `LandingPage`)
- `frontend/src/pages/home.tsx` — remover
- `frontend/src/pages/home.test.tsx` — remover
