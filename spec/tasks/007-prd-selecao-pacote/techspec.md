# Tech Spec — Seleção de Pacote de Serviço

## Resumo Executivo

A funcionalidade adiciona a `PackageSelectionPage` (rota `/pacote`) entre o `DisclaimerPage` e o formulário multi-etapas. O backend já possui `GET /api/contratos/pacotes` com `pacotes.json` — o endpoint é reutilizado após extensão dos dados com os campos `tipo_servico` e `tipologias`. O frontend busca os pacotes via fetch, exibe cards clicáveis, revela tipologias dinamicamente após seleção de pacote, e ao confirmar grava os dados derivados no `form-store` via `updateStep`. O `DisclaimerPage` tem sua navegação atualizada de `/formulario` para `/pacote`.

## Arquitetura do Sistema

### Visão Geral dos Componentes

**Backend — modificado:**
- `backend/src/data/pacotes.json` — adicionar `tipo_servico: string` e `tipologias: string[]` a cada pacote
- `backend/src/services/contratos-service.ts` — atualizar interface `Pacote` com os novos campos
- `backend/src/routes/contratos.ts` — sem alterações (rota `GET /api/contratos/pacotes` já existe)

**Frontend — novos:**
- `PackageSelectionPage` (`pages/package-selection-page.tsx`) — rota `/pacote`
- `package-selection-page.module.css` — estilos CSS Modules

**Frontend — modificados:**
- `App.tsx` — adicionar rota `/pacote`
- `DisclaimerPage` (`pages/disclaimer-page.tsx`) — alterar `navigate('/formulario')` para `navigate('/pacote')`
- `disclaimer-page.test.tsx` — atualizar assert da navegação

**Fluxo de dados:**
```
DisclaimerPage → navigate('/pacote')
PackageSelectionPage
  → fetch('GET /api/contratos/pacotes')
  → useState: packages[], loading, error, selectedPackageId, selectedTypology
  → seleção de pacote → exibe tipologias
  → seleção de tipologia → habilita "Continuar"
  → "Continuar" → updateStep('package', {...}) → navigate('/formulario')
```

## Design de Implementação

### Interfaces Principais

```typescript
// Interface Pacote atualizada (contratos-service.ts)
export interface Pacote {
  id: string
  label: string
  tipo_servico: string      // novo
  tipologias: string[]      // novo
  escopo_padrao: string
  numero_revisoes_sugerido: number
  entregaveis: string[]
}

// Dados gravados no form-store (step 'package')
interface PackageStepData {
  pacote_servico: string    // pkg.id
  tipo_servico: string      // pkg.tipo_servico
  tipo_projeto: string      // tipologia selecionada
  escopo_servicos: string   // pkg.escopo_padrao
  numero_revisoes: string   // String(pkg.numero_revisoes_sugerido)
}
```

### Modelos de Dados

**`pacotes.json` — campos adicionados por pacote:**

| id | tipo_servico | tipologias |
|---|---|---|
| projeto-arquitetura | projeto | ["residencial","comercial","corporativa","institucional","outros"] |
| projeto-arquitetura-interiores | reforma de interiores | ["residencial","comercial"] |
| projeto-acompanhamento-obra | projeto | ["residencial","comercial"] |
| reforma | reforma | ["residencial","comercial"] |
| reforma-interiores | reforma de interiores | ["residencial","comercial"] |

**Estado local de `PackageSelectionPage`:**
```typescript
const [packages, setPackages] = useState<Pacote[]>([])
const [loading, setLoading] = useState<boolean>(true)
const [error, setError] = useState<string | null>(null)
const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
const [selectedTypology, setSelectedTypology] = useState<string | null>(null)
```

### Endpoints de API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/contratos/pacotes` | Retorna lista de pacotes com tipologias e dados de pré-config (já implementado) |

Formato de resposta (sem mudança no handler, apenas nos dados):
```json
[{
  "id": "projeto-arquitetura",
  "label": "Projeto de Arquitetura",
  "tipo_servico": "projeto",
  "tipologias": ["residencial","comercial","corporativa","institucional","outros"],
  "escopo_padrao": "...",
  "numero_revisoes_sugerido": 2,
  "entregaveis": [...]
}]
```

## Pontos de Integração

- **`GET /api/contratos/pacotes`** (Hono backend): chamado via `fetch` no `useEffect` do `PackageSelectionPage`; trata loading, erro de rede e erro HTTP
- **`useFormStore.updateStep`** (Zustand): grava o step `'package'` com `PackageStepData` ao confirmar; sobrescreve seleção anterior se o usuário voltar e trocar de pacote
- **`useNavigate`** (React Router 7): navegação para `/formulario` após confirmação; `DisclaimerPage` atualizado para `/pacote`

## Verificações Técnicas

### Segurança

- Dados dos pacotes são somente leitura e hardcoded — sem vetor de injection
- Fetch para próprio backend (same-origin em produção) — sem CSRF adicional

### Arquitetura

- Fetch do pacotes no `useEffect` do componente — sem hook customizado (escopo simples)
- Seleção de pacote e tipologia: `useState` local; dados confirmados vão para o form-store
- Trocar de pacote redefine `selectedTypology` para `null` — evita estado inconsistente

### Infraestrutura

- Nenhuma dependência nova; CSS Modules suportado pelo Vite nativamente
- Backend serve dados estáticos de JSON — sem impacto de performance

## Abordagem de Testes

### Testes Unidade

**`package-selection-page.test.tsx` (frontend):**
- Renderiza indicador de loading durante fetch
- Renderiza 5 cards de pacote após fetch bem-sucedido
- Clicar em card seleciona pacote (`aria-pressed="true"`)
- Selecionar pacote exibe tipologias disponíveis
- Clicar em tipologia a seleciona
- "Continuar" inicia desabilitado
- Selecionar pacote + tipologia → "Continuar" habilita
- Clicar "Continuar" chama `updateStep('package', {...})` e `navigate('/formulario')`
- Trocar de pacote redefine tipologia selecionada
- Renderiza mensagem de erro quando fetch falha

**`disclaimer-page.test.tsx` (frontend — atualizar):**
- Atualizar assert existente: `navigate('/formulario')` → `navigate('/pacote')`

**`contratos-service.test.ts` (backend — estender):**
- `getPackages()` retorna array com `tipo_servico` e `tipologias` em cada pacote
- Cada pacote tem pelo menos uma tipologia

**`contratos.test.ts` (backend — estender):**
- `GET /api/contratos/pacotes` retorna 200 com campos `tipo_servico` e `tipologias` presentes

### Testes de Integração

Não necessários — os dados são estáticos e o endpoint já existe.

### Testes de E2E

Fora do escopo desta tech spec.

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **Backend — `pacotes.json` + interface `Pacote`**: estender dados e tipo; não quebra nada existente
2. **Backend — testes de regressão**: verificar que `getPackages()` e `GET /api/contratos/pacotes` retornam os novos campos
3. **Frontend — `PackageSelectionPage`** + CSS Module + testes
4. **Frontend — `App.tsx`**: adicionar rota `/pacote`
5. **Frontend — `DisclaimerPage`**: atualizar `navigate('/formulario')` → `navigate('/pacote')` + atualizar teste

### Dependências Técnicas

- Nenhuma biblioteca nova
- O passo 5 depende do passo 3 (a rota `/pacote` precisa existir antes de atualizar o disclaimer)

## Monitoramento e Observabilidade

### Error Tracking

Erros de fetch no frontend exibem mensagem ao usuário e podem ser capturados futuramente por ferramenta de APM.

### Logging Estruturado

Nenhum log novo necessário — o endpoint existente já não produz logs específicos.

### Health Checks / Métricas / Alertas

Não aplicável nesta fase.

## Considerações Técnicas

### Decisões Principais

| Decisão | Escolha | Alternativa rejeitada | Justificativa |
|---|---|---|---|
| Endpoint | Reusar `/api/contratos/pacotes` | Criar `/api/pacotes` | Evita duplicação; rota já existe e funciona |
| Tipologia → campo | `tipo_projeto` | Campo novo `tipologia` | `tipo_projeto` já existe no `ContratoPayload` e mapeia para `descricao_objeto` no contrato |
| Fetch strategy | `useEffect` local | Hook customizado | Escopo simples; hook seria overkill |
| Estado de seleção | `useState` local | form-store | Dados só vão ao store ao confirmar — evita estado sujo no store |

### Riscos Conhecidos

- Alterar `pacotes.json` e a interface `Pacote` pode impactar testes existentes do backend que verificam a estrutura de `getPackages()` — verificar antes de implementar
- O `disclaimer-page.test.tsx` tem um assert `navigate('/formulario')` que deve ser atualizado para `/pacote` na mesma task

### Conformidade com Skills Padrões

| Área | Tecnologia | Status |
|---|---|---|
| Backend | Hono + TypeScript | Conforme |
| Frontend | React 19 + Vite + TypeScript | Conforme |
| Estado | Zustand 5 (`updateStep`) | Conforme |
| CSS | CSS Modules | Conforme |
| Testes | Vitest + Testing Library | Conforme |
| Package mgr | bun | Conforme |

### Arquivos relevantes e dependentes

**Modificar (backend):**
- `backend/src/data/pacotes.json` — adicionar `tipo_servico` e `tipologias`
- `backend/src/services/contratos-service.ts` — atualizar interface `Pacote`
- `backend/src/services/contratos-service.test.ts` — estender testes
- `backend/src/routes/contratos.test.ts` — estender testes

**Criar (frontend):**
- `frontend/src/pages/package-selection-page.tsx`
- `frontend/src/pages/package-selection-page.module.css`
- `frontend/src/pages/package-selection-page.test.tsx`

**Modificar (frontend):**
- `frontend/src/App.tsx` — adicionar rota `/pacote`
- `frontend/src/pages/disclaimer-page.tsx` — atualizar `navigate`
- `frontend/src/pages/disclaimer-page.test.tsx` — atualizar assert
