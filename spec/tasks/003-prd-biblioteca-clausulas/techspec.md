# Tech Spec — Biblioteca Modular de Cláusulas (SisContrato CAU/DF)

## Resumo Executivo

A feature adiciona dois endpoints REST ao servidor Hono existente (`/api/clausulas` e `/api/clausulas/:slug`) que servem cláusulas contratuais lidas de um arquivo JSON estático. A arquitetura segue o padrão já estabelecido pela Feature 01: router isolado em `routes/`, lógica de acesso a dados em `services/`, e dados estáticos em `data/`. Nenhuma dependência nova é adicionada ao projeto.

## Arquitetura do Sistema

### Visão Geral dos Componentes

| Componente | Localização | Responsabilidade |
|---|---|---|
| `clausulas.json` | `backend/src/data/` | Fonte de dados estática — 20 cláusulas em JSON |
| `clausulas-service.ts` | `backend/src/services/` | Funções puras de acesso e filtragem das cláusulas |
| `clausulas.ts` (router) | `backend/src/routes/` | Handlers HTTP — validação de params e serialização da resposta |
| `clausulas.test.ts` | `backend/src/routes/` | Testes de unidade/integração dos endpoints |
| `index.ts` | `backend/src/` | Registra o novo router em `/api` (modificado) |

**Fluxo de dados:**
```
GET /api/clausulas?obrigatoria=false
  → clausulasRouter (extrai query params)
  → clausulasService.listClausulas({ obrigatoria: false })
  → lê clausulas.json em memória
  → aplica filtro
  → retorna Clausula[]
```

## Design de Implementação

### Interfaces Principais

```typescript
interface Clausula {
  id: string
  slug: string
  titulo: string
  categoria: string
  texto: string
  obrigatoria: boolean
  versao: string
}

interface ClausulaFilters {
  obrigatoria?: boolean
  categoria?: string
}

// clausulas-service.ts
function listClausulas(filters: ClausulaFilters): Clausula[]
function findClausulaBySlug(slug: string): Clausula | undefined
```

### Modelos de Dados

**`clausulas.json`** — array de objetos `Clausula`. Cada entrada segue a interface acima. Exemplo de entrada:

```json
{
  "id": "c-001",
  "slug": "identificacao-das-partes",
  "titulo": "Identificação das Partes",
  "categoria": "identificacao",
  "texto": "CONTRATANTE: {{nome_contratante}}, ...",
  "obrigatoria": true,
  "versao": "1.0.0"
}
```

**Categorias usadas no conjunto inicial** (referência para filtragem):

| Categoria | Cláusulas |
|---|---|
| `identificacao` | identificacao-das-partes |
| `objeto` | objeto-do-contrato, escopo-dos-servicos |
| `prazo` | prazos |
| `honorarios` | honorarios-e-pagamento, reajuste-honorarios, visitas-extras-cobradas |
| `direitos-autorais` | direitos-autorais, direitos-autorais-ampliados, autorizacao-uso-imagens |
| `responsabilidades` | responsabilidades-das-partes, exclusividade-arquiteto |
| `escopo` | alteracoes-de-escopo, alteracao-escopo-termo-aditivo, repeticao-servicos |
| `rescisao` | rescisao-contratual, multa-cancelamento, suspensao-projeto |
| `juridico` | foro |
| `revisoes` | numero-maximo-revisoes |

### Endpoints de API

| Método | Caminho | Query Params | Resposta sucesso | Resposta erro |
|---|---|---|---|---|
| `GET` | `/api/clausulas` | `obrigatoria?: "true"\|"false"`, `categoria?: string` | `200 Clausula[]` | — |
| `GET` | `/api/clausulas/:slug` | — | `200 Clausula` | `404 { error: string }` |

**Comportamento dos filtros em `GET /api/clausulas`:**
- Sem params → retorna todas as 20 cláusulas
- `?obrigatoria=true` → filtra onde `obrigatoria === true`
- `?obrigatoria=false` → filtra onde `obrigatoria === false`
- `?categoria=honorarios` → filtra onde `categoria === "honorarios"` (case-sensitive)
- Params combinados → filtro cumulativo (AND)
- Valor inválido de `obrigatoria` (ex: `?obrigatoria=maybe`) → ignora o filtro, retorna sem filtragem por esse campo

## Pontos de Integração

Nenhuma integração externa. O único ponto de integração é interno: `index.ts` precisa registrar o novo router:

```typescript
app.route('/api', clausulasRouter)
```

O prefixo `/api` no `index.ts` mapeia as rotas do router (`/clausulas`, `/clausulas/:slug`) para os paths finais `/api/clausulas` e `/api/clausulas/:slug`. O Vite proxy do frontend já está configurado para repassar `/api/*` ao backend.

## Verificações Técnicas

### Segurança

- **Input não confiável**: `slug` e `categoria` vêm da URL/query — nenhum deles é executado ou usado em queries dinâmicas; apenas comparação de string com dados em memória. Risco mínimo.
- **Sem autenticação**: endpoints públicos conforme definido no PRD. Nenhuma informação sensível no payload (texto jurídico público).
- **Sem side effects de escrita**: ambos os endpoints são somente leitura — nenhuma rota modifica o JSON.

### Arquitetura

- **Separação de responsabilidades**: handlers de rota não acessam o JSON diretamente — delegam ao service. Facilita troca futura do mecanismo de persistência (ex: banco de dados) sem alterar as rotas.
- **JSON carregado em memória**: o `import` do JSON é resolvido pelo Bun no startup — sem I/O em cada requisição. Performance adequada para 20 registros.
- **Sem estado mutável**: o service retorna novos arrays filtrados; não modifica o array original.

### Infraestrutura

- **Sem novas dependências**: Hono e Bun nativos são suficientes. Sem Zod, ORMs ou clientes HTTP.
- **Sem migrations**: arquivo JSON versionado no repositório.
- **Impacto em `index.ts`**: adição de uma linha (`app.route('/api', clausulasRouter)`) e um import.

## Abordagem de Testes

### Testes Unitários

**`clausulas.test.ts`** — usa `app.request()` do Hono (sem subir servidor HTTP real):

- `GET /api/clausulas` → status 200, array com 20 itens
- `GET /api/clausulas?obrigatoria=true` → todos os itens retornados têm `obrigatoria: true` (10 itens)
- `GET /api/clausulas?obrigatoria=false` → todos os itens retornados têm `obrigatoria: false` (10 itens)
- `GET /api/clausulas?categoria=honorarios` → todos os itens retornados têm `categoria: "honorarios"`
- `GET /api/clausulas/identificacao-das-partes` → status 200, body com `slug: "identificacao-das-partes"`
- `GET /api/clausulas/slug-inexistente` → status 404, body com campo `error`
- `GET /api/clausulas?obrigatoria=invalido` → status 200 (filtro ignorado)

**`clausulas-service.test.ts`** (opcional, se complexidade justificar):

- `listClausulas({})` → 20 itens
- `listClausulas({ obrigatoria: true })` → 10 itens
- `findClausulaBySlug('foro')` → objeto com `slug: "foro"`
- `findClausulaBySlug('nao-existe')` → `undefined`

### Testes de Integração

Não aplicáveis — sem serviços externos.

### Testes de E2E

Não aplicáveis nesta feature — sem UI. A integração real com o frontend ocorre na feature do formulário.

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **`backend/src/data/clausulas.json`** — criar o arquivo com as 20 cláusulas. Deve ser feito primeiro pois é a fonte de dados de tudo.
2. **`backend/src/services/clausulas-service.ts`** — implementar `listClausulas` e `findClausulaBySlug` lendo o JSON. Pode ser testado independentemente da rota.
3. **`backend/src/routes/clausulas.ts`** — implementar os dois handlers usando o service.
4. **`backend/src/routes/clausulas.test.ts`** — smoke tests dos endpoints.
5. **`backend/src/index.ts`** — registrar `clausulasRouter` em `/api`.

### Dependências Técnicas

- Feature 01 (setup) concluída — servidor Hono já operacional.
- Sem dependências de infraestrutura externas.

## Monitoramento e Observabilidade

### Error Tracking

- Erro 404 não precisa de log — é comportamento esperado e documentado.
- Se o JSON falhar no parse (erro de startup), o Bun lançará exceção não tratada → `console.error` com stack trace via handler global de erros do Hono (ou processo encerra com erro legível).

### Logging Estruturado

Seguindo `logging.md`:
- Nenhum log em requisições bem-sucedidas (sem side effects, sem operações críticas).
- Se `clausulas.json` não puder ser importado (arquivo corrompido): `console.error('Failed to load clausulas data', { error })` no momento do import — o processo encerra antes de aceitar requisições.

### Health Checks

O endpoint `GET /health` existente cobre liveness. Não há readiness adicional a configurar (sem DB, sem serviços externos).

### Métricas de Negócio

Não aplicáveis nesta feature — dados são estáticos, sem transações de negócio.

### Alertas

Não aplicáveis nesta fase.

## Considerações Técnicas

### Decisões Principais

| Decisão | Escolha | Justificativa |
|---|---|---|
| Persistência | JSON estático em `data/` | PRD restringe explicitamente o uso de banco de dados no MVP |
| Carregamento | `import` estático no module scope | JSON carregado uma vez no startup; sem I/O por requisição |
| Validação de params | Manual no service | Sem dependência extra; conjunto de valores pequeno e previsível |
| Montagem do router | `app.route('/api', clausulasRouter)` | Consistência com o padrão estabelecido; prefixo `/api` alinhado com o proxy Vite |
| Filtro combinado | AND implícito | Comportamento mais restritivo e previsível para o frontend |

### Riscos Conhecidos

- **JSON corrompido**: se `clausulas.json` tiver erro de sintaxe, o servidor falha no startup. Mitigação: incluir o arquivo no lint/typecheck via TypeScript (`import data from './data/clausulas.json' assert { type: 'json' }`) — o compilador valida o formato.
- **Slug duplicado**: dois registros com o mesmo slug fariam `findClausulaBySlug` retornar o primeiro encontrado silenciosamente. Mitigação: teste unitário que asserta unicidade dos slugs no array.

### Conformidade com Skills Padrões

- `code-standards.md`: funções com verbo (`listClausulas`, `findClausulaBySlug`), sem flag params (objeto `ClausulaFilters`), sem comentários óbvios, kebab-case nos arquivos, código em inglês.
- `logging.md`: sem logs em requisições normais, `console.error` com objeto estruturado apenas em falhas críticas, sem dados de conteúdo (textos jurídicos) nos logs.
- `database.md`: não aplicável.

### Arquivos Relevantes e Dependentes

```
backend/
  src/
    data/
      clausulas.json              (novo — fonte de dados)
    services/
      clausulas-service.ts        (novo — lógica de filtragem)
    routes/
      clausulas.ts                (novo — handlers HTTP)
      clausulas.test.ts           (novo — testes)
    index.ts                      (modificado — registra router em /api)
```
