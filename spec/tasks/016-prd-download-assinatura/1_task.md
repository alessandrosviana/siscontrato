# Tarefa 1.0: DownloadPdfButton — Filename com tipo_servico

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- Nenhuma

## Estimativa

- **Tamanho**: P
- **Horas estimadas**: < 2h

## Visão Geral

Atualizar o `DownloadPdfButton` para gerar o arquivo PDF com nome que inclui o `tipo_servico` do payload, seguindo o padrão `contrato-[tipo_servico]-[data].pdf`.

<skills>
### Conformidade com Skills Padrões

- React + Vite + TypeScript: alteração cirúrgica em componente existente
- Vitest + Testing Library: atualizar/adicionar teste para o filename
- bun: executar `bun run test` para validação
</skills>

<requirements>
- O filename do download deve seguir o padrão `contrato-[tipo_servico]-[data].pdf`
- `tipo_servico` deve ser derivado de `payload.tipo_servico`, em lowercase, com espaços substituídos por hifens
- Se `payload.tipo_servico` estiver ausente, usar `contrato` como fallback
- Nenhum outro comportamento do componente deve ser alterado
</requirements>

## Subtarefas

- [ ] 1.1 Atualizar `frontend/src/components/download-pdf-button.tsx`: alterar a linha que define `a.download` para incluir `tipo_servico` no nome do arquivo
- [ ] 1.2 Atualizar `frontend/src/components/download-pdf-button.test.tsx`: adicionar cenário que verifica que o filename gerado contém o `tipo_servico` do payload
- [ ] 1.3 Executar `bun run test --run`, `bun run build` e `bun run lint` no frontend

## Detalhes de Implementação

Consultar `techspec.md` desta pasta — seção **Alteração no `DownloadPdfButton` — Filename**.

Lógica de geração do filename:
```typescript
const tipoServico = (payload.tipo_servico ?? 'contrato')
  .toLowerCase().replace(/\s+/g, '-')
a.download = `contrato-${tipoServico}-${new Date().toISOString().slice(0, 10)}.pdf`
```

**Mock de fetch nos testes** — usar `vi.stubGlobal('fetch', vi.fn())` retornando um blob vazio.

## Critérios de Sucesso

- Filename do download inclui `tipo_servico` do payload no formato correto
- Comportamento sem `tipo_servico` no payload usa `contrato` como fallback
- Todos os testes existentes continuam passando
- `bun run build` e `bun run lint` sem erros

## Testes da Tarefa

- [ ] Teste existente de regressão: download bem-sucedido sem `onSuccess` continua funcionando
- [ ] Teste existente de regressão: download bem-sucedido com `onSuccess` chama callback
- [ ] Novo teste: filename do download contém `tipo_servico` em lowercase com hifens

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/components/download-pdf-button.tsx` (modificar)
- `frontend/src/components/download-pdf-button.test.tsx` (modificar)
- `spec/tasks/016-prd-download-assinatura/techspec.md` (referência)
