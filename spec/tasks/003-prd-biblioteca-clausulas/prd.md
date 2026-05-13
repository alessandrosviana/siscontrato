# PRD — Biblioteca Modular de Cláusulas (SisContrato CAU/DF)

## Visão Geral

O SisContrato gera contratos de prestação de serviços de Arquitetura e Urbanismo a partir de um formulário guiado. Para compor o documento final, o sistema precisa de uma **biblioteca de cláusulas contratuais** — uma coleção estruturada e consultável de blocos de texto que são incluídos no contrato conforme as escolhas do arquiteto.

Esta feature implementa essa biblioteca: o modelo de dados das cláusulas, o conjunto inicial de 20 itens (10 obrigatórias + 10 opcionais) e a API que o frontend consome para exibir as opções ao arquiteto durante o preenchimento do formulário.

A biblioteca é um pré-requisito direto do motor de geração de contratos — sem ela, não há documento a gerar.

## Objetivos

- **API funcional**: `GET /api/clausulas` e `GET /api/clausulas/:slug` respondem corretamente ao frontend.
- **Biblioteca completa**: as 20 cláusulas da especificação inicial (Seção 10 e Anexo I) estão disponíveis e consultáveis.
- **Filtros operacionais**: o frontend pode recuperar apenas cláusulas obrigatórias ou filtrar por categoria.
- **Erro tratado**: busca por slug inexistente retorna HTTP 404 com mensagem clara.
- **Base para o motor**: o modelo de dados suporta a substituição de variáveis `{{variavel}}` que será implementada na feature de geração.

## Histórias de Usuário

**Arquiteto (usuário final):**

- Como arquiteto, quero visualizar a lista de cláusulas opcionais disponíveis durante o preenchimento do formulário, para que eu possa escolher quais incluir no meu contrato.
- Como arquiteto, quero saber o título e a categoria de cada cláusula opcional antes de selecioná-la, para que eu possa tomar uma decisão informada sem precisar ler o texto completo.
- Como arquiteto, quero que as cláusulas obrigatórias sejam automaticamente incluídas no contrato sem ação minha, para que eu não precise gerenciar itens que sempre devem estar presentes.

**Sistema (frontend):**

- Como frontend, quero consultar `GET /api/clausulas?obrigatoria=false` para exibir apenas as cláusulas opcionais no formulário de seleção.
- Como frontend, quero consultar `GET /api/clausulas/:slug` para obter o texto completo de uma cláusula específica quando necessário para composição do contrato.
- Como frontend, quero receber HTTP 404 quando buscar um slug inválido, para que eu possa exibir uma mensagem de erro adequada ao usuário.

## Funcionalidades Principais

### 1. Modelo de Dados da Cláusula

Define a estrutura de cada cláusula contratual armazenada na biblioteca.

**Requisitos funcionais:**

- RF-01: Cada cláusula deve conter os campos: `id` (string única), `slug` (kebab-case, legível), `titulo` (string exibível ao usuário), `categoria` (string temática), `texto` (conteúdo com variáveis no formato `{{variavel}}`), `obrigatoria` (boolean) e `versao` (string de controle de versão).
- RF-02: O campo `slug` deve ser único em toda a biblioteca e servir como identificador de busca na API.
- RF-03: O campo `texto` deve preservar as marcações `{{variavel}}` sem processamento — a substituição de variáveis é responsabilidade do motor de geração (feature futura).
- RF-04: A biblioteca deve ser armazenada como JSON estático em `backend/src/data/clausulas.json` — sem banco de dados no MVP.

### 2. Conjunto de Cláusulas Obrigatórias

Dez cláusulas sempre presentes em qualquer contrato, conforme Anexo I do documento de referência.

**Requisitos funcionais:**

- RF-05: As seguintes cláusulas devem existir na biblioteca com `obrigatoria: true`:
  1. `identificacao-das-partes` — Identificação das Partes
  2. `objeto-do-contrato` — Objeto do Contrato
  3. `escopo-dos-servicos` — Escopo dos Serviços
  4. `prazos` — Prazos
  5. `honorarios-e-pagamento` — Honorários e Forma de Pagamento
  6. `direitos-autorais` — Direitos Autorais (padrão)
  7. `responsabilidades-das-partes` — Responsabilidades das Partes
  8. `alteracoes-de-escopo` — Alterações de Escopo
  9. `rescisao-contratual` — Rescisão Contratual
  10. `foro` — Foro

### 3. Conjunto de Cláusulas Opcionais

Dez cláusulas incluídas apenas quando o arquiteto as seleciona explicitamente, conforme Seção 10 e Regras 5 e 6 do Anexo V.

**Requisitos funcionais:**

- RF-06: As seguintes cláusulas devem existir na biblioteca com `obrigatoria: false`:
  1. `direitos-autorais-ampliados` — Direitos Autorais Ampliados
  2. `exclusividade-arquiteto` — Exclusividade do Arquiteto
  3. `numero-maximo-revisoes` — Número Máximo de Revisões
  4. `visitas-extras-cobradas` — Visitas Extras Cobradas
  5. `reajuste-honorarios` — Reajuste de Honorários
  6. `alteracao-escopo-termo-aditivo` — Alteração de Escopo via Termo Aditivo
  7. `repeticao-servicos` — Repetição de Serviços
  8. `suspensao-projeto` — Suspensão do Projeto
  9. `multa-cancelamento` — Multa por Cancelamento
  10. `autorizacao-uso-imagens` — Autorização de Uso de Imagens
- RF-07: Cláusulas opcionais só são incluídas no contrato quando explicitamente selecionadas pelo arquiteto (Regra 5 — Anexo V).

### 4. API de Consulta

Dois endpoints REST que o frontend consome para acessar a biblioteca.

**Requisitos funcionais:**

- RF-08: `GET /api/clausulas` deve retornar a lista completa de cláusulas, incluindo todos os campos (inclusive `texto`), com HTTP 200.
- RF-09: `GET /api/clausulas` deve aceitar o parâmetro de query `obrigatoria` (`true`/`false`) e retornar apenas as cláusulas correspondentes.
- RF-10: `GET /api/clausulas` deve aceitar o parâmetro de query `categoria` e retornar apenas as cláusulas da categoria informada.
- RF-11: `GET /api/clausulas/:slug` deve retornar a cláusula com o slug informado com HTTP 200.
- RF-12: `GET /api/clausulas/:slug` deve retornar HTTP 404 com mensagem `{ "error": "Cláusula não encontrada" }` quando o slug não existir na biblioteca.
- RF-13: Ambos os endpoints devem responder com `Content-Type: application/json`.

## Experiência do Usuário

Esta feature não possui interface direta — a experiência do arquiteto com as cláusulas ocorre no formulário multi-etapas, que é uma feature posterior. O que esta feature entrega é a **camada de dados** que viabiliza essa experiência.

**Contrato de integração com o frontend:**

- O frontend recupera cláusulas opcionais via `GET /api/clausulas?obrigatoria=false` para montar a tela de seleção.
- O frontend recupera cláusulas obrigatórias via `GET /api/clausulas?obrigatoria=true` para incluí-las automaticamente no contrato.
- O frontend pode filtrar por categoria para organizar as opções por tema na UI.
- A resposta sempre inclui o campo `texto` — o frontend decide quando e como exibi-lo.

## Restrições Técnicas de Alto Nível

- **Sem banco de dados**: as cláusulas são armazenadas em `backend/src/data/clausulas.json` — arquivo gerenciado manualmente no MVP.
- **Sem processamento de variáveis**: o campo `texto` é retornado bruto, com as marcações `{{variavel}}` intactas — o processamento pertence ao motor de geração.
- **Backend Hono/Bun**: os endpoints são implementados no mesmo servidor da Feature 01, sob o prefixo `/api`.
- **Sem autenticação**: os endpoints são públicos no MVP — não há controle de acesso.
- **Sem paginação**: o conjunto de 20 cláusulas é pequeno o suficiente para retornar em uma única resposta.

## Fora de Escopo

- **Interface de gestão (CRUD admin)**: criar, editar, reordenar ou desativar cláusulas via UI — o JSON é editado manualmente no MVP.
- **Substituição de variáveis `{{variavel}}`**: processar e preencher as variáveis do texto pertence ao motor de geração de contratos.
- **Banco de dados**: persistência em SQL, NoSQL ou qualquer ORM — mantido como JSON estático.
- **Cláusulas personalizadas em tempo real (texto livre)**: a Regra 6 do Anexo V prevê isso, mas o armazenamento e processamento de texto livre é escopo de feature futura.
- **Versionamento automático de cláusulas**: controle de histórico e diff de versões — o campo `versao` existe mas não há lógica de versionamento automático no MVP.
- **Internacionalização**: as cláusulas são em português — sem suporte a múltiplos idiomas.
