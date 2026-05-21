# Tech Spec — Honorários e Prazos (Feature 012)

## Resumo Executivo

Implementação de uma única tela React (`FeesFormPage`) inserida entre `/servicos-adicionais` e `/resultado` no fluxo de geração de contrato. A tela coleta prazo de execução, honorários e forma de pagamento, com campos condicionais de parcelamento. A novidade técnica em relação às features anteriores é o uso de `react-number-format` para mascaramento monetário — única nova dependência da feature. O restante segue integralmente os padrões estabelecidos: `isFormValid` como função pura, `useState` para estado local, `updateStep` no submit e CSS Module.

## Arquitetura do Sistema

### Visão Geral dos Componentes

| Componente | Tipo | Ação |
|---|---|---|
| `FeesFormPage` | Novo | Tela `/honorarios` — coleta prazo, honorários e forma de pagamento |
| `fees-form-page.module.css` | Novo | Estilos CSS Module da tela |
| `fees-form-page.test.tsx` | Novo | Testes unitários da tela |
| `App.tsx` | Modificado | Adicionar rota `/honorarios` |
| `AdditionalServicesPage` | Modificado | `navigate('/resultado')` → `navigate('/honorarios')` |
| `additional-services-page.test.tsx` | Modificado | Regressão: navigate('/honorarios') |
| `contrato.ts` | Modificado | Adicionar `parcelas?`, `valor_parcela?`, `indice_reajuste?` ao `ContratoPayload` |

**Fluxo de dados:** `steps['additional-services']` (leitura para exibir aviso) → `FeesFormPage` → `updateStep('fees', {...})` → `steps['fees']` → `buildPayload` no `ResultPage` → `ContratoPayload`.

## Design de Implementação

### Interfaces Principais

```typescript
// Estado interno do componente
interface FeesFields {
  prazo_quantidade: string       // "12" — campo numérico separado para UI
  prazo_unidade: 'dias' | 'meses' | ''
  valor_total: string            // "R$ 15.000,00"
  forma_pagamento: 'a_vista' | 'parcelado' | ''
  parcelas: string               // "10" — só quando parcelado
  valor_parcela: string          // "R$ 1.500,00" — só quando parcelado
  indice_reajuste: string        // "IPCA" | "IGP-M" | "INCC" | "Sem reajuste" | ""
}

// Função pura de validação (fora do componente)
function isFormValid(fields: FeesFields): boolean
```

### Modelos de Dados

**`ContratoPayload` — adições (contrato.ts):**
```typescript
parcelas?: string
valor_parcela?: string
indice_reajuste?: string
```
Os campos `prazo_total`, `valor_total` e `forma_pagamento` já existem no tipo.

**Store — `steps['fees']`:**
```typescript
{
  prazo_total: string        // "12 meses" — quantidade + unidade combinados
  valor_total: string        // "R$ 15.000,00"
  forma_pagamento: string    // "a_vista" | "parcelado"
  parcelas?: string          // incluso apenas quando parcelado
  valor_parcela?: string     // incluso apenas quando parcelado
  indice_reajuste?: string   // incluso apenas quando preenchido
}
```

### Dependência Nova — react-number-format

Instalar: `bun add react-number-format`

Usar `NumericFormat` com configuração de moeda brasileira:
```typescript
import { NumericFormat } from 'react-number-format'

<NumericFormat
  id="valor_total"
  prefix="R$ "
  thousandSeparator="."
  decimalSeparator=","
  decimalScale={2}
  fixedDecimalScale
  value={fields.valor_total}
  onValueChange={(values) => handleChange('valor_total', values.formattedValue)}
  className={styles.input}
/>
```

`values.formattedValue` retorna a string completa com prefixo ("R$ 15.000,00"), que é o valor armazenado no store e no payload.

### Lógica de `isFormValid`

```typescript
function isFormValid(fields: FeesFields): boolean {
  const qty = parseInt(fields.prazo_quantidade, 10)
  if (isNaN(qty) || qty < 1 || String(qty) !== fields.prazo_quantidade.trim()) return false
  if (!fields.prazo_unidade) return false
  if (!fields.valor_total || fields.valor_total.trim() === 'R$' || fields.valor_total.trim() === 'R$ ') return false
  if (!fields.forma_pagamento) return false
  if (fields.forma_pagamento === 'parcelado') {
    const p = parseInt(fields.parcelas, 10)
    if (isNaN(p) || p < 2 || String(p) !== fields.parcelas.trim()) return false
    if (!fields.valor_parcela || fields.valor_parcela.trim() === 'R$' || fields.valor_parcela.trim() === 'R$ ') return false
  }
  return true
}
```

### Lógica de Submit e Reset

No submit: combinar `prazo_quantidade + ' ' + prazo_unidade` → `prazo_total`. Incluir `parcelas` e `valor_parcela` apenas quando `forma_pagamento === 'parcelado'`. Incluir `indice_reajuste` apenas quando não vazio.

No reset de `forma_pagamento` para `'a_vista'`: limpar `parcelas` e `valor_parcela` via `setFields`.

### Pré-preenchimento (Revisita)

Ao montar, se `steps['fees']` existir:
- `prazo_total`: split em `' '` → `[prazo_quantidade, prazo_unidade]`
- Demais campos: atribuição direta

### Aviso de Serviços Adicionais

Condição: `(steps['additional-services'] as { selected_services?: string[] } | undefined)?.selected_services?.length > 0`

Quando verdadeiro, exibir `<p role="alert" className={styles.alert}>...</p>` no topo do formulário, acima dos campos.

### Endpoints de API

Nenhum. Feature exclusivamente frontend.

## Pontos de Integração

Nenhuma integração externa. Leitura e escrita exclusiva no `form-store` (Zustand).

## Verificações Técnicas

### Segurança

Sem dados sensíveis trafegando para APIs. Inputs são strings sem execução de código. Sem vetores de ataque relevantes nesta tela.

### Arquitetura

- `isFormValid` como função pura fora do componente — testável de forma isolada, sem closure sobre estado
- `FeesFields` separado do `steps['fees']` — a UI usa dois campos para prazo (`prazo_quantidade` + `prazo_unidade`), o store usa um campo combinado (`prazo_total`)
- `forma_pagamento === 'parcelado'` calculado via derivação direta no render — não precisa de `useState` separado (valor vem do próprio `fields.forma_pagamento`)
- Campos `parcelas` e `valor_parcela` incluídos no payload apenas quando `forma_pagamento === 'parcelado'` — evita enviar strings vazias ao backend

### Infraestrutura

Aplicação estática (Vite build). Sem requisitos adicionais de infra.

## Abordagem de Testes

### Testes Unitários

Arquivo: `fees-form-page.test.tsx`

| Cenário | Tipo |
|---|---|
| Renderiza todos os campos obrigatórios | Renderização |
| Continuar desabilitado com campos vazios | Validação |
| Campos de parcelamento ocultos quando forma_pagamento === 'a_vista' | Condicional |
| Campos de parcelamento visíveis quando forma_pagamento === 'parcelado' | Condicional |
| Mudar para 'a_vista' reseta parcelas e valor_parcela | Reset |
| parcelas < 2 mantém Continuar desabilitado | Validação |
| Formulário válido à vista → habilita Continuar | Validação |
| Formulário válido parcelado → habilita Continuar | Validação |
| Submit à vista → updateStep com prazo_total, valor_total, forma_pagamento (sem parcelas) | Submit |
| Submit parcelado → updateStep inclui parcelas e valor_parcela | Submit |
| Submit → navigate('/resultado') | Navegação |
| Voltar → navigate('/servicos-adicionais') | Navegação |
| Revisita → pré-preenche campos de steps['fees'] | Revisita |
| steps['additional-services'] com seleção → exibe aviso | Aviso |
| steps['additional-services'] vazio → oculta aviso | Aviso |
| Regressão: AdditionalServicesPage navega para /honorarios | Regressão |

Mocks: `useNavigate`, `useFormStore`. Sem mocks de API.

### Testes de Integração

N/A — sem comunicação entre módulos distintos.

### Testes de E2E

Não requeridos nesta feature (fluxo completo já coberto pelo E2E da geração do contrato).

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **`contrato.ts`** — adicionar campos opcionais ao `ContratoPayload` (sem isso o TypeScript bloqueia)
2. **`fees-form-page.tsx` + `fees-form-page.module.css`** — implementar o componente com todos os campos e lógica condicional
3. **`fees-form-page.test.tsx`** — cobrir todos os cenários listados acima
4. **`App.tsx`** — adicionar rota `/honorarios`
5. **`additional-services-page.tsx`** — atualizar navigate para `/honorarios`
6. **`additional-services-page.test.tsx`** — regressão de navegação

### Dependências Técnicas

- `react-number-format` instalado antes de implementar `FeesFormPage`
- `contrato.ts` atualizado antes de implementar o submit do componente

## Monitoramento e Observabilidade

Frontend estático sem backend nesta feature. Não aplicável.

## Considerações Técnicas

### Decisões Principais

| Decisão | Escolha | Justificativa |
|---|---|---|
| Máscara monetária | `react-number-format` | ~5M downloads/semana, API estável, suporte nativo a moeda brasileira |
| Armazenamento do prazo | String combinada "12 meses" | Consistente com os demais campos string do `ContratoPayload`; o template usa o valor diretamente |
| Armazenamento de valores | String com prefixo "R$ 15.000,00" | O template do contrato usa o valor diretamente sem precisar formatar |
| `isParcelado` | Derivado de `fields.forma_pagamento === 'parcelado'` no render | Não precisa de estado separado — evita dessincronização |
| Estado interno vs store | `FeesFields` com dois campos de prazo separados | Facilita controle dos dois inputs na UI; combinado apenas no submit |

### Riscos Conhecidos

- **`react-number-format` em jsdom**: Testes com `NumericFormat` exigem simular eventos de valor via `fireEvent.change` no input subjacente ou chamar diretamente o `onValueChange`. Verificar compatibilidade com `@testing-library/react` na versão instalada.

### Conformidade com Skills Padrões

- React + Vite + TypeScript: conforme
- Vitest + Testing Library: conforme
- CSS Modules: conforme
- bun como package manager: conforme
- Sem Express/Next.js/CRA: conforme

### Arquivos relevantes e dependentes

| Arquivo | Ação |
|---|---|
| `frontend/src/pages/fees-form-page.tsx` | Criar |
| `frontend/src/pages/fees-form-page.module.css` | Criar |
| `frontend/src/pages/fees-form-page.test.tsx` | Criar |
| `frontend/src/App.tsx` | Modificar (nova rota) |
| `frontend/src/pages/additional-services-page.tsx` | Modificar (navigate) |
| `frontend/src/pages/additional-services-page.test.tsx` | Modificar (regressão) |
| `frontend/src/types/contrato.ts` | Modificar (novos campos opcionais) |
| `frontend/package.json` | Modificar (react-number-format) |
