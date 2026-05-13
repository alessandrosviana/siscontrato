# Feature 09 — Formulário de Dados do Projeto

## Contexto

Etapa 6 do fluxo. O usuário preenche os dados do projeto objeto do contrato.
Parte dos campos podem já estar pré-preenchidos pelo pacote de serviço selecionado
na etapa 3 e devem ser editáveis.

## Objetivo desta feature

Implementar a tela de dados do projeto (Tela 5 — Anexo IV), com pré-preenchimento
parcial vindo do pacote e campos editáveis pelo usuário.

## Requisitos

### Campos (Tela 5 — Anexo IV e Anexo III)

| Campo | Tipo | Obrigatório | Pré-preenchido pelo pacote? |
|---|---|---|---|
| `tipo_contrato` | select | sim | sim |
| `tipo_servico` | select | sim | sim |
| `tipologia` | select | sim | sugerida pelo pacote |
| `endereco_projeto` | texto | sim | não |
| `area_projeto` | número (m²) | não | não |

### Opções dos selects (Seção 6)

**tipo_servico:**
- projeto
- reforma
- reforma de interiores

**tipologia:**
- residencial
- comercial
- corporativa
- institucional
- outros

### Regras de negócio

- `tipo_contrato` é obrigatório para geração do contrato (Regra 2 — Anexo V)
- Os campos pré-preenchidos pelo pacote são editáveis
- A combinação `tipo_servico` + `tipologia` influencia o conteúdo de cláusulas do contrato

### Comportamento

- Campos pré-preenchidos pelo pacote exibidos com indicação visual de "sugestão"
- Botão "Voltar" retorna ao formulário do cliente

## Referência no documento

Seção 6 — Classificações Utilizadas
Seção 8 — Fluxo (etapa 6)
Anexo III — Campos relacionados ao projeto
Anexo IV — Tela 5
