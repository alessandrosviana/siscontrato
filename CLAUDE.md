# CLAUDE.md

Guia para agentes de IA ao trabalhar com o código deste repositório.

Aplicação full-stack com backend Node.js (Hono) e frontend React.

### Idioma

- **Código-fonte**: inglês (variáveis, funções, classes, comentários)
- **Specs e documentação de projeto** (PRD, tech spec, tasks, reviews): português Brasil

### Prioridades

- **Sempre use `bun`** — nunca use `npm`, `yarn` ou `pnpm` neste projeto
- **Backend usa Hono** — nunca use Express, Fastify ou outros frameworks HTTP
- **Frontend usa React + Vite** — nunca use CRA ou outros bundlers
- **Execute os checks antes de concluir:** `bun test`, `bun run build`, `bun run lint`
- **Não use workarounds** — prefira correções de causa raiz

### Comandos do projeto

```bash
# Raiz
bun install              # instalar dependências
bun dev                  # iniciar backend em modo desenvolvimento
bun test                 # executar testes (Vitest)
bun run build            # compilar para produção
bun run lint             # verificar lint

# Frontend
bun dev                  # iniciar frontend com Vite
bun test                 # executar testes do frontend
bun run build            # build de produção do frontend
```

### Stack e skills recomendadas

| Área         | Tecnologia                        | Skill sugerida       |
| ------------ | --------------------------------- | -------------------- |
| Backend      | Node.js + Hono + TypeScript       | —                    |
| Frontend     | React + Vite + TypeScript         | —                    |
| Testes       | Vitest                            | —                    |
| Package mgr  | bun                               | —                    |
| Linguagem    | TypeScript                        | —                    |

### Estrutura do projeto

```
/
├── backend/              # API Hono (Node.js + TypeScript)
│   ├── src/
│   │   ├── routes/       # definição de rotas
│   │   ├── services/     # lógica de negócio
│   │   └── index.ts      # entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/             # App React (Vite + TypeScript)
│   ├── src/
│   │   ├── components/   # componentes React
│   │   ├── pages/        # páginas/rotas
│   │   └── main.tsx      # entry point
│   ├── package.json
│   └── vite.config.ts
├── spec/
│   └── tasks/            # artefatos gerados (PRD, tech spec, tasks)
└── bun.lock
```

### Backend (Hono)

Rotas tipadas com Hono, validação com Zod, sem classes de controller — detalhes em `.claude/rules/code-standards.md`.

### Frontend (React)

Componentes funcionais, props tipadas com TypeScript, hooks para estado — detalhes em `.claude/rules/code-standards.md`.

### Testes

Unit: Vitest (backend e frontend) — detalhes em `.claude/rules/code-standards.md`.

### Git

- **Não execute** `git restore`, `git reset`, `git clean` ou comandos destrutivos **sem permissão explícita do usuário**

### Anti-padrões

1. Usar `npm`, `yarn` ou `pnpm` em vez de `bun`
2. Usar Express ou outros frameworks no backend — o projeto usa Hono
3. Usar Create React App — o projeto usa Vite
4. Pular os checks (`bun test`, `bun run build`) antes de marcar tarefa concluída
5. Executar comandos git destrutivos sem permissão do usuário

