# Relatório de QA - Geração de PDF de Contratos (005)

## Resumo

- Data: 2026-05-18
- Status: REPROVADO
- Total de Requisitos: 4 (RF-01, RF-02, RF-03, RF-04)
- Requisitos Atendidos: 2 (RF-01, parcial RF-02)
- Requisitos com falha: 2 (RF-03 integração ausente, RF-04 não acessível ao usuário)
- Bugs Encontrados: 6
- Testes Executados: 81 (69 backend + 12 frontend)
- Testes Passando: 81 (100%)

---

## Requisitos Verificados

| ID | Requisito | Status | Evidência |
|----|-----------|--------|-----------|
| RF-01 | POST /api/pdf/gerar retorna application/pdf | PASSOU | Teste `pdf.test.ts`: status 200, Content-Type: application/pdf; Content-Disposition com contrato-YYYY-MM-DD.pdf |
| RF-02 | Layout com cabeçalho logo CAU/DF + rodapé institucional + numeração de páginas | PARCIAL | Estrutura HTML do header/footer correta; `displayHeaderFooter: true`; `.pageNumber` e `.totalPages` presentes. FALHA: logo é placeholder 1x1 transparente (BUG-03) |
| RF-03 | Botão "Baixar PDF" com estados loading/error | PARCIAL | Componente `DownloadPdfButton` implementado com os 3 estados corretos. FALHA: componente não integrado à nenhuma página do frontend (BUG-04); nome do arquivo `contrato.pdf` sem data (BUG-01) |
| RF-04 | Formulário finalizado após download (isFinalized) | PARCIAL | `finalizeForm()` e `isFinalized` implementados no store e testados. FALHA: não acessível ao usuário pois o componente não está integrado à UI (BUG-04) |

---

## Testes E2E com TestSprite MCP

TestSprite MCP não foi executado. A TechSpec documenta explicitamente: *"Testes E2E: Não aplicável para o MVP — feature é backend puro com download de arquivo."* Os testes unitários e de integração cobrem os cenários previstos.

---

## Testes Unitários e de Integração Executados

| Conjunto | Arquivo | Total | Passando | Falhando |
|----------|---------|-------|----------|----------|
| Backend — Service | `pdf-service.test.ts` | 11 | 11 | 0 |
| Backend — Rota | `pdf.test.ts` | 5 | 5 | 0 |
| Backend — Demais | outros 5 arquivos | 53 | 53 | 0 |
| Frontend — Botão | `download-pdf-button.test.tsx` | 6 | 6 | 0 |
| Frontend — Store | form-store e outros | 6 | 6 | 0 |
| **Total** | | **81** | **81** | **0** |

Comando usado: `bun run test` (via `vitest run`) em `backend/` e `frontend/`.

Nota: `bun test` (runner nativo do Bun) não deve ser usado — o runner nativo não expõe `vi.stubGlobal` e falha nos testes do frontend. O script `"test": "vitest run"` no `package.json` está correto e deve ser acionado sempre via `bun run test`.

---

## Cobertura de Cenários

| Cenário | Coberto por Teste | Resultado |
|---------|-------------------|-----------|
| Payload válido → status 200, PDF binário | `pdf.test.ts` | PASSOU |
| Content-Disposition com nome do arquivo | `pdf.test.ts` | PASSOU |
| Campo faltando → status 400 com body.error | `pdf.test.ts` | PASSOU |
| Body inválido (não JSON) → status 400 | `pdf.test.ts` | PASSOU |
| generatePdf lança erro → status 400 + console.error | `pdf.test.ts` | PASSOU |
| generatePdf retorna Buffer | `pdf-service.test.ts` | PASSOU |
| page.setContent chamado com HTML correto | `pdf-service.test.ts` | PASSOU |
| PDF formato A4, printBackground true | `pdf-service.test.ts` | PASSOU |
| displayHeaderFooter true | `pdf-service.test.ts` | PASSOU |
| Margens corretas (80px/60px) | `pdf-service.test.ts` | PASSOU |
| headerTemplate com data URI base64 e título | `pdf-service.test.ts` | PASSOU |
| footerTemplate com .pageNumber e .totalPages | `pdf-service.test.ts` | PASSOU |
| footerTemplate com aviso CAU/DF | `pdf-service.test.ts` | PASSOU |
| Timeout 30000ms | `pdf-service.test.ts` | PASSOU |
| browser.close chamado no finally (erro) | `pdf-service.test.ts` | PASSOU |
| browser.close chamado no finally (sucesso) | `pdf-service.test.ts` | PASSOU |
| browser.newPage chamado uma vez | `pdf-service.test.ts` | PASSOU |
| Render inicial "Baixar PDF" | `download-pdf-button.test.tsx` | PASSOU |
| Loading: botão desabilitado, texto correto | `download-pdf-button.test.tsx` | PASSOU |
| Sucesso: download acionado | `download-pdf-button.test.tsx` | PASSOU |
| Erro de servidor: role="alert" exibido | `download-pdf-button.test.tsx` | PASSOU |
| Erro de rede: role="alert" exibido | `download-pdf-button.test.tsx` | PASSOU |
| Sucesso: isFinalized = true no store | `download-pdf-button.test.tsx` | PASSOU |

---

## Performance

- **Bundle frontend (gzip):** 90.37 kB — dentro do limite de 500 KB
- **Bundle frontend (raw):** 283.88 kB
- **Build backend (tsc --noEmit):** sem erros de tipo
- **Build frontend (vite build):** 22 módulos transformados, sem warnings

**Anti-patterns no Frontend:**
- Sem re-renders desnecessários identificados
- `URL.revokeObjectURL` chamado corretamente (sem memory leak)
- Lazy loading: não aplicável (bundle pequeno)

**Anti-patterns no Backend:**
- Sem queries N+1 (sem banco de dados nesta feature)
- Browser Puppeteer aberto por requisição com `finally` garantindo `browser.close` — sem leak de processos
- Sem operações bloqueantes no event loop além da geração do PDF (esperado e documentado)

**Lighthouse:** não executado — aplicação não possui tela de preview acessível no frontend para análise de Core Web Vitals (BUG-04).

---

## Vulnerabilidades

- Auditoria executada: Sim (`bun audit`)
- Backend: nenhuma vulnerabilidade encontrada
- Frontend: nenhuma vulnerabilidade encontrada
- Recomendações: nenhuma

---

## Acessibilidade — WCAG 2.2

| Critério | Status | Observações |
|----------|--------|-------------|
| Navegação por teclado (Tab, Enter, Escape) | PASSOU | Botão nativo `<button>` suporta navegação por teclado por padrão |
| Elementos interativos têm labels descritivos | PASSOU | `aria-label="Baixar contrato em PDF"` no botão |
| Imagens têm alt text | N/A | Nenhuma imagem renderizada no frontend desta feature |
| Contraste de cores | N/A | Estilos não definidos no componente (herda do sistema) |
| Formulários têm labels associados | N/A | Não há formulário neste componente |
| Mensagens de erro acessíveis | PASSOU | `<p role="alert">` exibido em estado de erro |
| Indicador de loading com aria-live | FALHOU | PRD especifica `aria-live` para o indicador de carregamento; apenas `aria-busy` foi implementado (BUG-02) |
| Botão desabilitado durante loading | PASSOU | `disabled={state === 'loading'}` e `aria-busy={state === 'loading'}` |

---

## Verificações Visuais

| Componente | Estado | Resultado |
|------------|--------|-----------|
| DownloadPdfButton — idle | "Baixar PDF" habilitado | Implementado corretamente |
| DownloadPdfButton — loading | "Gerando PDF..." desabilitado | Implementado corretamente |
| DownloadPdfButton — error | Mensagem de erro inline + botão reabilitado | Implementado corretamente |
| Integração com tela de preview | Ausente | BUG-04 — componente não integrado à UI |
| Logo no cabeçalho do PDF | Placeholder 1x1 | BUG-03 — logo real ausente |

---

## Bugs Encontrados

Ver detalhes completos em `bugs.md`.

| ID | Severidade | Descrição | Status |
|----|------------|-----------|--------|
| BUG-01 | Baixa | Nome do arquivo de download usa `contrato.pdf` em vez de `contrato-[data].pdf` (RF-03) | Aberto |
| BUG-02 | Baixa | `aria-live` ausente no indicador de loading (PRD — Acessibilidade) | Aberto |
| BUG-03 | Média | Logo CAU/DF é placeholder 1x1 transparente — RF-02 não atendido em produção | Aberto |
| BUG-04 | Alta | `DownloadPdfButton` não integrado à nenhuma página do frontend — RF-03 e RF-04 inacessíveis | Aberto |
| BUG-05 | Baixa | Prop `payload` tipada como `Record<string, unknown>` em vez de `ContratoPayload` | Aberto |
| BUG-06 | Info | Linhas em branco dentro de `handleDownload` — viola `code-standards.md` | Aberto |

---

## Conformidade com TechSpec

| Decisão Técnica | Implementado | Observações |
|-----------------|--------------|-------------|
| `routes/pdf.ts` com validação Zod | SIM | Reutiliza `ContratoPayloadSchema` exportado de `contratos.ts` |
| `services/pdf-service.ts` stateless | SIM | Browser por requisição, `finally` fecha o browser |
| `ContratoPayloadSchema` exportado de `contratos.ts` | SIM | Única fonte de verdade para o schema |
| Logo base64 em `assets/cau-df-logo.b64.ts` | PARCIAL | Arquivo existe mas contém placeholder, não o logo real |
| `pdfRouter` registrado em `index.ts` | SIM | `app.route('/api', pdfRouter)` presente |
| `puppeteer-core` como dependência | SIM | `"puppeteer-core": "^25.0.4"` no `package.json` |
| `CHROME_PATH` via variável de ambiente | SIM | Fallback para opções padrão do Puppeteer |
| Formato A4, margens 80px/60px | SIM | Verificado nos testes |
| Timeout 30000ms | SIM | Verificado nos testes |
| `DownloadPdfButton` com 3 estados | SIM | idle/loading/error implementados |
| Props `payload: ContratoPayload` | PARCIAL | Tipado como `Record<string, unknown>` (BUG-05) |
| Nome do arquivo com data | PARCIAL | Backend correto; frontend usa `contrato.pdf` sem data (BUG-01) |
| Separação: `pdf.ts` não conhece Puppeteer | SIM | Separação correta de responsabilidades |

---

## Conformidade com Code Standards

| Padrão | Status | Observações |
|--------|--------|-------------|
| Código em inglês | OK | Todas as variáveis, funções e interfaces em inglês |
| camelCase para variáveis/funções | OK | `generatePdf`, `handleDownload`, `handleGeneratePdf` |
| PascalCase para interfaces/tipos | OK | `PdfOptions`, `Props`, `DownloadState` |
| kebab-case para arquivos | OK | `pdf-service.ts`, `download-pdf-button.tsx` |
| Funções com verbo no nome | OK | `generatePdf`, `handleDownload`, `finalizeForm` |
| Sem mais de 3 parâmetros | OK | Todos usam 1 parâmetro ou objetos |
| Early returns sem aninhamento excessivo | OK | `handleGeneratePdf` usa early returns |
| Sem flag params | OK | Nenhum identificado |
| Métodos com menos de 50 linhas | OK | `generatePdf` (28 linhas), `handleGeneratePdf` (35 linhas), `handleDownload` (~20 linhas) |
| Sem linhas em branco dentro de funções | PARCIAL | BUG-06: `handleDownload` viola este padrão |
| Sem comentários desnecessários | OK | Apenas o comentário do placeholder do logo (informativo) |
| Uma variável por linha | OK | Sem violações |
| Logging estruturado | OK | `console.log`/`console.error` com objetos estruturados |
| Sem dados sensíveis em logs | OK | Payload não logado |

---

## Conclusão

A feature **005 — Geração de PDF de Contratos** está **REPROVADA** para release em produção por conta de 1 bug de Alta severidade (BUG-04) e 1 bug de Média severidade (BUG-03).

O backend está completo, testado e bem implementado: o endpoint `POST /api/pdf/gerar` funciona corretamente, valida o payload via Zod, gera o PDF com Puppeteer, e retorna o buffer com os headers corretos. Todos os 69 testes do backend passam.

O frontend tem o componente `DownloadPdfButton` implementado com os 3 estados (idle/loading/error), acessibilidade parcial e testes aprovados. No entanto, o componente não está integrado à nenhuma tela da aplicação, tornando os requisitos RF-03 e RF-04 completamente inacessíveis ao usuário final.

Adicionalmente, o logotipo real do CAU/DF ainda não foi incorporado ao projeto — o asset atual é um placeholder de 1x1 pixel transparente que não satisfaz o RF-02.

**Ações obrigatórias antes de aprovação:**
1. Corrigir BUG-04: integrar `DownloadPdfButton` à tela de preview do contrato
2. Corrigir BUG-03: substituir o placeholder pelo logotipo real do CAU/DF

**Ações recomendadas (não bloqueantes):**
3. Corrigir BUG-01: usar `contrato-YYYY-MM-DD.pdf` no `a.download`
4. Corrigir BUG-02: adicionar `aria-live="polite"` ao indicador de loading
5. Corrigir BUG-05: tipar `payload` como `ContratoPayload`
6. Corrigir BUG-06: remover linhas em branco dentro de `handleDownload`
