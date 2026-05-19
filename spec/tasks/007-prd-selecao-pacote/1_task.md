# Tarefa 1.0: Backend — Estender pacotes.json com tipo_servico e tipologias

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- Nenhuma

## Estimativa

- **Tamanho**: P
- **Horas estimadas**: < 2h

## Visão Geral

Estender o arquivo `backend/src/data/pacotes.json` com os campos `tipo_servico` (string) e `tipologias` (array de strings) em cada um dos 5 pacotes. Atualizar a interface `Pacote` em `contratos-service.ts` para incluir esses dois campos. Estender os testes existentes para verificar que `getPackages()` e o endpoint `GET /api/contratos/pacotes` retornam os novos campos.

<skills>
### Conformidade com Skills Padrões

- **Backend**: Node.js + Hono + TypeScript
- **Testes**: Vitest
- **Package mgr**: bun
</skills>

<requirements>
- RF-04 (PRD): `GET /api/contratos/pacotes` deve retornar tipologias e tipo_servico por pacote
- Cada pacote deve ter `tipo_servico: string` e `tipologias: string[]`
- A interface `Pacote` em `contratos-service.ts` deve refletir os novos campos
- Testes existentes não devem quebrar
</requirements>

## Subtarefas

- [ ] 1.1 Ler `backend/src/data/pacotes.json` atual e entender a estrutura
- [ ] 1.2 Adicionar `tipo_servico` e `tipologias` a cada um dos 5 pacotes conforme a tabela da tech spec
- [ ] 1.3 Atualizar a interface `Pacote` em `backend/src/services/contratos-service.ts` adicionando os dois campos
- [ ] 1.4 Estender `contratos-service.test.ts`: verificar que `getPackages()` retorna `tipo_servico` e `tipologias` em cada pacote
- [ ] 1.5 Estender `contratos.test.ts`: verificar que `GET /api/contratos/pacotes` retorna 200 com os novos campos presentes
- [ ] 1.6 Executar `bun run test` no diretório `backend` e confirmar que todos os testes passam
- [ ] 1.7 Executar `bun run build` no diretório `backend`

## Detalhes de Implementação

Consulte a seção **"Modelos de Dados"** da `techspec.md` para a tabela completa com os valores de `tipo_servico` e `tipologias` por pacote.

Valores a adicionar por pacote:

| id | tipo_servico | tipologias |
|---|---|---|
| projeto-arquitetura | projeto | ["residencial","comercial","corporativa","institucional","outros"] |
| projeto-arquitetura-interiores | reforma de interiores | ["residencial","comercial"] |
| projeto-acompanhamento-obra | projeto | ["residencial","comercial"] |
| reforma | reforma | ["residencial","comercial"] |
| reforma-interiores | reforma de interiores | ["residencial","comercial"] |

## Critérios de Sucesso

- Todos os 5 pacotes têm `tipo_servico` e `tipologias` no JSON
- `bun run test` passa sem erros no backend
- `bun run build` conclui sem erros de TypeScript

## Testes da Tarefa

- [ ] Testes de unidade (`contratos-service.test.ts`):
  - `getPackages()` retorna array com 5 elementos
  - Cada pacote tem `tipo_servico` do tipo string (não vazio)
  - Cada pacote tem `tipologias` do tipo array com pelo menos 1 elemento
- [ ] Testes de integração (`contratos.test.ts`):
  - `GET /api/contratos/pacotes` retorna status 200
  - Resposta contém campo `tipo_servico` no primeiro pacote
  - Resposta contém campo `tipologias` no primeiro pacote

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `backend/src/data/pacotes.json` — modificar (adicionar campos)
- `backend/src/services/contratos-service.ts` — modificar (interface Pacote)
- `backend/src/services/contratos-service.test.ts` — modificar (estender testes)
- `backend/src/routes/contratos.test.ts` — modificar (estender testes)
