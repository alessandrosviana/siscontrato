# Feature 05 — Página Inicial e Aviso Institucional

## Contexto

A plataforma começa com uma página inicial simples e um aviso institucional
obrigatório que o usuário deve aceitar antes de acessar o formulário de geração
de contratos.

Este é o ponto de entrada do fluxo principal da plataforma.

## Objetivo desta feature

Implementar as duas primeiras telas do fluxo: página inicial com CTA e aviso
institucional com aceite obrigatório, conforme Telas 1 e 2 do Anexo IV.

## Requisitos

### Tela 1 — Página Inicial (Wireframe Tela 1 — Anexo IV)

**Conteúdo:**
- Título: "Gerador de Contratos para Arquitetos"
- Descrição breve da ferramenta e seu propósito
- Botão principal: "Criar contrato"
- Rodapé: "CAU/DF | Aviso legal"

**Comportamento:**
- Clicar em "Criar contrato" navega para a tela de aviso institucional

### Tela 2 — Aviso Institucional (Wireframe Tela 2 — Anexo IV)

**Conteúdo:**
- Mensagem institucional explicando que o contrato é um modelo orientativo
- Informações obrigatórias conforme Seção 3 do documento:
  - os modelos têm caráter orientativo
  - a ferramenta não substitui análise jurídica individualizada
  - o uso do documento não gera responsabilidade do CAU/DF sobre o contrato final
  - o profissional permanece responsável pela adequação do documento ao caso concreto
- Checkbox: "Li e concordo com os termos"
- Botão "Continuar" (desabilitado até o checkbox ser marcado)

**Comportamento:**
- Botão "Continuar" só é habilitado após marcar o checkbox (Regra 1 — Anexo V)
- Ao confirmar, navega para a seleção de pacote de serviço

### Regras de negócio (Anexo V — Regra 1)

- O usuário só pode acessar o formulário após aceitar o aviso institucional
- Sem aceite, o botão "Continuar" permanece desabilitado

## Referência no documento

Seção 3 — Natureza da Ferramenta
Seção 8 — Fluxo da Plataforma (etapas 1 e 2)
Anexo II — Fluxo: Página inicial → Aviso institucional
Anexo IV — Wireframes Tela 1 e Tela 2
Anexo V — Regra 1
