# Tech Spec — Escopo dos Serviços e Serviços Adicionais (Feature 011)

## Resumo Executivo

Implementar duas páginas novas — `ScopeFormPage` em `/escopo` e `AdditionalServicesPage` em `/servicos-adicionais` — inseridas entre `/projeto` e `/resultado` no fluxo existente. `ScopeFormPage` pré-preenche `escopo_servicos` e `numero_revisoes` a partir de `steps['package']` na primeira visita (mesmo padrão de `ProjectFormPage`), exibindo `numero_revisoes` condicionalmente quando `tipo_servico === 'projeto'`. `AdditionalServicesPage` oferece checkboxes opcionais com campo de descrição condicional e alerta inline. Nenhuma alteração no backend ou em `ContratoPayload` é necessária — todos os campos já existem.

## Arquitetura do Sistema

### Visão Geral dos Componentes

| Componente | Ação | Responsabilidade |
|---|---|---|
| `scope-form-page.tsx` | **criar** | Formulário de escopo dos serviços com pré-fill do pacote e exibição condicional de `numero_revisoes` |
| `scope-form-page.module.css` | **criar** | Estilos CSS Module seguindo padrão dos demais formulários |
| `scope-form-page.test.tsx` | **criar** | Testes Vitest + Testing Library |
| `additional-services-page.tsx` | **criar** | Checkboxes de serviços adicionais, descrição condicional e alerta inline |
| `additional-services-page.module.css` | **criar** | Estilos CSS Module |
| `additional-services-page.test.tsx` | **criar** | Testes Vitest + Testing Library |
| `frontend/src/pages/project-form-page.tsx` | **modificar** | `navigate('/resultado')` → `navigate('/escopo')` |
| `frontend/src/App.tsx` | **modificar** | Adicionar rotas `/escopo` e `/servicos-adicionais` |

**Fluxo de dados:**
`steps['package']` → pré-fill em `ScopeFormPage` (1ª visita) → `steps['scope']` → `AdditionalServicesPage` → `steps['additional-services']` → `ResultPage.buildPayload()` → `ContratoPayload`.

## Design de Implementação

### Interfaces Principais

```typescript
// scope-form-page.tsx
interface ScopeFields {
  escopo_servicos: string
  numero_revisoes: string  // armazenado como string — consistente com ContratoPayload
}

// additional-services-page.tsx
const ADDITIONAL_SERVICES = ['Gestão de obra', 'Acompanhamento de obra', 'Fiscalização de obra']
```

**Estado de `ScopeFormPage`:**
- `fields: ScopeFields`
- `suggestedFields: Set<string>` — inicialização lazy; vazio se `steps['scope']` existe, `Set(['escopo_servicos', 'numero_revisoes'])` caso contrário
- `showNumeroRevisoes: boolean` — derivado na montagem de `steps['project']?.tipo_servico ?? steps['package']?.tipo_servico`

**Estado de `AdditionalServicesPage`:**
- `selectedServices: string[]` — IDs dos checkboxes marcados
- `description: string` — campo de descrição (visível quando `selectedServices.length > 0`)
- Sem estado de erros — botão "Continuar" sempre habilitado (todos os campos opcionais)

**Lógica de pré-fill em `ScopeFormPage`:**
```
se steps['scope'] existe → popular fields com steps['scope']; suggestedFields = Set()
senão → popular de steps['package'].escopo_servicos e steps['package'].numero_revisoes
         suggestedFields = Set(['escopo_servicos', 'numero_revisoes'])
```

Nota: `PackageSelectionPage` já salva `escopo_servicos` (de `pkg.escopo_padrao`) e `numero_revisoes` (de `String(pkg.numero_revisoes_sugerido)`) em `steps['package']` — pré-fill direto, sem transformação.

**`isFormValid` (função pura fora do componente):**
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

**Formatação de `servicos_adicionais` no submit:**
```
se selectedServices.length === 0 → servicos_adicionais = ''
senão → base = selectedServices.join(', ')
         servicos_adicionais = base + (description.trim() ? '. Descrição: ' + description.trim() : '')
```

### Modelos de Dados

**`steps['scope']` gravado no store:**
```typescript
updateStep('scope', {
  escopo_servicos: fields.escopo_servicos,
  numero_revisoes: fields.numero_revisoes,  // string vazia se numero_revisoes oculto
})
```

**`steps['additional-services']` gravado no store:**
```typescript
updateStep('additional-services', {
  servicos_adicionais: formattedString,      // mapeia para ContratoPayload.servicos_adicionais
  selected_services: selectedServices,        // array para restaurar checkboxes na revisita
  description: description,                  // texto para restaurar o campo na revisita
})
```

As chaves `selected_services` e `description` não constam em `ContratoPayload` — o backend Zod schema (`z.object()`) as remove na validação antes de `generateHtml`. Nenhuma alteração em `ContratoPayload` é necessária.

**Impacto no merge de `ResultPage.buildPayload`:**
- `steps['scope'].escopo_servicos` sobrescreve `steps['package'].escopo_servicos` ✓
- `steps['scope'].numero_revisoes` sobrescreve `steps['package'].numero_revisoes` ✓
- `steps['additional-services'].servicos_adicionais` → `ContratoPayload.servicos_adicionais` ✓

Ordem de inserção dos steps garante precedência correta (steps adicionados depois sobrescrevem os anteriores para chaves iguais).

### Endpoints de API

Não aplicável — funcionalidade exclusivamente frontend.

## Pontos de Integração

| Dependência | Uso | Localização |
|---|---|---|
| `useFormStore` | Leitura de `steps['package']`, `steps['scope']`, `steps['project']`, `steps['additional-services']`; `updateStep` | `frontend/src/store/form-store.ts` |
| `useNavigate` (react-router) | Navegação entre rotas | dependência existente |
| `ResultPage.buildPayload` | Spread genérico de steps — sem alteração necessária | `result-page.tsx` |
| `ProjectFormPage` | Atualizar navigate target de `/resultado` para `/escopo` | `project-form-page.tsx` linha 57 |

## Verificações Técnicas

### Segurança

- Nenhum dado sensível — escopo e serviços adicionais não requerem sanitização especial
- Checkboxes com valores fixos em constante — sem risco de injeção

### Arquitetura

- `isFormValid` de `ScopeFormPage` recebe `showNumeroRevisoes` como parâmetro para ser pura (sem closure)
- `showNumeroRevisoes` calculado uma única vez na montagem do componente — não é recalculado a cada render
- `suggestedFields: Set<string>` com inicialização lazy via `useState(() => ...)` — padrão de Feature 010
- `AdditionalServicesPage` não tem `isFormValid` (todos os campos são opcionais) — botão "Continuar" sempre habilitado
- Chaves extras (`selected_services`, `description`) no step `additional-services` são seguras — Zod as remove no backend

### Infraestrutura

Sem novos recursos — build estático Vite.

## Abordagem de Testes

### Testes Unidade

**`scope-form-page.test.tsx`:**

| Cenário | Verificação |
|---|---|
| Renderiza textarea escopo e botões | Elementos presentes |
| `numero_revisoes` visível quando tipo_servico='projeto' | Campo presente no DOM |
| `numero_revisoes` oculto quando tipo_servico='reforma' | Campo ausente no DOM |
| Escopo vazio → botão desabilitado | `disabled` |
| `numero_revisoes` ausente (com tipo_servico='projeto') → desabilitado | `disabled` |
| `numero_revisoes` não-inteiro (ex: "1.5") → desabilitado | `disabled` |
| `numero_revisoes` zero ou negativo → desabilitado | `disabled` |
| Todos os campos válidos → botão habilitado | `!disabled` |
| "Continuar" válido → `updateStep('scope', {...})` com dados corretos | Mock chamado |
| "Continuar" válido → `navigate('/servicos-adicionais')` | Mock chamado |
| "Voltar" → `navigate('/projeto')` | Mock chamado |
| Pré-fill de `steps['scope']` na revisita | Campos populados |
| Pré-fill de `steps['package']` na 1ª visita | escopo_servicos e numero_revisoes populados |
| Etiqueta "(sugestão do pacote)" visível na 1ª visita | Texto presente nos campos |
| Etiqueta ausente na revisita | Texto ausente |

**`additional-services-page.test.tsx`:**

| Cenário | Verificação |
|---|---|
| Renderiza 3 checkboxes e botão Continuar | Elementos presentes |
| Nenhum selecionado → campo descrição oculto | Ausente no DOM |
| Nenhum selecionado → alerta oculto | Ausente no DOM |
| Ao marcar um serviço → campo descrição visível | Presente no DOM |
| Ao marcar um serviço → alerta de revisão visível | Texto do alerta presente |
| Ao desmarcar todos → campo e alerta ocultam | Ausentes no DOM |
| Botão "Continuar" sempre habilitado | `!disabled` (nenhum campo obrigatório) |
| Sem seleção → `updateStep` com `servicos_adicionais = ''` | Mock chamado com string vazia |
| Com seleção sem descrição → `servicos_adicionais = 'Gestão de obra'` | Mock chamado com string formatada |
| Com seleção e descrição → `servicos_adicionais = 'Gestão de obra. Descrição: texto'` | Mock chamado com formato completo |
| "Continuar" → `navigate('/resultado')` | Mock chamado |
| "Voltar" → `navigate('/escopo')` | Mock chamado |
| Revisita com `steps['additional-services']` → checkboxes e descrição restaurados | UI populada |

**Regressão em `project-form-page.test.tsx`:**
- "Continuar" chama `navigate('/escopo')` em vez de `navigate('/resultado')`

### Testes de Integração / E2E

Não aplicável nesta feature.

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. **Task 1.0 — ScopeFormPage**: criar `scope-form-page.tsx`, CSS Module e testes; atualizar `ProjectFormPage` (navigate) e `App.tsx` (rota `/escopo`)
2. **Task 2.0 — AdditionalServicesPage** (depende: 1.0): criar `additional-services-page.tsx`, CSS Module e testes; adicionar rota `/servicos-adicionais` no `App.tsx`

### Dependências Técnicas

- Features 007–010 concluídas (`form-store`, estrutura de steps, `ProjectFormPage` navegando para `/escopo` após Task 1.0)
- `steps['package']` populado com `escopo_servicos` e `numero_revisoes` como strings

## Monitoramento e Observabilidade

Não aplicável — componentes frontend sem integrações externas.

## Considerações Técnicas

### Decisões Principais

| Decisão | Escolha | Trade-off |
|---|---|---|
| `isFormValid` recebe `showNumeroRevisoes` como parâmetro | Função pura sem closure | Mesmo padrão de Features 009/010; testável sem depender do estado do componente |
| `numero_revisoes` como string no store | Consistente com `ContratoPayload.numero_revisoes: string` | Validação via `parseInt` + verificação de inteiro puro |
| Chaves extras no step `additional-services` | `selected_services` e `description` para restauração de UI | Zod remove no backend; sem impacto funcional |
| `servicos_adicionais` formatado no submit | String "Lista. Descrição: texto" | Sem mudanças no backend ou `ContratoPayload`; funciona com `templateServicosAdicionais` existente |
| `AdditionalServicesPage` sem `isFormValid` | Todos os campos opcionais; botão sempre habilitado | Simplifica o componente; consistente com o PRD (RF-08/RF-13) |

### Riscos Conhecidos

- **Ordem do merge no `buildPayload`**: se o usuário pular `/escopo` (acesso direto à URL), `steps['scope']` não existirá e `steps['package'].escopo_servicos` ficará no payload — comportamento aceitável, o pacote já continha o escopo sugerido.
- **`numero_revisoes` oculto para `tipo_servico !== 'projeto'`**: o campo é salvo como string vazia no store. `buildPayload` sobrescreve `steps['package'].numero_revisoes` com string vazia para serviços de reforma. O backend recebe `numero_revisoes: ""` — a cláusula de prazo pode ser afetada. Verificar se o template de contrato usa `{{numero_revisoes}}` neste cenário.

### Conformidade com Skills Padrões

- **Frontend**: React 19 + Vite + TypeScript
- **CSS**: CSS Modules
- **Estado**: Zustand 5 (`useFormStore`)
- **Testes**: Vitest + Testing Library
- **Package mgr**: bun

### Arquivos relevantes e dependentes

- `frontend/src/pages/scope-form-page.tsx` — criar
- `frontend/src/pages/scope-form-page.module.css` — criar
- `frontend/src/pages/scope-form-page.test.tsx` — criar
- `frontend/src/pages/additional-services-page.tsx` — criar
- `frontend/src/pages/additional-services-page.module.css` — criar
- `frontend/src/pages/additional-services-page.test.tsx` — criar
- `frontend/src/pages/project-form-page.tsx` — modificar (navigate target linha 57)
- `frontend/src/pages/project-form-page.test.tsx` — modificar (regressão)
- `frontend/src/App.tsx` — modificar (2 novas rotas)
- `frontend/src/pages/package-selection-page.tsx` — referência (chaves salvas em steps['package'])
- `frontend/src/pages/result-page.tsx` — referência (buildPayload, sem modificação)
- `backend/src/templates/contrato.ts` — referência (templateServicosAdicionais)
