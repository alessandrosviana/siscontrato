# PRD — Página Inicial e Aviso Institucional

## Visão Geral

A plataforma SisContrato CAU/DF necessita de um ponto de entrada claro para o fluxo de geração de contratos. Atualmente, a rota raiz exibe diretamente a área de download de PDF, sem apresentação da ferramenta nem aceite do aviso institucional obrigatório exigido pela Seção 3 do documento base. Esta funcionalidade implementa as duas primeiras telas do fluxo: (1) **Página Inicial** com chamada para ação e (2) **Aviso Institucional** com aceite obrigatório antes de acessar o formulário.

## Objetivos

- 100% dos usuários visualizam e aceitam o aviso institucional antes de acessar o formulário de geração de contratos
- O botão "Continuar" permanece desabilitado enquanto o checkbox não estiver marcado (Regra 1 — Anexo V)
- Reduzir ambiguidade sobre a natureza orientativa dos modelos gerados, protegendo o CAU/DF de responsabilização indevida
- **Métrica de sucesso:** taxa de conversão do aceite ≥ 95% (usuários que chegam à Tela 2 e clicam em "Continuar")

## Histórias de Usuário

- Como arquiteto, quero ver uma página inicial clara sobre a ferramenta para entender o que posso fazer antes de começar
- Como arquiteto, quero ler o aviso institucional e aceitar os termos para ter clareza sobre minha responsabilidade ao usar o modelo de contrato
- Como arquiteto, quero que o botão "Continuar" só fique disponível após marcar o checkbox para que o aceite seja consciente e intencional
- Como usuário de leitor de tela, quero que o checkbox e o botão sejam operáveis via teclado para usar a plataforma sem depender de mouse

## Funcionalidades Principais

### Feature 01 — Página Inicial (Tela 1)

Primeira tela exibida ao acessar a plataforma (rota `/`). Substitui o conteúdo atual da `home.tsx`.

**Conteúdo:**
- Título principal: "Gerador de Contratos para Arquitetos"
- Descrição breve da ferramenta e seu propósito
- Botão principal: "Criar contrato"
- Rodapé: "CAU/DF | Aviso legal"

**Requisitos funcionais:**
- RF-01: A rota `/` deve exibir a Tela 1 com título, descrição e botão "Criar contrato"
- RF-02: Clicar em "Criar contrato" deve navegar para a rota do aviso institucional
- RF-03: O rodapé deve exibir o texto "CAU/DF" e o texto "Aviso legal"

### Feature 02 — Aviso Institucional (Tela 2)

Segunda tela do fluxo, exibida após clicar em "Criar contrato".

**Conteúdo da mensagem institucional (conforme Seção 3 do documento):**
1. Os modelos têm caráter orientativo
2. A ferramenta não substitui análise jurídica individualizada
3. O uso do documento não gera responsabilidade do CAU/DF sobre o contrato final
4. O profissional permanece responsável pela adequação do documento ao caso concreto

**Interações:**
- Checkbox: "Li e concordo com os termos"
- Botão "Continuar" (desabilitado por padrão; habilitado apenas após marcar o checkbox)

**Requisitos funcionais:**
- RF-04: A rota do aviso deve exibir os quatro pontos institucionais obrigatórios listados acima
- RF-05: O checkbox deve iniciar desmarcado e o botão "Continuar" deve estar desabilitado
- RF-06: Marcar o checkbox habilita o botão "Continuar" (Regra 1 — Anexo V)
- RF-07: Clicar em "Continuar" (com checkbox marcado) navega para o formulário multi-etapas já implementado
- RF-08: O aceite não persiste entre sessões — ao reabrir o navegador, o usuário verá o aviso novamente

## Experiência do Usuário

**Fluxo principal:**
```
/ (Tela 1: Página Inicial)
  → clicar "Criar contrato"
/aviso (Tela 2: Aviso Institucional)
  → marcar checkbox → habilita botão "Continuar"
  → clicar "Continuar"
/formulario (Formulário multi-etapas — já implementado)
```

**Acessibilidade:**
- Checkbox e botão devem ser operáveis via teclado (Tab + Space/Enter)
- Botão desabilitado deve ter `disabled` nativo (não recebe foco e é claramente identificável)
- Texto do aviso deve ter contraste adequado (WCAG AA — mínimo 4.5:1)
- Título de cada página deve usar `<h1>` único
- Checkbox deve ter `<label>` associado explicitamente

**Design e UX:**
- Estilo via CSS Modules — escopo local por componente
- Visual institucional, simples e limpo, coerente com a identidade CAU/DF
- O aviso ocupa a tela inteira como página separada (sem modais ou overlays)
- Sem design responsivo mobile nesta fase — prioridade desktop

## Restrições Técnicas de Alto Nível

- React Router já está configurado no projeto — novas rotas são adicionadas ao `createBrowserRouter` existente em `App.tsx`
- Estado do checkbox é local ao componente (sem persistência entre sessões, sem localStorage)
- A Tela 1 substitui integralmente o conteúdo atual de `home.tsx`
- O componente `DownloadPdfButton` existente em `home.tsx` deve ser movido para a rota de resultado ou removido do escopo desta feature

## Fora de Escopo

- Autenticação ou login de usuário
- Persistência do aceite em banco de dados ou localStorage
- Internacionalização (i18n)
- Histórico de aceites por usuário
- Funcionalidade do link "Aviso legal" no rodapé (texto estático nesta fase)
- Design responsivo para dispositivos móveis
- Formulário multi-etapas (já implementado em feature anterior)
