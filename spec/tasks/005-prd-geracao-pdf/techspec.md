# Tech Spec — Geração de PDF do Contrato (005)

## Resumo Executivo

A feature adiciona um novo serviço de conversão HTML → PDF usando Puppeteer (Chrome headless). O fluxo reutiliza `generateHtml` da Feature 03 para produzir o HTML do contrato e repassa esse HTML ao novo `pdf-service`, que abre uma instância do Chrome, renderiza a página com cabeçalho/rodapé institucionais e retorna o buffer PDF diretamente como `application/pdf`. No frontend, um botão na tela de preview envia o payload e aciona o download nativo do navegador. Nenhum arquivo é persistido no servidor.

## Arquitetura do Sistema

### Visão Geral dos Componentes

| Componente | Responsabilidade |
|---|---|
| `routes/pdf.ts` *(novo)* | Valida payload, orquestra chamada ao service, retorna resposta PDF |
| `services/pdf-service.ts` *(novo)* | Abre browser, injeta HTML + assets, gera buffer PDF via Puppeteer |
| `services/contratos-service.ts` *(existente)* | Fornece `generateHtml(payload)` — reutilizado sem alteração |
| `assets/cau-df-logo.b64.ts` *(novo)* | Exporta o logo CAU/DF como string base64 para embutir no HTML |
| `index.ts` *(modificado)* | Registra `pdfRouter` em `/api` |
| `DownloadPdfButton` *(novo — frontend)* | Envia payload ao endpoint, aciona download, gerencia estados |

**Fluxo de dados:**

```
Frontend → POST /api/pdf/gerar (ContratoPayload)
  → pdf.ts valida com Zod
  → contratos-service.generateHtml(payload) → htmlString
  → pdf-service.generatePdf(htmlString) → Buffer
  → response Content-Type: application/pdf
Frontend recebe buffer → download automático
```

## Design de Implementação

### Interfaces Principais

```typescript
// services/pdf-service.ts
interface PdfOptions {
  headerHtml: string
  footerHtml: string
}

function generatePdf(html: string): Promise<Buffer>
```

```typescript
// routes/pdf.ts — resposta de erro
{ error: string }  // status 400

// resposta de sucesso: binary buffer, Content-Type: application/pdf
```

### Modelos de Dados

- **Request:** `ContratoPayload` — mesmo schema Zod já definido em `routes/contratos.ts`. Reutilizar o `ContratoPayloadSchema` exportado.
- **Response (sucesso):** buffer binário PDF com headers:
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="contrato-YYYY-MM-DD.pdf"`
- **Response (erro):** `{ error: string }` — status 400.

### Endpoints de API

| Método | Caminho | Descrição |
|---|---|---|
| `POST` | `/api/pdf/gerar` | Recebe `ContratoPayload`, retorna PDF como download |

### Puppeteer — decisões de implementação

**Instância do browser:** uma instância lançada por requisição (`puppeteer.launch → page → pdf → browser.close`). Aceitável para o volume do MVP (uso individual, não concorrente).

**Chrome executável:** usar `puppeteer-core` + caminho do Chrome instalado na máquina via variável de ambiente `CHROME_PATH`. Fallback para o binário padrão do sistema. Evita baixar o Chromium bundled (~300 MB).

**Cabeçalho e rodapé:** passados via `page.pdf({ headerTemplate, footerTemplate, displayHeaderFooter: true })`. O Puppeteer suporta HTML nesses campos com classes especiais `.pageNumber` e `.totalPages` para paginação automática.

**Logo base64:** o arquivo PNG do logo é convertido para base64 uma vez (em `assets/cau-df-logo.b64.ts`) e importado como constante — sem I/O em runtime. O `src` da `<img>` no `headerTemplate` usa `data:image/png;base64,...`.

**Formato do PDF:**
```
format: 'A4'
printBackground: true
margin: { top: '80px', bottom: '80px', left: '60px', right: '60px' }
```

**Timeout:** `timeout: 30_000` ms no `page.pdf()`.

### Componente Frontend — `DownloadPdfButton`

```typescript
// Localização: frontend/src/components/download-pdf-button.tsx
// Props: payload: ContratoPayload
// Estados internos: idle | loading | error
```

Ao clicar, faz `fetch('POST /api/pdf/gerar', payload)`, recebe o blob, cria uma URL de objeto e aciona `<a download>` programaticamente. Após o download, bloqueia o formulário via `useFormStore`.

## Pontos de Integração

- **`contratos-service.generateHtml`** — chamado internamente pelo `pdf-service`. Nenhuma alteração necessária.
- **`ContratoPayloadSchema`** — exportado de `routes/contratos.ts` e importado em `routes/pdf.ts` para evitar duplicação.
- **Chrome instalado** — `pdf-service` lê `process.env.CHROME_PATH`; sem essa variável, usa o executável padrão do Puppeteer.

## Verificações Técnicas

### Segurança

- Payload validado com o mesmo schema Zod do endpoint de preview — nenhuma entrada não validada chega ao Puppeteer.
- O HTML gerado vem de `generateHtml` (função interna controlada), não de input de usuário livre — risco de XSS via Puppeteer é baixo.
- Nenhum arquivo escrito em disco; buffer em memória descartado após o envio.

### Arquitetura

- `pdf-service` é stateless — sem singleton de browser para o MVP. Simplifica tratamento de falhas: se o browser travar, a próxima requisição abre um novo.
- Separação clara: `pdf.ts` não conhece Puppeteer; `pdf-service.ts` não conhece Hono.
- `ContratoPayloadSchema` exportado de `contratos.ts` — única fonte de verdade para o schema.

### Infraestrutura

- **Dependência nova:** `puppeteer-core` (produção). Chrome já instalado na máquina.
- **Variável de ambiente:** `CHROME_PATH` — opcional, com fallback.
- **Memória:** geração de PDF com Puppeteer usa ~150–300 MB temporariamente. Aceitável para uso MVP.

## Abordagem de Testes

### Testes Unitários

`services/pdf-service.test.ts` — mockar `puppeteer-core`:
- Verifica que `browser.newPage`, `page.setContent`, `page.pdf`, `browser.close` são chamados.
- Verifica que o buffer retornado é um `Buffer`.
- Verifica que `browser.close` é chamado mesmo em caso de erro (finally).

### Testes de Integração

`routes/pdf.test.ts` — mockar `pdf-service.generatePdf`:
- `POST /api/pdf/gerar` com payload válido → status 200, `Content-Type: application/pdf`.
- `POST /api/pdf/gerar` com campo faltando → status 400, `body.error` definido.
- `POST /api/pdf/gerar` quando `generatePdf` lança erro → status 400, `console.error` chamado.

### Testes E2E

Não aplicável para o MVP — feature é backend puro com download de arquivo.

## Sequenciamento de Desenvolvimento

1. **`assets/cau-df-logo.b64.ts`** — adicionar logo PNG e gerar o módulo base64 (sem dependências).
2. **`services/pdf-service.ts`** — lógica Puppeteer isolada, testável com mocks.
3. **`routes/pdf.ts`** — rota Hono que orquestra service + resposta binária.
4. **`index.ts`** — registrar `pdfRouter`.
5. **`frontend/src/components/download-pdf-button.tsx`** — botão com fetch + download + bloqueio de formulário.
6. **Testes** — unitários do service, integração da rota.

### Dependências Técnicas

- `puppeteer-core` instalado via `bun add puppeteer-core`.
- Chrome instalado na máquina de execução.
- Feature 03 (`contratos-service.generateHtml`) concluída — já está.

## Monitoramento e Observabilidade

### Logging Estruturado

```typescript
// Início da geração
console.log('PDF generation started')

// Erro na geração
console.error('PDF generation failed', { error: err instanceof Error ? err.message : 'Unknown error' })
```

Não logar payload (contém dados do cliente — PII).

### Métricas de Negócio

Não aplicável no MVP — sem infraestrutura de métricas.

## Considerações Técnicas

### Decisões Principais

| Decisão | Escolha | Alternativa rejeitada | Motivo |
|---|---|---|---|
| Biblioteca PDF | `puppeteer-core` | `jsPDF + html2canvas` | Fidelidade CSS superior; sem reescrever o template HTML |
| Chrome | Instalado na máquina (`CHROME_PATH`) | Chromium bundled do Puppeteer | Evita +300 MB no repositório/imagem |
| Header/footer | `headerTemplate/footerTemplate` do Puppeteer | CSS `@page` | Suporte nativo a `.pageNumber`/`.totalPages`; mais simples |
| Logo | Base64 embutido | Arquivo estático via `file://` | Sem dependência de path em runtime; portátil |
| Instância browser | Por requisição | Singleton compartilhado | MVP de uso individual; simplifica tratamento de falha |

### Riscos Conhecidos

- **Puppeteer + Bun:** compatibilidade testada em projetos Node.js; Bun tem compatibilidade Node.js API. Risco baixo, mas validar na instalação.
- **Latência de geração:** 2–5s por PDF. Frontend deve comunicar estado de carregamento (já previsto no PRD).
- **Path do Chrome em CI/CD:** se o projeto for executado em servidor sem Chrome, será necessário instalar `chromium` ou usar imagem Docker com Chrome.

### Conformidade com Padrões

- `code-standards.md`: funções nomeadas com verbo (`generatePdf`), early returns, sem flag params.
- `logging.md`: `console.log` para informações, `console.error` para erros; sem dados do payload nos logs.
- CLAUDE.md: usar `bun add` para instalar dependência; framework Hono mantido.

### Arquivos Relevantes e Dependentes

**Novos:**
- `backend/src/routes/pdf.ts`
- `backend/src/routes/pdf.test.ts`
- `backend/src/services/pdf-service.ts`
- `backend/src/services/pdf-service.test.ts`
- `backend/src/assets/cau-df-logo.b64.ts`
- `frontend/src/components/download-pdf-button.tsx`

**Modificados:**
- `backend/src/index.ts` — registrar `pdfRouter`
- `backend/src/routes/contratos.ts` — exportar `ContratoPayloadSchema`
- `backend/package.json` — adicionar `puppeteer-core`
