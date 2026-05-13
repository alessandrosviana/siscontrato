# Feature 02 — Biblioteca Modular de Cláusulas

## Contexto

A plataforma utiliza uma biblioteca modular de cláusulas contratuais. Cada cláusula
é um elemento independente que pode ser incluído ou omitido automaticamente no
contrato final conforme as escolhas do usuário.

A biblioteca precisa existir antes do motor de geração de contratos, pois é a fonte
de dados das cláusulas usadas na composição do documento.

## Objetivo desta feature

Implementar a estrutura de dados e a API da biblioteca de cláusulas contratuais,
permitindo que o sistema consulte, filtre e componha cláusulas para o contrato.

## Requisitos

### Modelo de dados de uma cláusula

Cada cláusula possui:
- `id` — identificador único
- `slug` — chave legível (ex: `direitos-autorais-ampliados`)
- `titulo` — nome exibido ao usuário
- `categoria` — tema da cláusula (ex: direitos autorais, rescisão, honorários)
- `texto` — conteúdo da cláusula com variáveis no formato `{{variavel}}`
- `obrigatoria` — boolean: cláusula sempre incluída ou opcional
- `versao` — controle de versão para rastreabilidade

### Cláusulas obrigatórias (sempre no contrato)

Conforme Anexo I do documento:
- identificação das partes
- objeto do contrato
- escopo dos serviços
- prazos
- honorários e forma de pagamento
- direitos autorais (padrão)
- responsabilidades das partes
- alterações de escopo
- rescisão contratual
- foro

### Cláusulas opcionais (biblioteca inicial — Seção 10)

1. direitos-autorais-ampliados
2. exclusividade-arquiteto
3. numero-maximo-revisoes
4. visitas-extras-cobradas
5. reajuste-honorarios
6. alteracao-escopo-termo-aditivo
7. repeticao-servicos
8. suspensao-projeto
9. multa-cancelamento
10. autorizacao-uso-imagens

### API (backend)

- `GET /api/clausulas` — lista todas as cláusulas (com filtro por `obrigatoria` e `categoria`)
- `GET /api/clausulas/:slug` — retorna uma cláusula pelo slug

### Regras de negócio (Regras 5 e 6 — Anexo V)

- Cláusulas opcionais só são incluídas no contrato quando explicitamente selecionadas pelo usuário
- O sistema deve permitir que o usuário adicione cláusulas adicionais personalizadas (texto livre)

### Armazenamento no MVP

- Cláusulas armazenadas como JSON estático no backend (sem banco de dados no MVP)
- Arquivo: `backend/src/data/clausulas.json`

## Referência no documento

Seção 10 — Biblioteca de Cláusulas Opcionais
Seção 11 — Estrutura do Contrato Gerado
Anexo I — Estrutura Modular do Modelo de Contrato
Anexo V — Regras de Negócio 5 e 6
