# Tarefa 2.0: ProjectFormPage — Implementar tela de dados do projeto

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 1.0 (ContratoPayload atualizado — build deve passar)

## Estimativa

- **Tamanho**: G
- **Horas estimadas**: 4-8h

## Visão Geral

Criar o componente `ProjectFormPage` em `frontend/src/pages/project-form-page.tsx` com CSS Module associado. A página exibe um formulário com 5 campos: `tipo_contrato` (select), `tipo_servico` (select), `tipologia`/`tipo_projeto` (select), `endereco_projeto` (texto) e `area_projeto` (número opcional). Os campos `tipo_servico` e `tipologia` são pré-preenchidos a partir do pacote selecionado na Etapa 3 (`steps['package']`) na primeira visita, e exibem a etiqueta "(sugestão do pacote)" ao lado do label. Na revisita, o formulário usa `steps['project']`. A validação é silenciosa: o botão "Continuar" fica desabilitado enquanto campos obrigatórios estiverem ausentes. Ao confirmar, grava no `form-store` e navega para `/resultado`.

Além do novo componente, esta task também:
- Atualiza `ClientFormPage` para navegar para `/projeto` em vez de `/resultado` ao clicar "Continuar"
- Registra a rota `/projeto` no `App.tsx`

<skills>
### Conformidade com Skills Padrões

- **Frontend**: React 19 + Vite + TypeScript
- **CSS**: CSS Modules
- **Estado**: Zustand 5 (`useFormStore`)
- **Testes**: Vitest + Testing Library
- **Package mgr**: bun
</skills>

<requirements>
- RF-01 (PRD): Select `tipo_contrato` com opções "Prestação de Serviço" e "Empreitada" — obrigatório, sem valor padrão
- RF-02 (PRD): Select `tipo_servico` com opções "projeto", "reforma", "reforma de interiores" — obrigatório, pré-preenchido do pacote
- RF-03 (PRD): Select `tipo_projeto` (tipologia) com opções "residencial", "comercial", "corporativa", "institucional", "outros" — obrigatório, pré-preenchido do pacote
- RF-04 (PRD): Etiqueta "(sugestão do pacote)" ao lado do label dos campos pré-preenchidos do pacote (tipo_servico e tipo_projeto), apenas na 1ª visita (sem steps['project'] no store)
- RF-05 (PRD): Campo `endereco_projeto` — texto obrigatório, não pré-preenchido
- RF-06 (PRD): Campo `area_projeto` — número opcional com decimais permitidos, não pré-preenchido; se preenchido deve ser > 0
- RF-07 (PRD): Botão "Continuar" desabilitado enquanto tipo_contrato, tipo_servico, tipo_projeto ou endereco_projeto estiverem vazios, ou area_projeto for inválido
- RF-08 (PRD): Botão "Voltar" → `navigate('/contratante')` sem apagar dados do store
- RF-09 (PRD): "Continuar" → `updateStep('project', {...})` + `navigate('/resultado')`
- RF-10 (PRD): Pré-preenchimento: se steps['project'] existe → usar seus valores; se não → usar tipo_servico e tipo_projeto de steps['package']
- RF-11 (PRD): Atualizar `ClientFormPage`: mudar `navigate('/resultado')` para `navigate('/projeto')`
- Acessibilidade: `<label htmlFor>` em todos os campos, `<h1>` único, outline visível no foco (WCAG 2.2)
- `App.tsx`: adicionar rota `/projeto` → `ProjectFormPage`
- Sem linhas em branco dentro de funções (code-standards.md)
- `bun run test` e `bun run build` devem passar sem erros
</requirements>

## Subtarefas

- [ ] 2.1 Criar `frontend/src/pages/project-form-page.tsx` com interface `ProjectFields`, estado `fields` e `suggestedFields: Set<string>`
- [ ] 2.2 Implementar lógica de pré-preenchimento na inicialização do estado: se `steps['project']` existe → usar seus dados; senão → popular `tipo_servico` e `tipo_projeto` de `steps['package']` e inicializar `suggestedFields` com `Set(['tipo_servico', 'tipo_projeto'])`
- [ ] 2.3 Implementar `isFormValid(fields)`: função pura fora do componente — verifica tipo_contrato, tipo_servico, tipo_projeto, endereco_projeto não vazios; area_projeto válido se preenchido
- [ ] 2.4 Renderizar select `tipo_contrato` com opção vazia inicial ("Selecione..."), opções "Prestação de Serviço" e "Empreitada"
- [ ] 2.5 Renderizar select `tipo_servico` com opções e etiqueta condicional "(sugestão do pacote)" quando `suggestedFields.has('tipo_servico')`
- [ ] 2.6 Renderizar select `tipo_projeto` (label: "Tipologia") com opções e etiqueta condicional "(sugestão do pacote)" quando `suggestedFields.has('tipo_projeto')`
- [ ] 2.7 Renderizar campo `endereco_projeto` (texto, obrigatório) e `area_projeto` (type="number", min="0", step="0.01", opcional)
- [ ] 2.8 Implementar botão "Continuar" com `disabled={!isFormValid(fields)}` e `handleSubmit`
- [ ] 2.9 Implementar botão "Voltar" com `navigate('/contratante')`
- [ ] 2.10 Criar `frontend/src/pages/project-form-page.module.css` com estilos seguindo padrão de `client-form-page.module.css`; adicionar `.suggestionTag` para a etiqueta "(sugestão do pacote)"; incluir `.input:focus-visible` com outline WCAG 2.2
- [ ] 2.11 Criar `frontend/src/pages/project-form-page.test.tsx` com os testes descritos abaixo
- [ ] 2.12 Atualizar `frontend/src/pages/client-form-page.tsx`: trocar `navigate('/resultado')` por `navigate('/projeto')` no `handleSubmit`
- [ ] 2.13 Atualizar `frontend/src/App.tsx`: importar `ProjectFormPage` e adicionar rota `{ path: '/projeto', element: <ProjectFormPage /> }`
- [ ] 2.14 Executar `bun run test` no diretório `frontend` — todos os testes novos e existentes devem passar
- [ ] 2.15 Executar `bun run build` no diretório `frontend`

## Detalhes de Implementação

Consulte as seções **"Interfaces Principais"**, **"Modelos de Dados"** e **"Pontos de Integração"** da `techspec.md`.

**Constantes dos selects:**
```typescript
const TIPO_CONTRATO_OPTIONS = ['Prestação de Serviço', 'Empreitada']
const TIPO_SERVICO_OPTIONS = ['projeto', 'reforma', 'reforma de interiores']
const TIPOLOGIA_OPTIONS = ['residencial', 'comercial', 'corporativa', 'institucional', 'outros']
```

**Lógica do suggestedFields (inicializador lazy do useState):**
```typescript
// 1ª visita: steps['project'] não existe → pré-preencher do pacote
const savedProject = steps['project'] as Partial<ProjectFields> | undefined
const savedPackage = steps['package'] as { tipo_servico?: string; tipo_projeto?: string } | undefined
const [suggestedFields] = useState<Set<string>>(() =>
  savedProject ? new Set() : new Set(['tipo_servico', 'tipo_projeto'])
)
const [fields, setFields] = useState<ProjectFields>({
  tipo_contrato: savedProject?.tipo_contrato ?? '',
  tipo_servico: savedProject?.tipo_servico ?? savedPackage?.tipo_servico ?? '',
  tipo_projeto: savedProject?.tipo_projeto ?? savedPackage?.tipo_projeto ?? '',
  endereco_projeto: savedProject?.endereco_projeto ?? '',
  area_projeto: savedProject?.area_projeto ?? '',
})
```

**isFormValid:**
```typescript
function isFormValid(fields: ProjectFields): boolean {
  if (!fields.tipo_contrato) return false
  if (!fields.tipo_servico) return false
  if (!fields.tipo_projeto) return false
  if (!fields.endereco_projeto.trim()) return false
  if (fields.area_projeto.trim()) {
    const val = parseFloat(fields.area_projeto)
    if (isNaN(val) || val <= 0) return false
  }
  return true
}
```

**updateStep ao confirmar:**
```typescript
updateStep('project', {
  tipo_contrato: fields.tipo_contrato,
  tipo_servico: fields.tipo_servico,
  tipo_projeto: fields.tipo_projeto,
  endereco_projeto: fields.endereco_projeto,
  area_projeto: fields.area_projeto,
})
navigate('/resultado')
```

**Mock de `useNavigate` nos testes:**
```typescript
const mockNavigate = vi.fn()
vi.mock('react-router', () => ({ useNavigate: () => mockNavigate }))
```

**Mock do `useFormStore` nos testes (1ª visita — sem steps):**
```typescript
const mockUpdateStep = vi.fn()
vi.mock('../store/form-store', () => ({
  useFormStore: () => ({ updateStep: mockUpdateStep, steps: {} })
}))
```

**Mock do `useFormStore` para teste de pré-preenchimento do pacote:**
```typescript
vi.mock('../store/form-store', () => ({
  useFormStore: () => ({
    updateStep: mockUpdateStep,
    steps: {
      package: { tipo_servico: 'reforma', tipo_projeto: 'comercial' }
    }
  })
}))
```

## Critérios de Sucesso

- Todos os testes de `project-form-page.test.tsx` passam
- `bun run build` sem erros de TypeScript
- Rota `/projeto` exibe o formulário do projeto
- Etiqueta "(sugestão do pacote)" visível nos selects pré-preenchidos do pacote na 1ª visita
- Botão "Continuar" desabilitado com campos obrigatórios ausentes, habilitado quando válidos
- "Continuar" com dados válidos chama `updateStep('project', {...})` e navega para `/resultado`
- `ClientFormPage` navega para `/projeto` após confirmar (não mais `/resultado`)
- Teste de regressão do `ClientFormPage` atualizado

## Testes da Tarefa

- [ ] Testes de unidade (`project-form-page.test.tsx`):
  - Renderiza 5 campos (tipo_contrato, tipo_servico, tipo_projeto/Tipologia, endereco_projeto, area_projeto) e botões Continuar/Voltar
  - Formulário vazio → botão "Continuar" desabilitado
  - `tipo_contrato` não selecionado → botão desabilitado (mesmo com demais preenchidos)
  - `endereco_projeto` vazio → botão desabilitado
  - `area_projeto` com texto não numérico → botão desabilitado
  - `area_projeto` com valor negativo → botão desabilitado
  - Todos os campos obrigatórios válidos (area_projeto vazio) → botão habilitado
  - Todos os campos incluindo area_projeto válido (ex: "45.5") → botão habilitado
  - "Continuar" válido → `updateStep('project', { tipo_contrato, tipo_servico, tipo_projeto, endereco_projeto, area_projeto })` com dados corretos
  - "Continuar" válido → `navigate('/resultado')`
  - "Voltar" → `navigate('/contratante')`
  - Pré-preenchimento de `steps['project']` (revisita): campos populados com dados salvos
  - Pré-preenchimento de `steps['package']` (1ª visita): `tipo_servico` e `tipo_projeto` populados do pacote
  - Etiqueta "(sugestão do pacote)" visível para tipo_servico e tipo_projeto na 1ª visita (sem steps['project'])
  - Etiqueta "(sugestão do pacote)" ausente na revisita (com steps['project'])
- [ ] Teste de regressão em `client-form-page.test.tsx`: verificar que "Continuar" chama `navigate('/projeto')` e não mais `navigate('/resultado')`
- [ ] Testes de integração: não aplicável
- [ ] Testes E2E: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/pages/project-form-page.tsx` — criar
- `frontend/src/pages/project-form-page.module.css` — criar
- `frontend/src/pages/project-form-page.test.tsx` — criar
- `frontend/src/types/contrato.ts` — ler (tipos, Task 1.0 desta feature)
- `frontend/src/store/form-store.ts` — ler (interface de store)
- `frontend/src/pages/client-form-page.tsx` — modificar (navigate target) + referência de padrão
- `frontend/src/pages/client-form-page.module.css` — referência de estilos
- `frontend/src/App.tsx` — modificar (nova rota /projeto)
- `frontend/src/pages/result-page.tsx` — verificar (destino final do fluxo)
