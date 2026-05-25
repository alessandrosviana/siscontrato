# Tarefa 1.0: ContratoPayload — Adicionar campos do cliente ao contrato.ts

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- Nenhuma

## Estimativa

- **Tamanho**: P
- **Horas estimadas**: < 2h

## Visão Geral

Adicionar os campos `cliente_tipo`, `cliente_email`, `cliente_telefone`, `razao_social` e `nome_representante_legal` à interface `ContratoPayload` em `frontend/src/types/contrato.ts`. Verificar se `frontend/src/pages/result-page.tsx` (que usa `ContratoPayload` para montar o payload do PDF) precisa ser atualizado. Garantir que o build não quebra.

<skills>
### Conformidade com Skills Padrões

- **Frontend**: TypeScript
- **Testes**: Vitest
- **Package mgr**: bun
</skills>

<requirements>
- `ContratoPayload` em `contrato.ts` deve ter os 5 novos campos: `cliente_tipo`, `cliente_email`, `cliente_telefone`, `razao_social`, `nome_representante_legal`
- Os campos devem ser opcionais (`?`) para não quebrar usos existentes de `ContratoPayload`
- `result-page.tsx` não deve ter erros de TypeScript após a mudança
- `bun run build` no frontend deve passar sem erros
- `bun run test` existente deve continuar passando (sem regressões)
</requirements>

## Subtarefas

- [ ] 1.1 Ler `frontend/src/types/contrato.ts` atual
- [ ] 1.2 Adicionar os 5 campos como opcionais (`?string`) à interface `ContratoPayload`
- [ ] 1.3 Ler `frontend/src/pages/result-page.tsx` e verificar se `buildPayload` precisa incluir os novos campos
- [ ] 1.4 Executar `bun run build` no diretório `frontend` — sem erros TypeScript
- [ ] 1.5 Executar `bun run test` no diretório `frontend` — sem regressões

## Detalhes de Implementação

Consulte a seção **"Modelos de Dados"** da `techspec.md` para os 5 campos a adicionar.

Os campos devem ser adicionados como **opcionais** (`string | undefined`) para garantir retrocompatibilidade. A decisão de incluir esses campos no template do contrato PDF pertence a uma feature futura.

## Critérios de Sucesso

- `ContratoPayload` tem os 5 novos campos opcionais
- `bun run build` no frontend passa sem erros
- `bun run test` passa sem regressões

## Testes da Tarefa

- [ ] Testes de unidade: nenhum novo — verificar que os testes existentes passam sem regressão
- [ ] `bun run build` confirmado sem erros TypeScript
- [ ] Testes de integração: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/types/contrato.ts` — modificar (adicionar 5 campos)
- `frontend/src/pages/result-page.tsx` — ler e verificar (potencial impacto)
