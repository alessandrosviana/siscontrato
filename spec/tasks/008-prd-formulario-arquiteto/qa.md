# Relatório de QA — Formulário de Dados do Arquiteto

## Resumo

- Data: 2026-05-20
- Status: **APROVADO com ressalva**
- Total de Requisitos: 9 (RF-01 a RF-09)
- Requisitos Atendidos: 9
- Bugs Encontrados: 1 (severidade Baixa — acessibilidade)

## Requisitos Verificados

| ID | Requisito | Status | Evidência |
|----|-----------|--------|-----------|
| RF-01 | Formulário exibe 7 campos: nome, CPF, CNPJ, CAU, endereço, email, telefone | PASSOU | Teste `renders the 7 fields and the Continue and Back buttons` — 7 inputs encontrados por `getByLabelText` |
| RF-02 | CPF e CNPJ independentes; pelo menos um válido para avançar | PASSOU | Testes `filling only valid CPF...`, `filling only valid CNPJ...`, `CPF and CNPJ both invalid shows CPF/CNPJ error` — lógica validada em `validateFields` |
| RF-03 | Ao clicar "Continuar", todos os campos são validados; erros exibidos abaixo de cada campo inválido | PASSOU | Teste `clicking Continue with all fields empty shows error messages` — 6 mensagens de erro renderizadas corretamente |
| RF-04 | Botão "Continuar" sempre habilitado (validação só no submit) | PASSOU | Teste `Continue button is enabled even with empty fields (RF-04)` — `not.toBeDisabled()` confirmado |
| RF-05 | Se válido: `updateStep('architect', {...})` + `navigate('/contratante')` | PASSOU | Testes `all valid fields calls updateStep(...)` e `all valid fields calls navigate("/contratante")` |
| RF-06 | Botão "Voltar" retorna para `/pacote` sem apagar dados | PASSOU | Teste `Back button calls navigate("/pacote")` — `navigate('/pacote')` chamado; store não é limpo |
| RF-07 | Pré-preenchimento a partir de `steps['architect']` no store | PASSOU | Teste `fields are pre-filled when steps["architect"] exists in store` — todos os 6 campos verificados por `.value` |
| RF-08 | Máscaras de CPF, CNPJ e telefone | PASSOU | Teste `CPF mask is applied when typing` — entrada `52998224725` resulta em `529.982.247-25`; funções `applyCpfMask`, `applyCnpjMask`, `applyPhoneMask` implementadas |
| RF-09 | Placeholder `A12345-8` no campo `registro_cau` | PASSOU | Verificação estática: `placeholder="A12345-8"` presente na linha 222 de `architect-form-page.tsx` |

## Testes E2E Executados

> Testes de integração/E2E com TestSprite MCP não foram executados pois o TestSprite não está disponível neste ambiente. A cobertura foi assegurada via testes unitários com Vitest + Testing Library.

| Fluxo | Resultado | Observações |
|-------|-----------|-------------|
| Renderização inicial do formulário | PASSOU | 12/12 testes do componente passam |
| Submissão com campos vazios (exibição de erros) | PASSOU | Todos os 6 erros esperados exibidos |
| Submissão com CPF válido + demais campos | PASSOU | `updateStep` e `navigate('/contratante')` chamados corretamente |
| Submissão com CNPJ válido + demais campos | PASSOU | Sem erros de CPF/CNPJ |
| CPF e CNPJ ambos inválidos | PASSOU | Erro de CPF ou CNPJ exibido |
| CAU inválido | PASSOU | Mensagem de erro de formato CAU exibida |
| Botão "Voltar" | PASSOU | `navigate('/pacote')` chamado |
| Pré-preenchimento via store | PASSOU | Campos populados com dados salvos |
| Máscara de CPF | PASSOU | Formatação `###.###.###-##` aplicada |
| Botão "Continuar" sempre habilitado | PASSOU | RF-04 confirmado |
| Validação CPF — dígito verificador | PASSOU | 11 casos de teste para `validateCpf` |
| Validação CNPJ — dígito verificador | PASSOU | 10 casos de teste para `validateCnpj` |
| Validação CAU — formato regex | PASSOU | 10 casos de teste para `validateCau` |
| Validação email | PASSOU | 10 casos de teste para `validateEmail` |
| Validação telefone (10 e 11 dígitos) | PASSOU | 8 casos de teste para `validatePhone` |

## Resultados dos Testes Unitários

```
Test Files  8 passed (8)
Tests       105 passed (105)
Duration    ~5.6s
```

Arquivos relevantes desta feature:
- `src/utils/validators.test.ts` — 49 testes, todos PASSOU
- `src/pages/architect-form-page.test.tsx` — 12 testes, todos PASSOU

## Performance

- Bundle size (JS): 298.93 kB bruto / **94.48 kB gzipped** — abaixo do limite de 500 KB gzipped
- Anti-patterns encontrados: nenhum
  - Sem re-renders desnecessários (estado local com `useState`, sem contexto desnecessário)
  - Sem chamadas de rede (componente 100% local)
  - Sem bibliotecas duplicadas ou imports desnecessários
- Lighthouse: não executado (aplicação não iniciada durante o QA)

## Vulnerabilidades

- Auditoria executada: Sim (`bun audit`)
- Resultado: **No vulnerabilities found**
- Vulnerabilidades encontradas: 0
- Recomendações: nenhuma

## Acessibilidade (WCAG 2.2)

| Critério | Status | Observação |
|----------|--------|------------|
| `<label>` com `htmlFor` para cada campo | PASSOU | 7 labels associados via `htmlFor` a 7 inputs por `id` correspondente |
| `aria-describedby` nas mensagens de erro | PASSOU | `getFieldProps` retorna `aria-describedby={field}-error` quando há erro após submit |
| `aria-invalid="true"` em campo inválido | PASSOU | Aplicado condicionalmente após submit via `getFieldProps` |
| `<h1>` único na página | PASSOU | Uma única ocorrência de `<h1>` em `architect-form-page.tsx` |
| Navegação por teclado (Tab, Enter) | PASSOU | Form usa `type="submit"` no botão; foco vai para primeiro campo inválido via `fieldRefs` |
| Mensagens de erro com `role="alert"` | PASSOU | Todos os spans de erro têm `role="alert"` |
| Contraste de texto adequado | PASSOU | Labels `#333/branco` (~12.6:1), botão primário `#fff/#1a1a2e` (~16.8:1), erro `#c0392b/branco` (~4.6:1) — todos >= 4.5:1 |
| Outline de foco visível (WCAG 2.4.11) | **BUG** | `outline: none` no `.input` sem compensação via `outline` — ver BUG-01 |
| Imagens com alt text | N/A | Nenhuma imagem na página |
| Formulários com labels associados | PASSOU | Todos os inputs têm label com `htmlFor` correspondente ao `id` |

## Bugs Encontrados

| ID | Severidade | Descrição | Status |
|----|------------|-----------|--------|
| BUG-01 | Baixa | `outline: none` nos inputs sem outline compensatório viola WCAG 2.2 SC 2.4.11 (Focus Appearance) | Aberto |

### BUG-01 — Detalhe

**Arquivo:** `frontend/src/pages/architect-form-page.module.css`, linha 44

**Descrição:** O seletor `.input` define `outline: none`, removendo o indicador de foco padrão do navegador. A compensação atual (mudança de `border-color` no `:focus`) altera a cor da borda de `#ccc` para `#1a1a2e`, mas não satisfaz completamente o critério WCAG 2.2 SC 2.4.11 que exige área mínima de foco e contraste 3:1 entre estados focado e não-focado para o indicador de foco. Em modo de alto contraste do sistema operacional, a mudança de border pode ser ignorada.

**Correção sugerida:**
```css
.input:focus {
  border-color: #1a1a2e;
  outline: 2px solid #1a1a2e;
  outline-offset: 2px;
}
```

**Impacto:** Usuários de teclado em modo de alto contraste podem não perceber qual campo está com foco.

## Verificações de Código

### Conformidade com Tech Spec

| Item | Status | Observação |
|------|--------|------------|
| `ContratoPayload` estendido com 4 campos | PASSOU | `arquiteto_cpf?`, `arquiteto_cnpj?`, `arquiteto_email?`, `arquiteto_telefone?` adicionados como opcionais em `contrato.ts` |
| Rota `/formulario` atualizada em `App.tsx` | PASSOU | `<ArchitectFormPage />` registrado na rota `/formulario` |
| `updateStep('architect', {...})` chamado corretamente | PASSOU | 7 campos enviados ao store |
| Sem novas dependências externas | PASSOU | Máscaras e validações implementadas como funções puras |
| Estado `submitted` controla exibição de erros | PASSOU | Erros só aparecem após primeiro clique em "Continuar" |
| Pré-preenchimento via `steps['architect']` | PASSOU | Lido na inicialização do `useState` |

### Conformidade com Padrões de Código

| Padrão | Status | Observação |
|--------|--------|------------|
| Código em inglês | PASSOU | Variáveis, funções e interfaces em inglês |
| Componente funcional com TypeScript | PASSOU | `ArchitectFormPage` com interfaces tipadas |
| CSS Modules | PASSOU | `architect-form-page.module.css` usado corretamente |
| Funções com early returns | PASSOU | `validateFields` e `handleSubmit` usam early returns |
| Sem flag params | PASSOU | Funções separadas para cada comportamento |
| Sem `console.log` com dados sensíveis | PASSOU | Nenhum log com CPF/CNPJ |

## Conclusão

A implementação da feature **Formulário de Dados do Arquiteto** atende todos os 9 requisitos funcionais do PRD. Os 105 testes unitários passam (105/105), o build é gerado com sucesso (94.48 kB gzipped, abaixo do limite), nenhuma vulnerabilidade foi encontrada nas dependências, e o código segue os padrões definidos na Tech Spec e no CLAUDE.md.

O único problema identificado é de baixa severidade: `outline: none` nos inputs sem compensação adequada de foco visível, que viola parcialmente WCAG 2.2 SC 2.4.11 (Focus Appearance). A correção é trivial (adicionar `outline` no `:focus`) e não bloqueia a aprovação.

**Status final: APROVADO** — todos os requisitos funcionais verificados e funcionando. Recomenda-se corrigir BUG-01 na próxima iteração.
