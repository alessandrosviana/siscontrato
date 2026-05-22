# PRD — Seleção de Cláusulas Opcionais (Feature 013)

## Visão Geral

Etapa 11 do fluxo de geração de contrato de arquitetura. Após definir honorários e prazos, o arquiteto seleciona quais cláusulas opcionais incluir no contrato — e pode adicionar cláusulas personalizadas redigidas por ele mesmo. As cláusulas opcionais são carregadas diretamente da Biblioteca de Cláusulas (Feature 003) via API. As escolhas feitas nesta tela determinam quais blocos de texto serão compostos no documento final pelo motor de contratos.

## Objetivos

- Permitir ao arquiteto selecionar qualquer combinação das 10 cláusulas opcionais disponíveis na biblioteca
- Exibir o texto completo de cada cláusula antes da seleção, para que o arquiteto tome uma decisão informada
- Permitir a inclusão de cláusulas personalizadas redigidas livremente pelo arquiteto
- Inserir a tela `/clausulas` no fluxo entre `/honorarios` e `/resultado`

## Histórias de Usuário

- Como arquiteto, quero ver a lista de cláusulas opcionais com título e um toggle, para escolher rapidamente quais incluir no contrato
- Como arquiteto que quer entender uma cláusula antes de selecioná-la, quero expandir e ler o texto completo diretamente na lista, sem sair da tela
- Como arquiteto com uma necessidade específica não coberta pelas cláusulas padrão, quero redigir e adicionar uma cláusula personalizada ao contrato
- Como arquiteto que adicionou uma cláusula personalizada equivocada, quero removê-la individualmente sem afetar as demais
- Como usuário que voltou a esta tela, quero encontrar minhas seleções e textos personalizados exatamente como deixei

## Funcionalidades Principais

### RF-01 — Listagem de Cláusulas via API

Ao montar a tela, buscar as cláusulas disponíveis via `GET /api/clausulas?obrigatoria=false`. Exibir a lista completa de cláusulas opcionais retornadas, com título e controle de ativação para cada uma.

### RF-02 — Toggle de Seleção

Cada cláusula da lista possui um toggle (ativar/desativar). Por padrão, nenhuma cláusula está ativa. O arquiteto pode ativar ou desativar qualquer combinação, sem restrições.

### RF-03 — Accordion de Texto Completo

Cada cláusula possui um botão "Ver texto" que expande um accordion inline, revelando o texto completo da cláusula. Clicar novamente colapsa o accordion. Múltiplos accordions podem estar abertos simultaneamente. O texto exibido pode conter marcações `{{variavel}}` — exibidas como texto literal, sem processamento.

### RF-04 — Cláusula Personalizada

Um botão "+ Adicionar cláusula personalizada" exibido abaixo da lista de cláusulas padrão. Ao clicar, adiciona um campo de texto livre (textarea) onde o arquiteto redige a cláusula. É possível adicionar múltiplas cláusulas personalizadas com cliques sucessivos no botão.

### RF-05 — Remoção de Cláusula Personalizada

Cada cláusula personalizada possui um botão de remoção individual. Ao clicar, o campo é removido permanentemente daquela sessão. A remoção não afeta as demais cláusulas personalizadas nem as seleções de cláusulas padrão.

### RF-06 — Persistência no Store

Ao clicar "Continuar":
```
updateStep('optional-clauses', {
  clausulas_opcionais: [...slugs das cláusulas ativas],
  clausulas_personalizadas: [...textos das cláusulas personalizadas não vazias]
})
navigate('/resultado')
```

`clausulas_personalizadas` inclui apenas os textos com conteúdo após trim. Textos vazios são descartados no submit.

### RF-07 — Pré-preenchimento (Revisita)

Ao montar a tela, se `steps['optional-clauses']` existir:
- Restaurar os toggles ativos conforme `clausulas_opcionais` salvo
- Restaurar os campos de texto das cláusulas personalizadas conforme `clausulas_personalizadas` salvo

### RF-08 — Navegação

- Botão "Voltar" → `navigate('/honorarios')` sem apagar dados do store
- Botão "Continuar" → sempre habilitado (nenhuma cláusula é obrigatória); salva e navega para `/resultado`

### RF-09 — Atualização do Fluxo de Navegação

`FeesFormPage` (`/honorarios`) atualmente navega para `/resultado` ao confirmar. Esta feature deve atualizar essa navegação para `/clausulas`.

### RF-10 — Estado de Carregamento e Erro da API

Enquanto a requisição à API estiver em andamento, exibir indicador de carregamento. Se a API retornar erro, exibir mensagem informativa e permitir tentar novamente (retry). O botão "Continuar" fica desabilitado durante o carregamento.

## Experiência do Usuário

**Persona principal:** arquiteto que já preencheu todas as etapas financeiras; agora personaliza o contrato com cláusulas adicionais.

**Fluxo principal:**
1. Usuário chega via `/honorarios`
2. A lista de 10 cláusulas opcionais carrega via API
3. Para cada cláusula de interesse: expande o texto para ler, depois ativa o toggle
4. Se necessário, clica "+ Adicionar cláusula personalizada" e redige o texto
5. Clica "Continuar" → navega para `/resultado`

**Acessibilidade:**
- Toggles com `role="switch"` e `aria-checked` para leitores de tela
- Botão "Ver texto" com `aria-expanded` indicando estado do accordion
- Área expandida do accordion com `id` referenciado por `aria-controls` no botão
- `<h1>` único na página
- `focus-visible` com outline em todos os elementos interativos
- Cláusulas personalizadas com `<label>` associado a cada textarea

**Layout:** seguir o padrão visual das demais páginas (CSS Modules, mesma paleta, botões de ação no rodapé).

## Restrições Técnicas de Alto Nível

- Integra ao `form-store` (Zustand) via `updateStep('optional-clauses', {...})` e leitura de `steps['optional-clauses']`
- Consome `GET /api/clausulas?obrigatoria=false` do backend Hono — requer servidor backend rodando
- O campo `clausulas_personalizadas?: string[]` precisa ser adicionado ao `ContratoPayload` em `contrato.ts`
- Texto das cláusulas pode conter `{{variavel}}` — exibido como literal, sem processamento no frontend
- CSS Modules, sem biblioteca de UI externa
- React 19 + Vite + TypeScript — sem dependências novas além das já existentes

## Fora de Escopo

- Processamento das variáveis `{{variavel}}` no texto das cláusulas — responsabilidade do motor de contratos (Feature 004)
- Criação, edição ou exclusão de cláusulas da biblioteca via UI admin
- Reordenação das cláusulas selecionadas pelo arquiteto
- Visualização prévia do contrato com as cláusulas selecionadas
- Cláusulas obrigatórias (sempre incluídas automaticamente — sem necessidade de seleção)
- Validação semântica do texto das cláusulas personalizadas
