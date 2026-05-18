# Relatório de Bugfix — Geração de PDF (005)

Data: 2026-05-18
Branch: 006-bugfix-geracao-pdf

## Resumo

- Total de Bugs: 6
- Bugs Corrigidos: 6
- Bugs Pendentes: 0
- Testes de Regressão Criados: 6

## Detalhes por Bug

| ID | Severidade | Status | Correção | Testes Criados |
|----|------------|--------|----------|----------------|
| BUG-04 | Alta | Corrigido | `home.tsx` integra `DownloadPdfButton` com payload do form-store | `home.test.tsx` — 4 testes |
| BUG-03 | Média | Corrigido | Logo JPEG real do CAU/DF substituiu placeholder; MIME type dinâmico em `pdf-service.ts` | Teste atualizado: `data:image/jpeg;base64,` |
| BUG-01 | Baixa | Corrigido | `a.download` usa data dinâmica: `contrato-YYYY-MM-DD.pdf` | `triggers download with date-based filename` |
| BUG-02 | Baixa | Corrigido | Adicionado `<div aria-live="polite">` com anúncio de loading | `renders aria-live region`, `announces loading state` |
| BUG-05 | Baixa | Corrigido | Prop tipada como `ContratoPayload`, criado `types/contrato.ts` | Todos os testes de `download-pdf-button.test.tsx` usam `ContratoPayload` |
| BUG-06 | Info | Corrigido | Linhas em branco removidas de `handleDownload` | — (conformidade de formatação) |

## Arquivos Modificados

- `frontend/src/components/download-pdf-button.tsx` — BUG-01, BUG-02, BUG-05, BUG-06
- `frontend/src/components/download-pdf-button.test.tsx` — atualizado testPayload + 2 novos testes
- `frontend/src/pages/home.tsx` — BUG-04: integração do botão
- `frontend/src/pages/home.test.tsx` — novo: 4 testes de regressão para BUG-04
- `frontend/src/types/contrato.ts` — novo: interface `ContratoPayload`
- `spec/tasks/005-prd-geracao-pdf/bugs.md` — status atualizado

## Testes

- Testes de frontend: 18 PASSANDO (3 arquivos: download-pdf-button.test.tsx, home.test.tsx, + outros)
- Testes de backend: 69 PASSANDO (7 arquivos)
- Lint: SEM ERROS
- Tipagem: SEM ERROS
- Build: SEM ERROS
