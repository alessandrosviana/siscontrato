# Relatório de QA — Escopo dos Serviços e Serviços Adicionais (Feature 011)

## Resumo

- **Data:** 2026-05-21
- **Status:** REPROVADO
- **Total de Requisitos:** 13 (RF-01 a RF-13)
- **Requisitos Atendidos:** 13 (todos implementados)
- **Bugs Encontrados:** 2 (acessibilidade — severidade média e baixa)

---

## Requisitos Verificados

| ID | Requisito | Status | Evidência |
|----|-----------|--------|-----------|
| RF-01 | Tela `/escopo` com campos `escopo_servicos` (textarea) e `numero_revisoes` (input) | PASSOU | `scope-form-page.tsx` — ambos os campos presentes com `htmlFor` correto |
| RF-02 | Pré-preenchimento: `steps['scope']` na revisita; `steps['package']` na 1ª visita | PASSOU | Inicialização lazy via `useState(() => ...)` com lógica de fallback; 2 testes cobrem ambos os casos |
| RF-03 | `numero_revisoes` visível apenas quando `tipo_servico === 'projeto'` | PASSOU | `showNumeroRevisoes` calculado na montagem via `useState(() => tipoServico === 'projeto')`; testes para `projeto`, `reforma`, `reforma de interiores` |
| RF-04 | Botão "Continuar" desabilitado com escopo vazio ou `numero_revisoes` inválido | PASSOU | `isFormValid` função pura com validação de inteiro positivo; 6 testes de validação |
| RF-05 | `updateStep('scope', {...})` e `navigate('/servicos-adicionais')` ao confirmar | PASSOU | `handleSubmit` chama ambos corretamente; 2 testes confirmam |
| RF-06 | Botão "Voltar" → `navigate('/projeto')` | PASSOU | `handleBack` em `scope-form-page.tsx`; 1 teste confirma |
| RF-07 | `ProjectFormPage` navega para `/escopo` ao confirmar | PASSOU | `project-form-page.tsx` linha 57: `navigate('/escopo')`; teste de regressão em `project-form-page.test.tsx` linha 121 confirma |
| RF-08 | Tela `/servicos-adicionais` com 3 checkboxes opcionais | PASSOU | `additional-services-page.tsx` com constante `ADDITIONAL_SERVICES`; botão "Continuar" sempre habilitado |
| RF-09 | Campo `descricao_servico_adicional` visível somente quando ≥1 serviço selecionado | PASSOU | Renderização condicional via `hasSelection`; testes cobrem presença/ausência |
| RF-10 | Alerta inline ao selecionar serviço; desaparece ao desmarcar todos | PASSOU (com ressalva a11y) | Texto renderizado via `<p>` condicional; BUG-01: ausência de `role="alert"` |
| RF-11 | `updateStep('additional-services', {...})` e `navigate('/resultado')` ao confirmar | PASSOU | `handleSubmit` com `formatServicosAdicionais`; testes cobrem todos os formatos |
| RF-12 | Restauração de checkboxes e descrição na revisita via `steps['additional-services']` | PASSOU | Estado inicializado de `savedStep?.selected_services` e `savedStep?.description`; teste de revisita cobre |
| RF-13 | Botão "Voltar" → `navigate('/escopo')` em `AdditionalServicesPage` | PASSOU | `handleBack` em `additional-services-page.tsx`; 1 teste confirma |

---

## Testes E2E Executados

Os testes foram executados via Vitest (ambiente jsdom) com Testing Library.

| Fluxo | Resultado | Observações |
|-------|-----------|-------------|
| `scope-form-page.test.tsx` — 16 cenários | PASSOU | 168 testes totais passaram: `bun run test` — 12 arquivos, 0 falhas |
| `additional-services-page.test.tsx` — 14 cenários | PASSOU | Cobre todos os cenários da TechSpec |
| `project-form-page.test.tsx` — regressão navigate('/escopo') | PASSOU | Teste presente na linha 121 |
| Rota `/escopo` no `App.tsx` | PASSOU | Importação e rota presentes |
| Rota `/servicos-adicionais` no `App.tsx` | PASSOU | Importação e rota presentes |
| Integração `buildPayload` — precedência de `steps['scope']` sobre `steps['package']` | PASSOU | `ResultPage.buildPayload` usa spread genérico; ordem de inserção garante precedência correta |

**Resultado sumarizado:** `12 arquivos de teste, 168 testes, 0 falhas` (`bun run test` — `vitest run`)

---

## Performance

- **Bundle size:** 313.86 kB (gzip: 97.14 kB) — abaixo do limite de 500 KB gzipped
- **Build:** concluído em 188ms sem erros de TypeScript ou Vite
- **Anti-patterns no frontend:**
  - Sem re-renders desnecessários: `showNumeroRevisoes` e `suggestedFields` com `useState` lazy (calculados uma vez na montagem)
  - `isFormValid` e `formatServicosAdicionais` são funções puras fora do componente — sem recriação a cada render
  - `ADDITIONAL_SERVICES` e `ALERT_MESSAGE` declarados como constantes de módulo
  - Sem imports desnecessários nem bibliotecas duplicadas
- **Anti-patterns no backend:** não aplicável — feature exclusivamente frontend
- **Lighthouse:** não executado (localhost não verificado em ambiente de CI)

---

## Vulnerabilidades

- **Auditoria executada:** Sim (`bun audit` no diretório `frontend/`)
- **Resultado:** `No vulnerabilities found`
- **Vulnerabilidades críticas/altas:** nenhuma
- **Recomendações:** nenhuma

---

## Acessibilidade — WCAG 2.2

### ScopeFormPage (`/escopo`)

- [x] `<h1>` único: "Escopo dos Serviços"
- [x] `escopo_servicos`: `<label htmlFor="escopo_servicos">` associado ao `<textarea id="escopo_servicos">`
- [x] `numero_revisoes`: `<label htmlFor="numero_revisoes">` associado ao `<input id="numero_revisoes">`
- [x] Etiqueta "(sugestão do pacote)" como texto (`<span>`) — não apenas visual
- [x] `focus-visible` com `outline: 2px solid` em textarea e input (CSS Module)
- [x] Botão "Continuar" desabilitado semanticamente via atributo `disabled`
- [x] Navegação por teclado funcional (Tab, Enter via `type="submit"`, botão Voltar `type="button"`)

### AdditionalServicesPage (`/servicos-adicionais`)

- [x] `<h1>` único: "Serviços Adicionais"
- [x] Cada checkbox com `<label htmlFor>` associado via `htmlFor={service-${service}}`
- [x] `descricao_servico_adicional`: `<label htmlFor="descricao_servico_adicional">` associado
- [x] `focus-visible` com `outline: 2px solid` em checkboxes e textarea (CSS Module)
- [x] Mensagem de alerta renderizada como texto (não apenas cor)
- [ ] **FALHOU** — Alerta dinâmico sem `role="alert"`: inserção no DOM não anunciada por leitores de tela (WCAG 2.2 SC 4.1.3) — BUG-01
- [ ] **FALHOU** — Grupo de checkboxes sem `<fieldset>`/`<legend>`: `<span>` como título do grupo não associa semanticamente os controles (WCAG 2.2 SC 1.3.1) — BUG-02

---

## Bugs Encontrados

Ver detalhes completos com evidências em `bugs.md`.

| ID | Descrição resumida | Severidade | Status |
|----|--------------------|------------|--------|
| BUG-01 | Alerta dinâmico sem `role="alert"` — não anunciado por leitores de tela | Média | Aberto |
| BUG-02 | Checkboxes sem `<fieldset>`/`<legend>` — associação semântica do grupo ausente | Baixa | Aberto |

---

## Conclusão

A implementação da Feature 011 atende a **totalidade dos 13 requisitos funcionais** do PRD. Os testes automatizados (168 casos) passam integralmente, o build TypeScript está limpo (0 erros), o lint não reporta violações e não há vulnerabilidades de dependências.

Foram encontrados **2 bugs de acessibilidade** no componente `AdditionalServicesPage`:
- BUG-01 (severidade **média**): alerta dinâmico sem `role="alert"`, violando WCAG 2.2 SC 4.1.3.
- BUG-02 (severidade **baixa**): grupo de checkboxes sem `<fieldset>`/`<legend>`, violando WCAG 2.2 SC 1.3.1.

O QA está **REPROVADO** até que os bugs de acessibilidade sejam corrigidos. Após a correção, o relatório pode ser reclassificado para APROVADO sem necessidade de reexecutar os testes funcionais.

Recomenda-se executar `/kspec-bugfix 011-prd-escopo-servicos` para corrigir os bugs documentados.
