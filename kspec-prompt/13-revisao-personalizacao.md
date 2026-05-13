# Feature 13 — Revisão e Personalização do Contrato

## Contexto

Etapa 12 do fluxo. Antes de gerar o PDF final, o usuário visualiza o contrato
completo montado com todos os dados inseridos, podendo editar informações e
adicionar ajustes finais.

Esta é a última chance de edição antes do bloqueio pós-geração do PDF.

## Objetivo desta feature

Implementar a tela de revisão do contrato (Tela 9 — Anexo IV), que exibe o preview
completo do contrato e permite ajustes finais antes da geração definitiva.

## Requisitos

### Tela de revisão (Tela 9 — Anexo IV)

**Conteúdo exibido:**
- Visualização completa do contrato renderizado (HTML do motor de contratos)
- Layout fiel ao documento final (cabeçalho CAU/DF, cláusulas numeradas, rodapé)

**Ações disponíveis (Seção 9):**
- [Editar informações] — retorna ao passo específico do formulário para correção
- [Adicionar cláusula] — abre modal para inserir cláusula personalizada adicional
- [Gerar contrato] — confirma e dispara a geração do PDF final

### Comportamento

- O preview é gerado via `POST /api/contratos/preview` (Feature 03)
- Edição de campos livres (escopo, prazos, observações) pode ser feita diretamente
  na tela de revisão sem voltar ao formulário
- Após clicar em "Gerar contrato", o sistema dispara `POST /api/contratos/gerar`
  e o botão fica indisponível (sem duplo envio)

### Regras de negócio (Seção 9 e Anexo V)

- Regra 3: o usuário pode revisar e editar antes da geração do PDF final
- Regra 4: após geração do PDF, o documento não pode mais ser editado na plataforma
- Campos editáveis na revisão: escopo, prazos, observações (campos livres)
- Após confirmação, exibir estado de "gerando..." até o PDF estar pronto

## Referência no documento

Seção 4 — Personalização do contrato antes da geração final
Seção 8 — Fluxo (etapa 12 — revisão e personalização)
Seção 9 — Personalização do Contrato
Anexo IV — Tela 9
Anexo V — Regras 3 e 4
