# Tarefa 1.0: Backend — Metadados de Variáveis nas Cláusulas

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- Nenhuma

## Estimativa

- **Tamanho**: P
- **Horas estimadas**: < 2h

## Visão Geral

Adicionar o campo `variaveis: ClausulaVariavel[]` a todas as 10 cláusulas opcionais em `clausulas.json` e atualizar a interface `Clausula` no `clausulas-service.ts`. Isso expõe os metadados de variáveis via `GET /api/clausulas?obrigatoria=false` sem nenhuma alteração de rota ou lógica de negócio.

<skills>
### Conformidade com Skills Padrões

- Node.js + Hono + TypeScript: adição de interface TypeScript e dados JSON
- Vitest: atualização dos testes do service se existirem
- bun: executar `bun run test` e `bun run build` para validação
</skills>

<requirements>
- Interface `ClausulaVariavel { slug: string; label: string }` adicionada em `clausulas-service.ts`
- Interface `Clausula` em `clausulas-service.ts` atualizada com `variaveis: ClausulaVariavel[]`
- Todas as 10 cláusulas opcionais em `clausulas.json` recebem `"variaveis": [...]` com objetos `{slug, label}` correspondendo aos placeholders `{{slug}}` do campo `texto`
- Cláusulas sem variáveis (se houver) recebem `"variaveis": []`
- `listClausulas` e `findClausulaBySlug` retornam o campo `variaveis` automaticamente (sem alteração de lógica)
</requirements>

## Subtarefas

- [ ] 1.1 Atualizar `backend/src/services/clausulas-service.ts`: adicionar interface `ClausulaVariavel` e campo `variaveis: ClausulaVariavel[]` à interface `Clausula`
- [ ] 1.2 Atualizar `backend/src/data/clausulas.json`: adicionar `"variaveis": [...]` a cada uma das 10 cláusulas opcionais (c-011 a c-020) com labels amigáveis em português
- [ ] 1.3 Executar `bun run test` e `bun run build` na raiz e verificar 100% de aprovação

## Detalhes de Implementação

Consultar `techspec.md` desta pasta — seções **Interfaces Principais** e **Modelos de Dados**.

**Mapeamento de variáveis por cláusula** (extraído do `texto` de cada cláusula):

| Cláusula | Variáveis |
|---|---|
| `direitos-autorais-ampliados` | `usos_adicionais` → "Usos adicionais permitidos", `valor_direitos_ampliados` → "Valor da remuneração adicional" |
| `exclusividade-arquiteto` | `segmento_exclusividade` → "Segmento de exclusividade", `prazo_exclusividade` → "Prazo de exclusividade (meses)" |
| `numero-maximo-revisoes` | `numero_revisoes` → "Número de revisões inclusas", `valor_revisao_adicional` → "Valor por revisão adicional" |
| `visitas-extras-cobradas` | `numero_visitas_inclusas` → "Número de visitas inclusas", `valor_visita_extra` → "Valor por visita extra" |
| `reajuste-honorarios` | `indice_reajuste` → "Índice de reajuste", `periodo_reajuste` → "Período de referência do reajuste" |
| `alteracao-escopo-termo-aditivo` | `conteudo_termo_aditivo` → "Conteúdo a especificar no Termo Aditivo" |
| `repeticao-servicos` | `percentual_repeticao` → "Percentual cobrado pela repetição (%)" |
| `suspensao-projeto` | `prazo_suspensao` → "Prazo máximo de suspensão (dias)" |
| `multa-cancelamento` | `percentual_multa_cancelamento` → "Percentual da multa por cancelamento (%)" |
| `autorizacao-uso-imagens` | `meios_divulgacao` → "Meios de divulgação autorizados" |

## Critérios de Sucesso

- `GET /api/clausulas?obrigatoria=false` retorna cada cláusula com campo `variaveis` populado
- TypeScript compila sem erros (`bun run build`)
- Nenhum teste existente quebrado

## Testes da Tarefa

- [ ] Verificação manual: `GET /api/clausulas?obrigatoria=false` retorna `variaveis` em cada cláusula opcional
- [ ] Se houver testes de `clausulas-service.ts`: atualizar snapshot/assertions para incluir o campo `variaveis`
- [ ] `bun run build` sem erros de tipo

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `backend/src/data/clausulas.json` (modificar — adicionar `variaveis`)
- `backend/src/services/clausulas-service.ts` (modificar — interface `ClausulaVariavel` + `Clausula`)
- `backend/src/routes/clausulas.ts` (referência — sem alteração)
