# kspec-prompt — Prompts para PRD da Plataforma de Contratos CAU/DF

Prompts organizados em ordem lógica de desenvolvimento para uso com `/kspec-prd`.

Cada arquivo é um prompt independente que descreve uma feature do sistema e
deve ser passado como entrada para `/kspec-prd` seguindo a metodologia SDD.

## Ordem de desenvolvimento

### Fase 1 — Fundação (backend)

| # | Feature | Arquivo | Depende de |
|---|---|---|---|
| 01 | Setup e arquitetura do projeto | `01-setup-projeto.md` | — |
| 02 | Biblioteca modular de cláusulas | `02-biblioteca-clausulas.md` | 01 |
| 03 | Motor de geração de contratos | `03-motor-contratos.md` | 01, 02 |
| 04 | Geração de PDF | `04-geracao-pdf.md` | 01, 03 |

### Fase 2 — Fluxo principal (frontend + integração)

| # | Feature | Arquivo | Depende de |
|---|---|---|---|
| 05 | Página inicial + aviso institucional | `05-pagina-inicial-aviso.md` | 01 |
| 06 | Seleção de pacote de serviço | `06-selecao-pacote.md` | 05 |
| 07 | Formulário de dados do arquiteto | `07-formulario-arquiteto.md` | 06 |
| 08 | Formulário de dados do cliente | `08-formulario-cliente.md` | 07 |
| 09 | Formulário de dados do projeto | `09-formulario-projeto.md` | 08 |
| 10 | Escopo dos serviços e serviços adicionais | `10-escopo-servicos.md` | 09 |
| 11 | Honorários e prazos | `11-honorarios-prazos.md` | 10 |
| 12 | Seleção de cláusulas opcionais | `12-clausulas-opcionais.md` | 11, 02 |
| 13 | Revisão e personalização do contrato | `13-revisao-personalizacao.md` | 12, 03 |
| 14 | Download do PDF e encaminhamento gov.br | `14-download-assinatura.md` | 13, 04 |

### Fase 3 — Evoluções futuras (pós-MVP)

| # | Feature | Arquivo | Depende de |
|---|---|---|---|
| 15 | Assistente virtual IA (Lina) | `15-assistente-ia.md` | 01–14 |

## Como usar

1. Abra o arquivo da feature desejada
2. Copie o conteúdo completo
3. Use `/kspec-prd` com esse conteúdo para gerar o PRD da feature
4. Após o PRD aprovado, use `/kspec-techspec` para a spec técnica
5. Use `/kspec-tasks` para gerar as tasks de implementação
6. Use `/kspec-implement` para implementar

## Referência

Documento base: `Plataforma_de_Contratos.pdf`
Proposta Técnica MVP — CAU/DF — 06/03/2026
