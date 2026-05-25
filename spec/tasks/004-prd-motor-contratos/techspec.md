# Tech Spec — Motor de Geração de Contratos

## Resumo Executivo

O motor é implementado como um service stateless em `contratos-service.ts` que recebe um payload validado por Zod, constrói um mapa de variáveis via `buildVariableMap`, compõe as 17 seções do contrato em ordem e retorna o HTML final. A substituição de variáveis `{{variavel}}` é feita via `String.replace` com regex global sobre cada seção — sem template engine externa. Um mapper explícito converte os nomes amigáveis do formulário para os nomes exatos usados nos textos do `clausulas.json`.

## Arquitetura do Sistema

### Visão Geral dos Componentes

| Componente | Responsabilidade |
|------------|-----------------|
| `routes/contratos.ts` | Router Hono com 3 endpoints; valida payload com Zod; delega ao service |
| `services/contratos-service.ts` | `generateHtml(payload)`, `buildVariableMap(payload)`, `getPackages()` |
| `data/pacotes.json` | Dados estáticos dos 5 pacotes (escopo padrão, revisões, entregáveis) |
| `templates/contrato.ts` | Strings HTML para seções estruturais (header, disclaimer, assinaturas, footer, serviços adicionais) |
| `services/clausulas-service.ts` | Existente — fornece `listClausulas` e `findClausulaBySlug` |

Fluxo de dados: `POST /api/contratos/preview` → validação Zod → `buildVariableMap` → busca cláusulas obrigatórias + opcionais → compõe 17 seções → substitui variáveis → retorna `{ html }`.

## Design de Implementação

### Interfaces Principais

```typescript
interface ContratoPayload {
  // Cliente
  cliente_nome: string
  cliente_documento: string
  cliente_endereco: string
  // Arquiteto
  arquiteto_nome: string
  arquiteto_endereco: string
  registro_cau: string
  // Projeto
  tipo_servico: string       // slug do pacote (ex: "projeto-arquitetura")
  tipo_projeto: string       // descrição do objeto
  endereco_projeto: string
  area_projeto: string
  // Contratual (obrigatórias)
  escopo_servicos: string
  prazo_total: string
  valor_total: string
  forma_pagamento: string
  numero_revisoes: string
  finalidade_uso: string     // para cláusula direitos-autorais
  prazo_documentos: string   // para cláusula responsabilidades-das-partes
  lista_documentos: string
  prazo_orcamento_aditivo: string  // para cláusula alteracoes-de-escopo
  prazo_aviso_rescisao: string     // para cláusula rescisao-contratual
  cidade_foro: string
  // Opcionais
  servicos_adicionais?: string
  clausulas_opcionais?: string[]
  variaveis_opcionais?: Record<string, string>  // variáveis das cláusulas opcionais selecionadas
}

type VariableMap = Record<string, string>

// Resposta de todos os endpoints de geração
interface ContratoResponse {
  html: string
}
```

### Modelos de Dados

**`data/pacotes.json`** — array de `Pacote`:
```typescript
interface Pacote {
  id: string        // "projeto-arquitetura"
  label: string     // "Projeto de Arquitetura"
  escopo_padrao: string
  numero_revisoes_sugerido: number
  entregaveis: string[]
}
```

**Mapper** — tabela de mapeamento form → template (em `contratos-service.ts`):

| Campo do formulário | Variável no template |
|--------------------|---------------------|
| `cliente_nome` | `nome_contratante` |
| `cliente_documento` | `cpf_cnpj_contratante` |
| `cliente_endereco` | `endereco_contratante` |
| `arquiteto_nome` | `nome_arquiteto` |
| `arquiteto_endereco` | `endereco_escritorio` |
| `tipo_projeto` | `descricao_objeto` |
| `endereco_projeto` | `endereco_obra` |
| `escopo_servicos` | `etapas_servico` |
| `prazo_total` | `prazo_entrega` |
| `valor_total` | `valor_honorarios` |
| Campos com nomes iguais | passados diretamente (`registro_cau`, `forma_pagamento`, `numero_revisoes`, `cidade_foro`, etc.) |
| `estado_foro` | derivado — sempre `"Distrito Federal"` |

Campos sem equivalente direto em clausulas.json (`area_projeto`, `tipo_servico`) são usados nas seções estruturais (header, serviços adicionais).

### Endpoints de API

| Método | Caminho | Descrição | Corpo | Resposta |
|--------|---------|-----------|-------|----------|
| `POST` | `/api/contratos/preview` | Gera HTML para revisão | `ContratoPayload` | `{ html: string }` 200 |
| `POST` | `/api/contratos/gerar` | Gera HTML final (imutável) | `ContratoPayload` | `{ html: string }` 200 |
| `GET` | `/api/contratos/pacotes` | Lista pacotes disponíveis | — | `Pacote[]` 200 |

Erros: payload inválido → `{ error: string }` 400 (Zod formata a mensagem com os campos inválidos).

### Composição das 17 Seções

```
1  templateHeader(payload)           — string estática em templates/contrato.ts
2  templateDisclaimer()              — string estática
3  renderClause('identificacao-das-partes', vars)
4  renderClause('objeto-do-contrato', vars)
5  renderClause('escopo-dos-servicos', vars)
6  payload.servicos_adicionais       — templateServicosAdicionais(vars) ou ''
7  renderClause('prazos', vars)
8  renderClause('honorarios-e-pagamento', vars)
9  (incluído na cláusula 8)
10 payload.clausulas_opcionais       — renderClause(slug, vars) para cada slug
11 renderClause('direitos-autorais', vars)
12 renderClause('responsabilidades-das-partes', vars)
13 renderClause('alteracoes-de-escopo', vars)
14 renderClause('rescisao-contratual', vars)
15 renderClause('foro', vars)
16 templateAssinaturas(vars)         — string estática com campos de assinatura
17 templateFooter()                  — string estática
```

`renderClause(slug, vars)` recupera o texto via `findClausulaBySlug`, substitui variáveis e envolve em `<section>` com `<h2>` do título.

## Pontos de Integração

- **`clausulas-service.ts`**: `listClausulas({ obrigatoria: true })` e `findClausulaBySlug(slug)` — integração interna, sem falha esperada (dados em memória).
- **Sem serviços externos**: processamento completamente local.

## Verificações Técnicas

### Segurança

- Payload validado por Zod antes de qualquer processamento — rejeita campos extras com `.strict()` ou ignora com `.strip()` (preferir `.strip()` para tolerância a extensões futuras)
- Substituição de variáveis via regex `String.replace` — sem `eval`, sem execução de código
- Dados do payload não são logados (podem conter nomes e documentos de pessoas)
- HTML gerado é consumido internamente (feature 04) — não há risco de XSS nesta feature

### Arquitetura

- Service stateless — sem estado entre requisições, seguro para escalar horizontalmente
- `preview` e `gerar` compartilham a mesma lógica de geração — `generateHtml` é chamado por ambos; a diferença semântica (imutabilidade) é responsabilidade do frontend/Feature 04
- Cláusulas opcionais não encontradas na biblioteca → 400 com slug inválido identificado

### Infraestrutura

- Sem dependências de infraestrutura além do Bun runtime
- Nova dependência de produção: `zod` (`bun add zod` em `backend/`)

## Abordagem de Testes

### Testes Unidade (`contratos-service.test.ts`)

- `generateHtml` com payload completo → HTML contém todas as 10 cláusulas obrigatórias
- `generateHtml` sem `servicos_adicionais` → seção condicional ausente no HTML
- `generateHtml` com `servicos_adicionais` → seção condicional presente
- `generateHtml` → zero ocorrências de `{{` no output (todas as variáveis substituídas)
- `buildVariableMap` → mapeia corretamente `cliente_nome` para `nome_contratante`
- `generateHtml` com cláusula opcional selecionada → slug presente no HTML
- `getPackages` → retorna 5 pacotes com campos obrigatórios

### Testes de Integração (`contratos.test.ts`)

- `POST /api/contratos/preview` com payload válido → 200, `body.html` é string não vazia
- `POST /api/contratos/preview` sem campo obrigatório → 400, `body.error` identificando o campo
- `POST /api/contratos/gerar` com payload válido → 200
- `GET /api/contratos/pacotes` → 200, array com 5 itens
- `POST /api/contratos/preview` com slug de cláusula opcional inválido → 400

### Testes E2E

Não aplicável nesta feature (backend puro, sem UI).

## Sequenciamento de Desenvolvimento

1. **`data/pacotes.json`** — dados dos 5 pacotes (sem dependências)
2. **`templates/contrato.ts`** — strings HTML das seções estruturais (sem dependências)
3. **`services/contratos-service.ts`** — `buildVariableMap`, `generateHtml`, `getPackages` (depende de 1, 2 e clausulas-service)
4. **`services/contratos-service.test.ts`** — testes unitários do service (depende de 3)
5. **`routes/contratos.ts`** — router com Zod + 3 endpoints (depende de 3)
6. **`routes/contratos.test.ts`** — testes HTTP (depende de 5)
7. **`index.ts`** — registrar `contratosRouter` com `app.route('/api', contratosRouter)`

### Dependências Técnicas

- `zod` instalado em `backend/` antes do passo 5
- `clausulas-service.ts` da Feature 02 deve estar disponível (já está)

## Monitoramento e Observabilidade

### Logging Estruturado

- Sem log em geração bem-sucedida (operação normal)
- `console.error('Contract generation failed', { error })` em exceções não esperadas do service
- Nunca logar campos do payload (contém dados pessoais: nome, documento, endereço)

### Health Checks

- Coberto pelo endpoint `/health` existente (Feature 01)

### Métricas de Negócio

- Fora do escopo do MVP — sem coleta de métricas nesta feature

## Considerações Técnicas

### Decisões Principais

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Template engine | String.replace com regex | Zero dependência; textos do clausulas.json são strings simples sem lógica condicional |
| Validação | Zod | Schema declarativo; mensagens de erro por campo sem código imperativo |
| Payload → template vars | Mapper explícito | Desacopla a API do formulário dos nomes internos do clausulas.json, permitindo evoluir cada lado independentemente |
| Estrutura das seções | Array ordenado de funções | Explícito, testável e fácil de reordenar sem risco |
| `estado_foro` | Derivado hardcoded "Distrito Federal" | Plataforma é CAU/DF — nenhum contrato gerado terá foro fora do DF no MVP |

### Riscos Conhecidos

- **Variáveis de cláusulas opcionais**: cada cláusula opcional tem suas próprias variáveis (ex: `valor_revisao_adicional` para `numero-maximo-revisoes`). O campo `variaveis_opcionais: Record<string, string>` no payload permite ao frontend enviar exatamente o que cada cláusula precisa, mas requer que o frontend conheça os nomes das variáveis. Mitigação: documentar na techspec das features de formulário (Features 07-12) quais variáveis cada cláusula opcional exige.
- **Divergência clausulas.json vs payload**: se o texto de uma cláusula for atualizado e novas variáveis forem adicionadas, o payload precisará ser atualizado. O teste de "zero `{{` no output" detecta essa regressão.

### Conformidade com Skills Padrões

- **code-standards**: funções começam com verbo (`generateHtml`, `buildVariableMap`, `getPackages`), sem flag params, early returns na validação
- **logging**: sem log em operação normal, `console.error` estruturado em falhas, nunca logar dados do payload

### Arquivos Relevantes e Dependentes

**Novos:**
- `backend/src/routes/contratos.ts`
- `backend/src/routes/contratos.test.ts`
- `backend/src/services/contratos-service.ts`
- `backend/src/services/contratos-service.test.ts`
- `backend/src/data/pacotes.json`
- `backend/src/templates/contrato.ts`

**Modificados:**
- `backend/src/index.ts` — adiciona `app.route('/api', contratosRouter)`
- `backend/package.json` — adiciona `zod` como dependência de produção

**Dependências (não modificados):**
- `backend/src/services/clausulas-service.ts`
- `backend/src/data/clausulas.json`
