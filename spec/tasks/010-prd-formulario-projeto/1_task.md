# Tarefa 1.0: ContratoPayload — Ajustar campos do projeto em contrato.ts

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- Nenhuma

## Estimativa

- **Tamanho**: P
- **Horas estimadas**: < 2h

## Visão Geral

Fazer dois ajustes na interface `ContratoPayload` em `frontend/src/types/contrato.ts`:
1. Adicionar o campo `tipo_contrato?: string` (opcional para manter compatibilidade com usos existentes)
2. Tornar `area_projeto` opcional: mudar de `area_projeto: string` para `area_projeto?: string` (o campo é opcional no formulário do projeto)

Em seguida, verificar se `frontend/src/pages/result-page.tsx` tem algum uso direto de `area_projeto` que possa ser afetado pela mudança para opcional. Garantir que o build e os testes passam.

<skills>
### Conformidade com Skills Padrões

- **Frontend**: TypeScript
- **Testes**: Vitest
- **Package mgr**: bun
</skills>

<requirements>
- `ContratoPayload` em `contrato.ts` deve ter `tipo_contrato?: string` adicionado
- `area_projeto` deve ser alterado de `string` para `string | undefined` (campo opcional com `?`)
- `result-page.tsx` não deve ter erros de TypeScript após a mudança
- `bun run build` no frontend deve passar sem erros
- `bun run test` existente deve continuar passando (sem regressões)
</requirements>

## Subtarefas

- [ ] 1.1 Ler `frontend/src/types/contrato.ts` atual e entender a estrutura
- [ ] 1.2 Adicionar `tipo_contrato?: string` à interface `ContratoPayload`
- [ ] 1.3 Mudar `area_projeto: string` para `area_projeto?: string` na interface
- [ ] 1.4 Ler `frontend/src/pages/result-page.tsx` e verificar se `area_projeto` é referenciado diretamente
- [ ] 1.5 Executar `bun run build` no diretório `frontend` — sem erros TypeScript
- [ ] 1.6 Executar `bun run test` no diretório `frontend` — sem regressões

## Detalhes de Implementação

Consulte a seção **"Modelos de Dados"** da `techspec.md` para o posicionamento dos campos na interface.

**Posicionamento sugerido na interface:** adicionar `tipo_contrato?: string` na mesma seção dos outros campos opcionais do projeto (junto de `area_projeto`). Ao tornar `area_projeto` opcional, adicione `?` ao campo.

**Atenção:** `area_projeto` atualmente é `string` obrigatório em `ContratoPayload`. Torná-lo opcional (`string | undefined`) pode causar erros de TypeScript em locais que esperam sempre um valor. Verifique `result-page.tsx` antes de concluir.

## Critérios de Sucesso

- `ContratoPayload` tem `tipo_contrato?: string` adicionado
- `ContratoPayload` tem `area_projeto?: string` (opcional)
- `bun run build` no frontend passa sem erros
- `bun run test` passa sem regressões

## Testes da Tarefa

- [ ] Testes de unidade: nenhum novo — verificar que os testes existentes passam sem regressão
- [ ] `bun run build` confirmado sem erros TypeScript
- [ ] Testes de integração: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/types/contrato.ts` — modificar
- `frontend/src/pages/result-page.tsx` — ler e verificar (potencial impacto de area_projeto opcional)
