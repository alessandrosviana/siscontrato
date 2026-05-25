# Tech Spec — Formulário de Dados do Projeto (Feature 010)

## Resumo Executivo

Implementar `ProjectFormPage` em `/projeto`, etapa 6 do fluxo. O componente pré-preenche `tipo_servico` e `tipo_projeto` (tipologia) a partir de `steps['package']` na primeira visita, com indicação visual "(sugestão do pacote)". A validação é silenciosa — botão "Continuar" desabilitado enquanto campos obrigatórios estiverem ausentes. Ao confirmar, salva em `steps['project']` e navega para `/resultado`. Inclui ajuste em `ClientFormPage` para redirecionar para `/projeto` e extensão de `ContratoPayload` com `tipo_contrato` e `area_projeto` opcionais.

## Arquitetura do Sistema

### Visão Geral dos Componentes

| Componente | Ação | Responsabilidade |
|---|---|---|
| `project-form-page.tsx` | **criar** | Formulário do projeto com 5 campos e pré-preenchimento do pacote |
| `project-form-page.module.css` | **criar** | Estilos CSS Module com classe `.suggestionTag` |
| `project-form-page.test.tsx` | **criar** | Testes Vitest + Testing Library |
| `frontend/src/types/contrato.ts` | **modificar** | Adicionar `tipo_contrato?`, tornar `area_projeto?` opcional |
| `frontend/src/pages/client-form-page.tsx` | **modificar** | `navigate('/resultado')` → `navigate('/projeto')` |
| `frontend/src/App.tsx` | **modificar** | Adicionar rota `/projeto` → `ProjectFormPage` |

**Fluxo de dados:** `steps['package']` (pré-fill na 1ª visita) + `steps['project']` (pré-fill em visitas seguintes) → state local `fields` → `isFormValid` → `updateStep('project', {...})` → `navigate('/resultado')`.

**Merge no ResultPage:** `steps['project']` sobrescreve `tipo_servico` e `tipo_projeto` de `steps['package']` no merge genérico, o que é o comportamento correto — os valores editados pelo usuário no formulário do projeto têm prioridade.

## Design de Implementação

### Interfaces Principais

```typescript
interface ProjectFields {
  tipo_contrato: string
  tipo_servico: string
  tipo_projeto: string
  endereco_projeto: string
  area_projeto: string
}
```

**Estado do componente:**
- `fields: ProjectFields` — valores dos 5 campos
- `suggestedFields: Set<string>` — campos pré-preenchidos do pacote na primeira visita; inicializado na montagem se `steps['project']` não existir; determina quais labels exibem a etiqueta "(sugestão do pacote)"
- Sem estado de erros — validação silenciosa; sem `submitted` flag

**Lógica de pré-preenchimento na montagem:**
```
se steps['project'] existe → popular fields com steps['project'], suggestedFields = Set vazio
senão → popular tipo_servico e tipo_projeto de steps['package'], suggestedFields = Set{'tipo_servico', 'tipo_projeto'}
```

**Função de validação (pura):**
```typescript
function isFormValid(fields: ProjectFields): boolean
```
- `tipo_contrato` não vazio
- `tipo_servico` não vazio
- `tipo_projeto` não vazio
- `endereco_projeto.trim()` não vazio
- `area_projeto`: se preenchido, deve ser número positivo (incluindo decimais)

Botão "Continuar": `disabled={!isFormValid(fields)}`

**Constantes para os selects:**
```typescript
const TIPO_CONTRATO_OPTIONS = ['Prestação de Serviço', 'Empreitada']
const TIPO_SERVICO_OPTIONS = ['projeto', 'reforma', 'reforma de interiores']
const TIPOLOGIA_OPTIONS = ['residencial', 'comercial', 'corporativa', 'institucional', 'outros']
```

### Modelos de Dados

**Alterações em `ContratoPayload` (`contrato.ts`):**
```typescript
tipo_contrato?: string   // adicionar (obrigatório no contrato, opcional no payload para compat)
area_projeto?: string    // tornar opcional (era string obrigatório)
```

**Dados gravados no form-store ao confirmar:**
```typescript
updateStep('project', {
  tipo_contrato: fields.tipo_contrato,
  tipo_servico: fields.tipo_servico,
  tipo_projeto: fields.tipo_projeto,
  endereco_projeto: fields.endereco_projeto,
  area_projeto: fields.area_projeto,
})
```

### Endpoints de API

Não aplicável — funcionalidade exclusivamente frontend.

## Pontos de Integração

| Dependência | Uso | Localização |
|---|---|---|
| `useFormStore` | Leitura de `steps['package']` e `steps['project']`, `updateStep` | `frontend/src/store/form-store.ts` |
| `useNavigate` (react-router) | Navegação para `/resultado` e `/contratante` | dependência existente |
| `ResultPage` | Destino de "Continuar"; faz merge de steps pelo spread | `/resultado` |
| `ClientFormPage` | Atualização de `navigate('/resultado')` → `navigate('/projeto')` | `client-form-page.tsx` linha 100 |

## Verificações Técnicas

### Segurança

- Nenhum dado sensível — endereço do projeto e tipo não requerem sanitização especial
- Selects com opções fixas — sem risco de injeção

### Arquitetura

- `isFormValid` declarada fora do componente (função pura, sem closure) — mesma decisão de Feature 009
- `suggestedFields` é `Set<string>` inicializado uma única vez na montagem via `useState` com inicializador lazy — evita recalcular a cada render
- `area_projeto` armazenado como `string` (consistente com os demais campos do payload), validado via `parseFloat` + `isNaN` + `> 0`
- Tornar `area_projeto` opcional em `ContratoPayload` pode afetar `result-page.tsx` — verificar se `buildPayload` usa esse campo diretamente

### Infraestrutura

Sem novos recursos — build estático Vite.

## Abordagem de Testes

### Testes Unidade

**Arquivo:** `frontend/src/pages/project-form-page.test.tsx`

**Mocks:**
```typescript
const mockNavigate = vi.fn()
vi.mock('react-router', () => ({ useNavigate: () => mockNavigate }))

const mockUpdateStep = vi.fn()
vi.mock('../store/form-store', () => ({
  useFormStore: () => ({ updateStep: mockUpdateStep, steps: {} })
}))
```

**Cenários obrigatórios:**

| Cenário | Verificação |
|---|---|
| Renderiza 5 campos e botões Continuar/Voltar | Elementos presentes no DOM |
| Formulário vazio → botão desabilitado | `disabled` no botão |
| `tipo_contrato` vazio → botão desabilitado | `disabled` mesmo com demais preenchidos |
| `endereco_projeto` vazio → botão desabilitado | `disabled` mesmo com demais preenchidos |
| `area_projeto` preenchido com valor inválido (texto) → botão desabilitado | `disabled` |
| Todos os campos obrigatórios válidos → botão habilitado | `!disabled` |
| `area_projeto` opcional: formulário válido sem preencher area | `!disabled` |
| "Continuar" válido → `updateStep('project', {...})` com dados corretos | Mock chamado |
| "Continuar" válido → `navigate('/resultado')` | Mock chamado |
| "Voltar" → `navigate('/contratante')` | Mock chamado |
| Pré-preenchimento de `steps['project']` (revisita) | Campos populados |
| Pré-preenchimento de `steps['package']` (1ª visita) para tipo_servico e tipo_projeto | Campos tipo_servico e tipo_projeto populados |
| Etiqueta "(sugestão do pacote)" visível na 1ª visita (sem steps['project']) | Texto presente para tipo_servico e tipo_projeto |
| Etiqueta ausente na revisita (com steps['project']) | Texto ausente |

**Teste de regressão para ClientFormPage:**
- `navigate('/projeto')` chamado ao confirmar (não mais `/resultado`)

### Testes de Integração / E2E

Não aplicável nesta feature.

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **Task 1.0 — ContratoPayload**: adicionar `tipo_contrato?` e tornar `area_projeto?` em `contrato.ts` + verificar `result-page.tsx` + build e test
2. **Task 2.0 — ProjectFormPage** (depende: 1.0): criar `project-form-page.tsx`, CSS Module e testes; atualizar `client-form-page.tsx` (navigate) e `App.tsx` (nova rota)

### Dependências Técnicas

- Features 007–009 concluídas (`form-store`, `validators`, estrutura de store já estabelecida)
- `steps['package']` populado pela `PackageSelectionPage` com `tipo_servico` e `tipo_projeto`

## Monitoramento e Observabilidade

Não aplicável — componente frontend sem integrações externas.

## Considerações Técnicas

### Decisões Principais

| Decisão | Escolha | Trade-off |
|---|---|---|
| `suggestedFields` como Set inicializado na montagem | `useState` com inicializador lazy | Simples e correto; a etiqueta desaparece após salvar e voltar (comportamento esperado) |
| `area_projeto` como string no store | Consistente com demais campos do payload | Conversão para `parseFloat` apenas na validação; o PDF template recebe string |
| `tipo_projeto` como nome de campo no step 'project' | Consistente com `ContratoPayload.tipo_projeto` | Sobrescreve corretamente o valor de `steps['package']` no merge do ResultPage |
| Validação silenciosa (botão desabilitado) | Mesmo padrão de Feature 009 | Consistência UX entre formulários do cliente e do projeto |

### Riscos Conhecidos

- **`area_projeto` em `ContratoPayload`**: tornar opcional pode afetar templates de contrato que esperam o campo sempre presente. Verificar `result-page.tsx` e o template PDF no backend.
- **`tipo_contrato` ausente do payload atual**: o `ResultPage` faz spread genérico — `tipo_contrato` estará no payload se vier de `steps['project']`. Mas templates PDF existentes podem não usar esse campo ainda.

### Conformidade com Skills Padrões

- **Frontend**: React 19 + Vite + TypeScript
- **CSS**: CSS Modules
- **Estado**: Zustand 5 (`useFormStore`)
- **Testes**: Vitest + Testing Library
- **Package mgr**: bun

### Arquivos relevantes e dependentes

- `frontend/src/pages/project-form-page.tsx` — criar
- `frontend/src/pages/project-form-page.module.css` — criar
- `frontend/src/pages/project-form-page.test.tsx` — criar
- `frontend/src/types/contrato.ts` — modificar (`tipo_contrato?`, `area_projeto?`)
- `frontend/src/pages/client-form-page.tsx` — modificar (navigate target)
- `frontend/src/App.tsx` — modificar (nova rota `/projeto`)
- `frontend/src/pages/result-page.tsx` — verificar (impacto de `area_projeto` opcional)
- `frontend/src/store/form-store.ts` — ler (interface de store)
- `frontend/src/pages/client-form-page.tsx` — referência de padrão (validação silenciosa)
- `frontend/src/pages/client-form-page.module.css` — referência de estilos
