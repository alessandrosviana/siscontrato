# Tech Spec — Seleção de Cláusulas Opcionais (Feature 013)

## Resumo Executivo

Implementação de `OptionalClausesPage` (`/clausulas`) inserida entre `/honorarios` e `/resultado`. A tela busca as cláusulas opcionais via `fetch('/api/clausulas?obrigatoria=false')` no mount, gerencia toggles e accordions com `Set<string>`, e permite adicionar/remover cláusulas personalizadas identificadas por UUID. Sem novas dependências — toda a lógica usa React e a API já existente (Feature 003). Segue integralmente os padrões do projeto: estado local com `useState`, `updateStep` no submit, CSS Module.

## Arquitetura do Sistema

### Visão Geral dos Componentes

| Componente | Tipo | Ação |
|---|---|---|
| `OptionalClausesPage` | Novo | Tela `/clausulas` — fetch, toggles, accordion, cláusulas personalizadas |
| `optional-clauses-page.module.css` | Novo | Estilos CSS Module |
| `optional-clauses-page.test.tsx` | Novo | Testes unitários |
| `App.tsx` | Modificado | Adicionar rota `/clausulas` |
| `fees-form-page.tsx` | Modificado | `navigate('/resultado')` → `navigate('/clausulas')` |
| `fees-form-page.test.tsx` | Modificado | Regressão de navegação |
| `contrato.ts` | Modificado | Adicionar `clausulas_personalizadas?: string[]` |

**Fluxo de dados:** API `GET /api/clausulas?obrigatoria=false` → estado local → `updateStep('optional-clauses', {...})` → `steps['optional-clauses']` → `buildPayload` no `ResultPage` → `ContratoPayload`.

**Proxy Vite:** `fetch('/api/...')` é interceptado pelo proxy em `vite.config.ts` e encaminhado para `http://localhost:3000`.

## Design de Implementação

### Interfaces Principais

```typescript
// Tipo da cláusula retornada pela API (subconjunto do backend Clausula)
interface Clausula {
  slug: string
  titulo: string
  texto: string
  categoria: string
}

// Cláusula personalizada — ID para remoção individual
interface CustomClause {
  id: string   // crypto.randomUUID()
  text: string
}

type FetchState = 'loading' | 'error' | 'success'
```

### Modelos de Dados

**`ContratoPayload` — adição (contrato.ts):**
```typescript
clausulas_personalizadas?: string[]
```
O campo `clausulas_opcionais?: string[]` já existe.

**Store — `steps['optional-clauses']`:**
```typescript
{
  clausulas_opcionais: string[]       // slugs das cláusulas ativas
  clausulas_personalizadas: string[]  // textos não vazios (após trim)
}
```

### Estado Interno do Componente

```typescript
const [fetchState, setFetchState] = useState<FetchState>('loading')
const [clausulas, setClausulas] = useState<Clausula[]>([])
const [activeSlugs, setActiveSlugs] = useState<Set<string>>(() => {
  const saved = steps['optional-clauses']?.clausulas_opcionais ?? []
  return new Set(saved)
})
const [expandedSlugs, setExpandedSlugs] = useState<Set<string>>(new Set())
const [customClauses, setCustomClauses] = useState<CustomClause[]>(() => {
  const saved = steps['optional-clauses']?.clausulas_personalizadas ?? []
  return saved.map(text => ({ id: crypto.randomUUID(), text }))
})
```

### Lógica de Fetch

```typescript
useEffect(() => {
  fetch('/api/clausulas?obrigatoria=false')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    })
    .then((data: Clausula[]) => {
      setClausulas(data)
      setFetchState('success')
    })
    .catch(() => setFetchState('error'))
}, [])
```

Retry: botão "Tentar novamente" reexecuta o fetch chamando uma função `loadClausulas` extraída do `useEffect`.

### Lógica de Toggle e Accordion

- Toggle slug: criar novo `Set` via spread — `new Set([...activeSlugs, slug])` ou `new Set([...activeSlugs].filter(s => s !== slug))`
- Accordion slug: mesma abordagem imutável com `Set`
- Múltiplos accordions podem estar abertos simultaneamente

### Lógica de Cláusulas Personalizadas

- Adicionar: `setCustomClauses(prev => [...prev, { id: crypto.randomUUID(), text: '' }])`
- Remover: `setCustomClauses(prev => prev.filter(c => c.id !== id))`
- Editar texto: `setCustomClauses(prev => prev.map(c => c.id === id ? {...c, text: value} : c))`

### Lógica de Submit

```typescript
function handleSubmit() {
  updateStep('optional-clauses', {
    clausulas_opcionais: Array.from(activeSlugs),
    clausulas_personalizadas: customClauses
      .map(c => c.text.trim())
      .filter(Boolean),
  })
  navigate('/resultado')
}
```

O botão "Continuar" é sempre habilitado (nenhuma cláusula é obrigatória). Desabilitado apenas durante `fetchState === 'loading'`.

### Acessibilidade

- Toggles: `role="switch"` + `aria-checked={activeSlugs.has(slug)}`
- Botão accordion: `aria-expanded={expandedSlugs.has(slug)}` + `aria-controls="texto-{slug}"`
- Área expandida: `id="texto-{slug}"`
- Cada textarea de cláusula personalizada: `<label htmlFor>` associado
- Aviso de carregamento: `aria-live="polite"` no container de estado

### Endpoints de API

`GET /api/clausulas?obrigatoria=false` — já implementado (Feature 003). Nenhum endpoint novo.

## Pontos de Integração

- **Backend Hono**: `GET /api/clausulas?obrigatoria=false` via Vite proxy. Modo de falha: HTTP não-200 → `fetchState = 'error'`. O frontend não trava — exibe mensagem e botão de retry.
- **form-store**: leitura de `steps['optional-clauses']` (revisita) e escrita via `updateStep`.

## Verificações Técnicas

### Segurança

Feature frontend sem envio direto de dados sensíveis para API externa. Sem vetores de ataque relevantes. O texto das cláusulas personalizadas é apenas armazenado no store e enviado para o backend de geração de PDF — sem execução de código.

### Arquitetura

- `fetch` direto no componente via `useEffect` — sem abstração adicional (apenas esta página consome o endpoint)
- `Set<string>` imutável para toggles e accordion — evita mutação acidental e facilita comparação
- `crypto.randomUUID()` para IDs de cláusulas personalizadas — API nativa, sem dependência
- `fetchState` como union type explícita — evita estados impossíveis (ex: data preenchida com error=true)
- Botão "Continuar" desabilitado apenas durante loading — não bloqueia por ausência de seleção

### Infraestrutura

Aplicação estática (Vite build). Requer backend Hono rodando em `localhost:3000` para o fetch funcionar em desenvolvimento. Em produção, a configuração de proxy/reverse proxy é responsabilidade do ambiente de deploy (fora do escopo).

## Abordagem de Testes

### Testes Unitários

Arquivo: `optional-clauses-page.test.tsx`

**Mock de fetch:** `vi.stubGlobal('fetch', vi.fn())` com retorno de 2–3 cláusulas fictícias.

| Cenário | Descrição |
|---------|-----------|
| Loading inicial | Indicador de carregamento visível antes do fetch resolver |
| Cláusulas renderizadas | Após fetch resolver, lista os títulos das cláusulas |
| Erro de fetch | Exibe mensagem de erro e botão "Tentar novamente" |
| Toggle ativa cláusula | Clicar no toggle marca a cláusula como ativa |
| Toggle desativa cláusula | Clicar novamente desativa |
| Accordion expande | Clicar em "Ver texto" exibe o conteúdo da cláusula |
| Accordion colapsa | Clicar novamente oculta o texto |
| Adicionar personalizada | Clicar em "+ Adicionar" insere novo textarea |
| Remover personalizada | Clicar em remover elimina o textarea correspondente |
| Submit sem seleção | updateStep chamado com arrays vazios |
| Submit com seleção | updateStep inclui slugs ativos e textos personalizados não vazios |
| Textos vazios descartados | Personalizada com texto vazio não aparece no submit |
| Navegar /resultado | navigate('/resultado') chamado no submit |
| Voltar /honorarios | navigate('/honorarios') no botão Voltar |
| Revisita — slugs | Toggles restaurados a partir de steps['optional-clauses'] |
| Revisita — personalizadas | Textareas restaurados |
| Regressão FeesFormPage | FeesFormPage navega para /clausulas no submit |

### Testes de Integração

N/A — sem comunicação entre módulos distintos além do fetch já mockado.

### Testes de E2E

Não requeridos (fluxo completo coberto pelo E2E de geração do contrato).

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **`contrato.ts`** — adicionar `clausulas_personalizadas?: string[]` (TypeScript valida antes do build)
2. **`optional-clauses-page.tsx` + `optional-clauses-page.module.css`** — componente principal
3. **`optional-clauses-page.test.tsx`** — todos os cenários acima
4. **`App.tsx`** — rota `/clausulas`
5. **`fees-form-page.tsx`** — `navigate('/resultado')` → `navigate('/clausulas')`
6. **`fees-form-page.test.tsx`** — regressão

### Dependências Técnicas

- Nenhuma nova dependência de produção
- Backend Hono rodando para testes manuais (testes unitários mocam fetch)

## Monitoramento e Observabilidade

Frontend estático. Erro de fetch logado via `console.error` conforme padrão do `download-pdf-button.tsx`.

## Considerações Técnicas

### Decisões Principais

| Decisão | Escolha | Justificativa |
|---|---|---|
| Fetch no componente | `useEffect` direto | Apenas esta página usa o endpoint; hook extra seria over-engineering |
| IDs de personalizadas | `crypto.randomUUID()` | API nativa, sem dependência; identificação estável para remoção |
| Estado de toggle/accordion | `Set<string>` imutável | Comparação por valor, sem mutação, fácil de serializar para o store |
| Cláusulas personalizadas no store | `string[]` | `ContratoPayload` usa string[]; conversão de `CustomClause[]` → `string[]` no submit |
| Revisita de personalizadas | Recria `CustomClause[]` com novos UUIDs | UUIDs são apenas chaves de UI; o conteúdo (texto) é o dado relevante |

### Riscos Conhecidos

- **Backend offline durante testes manuais**: fetch retorna erro de rede → `fetchState = 'error'` → UI mostra retry. Comportamento correto, mas requer backend rodando para uso real.
- **`crypto.randomUUID()` em jsdom**: disponível no jsdom moderno (Node 16+); verificar se a versão do ambiente de testes suporta. Alternativa: `Math.random().toString(36)` se necessário.

### Conformidade com Skills Padrões

- React + Vite + TypeScript: conforme
- Vitest + Testing Library: conforme
- CSS Modules: conforme
- bun como package manager: conforme

### Arquivos relevantes e dependentes

| Arquivo | Ação |
|---|---|
| `frontend/src/pages/optional-clauses-page.tsx` | Criar |
| `frontend/src/pages/optional-clauses-page.module.css` | Criar |
| `frontend/src/pages/optional-clauses-page.test.tsx` | Criar |
| `frontend/src/App.tsx` | Modificar (nova rota) |
| `frontend/src/pages/fees-form-page.tsx` | Modificar (navigate) |
| `frontend/src/pages/fees-form-page.test.tsx` | Modificar (regressão) |
| `frontend/src/types/contrato.ts` | Modificar (novo campo) |
| `backend/src/routes/clausulas.ts` | Leitura (sem modificação) |
| `frontend/vite.config.ts` | Leitura (proxy já configurado) |
