# Tarefa 2.0: ContratoPayload — Estender contrato.ts com 4 campos novos

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- Nenhuma

## Estimativa

- **Tamanho**: P
- **Horas estimadas**: < 2h

## Visão Geral

Adicionar os campos `arquiteto_cpf`, `arquiteto_cnpj`, `arquiteto_email` e `arquiteto_telefone` à interface `ContratoPayload` em `frontend/src/types/contrato.ts`. Verificar se `frontend/src/pages/result-page.tsx` (que usa `ContratoPayload` para montar o payload do PDF) precisa ser atualizado para lidar com os novos campos opcionais. Garantir que o build não quebra.

<skills>
### Conformidade com Skills Padrões

- **Frontend**: TypeScript
- **Testes**: Vitest
- **Package mgr**: bun
</skills>

<requirements>
- `ContratoPayload` em `contrato.ts` deve ter os 4 novos campos: `arquiteto_cpf`, `arquiteto_cnpj`, `arquiteto_email`, `arquiteto_telefone`
- Os campos devem ser opcionais (`?`) para não quebrar usos existentes de `ContratoPayload` no código atual
- `result-page.tsx` não deve ter erros de TypeScript após a mudança
- `bun run build` no frontend deve passar sem erros
- `bun run test` existente deve continuar passando (sem regressões)
</requirements>

## Subtarefas

- [ ] 2.1 Ler `frontend/src/types/contrato.ts` atual
- [ ] 2.2 Adicionar os 4 campos como opcionais à interface `ContratoPayload`
- [ ] 2.3 Ler `frontend/src/pages/result-page.tsx` e verificar se `buildPayload` precisa incluir os novos campos
- [ ] 2.4 Executar `bun run build` no diretório `frontend` — sem erros TypeScript
- [ ] 2.5 Executar `bun run test` no diretório `frontend` — sem regressões

## Detalhes de Implementação

Consulte a seção **"Modelos de Dados"** da `techspec.md` para os 4 campos a adicionar.

Os campos devem ser adicionados como **opcionais** (`string | undefined`) para garantir retrocompatibilidade — o `result-page.tsx` já usa `ContratoPayload` para gerar o PDF e não pode ser quebrado. A decisão de tornar os campos obrigatórios no payload pertence à feature que integrar esses dados ao template do contrato.

## Critérios de Sucesso

- `ContratoPayload` tem os 4 novos campos
- `bun run build` no frontend passa sem erros
- `bun run test` passa sem regressões

## Testes da Tarefa

- [ ] Testes de unidade: nenhum novo — verificar que os testes existentes passam sem regressão
- [ ] `bun run build` confirmado sem erros TypeScript
- [ ] Testes de integração: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/types/contrato.ts` — modificar (adicionar 4 campos)
- `frontend/src/pages/result-page.tsx` — ler e verificar (potencial impacto)
