# Tarefa 1.0: Dados e Templates Estruturais

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- Nenhuma

## Estimativa

- **Tamanho**: M
- **Horas estimadas**: 2-4h

## Visão Geral

Cria as duas fontes de dados estáticas que o service de geração (Task 2.0) vai consumir: o JSON com os 5 pacotes de serviço e o módulo TypeScript com os templates HTML das seções estruturais do contrato (header, disclaimer, serviços adicionais, assinaturas e footer). Ao final desta task, o projeto tem todos os dados e templates prontos para serem usados na composição do HTML.

<skills>
### Conformidade com Skills Padrões

- **code-standards**: funções começam com verbo, kebab-case nos arquivos, sem comentários óbvios, sem magic strings sem constante nomeada.
- **logging**: nenhum log nesta task (dados estáticos, sem fluxo de execução dinâmico).
</skills>

<requirements>
- `backend/src/data/pacotes.json` deve conter exatamente 5 pacotes, cada um com os campos: `id` (slug kebab-case), `label` (nome para exibição), `escopo_padrao` (texto inicial do escopo), `numero_revisoes_sugerido` (number) e `entregaveis` (array de strings).
- Os 5 pacotes obrigatórios são: `projeto-arquitetura`, `projeto-arquitetura-interiores`, `projeto-acompanhamento-obra`, `reforma`, `reforma-interiores`.
- `backend/src/templates/contrato.ts` deve exportar funções que retornam strings HTML para cada seção estrutural: `templateHeader`, `templateDisclaimer`, `templateServicosAdicionais`, `templateAssinaturas`, `templateFooter`.
- As funções de template que precisam de dados do contrato recebem o `VariableMap` como parâmetro e usam os valores diretamente (ex: `templateHeader` pode usar `arquiteto_nome`).
- `templateServicosAdicionais` só é chamada quando `servicos_adicionais` está no payload — ela recebe o texto dos serviços como parâmetro e retorna o HTML da seção.
- O HTML de cada seção deve usar semântica adequada: `<section>`, `<h1>` para o header, `<h2>` para títulos de seções, `<p>` para parágrafos.
- O header deve incluir o título "CONTRATO DE PRESTAÇÃO DE SERVIÇOS PROFISSIONAIS DE ARQUITETURA" e a identificação "Modelo Orientativo CAU/DF".
- O footer deve incluir o texto "© CAU/DF — Este é um modelo orientativo. Recomenda-se assessoria jurídica para contratos específicos."
- O disclaimer deve mencionar que o documento é um modelo orientativo do CAU/DF e não substitui assessoria jurídica especializada.
</requirements>

## Subtarefas

- [ ] 1.1 Criar `backend/src/data/pacotes.json` com os 5 pacotes e seus campos completos (`id`, `label`, `escopo_padrao`, `numero_revisoes_sugerido`, `entregaveis`)
- [ ] 1.2 Criar `backend/src/templates/contrato.ts` exportando as 5 funções de template HTML (`templateHeader`, `templateDisclaimer`, `templateServicosAdicionais`, `templateAssinaturas`, `templateFooter`)

## Detalhes de Implementação

Consulte as seções **Modelos de Dados** (estrutura de `Pacote`) e **Composição das 17 Seções** em `techspec.md` para entender quais dados cada template precisa receber.

O `templateAssinaturas` deve incluir campos de assinatura para ambas as partes (CONTRATANTE e CONTRATADO) com linha de assinatura, nome e data.

Os `entregaveis` de cada pacote devem ser realistas para o contexto de arquitetura:
- **projeto-arquitetura**: plantas baixas, cortes, fachadas, memorial descritivo
- **projeto-arquitetura-interiores**: projeto de layout, projeto de iluminação, especificação de materiais, perspectivas 3D
- **projeto-acompanhamento-obra**: projeto executivo, visitas técnicas semanais, relatórios de obra
- **reforma**: levantamento do existente, projeto de reforma, especificações técnicas
- **reforma-interiores**: projeto de layout, detalhamento de marcenaria, especificação de acabamentos

## Critérios de Sucesso

- `pacotes.json` contém exatamente 5 objetos, todos com os 5 campos obrigatórios preenchidos
- `contrato.ts` exporta exatamente 5 funções nomeadas com verbos
- O HTML de cada template é semanticamente correto (validação visual ou manual)
- Nenhum erro de TypeScript (`bun run build` em `backend/`)

## Testes da Tarefa

Não há testes automatizados nesta task (dados estáticos e templates). A cobertura virá implicitamente nos testes da Task 2.0, que vai importar e usar esses módulos. Verificar manualmente:

- [ ] `pacotes.json` tem 5 itens com todos os campos
- [ ] `contrato.ts` compila sem erros (`bun run build`)
- [ ] Cada função de template retorna uma string HTML não vazia

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos Relevantes

- `backend/src/data/pacotes.json` (novo)
- `backend/src/templates/contrato.ts` (novo — substitui o `.gitkeep` existente na pasta)
