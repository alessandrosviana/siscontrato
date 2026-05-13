# Tarefa 3.0: Frontend Setup

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 1.0 Root Workspace

## Estimativa

- **Tamanho**: G
- **Horas estimadas**: 4-6h

## Visão Geral

Configura a aplicação React com Vite, TypeScript strict, roteamento via React Router v7 e estado global via Zustand. Ao final desta task, `bun run dev` dentro de `frontend/` inicia o Vite Dev Server na porta `5173`, exibindo a página inicial no browser. O proxy `/api → http://localhost:3000` está configurado, e a store Zustand está estruturada para receber o estado do formulário multi-etapas nas features seguintes.

<skills>
### Conformidade com Skills Padrões

- **code-standards**: kebab-case para nomes de arquivo, PascalCase para componentes React, camelCase para variáveis e funções.
</skills>

<requirements>
- O `tsconfig.json` deve ter `strict: true`.
- O Vite deve ser configurado com proxy: requisições para `/api/*` são repassadas a `http://localhost:3000`, com remoção do prefixo `/api`.
- O React Router v7 deve ser configurado com `createBrowserRouter` e ao menos uma rota raiz (`/`) apontando para `pages/home.tsx`.
- A store Zustand deve seguir a interface `FormState` definida na `techspec.md` (campos: `currentStep`, `steps`, `setCurrentStep`, `updateStep`, `resetForm`).
- A estrutura de pastas deve seguir: `pages/`, `components/`, `hooks/`, `lib/`, `store/`.
</requirements>

## Subtarefas

- [ ] 3.1 Adicionar dependências ao `frontend/package.json`: `react`, `react-dom`, `react-router`, `zustand` e devDependencies: `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`, `@types/react-dom`
- [ ] 3.2 Criar `frontend/tsconfig.json` com `strict: true`, `jsx: "react-jsx"` e configurações de path adequadas para Vite
- [ ] 3.3 Criar `frontend/vite.config.ts` com o plugin React e o proxy `/api → http://localhost:3000`
- [ ] 3.4 Criar `frontend/src/store/form-store.ts` com a store Zustand seguindo a interface `FormState` da techspec
- [ ] 3.5 Criar `frontend/src/pages/home.tsx` com conteúdo mínimo (placeholder para rota raiz)
- [ ] 3.6 Criar `frontend/src/App.tsx` com `createBrowserRouter` e a rota `/` apontando para `HomePage`
- [ ] 3.7 Criar `frontend/src/main.tsx` como entry point, montando o `RouterProvider` no DOM
- [ ] 3.8 Criar `frontend/index.html` como ponto de entrada do Vite
- [ ] 3.9 Adicionar script `dev` ao `frontend/package.json` (`vite`)
- [ ] 3.10 Validar: executar `bun run dev` em `frontend/` e confirmar que a página carrega em `http://localhost:5173`

## Detalhes de Implementação

Consulte as seções **Frontend — Aplicação React com Vite**, **Interfaces Principais (FormState)** e **Pontos de Integração (proxy)** em `techspec.md`.

## Critérios de Sucesso

- `bun run dev` em `frontend/` inicia sem erros e abre em `http://localhost:5173`
- A página inicial renderiza sem erros no console do browser
- A store Zustand inicia com `currentStep: 0` e `steps: {}`
- Requisição para `/api/health` do frontend é proxiada corretamente para o backend (quando o backend estiver rodando)

## Testes da Tarefa

- [ ] Testes de unidade: `frontend/src/store/form-store.test.ts` — verifica estado inicial, `setCurrentStep`, `updateStep` e `resetForm`
- [ ] Testes de integração: não aplicável nesta task
- [ ] Testes E2E: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos Relevantes

- `frontend/package.json` (atualizado)
- `frontend/tsconfig.json` (novo)
- `frontend/vite.config.ts` (novo)
- `frontend/index.html` (novo)
- `frontend/src/main.tsx` (novo)
- `frontend/src/App.tsx` (novo)
- `frontend/src/pages/home.tsx` (novo)
- `frontend/src/store/form-store.ts` (novo)
- `frontend/src/store/form-store.test.ts` (novo)
