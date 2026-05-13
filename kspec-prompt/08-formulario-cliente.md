# Feature 08 — Formulário de Dados do Cliente

## Contexto

Etapa 5 do fluxo. O usuário preenche os dados do cliente contratante.
O formulário é dinâmico: os campos exibidos variam conforme o tipo de cliente
(Pessoa Física ou Pessoa Jurídica).

## Objetivo desta feature

Implementar a tela de coleta de dados do cliente (Tela 4 — Anexo IV), com
renderização condicional de campos baseada no tipo de cliente selecionado.

## Requisitos

### Campos base (Tela 4 — Anexo IV e Anexo III)

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| `cliente_tipo` | radio (PF / PJ) | sim | — |
| `cliente_nome` | texto | sim | não vazio |
| `cliente_documento` | texto | sim | CPF (PF) ou CNPJ (PJ) válido |
| `cliente_endereco` | texto | sim | não vazio |
| `cliente_email` | email | não | formato de e-mail |
| `cliente_telefone` | telefone | não | formato brasileiro |

### Campos condicionais (Anexo V — Regra sobre tipo de cliente)

**Quando `cliente_tipo = Pessoa Jurídica`:**
- `razao_social` — texto, obrigatório
- `nome_representante_legal` — texto, obrigatório

**Quando `cliente_tipo = Pessoa Física`:**
- Apenas os campos base acima

### Regras de negócio (Anexo III e Anexo V)

- A seleção do `cliente_tipo` determina quais campos de identificação são exibidos
- `cliente_nome` é obrigatório para geração do contrato (Regra 2 — Anexo V)
- Ao trocar o tipo de cliente, os campos condicionais devem ser limpos

### Comportamento

- Renderização condicional imediata ao selecionar o tipo de cliente
- Validação de CPF/CNPJ conforme o tipo selecionado
- Botão "Continuar" desabilitado se campos obrigatórios inválidos
- Botão "Voltar" retorna ao formulário do arquiteto

## Referência no documento

Seção 8 — Fluxo (etapa 5)
Anexo III — Campos relacionados ao cliente e regras de dependência
Anexo IV — Tela 4
Anexo V — dependência campo cliente_tipo
