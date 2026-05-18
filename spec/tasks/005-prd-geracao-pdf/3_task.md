# Tarefa 3.0: Rota POST /api/pdf/gerar — pdf.ts

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 2.0 (pdf-service.ts implementado e testado)

## Estimativa

- **Tamanho**: M
- **Horas estimadas**: 2–3h

## Visão Geral

Cria o endpoint `POST /api/pdf/gerar` em `backend/src/routes/pdf.ts`. A rota valida o payload com `ContratoPayloadSchema` (exportado na task 1.0), chama `generateHtml` + `generatePdf` e retorna o buffer como `application/pdf` com header `Content-Disposition: attachment`. Registra o `pdfRouter` no `index.ts`.

<skills>
### Conformidade com Skills Padrões

- **Backend usa Hono** — nunca Express/Fastify.
- **code-standards.md**: early returns para erros de validação, sem efeitos colaterais desnecessários.
- **logging.md**: `console.error` nos blocos catch; sem dados do payload nos logs.
- **Código-fonte**: inglês.
</skills>

<requirements>
- Arquivo `backend/src/routes/pdf.ts` com `pdfRouter` exportado.
- `POST /pdf/gerar` valida body com `ContratoPayloadSchema.safeParse` — retorna 400 + `{ error }` se inválido.
- Trata erro de parse do JSON (`c.req.json()` em try/catch separado) — igual ao padrão de `contratos.ts`.
- Chama `generateHtml(payload)` e passa o HTML para `generatePdf(html)`.
- Retorna resposta com:
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="contrato-YYYY-MM-DD.pdf"` (data atual no formato ISO)
  - Body: buffer do PDF
- Em caso de erro no service: `console.error('PDF generation failed', { error })`, retorna 400 + `{ error }`.
- `pdfRouter` registrado em `backend/src/index.ts` com `app.route('/api', pdfRouter)`.
- Testes de integração cobrindo os cenários principais.
</requirements>

## Subtarefas

- [ ] 3.1 Criar `backend/src/routes/pdf.ts` com `pdfRouter` e handler `POST /pdf/gerar`
- [ ] 3.2 Implementar validação de JSON e Zod (padrão de `contratos.ts`)
- [ ] 3.3 Montar resposta binária com headers `Content-Type` e `Content-Disposition`
- [ ] 3.4 Registrar `pdfRouter` em `backend/src/index.ts`
- [ ] 3.5 Criar `backend/src/routes/pdf.test.ts` com testes de integração (mock do `pdf-service`)
- [ ] 3.6 Executar `bun test` — todos os testes passando

## Detalhes de Implementação

Ver seção **Endpoints de API**, **Interfaces Principais** e **Abordagem de Testes — Testes de Integração** na techspec.md.

Para retornar um buffer binário no Hono:
```typescript
return new Response(buffer, {
  headers: {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="contrato-${date}.pdf"`,
  },
})
```

O nome do arquivo usa a data atual no formato `YYYY-MM-DD` (ex: `contrato-2026-05-18.pdf`).

## Critérios de Sucesso

- `POST /api/pdf/gerar` com payload válido retorna status 200, `Content-Type: application/pdf`.
- `POST /api/pdf/gerar` com campo faltando retorna status 400 e `body.error` definido.
- `POST /api/pdf/gerar` quando `generatePdf` lança → status 400, `console.error` chamado.
- `POST /api/pdf/gerar` com body não-JSON → status 400 e `body.error` definido.
- Rota aparece registrada no servidor (`bun dev` sobe sem erro).
- `bun test` passa (todos os testes existentes + novos).

## Testes da Tarefa

- [ ] Testes de integração (`pdf.test.ts`) — mockar `pdf-service.generatePdf`:
  - Payload válido → status 200, `Content-Type: application/pdf`
  - Campo obrigatório faltando → status 400, `body.error` string
  - Body não-JSON → status 400, `body.error` string
  - `generatePdf` lança erro → status 400, `console.error` chamado com `'PDF generation failed'`
- [ ] Testes de unidade: não aplicável (lógica está no service, já testado na task 2.0)
- [ ] Testes E2E: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `backend/src/routes/pdf.ts` — novo arquivo
- `backend/src/routes/pdf.test.ts` — novo arquivo
- `backend/src/index.ts` — adicionar registro do `pdfRouter`
- `backend/src/routes/contratos.ts` — importar `ContratoPayloadSchema` (exportado na task 1.0)
- `backend/src/services/pdf-service.ts` — chamado pela rota
- `backend/src/services/contratos-service.ts` — `generateHtml` chamado pela rota
