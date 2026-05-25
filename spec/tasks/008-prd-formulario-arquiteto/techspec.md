# Tech Spec — Formulário de Dados do Arquiteto

## Resumo Executivo

Implementa `ArchitectFormPage` na rota `/formulario` (substituindo o placeholder atual), coletando 7 campos do arquiteto com validação no submit. A validação de CPF/CNPJ (com dígito verificador), CAU, email e telefone é feita por funções puras em `validators.ts`, sem nova dependência. `ContratoPayload` é estendido com 4 campos novos. Dados confirmados vão para o `form-store` via `updateStep('architect', {...})`.

## Arquitetura do Sistema

### Visão Geral dos Componentes

**Frontend — novos:**
- `ArchitectFormPage` (`pages/architect-form-page.tsx`) — formulário com estado local de campos e erros
- `architect-form-page.module.css` — estilos CSS Modules
- `architect-form-page.test.tsx` — testes unitários
- `frontend/src/utils/validators.ts` — funções puras de validação (CPF, CNPJ, CAU, email, telefone)

**Frontend — modificados:**
- `frontend/src/types/contrato.ts` — adicionar 4 campos ao `ContratoPayload`
- `frontend/src/App.tsx` — substituir placeholder `/formulario` por `<ArchitectFormPage />`

**Fluxo de dados:**
```
PackageSelectionPage → navigate('/formulario')
ArchitectFormPage
  → useState: fields (7 campos), errors (Record<string,string>), submitted (boolean)
  → "Continuar" → validateAll() → se válido: updateStep('architect', {...}) → navigate('/contratante')
  → "Voltar" → navigate('/pacote')
  → pré-preenchimento: steps['architect'] do form-store na montagem
```

## Design de Implementação

### Interfaces Principais

```typescript
// Estado local do formulário
interface ArchitectFields {
  arquiteto_nome: string
  arquiteto_cpf: string
  arquiteto_cnpj: string
  registro_cau: string
  arquiteto_endereco: string
  arquiteto_email: string
  arquiteto_telefone: string
}

// Dados gravados no form-store (step 'architect')
interface ArchitectStepData {
  arquiteto_nome: string
  arquiteto_cpf: string
  arquiteto_cnpj: string
  registro_cau: string
  arquiteto_endereco: string
  arquiteto_email: string
  arquiteto_telefone: string
}

// Retorno da validação
interface ValidationResult {
  valid: boolean
  errors: Record<keyof ArchitectFields, string>
}
```

### Modelos de Dados

**`ContratoPayload` — campos adicionados:**

```typescript
export interface ContratoPayload {
  // ... campos existentes ...
  arquiteto_cpf: string       // novo
  arquiteto_cnpj: string      // novo
  arquiteto_email: string     // novo
  arquiteto_telefone: string  // novo
}
```

**Estado local de `ArchitectFormPage`:**
```typescript
const [fields, setFields] = useState<ArchitectFields>(initialFields)
const [errors, setErrors] = useState<Record<string, string>>({})
const [submitted, setSubmitted] = useState<boolean>(false)
```

`submitted` ativa a exibição de erros — antes do primeiro clique em "Continuar" nenhum erro é exibido.

### Validators (`frontend/src/utils/validators.ts`)

| Função | Entrada | Lógica |
|--------|---------|--------|
| `validateCpf(v)` | string com máscara | Remove máscara, verifica 11 dígitos + algoritmo módulo 11 |
| `validateCnpj(v)` | string com máscara | Remove máscara, verifica 14 dígitos + algoritmo módulo 11 |
| `validateCau(v)` | string | Regex `/^[A-Z]\d{4,6}-\d$/` |
| `validateEmail(v)` | string | Regex RFC-5322 simplificado |
| `validatePhone(v)` | string com máscara | Remove máscara, verifica 10 ou 11 dígitos |

**Regra CPF/CNPJ exclusivo:** pelo menos um deve estar preenchido e válido. Se ambos preenchidos, ambos devem ser válidos.

### Máscaras (onChange inline)

Sem biblioteca — funções utilitárias puras chamadas no `onChange`:
- CPF: `###.###.###-##` (máximo 14 chars com máscara)
- CNPJ: `##.###.###/####-##` (máximo 18 chars com máscara)
- Telefone: `(##) #####-####` (celular) ou `(##) ####-####` (fixo), detectado pelo 9º dígito

### Pré-preenchimento

Na montagem do componente, ler `steps['architect']` do form-store e popular o estado inicial dos campos — permite que o usuário volte sem perder o que digitou.

### Endpoints de API

Nenhum. Este componente não faz chamadas de rede.

## Pontos de Integração

- **`useFormStore.updateStep('architect', data)`** — grava os 7 campos ao confirmar
- **`useFormStore` leitura inicial** — `steps['architect']` para pré-preenchimento
- **`useNavigate`** — `/contratante` ao confirmar, `/pacote` ao voltar

## Verificações Técnicas

### Segurança

- Sem chamadas de rede — sem vetores de injeção via API
- CPF/CNPJ: nunca logar valores no `console.error`; mascarar dados sensíveis em logs (`***`)
- Dados existem apenas na sessão do navegador (Zustand in-memory)

### Arquitetura

- Validação 100% no frontend (sem backend) — dados estáticos, sem risco de bypass crítico
- Estado de erros ativado somente após primeiro submit (`submitted` flag) — evita erros prematuros
- Validadores são funções puras exportadas separadamente — testáveis isoladamente
- Máscaras como funções puras chamadas no `onChange` — sem efeitos colaterais

### Infraestrutura

- Sem nova dependência; CSS Modules suportado nativamente pelo Vite
- A rota `/contratante` ainda não existe — `navigate('/contratante')` resultará em 404 até a próxima feature; comportamento esperado nesta entrega

## Abordagem de Testes

### Testes Unidade

**`validators.test.ts`:**
- `validateCpf`: CPF válido, inválido (dígito errado), todos zeros, vazio
- `validateCnpj`: CNPJ válido, inválido, vazio
- `validateCau`: formatos válidos e inválidos
- `validateEmail`: formatos válidos e inválidos
- `validatePhone`: celular 11 dígitos, fixo 10 dígitos, inválido

**`architect-form-page.test.tsx`:**
- Renderiza os 7 campos e os 2 botões
- Clicar "Continuar" com campos vazios exibe erros em todos os campos obrigatórios
- Preencher CPF válido + demais campos → "Continuar" navega para `/contratante`
- Preencher CNPJ válido + demais campos → "Continuar" navega para `/contratante`
- CPF e CNPJ ambos inválidos → erro na regra CPF/CNPJ
- "Continuar" chama `updateStep('architect', {...})` com os campos corretos
- "Voltar" navega para `/pacote`
- Campos pré-preenchidos quando `steps['architect']` existe no form-store
- Máscara de CPF aplicada ao digitar

**Mocks padrão:**
```typescript
const mockNavigate = vi.fn()
vi.mock('react-router', () => ({ useNavigate: () => mockNavigate }))

const mockUpdateStep = vi.fn()
vi.mock('../store/form-store', () => ({ useFormStore: () => ({ updateStep: mockUpdateStep, steps: {} }) }))
```

### Testes de Integração

Não necessários — sem comunicação entre módulos via API.

### Testes de E2E

Fora do escopo desta tech spec.

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **`validators.ts`** + testes unitários dos validators — base isolada, sem dependências
2. **`ContratoPayload`** — estender os 4 campos novos em `contrato.ts`
3. **`ArchitectFormPage`** + CSS Module — componente principal com state, máscaras, validação e navegação
4. **`architect-form-page.test.tsx`** — testes do componente
5. **`App.tsx`** — substituir placeholder `/formulario` por `<ArchitectFormPage />`
6. **`bun run test` + `bun run build`** — verificação final

### Dependências Técnicas

- Nenhuma biblioteca nova
- Rota `/contratante` (próxima feature) não precisa existir para completar esta entrega

## Monitoramento e Observabilidade

### Error Tracking

Não há chamadas de rede nesta feature — sem erros assíncronos a rastrear.

### Logging Estruturado

Sem logs novos. CPF/CNPJ nunca devem aparecer em logs.

### Health Checks / Métricas / Alertas

Não aplicável nesta fase.

## Considerações Técnicas

### Decisões Principais

| Decisão | Escolha | Alternativa rejeitada | Justificativa |
|---|---|---|---|
| Validação CPF/CNPJ | Custom TypeScript | `cpf-cnpj-validator` | Sem nova dependência; algoritmo simples e testável |
| Máscaras | `onChange` inline | `react-input-mask` | Sem nova dependência; controle total sobre formatação |
| ContratoPayload | Estender agora | Deixar só no store | Dados do arquiteto são campos do contrato — coerente com a estrutura atual |
| Exibição de erros | Apenas após submit | Real-time | Menos intrusivo; usuário digita sem interrupção |
| Rota atual | `/formulario` | Nova rota `/arquiteto` | A rota já existe no App.tsx como placeholder — reusar é mais simples |

### Riscos Conhecidos

- A rota `/contratante` ainda não existe — a navegação pós-confirmação resulta em 404 até a feature seguinte ser implementada; documentar no teste correspondente
- `ContratoPayload` é usado em `result-page.tsx` para montar o payload do PDF — estender o tipo pode exigir que `buildPayload` seja atualizado para incluir os novos campos (verificar antes de implementar)

### Conformidade com Skills Padrões

| Área | Tecnologia | Status |
|---|---|---|
| Frontend | React 19 + Vite + TypeScript | Conforme |
| CSS | CSS Modules | Conforme |
| Estado | Zustand 5 (`updateStep`) | Conforme |
| Testes | Vitest + Testing Library | Conforme |
| Package mgr | bun | Conforme |

### Arquivos relevantes e dependentes

**Criar (frontend):**
- `frontend/src/pages/architect-form-page.tsx`
- `frontend/src/pages/architect-form-page.module.css`
- `frontend/src/pages/architect-form-page.test.tsx`
- `frontend/src/utils/validators.ts`
- `frontend/src/utils/validators.test.ts`

**Modificar (frontend):**
- `frontend/src/types/contrato.ts` — adicionar 4 campos ao `ContratoPayload`
- `frontend/src/App.tsx` — substituir placeholder por `<ArchitectFormPage />`

**Verificar (potencial impacto):**
- `frontend/src/pages/result-page.tsx` — `buildPayload` usa `ContratoPayload`; verificar se precisa tratar os novos campos opcionais
