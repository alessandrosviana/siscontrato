# Feature 15 — Assistente Virtual IA (Lina) — Fase 2

## Contexto

Na fase 2 da plataforma, será integrado um assistente virtual baseado na personagem
Lina, assistente virtual do CAU/DF. O assistente auxilia o usuário durante o
preenchimento do formulário, sem gerar cláusulas jurídicas automaticamente.

Esta feature está fora do escopo do MVP e deve ser desenvolvida após a validação
do MVP com usuários reais.

## Objetivo desta feature

Implementar o assistente virtual Lina integrado ao formulário multi-etapas,
oferecendo orientação contextual em cada tela do fluxo.

## Requisitos

### Capacidades do assistente (Seção 13 e Regra 7 — Anexo V)

**O assistente PODE:**
- Explicar a finalidade de cada campo do formulário
- Sugerir descrições de escopo baseadas no tipo de serviço selecionado
- Alertar inconsistências nas informações (ex: prazo muito curto para o escopo)
- Orientar o usuário durante o preenchimento

**O assistente NÃO PODE:**
- Gerar cláusulas jurídicas automaticamente
- Substituir análise jurídica individualizada
- Criar textos de cláusulas para inserção automática no contrato

### Integração com o formulário

- Widget flutuante (balão/chat) persistente em todas as telas do formulário
- Contexto dinâmico: o assistente sabe em qual etapa o usuário está
- Sugestões exibidas proativamente ao entrar em cada tela (ex: ao chegar na tela
  de escopo, Lina sugere descrições típicas para o pacote selecionado)
- Usuário pode perguntar livremente em linguagem natural

### Integração com a API de IA

- Usar a Claude API (Anthropic) para processamento de linguagem natural
- System prompt deve incluir:
  - Contexto da plataforma e seu caráter orientativo
  - Restrições explícitas (não gerar cláusulas, não dar parecer jurídico)
  - Dados do formulário até o momento (para contexto nas sugestões)
  - Personalidade: Lina, assistente do CAU/DF

### Regras de negócio (Regra 7 — Anexo V)

- O assistente não pode gerar cláusulas jurídicas automaticamente
- As sugestões de escopo são textos informativos, não cláusulas contratuais
- O assistente deve sempre deixar claro que suas orientações são sugestões

## Fora do escopo desta feature

- Geração automática de cláusulas por IA
- Parecer jurídico automatizado
- Integração com bases de dados jurídicas externas

## Referência no documento

Seção 4 — Assistente de IA para orientação no preenchimento
Seção 13 — Uso de Inteligência Artificial
Seção 16 — Evoluções Futuras (referência à fase 2)
Anexo IV — Tela 6 (sugestões do assistente virtual no escopo)
Anexo V — Regra 7
