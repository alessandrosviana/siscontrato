# Bugs — Setup e Arquitetura do Projeto (SisContrato CAU/DF)

## BUG-01

- **ID**: BUG-01
- **Severidade**: Baixa
- **Status**: Aberto
- **Componente**: Backend / Testes
- **RF relacionado**: RF-17
- **Título**: Backend usa runner nativo `bun:test` em vez de Vitest conforme especificado

### Descrição

O PRD (RF-17) e a TechSpec especificam que o Vitest deve ser o test runner configurado em ambos os projetos. No entanto, o backend utiliza o runner nativo do Bun (`bun test`) com imports de `bun:test`, enquanto o frontend usa Vitest corretamente (`vitest run`).

O arquivo `backend/vitest.config.ts` existe no projeto, mas o script `test` em `backend/package.json` é `bun test`, que ignora essa configuração e usa o runner nativo do Bun.

### Evidência

**`backend/package.json` — script test:**
```json
"test": "bun test"
```

**`backend/src/routes/health.test.ts` — imports:**
```typescript
import { describe, expect, it } from 'bun:test'
```

**`frontend/package.json` — script test:**
```json
"test": "vitest run"
```

**Resultado dos testes** (ambos passam, mas via runners diferentes):
- Backend: `bun test v1.3.13 — 3 pass, 0 fail`
- Frontend: `vitest v4.1.6 — 6 passed`

### Impacto

Os testes funcionam corretamente e cobrem os requisitos de smoke test. O impacto é apenas de conformidade com a especificação e consistência entre os dois projetos. Não há falha funcional.

### Reprodução

1. Entrar em `backend/`
2. Executar `bun run test`
3. Observar que o output é do Bun native runner, não do Vitest
4. Comparar com `frontend/` que usa `vitest run`

### Resolução Sugerida

Atualizar `backend/package.json` para usar `vitest run`:
```json
"test": "vitest run"
```

E atualizar `backend/src/routes/health.test.ts` para usar imports do Vitest:
```typescript
import { describe, expect, it } from 'vitest'
```

- **Status:** Corrigido
- **Correção aplicada:** Script `test` em `backend/package.json` alterado de `bun test` para `vitest run`; import em `health.test.ts` alterado de `bun:test` para `vitest`
- **Testes de regressão:** Os 3 testes existentes em `health.test.ts` agora executam via Vitest e servem como regressão — se o import for revertido para `bun:test`, o `vitest run` falhará

---

*Sem outros bugs encontrados.*
