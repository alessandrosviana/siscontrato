# Tarefa 2.0: Integração no Fluxo de Navegação

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 1.0

## Estimativa

- **Tamanho**: P
- **Horas estimadas**: < 2h

## Visão Geral

Inserir a tela `FeesFormPage` no fluxo da aplicação. Isso exige adicionar a rota `/honorarios` no `App.tsx` e atualizar `AdditionalServicesPage` para navegar para `/honorarios` em vez de `/resultado`. Inclui o teste de regressão confirmando a mudança de navegação.

<skills>
### Conformidade com Skills Padrões

- React + Vite + TypeScript: importação e registro de rota
- Vitest + Testing Library: teste de regressão no componente `AdditionalServicesPage`
- bun: executar `bun run test` para validação
</skills>

<requirements>
- Rota `/honorarios` adicionada ao `createBrowserRouter` em `App.tsx` com `element: <FeesFormPage />`
- `AdditionalServicesPage`: `navigate('/resultado')` atualizado para `navigate('/honorarios')`
- Teste de regressão em `additional-services-page.test.tsx` verificando que o submit navega para `/honorarios`
- Nenhuma outra lógica alterada em `AdditionalServicesPage`
</requirements>

## Subtarefas

- [ ] 2.1 Atualizar `frontend/src/App.tsx`: importar `FeesFormPage` e adicionar rota `{ path: '/honorarios', element: <FeesFormPage /> }`
- [ ] 2.2 Atualizar `frontend/src/pages/additional-services-page.tsx`: alterar `navigate('/resultado')` para `navigate('/honorarios')`
- [ ] 2.3 Atualizar `frontend/src/pages/additional-services-page.test.tsx`: ajustar o teste de navegação do submit para esperar `'/honorarios'`
- [ ] 2.4 Executar `bun run test` e garantir 100% de aprovação

## Detalhes de Implementação

Consultar `techspec.md` desta pasta — seção **Sequenciamento de Desenvolvimento**, itens 4, 5 e 6.

A única mudança funcional é a troca do destino de navegação em `AdditionalServicesPage`. O restante é wiring de rota.

## Critérios de Sucesso

- Navegar para `/servicos-adicionais` e clicar "Continuar" leva para `/honorarios`
- Navegar para `/honorarios` renderiza `FeesFormPage`
- Todos os testes da suite passando (incluindo a regressão de `AdditionalServicesPage`)
- `bun run build` sem erros TypeScript
- `bun run lint` sem erros

## Testes da Tarefa

- [ ] Regressão em `additional-services-page.test.tsx`: submit navega para `'/honorarios'` (não mais `'/resultado'`)

## Arquivos relevantes

- `frontend/src/App.tsx` (modificar — nova rota)
- `frontend/src/pages/additional-services-page.tsx` (modificar — navigate)
- `frontend/src/pages/additional-services-page.test.tsx` (modificar — regressão)
- `frontend/src/pages/fees-form-page.tsx` (referência — componente a ser importado)
