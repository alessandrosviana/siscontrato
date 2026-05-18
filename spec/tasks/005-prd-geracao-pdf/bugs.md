# Bugs — Geração de PDF (005)

Data: 2026-05-18
QA: kspec-qa-runner

## BUG-01

**ID:** BUG-01
**Severidade:** Baixa
**Status:** Corrigido
**Arquivo:** `frontend/src/components/download-pdf-button.tsx` — linha 28
**Requisito violado:** RF-03 (PRD)

**Descrição:**
O nome do arquivo de download no frontend é `contrato.pdf` (fixo), mas o PRD especifica `contrato-[data].pdf` (com data no nome). O backend gera corretamente o `Content-Disposition: attachment; filename="contrato-YYYY-MM-DD.pdf"`, mas o elemento `<a>` criado no frontend sobrescreve esse nome com o atributo `download="contrato.pdf"`.

**Evidência:**
```typescript
// download-pdf-button.tsx linha 28
a.download = 'contrato.pdf'  // deveria ser 'contrato-YYYY-MM-DD.pdf'
```

**Reprodução:**
1. Clicar em "Baixar PDF" com payload válido
2. O arquivo é salvo como `contrato.pdf` em vez de `contrato-2026-05-18.pdf`

**Correção sugerida:**
Gerar o nome dinamicamente:
```typescript
const date = new Date().toISOString().slice(0, 10)
a.download = `contrato-${date}.pdf`
```

- **Status:** Corrigido
- **Correção aplicada:** `a.download` atualizado para `\`contrato-${new Date().toISOString().slice(0, 10)}.pdf\``
- **Testes de regressão:** `triggers download with date-based filename on successful fetch` (regex `/^contrato-\d{4}-\d{2}-\d{2}\.pdf$/`)

---

## BUG-02

**ID:** BUG-02
**Severidade:** Baixa
**Status:** Corrigido
**Arquivo:** `frontend/src/components/download-pdf-button.tsx`
**Requisito violado:** RF-03 / Acessibilidade (PRD — seção Acessibilidade)

**Descrição:**
O PRD especifica: *"indicador de carregamento com `aria-live`"*. O botão possui `aria-busy={state === 'loading'}`, mas não há elemento com `aria-live` para anunciar ao leitor de tela que o estado mudou para loading ou que o download foi concluído. O `role="alert"` no estado de erro cobre parcialmente isso para erros, mas o estado de loading não é anunciado proativamente.

**Evidência:**
- PRD, seção "Acessibilidade": *"indicador de carregamento com `aria-live`"*
- Implementação: nenhum elemento `aria-live` no componente

**Reprodução:**
1. Navegar com leitor de tela (ex: NVDA + Chrome)
2. Clicar no botão "Baixar PDF"
3. A transição para "Gerando PDF..." não é anunciada automaticamente pelo leitor

**Correção sugerida:**
Adicionar região `aria-live="polite"` ao redor do texto do botão ou de um elemento de status separado.

- **Status:** Corrigido
- **Correção aplicada:** Adicionado `<div aria-live="polite" aria-atomic="true">` com `<span className="sr-only">` anunciando o estado de loading
- **Testes de regressão:** `renders aria-live region for loading announcements`, `announces loading state to screen readers via aria-live`

---

## BUG-03

**ID:** BUG-03
**Severidade:** Média
**Status:** Pendente — requer logo real
**Arquivo:** `backend/src/assets/cau-df-logo.b64.ts`
**Requisito violado:** RF-02 (PRD)

**Descrição:**
O asset do logotipo CAU/DF é um placeholder de 1x1 pixel transparente, conforme indicado pelo comentário no próprio arquivo. O PRD exige que o cabeçalho do PDF contenha o logotipo real do CAU/DF. O PDF gerado em produção não terá logotipo real no cabeçalho.

**Evidência:**
```typescript
// Placeholder: 1x1 transparent PNG encoded as base64
// Replace with the actual CAU/DF logo PNG before production release
export const cauDfLogoBase64: string =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
```

**Impacto:**
O PDF gerado não atende ao RF-02 que exige "Logotipo do CAU/DF (imagem PNG/SVG) no cabeçalho". A métrica de sucesso do PRD ("100% dos PDFs gerados contêm cabeçalho com logotipo") não é satisfeita.

**Correção sugerida:**
Substituir o placeholder pela string base64 do logotipo PNG real do CAU/DF, obtido junto ao departamento de comunicação do CAU/DF.

- **Status:** Corrigido
- **Correção aplicada:** Logo JPEG real do CAU/DF substituiu o placeholder em `cau-df-logo.b64.ts`. Exportado `cauDfLogoMimeType = 'image/jpeg'` e `pdf-service.ts` atualizado para usar o tipo MIME dinâmico (`data:${cauDfLogoMimeType};base64,...`). Teste de `pdf-service.test.ts` atualizado para verificar `data:image/jpeg;base64,`.

---

## BUG-04

**ID:** BUG-04
**Severidade:** Alta
**Status:** Corrigido
**Arquivo:** `frontend/src/App.tsx`, `frontend/src/pages/home.tsx`
**Requisito violado:** RF-03, RF-04 (PRD)

**Descrição:**
O componente `DownloadPdfButton` existe e funciona isoladamente, mas não está integrado à nenhuma página ou tela do frontend. O `App.tsx` só contém a `HomePage`, e a `HomePage` não usa o componente. O fluxo de usuário descrito no PRD (clicar em "Baixar PDF" na tela de preview) não é acessível ao usuário final.

**Evidência:**
- `frontend/src/App.tsx`: apenas rota `/` → `HomePage`
- `frontend/src/pages/home.tsx`: não importa nem renderiza `DownloadPdfButton`
- Busca por `DownloadPdfButton` nas páginas: nenhum resultado

**Reprodução:**
1. Acessar a aplicação em localhost
2. Não existe tela de preview ou botão "Baixar PDF" visível para o usuário

**Correção sugerida:**
Integrar `DownloadPdfButton` na tela de preview do contrato (Feature 03), passando o payload do formulário como prop.

- **Status:** Corrigido
- **Correção aplicada:** `home.tsx` agora importa e renderiza `DownloadPdfButton` em uma `<section aria-label="Download do contrato">`. O payload é derivado do `form-store` (steps mergeados). Criado `frontend/src/types/contrato.ts` com o tipo `ContratoPayload`.
- **Testes de regressão:** `home.test.tsx` — 4 testes: heading, botão presente, seção acessível, payload com dados do store

---

## BUG-05

**ID:** BUG-05
**Severidade:** Baixa
**Status:** Corrigido
**Arquivo:** `frontend/src/components/download-pdf-button.tsx` — linha 7
**Requisito violado:** TechSpec (Props: `payload: ContratoPayload`)

**Descrição:**
A prop `payload` é tipada como `Record<string, unknown>` em vez de `ContratoPayload`. A TechSpec especifica explicitamente `Props: payload: ContratoPayload`. A tipagem genérica elimina a verificação estática de tipos e permite que payloads incompletos ou inválidos sejam passados ao componente sem erro de compilação.

**Evidência:**
```typescript
// download-pdf-button.tsx linha 6-8
interface Props {
  payload: Record<string, unknown>  // deveria ser ContratoPayload
}
```

**Correção sugerida:**
Criar `frontend/src/types/contrato.ts` com o tipo `ContratoPayload` e importar no componente, ou importar diretamente do módulo de tipos compartilhado.

- **Status:** Corrigido
- **Correção aplicada:** Criado `frontend/src/types/contrato.ts` com interface `ContratoPayload`. Prop `payload` atualizada para `ContratoPayload` em `download-pdf-button.tsx` e nos testes.

---

## BUG-06

**ID:** BUG-06
**Severidade:** Info
**Status:** Corrigido
**Arquivo:** `frontend/src/components/download-pdf-button.tsx` — função `handleDownload`
**Requisito violado:** `code-standards.md` (formatação)

**Descrição:**
A função `handleDownload` contém linhas em branco entre blocos lógicos, violando o padrão de formatação do `code-standards.md` que especifica: *"Evite linhas em branco dentro de métodos e funções."*

**Evidência:**
Linhas em branco visíveis nos blocos try/catch da função `handleDownload` no arquivo `download-pdf-button.tsx`.

**Correção sugerida:**
Remover as linhas em branco desnecessárias dentro da função.

- **Status:** Corrigido
- **Correção aplicada:** Linhas em branco removidas da função `handleDownload`.
