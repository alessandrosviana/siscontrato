# PRD — Download do Contrato e Encaminhamento para Assinatura (Feature 016)

## Visão Geral

Após a geração bem-sucedida do PDF na tela de revisão (`/resultado`), o usuário é redirecionado para uma tela de conclusão dedicada (`/concluido`). Essa tela confirma a geração, oferece re-download do PDF, instrui sobre assinatura digital via gov.br e permite iniciar um novo contrato.

Esta é a **etapa final do MVP** — conclui o fluxo completo da plataforma (etapas 13–15 do Anexo VIII).

## Objetivos

- Garantir que o usuário possa baixar o contrato gerado a qualquer momento enquanto a sessão estiver ativa
- Informar claramente que a plataforma não armazena contratos gerados
- Facilitar o encaminhamento para assinatura digital via gov.br com instruções claras
- Oferecer ponto de reinício do fluxo sem exigir recarga manual da página

## Histórias de Usuário

- Como arquiteto, quero ver uma confirmação clara de que meu contrato foi gerado com sucesso, para ter segurança antes de fechar a página.
- Como arquiteto, quero baixar o PDF novamente caso tenha fechado o arquivo por engano, para não perder o documento gerado na sessão.
- Como arquiteto, quero saber como assinar o contrato digitalmente via gov.br, para concluir o processo sem precisar buscar essa informação em outro lugar.
- Como arquiteto, quero iniciar um novo contrato sem precisar recarregar a página ou limpar manualmente o histórico, para agilizar a criação de múltiplos contratos.

## Funcionalidades Principais

### RF1 — Navegação para `/concluido` após download

Após o download bem-sucedido do PDF (callback `onSuccess` do `DownloadPdfButton` na `ResultPage`), o usuário é automaticamente redirecionado para `/concluido`. A `ResultPage` passa o payload do contrato para que a nova página consiga oferecer re-download usando os dados da sessão atual (via store Zustand).

### RF2 — Mensagem de sucesso

A tela exibe em destaque: **"Seu contrato foi gerado com sucesso!"**

### RF3 — Botão "Baixar contrato (PDF)"

Reutiliza o `DownloadPdfButton` com o payload atual do store para permitir re-download. O nome do arquivo deve seguir o padrão `contrato-[tipo_servico]-[data].pdf`.

### RF4 — Aviso de não-armazenamento

Exibir aviso fixo e visível: **"Salve o documento. Esta plataforma não armazena contratos gerados."**

### RF5 — Botão "Encaminhar para assinatura via gov.br"

Ao clicar, abre um modal com instruções de assinatura. O modal inclui:
1. Acesse `assinatura.iti.br`
2. Faça login com sua conta gov.br
3. Envie o PDF gerado
4. Assine digitalmente

O modal possui botão de fechar e um link externo para `assinatura.iti.br` que abre em nova aba.

### RF6 — Botão "Gerar novo contrato"

Ao clicar: chama `resetForm()` no store (limpa todos os dados) e navega para `/` (landing page). O fluxo recomeça do zero.

### RF7 — Bloqueio de retorno ao fluxo de edição

Após a geração (`isFinalized === true`), o usuário não pode editar o contrato. Se navegar de volta para `/resultado` ou qualquer etapa do formulário, as telas devem funcionar normalmente mas o estado `isFinalized` impede nova geração sem reset.

## Experiência do Usuário

**Fluxo principal:**
`/clausulas` → `/resultado` (revisão + download) → clique em "Gerar contrato" → `/concluido`

**Tela `/concluido`:**
- Ícone ou indicador visual de sucesso
- Mensagem de sucesso em destaque
- Aviso de não-armazenamento (texto menor, mas visível)
- Botão primário: "Baixar contrato (PDF)"
- Botão secundário: "Encaminhar para assinatura via gov.br" → abre modal
- Botão terciário: "Gerar novo contrato"

**Modal de assinatura gov.br:**
- Título: "Como assinar via gov.br"
- Lista numerada com os 4 passos
- Link para `assinatura.iti.br` (abre em nova aba)
- Botão "Fechar"
- `role="dialog"` e `aria-modal="true"` para acessibilidade
- Foco capturado no modal ao abrir

**Acessibilidade:**
- Todos os botões com `focus-visible` e outline
- Modal com gerenciamento de foco (foco retorna ao botão que abriu ao fechar)
- Link externo com indicação visual de que abre em nova aba (`aria-label`)

## Restrições Técnicas de Alto Nível

- O store Zustand mantém `steps` e `isFinalized` em memória durante a sessão; não há persistência entre recargas de página
- O PDF é servido pela rota existente `POST /api/pdf/gerar` — sem alteração de backend necessária
- O link para gov.br aponta para `https://assinatura.iti.br` (URL pública do ITI)
- MVP sem armazenamento de contratos no servidor (Anexo II)

## Fora de Escopo

- Integração técnica com a API do gov.br/ITI para envio automático do PDF
- Armazenamento do contrato no servidor ou banco de dados
- Envio do contrato por e-mail
- Histórico de contratos gerados por sessão
- Assinatura digital embutida na plataforma
