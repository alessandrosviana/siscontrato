# Tarefa 1.0: Camada de Dados

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- Nenhuma

## Estimativa

- **Tamanho**: M
- **Horas estimadas**: 2-4h

## Visão Geral

Cria a fonte de dados estática da biblioteca de cláusulas e o service que a expõe para o resto do backend. Ao final desta task, é possível listar e buscar cláusulas por código TypeScript — sem camada HTTP ainda. O resultado desta task é o que a Task 2.0 consome para construir os endpoints.

<skills>
### Conformidade com Skills Padrões

- **code-standards**: funções começam com verbo (`listClausulas`, `findClausulaBySlug`), sem flag params (objeto `ClausulaFilters`), código em inglês, kebab-case para arquivos.
- **logging**: nenhum log em operações normais; `console.error` com objeto estruturado apenas se o JSON falhar no import.
</skills>

<requirements>
- O arquivo `backend/src/data/clausulas.json` deve conter exatamente 20 cláusulas: 10 com `obrigatoria: true` e 10 com `obrigatoria: false`.
- Cada cláusula deve ter os campos: `id` (string única), `slug` (kebab-case único), `titulo`, `categoria`, `texto` (com marcações `{{variavel}}`), `obrigatoria` (boolean) e `versao` (ex: `"1.0.0"`).
- Os slugs obrigatórios são: `identificacao-das-partes`, `objeto-do-contrato`, `escopo-dos-servicos`, `prazos`, `honorarios-e-pagamento`, `direitos-autorais`, `responsabilidades-das-partes`, `alteracoes-de-escopo`, `rescisao-contratual`, `foro`.
- Os slugs opcionais são: `direitos-autorais-ampliados`, `exclusividade-arquiteto`, `numero-maximo-revisoes`, `visitas-extras-cobradas`, `reajuste-honorarios`, `alteracao-escopo-termo-aditivo`, `repeticao-servicos`, `suspensao-projeto`, `multa-cancelamento`, `autorizacao-uso-imagens`.
- `listClausulas(filters)` deve retornar todas as cláusulas quando `filters` estiver vazio, e aplicar filtro cumulativo (AND) quando `obrigatoria` e/ou `categoria` forem informados.
- `findClausulaBySlug(slug)` deve retornar o objeto `Clausula` quando encontrado, ou `undefined` quando não.
- Slugs devem ser únicos — o teste deve falhar se houver duplicata.
</requirements>

## Subtarefas

- [ ] 1.1 Criar `backend/src/data/clausulas.json` com as 10 cláusulas obrigatórias (campos completos, incluindo `texto` com pelo menos uma `{{variavel}}` em cada)
- [ ] 1.2 Adicionar as 10 cláusulas opcionais ao `clausulas.json`
- [ ] 1.3 Criar `backend/src/services/clausulas-service.ts` com a interface `Clausula`, a interface `ClausulaFilters`, a função `listClausulas` e a função `findClausulaBySlug`
- [ ] 1.4 Criar `backend/src/services/clausulas-service.test.ts` com os testes listados abaixo

## Detalhes de Implementação

Consulte as seções **Modelos de Dados**, **Interfaces Principais** e **Sequenciamento de Desenvolvimento (passos 1 e 2)** em `techspec.md`.

A tabela de categorias em `techspec.md` define qual `categoria` usar em cada slug — use-a como referência ao preencher o JSON.

## Critérios de Sucesso

- `bun run test` em `backend/` passa todos os testes (incluindo os novos de service)
- `listClausulas({})` retorna exatamente 20 itens
- `listClausulas({ obrigatoria: true })` retorna exatamente 10 itens
- `listClausulas({ obrigatoria: false })` retorna exatamente 10 itens
- `findClausulaBySlug('foro')` retorna o objeto com `slug: "foro"`
- `findClausulaBySlug('nao-existe')` retorna `undefined`
- Todos os 20 slugs são únicos (teste de unicidade)

## Testes da Tarefa

- [ ] `listClausulas({})` → 20 itens
- [ ] `listClausulas({ obrigatoria: true })` → 10 itens, todos com `obrigatoria === true`
- [ ] `listClausulas({ obrigatoria: false })` → 10 itens, todos com `obrigatoria === false`
- [ ] `listClausulas({ categoria: 'honorarios' })` → todos os itens com `categoria === 'honorarios'`
- [ ] `listClausulas({ obrigatoria: true, categoria: 'juridico' })` → apenas `foro` (filtro AND)
- [ ] `findClausulaBySlug('foro')` → objeto com `slug: "foro"`
- [ ] `findClausulaBySlug('nao-existe')` → `undefined`
- [ ] Unicidade de slugs: `new Set(clausulas.map(c => c.slug)).size === clausulas.length`

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos Relevantes

- `backend/src/data/clausulas.json` (novo)
- `backend/src/services/clausulas-service.ts` (novo)
- `backend/src/services/clausulas-service.test.ts` (novo)
