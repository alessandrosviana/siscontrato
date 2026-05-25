# Tarefa 3.0: ResultPage — Integração com /concluido

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 2.0

## Estimativa

- **Tamanho**: P
- **Horas estimadas**: < 2h

## Visão Geral

Atualizar a `ResultPage` para redirecionar para `/concluido` após o download bem-sucedido do PDF. Remover o bloco `successMessage` da `ResultPage` (confirmação de sucesso agora fica na `CompletionPage`). Adicionar teste que verifica a navegação.

<skills>
### Conformidade com Skills Padrões

- React + Vite + TypeScript: alteração cirúrgica em componente existente
- Vitest + Testing Library: adicionar cenário de teste para `navigate('/concluido')`
- bun: executar `bun run test` para validação
</skills>

<requirements>
- `DownloadPdfButton` na `ResultPage` deve receber `onSuccess={() => navigate('/concluido')}`
- O bloco condicional `{isFinalized && <p className={styles.successMessage}>...</p>}` deve ser removido da `ResultPage`
- A lógica de desabilitar "Adicionar cláusula" quando `isFinalized === true` deve ser mantida (não remover)
- Nenhuma outra lógica da `ResultPage` deve ser alterada
</requirements>

## Subtarefas

- [ ] 3.1 Atualizar `frontend/src/pages/result-page.tsx`: trocar `onSuccess={() => {}}` por `onSuccess={() => navigate('/concluido')}` e remover o bloco `successMessage`
- [ ] 3.2 Atualizar `frontend/src/pages/result-page.test.tsx`: adicionar cenário que verifica que `navigate('/concluido')` é chamado quando `onSuccess` do `DownloadPdfButton` é disparado
- [ ] 3.3 Executar `bun run test --run`, `bun run build` e `bun run lint` no frontend

## Detalhes de Implementação

Consultar `techspec.md` desta pasta — seção **Alteração na `ResultPage` — onSuccess**.

O mock do `DownloadPdfButton` nos testes já chama `onSuccess` ao ser clicado:
```typescript
vi.mock('../components/download-pdf-button', () => ({
  DownloadPdfButton: ({ onSuccess }: { onSuccess?: () => void }) => (
    <button onClick={onSuccess}>Gerar contrato</button>
  ),
}))
```

Novo teste em `result-page.test.tsx`:
```typescript
it('navega para /concluido ao clicar em Gerar contrato', async () => {
  // Renderizar com previewState success (fetch mockado)
  // Clicar no botão mockado "Gerar contrato"
  // Verificar mockNavigate('/concluido') chamado
})
```

## Critérios de Sucesso

- Após download bem-sucedido na `ResultPage`, usuário é redirecionado para `/concluido`
- Bloco `successMessage` removido da `ResultPage` sem quebrar outros comportamentos
- Botão "Adicionar cláusula" continua desabilitado quando `isFinalized === true`
- Todos os testes da suite passando sem regressões
- `bun run build` e `bun run lint` sem erros

## Testes da Tarefa

- [ ] Novo teste: clicar em "Gerar contrato" (mock) → `navigate('/concluido')` chamado
- [ ] Regressão: todos os testes existentes da `ResultPage` continuam passando (11 cenários)

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/pages/result-page.tsx` (modificar — `onSuccess`, remover `successMessage`)
- `frontend/src/pages/result-page.test.tsx` (modificar — adicionar teste de navegação)
- `frontend/src/pages/completion-page.tsx` (referência — Task 2.0 criou esta página)
- `spec/tasks/016-prd-download-assinatura/techspec.md` (referência)
