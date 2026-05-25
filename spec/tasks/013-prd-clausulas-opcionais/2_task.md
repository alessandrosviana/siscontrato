# Tarefa 2.0: Integração no Fluxo de Navegação

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 1.0

## Estimativa

- **Tamanho**: P
- **Horas estimadas**: < 2h

## Visão Geral

Inserir `OptionalClausesPage` no fluxo da aplicação. Adicionar a rota `/clausulas` no `App.tsx` e atualizar `FeesFormPage` para navegar para `/clausulas` em vez de `/resultado`. Inclui teste de regressão confirmando a mudança de navegação.

<skills>
### Conformidade com Skills Padrões

- React + Vite + TypeScript: importação e registro de rota
- Vitest + Testing Library: teste de regressão em `FeesFormPage`
- bun: executar `bun run test` para validação
</skills>

<requirements>
- Rota `/clausulas` adicionada ao `createBrowserRouter` em `App.tsx` com `element: <OptionalClausesPage />`
- `FeesFormPage`: `navigate('/resultado')` atualizado para `navigate('/clausulas')`
- Teste de regressão em `fees-form-page.test.tsx` verificando que o submit navega para `/clausulas`
- Nenhuma outra lógica alterada em `FeesFormPage`
</requirements>

## Subtarefas

- [ ] 2.1 Atualizar `frontend/src/App.tsx`: importar `OptionalClausesPage` e adicionar rota `{ path: '/clausulas', element: <OptionalClausesPage /> }`
- [ ] 2.2 Atualizar `frontend/src/pages/fees-form-page.tsx`: alterar `navigate('/resultado')` para `navigate('/clausulas')`
- [ ] 2.3 Atualizar `frontend/src/pages/fees-form-page.test.tsx`: ajustar o teste de navegação do submit para esperar `'/clausulas'`
- [ ] 2.4 Executar `bun run test` e garantir 100% de aprovação

## Detalhes de Implementação

Consultar `techspec.md` desta pasta — seção **Sequenciamento de Desenvolvimento**, itens 4, 5 e 6.

A única mudança funcional é a troca do destino de navegação em `FeesFormPage`. O restante é wiring de rota.

## Critérios de Sucesso

- Navegar para `/honorarios` e clicar "Continuar" leva para `/clausulas`
- Navegar para `/clausulas` renderiza `OptionalClausesPage`
- Todos os testes da suite passando (incluindo regressão de `FeesFormPage`)
- `bun run build` sem erros TypeScript
- `bun run lint` sem erros

## Testes da Tarefa

- [ ] Regressão em `fees-form-page.test.tsx`: submit com formulário válido navega para `'/clausulas'` (não mais `'/resultado'`)

## Arquivos relevantes

- `frontend/src/App.tsx` (modificar — nova rota)
- `frontend/src/pages/fees-form-page.tsx` (modificar — navigate)
- `frontend/src/pages/fees-form-page.test.tsx` (modificar — regressão)
- `frontend/src/pages/optional-clauses-page.tsx` (referência — componente a ser importado)
