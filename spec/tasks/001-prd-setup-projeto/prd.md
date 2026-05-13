# PRD — Setup e Arquitetura do Projeto (SisContrato CAU/DF)

## Visão Geral

O SisContrato é uma plataforma web para geração orientada de contratos de prestação de serviços de Arquitetura e Urbanismo, destinada aos arquitetos registrados no CAU/DF. Esta feature estabelece a estrutura base do projeto em formato monorepo (backend + frontend), garantindo que o ambiente de desenvolvimento esteja configurado, integrado e pronto para receber todas as demais features do MVP.

O objetivo não é entregar funcionalidade de negócio, mas sim a fundação técnica sobre a qual o produto será construído — pipelines de qualidade, convenções de código, integração entre camadas e developer experience (DX) fluida desde o primeiro `bun dev`.

## Objetivos

- **Monorepo funcional**: um único comando (`bun dev` na raiz) deve iniciar backend e frontend simultaneamente.
- **Validação de saúde**: o endpoint `GET /health` do backend deve responder `200 OK`, confirmando que o servidor está operacional.
- **Frontend acessível no browser**: a aplicação React deve carregar sem erros em `http://localhost:5173`.
- **Base sem retrabalho**: a estrutura de pastas, configurações e convenções deve suportar todas as features do MVP sem necessidade de refatoração arquitetural futura.
- **Qualidade desde o início**: linting, formatação e testes devem estar configurados e executando em ambas as camadas.

## Histórias de Usuário

**Desenvolvedor do projeto:**

- Como desenvolvedor, quero clonar o repositório e executar um único comando para subir o ambiente completo, para que eu comece a trabalhar sem configuração manual demorada.
- Como desenvolvedor, quero uma estrutura de pastas clara e padronizada em backend e frontend, para que eu saiba exatamente onde criar novos arquivos ao implementar cada feature.
- Como desenvolvedor, quero que linting e formatação sejam verificados automaticamente, para que o código permaneça consistente independentemente de quem estiver contribuindo.
- Como desenvolvedor, quero executar `bun test` na raiz e obter o resultado de todos os testes (backend e frontend), para que eu tenha confiança rápida de que nada quebrou.
- Como desenvolvedor, quero que o frontend faça proxy transparente para o backend em desenvolvimento, para que eu não precise configurar CORS manualmente nas chamadas de API.

## Funcionalidades Principais

### 1. Backend — Servidor Hono com Bun

Configura um servidor HTTP leve usando o framework Hono sobre o runtime Bun, com TypeScript strict.

**Requisitos funcionais:**

- RF-01: O backend deve iniciar com `bun run dev` dentro de `backend/` ou via script de raiz.
- RF-02: O endpoint `GET /health` deve retornar `{ status: "ok" }` com HTTP 200.
- RF-03: CORS deve estar configurado para aceitar requisições de `http://localhost:5173` em desenvolvimento.
- RF-04: Variáveis de ambiente devem ser carregadas via arquivo `.env` (com `.env.example` versionado).
- RF-05: A estrutura de pastas deve seguir: `routes/`, `services/`, `templates/`, `lib/`.

### 2. Frontend — Aplicação React com Vite

Configura a aplicação React com TypeScript, roteamento via React Router v7 e estado global via Zustand.

**Requisitos funcionais:**

- RF-06: O frontend deve iniciar com `bun run dev` dentro de `frontend/` ou via script de raiz.
- RF-07: O Vite deve estar configurado com proxy para o backend (`/api` → `http://localhost:3000`).
- RF-08: O React Router v7 deve estar configurado com ao menos uma rota raiz (`/`) funcional.
- RF-09: A store Zustand deve estar estruturada para armazenar o progresso do formulário multi-etapas (dados das etapas e etapa atual).
- RF-10: A estrutura de pastas deve seguir: `pages/`, `components/`, `hooks/`, `lib/`, `store/`.

### 3. Monorepo — Orquestração na Raiz

Coordena os dois projetos a partir da raiz do repositório, com scripts unificados e lockfile único.

**Requisitos funcionais:**

- RF-11: O script `bun dev` na raiz deve iniciar backend e frontend em paralelo.
- RF-12: O script `bun test` na raiz deve executar os testes de backend e frontend.
- RF-13: O script `bun run build` na raiz deve gerar os artefatos de produção de ambos os projetos.
- RF-14: Deve existir um único `bun.lock` na raiz do repositório.

### 4. Qualidade — Linting, Formatação e Testes

Garante que as ferramentas de qualidade estejam configuradas e operacionais desde o início do projeto.

**Requisitos funcionais:**

- RF-15: ESLint e Prettier devem estar configurados em `backend/` e `frontend/`, com regras consistentes entre os dois.
- RF-16: `tsconfig.json` com `strict: true` deve estar presente em ambos os projetos.
- RF-17: Vitest deve estar configurado em backend e frontend com ao menos um teste de smoke (ex: health-check retorna 200).
- RF-18: Os scripts `lint` e `format` devem estar disponíveis em ambos os projetos.

## Experiência do Usuário

O "usuário" desta feature é o **desenvolvedor** — a experiência que deve ser otimizada é a Developer Experience (DX).

**Fluxo principal esperado:**

1. Desenvolvedor clona o repositório.
2. Executa `bun install` na raiz (instala dependências de ambos os projetos).
3. Executa `bun dev` na raiz.
4. Backend sobe em `http://localhost:3000`; frontend em `http://localhost:5173`.
5. Desenvolvedor acessa o browser e vê a aplicação React carregada.
6. Desenvolvedor acessa `http://localhost:3000/health` e recebe `{ "status": "ok" }`.

**Considerações de DX:**

- Logs de inicialização devem ser claros e indicar qual serviço subiu e em qual porta.
- Erros de configuração (ex: porta em uso) devem ser detectados cedo e reportados com mensagem legível.
- O `.env.example` deve conter todas as variáveis necessárias com valores padrão para desenvolvimento local.

## Restrições Técnicas de Alto Nível

- **Runtime obrigatório**: Bun — não é permitido usar Node.js puro ou npm/yarn/pnpm como runtime principal.
- **TypeScript strict**: `strict: true` é mandatório em ambos os projetos; código que não compile com strict não será aceito.
- **Framework de backend**: Hono — escolha definida na Proposta Técnica do CAU/DF (Seção 14).
- **Bundler de frontend**: Vite — escolha definida na Proposta Técnica do CAU/DF (Seção 14).
- **Estado do formulário**: stateless no servidor — o backend não armazena dados de formulário; o estado fica exclusivamente no cliente (Zustand).
- **Ambiente de execução**: apenas desenvolvimento local nesta fase; configurações de produção não fazem parte deste escopo.

## Fora de Escopo

- **Autenticação e autorização**: login, sessão de usuário, JWT ou qualquer middleware de auth — não fazem parte do MVP.
- **Banco de dados**: qualquer forma de persistência no servidor (SQL, NoSQL, Redis) — o MVP é stateless no servidor.
- **CI/CD e deploy**: pipelines de integração e entrega contínua, Dockerfile, configurações de produção.
- **Geração de PDF**: lógica de negócio de geração de documentos — pertence às features seguintes do MVP.
- **Funcionalidades de negócio**: formulário multi-etapas, campos de contrato, templates de documento — pertencem às features posteriores.
- **Temas, internacionalização (i18n) e acessibilidade avançada**: não são necessários para o ambiente de desenvolvimento base.
