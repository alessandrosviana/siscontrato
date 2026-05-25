# Tarefa 2.0: ClientFormPage — Implementar tela de dados do cliente

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 1.0 (ContratoPayload atualizado — build deve passar)

## Estimativa

- **Tamanho**: G
- **Horas estimadas**: 4-8h

## Visão Geral

Criar o componente `ClientFormPage` em `frontend/src/pages/client-form-page.tsx` com CSS Module associado. A página exibe um formulário com seleção de tipo de cliente (PF/PJ) e campos dinâmicos: 5 campos base para ambos os tipos + 2 campos condicionais (`razao_social`, `nome_representante_legal`) exibidos apenas quando PJ. A validação é silenciosa (sem mensagens de erro): o botão "Continuar" fica desabilitado enquanto o formulário estiver inválido. Ao clicar "Continuar" (com formulário válido), grava no `form-store` e navega para `/resultado`. O botão "Voltar" retorna para `/formulario`. A tela pré-preenche os campos se o usuário já passou por ela antes. Por fim, atualizar `App.tsx` para registrar a rota `/contratante`.

<skills>
### Conformidade com Skills Padrões

- **Frontend**: React 19 + Vite + TypeScript
- **CSS**: CSS Modules
- **Estado**: Zustand 5 (`useFormStore`)
- **Testes**: Vitest + Testing Library
- **Package mgr**: bun
</skills>

<requirements>
- RF-01 (PRD): Seletor de tipo de cliente (PF/PJ) no topo do formulário; padrão inicial: Pessoa Física
- RF-02 (PRD): Campos base para ambos os tipos: `cliente_nome` (obrigatório), `cliente_documento` (obrigatório + validação CPF ou CNPJ), `cliente_endereco` (obrigatório), `cliente_email` (opcional), `cliente_telefone` (opcional)
- RF-03 (PRD): Campos condicionais somente quando PJ: `razao_social` (obrigatório) e `nome_representante_legal` (obrigatório)
- RF-04 (PRD): Ao trocar tipo, limpar `cliente_documento`, `razao_social` e `nome_representante_legal`
- RF-05 (PRD): Máscara dinâmica em `cliente_documento` — CPF (`000.000.000-00`) quando PF, CNPJ (`00.000.000/0000-00`) quando PJ; campo limpo ao trocar
- RF-06 (PRD): Botão "Continuar" desabilitado enquanto formulário inválido; validação silenciosa sem mensagens de erro
- RF-07 (PRD): Botão "Voltar" → `navigate('/formulario')` sem apagar dados do store
- RF-08 (PRD): "Continuar" → `updateStep('client', {...})` + `navigate('/resultado')`
- RF-09 (PRD): Pré-preenchimento de `steps['client']` do store na montagem (incluindo `clientTipo`)
- Acessibilidade: `<label htmlFor>` em todos os campos, `fieldset + legend` ou `aria-label` no grupo de rádios, `<h1>` único
- `App.tsx`: adicionar rota `/contratante` → `ClientFormPage`
- Sem linhas em branco dentro de funções (code-standards.md)
- `bun run test` e `bun run build` devem passar sem erros
</requirements>

## Subtarefas

- [ ] 2.1 Criar `frontend/src/pages/client-form-page.tsx` com os estados: `clientTipo` ('PF' | 'PJ'), `fields` (7 campos)
- [ ] 2.2 Implementar pré-preenchimento: ler `steps['client']` do form-store na montagem e popular `fields` e `clientTipo`
- [ ] 2.3 Implementar funções de máscara inline: `applyCpfMask`, `applyCnpjMask`, `applyPhoneMask` (sem biblioteca)
- [ ] 2.4 Implementar `handleTypeChange`: atualizar `clientTipo`, zerar `cliente_documento`, `razao_social` e `nome_representante_legal`
- [ ] 2.5 Implementar `isFormValid(fields, clientTipo)`: função pura que retorna `boolean` — usada para desabilitar o botão
- [ ] 2.6 Implementar `handleSubmit`: verificar `isFormValid`, chamar `updateStep('client', {...})` + `navigate('/resultado')`
- [ ] 2.7 Renderizar seletor de tipo (radio buttons PF/PJ) com `fieldset + legend`
- [ ] 2.8 Renderizar campos base com `<label>` + `<input>` para os 5 campos base
- [ ] 2.9 Renderizar campos condicionais PJ (`razao_social`, `nome_representante_legal`) com renderização condicional baseada em `clientTipo`
- [ ] 2.10 Implementar botão "Voltar" com `navigate('/formulario')`
- [ ] 2.11 Criar `frontend/src/pages/client-form-page.module.css` com estilos institucionais (seguir padrão de `architect-form-page.module.css`, adicionar estilo para `.radioGroup`)
- [ ] 2.12 Criar `frontend/src/pages/client-form-page.test.tsx` com os testes descritos abaixo
- [ ] 2.13 Atualizar `frontend/src/App.tsx`: importar `ClientFormPage` e adicionar rota `/contratante`
- [ ] 2.14 Executar `bun run test` no diretório `frontend` — todos os testes devem passar
- [ ] 2.15 Executar `bun run build` no diretório `frontend`

## Detalhes de Implementação

Consulte as seções **"Interfaces Principais"**, **"Modelos de Dados"**, **"Pontos de Integração"** e **"Testes Unidade"** da `techspec.md`.

**Dados gravados no form-store ao confirmar:**
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

**Função de validação silenciosa:**
```typescript
function isFormValid(fields: ClientFields, tipo: ClientTipo): boolean {
  // cliente_nome não vazio
  // cliente_documento: validateCpf se PF, validateCnpj se PJ
  // cliente_endereco não vazio
  // cliente_email: se preenchido, validateEmail
  // cliente_telefone: se preenchido, validatePhone
  // se PJ: razao_social não vazio e nome_representante_legal não vazio
}
```

**Botão "Continuar":** `disabled={!isFormValid(fields, clientTipo)}`

**Mock de `useNavigate` nos testes:**
```typescript
const mockNavigate = vi.fn()
vi.mock('react-router', () => ({ useNavigate: () => mockNavigate }))
```

**Mock do `useFormStore` nos testes:**
```typescript
const mockUpdateStep = vi.fn()
vi.mock('../store/form-store', () => ({
  useFormStore: () => ({ updateStep: mockUpdateStep, steps: {} })
}))
```

## Critérios de Sucesso

- Todos os testes de `client-form-page.test.tsx` passam
- `bun run build` sem erros de TypeScript
- Rota `/contratante` exibe o formulário do cliente
- Seletor PF/PJ muda os campos condicionais imediatamente
- Botão "Continuar" desabilitado com campos inválidos, habilitado com todos válidos
- "Continuar" com dados válidos chama `updateStep` e navega para `/resultado`

## Testes da Tarefa

- [ ] Testes de unidade (`client-form-page.test.tsx`):
  - Renderiza seletor de tipo (PF selecionado por padrão) e campos base
  - Selecionar PJ exibe `razao_social` e `nome_representante_legal`
  - Selecionar PF oculta campos condicionais
  - Trocar PJ → PF limpa `razao_social` e `nome_representante_legal`
  - Formulário vazio → botão "Continuar" desabilitado
  - CPF inválido (PF) → botão desabilitado
  - CNPJ inválido (PJ) → botão desabilitado
  - Todos os campos PF válidos → botão "Continuar" habilitado
  - Todos os campos PJ válidos (incluindo condicionais) → botão habilitado
  - "Continuar" com PF válido → `updateStep('client', {...})` com dados corretos e `navigate('/resultado')`
  - "Voltar" → `navigate('/formulario')`
  - Campos pré-preenchidos quando `steps['client']` existe no store (incluindo `clientTipo`)
  - Máscara CPF aplicada ao digitar (ex: `52998224725` → `529.982.247-25`)
  - Trocar tipo limpa `cliente_documento`
- [ ] Testes de integração: não aplicável
- [ ] Testes E2E: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/pages/client-form-page.tsx` — criar
- `frontend/src/pages/client-form-page.module.css` — criar
- `frontend/src/pages/client-form-page.test.tsx` — criar
- `frontend/src/utils/validators.ts` — ler e importar (Task 1.0 da Feature 008)
- `frontend/src/store/form-store.ts` — ler (usar `updateStep` e `steps`)
- `frontend/src/types/contrato.ts` — ler (referência de tipos, Task 1.0 desta feature)
- `frontend/src/App.tsx` — modificar (adicionar rota `/contratante`)
- `frontend/src/pages/architect-form-page.tsx` — referência de padrão de implementação
- `frontend/src/pages/architect-form-page.module.css` — referência de estilos
