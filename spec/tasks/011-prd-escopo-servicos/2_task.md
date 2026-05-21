# Tarefa 2.0: AdditionalServicesPage — Implementar tela de serviços adicionais

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 1.0 (ScopeFormPage implementada — rota `/escopo` existente e fluxo de navegação atualizado)

## Estimativa

- **Tamanho**: M
- **Horas estimadas**: 2-4h

## Visão Geral

Criar o componente `AdditionalServicesPage` em `frontend/src/pages/additional-services-page.tsx` com CSS Module associado. A página exibe 3 checkboxes opcionais (Gestão de obra, Acompanhamento de obra, Fiscalização de obra). Quando ao menos um está marcado: exibe um campo de descrição opcional e um alerta inline informando que serviços adicionais impactam prazo e honorários. O botão "Continuar" está sempre habilitado — todos os campos são opcionais. Ao confirmar, formata a string `servicos_adicionais` e salva no store.

<skills>
### Conformidade com Skills Padrões

- **Frontend**: React 19 + Vite + TypeScript
- **CSS**: CSS Modules
- **Estado**: Zustand 5 (`useFormStore`)
- **Testes**: Vitest + Testing Library
- **Package mgr**: bun
</skills>

<requirements>
- RF-08 (PRD): 3 checkboxes opcionais: "Gestão de obra", "Acompanhamento de obra", "Fiscalização de obra"
- RF-09 (PRD): Campo `descricao_servico_adicional` (textarea opcional) exibido apenas quando ao menos um serviço está marcado; oculto quando nenhum está marcado
- RF-10 (PRD): Alerta inline visível quando ao menos um serviço está marcado: "Serviços adicionais impactam o prazo e os honorários. Lembre-se de revisá-los nas etapas seguintes."
- RF-11 (PRD): Botão "Continuar" sempre habilitado (campos 100% opcionais)
- RF-11 (PRD): `updateStep('additional-services', { servicos_adicionais, selected_services, description })` + `navigate('/resultado')`
- RF-12 (PRD): Pré-preenchimento na revisita: restaurar checkboxes de `steps['additional-services'].selected_services` e descrição de `steps['additional-services'].description`
- RF-13 (PRD): Botão "Voltar" → `navigate('/escopo')` sem apagar dados do store
- Formatação: `servicos_adicionais = selectedServices.join(', ')` + `'. Descrição: ' + description` se descrição preenchida; string vazia se nenhum serviço selecionado
- Acessibilidade: `<label htmlFor>` em todos os campos, `<h1>` único, checkboxes com labels associados, alerta como texto (não apenas cor), `focus-visible` com outline WCAG 2.2
- `App.tsx`: adicionar rota `/servicos-adicionais` → `AdditionalServicesPage`
- `bun run test` e `bun run build` devem passar sem erros
</requirements>

## Subtarefas

- [ ] 2.1 Criar `frontend/src/pages/additional-services-page.tsx` com constante `ADDITIONAL_SERVICES = ['Gestão de obra', 'Acompanhamento de obra', 'Fiscalização de obra']`, estado `selectedServices: string[]` e `description: string`
- [ ] 2.2 Implementar lógica de pré-preenchimento na inicialização: se `steps['additional-services']` existe → restaurar `selected_services` (array) e `description`; senão → `selectedServices = []`, `description = ''`
- [ ] 2.3 Renderizar os 3 checkboxes com `<label htmlFor>` e `<input type="checkbox">` associados
- [ ] 2.4 Renderizar o campo `descricao_servico_adicional` (textarea) condicionalmente quando `selectedServices.length > 0`
- [ ] 2.5 Renderizar o alerta inline condicionalmente quando `selectedServices.length > 0` com texto: "Serviços adicionais impactam o prazo e os honorários. Lembre-se de revisá-los nas etapas seguintes."
- [ ] 2.6 Implementar `formatServicosAdicionais(selected: string[], desc: string): string` — função pura fora do componente
- [ ] 2.7 Implementar `handleSubmit`: chamar `updateStep('additional-services', { servicos_adicionais: formatServicosAdicionais(...), selected_services: selectedServices, description })` + `navigate('/resultado')`
- [ ] 2.8 Implementar botão "Voltar" com `navigate('/escopo')`
- [ ] 2.9 Criar `frontend/src/pages/additional-services-page.module.css` com estilos seguindo padrão dos demais formulários; incluir `.alert` para o alerta inline (cor de aviso, não apenas bordas), `.checkbox` para os campos de checklist
- [ ] 2.10 Criar `frontend/src/pages/additional-services-page.test.tsx` com os testes descritos abaixo
- [ ] 2.11 Atualizar `frontend/src/App.tsx`: importar `AdditionalServicesPage` e adicionar rota `{ path: '/servicos-adicionais', element: <AdditionalServicesPage /> }`
- [ ] 2.12 Executar `bun run test` no diretório `frontend` — todos os testes novos e existentes devem passar
- [ ] 2.13 Executar `bun run build` no diretório `frontend`

## Detalhes de Implementação

Consulte as seções **"Interfaces Principais"**, **"Modelos de Dados"** e **"Abordagem de Testes"** da `techspec.md`.

**Constante dos serviços:**
```typescript
const ADDITIONAL_SERVICES = ['Gestão de obra', 'Acompanhamento de obra', 'Fiscalização de obra']
```

**Função de formatação (fora do componente):**
```typescript
function formatServicosAdicionais(selected: string[], desc: string): string {
  if (selected.length === 0) return ''
  const base = selected.join(', ')
  return desc.trim() ? `${base}. Descrição: ${desc.trim()}` : base
}
```

**Dados gravados no store:**
```typescript
updateStep('additional-services', {
  servicos_adicionais: formatServicosAdicionais(selectedServices, description),
  selected_services: selectedServices,   // array para restaurar checkboxes na revisita
  description,                           // para restaurar o campo na revisita
})
```

**Pré-preenchimento na revisita:**
```typescript
const savedStep = steps['additional-services'] as {
  selected_services?: string[]
  description?: string
} | undefined
const [selectedServices, setSelectedServices] = useState<string[]>(
  savedStep?.selected_services ?? []
)
const [description, setDescription] = useState<string>(savedStep?.description ?? '')
```

**Mock para testes:**
```typescript
const mockNavigate = vi.fn()
vi.mock('react-router', () => ({ useNavigate: () => mockNavigate }))
const mockUpdateStep = vi.fn()
let mockSteps: Record<string, unknown> = {}
vi.mock('../store/form-store', () => ({
  useFormStore: () => ({ updateStep: mockUpdateStep, steps: mockSteps })
}))
```

## Critérios de Sucesso

- Todos os testes de `additional-services-page.test.tsx` passam
- `bun run build` sem erros de TypeScript
- Rota `/servicos-adicionais` exibe a tela de serviços adicionais
- Checkboxes funcionam corretamente (marcar/desmarcar)
- Campo descrição e alerta aparecem/desaparecem conforme seleção
- `updateStep` chamado com `servicos_adicionais` formatado corretamente
- Botão "Continuar" sempre habilitado (sem campos obrigatórios)

## Testes da Tarefa

- [ ] Testes de unidade (`additional-services-page.test.tsx`):
  - Renderiza 3 checkboxes e botão Continuar/Voltar
  - Nenhum selecionado → campo descrição ausente no DOM
  - Nenhum selecionado → alerta ausente no DOM
  - Ao marcar um serviço → campo descrição visível
  - Ao marcar um serviço → alerta de revisão visível
  - Ao desmarcar todos → campo e alerta ocultam
  - Botão "Continuar" sempre habilitado (mesmo sem seleção)
  - Sem seleção → `updateStep` chamado com `servicos_adicionais = ''`
  - Com seleção sem descrição → `servicos_adicionais = 'Gestão de obra'`
  - Com múltiplos serviços selecionados → `servicos_adicionais = 'Gestão de obra, Acompanhamento de obra'`
  - Com seleção e descrição → `servicos_adicionais = 'Gestão de obra. Descrição: texto'`
  - "Continuar" → `navigate('/resultado')`
  - "Voltar" → `navigate('/escopo')`
  - Revisita com `steps['additional-services']` → checkboxes e descrição restaurados
- [ ] Testes de integração: não aplicável
- [ ] Testes E2E: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/pages/additional-services-page.tsx` — criar
- `frontend/src/pages/additional-services-page.module.css` — criar
- `frontend/src/pages/additional-services-page.test.tsx` — criar
- `frontend/src/App.tsx` — modificar (nova rota /servicos-adicionais)
- `frontend/src/store/form-store.ts` — ler (interface de store)
- `frontend/src/pages/scope-form-page.tsx` — referência de padrão (Task 1.0)
- `frontend/src/pages/project-form-page.module.css` — referência de estilos
- `spec/tasks/011-prd-escopo-servicos/techspec.md` — consultar seções Interfaces, Modelos de Dados e Testes
