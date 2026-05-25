# Tech Spec — Download do Contrato e Encaminhamento para Assinatura (Feature 016)

## Resumo Executivo

Nova página `/concluido` (`CompletionPage`) criada como destino do redirecionamento após download bem-sucedido do PDF na `ResultPage`. A navegação ocorre via callback `onSuccess` do `DownloadPdfButton` já existente. A `CompletionPage` lê o store Zustand para re-download e exibe modal de instruções gov.br. Sem alterações de backend. Mudanças mínimas em `ResultPage` (trocar `onSuccess`) e `DownloadPdfButton` (nome do arquivo).

## Arquitetura do Sistema

### Visão Geral dos Componentes

| Componente | Tipo | Ação |
|---|---|---|
| `frontend/src/pages/completion-page.tsx` | Novo | Tela de conclusão `/concluido` |
| `frontend/src/pages/completion-page.module.css` | Novo | Estilos da tela de conclusão |
| `frontend/src/pages/completion-page.test.tsx` | Novo | Testes da tela de conclusão |
| `frontend/src/App.tsx` | Modificado | Adicionar rota `/concluido` |
| `frontend/src/pages/result-page.tsx` | Modificado | `onSuccess` passa a navegar para `/concluido` |
| `frontend/src/components/download-pdf-button.tsx` | Modificado | Filename inclui `tipo_servico` |

**Fluxo de dados:**
`ResultPage` → clique em "Gerar contrato" → `DownloadPdfButton` → `POST /api/pdf/gerar` → download → `finalizeForm()` → `onSuccess()` → `navigate('/concluido')` → `CompletionPage` lê `steps` do store para re-download.

## Design de Implementação

### Estado Interno do Componente (`CompletionPage`)

```typescript
const steps = useFormStore((s) => s.steps)
const isFinalized = useFormStore((s) => s.isFinalized)
const resetForm = useFormStore((s) => s.resetForm)
const navigate = useNavigate()
const [showGovBrModal, setShowGovBrModal] = useState(false)
const govBrButtonRef = useRef<HTMLButtonElement>(null)
```

**Guard de acesso**: `useEffect` no mount — se `!isFinalized`, chama `navigate('/resultado', { replace: true })`.

**Foco no modal**: `useEffect` reagindo a `showGovBrModal` — quando abre, foco vai para o primeiro elemento interativo do modal. Quando fecha, foco retorna a `govBrButtonRef.current`.

### Re-download na `CompletionPage`

`buildPayload(steps)` — mesma função de `ResultPage` — gera o payload para o `DownloadPdfButton` do re-download. Como `isFinalized` já é `true`, chamar `finalizeForm()` novamente é idempotente (sem efeito colateral).

### Alteração no `DownloadPdfButton` — Filename

```typescript
// Atual:
a.download = `contrato-${new Date().toISOString().slice(0, 10)}.pdf`

// Novo:
const tipoServico = (payload.tipo_servico ?? 'contrato')
  .toLowerCase().replace(/\s+/g, '-')
a.download = `contrato-${tipoServico}-${new Date().toISOString().slice(0, 10)}.pdf`
```

### Alteração na `ResultPage` — onSuccess

```typescript
// Atual:
<DownloadPdfButton payload={buildPayload(steps)} onSuccess={() => {}} />

// Novo:
<DownloadPdfButton payload={buildPayload(steps)} onSuccess={() => navigate('/concluido')} />
```

O bloco `isFinalized && <p className={styles.successMessage}>` da `ResultPage` pode ser removido — a confirmação agora fica em `/concluido`.

### Modal gov.br

```tsx
<div role="dialog" aria-modal="true" aria-labelledby="govbr-modal-title">
  <h2 id="govbr-modal-title">Como assinar via gov.br</h2>
  <ol>
    <li>Acesse assinatura.iti.br</li>
    <li>Faça login com sua conta gov.br</li>
    <li>Envie o PDF gerado</li>
    <li>Assine digitalmente</li>
  </ol>
  <a href="https://assinatura.iti.br" target="_blank" rel="noopener noreferrer"
     aria-label="Acessar assinatura.iti.br (abre em nova aba)">
    Acessar assinatura.iti.br
  </a>
  <button onClick={handleCloseModal}>Fechar</button>
</div>
```

### Rota em `App.tsx`

```tsx
{ path: '/concluido', element: <CompletionPage /> }
```

### Endpoints de API

Sem novos endpoints. Reutiliza `POST /api/pdf/gerar` via `DownloadPdfButton`.

## Pontos de Integração

- **`form-store`**: leitura de `steps`, `isFinalized`; escrita via `resetForm()` (limpa todos os steps e restaura estado inicial)
- **`DownloadPdfButton`**: reutilizado com `payload={buildPayload(steps)}` e sem `onSuccess` (re-download na `/concluido` não precisa navegar de novo)
- **Link externo**: `https://assinatura.iti.br` — abre em nova aba; sem integração de API

## Verificações Técnicas

### Segurança

- Link externo usa `rel="noopener noreferrer"` para evitar `window.opener` exploitation
- Sem dados sensíveis expostos em URL ou localStorage
- `resetForm()` limpa todos os dados do store antes de reiniciar o fluxo

### Arquitetura

- Guard via `useEffect` no mount — redireciona para `/resultado` se `!isFinalized`, evitando acesso direto sem dados
- `buildPayload` é função pura reutilizada sem duplicação
- `isFinalized` permanece como única fonte de verdade para controle de estado pós-geração
- `CompletionPage` não chama `finalizeForm()` — isso é responsabilidade exclusiva do `DownloadPdfButton`

### Infraestrutura

Sem dependências novas. Build e proxy Vite inalterados.

## Abordagem de Testes

### Testes Unitários — `CompletionPage`

| Cenário | Descrição |
|---|---|
| Guard redirect | `isFinalized=false` → `navigate('/resultado', { replace: true })` chamado |
| Mensagem de sucesso | "Seu contrato foi gerado com sucesso!" visível |
| Aviso não-armazenamento | Texto do aviso visível |
| `DownloadPdfButton` presente | Componente renderizado com payload do store |
| Modal abre | Clicar "Encaminhar para assinatura via gov.br" → `role="dialog"` visível |
| Modal: 4 passos | Lista ol com 4 itens visível no modal |
| Modal: link gov.br | Link `assinatura.iti.br` com `target="_blank"` presente |
| Fechar modal | Clicar "Fechar" → modal não visível; foco retorna ao botão gov.br |
| Gerar novo contrato | Clicar → `resetForm` chamado; `navigate('/')` chamado |

**Mocks:**
```typescript
vi.mock('../store/form-store', () => ({
  useFormStore: vi.fn(() => ({
    steps: { 'architect-form': { tipo_servico: 'projeto' } },
    isFinalized: true,
    resetForm: mockResetForm,
  })),
}))
vi.mock('react-router', () => ({
  useNavigate: vi.fn(() => mockNavigate),
}))
vi.mock('../components/download-pdf-button', () => ({
  DownloadPdfButton: () => <button>Baixar PDF</button>,
}))
```

### Testes Unitários — `ResultPage` (adicionar)

| Cenário | Descrição |
|---|---|
| onSuccess navega | Após `onSuccess` do mock do botão → `navigate('/concluido')` chamado |

### Testes Unitários — `DownloadPdfButton` (adicionar)

| Cenário | Descrição |
|---|---|
| Filename com tipo_servico | Download bem-sucedido → `a.download` contém `tipo_servico` do payload |

## Sequenciamento de Desenvolvimento

1. **`DownloadPdfButton`** — atualizar filename (mudança cirúrgica, sem dependências)
2. **`ResultPage`** — trocar `onSuccess` para `navigate('/concluido')` e remover bloco `successMessage`
3. **`CompletionPage`** — implementar página completa com guard, modal e "Gerar novo contrato"
4. **`completion-page.module.css`** — estilos
5. **`App.tsx`** — registrar rota `/concluido`
6. **Testes** — `completion-page.test.tsx` + atualizações em `result-page.test.tsx` e `download-pdf-button.test.tsx`

## Monitoramento e Observabilidade

- Erro de re-download em `/concluido`: já coberto pelo `console.error` existente no `DownloadPdfButton`
- Sem novos logs necessários — fluxo de conclusão não tem operações assíncronas próprias

## Considerações Técnicas

### Decisões Principais

| Decisão | Escolha | Justificativa |
|---|---|---|
| Guard de acesso | `useEffect` + `navigate replace` | Simples, sem biblioteca extra; `replace` evita `/concluido` no histórico se usuário apertou voltar |
| Re-download | Reutiliza `DownloadPdfButton` | Zero duplicação; `finalizeForm()` é idempotente quando já finalizado |
| Foco no modal | `useRef` + `useEffect` | Padrão já estabelecido na `ResultPage` para modal de cláusula |
| `successMessage` na ResultPage | Remover | Redundante — conclusão agora em `/concluido` |

### Riscos Conhecidos

- **Store vazio no re-download**: se o usuário recarregar `/concluido`, o store zera e o re-download falhará. O guard redireciona para `/resultado` (também com store vazio). Comportamento esperado para MVP sem persistência.

### Conformidade com Skills Padrões

- React + Vite + TypeScript: componente funcional, props tipadas
- Vitest + Testing Library: 9 cenários unitários
- CSS Modules: `completion-page.module.css`
- bun como package manager

### Arquivos Relevantes e Dependentes

| Arquivo | Ação |
|---|---|
| `frontend/src/pages/completion-page.tsx` | Criar |
| `frontend/src/pages/completion-page.module.css` | Criar |
| `frontend/src/pages/completion-page.test.tsx` | Criar |
| `frontend/src/App.tsx` | Modificar — rota `/concluido` |
| `frontend/src/pages/result-page.tsx` | Modificar — `onSuccess`, remover `successMessage` |
| `frontend/src/pages/result-page.test.tsx` | Modificar — teste `navigate('/concluido')` |
| `frontend/src/components/download-pdf-button.tsx` | Modificar — filename com `tipo_servico` |
| `frontend/src/components/download-pdf-button.test.tsx` | Modificar — teste do filename |
