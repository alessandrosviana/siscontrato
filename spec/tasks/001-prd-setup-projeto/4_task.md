# Tarefa 4.0: Quality Tools

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 2.0 Backend Setup
- 3.0 Frontend Setup

## Estimativa

- **Tamanho**: M
- **Horas estimadas**: 2-4h

## Visão Geral

Configura as ferramentas de qualidade de código em ambos os projetos: ESLint (flat config), Prettier e Vitest. Cada projeto tem sua própria configuração isolada, adequada à sua natureza (backend Node/Bun vs. frontend browser). Ao final desta task, os comandos `lint`, `format` e `test` estão disponíveis em cada projeto e executam sem erros.

<skills>
### Conformidade com Skills Padrões

- **code-standards**: as regras do ESLint devem reforçar as convenções de nomenclatura e estrutura definidas em `code-standards.md`.
</skills>

<requirements>
- ESLint deve usar flat config (`eslint.config.ts`) em cada projeto — sem `.eslintrc`.
- Prettier deve ter um `.prettierrc` em cada projeto com configuração consistente entre eles.
- Vitest deve ter um `vitest.config.ts` em cada projeto.
- O script `lint` deve executar o ESLint no projeto correspondente.
- O script `format` deve executar o Prettier com `--write` no projeto correspondente.
- O script `test` deve executar o Vitest no projeto correspondente.
- Os smoke tests criados nas tasks 2.0 e 3.0 devem passar ao executar `bun test` em cada projeto.
</requirements>

## Subtarefas

- [ ] 4.1 Instalar devDependencies de qualidade no `backend/`: `eslint`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `prettier`, `vitest`
- [ ] 4.2 Criar `backend/eslint.config.ts` com flat config para TypeScript (sem globals de browser)
- [ ] 4.3 Criar `backend/.prettierrc` com configuração padrão (ex: `singleQuote: true`, `trailingComma: "all"`, `semi: false`)
- [ ] 4.4 Criar `backend/vitest.config.ts` apontando para os arquivos de teste do backend
- [ ] 4.5 Adicionar scripts `lint`, `format` e `test` ao `backend/package.json`
- [ ] 4.6 Instalar devDependencies de qualidade no `frontend/`: `eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `prettier`, `vitest`, `@vitest/coverage-v8`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`
- [ ] 4.7 Criar `frontend/eslint.config.ts` com flat config para TypeScript + React (com globals de browser)
- [ ] 4.8 Criar `frontend/.prettierrc` com a mesma configuração padrão do backend
- [ ] 4.9 Criar `frontend/vitest.config.ts` com ambiente `jsdom` para testes de componentes React
- [ ] 4.10 Adicionar scripts `lint`, `format` e `test` ao `frontend/package.json`
- [ ] 4.11 Executar `bun test` em `backend/` e confirmar que o smoke test do health-check passa
- [ ] 4.12 Executar `bun test` em `frontend/` e confirmar que o smoke test da store Zustand passa
- [ ] 4.13 Executar `bun run lint` em ambos os projetos e resolver eventuais warnings

## Detalhes de Implementação

Consulte a seção **Qualidade — Linting, Formatação e Testes** e **Abordagem de Testes** em `techspec.md`.

## Critérios de Sucesso

- `bun run lint` em `backend/` e `frontend/` termina sem erros
- `bun run format` em ambos formata os arquivos sem erros
- `bun test` em `backend/` executa o smoke test de `GET /health` com sucesso
- `bun test` em `frontend/` executa o smoke test da store Zustand com sucesso

## Testes da Tarefa

- [ ] Testes de unidade: os smoke tests das tasks 2.0 e 3.0 devem passar (`health.test.ts` e `form-store.test.ts`)
- [ ] Testes de integração: não aplicável
- [ ] Testes E2E: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos Relevantes

- `backend/package.json` (atualizado — scripts lint, format, test)
- `backend/eslint.config.ts` (novo)
- `backend/.prettierrc` (novo)
- `backend/vitest.config.ts` (novo)
- `frontend/package.json` (atualizado — scripts lint, format, test)
- `frontend/eslint.config.ts` (novo)
- `frontend/.prettierrc` (novo)
- `frontend/vitest.config.ts` (novo)
