# Tarefa 3.0: Integração — Registrar rota /pacote no App.tsx e atualizar DisclaimerPage

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 2.0 (o componente `PackageSelectionPage` precisa existir antes de ser registrado no router)

## Estimativa

- **Tamanho**: P
- **Horas estimadas**: < 2h

## Visão Geral

Conectar a `PackageSelectionPage` ao fluxo da aplicação: (1) adicionar a rota `/pacote` ao `createBrowserRouter` em `App.tsx`, e (2) atualizar `DisclaimerPage` para navegar para `/pacote` ao clicar "Continuar" (em vez de `/formulario`). Atualizar o teste correspondente em `disclaimer-page.test.tsx`.

<skills>
### Conformidade com Skills Padrões

- **Frontend**: React 19 + Vite + TypeScript
- **Roteamento**: React Router 7
- **Testes**: Vitest + Testing Library
- **Package mgr**: bun
</skills>

<requirements>
- A rota `/pacote` deve existir no `createBrowserRouter` de `App.tsx` apontando para `<PackageSelectionPage />`
- `DisclaimerPage` deve chamar `navigate('/pacote')` ao clicar "Continuar" (não mais `/formulario`)
- O teste de `DisclaimerPage` deve refletir a nova rota de destino
- `bun run test` e `bun run build` devem passar sem erros
</requirements>

## Subtarefas

- [ ] 3.1 Ler `frontend/src/App.tsx` atual
- [ ] 3.2 Importar `PackageSelectionPage` e adicionar rota `/pacote` no `createBrowserRouter`
- [ ] 3.3 Ler `frontend/src/pages/disclaimer-page.tsx` atual
- [ ] 3.4 Alterar `navigate('/formulario')` para `navigate('/pacote')` em `DisclaimerPage`
- [ ] 3.5 Atualizar `frontend/src/pages/disclaimer-page.test.tsx`: trocar o expect de `navigate('/formulario')` por `navigate('/pacote')`
- [ ] 3.6 Executar `bun run test` no diretório `frontend` — todos os testes devem passar
- [ ] 3.7 Executar `bun run build` no diretório `frontend`

## Detalhes de Implementação

Consulte a seção **"Sequenciamento de Desenvolvimento — Ordem de Construção"** (passo 4 e 5) da `techspec.md`.

O `createBrowserRouter` em `App.tsx` deve ter a rota `/pacote` inserida entre `/aviso` e `/formulario`, mantendo a ordem lógica do fluxo:
```
/ → /aviso → /pacote → /formulario
```

## Critérios de Sucesso

- `bun run test` passa com 100% de sucesso (incluindo `disclaimer-page.test.tsx` atualizado)
- `bun run build` conclui sem erros de TypeScript
- Acessar `/pacote` no browser exibe `PackageSelectionPage`
- O fluxo completo `/ → /aviso → /pacote → /formulario` é navegável

## Testes da Tarefa

- [ ] Testes de unidade: nenhum novo — verificar que os existentes passam após as mudanças
- [ ] `disclaimer-page.test.tsx` atualizado: `navigate('/pacote')` em vez de `navigate('/formulario')`
- [ ] Executar `bun run test` e confirmar 100% de sucesso

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/App.tsx` — modificar (adicionar rota /pacote)
- `frontend/src/pages/disclaimer-page.tsx` — modificar (navigate para /pacote)
- `frontend/src/pages/disclaimer-page.test.tsx` — modificar (atualizar assert)
- `frontend/src/pages/package-selection-page.tsx` — ler (componente a importar)
