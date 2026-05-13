# Relatório de Bugfix — Setup e Arquitetura do Projeto (SisContrato CAU/DF)

## Resumo

- **Total de Bugs**: 1
- **Bugs Corrigidos**: 1
- **Testes de Regressão Criados**: 0 (testes existentes passaram a exercer o Vitest — servem como regressão)

## Detalhes por Bug

| ID | Severidade | Status | Correção | Testes |
|----|------------|--------|----------|--------|
| BUG-01 | Baixa | Corrigido | Script `test` → `vitest run`; import `bun:test` → `vitest` | health.test.ts (3 testes) via Vitest |

### BUG-01 — Detalhes

**Causa Raiz:** o script `"test": "bun test"` em `backend/package.json` acionava o runner nativo do Bun, que lê os imports de `bun:test` mas ignora o `vitest.config.ts`. O arquivo de configuração existia mas nunca era usado.

**Arquivos Modificados:**

- `backend/package.json` — linha 7: `"bun test"` → `"vitest run"`
- `backend/src/routes/health.test.ts` — linha 1: `from 'bun:test'` → `from 'vitest'`

**Regressão:** os 3 testes de `health.test.ts` agora são executados pelo Vitest. Reverter o import para `bun:test` causaria erro de resolução de módulo com `vitest run`, garantindo detecção automática da regressão.

## Resultado dos Checks

| Check | Resultado |
|-------|-----------|
| `bun run test` (backend via Vitest) | 3 passed |
| `bun test` (raiz) | 9 passed (3 backend + 6 frontend) |
| `bun run lint` (backend) | Exit 0 — sem erros |
| `bun run build` (raiz) | Exit 0 — backend tsc + frontend Vite |
