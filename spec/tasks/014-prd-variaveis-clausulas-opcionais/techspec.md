# Tech Spec — Preenchimento de Variáveis das Cláusulas Opcionais (Feature 014)

## Resumo Executivo

Extensão da `OptionalClausesPage` para coletar os valores das variáveis de template (`{{slug}}`) presentes no texto das cláusulas opcionais. A abordagem é mínima: adicionar metadados `variaveis` ao JSON de cláusulas do backend, expô-los via a API já existente, e renderizar inputs dentro do accordion do frontend. O campo `variaveis_opcionais: Record<string, string>` já existe em `ContratoPayload` e no motor de geração de PDF — nenhuma alteração de infraestrutura é necessária.

## Arquitetura do Sistema

### Visão Geral dos Componentes

| Componente | Tipo | Ação |
|---|---|---|
| `backend/src/data/clausulas.json` | Modificado | Adicionar `variaveis: ClausulaVariavel[]` a cada cláusula |
| `backend/src/services/clausulas-service.ts` | Modificado | Adicionar interface `ClausulaVariavel`, atualizar `Clausula` |
| `frontend/src/pages/optional-clauses-page.tsx` | Modificado | Novo estado `clausulaVars`, inputs no accordion, aviso e submit atualizado |
| `frontend/src/pages/optional-clauses-page.module.css` | Modificado | Classes `.varsGroup`, `.varInput`, `.varLabel`, `.varsWarning` |
| `frontend/src/pages/optional-clauses-page.test.tsx` | Modificado | Novos cenários de variáveis |

**Fluxo de dados:** `clausulas.json` (variaveis) → `GET /api/clausulas` → `Clausula.variaveis` → inputs no accordion → `clausulaVars: Record<string,string>` → `updateStep` → `steps['optional-clauses'].variaveis_opcionais` → `buildPayload` → `ContratoPayload.variaveis_opcionais` → `buildVariableMap` → substituição no PDF.

## Design de Implementação

### Interfaces Principais

```typescript
// clausulas-service.ts (backend) — adição
interface ClausulaVariavel {
  slug: string
  label: string
}

interface Clausula {
  // campos existentes...
  variaveis: ClausulaVariavel[]  // novo campo; [] para cláusulas sem variáveis
}

// optional-clauses-page.tsx (frontend) — interface local atualizada
interface Clausula {
  slug: string
  titulo: string
  texto: string
  categoria: string
  variaveis: ClausulaVariavel[]  // novo
}

interface ClausulaVariavel {
  slug: string
  label: string
}
```

### Modelos de Dados

**`clausulas.json` — estrutura de cada cláusula opcional (exemplo):**
```json
{
  "id": "c-011",
  "slug": "direitos-autorais-ampliados",
  "titulo": "Direitos Autorais Ampliados",
  "variaveis": [
    { "slug": "usos_adicionais", "label": "Usos adicionais permitidos" },
    { "slug": "valor_direitos_ampliados", "label": "Valor da remuneração adicional" }
  ]
}
```

Cláusulas sem variáveis recebem `"variaveis": []`.

**Store — `steps['optional-clauses']` atualizado:**
```typescript
{
  clausulas_opcionais: string[]
  clausulas_personalizadas: string[]
  variaveis_opcionais: Record<string, string>  // novo: todos os valores, incluindo inativos
}
```
O filtro (apenas cláusulas ativas) é aplicado no submit, não no armazenamento.

### Estado Interno do Componente (adições)

```typescript
const [clausulaVars, setClausulaVars] = useState<Record<string, string>>(() =>
  steps['optional-clauses']?.variaveis_opcionais ?? {}
)
const [showVarsWarning, setShowVarsWarning] = useState(false)
```

**Regras de estado:**
- `clausulaVars` armazena todos os valores preenchidos, independente do toggle
- `showVarsWarning` é `true` somente após tentativa de submit com campos incompletos; redefine para `false` quando qualquer variável é editada

### Lógica de Variáveis

**Renderização no accordion** (após o `<p>` do texto da cláusula):
```tsx
{clausula.variaveis.length > 0 && expandedSlugs.has(clausula.slug) && (
  <div className={styles.varsGroup}>
    {clausula.variaveis.map(v => (
      <div key={v.slug}>
        <label htmlFor={`var-${v.slug}`}>{v.label}</label>
        <input
          id={`var-${v.slug}`}
          type="text"
          value={clausulaVars[v.slug] ?? ''}
          onChange={e => handleVarChange(v.slug, e.target.value)}
        />
      </div>
    ))}
  </div>
)}
```

**Edição de variável:**
```typescript
function handleVarChange(slug: string, value: string) {
  setClausulaVars(prev => ({ ...prev, [slug]: value }))
  setShowVarsWarning(false)
}
```

**Detecção de variáveis ativas incompletas:**
```typescript
function hasMissingVars(): boolean {
  return clausulas.some(c =>
    activeSlugs.has(c.slug) &&
    c.variaveis.some(v => !clausulaVars[v.slug]?.trim())
  )
}
```

**Aviso — renderizado acima dos botões, com `role="alert"`, somente quando `showVarsWarning === true`:**
```tsx
{showVarsWarning && (
  <div role="alert" className={styles.varsWarning}>
    Algumas cláusulas ativas têm campos não preenchidos. O contrato pode conter lacunas.
  </div>
)}
```

### Lógica de Submit (atualizada)

```typescript
function handleSubmit() {
  if (hasMissingVars()) setShowVarsWarning(true)
  const activeVars = Object.fromEntries(
    clausulas
      .filter(c => activeSlugs.has(c.slug))
      .flatMap(c => c.variaveis.map(v => [v.slug, clausulaVars[v.slug]?.trim() ?? '']))
      .filter(([, val]) => val !== '')
  )
  updateStep('optional-clauses', {
    clausulas_opcionais: Array.from(activeSlugs),
    clausulas_personalizadas: customClauses.map(c => c.text.trim()).filter(Boolean),
    variaveis_opcionais: activeVars,
  })
  navigate('/resultado')
}
```

Nota: o submit **não é bloqueado** por `hasMissingVars()` — exibe o aviso e prossegue.

### Endpoints de API

`GET /api/clausulas?obrigatoria=false` — sem mudança de contrato de rota; apenas a resposta passa a incluir o campo `variaveis` em cada cláusula. Clientes que não conhecem o campo simplesmente ignoram.

## Pontos de Integração

- **`contratos-service.ts`** (`buildVariableMap`): já faz merge de `payload.variaveis_opcionais` — sem alteração necessária.
- **`result-page.tsx`** (`buildPayload`): já passa `variaveis_opcionais` do store para o payload — sem alteração necessária.

## Verificações Técnicas

### Segurança

Feature frontend pura. Os valores de variáveis são texto livre armazenado no store e enviado ao backend de geração de PDF. Nenhum dado é executado como código — sem vetores de ataque relevantes.

### Arquitetura

- A detecção de variáveis (`clausula.variaveis`) ocorre em tempo de renderização — sem regex no frontend.
- `clausulaVars` é um Record flat global (não por-cláusula) para simplicidade e alinhamento com `variaveis_opcionais` do payload.
- O filtro de variáveis ativas é aplicado exclusivamente no submit — o store persiste todos os valores para revisita.
- `showVarsWarning` é estado de UI local, não persistido no store.

### Infraestrutura

Sem novas dependências. Sem endpoints novos. O backend já retorna todos os campos do JSON via `listClausulas`.

## Abordagem de Testes

### Testes Unitários

Arquivo: `optional-clauses-page.test.tsx` — adição de cenários ao arquivo existente.

| Cenário | Descrição |
|---|---|
| Inputs no accordion | Quando accordion aberto e cláusula tem `variaveis`, inputs são renderizados |
| Labels associados | Cada input tem `<label>` com texto amigável do backend |
| Edição de variável | Digitar no input atualiza `clausulaVars` |
| Aviso ausente inicialmente | `showVarsWarning` inicia `false` — aviso não visível |
| Aviso ao submit incompleto | Submit com cláusula ativa e campo em branco exibe `role="alert"` |
| Sem aviso se completo | Submit com todos os campos preenchidos não exibe aviso |
| Aviso some ao editar | Após exibido, editar qualquer campo oculta o aviso |
| Submit exclui inativos | Variáveis de cláusulas desativadas não vão em `variaveis_opcionais` |
| Submit inclui ativos | Variáveis de cláusulas ativas e preenchidas vão no `updateStep` |
| Valores vazios descartados | Variáveis ativas mas em branco não entram no `activeVars` |
| Revisita restaura vars | `clausulaVars` inicializado de `steps['optional-clauses'].variaveis_opcionais` |

### Testes de Integração

N/A — backend retorna JSON estático; mock de fetch já cobre.

## Sequenciamento de Desenvolvimento

1. **`clausulas.json`** — adicionar `variaveis` a todas as 10 cláusulas opcionais e aos `Clausula` backend
2. **`clausulas-service.ts`** — adicionar `ClausulaVariavel` e atualizar interface `Clausula`
3. **`optional-clauses-page.tsx`** — atualizar interface local, adicionar estados, lógica e JSX
4. **`optional-clauses-page.module.css`** — novas classes CSS
5. **`optional-clauses-page.test.tsx`** — 11 novos cenários acima

### Dependências Técnicas

Nenhuma nova dependência de produção ou infraestrutura.

## Monitoramento e Observabilidade

Frontend estático. Erros de fetch já cobertos pelo `console.error` existente em `loadClausulas`.

## Considerações Técnicas

### Decisões Principais

| Decisão | Escolha | Justificativa |
|---|---|---|
| Labels no backend | `variaveis` no JSON | Evita heurística frágil de conversão de slug → label no frontend |
| `clausulaVars` flat | `Record<string, string>` global | Alinha diretamente com `variaveis_opcionais` do payload; sem conversão extra |
| Armazenar valores de inativos | Sim | Preserva preenchimento em caso de desativação/reativação acidental |
| Aviso não bloqueante | `setShowVarsWarning` + navegação livre | Decisão de produto: usuário pode intencionalmente deixar campo em branco |
| Inputs somente no accordion aberto | Renderização condicional | Mantém lista compacta; evita formulário extenso na tela principal |

### Riscos Conhecidos

- **Slugs de variáveis idênticos em cláusulas diferentes**: se duas cláusulas usam a mesma chave (ex: `{{indice_reajuste}}`), o valor será compartilhado em `clausulaVars`. Intencionalmente aceito — o motor de template usa a mesma chave e o valor deve ser coerente.

### Conformidade com Skills Padrões

- React + Vite + TypeScript: conforme
- Vitest + Testing Library: conforme
- CSS Modules: conforme
- bun como package manager: conforme

### Arquivos Relevantes e Dependentes

| Arquivo | Ação |
|---|---|
| `backend/src/data/clausulas.json` | Modificar — adicionar `variaveis` |
| `backend/src/services/clausulas-service.ts` | Modificar — `ClausulaVariavel` + `Clausula` |
| `frontend/src/pages/optional-clauses-page.tsx` | Modificar — estado, JSX, submit |
| `frontend/src/pages/optional-clauses-page.module.css` | Modificar — novas classes |
| `frontend/src/pages/optional-clauses-page.test.tsx` | Modificar — 11 novos cenários |
| `backend/src/services/contratos-service.ts` | Leitura — sem alteração |
| `frontend/src/pages/result-page.tsx` | Leitura — sem alteração |
| `frontend/src/types/contrato.ts` | Leitura — sem alteração |
