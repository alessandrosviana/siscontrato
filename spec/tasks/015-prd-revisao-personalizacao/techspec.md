# Tech Spec — Revisão e Personalização do Contrato (Feature 015)

## Resumo Executivo

A `ResultPage` existente em `/resultado` é transformada em uma tela de revisão completa. O componente busca o HTML do contrato via `POST /api/contratos/preview`, exibe-o com `dangerouslySetInnerHTML` em área com scroll, e oferece uma barra lateral com links de navegação para edição por etapa. Um modal permite adicionar cláusula personalizada de última hora. A geração do PDF reutiliza o componente `DownloadPdfButton` já existente. Nenhum novo endpoint de backend é necessário.

## Arquitetura do Sistema

### Visão Geral dos Componentes

| Componente | Tipo | Ação |
|---|---|---|
| `frontend/src/pages/result-page.tsx` | Modificado | Transformado em tela de revisão completa |
| `frontend/src/pages/result-page.module.css` | Modificado | Layout de duas colunas + modal |
| `frontend/src/pages/result-page.test.tsx` | Modificado | Novos cenários de revisão |
| `frontend/src/components/download-pdf-button.tsx` | Referência | Reutilizado sem alteração |
| `backend/src/routes/contratos.ts` | Referência | `POST /api/contratos/preview` — sem alteração |

**Fluxo de dados:**
`steps` (store) → `buildPayload` → `POST /api/contratos/preview` → `{ html }` → `dangerouslySetInnerHTML` → tela.

Após revisão: botão "Gerar contrato" → `DownloadPdfButton` → `POST /api/pdf/gerar` → download + `finalizeForm()`.

## Design de Implementação

### Estado Interno do Componente

```typescript
type PreviewState = 'loading' | 'error' | 'success'

const [previewState, setPreviewState] = useState<PreviewState>('loading')
const [previewHtml, setPreviewHtml] = useState<string>('')
const [showAddClauseModal, setShowAddClauseModal] = useState(false)
const [newClauseText, setNewClauseText] = useState('')
```

`isFinalized` é lido diretamente do store: `useFormStore(s => s.isFinalized)`. Não é estado local — evita divergência.

### Lógica de Fetch do Preview

```typescript
async function loadPreview() {
  setPreviewState('loading')
  try {
    const payload = buildPayload(steps)
    const res = await fetch('/api/contratos/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const { html } = await res.json() as { html: string }
    setPreviewHtml(html)
    setPreviewState('success')
  } catch (err) {
    console.error('Failed to load contract preview', { error: err instanceof Error ? err.message : 'Unknown error' })
    setPreviewState('error')
  }
}
```

`useEffect(() => { loadPreview() }, [])` — executa no mount. Botão "Tentar novamente" chama `loadPreview()` diretamente.

### Modal de Adicionar Cláusula

Ao confirmar:
1. Lê `clausulas_personalizadas` existentes de `steps['optional-clauses']`
2. Chama `updateStep('optional-clauses', { ...steps['optional-clauses'], clausulas_personalizadas: [...existing, newClauseText.trim()] })`
3. Fecha modal, limpa `newClauseText`
4. Chama `loadPreview()` para atualizar o preview com a nova cláusula

`role="dialog"`, `aria-modal="true"`, foco capturado no textarea ao abrir.

### Barra Lateral — Links de Navegação

Lista estática das etapas com rotas correspondentes:

| Seção | Rota |
|---|---|
| Dados do Arquiteto | `/formulario` |
| Dados do Contratante | `/contratante` |
| Dados do Projeto | `/projeto` |
| Escopo dos Serviços | `/escopo` |
| Serviços Adicionais | `/servicos-adicionais` |
| Honorários e Prazos | `/honorarios` |
| Cláusulas Opcionais | `/clausulas` |

Navegação via `useNavigate`. Ao retornar a `/resultado`, o componente remonta e o `useEffect` recarrega o preview automaticamente com os dados atualizados do store.

### Renderização do Preview

```tsx
<div
  className={styles.previewContent}
  dangerouslySetInnerHTML={{ __html: previewHtml }}
  aria-busy={previewState === 'loading'}
/>
```

O HTML gerado pelo backend é de fonte interna confiável. Nenhuma entrada do usuário é inserida diretamente no HTML do preview — os dados passam pelo motor de templates do backend.

### Botão "Gerar contrato"

Reutiliza `DownloadPdfButton` com prop `onSuccess` adicionada ao componente:

```typescript
// DownloadPdfButton recebe onSuccess?: () => void
// Chamado após finalizeForm() com sucesso
```

No `ResultPage`: `<DownloadPdfButton payload={buildPayload(steps)} onSuccess={() => {}} />`

`isFinalized` (do store) controla a mensagem de sucesso e desabilita o botão de "Adicionar cláusula" pós-geração.

> **Alternativa**: se adicionar prop ao `DownloadPdfButton` impactar outros usos, ler `isFinalized` do store dentro do próprio botão — comportamento já correto sem prop.

### Layout CSS Module

```
┌─────────────────────────────────────────────────┐
│  Revisão do Contrato             [Adicionar cláusula] │
├──────────────┬──────────────────────────────────┤
│  Barra       │  Preview HTML (scroll)            │
│  lateral     │                                   │
│  (links      │                                   │
│  Editar)     │                                   │
│              │                                   │
├──────────────┴──────────────────────────────────┤
│          [Gerar contrato]                        │
└─────────────────────────────────────────────────┘
```

Classes: `.container`, `.header`, `.body`, `.sidebar`, `.sidebarLink`, `.previewArea`, `.previewContent`, `.previewLoading`, `.previewError`, `.actions`, `.successMessage`, `.modal`, `.modalOverlay`, `.modalContent`.

## Endpoints de API

- `POST /api/contratos/preview` — já existe; recebe `ContratoPayload`, retorna `{ html: string }`
- `POST /api/pdf/gerar` — já existe; usado pelo `DownloadPdfButton`

Nenhum endpoint novo.

## Pontos de Integração

- **`form-store`**: leitura de `steps`, `isFinalized`; escrita via `updateStep` (modal de cláusula)
- **`buildPayload`**: função existente em `result-page.tsx` — mantida sem alteração
- **`DownloadPdfButton`**: componente reutilizado com eventual prop `onSuccess`

## Verificações Técnicas

### Segurança

O HTML do preview vem exclusivamente de `POST /api/contratos/preview` — API interna. Os dados passam pelo motor de templates do backend (`generateHtml`) antes de chegarem ao frontend. Nenhuma entrada bruta do usuário é injetada no HTML sem passar pelo sanitizador do backend. Uso de `dangerouslySetInnerHTML` é seguro neste contexto.

### Arquitetura

- Estado de preview (`previewState`) é local — não persiste no store (não faz sentido reabrir com estado de carregamento anterior)
- `isFinalized` é lido do store — única fonte de verdade para bloqueio pós-geração
- Recarregamento do preview no remount cobre o caso de retorno após edição em outra tela
- Modal gerenciado com estado local; sem portais ou bibliotecas externas

### Infraestrutura

Sem novas dependências. Vite proxy já encaminha `/api` para `localhost:3000`.

## Abordagem de Testes

### Testes Unitários

Arquivo: `result-page.test.tsx` — substituir/ampliar os testes atuais.

| Cenário | Descrição |
|---|---|
| Loading inicial | Indicador visível antes do fetch resolver |
| Preview renderizado | HTML do mock visível após fetch bem-sucedido |
| Erro de fetch | Mensagem de erro + botão "Tentar novamente" |
| Retry funciona | Clicar "Tentar novamente" refaz o fetch |
| Links da barra lateral | 7 links com rotas corretas renderizados |
| Clicar link Editar | `navigate` chamado com a rota correta |
| Botão "Adicionar cláusula" | Modal abre |
| Fechar modal | Modal fecha sem alterar store |
| Confirmar modal com texto | `updateStep` chamado com nova personalizada; preview recarregado |
| Confirmar modal vazio | Não atualiza store; modal fecha |
| Pós-geração (isFinalized=true) | Mensagem de sucesso visível; botão Adicionar desabilitado |

**Mocks necessários:**
- `vi.stubGlobal('fetch', vi.fn())` — retorna `{ html: '<p>Preview</p>' }`
- `vi.mock('../store/form-store', ...)` — `steps`, `updateStep`, `isFinalized`
- `vi.mock('react-router', ...)` — `useNavigate`
- `vi.mock('../components/download-pdf-button', ...)` — stub simples

### Testes de Integração

N/A — fetch mockado cobre os contratos de API.

## Sequenciamento de Desenvolvimento

1. **`result-page.tsx`** — fetch de preview, layout, barra lateral, modal
2. **`result-page.module.css`** — layout duas colunas + modal + focus-visible
3. **`result-page.test.tsx`** — todos os cenários acima
4. **`download-pdf-button.tsx`** — adicionar prop `onSuccess?: () => void` se necessário

## Monitoramento e Observabilidade

- `console.error` no catch do preview (`'Failed to load contract preview'`)
- O `DownloadPdfButton` já tem seu próprio tratamento de erro

## Considerações Técnicas

### Decisões Principais

| Decisão | Escolha | Justificativa |
|---|---|---|
| Renderização do HTML | `dangerouslySetInnerHTML` | Fonte interna confiável; iframe adiciona complexidade desnecessária (altura dinâmica, cross-frame) |
| Links Editar | Barra lateral estática | Não depende da estrutura do HTML do backend; simples de manter |
| Recarregamento do preview | Remount automático via `useEffect` | Cobre o caso de retorno pós-edição sem lógica extra |
| isFinalized | Lido do store | Fonte de verdade única; evita sincronização de estado duplicado |
| Modal de cláusula | Implementação local (sem biblioteca) | Feature pontual; evitar dependência para um único modal |

### Riscos Conhecidos

- **HTML do preview com estilos conflitantes**: o CSS do backend pode sobrescrever estilos globais do frontend. Mitigação: envolver o container do preview em `.previewContent` com `all: initial` ou CSS scoped.

### Conformidade com Skills Padrões

- React + Vite + TypeScript: conforme
- Vitest + Testing Library: conforme
- CSS Modules: conforme
- bun como package manager: conforme

### Arquivos Relevantes e Dependentes

| Arquivo | Ação |
|---|---|
| `frontend/src/pages/result-page.tsx` | Modificar — tela de revisão completa |
| `frontend/src/pages/result-page.module.css` | Modificar — layout duas colunas + modal |
| `frontend/src/pages/result-page.test.tsx` | Modificar — novos cenários |
| `frontend/src/components/download-pdf-button.tsx` | Modificar (opcional) — prop `onSuccess` |
| `backend/src/routes/contratos.ts` | Referência — sem alteração |
| `frontend/src/store/form-store.ts` | Referência — `steps`, `isFinalized`, `updateStep` |
