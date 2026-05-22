# PRD — Revisão e Personalização do Contrato

## Visão Geral

Antes de gerar o PDF definitivo, o arquiteto precisa revisar o contrato completo montado com todos os dados inseridos ao longo do fluxo. Hoje a tela `/resultado` exibe apenas um botão de download, sem qualquer prévia do documento — o arquiteto só vê o resultado final após baixar o PDF, impossibilitando correções de última hora.

Esta feature transforma a tela `/resultado` em uma tela de revisão completa: o contrato é renderizado em tela com layout fiel ao documento final, o arquiteto pode identificar erros e navegar de volta à etapa correspondente para corrigi-los, e só então confirma a geração do PDF.

## Objetivos

- Eliminar a geração de PDFs com erros por falta de prévia — o arquiteto revisa antes de confirmar.
- Reduzir a necessidade de reedição de contratos após geração.
- Esta é a última chance de edição: após gerar o PDF, o documento não pode mais ser alterado na plataforma.

## Histórias de Usuário

- Como arquiteto, quero ver o contrato completo renderizado antes de gerar o PDF, para confirmar que todos os dados estão corretos.
- Como arquiteto, quero navegar de volta a uma etapa específica do formulário para corrigir um dado, sem perder as demais informações preenchidas.
- Como arquiteto, quero adicionar uma cláusula personalizada de última hora sem voltar à tela de cláusulas opcionais.
- Como arquiteto, quero que o botão "Gerar contrato" fique bloqueado após o clique, para não gerar o PDF em duplicidade por acidente.

## Funcionalidades Principais

### RF1 — Preview do contrato renderizado

A tela `/resultado` exibe o contrato completo em HTML renderizado, com layout fiel ao documento final: cabeçalho com informações do CAU/DF, cláusulas numeradas e rodapé. O HTML é obtido via `POST /api/contratos/preview` com o payload completo montado a partir do store.

### RF2 — Estado de carregamento do preview

Enquanto o preview está sendo gerado, a tela exibe um indicador visual de carregamento. Se a requisição falhar, exibe mensagem de erro com botão "Tentar novamente".

### RF3 — Links "Editar" por seção

O preview exibe, em pontos estratégicos, links ou botões "Editar" que navegam o usuário de volta à rota do formulário correspondente (ex: `/contratante`, `/projeto`, `/honorarios`, `/clausulas`). Ao retornar à tela `/resultado`, o preview é recarregado automaticamente com os dados atualizados.

### RF4 — Modal "Adicionar cláusula"

Um botão "Adicionar cláusula" abre um modal com textarea para o usuário digitar uma cláusula personalizada adicional. Ao confirmar, a cláusula é adicionada às `clausulas_personalizadas` do store e o preview é atualizado.

### RF5 — Geração do PDF

O botão "Gerar contrato" dispara a geração do PDF via `POST /api/pdf/gerar`. Durante a geração, o botão exibe estado "Gerando..." e fica desabilitado para evitar duplo envio. Ao concluir, o PDF é baixado automaticamente no navegador e o formulário é finalizado (`finalizeForm()`).

### RF6 — Bloqueio pós-geração

Após a geração bem-sucedida do PDF, o botão permanece desabilitado e uma mensagem de sucesso é exibida. O formulário entra em estado finalizado, impedindo nova geração.

## Experiência do Usuário

**Fluxo principal:**
1. Usuário completa o formulário e chega em `/resultado` vindo de `/clausulas`.
2. Tela exibe carregamento enquanto busca o preview via API.
3. Contrato renderizado aparece em área de leitura com scroll.
4. Usuário revisa o documento; ao encontrar erro, clica no link "Editar" da seção correspondente e é levado ao formulário.
5. Usuário corrige o dado, clica "Continuar" nos formulários e retorna a `/resultado`.
6. Se quiser adicionar cláusula extra, clica "Adicionar cláusula", preenche o modal e confirma.
7. Satisfeito com o preview, clica "Gerar contrato".
8. Botão fica em estado "Gerando...", PDF é baixado automaticamente.
9. Mensagem de sucesso confirma a geração. Botão permanece desabilitado.

**Acessibilidade:**
- `aria-busy="true"` no container de preview durante o carregamento.
- `role="dialog"` e foco gerenciado no modal de adicionar cláusula.
- Botão "Gerar contrato" com `aria-disabled` e `aria-label` descritivo durante o processamento.
- `focus-visible` com outline em todos os elementos interativos.

## Restrições Técnicas de Alto Nível

- O backend já possui `POST /api/contratos/preview` que recebe o `ContratoPayload` e retorna `{ html: string }`.
- O `DownloadPdfButton` já existente encapsula a lógica de geração e download de PDF via `POST /api/pdf/gerar`.
- Não há autenticação — a feature é client-side com dados no store (Zustand).
- Após `finalizeForm()`, o store é marcado como finalizado; o comportamento de bloqueio de reedição já é suportado pelo store existente.

## Fora de Escopo

- Edição inline de campos diretamente no preview (ex: clique no texto para editar) — correções são feitas voltando ao formulário.
- Assinatura digital do contrato.
- Armazenamento do contrato gerado no servidor.
- Histórico de versões do contrato.
- Envio por e-mail direto da plataforma.
