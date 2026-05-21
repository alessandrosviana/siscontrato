# PRD — Honorários e Prazos (Feature 012)

## Visão Geral

Etapas 9 e 10 do fluxo de geração de contrato de arquitetura. Após definir o escopo dos serviços e eventuais serviços adicionais, o arquiteto informa o prazo de execução e os honorários profissionais — incluindo forma de pagamento e parcelamento quando aplicável. Esses dados são obrigatórios para a geração do contrato e compõem diretamente as cláusulas financeiras do documento.

## Objetivos

- Coletar prazo de execução (`prazo_total`) e dados financeiros (`valor_total`, `forma_pagamento`, `parcelas`, `valor_parcela`, `indice_reajuste`) necessários para as cláusulas do contrato
- Garantir que o arquiteto seja alertado para revisar os valores quando serviços adicionais foram selecionados na etapa anterior
- Habilitar o botão "Continuar" somente quando todos os campos obrigatórios estiverem preenchidos corretamente
- Inserir a tela `/honorarios` no fluxo entre `/servicos-adicionais` e `/resultado`

## Histórias de Usuário

- Como arquiteto, quero informar o prazo total do contrato em número e unidade (dias ou meses) para que o contrato reflita o acordado com o cliente
- Como arquiteto que vai receber à vista, quero informar apenas o valor total sem precisar preencher campos de parcelas
- Como arquiteto que vai receber parcelado, quero informar o número de parcelas e o valor de cada uma para que o contrato descreva a forma de pagamento correta
- Como arquiteto que incluiu serviços adicionais, quero ser lembrado de revisar os valores antes de confirmar para não gerar um contrato com honorários desatualizados
- Como usuário que voltou a esta tela, quero encontrar os dados já preenchidos anteriormente para não precisar redigitar tudo

## Funcionalidades Principais

### RF-01 — Prazo Total

Campo obrigatório composto por:
- Um campo numérico inteiro (quantidade)
- Um select com as opções: "dias" e "meses"

Ambos os sub-campos são obrigatórios. O valor armazenado combina quantidade e unidade (ex: "12 meses").

### RF-02 — Valor Total dos Honorários

Campo monetário obrigatório (`valor_total`) com máscara de moeda em tempo real (formato R$ X.XXX,XX). Representa o valor bruto total acordado pelos serviços, independente da forma de pagamento.

### RF-03 — Forma de Pagamento

Select obrigatório (`forma_pagamento`) com as opções:
- "À vista"
- "Parcelado"

Ao alterar a seleção para "À vista", os campos condicionais de parcelamento são resetados.

### RF-04 — Campos Condicionais de Parcelamento

Exibidos somente quando `forma_pagamento === 'parcelado'`:
- `parcelas`: campo numérico inteiro obrigatório (número de parcelas, mínimo 2)
- `valor_parcela`: campo monetário obrigatório com máscara de moeda (valor de cada parcela)

Ambos os campos são preenchidos manualmente pelo arquiteto. Quando `forma_pagamento` muda para "À vista", os campos são ocultados e seus valores são resetados.

### RF-05 — Índice de Reajuste

Select opcional (`indice_reajuste`) com as opções:
- IPCA
- IGP-M
- INCC
- Sem reajuste

Pode ficar sem seleção. Não bloqueia o botão "Continuar".

### RF-06 — Aviso de Revisão de Serviços Adicionais

Quando `steps['additional-services']` contiver ao menos um serviço selecionado, exibir uma mensagem informativa inline no topo do formulário:

> "Você selecionou serviços adicionais. Revise os prazos e honorários para garantir que os valores reflitam os serviços incluídos."

A mensagem é estática (aparece enquanto houver serviços adicionais no store) e não impede o avanço.

### RF-07 — Validação e Botão "Continuar"

O botão "Continuar" fica desabilitado enquanto:
- `prazo_total` (quantidade ou unidade) estiver vazio
- `valor_total` estiver vazio
- `forma_pagamento` não estiver selecionada
- Quando `forma_pagamento === 'parcelado'`: `parcelas` estiver vazio, for menor que 2 ou não for inteiro; `valor_parcela` estiver vazio

Nenhuma mensagem de erro é exibida — o botão desabilitado é o único indicador de incompletude.

### RF-08 — Persistência no Store

Ao clicar "Continuar" com formulário válido:
```
updateStep('fees', {
  prazo_total,
  valor_total,
  forma_pagamento,
  parcelas,       // incluso apenas quando parcelado
  valor_parcela,  // incluso apenas quando parcelado
  indice_reajuste // incluso se preenchido
})
navigate('/resultado')
```

### RF-09 — Pré-preenchimento (Revisita)

Ao montar a página:
- Se `steps['fees']` existir → popular todos os campos com os valores salvos anteriormente
- Se não existir → inicializar campos em branco

### RF-10 — Navegação

- Botão "Voltar" → `navigate('/servicos-adicionais')` sem apagar dados do store
- Botão "Continuar" (válido) → salva no store e navega para `/resultado`

### RF-11 — Atualização do Fluxo de Navegação

`AdditionalServicesPage` (`/servicos-adicionais`) atualmente navega para `/resultado` ao clicar "Continuar". Esta feature deve atualizar essa navegação para `/honorarios`, inserindo a tela de honorários no fluxo correto.

## Experiência do Usuário

**Persona principal:** arquiteto que já definiu escopo e serviços adicionais; agora formaliza o prazo e os valores financeiros do contrato.

**Fluxo principal:**
1. Usuário chega via `/servicos-adicionais`
2. Se houver serviços adicionais selecionados, vê o aviso de revisão de valores no topo
3. Informa `prazo_total` (quantidade + unidade)
4. Informa `valor_total` com máscara monetária
5. Seleciona `forma_pagamento`
6. Se "Parcelado": informa `parcelas` e `valor_parcela`
7. Opcionalmente seleciona `indice_reajuste`
8. Botão "Continuar" habilita → navega para `/resultado`

**Acessibilidade:**
- Todos os campos com `<label htmlFor>` associado
- `<h1>` único na página
- Indicador visual de foco em todos os campos (`outline` visível — WCAG 2.2)
- Aviso de serviços adicionais com `role="alert"` para leitores de tela
- Select de forma de pagamento com opção inicial vazia ("Selecione...")
- Campos condicionais revelados e ocultados com controle de acessibilidade adequado

**Layout:** seguir o padrão visual das demais páginas (CSS Modules, mesma paleta, botões de ação no rodapé).

## Restrições Técnicas de Alto Nível

- Integra ao `form-store` (Zustand) via `updateStep('fees', {...})` e leitura de `steps['fees']` e `steps['additional-services']`
- Os campos `parcelas`, `valor_parcela` e `indice_reajuste` precisam ser adicionados ao `ContratoPayload` em `contrato.ts` como campos opcionais
- Máscara de moeda automática requer nova dependência de biblioteca — a escolha da biblioteca é decisão da Tech Spec
- `prazo_total` armazenado como string formatada (ex: "12 meses")
- `valor_total` e `valor_parcela` armazenados como strings com o valor digitado
- CSS Modules, sem biblioteca de UI adicional além da máscara monetária
- React 19 + Vite + TypeScript

## Fora de Escopo

- Cálculo automático de `valor_parcela` a partir de `valor_total ÷ parcelas`
- Validação de consistência entre `valor_total` e `valor_parcela × parcelas`
- Opções de parcelamento com parcelas de valores diferentes
- Integração com gateway de pagamento
- Histórico de contratos anteriores para sugestão de valores
- Impostos ou deduções sobre os honorários
