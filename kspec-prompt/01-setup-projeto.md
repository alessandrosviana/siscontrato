# Feature 01 — Setup e Arquitetura do Projeto

## Contexto

Plataforma de Geração Orientada de Contratos para arquitetos do CAU/DF.
Permite que arquitetos gerem contratos personalizados de prestação de serviços de
Arquitetura e Urbanismo a partir de um formulário guiado em etapas, com geração
automática do documento final em PDF.

O documento de referência é o MVP descrito na Proposta Técnica do CAU/DF (06/03/2026).

## Objetivo desta feature

Definir e implementar a estrutura base do projeto full-stack (monorepo), garantindo
que backend e frontend estejam configurados, integrados e prontos para receber as
demais features.

## Requisitos

### Backend
- Projeto Node.js com bun + Hono + TypeScript
- Estrutura de pastas: routes/, services/, templates/, lib/
- Configuração de CORS para desenvolvimento local
- Health-check endpoint `GET /health`
- Configuração de variáveis de ambiente (.env)

### Frontend
- Projeto React + Vite + TypeScript
- Configuração de proxy para o backend em desenvolvimento
- Estrutura de pastas: pages/, components/, hooks/, lib/, store/
- Roteamento com React Router (ou TanStack Router)
- Estado global mínimo para armazenar o progresso do formulário multi-etapas

### Monorepo
- Organização: `backend/` e `frontend/` na raiz
- Scripts na raiz: `bun dev` (sobe ambos), `bun test`, `bun run build`
- Arquivo `bun.lock` único na raiz

### Qualidade
- Configuração de ESLint + Prettier no frontend e backend
- Configuração de Vitest no backend e frontend
- tsconfig strict em ambos os projetos

## Observações técnicas

- O MVP não inclui autenticação — não é necessário middleware de auth nesta fase
- O backend não armazena dados no MVP — não é necessário banco de dados nesta fase
- O formulário multi-etapas é stateless no servidor; o estado fica no cliente

## Referência no documento

Seção 14 — Estrutura Tecnológica Simplificada
