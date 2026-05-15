# Tarefa 2.0: Service de Geração

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 1.0 Dados e Templates Estruturais

## Estimativa

- **Tamanho**: G
- **Horas estimadas**: 4-8h

## Visão Geral

Implementa o núcleo do motor de contratos: o service stateless que recebe o payload validado, mapeia os nomes de campos do formulário para os nomes de variáveis usados nos templates, compõe as 17 seções na ordem correta e retorna o HTML completo. Inclui a instalação do Zod (necessária também na Task 3.0) e os testes unitários do service.

<skills>
### Conformidade com Skills Padrões

- **code-standards**: funções começam com verbo (`generateHtml`, `buildVariableMap`, `getPackages`), sem flag params, sem mais de 3 parâmetros, early returns para validação, sem linhas em branco dentro de funções, métodos com menos de 50 linhas.
- **logging**: sem log em operações normais; `console.error('Contract generation failed', { error })` apenas em exceções inesperadas do service; **nunca logar campos do payload** (contém dados pessoais).
</skills>

<requirements>
- Instalar Zod como dependência de produção em `backend/`: `bun add zod`.
- `contratos-service.ts` deve exportar: a interface `ContratoPayload`, o tipo `VariableMap`, e as funções `buildVariableMap`, `generateHtml` e `getPackages`.
- `buildVariableMap(payload)` converte campos do formulário para nomes de variáveis do template conforme a tabela de mapeamento na techspec (ex: `cliente_nome` → `nome_contratante`, `escopo_servicos` → `etapas_servico`). O campo `estado_foro` deve ser sempre `"Distrito Federal"` (derivado, não recebe do payload).
- `generateHtml(payload)` compõe as 17 seções na ordem exata definida na techspec, usando `buildVariableMap` internamente. Substitui variáveis via `String.replace` com regex global `/\{\{variavel\}\}/g`.
- A seção de Serviços Adicionais (seção 6) só é incluída no HTML se `payload.servicos_adicionais` estiver presente.
- As cláusulas opcionais (seção 10) são incluídas na ordem em que aparecem na Biblioteca de Cláusulas, não na ordem do payload. Use `listClausulas({ obrigatoria: false })` para determinar a ordem, filtrando pelos slugs de `payload.clausulas_opcionais`.
- Se algum slug em `clausulas_opcionais` não existir na biblioteca, `generateHtml` deve lançar um erro com a mensagem `"Cláusula não encontrada: <slug>"`.
- `getPackages()` lê `pacotes.json` e retorna o array de pacotes tipado.
- O output de `generateHtml` não pode conter nenhuma ocorrência de `{{` (todas as variáveis devem ser substituídas).
- `variaveis_opcionais` do payload deve ser mesclado ao `VariableMap` antes de substituir variáveis nas cláusulas opcionais.
</requirements>

## Subtarefas

- [ ] 2.1 Executar `bun add zod` em `backend/` para instalar a dependência
- [ ] 2.2 Criar `backend/src/services/contratos-service.ts` com a interface `ContratoPayload`, o tipo `VariableMap` e a função `buildVariableMap`
- [ ] 2.3 Implementar `generateHtml(payload)` com a composição das 17 seções e substituição de variáveis
- [ ] 2.4 Implementar `getPackages()` que retorna os dados de `pacotes.json` tipados como `Pacote[]`
- [ ] 2.5 Criar `backend/src/services/contratos-service.test.ts` com os testes unitários listados abaixo
- [ ] 2.6 Executar `bun run test` em `backend/` e confirmar que todos os testes passam

## Detalhes de Implementação

Consulte as seções **Interfaces Principais**, **Modelos de Dados**, **Mapper** (tabela de mapeamento) e **Composição das 17 Seções** em `techspec.md`.

A função auxiliar interna `renderClause(slug, variableMap)` recupera o texto da cláusula via `findClausulaBySlug`, substitui as variáveis e envolve em HTML semântico:
```html
<section>
  <h2>Título da Cláusula</h2>
  <p>Texto com variáveis já substituídas.</p>
</section>
```

Para as cláusulas opcionais, ordene pelos slugs retornados por `listClausulas({ obrigatoria: false })` intersectados com `payload.clausulas_opcionais`. Isso garante que a ordem seja sempre a da biblioteca, independente da ordem enviada pelo frontend.

## Critérios de Sucesso

- `generateHtml` com payload completo retorna HTML com as 10 cláusulas obrigatórias
- `generateHtml` sem `servicos_adicionais` → seção condicional ausente no output
- `generateHtml` com `servicos_adicionais` → seção condicional presente
- `generateHtml` com payload válido → zero ocorrências de `{{` no output
- `buildVariableMap` mapeia corretamente `cliente_nome` → `nome_contratante`
- `getPackages` retorna array com 5 itens
- `bun run test` em `backend/` → todos os testes passam

## Testes da Tarefa

- [ ] `generateHtml` com payload completo → HTML contém as 10 cláusulas obrigatórias (verificar pelo menos 3 slugs no output)
- [ ] `generateHtml` sem `servicos_adicionais` → string resultante não contém a seção de serviços adicionais
- [ ] `generateHtml` com `servicos_adicionais` → string resultante contém o texto de serviços adicionais
- [ ] `generateHtml` com payload válido → `output.includes('{{')` é `false`
- [ ] `buildVariableMap({ cliente_nome: 'João', ... })` → `map['nome_contratante'] === 'João'`
- [ ] `buildVariableMap` → `map['estado_foro'] === 'Distrito Federal'` (derivado automático)
- [ ] `generateHtml` com cláusula opcional válida → HTML contém o título da cláusula
- [ ] `generateHtml` com slug opcional inválido → lança erro com mensagem contendo o slug
- [ ] `getPackages` → retorna array com length 5, cada item com `id`, `label`, `escopo_padrao`, `numero_revisoes_sugerido`, `entregaveis`

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos Relevantes

- `backend/src/services/contratos-service.ts` (novo)
- `backend/src/services/contratos-service.test.ts` (novo)
- `backend/package.json` (modificado — adiciona `zod`)
- `backend/src/data/pacotes.json` (leitura — criado na Task 1.0)
- `backend/src/templates/contrato.ts` (leitura — criado na Task 1.0)
- `backend/src/services/clausulas-service.ts` (leitura — existente)
