# QA Report — Feature 014: Variáveis das Cláusulas Opcionais

## Status: APROVADO

## Resumo
- Data: 2026-05-21
- Testes frontend: 211/211 passando (14 arquivos)
- Testes backend: 82/82 passando (7 arquivos)
- Novos testes (cenários 19–29): 11/11 passando
- Build: OK (JS 105.39 kB gzipped — dentro do limite de 500 kB)
- Lint: OK (sem erros ou warnings)
- Bugs encontrados: 0

## Checklist de Conformidade

| Item | Status | Observação |
|------|--------|------------|
| RF1 — `variaveis: [{slug, label}]` na API | OK | Todos os 10 slugs de variáveis correspondem exatamente aos `{{placeholders}}` no campo `texto`; 15 variáveis em total nas 10 cláusulas opcionais |
| RF2 — Inputs dentro do accordion expandido | OK | `isExpanded && clausula.variaveis.length > 0` renderiza `varsGroup` com `label + input` por variável |
| RF3 — Preenchimento independente da ativação | OK | Accordion e inputs abrem/funcionam independentemente do estado do toggle |
| RF4 — Valores preservados ao desativar toggle | OK | `clausulaVars` é estado flat global; toggle altera apenas `activeSlugs`, nunca limpa `clausulaVars` |
| RF5 — Aviso `role="alert"` não bloqueante | OK | `showVarsWarning && <div role="alert">` acima dos botões; `navigate('/resultado')` não é bloqueado |
| RF6 — Submit envia somente variáveis de cláusulas ativas | OK | `activeVars` filtra `activeSlugs.has(c.slug)` antes do `updateStep`; cláusulas inativas descartadas |
| RF7 — Revisita restaura `clausulaVars` | OK | `useState(() => savedStep?.variaveis_opcionais ?? {})` inicializa do store |

## Conformidade com TechSpec

| Item | Status | Observação |
|------|--------|------------|
| Interface `ClausulaVariavel { slug, label }` no backend | OK | `export interface ClausulaVariavel` em `clausulas-service.ts` |
| Interface `ClausulaVariavel` no frontend | OK | Interface local declarada em `optional-clauses-page.tsx` |
| `clausulaVars: Record<string, string>` flat | OK | Estado global, não por-cláusula |
| `showVarsWarning` inicializa `false` | OK | `useState(false)` confirmado |
| `handleVarChange` reseta `showVarsWarning` | OK | `setShowVarsWarning(false)` na função |
| `hasMissingVars()` detecta cláusulas ativas com campos em branco | OK | Lógica correta com `activeSlugs.has` + `.trim()` |
| Aviso acima dos botões de ação | OK | `showVarsWarning` renderizado antes de `div.actions` no JSX |
| `variaveis_opcionais` no `updateStep` | OK | Campo presente e populado corretamente |
| CSS classes `.varsGroup`, `.varInput`, `.varLabel`, `.varsWarning` | OK | Todas presentes em `optional-clauses-page.module.css` |

## Dados do Backend (clausulas.json)

| Item | Status | Observação |
|------|--------|------------|
| 10 cláusulas opcionais com campo `variaveis` | OK | Todas as 10 cláusulas têm `variaveis` (array vazio ou preenchido) |
| Slugs correspondem aos `{{placeholders}}` no texto | OK | Verificação automatizada: 0 slugs ausentes, 0 slugs extras em todas as 10 cláusulas |
| Labels em português e descritivos | OK | 15 labels verificados: todos em português e auto-descritivos |
| Cláusulas obrigatórias com `variaveis: []` | OK | 10 cláusulas obrigatórias têm `variaveis: []` conforme especificado |

## Testes E2E

| Cenário | Resultado | Observações |
|---------|-----------|-------------|
| Cenários 1–18 (regressão) | PASSOU | 18/18 — nenhuma regressão detectada |
| 19. Inputs no accordion aberto | PASSOU | `getByLabelText('Variável A')` e `getByLabelText('Variável B')` encontrados |
| 20. Inputs ausentes com accordion fechado | PASSOU | `queryByLabelText` retorna null quando accordion fechado |
| 21. Cláusula sem variáveis sem inputs extras | PASSOU | Nenhum `<input>` renderizado para cláusula sem variáveis |
| 22. Digitação no input atualiza valor | PASSOU | `fireEvent.change` → `toHaveValue` confirmado |
| 23. Aviso ausente no render inicial | PASSOU | `queryByRole('alert')` → null no estado inicial |
| 24. Submit com cláusula ativa e campo em branco exibe alerta | PASSOU | `getByRole('alert')` encontrado após submit |
| 25. Submit com todos campos preenchidos sem aviso | PASSOU | `queryByRole('alert')` → null |
| 26. Editar campo oculta aviso | PASSOU | `queryByRole('alert')` → null após edição |
| 27. Submit exclui vars de cláusulas inativas | PASSOU | `variaveis_opcionais: {}` quando cláusula não ativa |
| 28. Submit inclui vars de cláusulas ativas preenchidas | PASSOU | `variaveis_opcionais: { var_a: 'valor a', var_b: 'valor b' }` |
| 29. Revisita restaura `clausulaVars` | PASSOU | `toHaveValue('valor salvo a')` e `toHaveValue('valor salvo b')` confirmados |

## Performance

- Bundle JS: 340.57 kB bruto / **105.39 kB gzipped** (dentro do limite de 500 kB)
- CSS: 18.71 kB bruto / 2.76 kB gzipped
- Anti-patterns encontrados: nenhum
  - Sem imports desnecessários ou bibliotecas duplicadas
  - Sem re-renders desnecessários (estado local minimal e bem delimitado)
  - Sem queries N+1 no backend (JSON estático carregado em memória)
- Lighthouse: não executado (aplicação não rodando em localhost no momento do QA)

## Vulnerabilidades

- Auditoria executada: Sim (`bun audit` em frontend e backend)
- Frontend: nenhuma vulnerabilidade encontrada
- Backend: nenhuma vulnerabilidade encontrada
- Recomendações: nenhuma

## Acessibilidade (WCAG 2.2)

| Item | Status | Observação |
|------|--------|------------|
| Cada `<input>` tem `<label htmlFor>` associado | OK | `<label htmlFor={\`var-${v.slug}\`}>` vinculado ao `id={\`var-${v.slug}\`}` do input |
| Aviso de campos em branco usa `role="alert"` | OK | `<div role="alert" className={styles.varsWarning}>` |
| `focus-visible` com outline nos novos inputs | OK | `.varInput:focus-visible { outline: 2px solid #1a1a2e; outline-offset: 2px }` em CSS |
| Labels com texto descritivo (backend) | OK | Labels em português provenientes do JSON, sem geração heurística no frontend |
| Navegação por teclado (accordion + toggle) | OK | Todos os controles são `<button>` nativos; accordion usa `aria-expanded` e `aria-controls` |
| Formulários têm labels associados | OK | Campos personalizados também têm `<label htmlFor>` correto |

## Bugs Encontrados

Nenhum bug encontrado. Arquivo `bugs.md` não criado.

## Conclusão

A Feature 014 está **APROVADA**. Todos os 7 requisitos funcionais do PRD foram implementados e verificados. Os 11 novos cenários de teste cobrem integralmente os casos especificados na TechSpec. Nenhuma regressão foi detectada nos 18 cenários anteriores. Build, lint e auditoria de segurança passaram sem erros. A implementação está em conformidade com os padrões de acessibilidade WCAG 2.2 e com os padrões de codificação do projeto.
