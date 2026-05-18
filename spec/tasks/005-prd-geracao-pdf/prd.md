# PRD — Geração de PDF do Contrato

## Visão Geral

Arquitetos que utilizam o SisContrato precisam entregar o contrato ao cliente em formato PDF com identidade visual institucional do CAU/DF. Atualmente, o sistema gera o HTML do contrato (Feature 03), mas não oferece uma forma de exportá-lo como documento final. Esta feature implementa a conversão HTML → PDF e o download direto no navegador, completando o fluxo de geração de contrato.

## Objetivos

- Permitir que o arquiteto baixe o contrato gerado em PDF com um clique, a partir da tela de preview.
- Garantir que o PDF tenha layout institucional do CAU/DF (logotipo no cabeçalho, aviso no rodapé, numeração de páginas).
- Assegurar fidelidade visual entre o preview HTML e o PDF gerado.
- O MVP não armazena o PDF no servidor — o arquivo é gerado sob demanda e entregue diretamente ao navegador.

**Métrica de sucesso:** 100% dos PDFs gerados contêm cabeçalho com logotipo, rodapé com aviso institucional e numeração de páginas; zero arquivos armazenados no servidor após a entrega.

## Histórias de Usuário

- Como **arquiteto**, quero clicar em "Baixar PDF" na tela de preview para receber o contrato pronto para assinar e entregar ao cliente.
- Como **arquiteto**, quero que o PDF tenha o logotipo do CAU/DF no cabeçalho para que o documento tenha credibilidade institucional.
- Como **arquiteto**, quero que o rodapé do PDF exiba o aviso do CAU/DF e a numeração de páginas para que o documento esteja em conformidade com o modelo orientativo.
- Como **arquiteto**, quero que o PDF mantenha a formatação correta (margens, fontes, numeração de cláusulas) para que o documento seja legível e profissional.

## Funcionalidades Principais

### RF-01 — Endpoint de geração de PDF

O backend expõe `POST /api/pdf/gerar` que recebe o mesmo payload do contrato (Feature 03), gera o HTML internamente e o converte para PDF usando Puppeteer (Chrome headless). Retorna o arquivo como `application/pdf` para download direto no navegador.

- O PDF não é salvo no servidor — gerado em memória e enviado na resposta.
- Em caso de erro na geração, retorna status 400 com mensagem descritiva.

### RF-02 — Layout institucional do PDF

Todas as páginas do PDF devem conter:

**Cabeçalho:**
- Logotipo do CAU/DF (imagem PNG/SVG, adicionada como asset ao projeto)
- Título: "Contrato de Prestação de Serviços de Arquitetura"

**Rodapé:**
- Aviso: *"Este documento foi gerado a partir de modelo orientativo disponibilizado pelo CAU/DF. O CAU/DF não se responsabiliza pelo conteúdo adaptado pelo profissional."*
- Numeração de páginas no formato "Página X de Y"

**Formatação geral:**
- Papel A4, orientação retrato
- Margens adequadas para impressão e assinatura
- Fonte legível (Times New Roman ou similar serifada)
- Numeração de cláusulas preservada

### RF-03 — Botão de download no frontend

Na tela de preview do contrato, adicionar botão "Baixar PDF" que:

- Envia o payload atual para `POST /api/pdf/gerar`
- Aciona o download automático do arquivo no navegador com nome sugerido `contrato-[data].pdf`
- Exibe estado de carregamento enquanto o PDF é gerado
- Exibe mensagem de erro se a geração falhar

### RF-04 — Regra de imutabilidade pós-PDF (Anexo V, Regra 4)

Após o download do PDF ser iniciado, o formulário de edição do contrato deve ser bloqueado na sessão atual, sinalizando que o contrato foi finalizado. O usuário pode iniciar um novo contrato a partir do zero.

## Experiência do Usuário

**Fluxo principal:**

1. Arquiteto preenche o formulário e visualiza o preview do contrato (Feature 03 já implementado)
2. Clica em "Baixar PDF" — botão visível na tela de preview
3. O sistema exibe indicador de carregamento (geração pode levar alguns segundos)
4. O browser inicia o download automático do arquivo `contrato-[data].pdf`
5. O formulário é bloqueado para edição, confirmando que o contrato foi finalizado

**Estados do botão:**
- Padrão: "Baixar PDF" habilitado
- Carregando: "Gerando PDF..." com spinner, desabilitado
- Erro: mensagem de erro inline, botão reabilitado para nova tentativa

**Acessibilidade:** botão com `aria-label` descritivo; indicador de carregamento com `aria-live`.

## Restrições Técnicas de Alto Nível

- Depende da Feature 03 (Motor de Geração de Contratos) — o payload e o HTML gerado são a entrada desta feature.
- O backend já usa Bun + Hono; a biblioteca Puppeteer deve ser compatível com esse ambiente.
- O logotipo do CAU/DF deve ser adicionado como asset estático ao projeto (PNG ou SVG).
- O PDF é gerado sob demanda — sem armazenamento persistente no servidor (Regra 9, Anexo V).
- A geração de PDF com Puppeteer pode levar 2–5 segundos; o frontend deve comunicar o estado ao usuário.

## Fora de Escopo

- Armazenamento do PDF no servidor ou em serviço de nuvem.
- Envio do PDF por e-mail.
- Assinatura digital integrada (gov.br) — prevista para release futuro (Anexo II).
- Geração de múltiplos PDFs em lote.
- Histórico de PDFs gerados por arquiteto.
- Personalização do layout pelo usuário.
