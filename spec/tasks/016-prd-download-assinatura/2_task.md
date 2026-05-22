# Tarefa 2.0: CompletionPage — Tela de Conclusão Completa

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 1.0

## Estimativa

- **Tamanho**: M
- **Horas estimadas**: 2-4h

## Visão Geral

Criar a página `/concluido` (`CompletionPage`) com mensagem de sucesso, botão de re-download via `DownloadPdfButton`, aviso de não-armazenamento, modal de instruções gov.br e botão "Gerar novo contrato". Inclui guard de acesso, CSS Module e 9 cenários de teste.

<skills>
### Conformidade com Skills Padrões

- React + Vite + TypeScript: componente funcional com tipos explícitos
- Vitest + Testing Library: 9 cenários de teste com mocks de store e router
- CSS Modules: layout em `completion-page.module.css`
- bun: executar `bun run test` para validação
</skills>

<requirements>
- Guard: `useEffect` no mount — se `isFinalized === false`, chamar `navigate('/resultado', { replace: true })`
- Mensagem de sucesso: "Seu contrato foi gerado com sucesso!" visível
- Aviso: "Salve o documento. Esta plataforma não armazena contratos gerados."
- Botão "Baixar contrato (PDF)": reutiliza `DownloadPdfButton` com `payload={buildPayload(steps)}`; sem `onSuccess` (re-download não navega)
- Botão "Encaminhar para assinatura via gov.br": abre modal com `role="dialog"` e `aria-modal="true"`
- Modal contém: título "Como assinar via gov.br", lista `<ol>` com 4 passos, link para `https://assinatura.iti.br` com `target="_blank"` e `rel="noopener noreferrer"`, botão "Fechar"
- Fechar modal: modal some; foco retorna ao botão que abriu (via `useRef`)
- Botão "Gerar novo contrato": chama `resetForm()` e `navigate('/')`
- `focus-visible` com outline em todos os elementos interativos
- Rota `/concluido` registrada em `App.tsx`
</requirements>

## Subtarefas

- [ ] 2.1 Criar `frontend/src/pages/completion-page.tsx`: implementar guard, mensagem de sucesso, aviso, `DownloadPdfButton`, modal gov.br e botão "Gerar novo contrato"
- [ ] 2.2 Criar `frontend/src/pages/completion-page.module.css`: estilos da tela e do modal
- [ ] 2.3 Atualizar `frontend/src/App.tsx`: adicionar rota `{ path: '/concluido', element: <CompletionPage /> }`
- [ ] 2.4 Criar `frontend/src/pages/completion-page.test.tsx`: 9 cenários listados em "Testes da Tarefa"
- [ ] 2.5 Executar `bun run test --run`, `bun run build` e `bun run lint` no frontend

## Detalhes de Implementação

Consultar `techspec.md` desta pasta — seções **Estado Interno do Componente (CompletionPage)**, **Re-download na CompletionPage**, **Modal gov.br** e **Rota em App.tsx**.

**buildPayload** — mesma função da `ResultPage`; declarar localmente na `CompletionPage`:
```typescript
function buildPayload(steps: Record<string, Record<string, unknown>>): ContratoPayload {
  return Object.values(steps).reduce<ContratoPayload>(
    (acc, step) => ({ ...acc, ...step } as ContratoPayload),
    {} as ContratoPayload
  )
}
```

**Mock de store nos testes**:
```typescript
vi.mock('../store/form-store', () => ({
  useFormStore: vi.fn(() => ({
    steps: { 'project': { tipo_servico: 'projeto' } },
    isFinalized: true,
    resetForm: mockResetForm,
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
  DownloadPdfButton: () => <button>Baixar PDF</button>,
}))
```

**Cenário de guard** — mock com `isFinalized: false` e verificar `mockNavigate('/resultado', { replace: true })`.

## Critérios de Sucesso

- Acessar `/concluido` sem `isFinalized` redireciona para `/resultado`
- Tela exibe mensagem de sucesso, aviso e os 3 botões
- Modal abre/fecha com gerenciamento de foco correto
- "Gerar novo contrato" chama `resetForm()` e navega para `/`
- 9 novos testes passando; suite completa sem regressões
- `bun run build` e `bun run lint` sem erros

## Testes da Tarefa

- [ ] Guard: `isFinalized=false` → `navigate('/resultado', { replace: true })` chamado
- [ ] Mensagem de sucesso: "Seu contrato foi gerado com sucesso!" visível
- [ ] Aviso de não-armazenamento: texto do aviso visível
- [ ] `DownloadPdfButton` renderizado com payload do store
- [ ] Modal abre: clicar "Encaminhar para assinatura via gov.br" → `role="dialog"` visível
- [ ] Modal: lista `<ol>` com 4 passos visível
- [ ] Modal: link `assinatura.iti.br` com `target="_blank"` presente
- [ ] Fechar modal: modal some; foco retorna ao botão gov.br
- [ ] Gerar novo contrato: `resetForm` chamado; `navigate('/')` chamado

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/pages/completion-page.tsx` (criar)
- `frontend/src/pages/completion-page.module.css` (criar)
- `frontend/src/pages/completion-page.test.tsx` (criar)
- `frontend/src/App.tsx` (modificar — rota `/concluido`)
- `frontend/src/components/download-pdf-button.tsx` (referência — Task 1.0 atualizou o filename)
- `frontend/src/store/form-store.ts` (referência — `steps`, `isFinalized`, `resetForm`)
- `frontend/src/types/contrato.ts` (referência — `ContratoPayload`)
- `spec/tasks/016-prd-download-assinatura/techspec.md` (referência)
