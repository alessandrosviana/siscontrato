# Tarefa 2.0: Backend Setup

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 1.0 Root Workspace

## Estimativa

- **Tamanho**: M
- **Horas estimadas**: 2-4h

## Visão Geral

Configura o servidor HTTP do backend usando Hono sobre Bun com TypeScript strict. Ao final desta task, `bun run dev` dentro de `backend/` inicia o servidor na porta `3000` e o endpoint `GET /health` responde `{ status: "ok" }` com HTTP 200. A estrutura de pastas (`routes/`, `services/`, `templates/`, `lib/`) e o carregamento seguro de variáveis de ambiente também são estabelecidos.

<skills>
### Conformidade com Skills Padrões

- **code-standards**: kebab-case para arquivos, camelCase para variáveis, funções começam com verbo, sem mais de 3 parâmetros.
- **logging**: `console.log` com objetos estruturados no startup; `console.error` em falhas de configuração; sem dados sensíveis nos logs.
</skills>

<requirements>
- O backend deve usar Hono como framework HTTP e Bun como runtime.
- O `tsconfig.json` deve ter `strict: true`.
- `lib/env.ts` deve fazer parsing e validação das variáveis de ambiente; falha com `console.error` e encerra o processo se variável obrigatória estiver ausente.
- `src/index.ts` deve ser o entry point; ao iniciar, deve logar `console.log('Server started', { port, env })`.
- `GET /health` deve retornar `{ status: "ok" }` com HTTP 200.
- CORS deve aceitar `http://localhost:5173` em `NODE_ENV=development`.
- `.env.example` deve conter todas as variáveis com valores padrão para desenvolvimento local (`PORT=3000`, `NODE_ENV=development`, `CORS_ORIGIN=http://localhost:5173`).
- `.env` deve estar no `.gitignore`.
</requirements>

## Subtarefas

- [ ] 2.1 Adicionar dependências ao `backend/package.json`: `hono` e `@hono/node-server` (ou equivalente Bun)
- [ ] 2.2 Criar `backend/tsconfig.json` com `strict: true`, `target: "ESNext"` e `module: "ESNext"`
- [ ] 2.3 Criar `backend/src/lib/env.ts` com parsing e validação das variáveis de ambiente
- [ ] 2.4 Criar `backend/src/routes/health.ts` com o handler de `GET /health`
- [ ] 2.5 Criar `backend/src/index.ts` registrando o middleware de CORS, a rota de health e iniciando o servidor
- [ ] 2.6 Criar `backend/.env.example` e `backend/.env` (não versionado) com as variáveis padrão
- [ ] 2.7 Adicionar script `dev` ao `backend/package.json` (`bun run src/index.ts --watch`)
- [ ] 2.8 Validar: executar `bun run dev` em `backend/` e confirmar resposta de `GET /health`

## Detalhes de Implementação

Consulte as seções **Backend — Servidor Hono com Bun**, **Interfaces Principais (Env)**, **Endpoints de API** e **Logging Estruturado** em `techspec.md`.

## Critérios de Sucesso

- `bun run dev` em `backend/` inicia sem erros e loga a porta no console
- `GET http://localhost:3000/health` retorna `{ "status": "ok" }` com status 200
- Requisição de `http://localhost:5173` não é bloqueada por CORS
- Ausência de variável obrigatória no `.env` encerra o processo com log de erro claro

## Testes da Tarefa

- [ ] Testes de unidade: `backend/src/routes/health.test.ts` — instancia o app Hono, faz request simulada para `/health`, verifica status 200 e body `{ status: "ok" }`
- [ ] Testes de integração: não aplicável nesta task (sem serviços externos)
- [ ] Testes E2E: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos Relevantes

- `backend/package.json` (atualizado)
- `backend/tsconfig.json` (novo)
- `backend/src/index.ts` (novo)
- `backend/src/lib/env.ts` (novo)
- `backend/src/routes/health.ts` (novo)
- `backend/src/routes/health.test.ts` (novo)
- `backend/.env.example` (novo)
- `backend/.env` (novo — não versionado)
