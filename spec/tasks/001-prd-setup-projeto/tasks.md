# Resumo de Tarefas de Implementação de Setup e Arquitetura do Projeto

**Legenda de tamanho**: P (< 2h) | M (2-4h) | G (4-8h) | GG (> 8h)

## Tarefas

- [x] 1.0 Root Workspace — package.json com Bun Workspaces, scripts orquestradores e bun.lock [P]
- [x] 2.0 Backend Setup — Hono + TypeScript strict, lib/env, GET /health (depende: 1.0) [M]
- [x] 3.0 Frontend Setup — Vite + React + React Router v7 + Zustand + proxy /api (depende: 1.0) [G]
- [x] 4.0 Quality Tools — ESLint, Prettier e Vitest com smoke tests em backend e frontend (depende: 2.0, 3.0) [M]
- [x] 5.0 Integração Final — validação de bun dev, bun test e bun run build na raiz (depende: 4.0) [P]
