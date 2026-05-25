# PRD — Formulário de Dados do Projeto (Feature 010)

## Visão Geral

Etapa 6 do fluxo de geração de contrato de serviços de arquitetura. Após preencher os dados do cliente, o usuário informa os dados do projeto objeto do contrato. Parte dos campos são pré-preenchidos com as informações do pacote de serviço escolhido na Etapa 3, mas permanecem editáveis. Os dados coletados definem a natureza do contrato e influenciam diretamente as cláusulas geradas no PDF.

## Objetivos

- Coletar os dados do projeto necessários para geração do contrato (Tela 5 — Anexo IV)
- Reduzir retrabalho pré-preenchendo tipo de serviço e tipologia a partir do pacote selecionado
- Indicar visualmente quais campos foram sugeridos pelo pacote, diferenciando-os dos campos preenchidos pelo usuário
- Garantir que todos os campos obrigatórios estejam válidos antes de avançar para o resultado

## Histórias de Usuário

- Como arquiteto que já escolheu o pacote de serviço, quero encontrar o tipo de serviço e a tipologia pré-preenchidos para não ter que repetir informações já fornecidas
- Como usuário que quer ajustar a tipologia sugerida pelo pacote, quero poder editar o campo livremente para adaptar ao projeto real do cliente
- Como usuário que voltou a esta tela, quero encontrar os dados já preenchidos anteriormente para não ter que preencher tudo de novo
- Como arquiteto, quero que o botão "Continuar" só habilite quando todos os campos obrigatórios estiverem preenchidos para evitar gerar um contrato com dados incompletos

## Funcionalidades Principais

### RF-01 — Tipo de Contrato
Select obrigatório com as opções: "Prestação de Serviço" e "Empreitada". Não é pré-preenchido pelo pacote — o usuário sempre seleciona. Valor padrão: nenhum selecionado.

### RF-02 — Tipo de Serviço
Select obrigatório com as opções: "projeto", "reforma", "reforma de interiores". Pré-preenchido com o valor do pacote selecionado na Etapa 3 (`steps['package'].tipo_servico`). Campo editável.

### RF-03 — Tipologia
Select obrigatório com as opções: "residencial", "comercial", "corporativa", "institucional", "outros". Pré-preenchido com o valor do pacote selecionado na Etapa 3 (`steps['package'].tipo_projeto`). Campo editável.

### RF-04 — Indicação Visual de Pré-preenchimento
Campos pré-preenchidos pelo pacote (`tipo_servico`, `tipologia`) exibem uma etiqueta textual discreta "(sugestão do pacote)" ao lado do label, informando o usuário da origem do valor.

### RF-05 — Endereço do Projeto
Campo de texto obrigatório. Não é pré-preenchido. O usuário informa o endereço completo do imóvel objeto do serviço.

### RF-06 — Área do Projeto
Campo numérico opcional (m²). Não é pré-preenchido. Aceita apenas valores numéricos positivos. Exibe unidade "m²" como sufixo visual.

### RF-07 — Validação e Botão "Continuar"
O botão "Continuar" fica desabilitado enquanto houver campos obrigatórios (`tipo_contrato`, `tipo_servico`, `tipologia`, `endereco_projeto`) sem valor selecionado/preenchido. Não são exibidas mensagens de erro — o botão desabilitado é o único indicador de incompletude.

### RF-08 — Navegação
- Botão "Voltar": navega para `/contratante` sem apagar dados do store
- Botão "Continuar" (quando válido): salva os dados no `form-store` e navega para `/resultado`

### RF-09 — Persistência no Store
Ao clicar "Continuar" com formulário válido, chamar:
```
updateStep('project', { tipo_contrato, tipo_servico, tipologia, endereco_projeto, area_projeto })
```

### RF-10 — Pré-preenchimento
Ao montar a página:
1. Ler `steps['project']` do `form-store` — se existir, popular todos os campos com os valores salvos anteriormente
2. Se não existir `steps['project']`, popular `tipo_servico` e `tipologia` a partir de `steps['package']`

### RF-11 — Atualização do Fluxo de Navegação
A tela `ClientFormPage` (`/contratante`) atualmente navega para `/resultado` ao clicar "Continuar". Esta feature deve atualizar essa navegação para `/projeto`, inserindo o formulário do projeto no fluxo correto.

## Experiência do Usuário

**Persona principal:** arquiteto que já preencheu seus dados e os dados do cliente; agora descreve o projeto a ser contratado.

**Fluxo principal:**
1. Usuário chega via `/contratante` (formulário do cliente)
2. Encontra `tipo_servico` e `tipologia` pré-preenchidos (originados do pacote)
3. Seleciona `tipo_contrato` (obrigatório, sem sugestão)
4. Preenche `endereco_projeto` (obrigatório) e opcionalmente `area_projeto`
5. Ajusta `tipo_servico` ou `tipologia` se necessário
6. Botão "Continuar" habilita quando todos os obrigatórios estão preenchidos → navega para `/resultado`

**Acessibilidade:**
- Todos os campos com `<label htmlFor>` associado
- Selects com opção vazia inicial para `tipo_contrato` ("Selecione...")
- `<h1>` único na página
- Indicador visual de foco nos campos (`outline` visível — WCAG 2.2)
- Etiqueta "(sugestão do pacote)" implementada como texto, não apenas como elemento visual

**Layout:** seguir o padrão visual das demais páginas (CSS Modules, mesma paleta, botões de ação no rodapé).

## Restrições Técnicas de Alto Nível

- Integra ao `form-store` (Zustand) via `updateStep('project', {...})` e leitura de `steps['package']` e `steps['project']`
- CSS Modules, sem biblioteca de UI externa
- React 19 + Vite + TypeScript — sem dependências novas
- `tipo_contrato` e `area_projeto` precisam ser adicionados ao `ContratoPayload` em `contrato.ts`
- `area_projeto` deve se tornar opcional (`?`) em `ContratoPayload` — atualmente obrigatório

## Fora de Escopo

- Validação do endereço do projeto via API de geolocalização
- Cálculo automático de valores com base na área informada
- Múltiplos projetos por contrato
- Upload de plantas ou documentos do projeto
- Integração com o template do contrato (os campos são salvos no store; o PDF usa os dados já armazenados)
