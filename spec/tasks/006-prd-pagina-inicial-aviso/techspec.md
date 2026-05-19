# Tech Spec — Página Inicial e Aviso Institucional

## Resumo Executivo

A funcionalidade adiciona dois novos componentes de página (`LandingPage` e `DisclaimerPage`) e refatora a rota raiz. O `App.tsx` ganha três novas rotas: `/aviso`, `/resultado` e `/formulario` (placeholder). O estado do aceite é gerenciado localmente com `useState` — sem store global. CSS Modules provê escopo de estilo por componente. O `DownloadPdfButton` é migrado para uma nova `ResultPage` na rota `/resultado`, e `home.tsx` é removido.

## Arquitetura do Sistema

### Visão Geral dos Componentes

**Novos componentes (páginas):**
- `LandingPage` (`pages/landing-page.tsx`) — rota `/`; substitui o conteúdo atual de `home.tsx`; sem estado
- `DisclaimerPage` (`pages/disclaimer-page.tsx`) — rota `/aviso`; gerencia `accepted: boolean` via `useState`; navega para `/formulario` ao confirmar
- `ResultPage` (`pages/result-page.tsx`) — rota `/resultado`; recebe o `DownloadPdfButton` migrado de `home.tsx`

**Componentes modificados:**
- `App.tsx` — adiciona rotas `/aviso`, `/resultado`, `/formulario` ao `createBrowserRouter` existente

**Componentes removidos:**
- `home.tsx` e `home.test.tsx` — substituídos por `landing-page.tsx`

**Fluxo de dados:**
```
/ (LandingPage)
  → clique "Criar contrato" → navigate('/aviso')

/aviso (DisclaimerPage)
  useState: accepted = false
  checkbox onChange → setAccepted(true/false)
  botão "Continuar" [disabled={!accepted}]
  clique "Continuar" (accepted=true) → navigate('/formulario')

/resultado (ResultPage)
  useFormStore → buildPayload(steps)
  → <DownloadPdfButton payload={payload} />

/formulario
  → componente placeholder (feature futura)
```

## Design de Implementação

### Interfaces Principais

```typescript
// LandingPage — sem props, sem estado
export function LandingPage(): JSX.Element

// DisclaimerPage — sem props; estado local
// accepted: boolean via useState(false)
export function DisclaimerPage(): JSX.Element

// ResultPage — sem props; busca payload do form-store
export function ResultPage(): JSX.Element
```

### Modelos de Dados

Estado efêmero em `DisclaimerPage`:
```typescript
const [accepted, setAccepted] = useState<boolean>(false)
```

Sem novos tipos ou modelos de dados. `ContratoPayload` já existe em `types/contrato.ts` e é reutilizado por `ResultPage`.

### Endpoints de API

Nenhum. Feature puramente frontend.

## Pontos de Integração

- **React Router 7** (`useNavigate`, `createBrowserRouter`): navegação entre rotas; `useNavigate` usado em `LandingPage` e `DisclaimerPage`
- **`useFormStore`** (Zustand): reutilizado em `ResultPage` para derivar o payload do `DownloadPdfButton` (lógica `buildPayload` migrada de `home.tsx`)

## Verificações Técnicas

### Segurança

- Nenhuma entrada de usuário é enviada ao backend nesta feature — risco de XSS mínimo
- Checkbox é elemento HTML nativo — sem vetor de ataque via input manipulado
- Botão desabilitado usa atributo `disabled` nativo — não recebe foco, não executa `onClick`

### Arquitetura

- Estado do checkbox estritamente local (`useState`) — sem acoplamento ao store global
- `DisclaimerPage` não depende do `form-store` — baixo acoplamento e testabilidade alta
- Rota `/formulario` criada com componente placeholder para não quebrar a navegação antes da feature correspondente

### Infraestrutura

- Nenhuma dependência nova — React Router já instalado; CSS Modules suportado nativamente pelo Vite sem configuração adicional
- Sem variáveis de ambiente adicionais

## Abordagem de Testes

### Testes Unidade

**`landing-page.test.tsx`:**
- Renderiza `<h1>` com "Gerador de Contratos para Arquitetos"
- Renderiza botão com texto "Criar contrato"
- Renderiza rodapé com "CAU/DF" e "Aviso legal"
- Clicar em "Criar contrato" chama `navigate('/aviso')` (mock de `useNavigate`)

**`disclaimer-page.test.tsx`:**
- Renderiza os 4 pontos institucionais obrigatórios (um assertion por ponto)
- Checkbox inicia desmarcado
- Botão "Continuar" inicia com `disabled`
- Marcar o checkbox remove `disabled` do botão
- Desmarcar o checkbox recoloca `disabled` no botão
- Clicar em "Continuar" com checkbox marcado chama `navigate('/formulario')`

**`result-page.test.tsx`:**
- Renderiza o `DownloadPdfButton` (mock do componente)

**Padrão de mock para navegação:**
```typescript
const mockNavigate = vi.fn()
vi.mock('react-router', () => ({ useNavigate: () => mockNavigate }))
```

### Testes de Integração

Não necessários — sem chamadas a APIs externas nesta feature.

### Testes de E2E

Fora do escopo desta tech spec — fluxo de navegação simples dentro de uma SPA sem backend envolvido.

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **`App.tsx`** — adicionar rotas `/aviso`, `/resultado` e `/formulario` (placeholder); pré-requisito para que as novas páginas sejam acessíveis
2. **`ResultPage`** — migrar `DownloadPdfButton` e `buildPayload` de `home.tsx`; desbloqueia a remoção de `home.tsx`
3. **`LandingPage`** + `landing-page.module.css` — implementar Tela 1; registrar na rota `/`
4. **`DisclaimerPage`** + `disclaimer-page.module.css` — implementar Tela 2 com lógica de checkbox e navegação
5. **Testes unitários** das três novas páginas
6. **Remover** `home.tsx` e `home.test.tsx` após todos os testes passarem

### Dependências Técnicas

- Nenhuma biblioteca nova a instalar
- CSS Modules já suportado pelo Vite 8 sem configuração adicional

## Monitoramento e Observabilidade

### Error Tracking

Nenhum erro esperado em produção nesta feature — sem chamadas de rede ou lógica de domínio complexa.

### Logging Estruturado

Não aplicável — feature puramente de navegação frontend.

### Health Checks

Não aplicável — sem endpoints de backend envolvidos.

### Métricas de Negócio

Taxa de conversão do aceite (usuários que chegam à Tela 2 e clicam em "Continuar") pode ser monitorada futuramente via eventos de analytics. Fora do escopo atual.

### Alertas

Não aplicável nesta fase.

## Considerações Técnicas

### Decisões Principais

| Decisão | Escolha | Alternativa rejeitada | Justificativa |
|---|---|---|---|
| Estado do aceite | `useState` local | Zustand store | Sem necessidade de compartilhar entre rotas; aceite não persiste entre sessões |
| Guard de rota em `/aviso` | Sem guard (acessível diretamente) | Redirect para `/` | Simplifica implementação; o aviso é autocontido |
| Placeholder `/formulario` | `<div>` temporário | Omitir a rota | Garante que a navegação não quebra antes da feature futura |
| CSS | CSS Modules | Tailwind / styled-components | Sem nova dependência; Vite suporta nativamente |

### Riscos Conhecidos

- `home.tsx` possui `home.test.tsx` com 4 testes que devem ser removidos junto com o componente ao final da implementação; manter os dois arquivos durante o desenvolvimento para não quebrar a suite antes das novas páginas estarem prontas
- `buildPayload` e a lógica de `useFormStore` em `home.tsx` devem ser migradas íntegras para `ResultPage` antes da remoção de `home.tsx`

### Conformidade com Skills Padrões

| Área | Tecnologia | Status |
|---|---|---|
| Frontend | React 19 + Vite + TypeScript | Conforme |
| Roteamento | React Router 7 | Conforme |
| Estado | Zustand 5 (apenas `ResultPage`) | Conforme |
| Testes | Vitest + Testing Library | Conforme |
| Package mgr | bun | Conforme |
| CSS | CSS Modules (sem lib nova) | Conforme |

### Arquivos relevantes e dependentes

**Criar:**
- `frontend/src/pages/landing-page.tsx`
- `frontend/src/pages/landing-page.module.css`
- `frontend/src/pages/landing-page.test.tsx`
- `frontend/src/pages/disclaimer-page.tsx`
- `frontend/src/pages/disclaimer-page.module.css`
- `frontend/src/pages/disclaimer-page.test.tsx`
- `frontend/src/pages/result-page.tsx`
- `frontend/src/pages/result-page.test.tsx`

**Modificar:**
- `frontend/src/App.tsx` — adicionar rotas `/aviso`, `/resultado`, `/formulario`

**Remover (ao final):**
- `frontend/src/pages/home.tsx`
- `frontend/src/pages/home.test.tsx`
