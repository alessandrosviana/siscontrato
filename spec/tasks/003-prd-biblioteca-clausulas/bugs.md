# Bugs — Biblioteca Modular de Cláusulas (003-prd-biblioteca-clausulas)

## BUG-001 — Teste HTTP de filtro por categoria ausente em clausulas.test.ts

**Severidade**: Baixa
**Status**: Aberto
**Tipo**: Cobertura de testes

**Descrição**:
O arquivo `backend/src/routes/clausulas.test.ts` não contém nenhum caso de teste para o endpoint `GET /api/clausulas?categoria=<valor>`. O RF-10 exige que o endpoint aceite o parâmetro `categoria` e retorne apenas as cláusulas da categoria informada. A funcionalidade está corretamente implementada e é testada a nível de service em `clausulas-service.test.ts`, mas a camada HTTP não tem cobertura automatizada para esse filtro.

**Evidência**:
- Busca por `categoria` em `clausulas.test.ts`: zero ocorrências
- `clausulas-service.test.ts` linha 22: `it("returns only clausulas matching the given categoria"...)` — cobre apenas o service, não o endpoint HTTP

**Impacto**:
Regressões no handler HTTP de `categoria` (ex: query param mal lido, filtro não delegado ao service) passariam despercebidas nos testes automatizados.

**Correção sugerida**:
Adicionar ao `describe('GET /api/clausulas')` em `clausulas.test.ts`:
```typescript
it('filters by categoria — all items have matching categoria', async () => {
  const res = await testApp.request('/api/clausulas?categoria=honorarios')
  const body = await res.json()
  expect(body.length).toBeGreaterThan(0)
  expect(body.every((item: { categoria: string }) => item.categoria === 'honorarios')).toBe(true)
})
```

- **Status:** Corrigido
- **Correção aplicada:** Adicionado teste HTTP para `?categoria=honorarios` no `describe('GET /api/clausulas')` de `clausulas.test.ts`, verificando que todos os itens retornados possuem `categoria === 'honorarios'`.
- **Testes de regressão:** `it('filters by categoria — all items have matching categoria')` em `backend/src/routes/clausulas.test.ts`

---

## BUG-002 — Content-Type não verificado para GET /api/clausulas/:slug

**Severidade**: Baixa
**Status**: Aberto
**Tipo**: Cobertura de testes

**Descrição**:
O RF-13 exige que **ambos** os endpoints (`GET /api/clausulas` e `GET /api/clausulas/:slug`) respondam com `Content-Type: application/json`. O teste de Content-Type em `clausulas.test.ts` verifica apenas o primeiro endpoint. O endpoint `/api/clausulas/:slug` não possui teste automatizado para esse header.

**Evidência**:
- `clausulas.test.ts` linha 21–24: teste de Content-Type apenas em `GET /api/clausulas`
- Nenhum teste de Content-Type no bloco `describe('GET /api/clausulas/:slug')`
- Verificação HTTP manual confirmou Content-Type correto em runtime: `application/json`

**Impacto**:
A funcionalidade está correta em runtime. O risco é que uma futura alteração no handler de slug possa quebrar o Content-Type sem ser detectada pelos testes.

**Correção sugerida**:
Adicionar ao `describe('GET /api/clausulas/:slug')` em `clausulas.test.ts`:
```typescript
it('returns Content-Type application/json for existing slug', async () => {
  const res = await testApp.request('/api/clausulas/foro')
  expect(res.headers.get('Content-Type')).toContain('application/json')
})
```

- **Status:** Corrigido
- **Correção aplicada:** Adicionado teste de Content-Type no `describe('GET /api/clausulas/:slug')` de `clausulas.test.ts`, verificando que o header `Content-Type` contém `application/json` para slug existente.
- **Testes de regressão:** `it('returns Content-Type application/json for existing slug')` em `backend/src/routes/clausulas.test.ts`
