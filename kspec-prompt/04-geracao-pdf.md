# Feature 04 — Geração de PDF

## Contexto

O documento final do contrato deve ser entregue ao usuário em formato PDF, com
layout institucional do CAU/DF (logotipo no cabeçalho, aviso no rodapé).

Depende do Motor de Contratos (Feature 03), que gera o HTML do contrato.

## Objetivo desta feature

Implementar o serviço de conversão do contrato HTML → PDF, com layout correto,
e disponibilizar o arquivo para download no frontend.

## Requisitos

### Layout do PDF (Seção 12)

**Cabeçalho (em todas as páginas):**
- Logotipo do CAU/DF (imagem)
- Título do documento (ex: "Contrato de Prestação de Serviços de Arquitetura")

**Rodapé (em todas as páginas):**
- Aviso institucional: "Este documento foi gerado a partir de modelo orientativo
  disponibilizado pelo CAU/DF. O CAU/DF não se responsabiliza pelo conteúdo
  adaptado pelo profissional."
- Numeração de páginas

**Formatação geral:**
- Papel A4
- Margens adequadas para impressão e assinatura
- Fonte legível (ex: Times New Roman ou similar)
- Numeração de cláusulas

### API (backend)

- `POST /api/pdf/gerar` — recebe o payload final do contrato, retorna o PDF como
  `application/pdf` para download direto, ou salva temporariamente e retorna URL

### Regras de negócio (Anexo V)

- Regra 9: o documento final deve ser gerado em formato PDF
- Regra 4: após geração do PDF, o contrato não pode mais ser editado na plataforma
- O MVP não armazena o PDF no servidor — o usuário é responsável por salvar o arquivo

### Biblioteca de geração de PDF

Utilizar biblioteca adequada para Node.js/bun (ex: Puppeteer, Playwright headless,
ou jsPDF com html2canvas). Preferir solução que renderize CSS fielmente.

## Referência no documento

Seção 12 — Layout do Documento
Seção 14 — Gerador de PDF
Anexo II — Fluxo: Geração do PDF → Download / assinatura gov.br
Anexo V — Regras 4 e 9
