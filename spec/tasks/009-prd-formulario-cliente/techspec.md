# Tech Spec — Formulário de Dados do Cliente (Feature 009)

## Resumo Executivo

Implementar a tela `ClientFormPage` em `/contratante`, que coleta dados do cliente contratante com renderização condicional de campos baseada no tipo PF/PJ. A validação é contínua e silenciosa (sem mensagens de erro): o botão "Continuar" permanece desabilitado enquanto o formulário estiver inválido, habilitando-se apenas quando todos os obrigatórios estão corretos. Reutiliza os validators de `Feature 008` e segue o padrão visual e estrutural de `architect-form-page.tsx`.

## Arquitetura do Sistema

### Visão Geral dos Componentes

| Componente | Ação | Responsabilidade |
|---|---|---|
| `client-form-page.tsx` | **criar** | Tela do formulário do cliente com renderização condicional |
| `client-form-page.module.css` | **criar** | Estilos CSS Module (seguir padrão do arquiteto, adicionar `.radioGroup`) |
| `client-form-page.test.tsx` | **criar** | Testes Vitest + Testing Library |
| `frontend/src/types/contrato.ts` | **modificar** | Adicionar 5 campos opcionais do cliente |
| `frontend/src/App.tsx` | **modificar** | Registrar rota `/contratante` → `ClientFormPage` |

**Fluxo de dados:** `useFormStore` (leitura de `steps['client']` na montagem) → state local (`fields`, `clientTipo`) → validação síncrona → `updateStep('client', {...})` + `navigate('/resultado')`.

## Design de Implementação

### Interfaces Principais

```typescript
type ClientTipo = 'PF' | 'PJ'

interface ClientFields {
  cliente_nome: string
  cliente_documento: string
  cliente_endereco: string
  cliente_email: string
  cliente_telefone: string
  razao_social: string
  nome_representante_legal: string
}
```

**Estado do componente:**
- `clientTipo: ClientTipo` — controla renderização condicional e máscara do documento
- `fields: ClientFields` — valores de todos os campos (condicionais sempre presentes, zerados quando PF)
- Sem estado de erros — validação é silenciosa (botão desabilitado); sem `submitted` flag

**Função de validação (pura, sem efeitos):**
```typescript
function isFormValid(fields: ClientFields, tipo: ClientTipo): boolean
```
- `cliente_nome` não vazio
- `cliente_documento`: `validateCpf` se PF, `validateCnpj` se PJ
- `cliente_endereco` não vazio
- `cliente_email`: se preenchido, `validateEmail`
- `cliente_telefone`: se preenchido, `validatePhone`
- Se PJ: `razao_social` não vazio e `nome_representante_legal` não vazio

Botão "Continuar": `disabled={!isFormValid(fields, clientTipo)}`

### Modelos de Dados

**Campos adicionais em `ContratoPayload` (contrato.ts) — todos opcionais:**
```typescript
cliente_tipo?: string
cliente_email?: string
cliente_telefone?: string
razao_social?: string
nome_representante_legal?: string
```

Campos `cliente_nome`, `cliente_documento`, `cliente_endereco` já existem como obrigatórios — sem alteração.

**Dados gravados no `form-store` ao confirmar:**
```typescript
updateStep('client', {
  cliente_tipo: clientTipo,
  cliente_nome: fields.cliente_nome,
  cliente_documento: fields.cliente_documento,
  cliente_endereco: fields.cliente_endereco,
  cliente_email: fields.cliente_email,
  cliente_telefone: fields.cliente_telefone,
  razao_social: fields.razao_social,
  nome_representante_legal: fields.nome_representante_legal,
})
```

### Endpoints de API

Não aplicável — funcionalidade exclusivamente frontend.

## Pontos de Integração

| Dependência | Uso | Localização |
|---|---|---|
| `useFormStore` | Leitura de `steps['client']` (pré-fill), `updateStep` | `frontend/src/store/form-store.ts` |
| `validateCpf`, `validateCnpj`, `validateEmail`, `validatePhone` | Validação silenciosa | `frontend/src/utils/validators.ts` |
| `useNavigate` (react-router) | Navegação para `/resultado` e `/formulario` | dependência existente |
| `ResultPage` | Destino da navegação em "Continuar" | `/resultado` (já registrado em App.tsx) |

## Verificações Técnicas

### Segurança

- CPF e CNPJ validados com algoritmo módulo 11 (sem envio para backend) — sem exposição de dados sensíveis em logs
- Campos de texto sem `dangerouslySetInnerHTML` — sem vetor XSS

### Arquitetura

- Mesmo padrão do `ArchitectFormPage`: componente funcional, estado local, sem contexto adicional
- `isFormValid` é calculada na renderização (não é estado) — evita state obsoleto
- Ao trocar `clientTipo`: `cliente_documento`, `razao_social` e `nome_representante_legal` são zerados via `handleTypeChange` — garante invariante: campos condicionais sempre limpos ao mudar de tipo
- Máscaras CPF/CNPJ/telefone implementadas inline (funções `applyCpfMask`, `applyCnpjMask`, `applyPhoneMask`) — sem dependência externa, mesmo padrão do `ArchitectFormPage`

### Infraestrutura

Sem novos recursos de infraestrutura — build estático Vite + bun.

## Abordagem de Testes

### Testes Unidade

**Arquivo:** `frontend/src/pages/client-form-page.test.tsx`

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
| Renderiza campos base (PF por padrão) | 5 campos base + seletor de tipo presentes |
| Selecionar PJ exibe `razao_social` e `nome_representante_legal` | Campos condicionais visíveis |
| Selecionar PF oculta campos condicionais | Campos condicionais ausentes no DOM |
| Trocar PJ → PF limpa `razao_social` e `nome_representante_legal` | Campos com valor vazio |
| Formulário vazio → botão "Continuar" desabilitado | `disabled` no botão |
| CPF inválido → botão desabilitado | `disabled` no botão |
| CNPJ inválido (PJ) → botão desabilitado | `disabled` no botão |
| Todos os campos PF válidos → botão habilitado | `!disabled` no botão |
| Todos os campos PJ válidos → botão habilitado | `!disabled` no botão |
| "Continuar" com PF válido → `updateStep('client', {...})` e `navigate('/resultado')` | Mock chamado com dados corretos |
| "Voltar" → `navigate('/formulario')` | Mock chamado |
| Pré-preenchimento de `steps['client']` | Campos populados na montagem |
| Máscara CPF aplicada ao digitar | `52998224725` → `529.982.247-25` |
| Trocar tipo limpa `cliente_documento` | Campo vazio após troca |

### Testes de Integração

Não aplicável — sem chamadas a APIs externas.

### Testes E2E

Não aplicável nesta feature.

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **Task 1.0 — ContratoPayload**: adicionar 5 campos opcionais em `contrato.ts` + verificar `result-page.tsx` + executar `bun run build` e `bun run test`
2. **Task 2.0 — ClientFormPage** (depende: 1.0): criar `client-form-page.tsx`, `client-form-page.module.css`, `client-form-page.test.tsx`; atualizar `App.tsx` com rota `/contratante`

### Dependências Técnicas

- Feature 008 concluída (`validators.ts` disponível)
- `form-store.ts` inalterado (interface já suporta chave arbitrária em `updateStep`)

## Monitoramento e Observabilidade

Não aplicável — componente frontend sem integração com serviços externos ou backend nesta feature.

## Considerações Técnicas

### Decisões Principais

| Decisão | Escolha | Trade-off |
|---|---|---|
| Validação silenciosa | Botão desabilitado, sem mensagens de erro | UX mais limpa para formulário curto; usuário não sabe qual campo é inválido se o CPF falhar no módulo 11 |
| `clientTipo` como estado separado | `useState<ClientTipo>` independente de `fields` | Facilita derivar máscara e campos condicionais sem misturar tipo com campos de texto |
| Masks inline no componente | Copiar funções de `architect-form-page.tsx` | Evita acoplamento prematuro; se houver 3+ páginas com máscaras, extrair para `utils/masks.ts` |
| Store key `'client'` | `updateStep('client', {...})` | Consistente com `'architect'` em Feature 008 |

### Riscos Conhecidos

- **Botão sempre desabilitado invisível**: usuário com CNPJ digitado correto mas inválido no módulo 11 não recebe feedback. Mitigação: considerar adicionar indicador visual (ex: borda vermelha no `cliente_documento`) se feedback do usuário indicar confusão.
- **Rota `/contratante` não existe ainda**: `ArchitectFormPage` já navega para `/contratante`; esta feature resolve esse 404.

### Conformidade com Skills Padrões

- **Frontend**: React 19 + Vite + TypeScript
- **CSS**: CSS Modules
- **Estado**: Zustand 5 (`useFormStore`)
- **Testes**: Vitest + Testing Library
- **Package mgr**: bun

### Arquivos relevantes e dependentes

- `frontend/src/pages/client-form-page.tsx` — criar
- `frontend/src/pages/client-form-page.module.css` — criar
- `frontend/src/pages/client-form-page.test.tsx` — criar
- `frontend/src/types/contrato.ts` — modificar (5 campos opcionais)
- `frontend/src/App.tsx` — modificar (rota `/contratante`)
- `frontend/src/pages/result-page.tsx` — verificar (impacto dos novos campos em ContratoPayload)
- `frontend/src/utils/validators.ts` — ler e importar (já existente)
- `frontend/src/store/form-store.ts` — ler (interface de store)
- `frontend/src/pages/architect-form-page.tsx` — referência de padrão
- `frontend/src/pages/architect-form-page.module.css` — referência de estilos
