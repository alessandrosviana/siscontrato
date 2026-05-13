# Feature 06 — Seleção de Pacote de Serviço

## Contexto

Após aceitar o aviso institucional, o usuário escolhe um pacote de serviço.
A escolha do pacote define a estrutura inicial do contrato: escopo pré-sugerido,
número de revisões e entregáveis típicos — todos editáveis nas etapas seguintes.

É a etapa 3 do fluxo principal.

## Objetivo desta feature

Implementar a tela de seleção de pacote de serviço e a lógica de pré-configuração
do estado do formulário com base no pacote escolhido.

## Requisitos

### Pacotes disponíveis no MVP (Seção 7)

| Pacote | Tipo de serviço | Tipologia sugerida |
|---|---|---|
| Projeto de Arquitetura | projeto | residencial / comercial / corporativa / institucional / outros |
| Projeto de Arquitetura de Interiores | reforma de interiores | residencial / comercial |
| Projeto + Acompanhamento de Obra | projeto | residencial / comercial |
| Reforma | reforma | residencial / comercial |
| Reforma de Interiores | reforma de interiores | residencial / comercial |

### Comportamento do pré-preenchimento (Seção 7 e Anexo I)

Ao selecionar um pacote, o sistema deve pré-preencher automaticamente:
- `tipo_servico` — mapeado do pacote
- `escopo_servicos` — texto sugestivo do escopo típico do pacote
- `numero_revisoes` — número sugerido para o tipo de serviço
- Lista de entregáveis típicos (exibida como sugestão no campo de escopo)

Todos os campos pré-preenchidos devem ser editáveis nas etapas seguintes.

### Campos salvos no estado do formulário (Anexo III)

- `pacote_servico` — identificador do pacote selecionado
- `tipo_contrato` — derivado do pacote
- `tipo_servico` — derivado do pacote

### Regras de negócio

- A seleção do pacote é obrigatória para continuar
- O pacote não limita a personalização — serve apenas como ponto de partida
- O usuário pode voltar e trocar o pacote a qualquer momento antes da geração final

### API necessária

- `GET /api/pacotes` — lista os pacotes disponíveis com campos de pré-configuração

## Referência no documento

Seção 5 — Tipos de Contrato no MVP
Seção 6 — Classificações Utilizadas
Seção 7 — Estrutura baseada em pacotes de serviços
Seção 8 — Fluxo (etapa 3)
Anexo I — Uso de pacotes de serviços
Anexo III — Campos: configuração inicial
