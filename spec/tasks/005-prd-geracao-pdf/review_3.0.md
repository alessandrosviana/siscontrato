# Relatório de Code Review — Rota POST /api/pdf/gerar (Task 3.0)

## Resumo

- Data: 2026-05-18
- Branch: n/a (repositório sem git configurado no diretório analisado)
- Status: APROVADO COM RESSALVAS
- Arquivos Modificados: 4
  - `backend/src/routes/pdf.ts` (novo)
  - `backend/src/routes/pdf.test.ts` (novo)
  - `backend/src/index.ts` (modificado)
  - `backend/src/services/pdf-service.test.ts` (corrigido)
- Linhas Adicionadas: ~170
- Linhas Removidas: 0

---

## Conformidade com Rules

| Rule | Status | Observações |
|------|--------|-------------|
| Idioma inglês no código-fonte | OK | Todas as variáveis e funções estão em inglês. Mensagens de erro ao usuário em português são aceitáveis por serem strings de resposta de negócio, não nomenclatura de código |
| camelCase para variáveis e funções | OK | `handleGeneratePdf`, `pdfBuffer`, `pdfRouter` — correto |
| PascalCase para classes e interfaces | OK | Não há classes novas; `Context` usado via import do Hono |
| kebab-case para arquivos e diretórios | OK | `pdf.ts`, `pdf.test.ts`, `pdf-service.ts` |
| Funções começam com verbo | OK | `handleGeneratePdf`, `generatePdf`, `generateHtml` |
| Sem mais de 3 parâmetros | OK | Todas as funções usam no máximo 1 parâmetro |
| Early returns para erros | OK | JSON parse inválido → return imediato; Zod inválido → return imediato |
| Sem linhas em branco dentro de funções | NOK | `handleGeneratePdf` em `pdf.ts` possui linhas em branco entre os blocos (linhas 15→16, 18→19, 22→23, 28→29) |
| Sem comentários desnecessários | OK | Nenhum comentário redundante |
| Uma variável por linha | OK | Sem violações |
| Variáveis declaradas perto do uso | OK | `date` declarada imediatamente antes de ser usada |
| Funções com menos de 50 linhas | OK | `handleGeneratePdf` tem ~25 linhas |
| Sem flag parameters | OK | Sem flag params |
| Sem efeitos colaterais em queries | OK | Handler apenas orquestra chamadas sem efeitos colaterais implícitos |
| Logging: console.error no catch | OK | `console.error('PDF generation failed', { error: ... })` |
| Logging: sem dados sensíveis (PII) | OK | Apenas a mensagem de erro é logada, nenhum dado do payload |
| Logging: mensagens claras e estruturadas | OK | Segue o padrão com objeto estruturado como segundo argumento |

---

## Verificacao de Seguranca

| Item | Status | Observações |
|------|--------|-------------|
| Inputs validados com biblioteca de validação | OK | `ContratoPayloadSchema.safeParse` com Zod antes de qualquer processamento |
| Endpoint protegido com autenticação | N/A | MVP sem autenticação — comportamento consistente com o restante da API |
| CORS configurado corretamente | OK | Configurado globalmente em `index.ts` com origens explícitas via `env.CORS_ORIGIN` |
| Sem secrets/API keys hardcoded | OK | `CHROME_PATH` lido de `process.env` |
| Erros não vazam stack traces para o cliente | OK | Apenas `err.message` é exposto ao cliente, nunca o stack |
| Sem HTML não sanitizado renderizado | N/A | Backend puro, sem renderização no servidor |
| Queries parametrizadas | N/A | Sem banco de dados nesta rota |
| Rate limiting em endpoints sensíveis | N/A | MVP sem rate limiting — consistente com o restante da API |
| Headers de segurança configurados | N/A | Não tratado nesta tarefa; CORS está configurado globalmente |
| Dados sensíveis (PII) não aparecem em logs | OK | Nenhum dado do payload é logado |

---

## Aderência à TechSpec

| Decisão Técnica | Implementado | Observações |
|-----------------|--------------|-------------|
| `routes/pdf.ts` com `pdfRouter` exportado | SIM | Export nomeado correto |
| Valida payload com `ContratoPayloadSchema` importado de `contratos.ts` | SIM | Reutiliza única fonte de verdade |
| Parse JSON em try/catch separado (padrão `contratos.ts`) | SIM | Mesmo padrão de `handleGenerate` em `contratos.ts` |
| Retorna 400 + `{ error }` em caso de JSON inválido | SIM | Mensagem em português adequada para o cliente |
| Retorna 400 + `{ error }` em caso de falha de validação Zod | SIM | `result.error.message` retornado |
| Chama `generateHtml(payload)` + `generatePdf(html)` em sequência | SIM | Fluxo correto |
| Resposta com `Content-Type: application/pdf` | SIM | Header correto |
| Resposta com `Content-Disposition: attachment; filename="contrato-YYYY-MM-DD.pdf"` | SIM | Data formatada via `new Date().toISOString().slice(0, 10)` |
| Body da resposta: buffer binário do PDF | SIM | `new Uint8Array(pdfBuffer)` passado para `new Response(...)` |
| Erro no service: `console.error('PDF generation failed', ...)` + 400 + `{ error }` | SIM | Implementado corretamente |
| `pdfRouter` registrado em `index.ts` com `app.route('/api', pdfRouter)` | SIM | Linha 23 de `index.ts` |
| Separação de responsabilidades: `pdf.ts` não conhece Puppeteer | SIM | Apenas chama `generatePdf` do service |
| Logging: `console.log('PDF generation started')` no início | Parcial | O log de início está no `pdf-service.ts`, não em `pdf.ts`. Tecnicamente correto pela TechSpec (seção Logging Estruturado aponta para o service), mas vale observar |

---

## Tasks Verificadas

| Task | Status | Observações |
|------|--------|-------------|
| 3.1 Criar `pdf.ts` com `pdfRouter` e handler `POST /pdf/gerar` | COMPLETA | Arquivo criado corretamente |
| 3.2 Implementar validação de JSON e Zod (padrão de `contratos.ts`) | COMPLETA | Dois try/catch separados, igual ao padrão |
| 3.3 Montar resposta binária com headers `Content-Type` e `Content-Disposition` | COMPLETA | `new Response(new Uint8Array(pdfBuffer), { headers: {...} })` |
| 3.4 Registrar `pdfRouter` em `backend/src/index.ts` | COMPLETA | `app.route('/api', pdfRouter)` na linha 23 |
| 3.5 Criar `pdf.test.ts` com testes de integração (mock do `pdf-service`) | COMPLETA | 4 cenários implementados |
| 3.6 Executar `bun test` — todos os testes passando | COMPLETA | 68/68 passando |

---

## Testes

- Total de Testes: 68
- Passando: 68
- Falhando: 0
- Arquivos de teste: 7

### Cobertura dos Cenários (pdf.test.ts)

| Cenário | Coberto |
|---------|---------|
| Payload válido → 200 + `application/pdf` | SIM |
| Campo obrigatório faltando → 400 + `body.error` string | SIM |
| Body não-JSON → 400 + `body.error` string | SIM |
| `generatePdf` lança erro → 400 + `console.error` chamado | SIM |
| `Content-Disposition` header verificado | NAO — ver Problemas Encontrados |

---

## Problemas Encontrados

| Severidade | Arquivo | Linha | Descrição | Sugestão |
|------------|---------|-------|-----------|----------|
| Alta | `src/services/pdf-service.test.ts` | 67, 74, 81 | `bun run build` (`tsc --noEmit`) falha com 6 erros TypeScript. `mockPage.pdf.mock.calls[0][0]` é inferido como `undefined` porque `vi.fn<() => Promise<Buffer>>()` define apenas o tipo de retorno, sem declarar os parâmetros — o TypeScript infere `calls` como tupla de tamanho 0. O cast `as Record<string, string>` não resolve a raiz do problema | Alterar `vi.fn<() => Promise<Buffer>>()` para `vi.fn<(opts: Record<string, unknown>) => Promise<Buffer>>()` ou usar `mockPage.pdf.mock.calls[0]?.[0]` com `as unknown as Record<string, string>` em dois passos |
| Baixa | `src/routes/pdf.ts` | 8–33 | Linhas em branco dentro do handler `handleGeneratePdf` (entre parse JSON e validação Zod, e entre validação e try de geração). Viola a regra de formatação de `code-standards.md` | Remover linhas em branco entre os blocos lógicos dentro da função |
| Baixa | `src/routes/pdf.test.ts` | — | O teste de payload válido verifica `Content-Type` mas não verifica `Content-Disposition`. A TechSpec especifica explicitamente o header `attachment; filename="contrato-YYYY-MM-DD.pdf"` como requisito da resposta | Adicionar `expect(res.headers.get('Content-Disposition')).toContain('contrato-')` e `.toContain('.pdf')` no teste de payload válido |

---

## Pontos Positivos

- Padrão de dois try/catch separados (JSON parse x service) idêntico ao `contratos.ts` — coerência arquitetural excelente.
- Reutilização de `ContratoPayloadSchema` importado de `contratos.ts` — única fonte de verdade, sem duplicação.
- Separação de responsabilidades perfeita: `pdf.ts` não conhece Puppeteer, apenas orquestra service e resposta.
- Logging de erro segue exatamente o padrão da TechSpec: `console.error('PDF generation failed', { error: ... })` sem dados do payload.
- Mock do `pdf-service` em `pdf.test.ts` usa `vi.mock` no topo do arquivo, respeitando o hoisting do Vitest — resolução correta do problema de hoisting mencionado no contexto.
- `pdfRouter` registrado corretamente em `index.ts` e o servidor já está configurado com CORS seguro.
- Uso de `new Uint8Array(pdfBuffer)` ao construir a `Response` é correto — garante compatibilidade com a API Web padrão.
- `pdf-service.test.ts` possui cobertura ampla: buffer retornado, todos os parâmetros do `page.pdf`, `browser.close` em finally mesmo com erro.

---

## Recomendações

1. **[Alta — bloqueante para CI]** Corrigir os erros de TypeScript em `pdf-service.test.ts`. O `bun run build` (`tsc --noEmit`) falha com 6 erros. Solução recomendada:
   ```typescript
   // Linha 67, 74, 81 — substituir o cast em dois passos:
   const callArgs = (mockPage.pdf.mock.calls[0] as unknown[])[0] as Record<string, string>
   ```
   Ou tipar os mocks explicitamente com parâmetros:
   ```typescript
   const mockPage = {
     setContent: vi.fn<[string, object], Promise<void>>(),
     pdf: vi.fn<[Record<string, unknown>], Promise<Buffer>>(),
   }
   ```

2. **[Baixa]** Remover linhas em branco dentro do handler `handleGeneratePdf` em `pdf.ts` para conformidade com `code-standards.md`.

3. **[Baixa]** Adicionar verificação do header `Content-Disposition` no teste de payload válido em `pdf.test.ts`, pois é requisito explícito da TechSpec.

---

## Conclusão

A implementação da Task 3.0 está funcionalmente completa e bem estruturada. Os 68 testes passam, o lint está sem erros, e todos os critérios funcionais da TechSpec foram atendidos. O código segue os padrões arquiteturais do projeto com boa coerência em relação às rotas existentes.

O ponto crítico é a falha do `bun run build` (`tsc --noEmit`) causada por 6 erros de TypeScript no arquivo `pdf-service.test.ts` — as chamadas `mockPage.pdf.mock.calls[0][0]` são invalidadas pelo TypeScript porque o tipo inferido de `vi.fn<() => Promise<Buffer>>()` resulta em tupla vazia para `mock.calls`. Embora os testes Vitest passem em runtime (o transpilador do Bun é mais permissivo), o check de tipos falha, o que bloquearia um pipeline de CI padrão.

O status **APROVADO COM RESSALVAS** é dado porque a lógica de negócio está correta e os testes são significativos, mas a correção dos erros de TypeScript e a adição do teste do header `Content-Disposition` são recomendadas antes de considerar a tarefa 100% concluída.
