# Tarefa 1.0: DownloadPdfButton — Adicionar Prop onSuccess Opcional

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- Nenhuma

## Estimativa

- **Tamanho**: P
- **Horas estimadas**: < 2h

## Visão Geral

Adicionar a prop opcional `onSuccess?: () => void` ao componente `DownloadPdfButton`. Ela deve ser chamada após o download bem-sucedido do PDF e após `finalizeForm()`. Nenhum comportamento existente é alterado — a prop é opcional e o componente funciona exatamente como antes quando não fornecida.

<skills>
### Conformidade com Skills Padrões

- React + Vite + TypeScript: prop tipada com interface
- Vitest + Testing Library: atualizar/adicionar teste de regressão
- bun: executar `bun run test` para validação
</skills>

<requirements>
- Interface de props do `DownloadPdfButton` atualizada com `onSuccess?: () => void`
- `onSuccess` é chamada após `finalizeForm()` na sequência de sucesso do fetch
- Comportamento existente inalterado quando `onSuccess` não é fornecida
- Nenhuma outra lógica alterada no componente
</requirements>

## Subtarefas

- [ ] 1.1 Atualizar `frontend/src/components/download-pdf-button.tsx`: adicionar `onSuccess?: () => void` à interface de props e chamar `onSuccess?.()` após `finalizeForm()`
- [ ] 1.2 Atualizar ou adicionar teste em `frontend/src/components/download-pdf-button.test.tsx` (se existir): verificar que `onSuccess` é chamado após download bem-sucedido
- [ ] 1.3 Executar `bun run test --run` e `bun run build` no frontend

## Detalhes de Implementação

Consultar `techspec.md` desta pasta — seção **Botão "Gerar contrato"**.

A chamada deve ser:
```typescript
// após finalizeForm():
onSuccess?.()
```

## Critérios de Sucesso

- `DownloadPdfButton` aceita `onSuccess?: () => void` sem erros TypeScript
- Componente funciona sem a prop (comportamento idêntico ao atual)
- Quando a prop é fornecida, é chamada após o download bem-sucedido
- Build e testes passando

## Testes da Tarefa

- [ ] Teste de regressão: download bem-sucedido sem prop `onSuccess` — comportamento inalterado
- [ ] Novo teste: download bem-sucedido com `onSuccess` fornecida — callback chamado uma vez após `finalizeForm()`

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/components/download-pdf-button.tsx` (modificar)
- `frontend/src/components/download-pdf-button.test.tsx` (modificar ou criar)
