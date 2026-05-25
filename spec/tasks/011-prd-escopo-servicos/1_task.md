# Tarefa 1.0: ScopeFormPage — Implementar tela de escopo dos serviços

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- Nenhuma

## Estimativa

- **Tamanho**: G
- **Horas estimadas**: 4-8h

## Visão Geral

Criar o componente `ScopeFormPage` em `frontend/src/pages/scope-form-page.tsx` com CSS Module associado. A página exibe um formulário com 2 campos: `escopo_servicos` (textarea obrigatório) e `numero_revisoes` (número inteiro, exibido condicionalmente apenas quando `tipo_servico === 'projeto'`). Ambos os campos são pré-preenchidos a partir do pacote selecionado na Etapa 3 (`steps['package']`) na primeira visita, com exibição da etiqueta "(sugestão do pacote)". Na revisita, o formulário usa `steps['scope']`. A validação é silenciosa.

Além do novo componente, esta task também:
- Atualiza `ProjectFormPage` para navegar para `/escopo` em vez de `/resultado` ao clicar "Continuar"
- Registra a rota `/escopo` no `App.tsx`

<skills>
### Conformidade com Skills Padrões

- **Frontend**: React 19 + Vite + TypeScript
- **CSS**: CSS Modules
- **Estado**: Zustand 5 (`useFormStore`)
- **Testes**: Vitest + Testing Library
- **Package mgr**: bun
</skills>

<requirements>
- RF-01 (PRD): Textarea `escopo_servicos` — obrigatório, pré-preenchido do pacote
- RF-02 (PRD): Pré-preenchimento: `steps['scope']` na revisita; `steps['package'].escopo_servicos` e `steps['package'].numero_revisoes` na 1ª visita
- RF-03 (PRD): `numero_revisoes` exibido apenas quando `tipo_servico === 'projeto'` (obtido de `steps['project']?.tipo_servico ?? steps['package']?.tipo_servico`)
- RF-04 (PRD): Etiqueta "(sugestão do pacote)" ao lado dos labels dos campos pré-preenchidos, apenas na 1ª visita (sem `steps['scope']`)
- RF-04 (PRD): Botão "Continuar" desabilitado quando `escopo_servicos` vazio ou `numero_revisoes` inválido (quando visível)
- RF-05 (PRD): Salvar `updateStep('scope', { escopo_servicos, numero_revisoes })` e `navigate('/servicos-adicionais')`
- RF-06 (PRD): Botão "Voltar" → `navigate('/projeto')` sem apagar dados do store
- RF-07 (PRD): Atualizar `ProjectFormPage`: `navigate('/resultado')` → `navigate('/escopo')`
- Acessibilidade: `<label htmlFor>` em todos os campos, `<h1>` único, `focus-visible` com outline WCAG 2.2
- `App.tsx`: adicionar rota `/escopo` → `ScopeFormPage`
- `bun run test` e `bun run build` devem passar sem erros
</requirements>

## Subtarefas

- [ ] 1.1 Criar `frontend/src/pages/scope-form-page.tsx` com interface `ScopeFields { escopo_servicos: string, numero_revisoes: string }`, estado `fields` e `suggestedFields: Set<string>`
- [ ] 1.2 Implementar lógica de pré-preenchimento na inicialização: se `steps['scope']` existe → usar seus dados e `suggestedFields = new Set()`; senão → popular de `steps['package'].escopo_servicos` e `steps['package'].numero_revisoes`, `suggestedFields = new Set(['escopo_servicos', 'numero_revisoes'])`
- [ ] 1.3 Calcular `showNumeroRevisoes` uma única vez na montagem: `(steps['project']?.tipo_servico ?? steps['package']?.tipo_servico) === 'projeto'`
- [ ] 1.4 Implementar `isFormValid(fields: ScopeFields, showNumeroRevisoes: boolean)` como função pura fora do componente — verifica `escopo_servicos` não vazio; se `showNumeroRevisoes`, verifica `numero_revisoes` como inteiro ≥ 1 (sem ponto decimal)
- [ ] 1.5 Renderizar `<textarea>` para `escopo_servicos` com etiqueta condicional "(sugestão do pacote)"
- [ ] 1.6 Renderizar campo `numero_revisoes` (type="text", inputMode="numeric") com etiqueta condicional, visível apenas quando `showNumeroRevisoes === true`
- [ ] 1.7 Implementar botão "Continuar" com `disabled={!isFormValid(fields, showNumeroRevisoes)}` e `handleSubmit` — `updateStep('scope', { escopo_servicos, numero_revisoes })` + `navigate('/servicos-adicionais')`
- [ ] 1.8 Implementar botão "Voltar" com `navigate('/projeto')`
- [ ] 1.9 Criar `frontend/src/pages/scope-form-page.module.css` seguindo padrão de `project-form-page.module.css`; incluir `.suggestionTag`, `.textarea` e `.input:focus-visible` / `.textarea:focus-visible` com outline WCAG 2.2
- [ ] 1.10 Criar `frontend/src/pages/scope-form-page.test.tsx` com os testes descritos abaixo
- [ ] 1.11 Atualizar `frontend/src/pages/project-form-page.tsx`: trocar `navigate('/resultado')` por `navigate('/escopo')` no `handleSubmit`
- [ ] 1.12 Atualizar `frontend/src/pages/project-form-page.test.tsx`: ajustar teste de regressão para `navigate('/escopo')`
- [ ] 1.13 Atualizar `frontend/src/App.tsx`: importar `ScopeFormPage` e adicionar rota `{ path: '/escopo', element: <ScopeFormPage /> }`
- [ ] 1.14 Executar `bun run test` no diretório `frontend` — todos os testes novos e existentes devem passar
- [ ] 1.15 Executar `bun run build` no diretório `frontend`

## Detalhes de Implementação

Consulte as seções **"Interfaces Principais"**, **"Modelos de Dados"** e **"Pontos de Integração"** da `techspec.md`.

**Interface e estado:**
```typescript
interface ScopeFields {
  escopo_servicos: string
  numero_revisoes: string
}
```

**Lógica de `isFormValid` (fora do componente):**
```typescript
function isFormValid(fields: ScopeFields, showNumeroRevisoes: boolean): boolean {
  if (!fields.escopo_servicos.trim()) return false
  if (showNumeroRevisoes) {
    const n = parseInt(fields.numero_revisoes, 10)
    if (isNaN(n) || n < 1 || String(n) !== fields.numero_revisoes.trim()) return false
  }
  return true
}
```

**Inicialização do estado (inicializadores lazy):**
```typescript
const savedScope = steps['scope'] as Partial<ScopeFields> | undefined
const savedPackage = steps['package'] as { escopo_servicos?: string; numero_revisoes?: string } | undefined
const tipoServico = (steps['project'] as { tipo_servico?: string } | undefined)?.tipo_servico
  ?? savedPackage?.tipo_servico
const showNumeroRevisoes = tipoServico === 'projeto'

const [suggestedFields] = useState<Set<string>>(() =>
  savedScope ? new Set() : new Set(['escopo_servicos', 'numero_revisoes'])
)
const [fields, setFields] = useState<ScopeFields>({
  escopo_servicos: savedScope?.escopo_servicos ?? savedPackage?.escopo_servicos ?? '',
  numero_revisoes: savedScope?.numero_revisoes ?? savedPackage?.numero_revisoes ?? '',
})
```

**Mock de `useFormStore` para testes com `tipo_servico === 'projeto'`:**
```typescript
vi.mock('../store/form-store', () => ({
  useFormStore: () => ({
    updateStep: mockUpdateStep,
    steps: { package: { tipo_servico: 'projeto', escopo_servicos: '', numero_revisoes: '2' } }
  })
}))
```

## Critérios de Sucesso

- Todos os testes de `scope-form-page.test.tsx` passam
- `bun run build` sem erros de TypeScript
- Rota `/escopo` exibe o formulário de escopo
- Etiqueta "(sugestão do pacote)" visível nos campos pré-preenchidos na 1ª visita
- `numero_revisoes` visível apenas quando `tipo_servico === 'projeto'`, oculto para reforma
- Botão "Continuar" desabilitado com campos inválidos, habilitado quando válidos
- `ProjectFormPage` navega para `/escopo` após confirmar

## Testes da Tarefa

- [ ] Testes de unidade (`scope-form-page.test.tsx`):
  - Renderiza textarea escopo e botões Continuar/Voltar
  - `numero_revisoes` visível quando `tipo_servico='projeto'`
  - `numero_revisoes` oculto quando `tipo_servico='reforma'`
  - `numero_revisoes` oculto quando `tipo_servico='reforma de interiores'`
  - Escopo vazio → botão desabilitado
  - `numero_revisoes` vazio (com tipo_servico='projeto') → botão desabilitado
  - `numero_revisoes` com decimal (ex: "1.5") → botão desabilitado
  - `numero_revisoes` com zero ou negativo → botão desabilitado
  - Todos os campos válidos com `numero_revisoes` → botão habilitado
  - Todos os campos válidos sem `numero_revisoes` (tipo reforma) → botão habilitado
  - "Continuar" válido → `updateStep('scope', { escopo_servicos, numero_revisoes })` com dados corretos
  - "Continuar" válido → `navigate('/servicos-adicionais')`
  - "Voltar" → `navigate('/projeto')`
  - Pré-preenchimento de `steps['scope']` na revisita: campos populados
  - Pré-preenchimento de `steps['package']` na 1ª visita: `escopo_servicos` e `numero_revisoes` populados
  - Etiqueta "(sugestão do pacote)" visível na 1ª visita para ambos os campos
  - Etiqueta ausente na revisita
- [ ] Teste de regressão em `project-form-page.test.tsx`: "Continuar" chama `navigate('/escopo')` e não `navigate('/resultado')`
- [ ] Testes de integração: não aplicável
- [ ] Testes E2E: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/pages/scope-form-page.tsx` — criar
- `frontend/src/pages/scope-form-page.module.css` — criar
- `frontend/src/pages/scope-form-page.test.tsx` — criar
- `frontend/src/pages/project-form-page.tsx` — modificar (navigate target)
- `frontend/src/pages/project-form-page.test.tsx` — modificar (regressão)
- `frontend/src/App.tsx` — modificar (nova rota /escopo)
- `frontend/src/pages/project-form-page.module.css` — referência de estilos
- `frontend/src/store/form-store.ts` — ler (interface de store)
- `spec/tasks/011-prd-escopo-servicos/techspec.md` — consultar seções Interfaces e Modelos de Dados
