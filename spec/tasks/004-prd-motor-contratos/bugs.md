# Bugs — Motor de Geração de Contratos (004-prd-motor-contratos)

## BUG-001

**Severidade:** Alta
**Status:** Aberto

**Descrição:** Variáveis de cláusulas opcionais não substituídas quando `variaveis_opcionais` está ausente ou incompleto

**Evidência:**
```
generateHtml({
  ...payload,
  clausulas_opcionais: ['numero-maximo-revisoes'],
  // variaveis_opcionais omitido
})
// HTML resultante contém: {{valor_revisao_adicional}}
```
A cláusula `numero-maximo-revisoes` (id c-013) usa a variável `{{valor_revisao_adicional}}`, que não está no `buildVariableMap` base. Quando `variaveis_opcionais` não é fornecido (campo opcional no schema Zod), a função `substituteVariables` mantém o placeholder `{{valor_revisao_adicional}}` no output, violando o objetivo central do PRD: "100% das variáveis `{{variavel}}` substituídas na geração (zero marcações no output)".

**Impacto:** Contratos com cláusulas opcionais que possuem variáveis próprias podem ser gerados com marcadores visíveis no documento final, comprometendo a qualidade e a confiança no sistema.

**Requisito violado:** RF-04 — "O motor substitui todas as ocorrências de `{{variavel}}` pelos valores do payload." / Objetivo: "100% das variáveis substituídas na geração (zero marcações no output)"

**Correção sugerida:**
Após resolver as cláusulas opcionais em `resolveOptionalClausesOrdered`, verificar se o HTML resultante ainda contém `{{` e lançar erro 400 identificando as variáveis faltantes, ou alternativamente, validar que todas as variáveis usadas pelas cláusulas opcionais selecionadas estão presentes em `variaveis_opcionais` antes de gerar o HTML.

- **Status:** Corrigido
- **Correção aplicada:** Adicionada verificação pós-renderização em `resolveOptionalClausesOrdered` (`contratos-service.ts`): após gerar o HTML das cláusulas opcionais, a função detecta qualquer `{{variavel}}` remanescente via regex e lança `Error("Variáveis faltantes para cláusulas opcionais: ...")` com os nomes das variáveis ausentes.
- **Testes de regressão:**
  - `it('throws error listing missing variables when optional clause variables are not provided')` — `contratos-service.test.ts`
  - `it('generates HTML with no placeholders when all optional clause variables are provided')` — `contratos-service.test.ts`

---

## BUG-002

**Severidade:** Baixa
**Status:** Aberto

**Descrição:** Erros de `generateHtml` (ex: slug inválido) são capturados nas rotas sem log, silenciando a exceção

**Evidência:**
```typescript
// routes/contratos.ts linha 43-45 e 57-59
try {
  const html = generateHtml(result.data as ContratoPayload)
  return c.json({ html }, 200)
} catch (err) {
  return c.json({ error: err instanceof Error ? err.message : 'Erro interno' }, 400)
  // Sem console.error aqui
}
```

**Impacto:** Em produção, erros inesperados do service (não apenas slugs inválidos, mas qualquer exceção não prevista) passam sem registro, dificultando o diagnóstico de falhas.

**Requisito violado:** TechSpec — "Logging Estruturado: `console.error('Contract generation failed', { error })` em exceções não esperadas do service"; logging.md rule — "Nunca silencie exceptions. Sempre registre os logs."

**Correção sugerida:**
Adicionar `console.error` no catch das rotas `preview` e `gerar`, sem logar dados do payload:
```typescript
} catch (err) {
  console.error('Contract generation failed', { error: err instanceof Error ? err.message : 'Unknown error' })
  return c.json({ error: err instanceof Error ? err.message : 'Erro interno' }, 400)
}
```

- **Status:** Corrigido
- **Correção aplicada:** Adicionado `console.error('Contract generation failed', { error: ... })` nos blocos `catch` de ambos os handlers (`POST /contratos/preview` e `POST /contratos/gerar`) em `contratos.ts`, sem logar dados do payload.
- **Testes de regressão:**
  - `it('calls console.error when generateHtml throws')` — `contratos.test.ts` (usa `vi.spyOn(console, 'error')`)
