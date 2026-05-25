# Relatório de QA — Feature 016: Download do Contrato e Encaminhamento para Assinatura

## Resumo

- **Data:** 2026-05-22
- **Status:** REPROVADO
- **Total de Requisitos:** 7 (RF1–RF7)
- **Requisitos Atendidos:** 7/7 (funcionalmente corretos)
- **Bugs Encontrados:** 4 (2 médios, 2 baixos)
- **Testes Automatizados:** 220 testes — 220 PASSOU / 0 FALHOU

> **Motivo da reprovação:** Dois bugs de acessibilidade com severidade Média (WCAG 2.2) impedem a aprovação: ausência de tecla Escape no modal (BUG-01) e ausência de focus trap no modal (BUG-02). O QA só pode ser aprovado quando todos os requisitos de acessibilidade do PRD estiverem funcionando.

---

## Requisitos Verificados

| ID | Requisito | Status | Evidência |
|----|-----------|--------|-----------|
| RF1 | Navegação para `/concluido` após download bem-sucedido via `onSuccess` | PASSOU | `result-page.tsx` linha 151: `onSuccess={() => navigate('/concluido')}`. Cenário 12 do `result-page.test.tsx` passa. |
| RF2 | Mensagem "Seu contrato foi gerado com sucesso!" em destaque | PASSOU | `completion-page.tsx` linha 53. Cenário 2 do `completion-page.test.tsx` passa. |
| RF3 | Botão "Baixar contrato (PDF)" com filename `contrato-[tipo_servico]-[data].pdf` | PASSOU | `download-pdf-button.tsx` linhas 30-32. Cenário de filename com tipo_servico passa em `download-pdf-button.test.tsx`. |
| RF4 | Aviso "Salve o documento. Esta plataforma não armazena contratos gerados." | PASSOU | `completion-page.tsx` linhas 54-56. Cenário 3 do `completion-page.test.tsx` passa. |
| RF5 | Modal gov.br com 4 passos, link para `assinatura.iti.br` e botão Fechar | PASSOU (parcial) | Modal implementado com `role="dialog"`, `aria-modal="true"`, `aria-labelledby`. Cenários 5–8 passam. Porém: sem tecla Escape (BUG-01) e sem focus trap (BUG-02). |
| RF6 | Botão "Gerar novo contrato": chama `resetForm()` e navega para `/` | PASSOU | `completion-page.tsx` linhas 45-48. Cenário 9 do `completion-page.test.tsx` passa. |
| RF7 | Guard: `isFinalized === false` redireciona para `/resultado` | PASSOU | `completion-page.tsx` linhas 24-28. Cenário 1 do `completion-page.test.tsx` passa. |

---

## Testes E2E / Automatizados Executados

| Arquivo de Teste | Testes | Resultado | Observações |
|---|---|---|---|
| `completion-page.test.tsx` | 9 | PASSOU | Todos os 9 cenários da TechSpec cobertos |
| `result-page.test.tsx` | 12 | PASSOU | Inclui cenário 12: `navigate('/concluido')` |
| `download-pdf-button.test.tsx` | 11 | PASSOU | Inclui testes de filename com `tipo_servico` |
| Demais arquivos (12 arquivos) | 188 | PASSOU | Testes de regressão — sem quebras |
| **Total** | **220** | **220 PASSOU** | Execução: `bun run test --run` no diretório `frontend/` |

**Duração total da suíte:** 13.46s

---

## Performance

- **Bundle JS:** 345.63 kB (gzip: 106.73 kB) — dentro do limite de 500 KB gzipped
- **CSS:** 24.00 kB (gzip: 3.59 kB)
- **Build bem-sucedido:** Sim (tsc + vite build — 302ms)
- **Anti-patterns encontrados:**
  - `buildPayload` duplicado em `completion-page.tsx` e `result-page.tsx` (DRY violation — BUG-04)
  - Sem re-renders desnecessários detectados
  - Sem queries N+1 (sem backend alterado)
  - Lazy loading: não aplicável para a funcionalidade (componentes leves)
- **Lighthouse:** Não executado (aplicação não estava rodando em localhost durante a análise)

---

## Vulnerabilidades

- **Auditoria executada:** Sim (`bun audit` no diretório `frontend/`)
- **Resultado:** `No vulnerabilities found`
- **Vulnerabilidades críticas/altas:** 0
- **Recomendações:** Nenhuma

---

## Acessibilidade (WCAG 2.2)

### CompletionPage — Verificações

| Critério | Status | Observações |
|---|---|---|
| Navegação por teclado (Tab) | FALHOU | Focus trap ausente no modal gov.br (BUG-02) |
| Tecla Escape para fechar modal | FALHOU | Não implementado (BUG-01) |
| Botões com labels descritivos | PASSOU | `aria-label` no `DownloadPdfButton`; botões de texto descritivo |
| Modal com `role="dialog"` e `aria-modal="true"` | PASSOU | Implementado corretamente |
| Modal com `aria-labelledby` | PASSOU | `aria-labelledby="govbr-modal-title"` |
| Link externo com `aria-label` indicando nova aba | PASSOU | `aria-label="Acessar assinatura.iti.br (abre em nova aba)"` |
| Link externo com `rel="noopener noreferrer"` | PASSOU | Segurança e a11y corretos |
| Foco no modal ao abrir | PASSOU | `modalFirstFocusRef.current?.focus()` |
| Foco retorna ao botão gov.br ao fechar | PASSOU | `govBrButtonRef.current?.focus()` |
| `focus-visible` com outline nos botões | PASSOU | `.govBrButton`, `.newContractButton`, `.modalCloseButton`, `.modalLink` têm `focus-visible` no CSS |
| Contraste de cores — textos principais | PASSOU | `#15803d` / `#166534` sobre `#dcfce7` — contraste adequado |
| Contraste de cores — link do modal | FALHOU | `#1a73e8` sobre branco: ~3.8:1 < mínimo 4.5:1 WCAG AA (BUG-03) |
| `aria-live` para anúncios de loading | PASSOU | `DownloadPdfButton` tem `aria-live="polite"` |
| `role="alert"` para erros | PASSOU | `DownloadPdfButton` tem `role="alert"` no estado de erro |

---

## Bugs Encontrados

Ver detalhes completos em `bugs.md`.

| ID | Descrição | Severidade | Status |
|----|-----------|------------|--------|
| BUG-01 | Modal gov.br sem tecla Escape para fechar | Média | Aberto |
| BUG-02 | Modal gov.br sem focus trap (foco escapa do modal) | Média | Aberto |
| BUG-03 | Contraste insuficiente no link do modal (#1a73e8 ~3.8:1, mínimo 4.5:1) | Baixa | Aberto |
| BUG-04 | `buildPayload` duplicado em `CompletionPage` e `ResultPage` (DRY) | Baixa | Aberto |

---

## Verificações Visuais

| Verificação | Status | Observações |
|---|---|---|
| Banner de sucesso visível e destacado | PASSOU | Background verde `#dcfce7`, borda `#16a34a` |
| Aviso de não-armazenamento visível | PASSOU | Texto em verde escuro, tamanho 0.875rem |
| Botões organizados em coluna com gap | PASSOU | `flex-direction: column`, `gap: 1rem` |
| Modal com overlay semitransparente | PASSOU | `rgba(0,0,0,0.5)` |
| Modal centralizado na tela | PASSOU | `align-items: center; justify-content: center` |
| Responsividade — `max-width: 800px` na página | PASSOU | Container centralizado com max-width |
| Responsividade — botões com `max-width: 400px` | PASSOU | Botões gov.br e novo contrato limitados |
| Estado vazio (store vazio) — guard ativo | PASSOU | Redireciona para `/resultado` |

---

## Checklist de Qualidade

- [x] PRD analisado e requisitos extraídos (7 requisitos funcionais)
- [x] TechSpec analisada (decisões técnicas verificadas)
- [x] Tasks verificadas (todas as 3 tasks marcadas como concluídas)
- [ ] Ambiente localhost acessível (não verificado — análise estática e testes automatizados)
- [x] Testes automatizados executados (220/220 passaram)
- [x] Todos os fluxos principais testados
- [x] Performance verificada (bundle 106 kB gzip, sem vulnerabilidades)
- [x] Vulnerabilidades verificadas (zero encontradas)
- [x] Acessibilidade verificada (WCAG 2.2 — 3 falhas encontradas)
- [x] Bugs documentados (4 bugs em `bugs.md`)
- [x] Relatório final gerado e salvo

---

## Conclusão

A implementação da Feature 016 está funcionalmente completa: todos os 7 requisitos funcionais do PRD foram implementados e os 220 testes automatizados passam sem falhas. O bundle está dentro dos limites de performance e não há vulnerabilidades de dependências.

No entanto, o QA está **REPROVADO** por dois bugs de acessibilidade com severidade Média que violam WCAG 2.2:

1. **BUG-01** — O modal gov.br não responde à tecla Escape (WCAG 2.1.1 — Teclado)
2. **BUG-02** — O modal gov.br não implementa focus trap, permitindo que o foco escape para elementos externos (WAI-ARIA Dialog Modal pattern)

Ambos comprometem a usabilidade para usuários que navegam por teclado e leitores de tela.

Para aprovação, corrija os BUG-01 e BUG-02 adicionando um `onKeyDown` para Escape e um mecanismo de focus trap no modal (ex.: interceptar Tab/Shift+Tab para circular apenas entre os elementos interativos do modal). BUG-03 e BUG-04 são recomendados mas não bloqueantes.
