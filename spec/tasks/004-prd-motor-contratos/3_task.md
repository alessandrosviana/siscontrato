# Tarefa 3.0: Endpoints da API

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 2.0 Service de Geração

## Estimativa

- **Tamanho**: M
- **Horas estimadas**: 2-4h

## Visão Geral

Cria o router Hono com os 3 endpoints do motor de contratos, valida o payload com Zod e registra o router no servidor principal. Ao final desta task, `POST /api/contratos/preview`, `POST /api/contratos/gerar` e `GET /api/contratos/pacotes` estão funcionando e testados.

<skills>
### Conformidade com Skills Padrões

- **code-standards**: handlers sem lógica de negócio (delegam ao service), sem comentários óbvios, kebab-case nos arquivos.
- **logging**: sem log em requisições normais; erros 400 de validação Zod não devem ser logados (comportamento esperado); `console.error` apenas em erros 500 inesperados.
</skills>

<requirements>
- `POST /api/contratos/preview` deve aceitar `ContratoPayload` no body, validar com Zod e retornar `{ html: string }` com status 200.
- `POST /api/contratos/gerar` deve aceitar o mesmo payload, validar com Zod e retornar `{ html: string }` com status 200.
- `GET /api/contratos/pacotes` deve retornar `Pacote[]` com status 200 sem body de entrada.
- Se o payload tiver campo obrigatório ausente, retornar HTTP 400 com `{ error: string }` descrevendo o(s) campo(s) faltante(s) (usar mensagem do Zod).
- Se `generateHtml` lançar erro de slug inválido (cláusula opcional não encontrada), retornar HTTP 400 com `{ error: string }`.
- Ambos os endpoints POST devem responder com `Content-Type: application/json`.
- O router deve ser montado em `/api` no `index.ts` usando `app.route('/api', contratosRouter)`.
- O schema Zod deve validar todos os campos obrigatórios de `ContratoPayload` conforme definido na techspec. `servicos_adicionais`, `clausulas_opcionais` e `variaveis_opcionais` são opcionais no schema.
</requirements>

## Subtarefas

- [ ] 3.1 Criar `backend/src/routes/contratos.ts` com o `contratosRouter` (instância de `Hono`)
- [ ] 3.2 Definir o schema Zod `ContratoPayloadSchema` com todos os campos obrigatórios e opcionais
- [ ] 3.3 Implementar handler `POST /contratos/preview` que valida com Zod e chama `generateHtml`
- [ ] 3.4 Implementar handler `POST /contratos/gerar` (mesma lógica do preview — compartilhar schema)
- [ ] 3.5 Implementar handler `GET /contratos/pacotes` que chama `getPackages`
- [ ] 3.6 Editar `backend/src/index.ts` para importar `contratosRouter` e registrá-lo com `app.route('/api', contratosRouter)`
- [ ] 3.7 Criar `backend/src/routes/contratos.test.ts` com os testes HTTP listados abaixo
- [ ] 3.8 Executar `bun run test` em `backend/` e confirmar que todos os testes passam

## Detalhes de Implementação

Consulte as seções **Endpoints de API** e **Sequenciamento de Desenvolvimento (passo 5, 6 e 7)** em `techspec.md`.

O padrão de montagem do router em `index.ts` já existe para `healthRouter` e `clausulasRouter` — siga o mesmo padrão.

Para tratamento de erro do Zod:
```typescript
const result = ContratoPayloadSchema.safeParse(await c.req.json())
if (!result.success) {
  return c.json({ error: result.error.message }, 400)
}
```

Para capturar o erro de slug inválido lançado por `generateHtml`:
```typescript
try {
  const html = generateHtml(result.data)
  return c.json({ html }, 200)
} catch (err) {
  return c.json({ error: err instanceof Error ? err.message : 'Erro interno' }, 400)
}
```

## Critérios de Sucesso

- `POST /api/contratos/preview` com payload válido → 200, `body.html` é string não vazia
- `POST /api/contratos/preview` sem campo obrigatório → 400, `body.error` com descrição
- `POST /api/contratos/gerar` com payload válido → 200
- `GET /api/contratos/pacotes` → 200, array com 5 itens
- `POST /api/contratos/preview` com slug opcional inválido → 400
- `bun run test` em `backend/` → todos os testes passam (Task 2.0 + Task 3.0)

## Testes da Tarefa

Usar `app.request()` do Hono — não é necessário subir o servidor HTTP real.

- [ ] `POST /api/contratos/preview` com payload completo válido → status 200
- [ ] `POST /api/contratos/preview` com payload válido → `body.html` é string com conteúdo
- [ ] `POST /api/contratos/preview` com payload válido → `Content-Type` contém `application/json`
- [ ] `POST /api/contratos/preview` sem `cliente_nome` → status 400
- [ ] `POST /api/contratos/preview` sem `cliente_nome` → `body.error` existe
- [ ] `POST /api/contratos/preview` com `clausulas_opcionais: ["slug-inexistente"]` → status 400
- [ ] `POST /api/contratos/gerar` com payload completo válido → status 200
- [ ] `POST /api/contratos/gerar` com payload válido → `body.html` é string com conteúdo
- [ ] `GET /api/contratos/pacotes` → status 200
- [ ] `GET /api/contratos/pacotes` → body é array com 5 itens

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos Relevantes

- `backend/src/routes/contratos.ts` (novo)
- `backend/src/routes/contratos.test.ts` (novo)
- `backend/src/index.ts` (modificado — adiciona import e `app.route('/api', contratosRouter)`)
- `backend/src/services/contratos-service.ts` (leitura — criado na Task 2.0)
