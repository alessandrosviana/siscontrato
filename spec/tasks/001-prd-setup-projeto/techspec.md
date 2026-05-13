# Tech Spec — Setup e Arquitetura do Projeto (SisContrato CAU/DF)

## Resumo Executivo

O monorepo será organizado com **Bun Workspaces**, onde `backend/` e `frontend/` são pacotes independentes gerenciados por um `package.json` raiz. O backend usa Hono sobre Bun como servidor HTTP minimalista; o frontend usa Vite + React com React Router v7 e Zustand para estado do formulário multi-etapas. Não há camada de persistência nem autenticação nesta fase — a stack é deliberadamente simples para suportar iteração rápida no MVP.

A integração entre camadas em desenvolvimento ocorre via proxy do Vite: toda requisição do frontend para `/api/*` é repassada ao backend em `localhost:3000`, eliminando problemas de CORS no ambiente local.

## Arquitetura do Sistema

### Visão Geral dos Componentes

| Componente | Localização | Responsabilidade |
|---|---|---|
| `package.json` (raiz) | `/` | Workspace Bun, scripts orquestradores (`dev`, `test`, `build`) |
| `backend/src/index.ts` | `backend/src/` | Entry point: instancia o app Hono, registra rotas e inicia o servidor |
| `backend/src/routes/health.ts` | `backend/src/routes/` | Handler da rota `GET /health` |
| `backend/src/lib/env.ts` | `backend/src/lib/` | Parsing e validação das variáveis de ambiente |
| `frontend/src/main.tsx` | `frontend/src/` | Entry point React: monta o router no DOM |
| `frontend/src/App.tsx` | `frontend/src/` | Define a árvore de rotas com `createBrowserRouter` |
| `frontend/src/store/form-store.ts` | `frontend/src/store/` | Store Zustand para progresso do formulário multi-etapas |
| `frontend/src/pages/home.tsx` | `frontend/src/pages/` | Página inicial — rota raiz (`/`) |
| `vite.config.ts` | `frontend/` | Config Vite com proxy `/api` → `http://localhost:3000` |
| `vitest.config.ts` | `backend/` e `frontend/` | Config Vitest isolada por projeto |
| `eslint.config.ts` | `backend/` e `frontend/` | ESLint flat config isolado por projeto |

**Fluxo de dados em desenvolvimento:**
```
Browser → Vite Dev Server (:5173)
           ├─ assets estáticos → servidos diretamente
           └─ /api/* → proxy → Hono (:3000) → resposta JSON
```

## Design de Implementação

### Interfaces Principais

**Store Zustand (formulário multi-etapas):**

```typescript
interface StepData {
  [fieldName: string]: unknown;
}

interface FormState {
  currentStep: number;
  steps: Record<string, StepData>;
  setCurrentStep: (step: number) => void;
  updateStep: (key: string, data: StepData) => void;
  resetForm: () => void;
}
```

**Variáveis de ambiente do backend:**

```typescript
interface Env {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  CORS_ORIGIN: string;
}
```

### Modelos de Dados

Não há entidades de domínio persistidas nesta feature. Os únicos "modelos" são as variáveis de ambiente e o estado efêmero do formulário (definido acima).

### Endpoints de API

| Método | Caminho | Resposta |
|---|---|---|
| `GET` | `/health` | `200 { status: "ok" }` |

O prefixo `/api` é transparente: o Vite remove o prefixo antes de repassar ao Hono. Internamente, o Hono registra a rota como `/health`.

## Pontos de Integração

Não há integrações com serviços externos nesta feature. A única integração é interna: o proxy Vite → Hono em ambiente de desenvolvimento.

**Configuração do proxy (vite.config.ts):**
- Prefixo: `/api`
- Target: `http://localhost:3000`
- `rewrite`: remove o prefixo `/api` antes de encaminhar

## Verificações Técnicas

### Segurança

- **CORS**: restrito a `http://localhost:5173` em `NODE_ENV=development`. Nenhuma rota exposta aceita input do usuário nesta fase.
- **Variáveis de ambiente**: valores sensíveis ficam em `.env` (não versionado); `.env.example` documenta as chaves sem valores reais.
- **Sem superfície de ataque de negócio**: o único endpoint (`/health`) não processa input — risco mínimo.

### Arquitetura

- **Separação de responsabilidades**: `routes/` contém apenas handlers HTTP; `services/` conterá lógica de negócio nas features seguintes; `lib/` encapsula utilitários (env, etc.).
- **Stateless**: o backend não armazena estado entre requisições — favorece escalabilidade horizontal futura.
- **Bun Workspaces**: o `bun.lock` único na raiz garante versões consistentes entre projetos; imports cross-workspace são evitados nesta fase.

### Infraestrutura

- **Ambiente**: apenas desenvolvimento local — sem requisitos de deploy.
- **Portas padrão**: backend em `3000`, frontend em `5173` — configuráveis via `.env` e `vite.config.ts`.
- **Dependências de runtime**: Bun >= 1.x instalado na máquina do desenvolvedor.

## Abordagem de Testes

### Testes Unitários

**Backend — `backend/src/routes/health.test.ts`:**
- Instancia o app Hono sem iniciar o servidor HTTP
- Faz request simulada via `app.request('/health')`
- Asserções: status `200`, body `{ status: "ok" }`

**Frontend — `frontend/src/store/form-store.test.ts`:**
- Instancia a store com `create` do Zustand
- Verifica estado inicial: `currentStep === 0`, `steps === {}`
- Verifica `setCurrentStep` e `updateStep` alteram o estado corretamente

### Testes de Integração

Não aplicáveis nesta feature — não há integração com serviços externos.

### Testes de E2E

Não aplicáveis nesta feature — a lógica de negócio (formulário multi-etapas) pertence às features subsequentes.

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **Root workspace** — `package.json` com `workspaces`, scripts `dev`/`test`/`build` e configurações base. Deve ser feito primeiro para que os demais pacotes se registrem corretamente.
2. **Backend** — criar `backend/package.json`, instalar Hono, configurar `tsconfig.json` strict, implementar `lib/env.ts`, `routes/health.ts` e `src/index.ts`. Validar com `bun run dev` dentro de `backend/`.
3. **Frontend** — criar `frontend/package.json`, instalar React + Vite + React Router v7 + Zustand, configurar `tsconfig.json` strict, implementar `store/form-store.ts`, `pages/home.tsx`, `App.tsx` e `main.tsx`. Validar com `bun run dev` dentro de `frontend/`.
4. **Proxy Vite** — configurar `vite.config.ts` com o proxy `/api`. Depende de backend e frontend estarem funcionando individualmente.
5. **Qualidade** — ESLint flat config e `.prettierrc` em cada projeto, Vitest com smoke tests em cada projeto.
6. **Integração final** — validar `bun dev` na raiz sobe ambos; `bun test` na raiz executa todos os testes.

### Dependências Técnicas

- Bun >= 1.x instalado localmente
- Nenhuma dependência de serviço externo

## Monitoramento e Observabilidade

### Error Tracking

Não aplicável nesta fase (sem deploy, sem ambiente de produção).

### Logging Estruturado

Seguindo a rule `logging.md`:

- **Startup**: `console.log('Server started', { port, env })` ao inicializar o Hono
- **Erros de configuração**: `console.error('Invalid env config', { error })` se parsing de `.env` falhar
- Nenhum dado sensível é logado; nenhum log é escrito em arquivo

### Health Checks

- **Liveness**: `GET /health` retorna `{ status: "ok" }` — confirma que o processo está rodando
- **Readiness**: idêntico ao liveness nesta fase (sem banco de dados ou serviços externos para verificar)

### Métricas de Negócio

Não aplicáveis nesta feature de setup.

### Alertas

Não aplicáveis nesta fase (sem ambiente de produção).

## Considerações Técnicas

### Decisões Principais

| Decisão | Escolha | Justificativa |
|---|---|---|
| Monorepo | Bun Workspaces | `bun.lock` único na raiz; comandos `bun install` funcionam para todos os pacotes |
| ESLint/Prettier | Config por projeto | Backend e frontend têm regras distintas (ex: browser globals no frontend) |
| Vitest | Por projeto, orquestrado na raiz | Isolamento de configuração; paralelismo via scripts |
| Estado global | Zustand | API mínima, sem boilerplate, ideal para formulário multi-etapas |
| Roteamento | React Router v7 | Biblioteca consolidada, integração nativa com Vite, documentação ampla |

### Riscos Conhecidos

- **Conflito de portas**: se `3000` ou `5173` estiverem em uso, o ambiente falha na inicialização. Mitigação: documentar no `.env.example` e logar erro claro ao tentar subir.
- **Versões do Bun**: workspaces e algumas APIs do Bun evoluem entre versões. Mitigação: fixar a versão mínima no `README` e no `.env.example`.

### Conformidade com Skills Padrões

- `code-standards.md`: kebab-case em nomes de arquivo, camelCase em variáveis, sem comentários redundantes — aplicado a toda a estrutura de pastas e código gerado.
- `logging.md`: `console.log`/`console.error` com objetos estruturados, sem dados sensíveis, sem escrita em arquivo — aplicado nos logs de startup do backend.
- `database.md`: não aplicável (MVP stateless).

### Arquivos Relevantes e Dependentes

```
/
├── package.json                          # workspace root
├── bun.lock                              # lockfile único
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── eslint.config.ts
│   ├── .prettierrc
│   ├── vitest.config.ts
│   ├── .env.example
│   └── src/
│       ├── index.ts                      # entry point
│       ├── lib/env.ts                    # env parsing
│       └── routes/
│           ├── health.ts                 # GET /health
│           └── health.test.ts
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── eslint.config.ts
    ├── .prettierrc
    ├── vitest.config.ts
    └── src/
        ├── main.tsx                      # entry point
        ├── App.tsx                       # router root
        ├── store/
        │   ├── form-store.ts             # zustand store
        │   └── form-store.test.ts
        └── pages/
            └── home.tsx                  # rota /
```
