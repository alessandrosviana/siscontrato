# Relatório de Code Review - Task 1.0 — ContratoPayload (Feature 010)

## Resumo

- Data: 2026-05-20
- Branch: 010-prd-formulario-projeto
- Status: APROVADO COM RESSALVAS
- Arquivos Modificados: 1
- Linhas Adicionadas: 2
- Linhas Removidas: 1

## Conformidade com Rules

| Rule | Status | Observações |
|------|--------|-------------|
| Código em inglês | OK | Todos os identificadores estão em inglês |
| Nomenclatura camelCase/PascalCase | OK | Interface `ContratoPayload` em PascalCase, campos em snake_case conforme padrão do payload |
| Sem magic numbers | OK | Não aplicável — alteração de interface |
| Funções com verbo | OK | Não aplicável — alteração de interface |
| Sem parâmetros flag | OK | Não aplicável |
| Tratamento de erros | OK | Não aplicável — alteração de interface |
| Logging | OK | Não aplicável |
| Ausência de comentários desnecessários | OK | Nenhum comentário adicionado |
| Variáveis declaradas uma por linha | OK | Campos na interface seguem uma declaração por linha |

## Verificação de Segurança

| Item | Status | Observações |
|------|--------|-------------|
| Validação de inputs | N/A | Alteração exclusiva de interface TypeScript — sem lógica de runtime |
| Endpoints protegidos | N/A | Sem endpoints |
| CORS | N/A | Sem endpoints |
| Secrets hardcoded | OK | Nenhum secret introduzido |
| Stack traces para o cliente | N/A | Sem lógica de servidor |
| HTML não sanitizado | N/A | Sem renderização HTML |
| Queries parametrizadas | N/A | Sem acesso a banco de dados |
| Rate limiting | N/A | Sem endpoints sensíveis |
| Headers de segurança | N/A | Sem servidor HTTP |
| Dados sensíveis em logs | N/A | Sem logs |

## Aderência à TechSpec

| Decisão Técnica | Implementado | Observações |
|-----------------|--------------|-------------|
| Adicionar `tipo_contrato?: string` em `ContratoPayload` | SIM | Campo presente na linha 10 do arquivo |
| Tornar `area_projeto` opcional (`area_projeto?: string`) | SIM | Campo alterado de `string` para `string \| undefined` com `?` |
| Verificar impacto em `result-page.tsx` | SIM | `buildPayload` usa spread genérico com `as ContratoPayload` — sem acesso direto a `area_projeto`; nenhum erro de TypeScript gerado |
| `bun run build` sem erros TypeScript | SIM | Build passou sem erros (38 módulos transformados) |
| `bun run test` sem regressões | SIM | 119/119 testes passando, 9/9 arquivos de teste |
| Posicionamento junto dos campos opcionais do projeto | PARCIAL | `tipo_contrato?` foi inserido entre `tipo_projeto` e `endereco_projeto` (agrupamento semântico correto), não ao final da interface junto dos opcionais. A TechSpec sugeria o agrupamento "na mesma seção dos outros campos opcionais" |

## Tasks Verificadas

| Task | Status | Observações |
|------|--------|-------------|
| 1.1 — Ler `contrato.ts` e entender a estrutura | COMPLETA | Evidenciado pela corretude das alterações |
| 1.2 — Adicionar `tipo_contrato?: string` | COMPLETA | Campo presente e tipado corretamente |
| 1.3 — Mudar `area_projeto: string` para `area_projeto?: string` | COMPLETA | Campo alterado conforme especificado |
| 1.4 — Ler `result-page.tsx` e verificar impacto de `area_projeto` | COMPLETA | `buildPayload` usa spread genérico; nenhum acesso direto ao campo |
| 1.5 — `bun run build` sem erros TypeScript | COMPLETA | Confirmado: build passou com sucesso |
| 1.6 — `bun run test` sem regressões | COMPLETA | Confirmado: 119 testes passando |

## Testes

- Total de Testes: 119
- Passando: 119
- Falhando: 0
- Coverage: Não medido (Vitest sem configuração de coverage explícita)

Conforme definido na task: "Testes de unidade: nenhum novo — verificar que os testes existentes passam sem regressão". O critério foi atendido.

## Problemas Encontrados

| Severidade | Arquivo | Linha | Descrição | Sugestão |
|------------|---------|-------|-----------|----------|
| Baixa | `frontend/src/types/contrato.ts` | 10 | `tipo_contrato?` foi inserido entre campos obrigatórios (`tipo_projeto` e `endereco_projeto`), quebrando a convenção visual implícita da interface onde campos opcionais estão agrupados no final. A TechSpec indicava posicionamento "junto de `area_projeto`" (que fica na linha 12). | Mover `tipo_contrato?: string` para logo antes ou logo após `area_projeto?: string`, mantendo o agrupamento dos campos opcionais de projeto juntos e separados dos obrigatórios. |
| Baixa | `backend/src/routes/contratos.ts` | 15 | O schema Zod do backend ainda define `area_projeto: z.string().min(1)` como obrigatório, enquanto o frontend passou a tratá-lo como opcional. Quando `area_projeto` não for preenchido pelo usuário, o frontend enviará o campo ausente (ou string vazia), o que resultará em erro de validação 400 no backend. Este é um risco latente que se tornará real na Task 2.0. | Tornar `area_projeto` opcional no schema Zod do backend (`z.string().optional()`) e tratar o campo como opcional na interface `ContratoPayload` do backend (`contratos-service.ts`). Esta correção deve ser incluída na Task 2.0 ou como task separada antes do merge. |

## Pontos Positivos

- Mudança cirúrgica e mínima: apenas 3 linhas alteradas no único arquivo especificado
- A retrocompatibilidade foi preservada — campos opcionais em TypeScript não quebram usos existentes que já forneciam o valor
- O `result-page.tsx` usa spread genérico com type cast, o que isola completamente o componente de mudanças na interface `ContratoPayload`, confirmando a decisão arquitetural documentada na TechSpec
- O teste em `download-pdf-button.test.tsx` que usa `area_projeto: '120m²'` continua válido e compilando — TypeScript aceita atribuição de valor a campo opcional
- Build e testes executados e confirmados pelo implementador antes da entrega
- Commit message claro e com contexto adequado (parte do commit 62b785a da feature 009, que também estendia `ContratoPayload`)

## Recomendações

1. **Alta prioridade — backend desalinhado**: A Task 2.0 ou uma task complementar deve atualizar `ContratoPayload` do backend (`contratos-service.ts`) e o schema Zod (`contratos.ts`) para tornar `area_projeto` e `tipo_contrato` opcionais, alinhando backend e frontend. Do contrário, a geração de PDF falhará com erro 400 quando o usuário não preencher `area_projeto`.

2. **Baixa prioridade — organização da interface**: Considerar mover `tipo_contrato?` para ficar agrupado com `area_projeto?` no arquivo `contrato.ts`, separando visualmente os campos obrigatórios dos opcionais.

## Conclusão

A implementação da Task 1.0 atende todos os critérios de sucesso definidos na task e na TechSpec: `tipo_contrato?: string` foi adicionado, `area_projeto` foi tornado opcional, `result-page.tsx` não apresenta erros TypeScript, build passa sem erros e todos os 119 testes continuam passando.

O status **APROVADO COM RESSALVAS** se deve à identificação de um risco latente no backend (não escopo desta task, mas relevante para o fluxo completo da feature): o schema Zod do backend ainda exige `area_projeto` como obrigatório, o que causará erros de runtime na Task 2.0 quando o campo não for preenchido pelo usuário. Esta ressalva não bloqueia a aprovação da Task 1.0, pois está fora de seu escopo, mas deve ser endereçada antes do merge final da feature 010.
