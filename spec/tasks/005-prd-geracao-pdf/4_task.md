# Tarefa 4.0: Botão de download no frontend — DownloadPdfButton

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 3.0 (endpoint `POST /api/pdf/gerar` funcionando)

## Estimativa

- **Tamanho**: M
- **Horas estimadas**: 2–4h

## Visão Geral

Cria o componente React `DownloadPdfButton` em `frontend/src/components/download-pdf-button.tsx`. O componente faz `fetch` do endpoint `/api/pdf/gerar`, recebe o blob PDF, cria uma URL de objeto e aciona o download nativo do navegador. Após o download, bloqueia o formulário via `useFormStore`. Gerencia os estados `idle`, `loading` e `error`.

<skills>
### Conformidade com Skills Padrões

- **Frontend usa React + Vite** — componentes funcionais, props tipadas com TypeScript.
- **code-standards.md**: sem efeitos colaterais desnecessários, early returns, sem flag params.
- **Código-fonte**: inglês (nomes de variáveis, funções, props).
</skills>

<requirements>
- Componente `DownloadPdfButton` em `frontend/src/components/download-pdf-button.tsx`.
- Props: `payload: ContratoPayload` (tipo importado ou equivalente local).
- Estado interno: `idle | loading | error` — gerenciado com `useState`.
- Ao clicar:
  1. Muda estado para `loading`, desabilita o botão.
  2. Faz `fetch('POST /api/pdf/gerar', { body: JSON.stringify(payload) })`.
  3. Recebe a resposta como `blob()`.
  4. Cria `URL.createObjectURL(blob)` e aciona `<a download="contrato.pdf">` programaticamente.
  5. Chama `URL.revokeObjectURL` após o clique (limpeza de memória).
  6. Chama `useFormStore.getState().resetForm()` ou equivalente para bloquear edição (RF-04).
  7. Muda estado para `idle`.
- Em caso de erro: muda estado para `error` e exibe mensagem inline.
- Acessibilidade: `aria-label="Baixar contrato em PDF"`, `aria-busy={loading}`.
- Texto dos estados: idle → "Baixar PDF" | loading → "Gerando PDF..." | error → "Erro ao gerar PDF — tente novamente".
</requirements>

## Subtarefas

- [ ] 4.1 Criar `frontend/src/components/download-pdf-button.tsx` com os 3 estados
- [ ] 4.2 Implementar fetch + criação de blob URL + trigger de download nativo
- [ ] 4.3 Integrar com `useFormStore` para bloqueio pós-download (RF-04)
- [ ] 4.4 Adicionar atributos de acessibilidade (`aria-label`, `aria-busy`, `aria-live` no erro)
- [ ] 4.5 Criar `frontend/src/components/download-pdf-button.test.tsx` com testes unitários
- [ ] 4.6 Executar `bun test` — todos os testes passando

## Detalhes de Implementação

Ver seção **Componente Frontend — DownloadPdfButton** na techspec.md.

O download nativo é acionado criando um elemento `<a>` em memória:
```typescript
const a = document.createElement('a')
a.href = URL.createObjectURL(blob)
a.download = 'contrato.pdf'
a.click()
URL.revokeObjectURL(a.href)
```

O Vite já configura o proxy `/api → http://localhost:3000`, então `fetch('/api/pdf/gerar', ...)` funciona em desenvolvimento sem CORS.

O bloqueio do formulário (RF-04) pode ser implementado adicionando um campo `isFinalized: boolean` ao `useFormStore` — quando `true`, os campos do formulário ficam desabilitados.

## Critérios de Sucesso

- Clicar no botão com payload válido inicia o download do PDF no navegador.
- Durante o fetch, botão exibe "Gerando PDF..." e está desabilitado.
- Em caso de erro do servidor, exibe mensagem de erro inline e o botão é reabilitado.
- Após o download, o formulário é bloqueado para edição.
- Testes unitários passam com fetch mockado.
- `bun test` passa (todos os testes existentes + novos).

## Testes da Tarefa

- [ ] Testes de unidade (`download-pdf-button.test.tsx`) — mockar `fetch` global:
  - Fetch bem-sucedido → `URL.createObjectURL` chamado, elemento `<a>` com `download` criado
  - Durante fetch → botão desabilitado, texto "Gerando PDF..."
  - Fetch com erro (status 400) → estado muda para `error`, mensagem exibida
  - Após download → `useFormStore` atualizado (formulário bloqueado)
- [ ] Testes de integração: não aplicável (fetch é mockado nos testes unitários)
- [ ] Testes E2E: não aplicável no MVP

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/components/download-pdf-button.tsx` — novo arquivo
- `frontend/src/components/download-pdf-button.test.tsx` — novo arquivo
- `frontend/src/store/form-store.ts` — adicionar campo `isFinalized` e lógica de bloqueio
- `frontend/vite.config.ts` — proxy já configurado (sem alteração necessária)
