# Feature 10 — Escopo dos Serviços e Serviços Adicionais

## Contexto

Etapas 7 e 8 do fluxo. O usuário descreve o escopo dos serviços contratados e
seleciona eventuais serviços adicionais (gestão de obra, acompanhamento de obra,
fiscalização de obra).

O escopo pode ser pré-preenchido pelo pacote selecionado e deve ser livremente editável.

## Objetivo desta feature

Implementar as telas de escopo dos serviços (Tela 6 — Anexo IV) e serviços
adicionais, com lógica condicional de campos dependentes.

## Requisitos

### Tela de escopo dos serviços (Tela 6 — Anexo IV)

| Campo | Tipo | Obrigatório |
|---|---|---|
| `escopo_servicos` | textarea (texto livre) | sim |
| `numero_revisoes` | número inteiro | condicional |

**Pré-preenchimento pelo pacote:**
- O campo `escopo_servicos` recebe o texto sugestivo do pacote selecionado
- O campo `numero_revisoes` recebe o número sugerido pelo pacote

**Regra condicional (Anexo III):**
- `numero_revisoes` só é exibido quando o escopo inclui fases de desenvolvimento
  de projeto (ou seja, quando `tipo_servico = projeto`)

### Tela de serviços adicionais (Seção 8 — etapa 8)

| Campo | Tipo | Obrigatório |
|---|---|---|
| `servicos_adicionais` | checkboxes múltiplos | não |

**Opções disponíveis (Seção 6):**
- Gestão de obra
- Acompanhamento de obra
- Fiscalização de obra

**Campos condicionais ao selecionar serviços adicionais (Anexo III):**
- `descricao_servico_adicional` — texto livre para descrever o serviço
- Impacto em `prazo_total` e `valor_total` (aviso ao usuário para revisar esses campos)

### Regras de negócio

- `escopo_servicos` é obrigatório para geração do contrato (Regra 2 — Anexo V)
- Ao selecionar serviços adicionais, o sistema deve alertar o usuário para revisar
  prazo e honorários nas etapas seguintes (Anexo III — dependência)

## Referência no documento

Seção 6 — Serviços adicionais
Seção 8 — Fluxo (etapas 7 e 8)
Anexo III — Campos relacionados aos serviços e regras de dependência
Anexo IV — Tela 6
