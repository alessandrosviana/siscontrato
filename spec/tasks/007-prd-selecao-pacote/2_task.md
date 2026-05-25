# Tarefa 2.0: PackageSelectionPage — Tela de seleção de pacote e tipologia

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 1.0 (pacotes.json e interface `Pacote` precisam ter `tipo_servico` e `tipologias`)

## Estimativa

- **Tamanho**: G
- **Horas estimadas**: 4-8h

## Visão Geral

Criar o componente `PackageSelectionPage` em `frontend/src/pages/package-selection-page.tsx` com CSS Module associado. A página busca os pacotes via `fetch('GET /api/contratos/pacotes')`, exibe os 5 pacotes como cards clicáveis, e ao selecionar um pacote exibe dinamicamente suas tipologias. Após selecionar pacote E tipologia, o botão "Continuar" habilita. Ao clicar "Continuar", os dados derivados são gravados no `form-store` e o usuário navega para `/formulario`. Esta task NÃO registra a rota no App.tsx — isso é feito na Task 3.0.

<skills>
### Conformidade com Skills Padrões

- **Frontend**: React 19 + Vite + TypeScript
- **CSS**: CSS Modules
- **Estado**: Zustand 5 (`useFormStore`)
- **Testes**: Vitest + Testing Library
- **Package mgr**: bun
</skills>

<requirements>
- RF-01 (PRD): Exibir 5 cards selecionáveis com nome e tipo de serviço do pacote
- RF-02 (PRD): Clicar em card seleciona (destaque visual + `aria-pressed="true"`); clicar novamente deseleciona
- RF-03 (PRD): Apenas um pacote selecionado por vez
- RF-05 (PRD): Selecionar pacote exibe dinamicamente as tipologias disponíveis
- RF-06 (PRD): Tipologia deve ser selecionada para continuar
- RF-07 (PRD): Tipologias exibidas como opções clicáveis
- RF-08 (PRD): Botão "Continuar" com `disabled` nativo enquanto pacote E tipologia não estiverem selecionados
- RF-09 (PRD): Ao confirmar, gravar no form-store via `updateStep('package', {...})` e navegar para `/formulario`
- RF-11 (PRD): Trocar de pacote redefine a tipologia selecionada para null
- Estado de loading durante fetch (indicador visual)
- Estado de erro quando fetch falha (mensagem ao usuário)
- `<h1>` único na página
- Sem linhas em branco dentro de funções (code-standards.md)
</requirements>

## Subtarefas

- [ ] 2.1 Criar `frontend/src/pages/package-selection-page.tsx` com os estados locais: `packages`, `loading`, `error`, `selectedPackageId`, `selectedTypology`
- [ ] 2.2 Implementar `useEffect` para fetch em `GET /api/contratos/pacotes` com tratamento de loading e erro
- [ ] 2.3 Renderizar cards de pacote com nome, tipo de serviço e `aria-pressed={selectedPackageId === pkg.id}`
- [ ] 2.4 Ao selecionar pacote: atualizar `selectedPackageId`, zerar `selectedTypology`
- [ ] 2.5 Renderizar tipologias do pacote selecionado dinamicamente (apenas quando há seleção)
- [ ] 2.6 Implementar botão "Continuar" com `disabled={!selectedPackageId || !selectedTypology}` e handler de confirmação
- [ ] 2.7 No handler de confirmação: chamar `updateStep('package', { pacote_servico, tipo_servico, tipo_projeto, escopo_servicos, numero_revisoes })` e `navigate('/formulario')`
- [ ] 2.8 Criar `frontend/src/pages/package-selection-page.module.css` com estilos institucionais
- [ ] 2.9 Criar `frontend/src/pages/package-selection-page.test.tsx` com os testes descritos abaixo
- [ ] 2.10 Executar `bun run test` no diretório `frontend`
- [ ] 2.11 Executar `bun run build` no diretório `frontend`

## Detalhes de Implementação

Consulte as seções **"Interfaces Principais"**, **"Modelos de Dados"**, **"Pontos de Integração"** e **"Testes Unidade"** da `techspec.md`.

**Dados gravados no form-store ao confirmar:**
```typescript
updateStep('package', {
  pacote_servico: pkg.id,
  tipo_servico: pkg.tipo_servico,
  tipo_projeto: selectedTypology,        // tipologia selecionada
  escopo_servicos: pkg.escopo_padrao,
  numero_revisoes: String(pkg.numero_revisoes_sugerido),
})
```

**Mock de `useNavigate` nos testes:**
```typescript
const mockNavigate = vi.fn()
vi.mock('react-router', () => ({ useNavigate: () => mockNavigate }))
```

**Mock do `useFormStore` nos testes:**
```typescript
const mockUpdateStep = vi.fn()
vi.mock('../store/form-store', () => ({ useFormStore: () => ({ updateStep: mockUpdateStep }) }))
```

**Mock de `fetch` nos testes:**
```typescript
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => mockPackages,
})
```

## Critérios de Sucesso

- Todos os testes de `package-selection-page.test.tsx` passam
- `bun run build` conclui sem erros de TypeScript
- Os 5 cards são renderizados após fetch
- O botão "Continuar" só habilita após ambas as seleções

## Testes da Tarefa

- [ ] Testes de unidade (`package-selection-page.test.tsx`):
  - Renderiza indicador de loading durante fetch
  - Renderiza 5 cards de pacote após fetch bem-sucedido
  - Clicar em card seleciona pacote (`aria-pressed="true"`)
  - Clicar em card já selecionado deseleciona (`aria-pressed="false"`)
  - Selecionar pacote exibe suas tipologias
  - Trocar de pacote limpa a tipologia selecionada
  - "Continuar" inicia desabilitado
  - Selecionar pacote + tipologia → "Continuar" habilita
  - Clicar "Continuar" chama `updateStep('package', {...})` com os campos corretos
  - Clicar "Continuar" chama `navigate('/formulario')`
  - Renderiza mensagem de erro quando fetch falha
- [ ] Testes de integração: não aplicável
- [ ] Testes E2E: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/pages/package-selection-page.tsx` — criar
- `frontend/src/pages/package-selection-page.module.css` — criar
- `frontend/src/pages/package-selection-page.test.tsx` — criar
- `frontend/src/store/form-store.ts` — ler (usar `updateStep`)
- `frontend/src/types/contrato.ts` — ler (referência de tipos)
