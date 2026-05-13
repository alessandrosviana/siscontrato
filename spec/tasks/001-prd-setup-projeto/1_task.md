# Tarefa 1.0: Root Workspace

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- Nenhuma

## Estimativa

- **Tamanho**: P
- **Horas estimadas**: 1-2h

## Visão Geral

Cria a estrutura raiz do monorepo com Bun Workspaces. O `package.json` na raiz declara os pacotes `backend` e `frontend` como workspaces e expõe os scripts orquestradores (`dev`, `test`, `build`). Após esta task, `bun install` na raiz instala as dependências de ambos os projetos e o `bun.lock` único é gerado.

<skills>
### Conformidade com Skills Padrões

- **code-standards**: nomes de arquivo em kebab-case; sem comentários desnecessários.
</skills>

<requirements>
- O `package.json` raiz deve declarar `workspaces: ["backend", "frontend"]`.
- O script `bun dev` deve iniciar backend e frontend em paralelo (usando `--filter` ou `bun run --cwd`).
- O script `bun test` deve executar os testes de ambos os pacotes.
- O script `bun run build` deve gerar os artefatos de produção de ambos os pacotes.
- Deve existir um único `bun.lock` na raiz após o `bun install`.
- O repositório deve ser inicializado com `git init` e um `.gitignore` adequado (node_modules, .env, dist).
</requirements>

## Subtarefas

- [ ] 1.1 Criar o `package.json` raiz com `name`, `private: true` e `workspaces: ["backend", "frontend"]`
- [ ] 1.2 Adicionar os scripts `dev`, `test` e `build` que delegam para os workspaces
- [ ] 1.3 Criar `backend/package.json` e `frontend/package.json` com `name` e `version` mínimos (sem dependências ainda — serão adicionados nas tasks 2.0 e 3.0)
- [ ] 1.4 Executar `bun install` na raiz e confirmar que o `bun.lock` é gerado
- [ ] 1.5 Executar `git init` e criar `.gitignore` cobrindo: `node_modules/`, `.env`, `dist/`, `build/`

## Detalhes de Implementação

Consulte a seção **Monorepo — Orquestração na Raiz** e **Sequenciamento de Desenvolvimento (passo 1)** em `techspec.md`.

## Critérios de Sucesso

- `bun install` na raiz termina sem erro e cria `bun.lock`
- Os scripts `dev`, `test` e `build` existem no `package.json` raiz
- A estrutura de diretórios `backend/` e `frontend/` existe com `package.json` em cada uma

## Testes da Tarefa

- [ ] Testes de unidade: não aplicável (sem código de aplicação nesta task)
- [ ] Testes de integração: executar `bun install` e verificar que `bun.lock` é criado na raiz
- [ ] Testes E2E: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos Relevantes

- `/package.json` (novo)
- `/bun.lock` (gerado)
- `/.gitignore` (novo)
- `/backend/package.json` (novo — esqueleto)
- `/frontend/package.json` (novo — esqueleto)
