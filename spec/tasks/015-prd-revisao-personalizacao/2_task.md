# Tarefa 2.0: ResultPage — Tela de Revisão Completa

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 1.0

## Estimativa

- **Tamanho**: G
- **Horas estimadas**: 4-8h

## Visão Geral

Transformar a `ResultPage` existente (que hoje exibe apenas um botão de download) em uma tela completa de revisão do contrato. A tela busca o HTML do contrato via `POST /api/contratos/preview`, exibe-o com `dangerouslySetInnerHTML`, oferece barra lateral com links de navegação por etapa do formulário, modal para adicionar cláusula personalizada, e o botão "Gerar contrato" integrado ao `DownloadPdfButton` com a nova prop `onSuccess`.

<skills>
### Conformidade com Skills Padrões

- React + Vite + TypeScript: componente funcional com tipos explícitos
- Vitest + Testing Library: 11 cenários de teste (mock de fetch + store + router)
- CSS Modules: layout duas colunas + modal em `result-page.module.css`
- bun: executar `bun run test` para validação
</skills>

<requirements>
- Estado `previewState: 'loading' | 'error' | 'success'` + `previewHtml: string`
- `useEffect` chama `loadPreview()` no mount; `loadPreview()` faz `POST /api/contratos/preview` com `buildPayload(steps)` e trata erro com `console.error`
- Indicador de carregamento durante `previewState === 'loading'` com `aria-busy="true"`
- Mensagem de erro + botão "Tentar novamente" durante `previewState === 'error'`
- HTML do preview renderizado com `dangerouslySetInnerHTML` durante `previewState === 'success'`
- Barra lateral com 7 links "Editar": Dados do Arquiteto (`/formulario`), Dados do Contratante (`/contratante`), Dados do Projeto (`/projeto`), Escopo dos Serviços (`/escopo`), Serviços Adicionais (`/servicos-adicionais`), Honorários e Prazos (`/honorarios`), Cláusulas Opcionais (`/clausulas`)
- Botão "Adicionar cláusula" abre modal (`showAddClauseModal: boolean`)
- Modal com `role="dialog"` e `aria-modal="true"` contém textarea (`newClauseText: string`) e botões "Confirmar" e "Cancelar"
- Confirmar modal: chama `updateStep` adicionando texto às `clausulas_personalizadas`; fecha modal; chama `loadPreview()` para atualizar preview
- Confirmar modal com texto vazio: não altera store; fecha modal
- `DownloadPdfButton` recebe `payload={buildPayload(steps)}` e `onSuccess` que pode ser usado para feedback adicional se necessário
- Quando `isFinalized === true`: mensagem de sucesso visível; botão "Adicionar cláusula" desabilitado
- `focus-visible` com outline em todos os elementos interativos; foco capturado no textarea ao abrir modal
</requirements>

## Subtarefas

- [ ] 2.1 Atualizar `frontend/src/pages/result-page.tsx`: adicionar estados, `loadPreview`, JSX de loading/error/preview, barra lateral, modal e integração com `DownloadPdfButton`
- [ ] 2.2 Atualizar `frontend/src/pages/result-page.module.css`: layout duas colunas (`.body`, `.sidebar`, `.sidebarLink`, `.previewArea`, `.previewContent`, `.previewLoading`, `.previewError`), modal (`.modalOverlay`, `.modalContent`) e `.successMessage` com `focus-visible`
- [ ] 2.3 Atualizar `frontend/src/pages/result-page.test.tsx`: substituir testes existentes e adicionar os 11 cenários listados em "Testes da Tarefa"
- [ ] 2.4 Executar `bun run test --run`, `bun run build` e `bun run lint` no frontend

## Detalhes de Implementação

Consultar `techspec.md` desta pasta — seções **Estado Interno do Componente**, **Lógica de Fetch do Preview**, **Modal de Adicionar Cláusula**, **Barra Lateral** e **Renderização do Preview**.

**Mock de fetch nos testes** — usar `vi.stubGlobal('fetch', vi.fn())`:
```typescript
// fetch de preview retorna:
{ html: '<p data-testid="preview-content">Preview do contrato</p>' }
```

**Mock do store**:
```typescript
vi.mock('../store/form-store', () => ({
  useFormStore: vi.fn(() => ({
    steps: { 'architect-form': { arquiteto_nome: 'Teste' } },
    updateStep: mockUpdateStep,
    isFinalized: false,
  })),
}))
```

**Mock do router**:
```typescript
vi.mock('react-router', () => ({
  useNavigate: vi.fn(() => mockNavigate),
}))
```

**Mock do DownloadPdfButton**:
```typescript
vi.mock('../components/download-pdf-button', () => ({
  DownloadPdfButton: ({ onSuccess }: { onSuccess?: () => void }) => (
    <button onClick={onSuccess}>Gerar contrato</button>
  ),
}))
```

## Critérios de Sucesso

- Tela `/resultado` exibe preview HTML do contrato após carregar
- Barra lateral com 7 links de navegação para edição por etapa
- Modal abre/fecha corretamente; confirmar com texto adiciona cláusula e recarrega preview
- Botão "Adicionar cláusula" desabilitado quando `isFinalized === true`
- Mensagem de sucesso visível quando `isFinalized === true`
- 11 novos testes passando; suite completa sem regressões
- `bun run build` e `bun run lint` sem erros

## Testes da Tarefa

- [ ] Loading inicial: indicador visível antes do fetch resolver
- [ ] Preview renderizado: HTML do mock visível após fetch bem-sucedido
- [ ] Erro de fetch: mensagem de erro visível quando fetch retorna erro
- [ ] Retry funciona: clicar "Tentar novamente" refaz o fetch
- [ ] Barra lateral: 7 links de edição renderizados
- [ ] Clicar link "Editar": `navigate` chamado com a rota correta (testar ao menos 2 rotas)
- [ ] Botão "Adicionar cláusula": modal abre com `role="dialog"`
- [ ] Fechar modal (cancelar): modal fecha sem alterar store
- [ ] Confirmar modal com texto: `updateStep` chamado com nova cláusula; preview recarregado
- [ ] Confirmar modal vazio: store não alterado; modal fecha
- [ ] Estado pós-geração (`isFinalized=true`): mensagem de sucesso visível; botão "Adicionar cláusula" desabilitado

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/pages/result-page.tsx` (modificar — tela de revisão completa)
- `frontend/src/pages/result-page.module.css` (modificar — layout + modal)
- `frontend/src/pages/result-page.test.tsx` (modificar — 11 novos cenários)
- `frontend/src/components/download-pdf-button.tsx` (referência — Task 1.0 adicionou `onSuccess`)
- `frontend/src/store/form-store.ts` (referência — `steps`, `isFinalized`, `updateStep`)
- `spec/tasks/015-prd-revisao-personalizacao/techspec.md` (referência — layout, estados, lógica)
