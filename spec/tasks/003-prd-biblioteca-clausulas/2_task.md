# Tarefa 2.0: Endpoints da API

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 1.0 Camada de Dados

## Estimativa

- **Tamanho**: M
- **Horas estimadas**: 2-4h

## Visão Geral

Cria o router Hono com os dois endpoints da biblioteca de cláusulas e o registra no servidor principal. Ao final desta task, `GET /api/clausulas` e `GET /api/clausulas/:slug` estão funcionando e testados. O frontend pode chamar esses endpoints via proxy Vite (já configurado na Feature 01).

<skills>
### Conformidade com Skills Padrões

- **code-standards**: handlers de rota sem lógica de negócio (delegam ao service), sem comentários óbvios, kebab-case nos arquivos.
- **logging**: sem log em requisições normais; o erro 404 não deve ser logado (é comportamento esperado).
</skills>

<requirements>
- `GET /api/clausulas` deve retornar HTTP 200 com array de todas as cláusulas em JSON.
- `GET /api/clausulas?obrigatoria=true` e `?obrigatoria=false` devem filtrar corretamente.
- `GET /api/clausulas?categoria=<valor>` deve filtrar por categoria.
- `GET /api/clausulas/:slug` deve retornar HTTP 200 com a cláusula encontrada.
- `GET /api/clausulas/slug-inexistente` deve retornar HTTP 404 com body `{ "error": "Cláusula não encontrada" }`.
- Ambos os endpoints devem responder com `Content-Type: application/json`.
- O router deve ser montado em `/api` no `index.ts` usando `app.route('/api', clausulasRouter)`.
- Query param `obrigatoria` com valor inválido (ex: `"maybe"`) deve ser ignorado — retorna sem filtro por esse campo.
</requirements>

## Subtarefas

- [ ] 2.1 Criar `backend/src/routes/clausulas.ts` com o `clausulasRouter` (instância de `Hono`)
- [ ] 2.2 Implementar handler `GET /clausulas` que chama `listClausulas` com os filtros extraídos da query string
- [ ] 2.3 Implementar handler `GET /clausulas/:slug` que chama `findClausulaBySlug` e retorna 200 ou 404
- [ ] 2.4 Editar `backend/src/index.ts` para importar `clausulasRouter` e registrá-lo com `app.route('/api', clausulasRouter)`
- [ ] 2.5 Criar `backend/src/routes/clausulas.test.ts` com os testes listados abaixo usando `app.request()`
- [ ] 2.6 Executar `bun run test` em `backend/` e confirmar que todos os testes passam (incluindo os da Task 1.0)

## Detalhes de Implementação

Consulte as seções **Endpoints de API**, **Pontos de Integração** e **Sequenciamento de Desenvolvimento (passos 3, 4 e 5)** em `techspec.md`.

O padrão de montagem do router em `index.ts` já existe para `healthRouter` — siga o mesmo padrão com `app.route('/api', clausulasRouter)`.

O handler de `GET /clausulas` deve extrair `obrigatoria` da query string como string (`"true"` ou `"false"`), convertê-la para boolean antes de passar ao service, e ignorá-la se o valor for diferente de `"true"` ou `"false"`.

## Critérios de Sucesso

- `GET /api/clausulas` → 200, array com 20 itens, `Content-Type: application/json`
- `GET /api/clausulas?obrigatoria=true` → 200, 10 itens todos com `obrigatoria: true`
- `GET /api/clausulas?obrigatoria=false` → 200, 10 itens todos com `obrigatoria: false`
- `GET /api/clausulas?categoria=honorarios` → 200, itens filtrados por categoria
- `GET /api/clausulas/foro` → 200, objeto com `slug: "foro"`
- `GET /api/clausulas/nao-existe` → 404, body com campo `error`
- `GET /api/clausulas?obrigatoria=invalido` → 200, 20 itens (filtro ignorado)
- `bun run test` em `backend/` → todos os testes passam (Task 1.0 + Task 2.0)

## Testes da Tarefa

Usar `app.request()` do Hono — não é necessário subir o servidor HTTP real.

- [ ] `GET /api/clausulas` → status 200
- [ ] `GET /api/clausulas` → body é array com 20 itens
- [ ] `GET /api/clausulas?obrigatoria=true` → todos os itens têm `obrigatoria === true`
- [ ] `GET /api/clausulas?obrigatoria=false` → todos os itens têm `obrigatoria === false`
- [ ] `GET /api/clausulas?obrigatoria=invalido` → status 200, retorna sem filtrar (20 itens)
- [ ] `GET /api/clausulas/foro` → status 200, `body.slug === "foro"`
- [ ] `GET /api/clausulas/nao-existe` → status 404
- [ ] `GET /api/clausulas/nao-existe` → body tem campo `error`
- [ ] `GET /api/clausulas` → header `Content-Type` contém `application/json`

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos Relevantes

- `backend/src/routes/clausulas.ts` (novo)
- `backend/src/routes/clausulas.test.ts` (novo)
- `backend/src/index.ts` (modificado — adiciona import e `app.route('/api', clausulasRouter)`)
