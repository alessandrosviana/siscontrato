# Tarefa 2.0: Serviço PDF — pdf-service.ts

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 1.0 (puppeteer-core instalado, logo base64 disponível)

## Estimativa

- **Tamanho**: M
- **Horas estimadas**: 2–4h

## Visão Geral

Implementa `backend/src/services/pdf-service.ts` com a função `generatePdf(html: string): Promise<Buffer>`. Esta função usa Puppeteer para abrir uma instância do Chrome, renderizar o HTML do contrato com cabeçalho e rodapé institucionais do CAU/DF e retornar o PDF como Buffer em memória.

<skills>
### Conformidade com Skills Padrões

- **code-standards.md**: função nomeada com verbo (`generatePdf`), early returns, sem flag params, sem efeitos colaterais desnecessários.
- **logging.md**: `console.log` no início, `console.error` em falhas; sem dados de payload nos logs.
- **Código-fonte**: inglês.
</skills>

<requirements>
- Função `generatePdf(html: string): Promise<Buffer>` exportada de `pdf-service.ts`.
- Usa `puppeteer-core`. Lê `process.env.CHROME_PATH` para o executável; se ausente, usa o padrão do Puppeteer.
- `page.pdf()` chamado com `format: 'A4'`, `printBackground: true`, `displayHeaderFooter: true`, `headerTemplate` com logo CAU/DF em base64 e título, `footerTemplate` com aviso institucional e `.pageNumber`/`.totalPages`.
- Margens: `top: '80px', bottom: '80px', left: '60px', right: '60px'`.
- `timeout: 30_000` ms.
- `browser.close()` chamado em `finally` — garantia de não vazar instâncias de Chrome.
- Log `console.log('PDF generation started')` no início.
- Log `console.error('PDF generation failed', { error: ... })` em caso de exceção.
- Testes unitários com mock de `puppeteer-core`.
</requirements>

## Subtarefas

- [ ] 2.1 Criar `backend/src/services/pdf-service.ts` com função `generatePdf`
- [ ] 2.2 Implementar `headerTemplate` com logo base64 (`cauDfLogoBase64`) e título do documento
- [ ] 2.3 Implementar `footerTemplate` com aviso CAU/DF, `.pageNumber` e `.totalPages`
- [ ] 2.4 Garantir `browser.close()` em bloco `finally`
- [ ] 2.5 Criar `backend/src/services/pdf-service.test.ts` com testes unitários mockando `puppeteer-core`
- [ ] 2.6 Executar `bun test` — todos os testes passando

## Detalhes de Implementação

Ver seção **Puppeteer — decisões de implementação** e **Abordagem de Testes — Testes Unitários** na techspec.md.

O `headerTemplate` e `footerTemplate` do Puppeteer são HTML puro. Para paginação automática, usar as classes especiais:
- `<span class="pageNumber"></span>` — número da página atual
- `<span class="totalPages"></span>` — total de páginas

Atenção: o CSS dentro de `headerTemplate`/`footerTemplate` é isolado. Usar `font-size` explícito (Puppeteer ignora estilos da página principal nesses templates).

## Critérios de Sucesso

- `generatePdf('<html>...</html>')` retorna um `Buffer` (não lança exceção com HTML válido).
- `browser.close()` é chamado mesmo quando `page.pdf()` lança erro.
- Testes unitários passam com Puppeteer mockado.
- `bun test` passa (todos os testes existentes + novos).

## Testes da Tarefa

- [ ] Testes de unidade (`pdf-service.test.ts`):
  - Mock `puppeteer-core`: `launch`, `newPage`, `setContent`, `pdf`, `close`
  - `generatePdf` chama `page.setContent(html)` com o HTML passado
  - `generatePdf` chama `page.pdf()` com as opções corretas (format, margins, headerTemplate)
  - `generatePdf` chama `browser.close()` no finally (inclusive quando `pdf()` lança erro)
  - `generatePdf` retorna um `Buffer`
- [ ] Testes de integração: não aplicável nesta task (coberto na task 3.0)
- [ ] Testes E2E: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `backend/src/services/pdf-service.ts` — novo arquivo
- `backend/src/services/pdf-service.test.ts` — novo arquivo
- `backend/src/assets/cau-df-logo.b64.ts` — importado pelo service
