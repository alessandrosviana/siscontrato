# Feature 14 — Download do PDF e Encaminhamento para Assinatura

## Contexto

Etapas 13, 14 e 15 do fluxo. Após a geração do contrato, o usuário realiza o
download do PDF e pode ser encaminhado para o fluxo de assinatura via gov.br.

Esta é a etapa final do MVP.

## Objetivo desta feature

Implementar a tela de download do contrato gerado e o encaminhamento para
assinatura via gov.br, conforme as etapas finais do fluxo da plataforma.

## Requisitos

### Tela de download / conclusão

**Após geração bem-sucedida do PDF:**
- Exibir mensagem de sucesso: "Seu contrato foi gerado com sucesso!"
- Botão: "Baixar contrato (PDF)" — inicia download do arquivo PDF
- Botão secundário: "Encaminhar para assinatura via gov.br" — redireciona para o
  portal gov.br com instruções sobre assinatura digital
- Aviso: "Salve o documento. Esta plataforma não armazena contratos gerados."

### Download do PDF

- O PDF é servido diretamente pelo backend como `application/pdf`
- Nome do arquivo sugerido: `contrato-[tipo_servico]-[data].pdf`
- O arquivo não é armazenado no servidor após o download (MVP sem armazenamento)

### Encaminhamento para gov.br (Seção 4 e Regra 10)

- O botão redireciona o usuário para o portal de assinatura do gov.br
- Exibir instruções de como assinar o documento via gov.br:
  1. Acesse assinatura.iti.br
  2. Faça login com sua conta gov.br
  3. Envie o PDF gerado
  4. Assine digitalmente
- O fluxo de assinatura é externo à plataforma (não integrado no MVP)

### Regras de negócio

- Regra 4 (Anexo V): após geração do PDF, o contrato não pode ser editado
- Regra 9 (Anexo V): documento final em formato PDF
- Regra 10 (Anexo V): após download, o usuário pode encaminhar para assinatura via gov.br
- O MVP não armazena contratos no servidor (Observação — Anexo II)

### Estado final

- Após o download, oferecer opção "Gerar novo contrato" — reinicia o fluxo do zero

## Referência no documento

Seção 4 — Fluxo assistido para assinatura via gov.br
Seção 8 — Fluxo (etapas 13, 14 e 15)
Anexo II — Fluxo: Download / assinatura gov.br + Observação (sem armazenamento)
Anexo V — Regras 4, 9 e 10
