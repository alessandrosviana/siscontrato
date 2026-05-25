# Tarefa 1.0: FeesFormPage — Tela de Honorários e Prazos

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- Nenhuma

## Estimativa

- **Tamanho**: G
- **Horas estimadas**: 4-8h

## Visão Geral

Criar a tela `/honorarios` que coleta prazo de execução, honorários profissionais e forma de pagamento. Campos de parcelamento são exibidos condicionalmente quando `forma_pagamento === 'parcelado'`. Um aviso é exibido quando serviços adicionais foram selecionados na etapa anterior. A tela usa `react-number-format` para máscara monetária — nova dependência que deve ser instalada nesta task.

<skills>
### Conformidade com Skills Padrões

- React + Vite + TypeScript: componente funcional com props tipadas
- Vitest + Testing Library: testes unitários com mocks de `useNavigate` e `useFormStore`
- CSS Modules: estilos em arquivo `.module.css` próprio
- bun: usar `bun add react-number-format` para instalar a dependência
</skills>

<requirements>
- `isFormValid` implementada como função pura fora do componente (mesmo padrão de `ScopeFormPage`)
- `NumericFormat` do `react-number-format` para os campos `valor_total` e `valor_parcela` com `prefix="R$ "`, `thousandSeparator="."`, `decimalSeparator=","`, `decimalScale={2}`, `fixedDecimalScale`
- Estado interno usa `FeesFields` com `prazo_quantidade` e `prazo_unidade` separados; no submit combinar em `prazo_total: prazo_quantidade + ' ' + prazo_unidade`
- Ao alterar `forma_pagamento` para `'a_vista'`, resetar `parcelas` e `valor_parcela` para string vazia
- Aviso inline com `role="alert"` quando `steps['additional-services'].selected_services` tem itens
- Pré-preenchimento de `steps['fees']` na revisita: `prazo_total` → split em quantidade + unidade
- Botão "Continuar" desabilitado enquanto `isFormValid` retornar `false`
- Campos `parcelas` e `valor_parcela` incluídos no `updateStep` apenas quando `forma_pagamento === 'parcelado'`
- `indice_reajuste` incluído no `updateStep` apenas quando não vazio
- `<label htmlFor>` em todos os campos; `<h1>` único na página; `focus-visible` com outline nos inputs
- Adicionar `parcelas?: string`, `valor_parcela?: string`, `indice_reajuste?: string` ao `ContratoPayload` em `contrato.ts`
</requirements>

## Subtarefas

- [ ] 1.1 Instalar `react-number-format`: `bun add react-number-format` na pasta `frontend/`
- [ ] 1.2 Atualizar `frontend/src/types/contrato.ts`: adicionar `parcelas?`, `valor_parcela?`, `indice_reajuste?` como `string` opcionais ao `ContratoPayload`
- [ ] 1.3 Criar `frontend/src/pages/fees-form-page.tsx` com interface `FeesFields`, função pura `isFormValid`, componente `FeesFormPage`
- [ ] 1.4 Criar `frontend/src/pages/fees-form-page.module.css` seguindo o padrão visual das demais páginas (mesma estrutura que `scope-form-page.module.css`)
- [ ] 1.5 Criar `frontend/src/pages/fees-form-page.test.tsx` com todos os cenários listados em "Testes da Tarefa"
- [ ] 1.6 Executar `bun run test` e garantir 100% de aprovação

## Detalhes de Implementação

Consultar `techspec.md` desta pasta — seções:
- **Interfaces Principais**: definição de `FeesFields` e assinatura de `isFormValid`
- **Dependência Nova — react-number-format**: configuração do `NumericFormat`
- **Lógica de `isFormValid`**: validação de cada campo, incluindo regra de `parcelas >= 2`
- **Lógica de Submit e Reset**: combinação do prazo, inclusão condicional de campos
- **Pré-preenchimento (Revisita)**: split de `prazo_total` em quantidade e unidade

## Critérios de Sucesso

- `fees-form-page.tsx` exporta `FeesFormPage` e a função pura `isFormValid`
- `contrato.ts` contém `parcelas?`, `valor_parcela?`, `indice_reajuste?`
- `react-number-format` listado nas `dependencies` do `package.json`
- Todos os testes desta task passando
- `bun run build` sem erros TypeScript
- `bun run lint` sem erros

## Testes da Tarefa

- [ ] Renderiza título, campos de prazo, valor total, forma de pagamento e botões Voltar/Continuar
- [ ] Continuar desabilitado quando campos obrigatórios estão vazios
- [ ] Selecionar `parcelado` exibe campos `parcelas` e `valor_parcela`
- [ ] Selecionar `a_vista` após `parcelado` oculta e reseta campos condicionais
- [ ] `parcelas` com valor 1 mantém Continuar desabilitado (mínimo 2)
- [ ] Formulário totalmente válido (à vista) habilita Continuar
- [ ] Formulário totalmente válido (parcelado) habilita Continuar
- [ ] Submit à vista: `updateStep('fees', ...)` não inclui `parcelas` nem `valor_parcela`
- [ ] Submit parcelado: `updateStep('fees', ...)` inclui `parcelas` e `valor_parcela`
- [ ] Submit: `navigate('/resultado')` chamado
- [ ] Voltar: `navigate('/servicos-adicionais')` chamado
- [ ] Revisita: campos pré-preenchidos a partir de `steps['fees']`
- [ ] Aviso visível quando `steps['additional-services'].selected_services` tem itens
- [ ] Aviso ausente quando `steps['additional-services']` não tem seleções

## Arquivos relevantes

- `frontend/src/pages/fees-form-page.tsx` (criar)
- `frontend/src/pages/fees-form-page.module.css` (criar)
- `frontend/src/pages/fees-form-page.test.tsx` (criar)
- `frontend/src/types/contrato.ts` (modificar)
- `frontend/package.json` (modificar — nova dependência)
- `frontend/src/pages/scope-form-page.tsx` (referência de padrão)
- `frontend/src/pages/additional-services-page.tsx` (referência do padrão de aviso com `role="alert"`)
