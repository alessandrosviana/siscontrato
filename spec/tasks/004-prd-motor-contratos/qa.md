# Relatório de QA — Motor de Geração de Contratos (004-prd-motor-contratos)

## Resumo

- **Data:** 2026-05-15
- **Status:** REPROVADO
- **Total de Requisitos:** 10 (RF-01 a RF-10)
- **Requisitos Atendidos:** 9
- **Requisitos com ressalva:** 1 (RF-04)
- **Bugs Encontrados:** 2 (1 Alta, 1 Baixa)
- **Testes Automatizados:** 49 passando, 0 falhando

## Requisitos Verificados

| ID | Requisito | Status | Evidência |
|----|-----------|--------|-----------|
| RF-01 | `POST /api/contratos/preview` → `{ html: string }` 200 | PASSOU | Teste HTTP confirmado; contratosRouter registrado em index.ts via `app.route('/api', contratosRouter)` |
| RF-02 | `POST /api/contratos/gerar` → `{ html: string }` 200 | PASSOU | Teste HTTP confirmado; endpoint implementado com mesma lógica do preview |
| RF-03 | `GET /api/contratos/pacotes` → lista de 5 pacotes | PASSOU | Retorna array com 5 itens; IDs: projeto-arquitetura, projeto-arquitetura-interiores, projeto-acompanhamento-obra, reforma, reforma-interiores |
| RF-04 | 16 variáveis substituídas corretamente no HTML | FALHOU (parcial) | 14 variáveis obrigatórias mapeadas corretamente + `estado_foro` derivado. Bug BUG-001: cláusulas opcionais com variáveis próprias não substituídas quando `variaveis_opcionais` ausente/incompleto |
| RF-05 | Payload inválido → 400 com campo identificado | PASSOU | Campo ausente retorna 400; `body.error` é string com JSON Zod identificando o campo faltante e o caminho (`path: ["cliente_nome"]`) |
| RF-06 | 17 seções na ordem correta | PASSOU | 14 seções base (sem serviços adicionais e sem opcionais); seção 9 (Forma de pagamento) unificada com seção 8 conforme documentado na TechSpec (`(incluído na cláusula 8)`); ordem validada programaticamente |
| RF-07 | Seção serviços adicionais ausente quando não fornecida | PASSOU | Sem `servicos_adicionais` no payload: `id="servicos-adicionais"` ausente no HTML; com o campo: seção presente antes de "Prazos" |
| RF-08 | 5 pacotes com pré-preenchimentos | PASSOU | Todos os 5 pacotes do MVP presentes com `id`, `label`, `escopo_padrao`, `numero_revisoes_sugerido`, `entregaveis` |
| RF-09 | Cláusulas obrigatórias presentes no HTML | PASSOU | Todas as 10 cláusulas obrigatórias confirmadas: Identificação das Partes, Objeto do Contrato, Escopo dos Serviços, Prazos, Honorários e Forma de Pagamento, Direitos Autorais, Responsabilidades das Partes, Alterações de Escopo, Rescisão Contratual, Foro |
| RF-10 | Cláusulas opcionais na ordem da biblioteca | PASSOU | Teste com dois slugs em ordem invertida (`['numero-maximo-revisoes', 'direitos-autorais-ampliados']`) confirmou que a saída respeita a ordem da biblioteca (c-011 antes de c-013) |

## Testes E2E Executados

> Esta feature é backend puro — sem UI. Testes foram executados via Vitest (unit + integração HTTP) conforme definido na TechSpec.

| Fluxo | Resultado | Observações |
|-------|-----------|-------------|
| `POST /api/contratos/preview` com payload válido | PASSOU | Status 200, `body.html` string não vazia, Content-Type application/json |
| `POST /api/contratos/preview` sem campo obrigatório (`cliente_nome`) | PASSOU | Status 400, `body.error` identificando campo via Zod |
| `POST /api/contratos/gerar` com payload válido | PASSOU | Status 200, `body.html` string não vazia |
| `GET /api/contratos/pacotes` | PASSOU | Status 200, array com 5 itens |
| `POST /api/contratos/preview` com slug opcional inválido | PASSOU | Status 400 |
| `generateHtml` sem `servicos_adicionais` | PASSOU | Seção condicional ausente no HTML |
| `generateHtml` com `servicos_adicionais` | PASSOU | Seção condicional presente e posicionada antes de "Prazos" |
| `generateHtml` → zero `{{` no output (payload completo) | PASSOU | Nenhum placeholder restante com payload válido completo |
| `buildVariableMap` → `cliente_nome` para `nome_contratante` | PASSOU | Mapeamento correto |
| `buildVariableMap` → `estado_foro` sempre "Distrito Federal" | PASSOU | Valor derivado hardcoded conforme decisão técnica |
| `getPackages` → 5 pacotes com campos obrigatórios | PASSOU | Todos os campos presentes |
| Cláusula opcional selecionada → slug presente no HTML | PASSOU | Teste com `numero-maximo-revisoes` |
| Slug inexistente lança erro identificado | PASSOU | `throw new Error('Cláusula não encontrada: slug-inexistente')` |
| Ordem das cláusulas opcionais respeita biblioteca | PASSOU | Inversão no payload corrigida na saída |
| Cláusula opcional sem `variaveis_opcionais` | FALHOU | BUG-001: `{{valor_revisao_adicional}}` permanece no HTML |

## Performance

- **Bundle size:** N/A — backend Node.js, sem bundle de frontend
- **Build (tsc --noEmit):** Sucesso, zero erros TypeScript (exit code 0)
- **Tempo de testes:** 90–113ms para 49 testes em 5 arquivos (referência de velocidade)
- **Anti-patterns encontrados:**
  - Sem queries N+1 (processamento em memória, sem banco)
  - Sem operações bloqueantes no event loop
  - Stateless — seguro para escala horizontal

## Vulnerabilidades

- **Auditoria executada:** Sim (`bun audit`)
- **Vulnerabilidades encontradas:** Nenhuma
- **Comando:** `bun audit` → "No vulnerabilities found"
- **Dependências de produção:** `hono@^4.6.0`, `zod@^4.4.3`

## Acessibilidade

> Feature é backend puro — sem UI. Verificações de acessibilidade aplicam-se ao HTML gerado como artefato para Feature 04 (PDF).

- [x] HTML usa semântica adequada: `<h1>` no header, `<h2>` para títulos de cláusulas, `<p>` para parágrafos, `<section>` para agrupamento
- [x] IDs presentes em seções estruturais: `id="header"`, `id="disclaimer"`, `id="assinaturas"`, `id="footer"`
- [x] Seção de assinaturas usa `<strong>` para rótulos de signatários
- [ ] Cláusulas obrigatórias não possuem `id` nos `<section>` gerados — pode dificultar navegação por âncora no PDF (baixa prioridade para MVP)

## Qualidade de Código

### Conformidade com code-standards.md

| Padrão | Status | Observação |
|--------|--------|------------|
| Funções começam com verbo | PASSOU | `generateHtml`, `buildVariableMap`, `getPackages`, `renderClause`, `resolveOptionalClausesOrdered`, `substituteVariables` |
| Sem flag params | PASSOU | Nenhum parâmetro booleano usado para chavear comportamento |
| Early returns | PASSOU | `renderClause` retorna throw imediato quando cláusula não encontrada |
| Funções com responsabilidade única | PASSOU | `buildVariableMap`, `substituteVariables`, `renderClause` são funções focadas |
| Funções ≤ 50 linhas | PASSOU | Maior função: `generateHtml` com ~26 linhas |
| Código em inglês | PASSOU | Nomes de funções e variáveis em inglês; mensagens de erro em português (aceitável para domínio) |
| camelCase para funções/variáveis | PASSOU | Padrão consistente |

### Conformidade com logging.md

| Padrão | Status | Observação |
|--------|--------|------------|
| Sem dados pessoais logados | PASSOU | Nenhum `console.log/error` no service ou nas rotas que logue dados do payload |
| `console.error` em falhas | FALHOU | BUG-002: catch blocks nas rotas não logam o erro antes de retornar 400 |
| Sem silenciamento de exceções | FALHOU | BUG-002: exceção capturada e retornada como resposta HTTP sem registro |

## Bugs Encontrados

Ver detalhes completos em `bugs.md`.

| ID | Severidade | Descrição | Status |
|----|------------|-----------|--------|
| BUG-001 | Alta | Variáveis de cláusulas opcionais não substituídas quando `variaveis_opcionais` ausente/incompleto — `{{variavel}}` visível no HTML gerado | Aberto |
| BUG-002 | Baixa | Erros de `generateHtml` capturados nas rotas sem `console.error` — exceções silenciadas sem log | Aberto |

## Observações de Alinhamento PRD vs Implementação

1. **RF-04 — Nome da variável `parcelas`:** O PRD lista `parcelas` como uma das 16 variáveis do motor. A TechSpec e a implementação usam `forma_pagamento` (alinhado com o `clausulas.json`). A funcionalidade está correta; a divergência é apenas de nomenclatura no PRD. Classificado como imprecisão de documentação, não bug.

2. **RF-06 — Contagem de 17 seções:** O PRD lista 17 seções conceituais. A TechSpec documenta explicitamente que a seção 9 (Forma de pagamento) está incluída na cláusula 8 (`honorarios-e-pagamento`). A contagem de `<section>` tags no HTML é 14 (sem serviços adicionais e sem opcionais), 15 (com serviços adicionais) ou mais (com cláusulas opcionais). Isso está alinhado com a TechSpec e é uma decisão de design documentada.

3. **RF-05 — Formato do `error`:** A TechSpec define `{ error: string }`. O campo `error` retornado é de tipo string, mas seu conteúdo é um JSON serializado dos erros Zod (array de objetos). O campo identifica o campo com problema via `path`. Funcionalmente correto; o frontend pode parsear o JSON se necessário.

## Conclusão

A implementação atende 9 dos 10 requisitos funcionais com qualidade. O **BUG-001** é o único bloqueador para aprovação: quando cláusulas opcionais com variáveis próprias são selecionadas sem fornecer `variaveis_opcionais` correspondentes, o HTML gerado contém placeholders `{{variavel}}` visíveis, violando o objetivo central do PRD de "100% das variáveis substituídas". O **BUG-002** é uma não-conformidade com a regra de logging, de severidade baixa.

**Status:** REPROVADO — requer correção do BUG-001 antes da aprovação final.

Após a correção do BUG-001 (validação ou detecção de variáveis faltantes em cláusulas opcionais) e do BUG-002 (adicionar `console.error` nos catch blocks das rotas), o módulo pode ser aprovado. Todos os 49 testes automatizados passam, build e lint sem erros, nenhuma vulnerabilidade de dependência.
