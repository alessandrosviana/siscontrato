# Relatório de QA — Formulário de Dados do Projeto (Feature 010)

## Resumo

- **Data:** 2026-05-20
- **Status:** APROVADO COM RESSALVAS
- **Total de Requisitos:** 11 (RF-01 a RF-11)
- **Requisitos Atendidos:** 10 / 11
- **Requisitos com desvio:** 1 (RF-06 — sufixo visual "m²")
- **Bugs Encontrados:** 2 (ambos de severidade Baixa)

---

## Requisitos Verificados

| ID | Requisito | Status | Evidência |
|----|-----------|--------|-----------|
| RF-01 | Select `tipo_contrato` com opções "Prestação de Serviço" e "Empreitada", opção vazia inicial, não pré-preenchido | PASSOU | `project-form-page.tsx` linhas 14, 78-89 |
| RF-02 | Select `tipo_servico` com 3 opções, pré-preenchido de `steps['package'].tipo_servico` | PASSOU | `project-form-page.tsx` linhas 15, 97-108; `useState` com fallback `savedPackage?.tipo_servico` |
| RF-03 | Select `tipologia` com 5 opções, pré-preenchido de `steps['package'].tipo_projeto` | PASSOU | `project-form-page.tsx` linhas 16, 110-127; `useState` com fallback `savedPackage?.tipo_projeto` |
| RF-04 | Etiqueta textual "(sugestão do pacote)" ao lado do label na 1ª visita | PASSOU | `suggestedFields` Set inicializado lazy (linha 35-37); spans condicionais (linhas 93-95, 112-114) |
| RF-05 | Campo texto obrigatório `endereco_projeto`, sem pré-preenchimento | PASSOU | `project-form-page.tsx` linhas 129-139 |
| RF-06 | Campo numérico opcional `area_projeto` com sufixo visual "m²" | FALHOU (parcial) | `inputMode="decimal"` presente; sufixo "m²" apenas no label, não como elemento visual ao lado do input (BUG-01) |
| RF-07 | Botão "Continuar" disabled enquanto obrigatórios inválidos; sem mensagens de erro | PASSOU | `disabled={!isFormValid(fields)}`; `isFormValid` valida os 4 campos obrigatórios e `area_projeto` condicionalmente |
| RF-08 | Voltar → `/contratante`; Continuar → `/resultado` | PASSOU | `handleBack` linha 61; `handleSubmit` linha 57 |
| RF-09 | `updateStep('project', {...})` com os 5 campos ao confirmar | PASSOU | `project-form-page.tsx` linhas 50-57 |
| RF-10 | Pré-preenchimento: `steps['project']` na revisita; `steps['package']` na 1ª visita | PASSOU | `useState` lazy com lógica de fallback encadeada (linhas 38-44) |
| RF-11 | `ClientFormPage` navega para `/projeto` ao confirmar | PASSOU | `client-form-page.tsx` linha 101: `navigate('/projeto')` |

---

## Testes Automatizados Executados

### Frontend — Vitest (bun run test)

| Suite | Testes | Resultado |
|-------|--------|-----------|
| `project-form-page.test.tsx` | 14 testes | PASSOU |
| `client-form-page.test.tsx` | Inclui regressão navigate(`/projeto`) | PASSOU |
| Demais suites (8 arquivos) | 106 testes | PASSOU |
| **Total** | **134 testes** | **PASSOU** |

Duração: 8.28s | 10 arquivos de teste | 0 falhas

### Backend — Vitest (bun run test)

| Suite | Testes | Resultado |
|-------|--------|-----------|
| Todos os arquivos (7 suites) | 73 testes | PASSOU |
| **Total** | **73 testes** | **PASSOU** |

Duração: 917ms | 7 arquivos de teste | 0 falhas

### Cenários obrigatórios da TechSpec cobertos pelos testes

| Cenário | Coberto |
|---------|---------|
| Renderiza 5 campos e botões Continuar/Voltar | Sim |
| Formulário vazio → botão desabilitado | Sim |
| `tipo_contrato` vazio → botão desabilitado | Sim |
| `endereco_projeto` vazio → botão desabilitado | Sim |
| `area_projeto` inválido (texto) → botão desabilitado | Sim |
| `area_projeto` negativo → botão desabilitado (extra) | Sim |
| Todos os obrigatórios válidos → botão habilitado | Sim |
| `area_projeto` opcional (vazio) → botão habilitado | Sim |
| Continuar → `updateStep('project', {...})` com dados corretos | Sim |
| Continuar → `navigate('/resultado')` | Sim |
| Voltar → `navigate('/contratante')` | Sim |
| Pré-preenchimento de `steps['project']` (revisita) | Sim |
| Pré-preenchimento de `steps['package']` (1ª visita) | Sim |
| Etiqueta "(sugestão do pacote)" na 1ª visita | Sim |
| Etiqueta ausente na revisita | Sim |
| Regressão ClientFormPage → `/projeto` | Sim |

---

## Build e Lint

| Check | Resultado | Observações |
|-------|-----------|-------------|
| `bun run build` (tsc + vite build) | PASSOU | 40 módulos transformados; sem erros de TypeScript |
| `bun run lint` (eslint) | PASSOU | Sem warnings ou erros |

---

## Performance

- **Bundle size:** 308.69 kB (96.12 kB gzipped) — bem abaixo do limite de 500 kB gzipped
- **Anti-patterns no frontend:** Nenhum identificado
  - `isFormValid` declarada fora do componente (função pura, sem closure) — sem re-render desnecessário
  - `suggestedFields` inicializado como `useState` com inicializador lazy — calculado uma única vez
  - Sem dependências novas adicionadas
- **Anti-patterns no backend:** Nenhum identificado — feature é exclusivamente frontend
- **Lighthouse:** Não executado (aplicação não estava rodando em localhost durante o QA estático)

---

## Vulnerabilidades

- **Auditoria executada:** Não — `bun pm audit` não está disponível nesta versão do bun (1.3.13); `bun pm scan` requer scanner configurado em `bunfig.toml`
- **Alternativa:** Nenhuma dependência nova foi adicionada nesta feature; o risco incremental é zero
- **Recomendação:** Configurar `bun pm scan` com um scanner de vulnerabilidades no `bunfig.toml` do projeto para futuras auditorias

---

## Acessibilidade (WCAG 2.2)

| Critério | Status | Observações |
|----------|--------|-------------|
| Todos os campos com `<label htmlFor>` associado | PASSOU | 5 labels com `htmlFor` correspondente ao `id` do campo |
| `<h1>` único na página | PASSOU | "Dados do Projeto" (linha 64) |
| Selects com opção vazia inicial para `tipo_contrato` | PASSOU | `<option value="">Selecione...</option>` |
| `focus-visible` nos inputs e selects | PASSOU | `.input:focus-visible` e `.select:focus-visible` com `outline: 2px solid #1a1a2e; outline-offset: 2px` |
| Etiqueta "(sugestão do pacote)" como texto (não apenas visual) | PASSOU | Implementada como `<span>` com texto, acessível a leitores de tela |
| Navegação por teclado (Tab, Enter, Escape) | PASSOU | Formulário HTML nativo com `<form>` e `type="submit"` |
| Contraste de cores — texto principal | PASSOU | #333, #1a1a2e, #555 sobre branco: contraste adequado (>4.5:1) |
| Contraste de cores — `.suggestionTag` (#888) | FALHOU | Contraste ~3.54:1 vs fundo branco; abaixo do mínimo WCAG 2.2 SC 1.4.3 (BUG-02) |
| Mensagens de erro acessíveis | N/A | Validação silenciosa (botão disabled); sem mensagens de erro conforme especificado no PRD |
| Botão disabled com `cursor: not-allowed` | PASSOU | `.continueButton:disabled { cursor: not-allowed; opacity: 0.5; }` |

---

## Verificação de Conformidade — Backend

| Item | Status | Evidência |
|------|--------|-----------|
| `area_projeto` opcional no Zod schema | PASSOU | `contratos.ts` linha 15: `z.string().optional()` |
| `tipo_contrato` opcional no Zod schema | PASSOU | `contratos.ts` linha 16: `z.string().optional()` |
| `area_projeto` opcional em `ContratoPayload` (backend) | PASSOU | `contratos-service.ts` linha 23: `area_projeto?: string` |
| `tipo_contrato` opcional em `ContratoPayload` (backend) | PASSOU | `contratos-service.ts` linha 24: `tipo_contrato?: string` |
| `area_projeto` opcional em `ContratoPayload` (frontend) | PASSOU | `contrato.ts` linha 11: `area_projeto?: string` |
| `tipo_contrato` opcional em `ContratoPayload` (frontend) | PASSOU | `contrato.ts` linha 12: `tipo_contrato?: string` |
| `buildVariableMap` trata `area_projeto` opcional com `?? ''` | PASSOU | `contratos-service.ts` linha 65: `area_projeto: payload.area_projeto ?? ''` |

---

## Fluxo de Navegação

Fluxo completo verificado via leitura de código:

```
/ (LandingPage)
  → /aviso (DisclaimerPage)
  → /pacote (PackageSelectionPage)
  → /formulario (ArchitectFormPage)
  → /contratante (ClientFormPage) [navega para /projeto — RF-11 CONFORME]
  → /projeto (ProjectFormPage) [novo — navega para /resultado]
  → /resultado (ResultPage)
```

Todas as rotas registradas em `App.tsx` (linha 36: `path: '/projeto'`).

---

## Bugs Encontrados

Ver detalhes em `bugs.md`.

| ID | Descrição | Severidade | Status |
|----|-----------|------------|--------|
| BUG-01 | Sufixo visual "m²" ausente ao lado do input (apenas no label) | Baixa | Aberto |
| BUG-02 | Contraste insuficiente da etiqueta "(sugestão do pacote)": #888 (~3.54:1 < 4.5:1 WCAG) | Baixa | Aberto |

---

## Conclusão

A implementação da Feature 010 (Formulário de Dados do Projeto) está **funcionalmente completa e bem testada**. Todos os 134 testes do frontend e 73 do backend passaram. O build e o lint estão limpos. Os 10 dos 11 requisitos funcionais estão plenamente atendidos.

Foram encontrados 2 bugs de severidade **Baixa**, ambos sem impacto no fluxo funcional:

- **BUG-01** (RF-06): o sufixo "m²" está no label e não posicionado como elemento visual ao lado do input, como especificado no PRD. Desvio cosmético.
- **BUG-02** (A11Y): a cor da etiqueta "(sugestão do pacote)" tem contraste insuficiente para WCAG 2.2 SC 1.4.3. Correção simples: trocar `#888` por `#767676` ou mais escuro.

**Recomendação:** Aprovar a feature para produção. Os dois bugs podem ser corrigidos em uma iteração de ajustes visuais sem impacto no fluxo de negócio.
