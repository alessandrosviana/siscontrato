# Feature 11 — Honorários e Prazos

## Contexto

Etapas 9 e 10 do fluxo. O usuário define os prazos de execução e os honorários
profissionais, incluindo forma de pagamento e parcelamento.

Há dependências condicionais: a seleção de pagamento parcelado habilita campos
adicionais de número de parcelas e valor por parcela.

## Objetivo desta feature

Implementar a tela de honorários e prazos (Tela 7 — Anexo IV) com lógica
condicional de campos financeiros conforme a forma de pagamento escolhida.

## Requisitos

### Campos (Tela 7 — Anexo IV e Anexo III)

| Campo | Tipo | Obrigatório |
|---|---|---|
| `prazo_total` | texto / número (dias ou meses) | sim |
| `valor_total` | valor monetário (R$) | sim |
| `forma_pagamento` | select | sim |
| `parcelas` | número inteiro | condicional |
| `valor_parcela` | valor monetário (R$) | condicional |
| `indice_reajuste` | select / texto | não |

### Opções de forma de pagamento (Anexo III)

- Pagamento à vista
- Pagamento parcelado

### Campos condicionais (Anexo III — dependência forma_pagamento)

**Quando `forma_pagamento = parcelado`:**
- `parcelas` — número de parcelas (obrigatório)
- `valor_parcela` — valor de cada parcela (obrigatório)
- O sistema pode calcular automaticamente `valor_parcela = valor_total / parcelas`

### Regras de negócio

- `valor_total` (honorários) é obrigatório para geração do contrato (Regra 2 — Anexo V)
- Ao mudar a forma de pagamento, os campos condicionais devem ser resetados
- Se serviços adicionais foram selecionados na etapa anterior, exibir aviso
  solicitando revisão dos valores

## Referência no documento

Seção 8 — Fluxo (etapas 9 e 10)
Anexo III — Campos financeiros e regras de dependência forma_pagamento
Anexo IV — Tela 7
Anexo V — Regra 2
