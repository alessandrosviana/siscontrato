# QA Report — Feature 013: Seleção de Cláusulas Opcionais

## Status: APROVADO

## Resumo
- Data: 2026-05-21
- Testes: 200/200 passando (18 cenários específicos da feature + 182 de regressão)
- Build: OK (bundle JS gzipped: 105.06 kB)
- Lint: OK (sem erros ESLint)
- Vulnerabilidades: 0
- Bugs encontrados: 0

---

## Checklist de Conformidade com o PRD

| ID | Requisito | Status | Evidência |
|----|-----------|--------|-----------|
| RF-01 | Rota `/clausulas` existe e renderiza `OptionalClausesPage` | OK | `App.tsx` linha 56–59: `{ path: '/clausulas', element: <OptionalClausesPage /> }` |
| RF-02 | `fetch GET /api/clausulas?obrigatoria=false` no mount | OK | `optional-clauses-page.tsx` linhas 37–52: `loadClausulas` chamada em `useEffect` |
| RF-03 | Indicador de loading durante o fetch | OK | Linha 97–99: `<p role="status">Carregando cláusulas...</p>` quando `fetchState === 'loading'` |
| RF-04 | Mensagem de erro + botão "Tentar novamente" em falha | OK | Linhas 102–108: `role="alert"` + `<button onClick={loadClausulas}>Tentar novamente</button>` |
| RF-05 | Lista de cláusulas com toggle e accordion | OK | Linhas 112–149: map sobre `clausulas` com `toggleButton` e `accordionButton` |
| RF-06 | Toggles com `role="switch"` e `aria-checked` | OK | Linhas 131–133: `role="switch"` e `aria-checked={isActive}` |
| RF-07 | Accordion expande/colapsa com `aria-expanded` | OK | Linhas 124–127: `aria-expanded={isExpanded}` e `aria-controls` |
| RF-08 | Cláusulas personalizadas (adicionar/remover/editar) | OK | Funções `addCustomClause`, `removeCustomClause`, `updateCustomClauseText` |
| RF-09 | Submit salva no store e navega para `/resultado` | OK | Linhas 79–85: `updateStep('optional-clauses', {...})` + `navigate('/resultado')` |
| RF-10 | Botão "Voltar" navega para `/honorarios` | OK | Linha 87–89: `navigate('/honorarios')` |
| RF-11 | Revisita restaura seleções do store | OK | Initializer functions nas linhas 28–36 leem `steps['optional-clauses']` |
| RF-09b | `FeesFormPage` navega para `/clausulas` ao confirmar | OK | `fees-form-page.tsx` linha 93: `navigate('/clausulas')` |

Todos os 12 requisitos verificados: 12/12 OK.

---

## Conformidade com a TechSpec

| Decisão Técnica | Status | Observações |
|-----------------|--------|-------------|
| Interface `Clausula` com slug/titulo/texto/categoria | OK | Linhas 6–11 de `optional-clauses-page.tsx` |
| Interface `CustomClause` com id/text | OK | Linhas 13–16 |
| `FetchState = 'loading' \| 'error' \| 'success'` | OK | Linha 18 |
| `Set<string>` imutável para toggles e accordion | OK | Spread imutável em `toggleSlug` e `toggleExpanded` |
| `crypto.randomUUID()` para IDs de personalizadas | OK | Linhas 35 e 71 |
| `updateStep('optional-clauses', {...})` no submit | OK | Linha 80 |
| `console.error` no catch do fetch | OK | Linha 49 com extração segura de `err.message` |
| `aria-controls` aponta para elemento sempre no DOM com `hidden` | OK | `<p id="texto-{slug}" hidden={!isExpanded}>` — sempre no DOM |
| `clausulas_personalizadas?: string[]` adicionado ao `ContratoPayload` | OK | `contrato.ts` linha 30 |
| `useCallback` para estabilizar `loadClausulas` | OK | Linha 37 com array de dependências vazio |
| Botão "Continuar" desabilitado durante loading | OK | `disabled={fetchState === 'loading'}` fora de condicionais |

---

## Testes E2E / Unitários Executados

| # | Cenário | Resultado |
|---|---------|-----------|
| 1 | Loading indicator antes do fetch resolver | PASSOU |
| 2 | Títulos das cláusulas renderizados após fetch bem-sucedido | PASSOU |
| 3 | Mensagem de erro quando fetch retorna HTTP 500 | PASSOU |
| 4 | Botão "Tentar novamente" reexecuta o fetch | PASSOU |
| 5 | Toggle ativa cláusula (aria-checked=true) | PASSOU |
| 6 | Toggle desativa cláusula quando clicado novamente | PASSOU |
| 7 | "Ver texto" expande accordion (aria-expanded=true) | PASSOU |
| 8 | Clicar novamente colapsa accordion (verificado com `.not.toBeVisible()`) | PASSOU |
| 9 | "+ Adicionar" insere textarea vazio | PASSOU |
| 10 | Remover elimina textarea correspondente; restante renumerado | PASSOU |
| 11 | Submit sem seleção: `updateStep` com arrays vazios | PASSOU |
| 12 | Submit com cláusula ativa: slug incluído em `clausulas_opcionais` | PASSOU |
| 13 | Submit com personalizada preenchida: texto incluído | PASSOU |
| 14 | Submit com personalizada vazia: texto descartado no submit | PASSOU |
| 15 | Submit chama `navigate('/resultado')` | PASSOU |
| 16 | Voltar chama `navigate('/honorarios')` | PASSOU |
| 17 | Revisita — slugs restaurados de `steps['optional-clauses']` | PASSOU |
| 18 | Revisita — personalizadas restauradas de `steps['optional-clauses']` | PASSOU |
| R1 | Regressão FeesFormPage: `navigate('/clausulas')` no submit | PASSOU |

Total: 19/19 cenários passando (18 da feature + 1 regressão).
Suite completa: 200/200 testes passando em 14 arquivos de teste.

---

## Performance

- Bundle JS: 339.50 kB raw / **105.06 kB gzipped** (abaixo do limite de 500 kB gzipped)
- Build time: 199ms
- Módulos transformados: 49
- Anti-patterns encontrados: nenhum
  - `useCallback` aplicado corretamente a `loadClausulas` para evitar re-fetch
  - `Set<string>` imutável evita mutação acidental de estado
  - Initializer functions em `useState` garantem leitura única do store na montagem
- Lighthouse: não executado (servidor backend offline no ambiente de QA; testes unitários com mock de fetch cobrem os fluxos)

---

## Vulnerabilidades

- Auditoria executada: Sim (`bun audit`)
- Vulnerabilidades encontradas: **0**
- Recomendações: nenhuma

---

## Acessibilidade (WCAG 2.2)

| Item | Status | Observação |
|------|--------|------------|
| `role="switch"` + `aria-checked` nos toggles | OK | Linha 131–133; testes 5 e 6 verificam `aria-checked` true/false |
| `aria-expanded` + `aria-controls` nos botões de accordion | OK | Linhas 124–126; testes 7 e 8 verificam o atributo |
| `id="texto-{slug}"` sempre no DOM com atributo `hidden` | OK | `<p id={...} hidden={!isExpanded}>` — elemento presente no DOM para `aria-controls` ser válido |
| `<label htmlFor>` para cada textarea de personalizada | OK | Linhas 158–159: `<label id={labelId} htmlFor={inputId}>` |
| `aria-live="polite"` no container de estado de fetch | OK | Linha 95: `<div aria-live="polite" aria-atomic="true">` |
| `aria-atomic="true"` no container de estado | OK | Linha 95 |
| `role="status"` no indicador de loading | OK | Linha 97 |
| `role="alert"` na mensagem de erro | OK | Linha 102 |
| `aria-label` descritivo nos botões de toggle | OK | Linha 135: `aria-label=\`Ativar cláusula: ${clausula.titulo}\`` |
| `aria-label` descritivo nos botões de remoção | OK | Linha 165: `aria-label=\`Remover cláusula personalizada ${index + 1}\`` |
| `focus-visible` com outline em todos os interativos | OK | CSS Module cobre: `.toggleButton`, `.accordionButton`, `.removeButton`, `.textarea`, `.addButton`, `.backButton`, `.continueButton` |
| `<h1>` único na página | OK | Linha 91: único `<h1>` com texto "Cláusulas Opcionais" |
| Navegação por teclado (Tab/Enter/Space) | OK | Todos os controles são elementos nativos `<button>` e `<textarea>`, com suporte nativo |
| Contraste de cores | OK | Paleta `#1a1a2e` (escuro) sobre `#fff` (branco) — alto contraste; vermelho `#e53e3e` para ações destrutivas |
| Botão "Continuar" desabilitado semanticamente | OK | `disabled={fetchState === 'loading'}` — atributo `disabled` nativo |

Todos os 15 itens de acessibilidade verificados: 15/15 OK.

---

## Verificação Visual

| Aspecto | Status | Observação |
|---------|--------|------------|
| Estado vazio (loading) | OK | Indicador "Carregando cláusulas..." com `role="status"` |
| Estado de erro | OK | Alerta vermelho com botão de retry |
| Estado com dados (success) | OK | Lista de cláusulas com toggles e accordions |
| Cláusulas personalizadas | OK | Textarea com label, botão remover, botão adicionar com borda dashed |
| Botões de ação no rodapé | OK | "Voltar" e "Continuar" sempre visíveis, fora de condicionais |
| Toggle ativo vs inativo | OK | CSS `aria-checked="true"` muda `background-color` para `#1a1a2e` |
| Accordion expandido vs colapsado | OK | `hidden` controla visibilidade; botão alterna "Ver texto" / "Ocultar texto" |
| Padrão visual consistente | OK | Mesma paleta `#1a1a2e`, CSS Module, sans-serif, das demais páginas |

---

## Regressão

| Arquivo | Mudança | Status |
|---------|---------|--------|
| `fees-form-page.tsx` | `navigate('/resultado')` → `navigate('/clausulas')` | OK — teste de regressão passando |
| `fees-form-page.test.tsx` | Assertion atualizada para `/clausulas` | OK |
| `App.tsx` | Adição de rota `/clausulas` e import `OptionalClausesPage` | OK — sem quebra de rotas existentes |
| Demais 13 arquivos de teste | Sem alteração | OK — 182 testes de regressão passando |

Nenhuma regressão detectada.

---

## Bugs Encontrados

Nenhum bug encontrado.

---

## Conclusão

A Feature 013 (Seleção de Cláusulas Opcionais) está **APROVADA** para produção.

Todos os 12 requisitos funcionais do PRD foram implementados e verificados. A TechSpec foi seguida integralmente. As duas tasks (1.0 e 2.0) estão marcadas como concluídas e confirmadas por review anterior. Os 200 testes do frontend passam sem falhas, incluindo os 18 cenários específicos da feature e 1 teste de regressão de navegação. O bundle gzipped (105 kB) está bem abaixo do limite de 500 kB. Nenhuma vulnerabilidade foi encontrada. Todos os 15 itens de acessibilidade WCAG 2.2 foram verificados e estão conformes.
