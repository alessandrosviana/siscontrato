# Tarefa 2.0: ResultPage — Migrar DownloadPdfButton para rota /resultado

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 1.0 (a rota `/resultado` precisa existir em App.tsx)

## Estimativa

- **Tamanho**: P
- **Horas estimadas**: < 2h

## Visão Geral

Criar o componente `ResultPage` em `pages/result-page.tsx`, migrando o conteúdo atual de `home.tsx` (o `DownloadPdfButton` e a função `buildPayload`). Em seguida, atualizar `App.tsx` para usar `ResultPage` na rota `/resultado` (substituindo o placeholder). O `home.tsx` ainda não é removido nesta task — isso acontece na Tarefa 5.0.

<skills>
### Conformidade com Skills Padrões

- **Frontend**: React 19 + Vite + TypeScript
- **Estado**: Zustand 5 (`useFormStore`)
- **Testes**: Vitest + Testing Library
- **Package mgr**: bun
</skills>

<requirements>
- `ResultPage` deve renderizar `DownloadPdfButton` com o payload derivado do `useFormStore`
- A função `buildPayload` deve ser migrada de `home.tsx` para `result-page.tsx` (ou para um módulo compartilhado)
- `App.tsx` deve referenciar `ResultPage` na rota `/resultado`
- `home.tsx` permanece inalterado nesta task
</requirements>

## Subtarefas

- [ ] 2.1 Criar `frontend/src/pages/result-page.tsx` com `ResultPage`
- [ ] 2.2 Mover a função `buildPayload` e o import de `useFormStore` para `result-page.tsx`
- [ ] 2.3 Renderizar `DownloadPdfButton` passando o payload derivado do store
- [ ] 2.4 Atualizar `App.tsx`: substituir placeholder de `/resultado` por `<ResultPage />`
- [ ] 2.5 Criar `frontend/src/pages/result-page.test.tsx` com teste de renderização
- [ ] 2.6 Executar `bun test` e `bun run build`

## Detalhes de Implementação

Consulte a seção **"Pontos de Integração"** e **"Arquivos relevantes e dependentes"** da `techspec.md`.

A lógica de `buildPayload` em `home.tsx` converte o objeto `steps` do `useFormStore` em um `ContratoPayload`. Essa função deve ser copiada integralmente para `result-page.tsx`.

## Critérios de Sucesso

- `ResultPage` renderiza `DownloadPdfButton` sem erros
- `bun test` passa (incluindo o novo `result-page.test.tsx`)
- `bun run build` conclui sem erros de TypeScript
- Acessar `/resultado` no browser exibe o botão de download

## Testes da Tarefa

- [ ] Testes de unidade (`result-page.test.tsx`):
  - Renderiza o `DownloadPdfButton` (pode mockar o componente)
- [ ] Testes de integração: não aplicável
- [ ] Testes E2E: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/pages/result-page.tsx` — criar
- `frontend/src/pages/result-page.test.tsx` — criar
- `frontend/src/pages/home.tsx` — ler (fonte da lógica a migrar, não modificar)
- `frontend/src/App.tsx` — modificar (substituir placeholder de `/resultado`)
- `frontend/src/types/contrato.ts` — usar tipo `ContratoPayload`
- `frontend/src/store/form-store.ts` — usar `useFormStore`
- `frontend/src/components/download-pdf-button.tsx` — usar componente
