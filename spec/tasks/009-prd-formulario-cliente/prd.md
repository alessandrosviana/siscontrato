# PRD — Formulário de Dados do Cliente (Feature 009)

## Visão Geral

Etapa 5 do fluxo de geração de contrato de serviços de arquitetura. Após preencher os dados do arquiteto, o usuário informa os dados do cliente contratante. O formulário é dinâmico: os campos exibidos variam conforme o tipo de pessoa selecionado (Pessoa Física ou Pessoa Jurídica). Os dados coletados são necessários para a geração do contrato em PDF.

## Objetivos

- Coletar todos os dados do cliente necessários para o preenchimento do contrato (Anexo IV)
- Garantir que o documento de identificação (CPF ou CNPJ) seja válido antes de avançar
- Exibir apenas os campos pertinentes ao tipo de cliente selecionado, reduzindo fricção
- Impedir avanço enquanto campos obrigatórios estiverem inválidos ou vazios

## Histórias de Usuário

- Como arquiteto que já preencheu seus dados, quero informar os dados do cliente para que o contrato seja gerado com o nome e documento corretos do contratante
- Como usuário que seleciona "Pessoa Jurídica", quero que os campos de razão social e nome do representante legal apareçam automaticamente para que eu possa preencher as informações adicionais exigidas
- Como usuário que voltou a esta tela, quero encontrar os dados já preenchidos anteriormente para não ter que preencher tudo de novo
- Como usuário que troca o tipo de cliente de PJ para PF, quero que os campos específicos de PJ desapareçam e sejam limpos para não causar inconsistência no contrato

## Funcionalidades Principais

### RF-01 — Seleção de Tipo de Cliente
O formulário exibe dois botões de rádio: "Pessoa Física" e "Pessoa Jurídica". A seleção determina quais campos são renderizados. O tipo padrão ao abrir a tela (sem pré-preenchimento) é "Pessoa Física".

### RF-02 — Campos Base
Exibidos para ambos os tipos de cliente:
- `cliente_nome` — texto, obrigatório, não vazio
- `cliente_documento` — texto, obrigatório; validado como CPF quando PF, CNPJ quando PJ; máscara dinâmica aplicada
- `cliente_endereco` — texto, obrigatório, não vazio
- `cliente_email` — email, opcional; validado com regex de formato quando preenchido
- `cliente_telefone` — telefone, opcional; validado com regex de formato brasileiro quando preenchido

### RF-03 — Campos Condicionais (somente Pessoa Jurídica)
Exibidos apenas quando `cliente_tipo = Pessoa Jurídica`:
- `razao_social` — texto, obrigatório quando PJ, não vazio
- `nome_representante_legal` — texto, obrigatório quando PJ, não vazio

### RF-04 — Limpeza ao Trocar Tipo
Ao trocar `cliente_tipo`, os campos condicionais (`razao_social`, `nome_representante_legal`) são limpos. O campo `cliente_documento` também é limpo ao trocar de tipo (máscara muda de CPF para CNPJ ou vice-versa).

### RF-05 — Máscara Dinâmica no Campo Documento
- Quando PF: máscara CPF (`000.000.000-00`)
- Quando PJ: máscara CNPJ (`00.000.000/0000-00`)
- Ao trocar o tipo, o campo `cliente_documento` é limpo e a nova máscara é aplicada

### RF-06 — Validação e Botão "Continuar"
O botão "Continuar" fica desabilitado enquanto houver campos obrigatórios vazios ou inválidos. Mensagens de erro são exibidas abaixo de cada campo inválido após o usuário interagir com o campo (on blur) ou tentar submeter.

### RF-07 — Navegação
- Botão "Voltar": navega para `/formulario` sem apagar dados do store
- Botão "Continuar" (quando válido): salva os dados no `form-store` e navega para `/resultado`

### RF-08 — Persistência no Store
Ao clicar "Continuar" com formulário válido, chamar:
```
updateStep('client', { cliente_tipo, cliente_nome, cliente_documento, cliente_endereco, cliente_email, cliente_telefone, razao_social, nome_representante_legal })
```

### RF-09 — Pré-preenchimento
Ao montar a página, ler `steps['client']` do `form-store` e popular os campos com os valores anteriores, incluindo a seleção de tipo de cliente.

## Experiência do Usuário

**Persona principal:** arquiteto autônomo ou de escritório, não necessariamente técnico, usando o sistema para gerar contratos de prestação de serviços.

**Fluxo principal:**
1. Usuário chega via `/formulario` (formulário do arquiteto)
2. Seleciona tipo de cliente (PF ou PJ) — campo `cliente_tipo` aparece em destaque no topo
3. Preenche campos base e, se PJ, preenche razão social e representante legal
4. Botão "Continuar" ativa quando todos os obrigatórios estão válidos
5. Clica "Continuar" → navega para `/resultado`

**Acessibilidade:**
- Todos os campos devem ter `<label htmlFor>` associado
- Mensagens de erro com `aria-describedby` e `aria-invalid="true"` nos campos inválidos
- Rádios de tipo com `aria-label` ou `fieldset + legend`
- `<h1>` único na página
- Indicador visual de foco nos campos (`outline` visível)

**Layout:** seguir o padrão visual das demais páginas do sistema (CSS Modules, mesma paleta de cores, botões de ação no rodapé do formulário).

## Restrições Técnicas de Alto Nível

- Integra ao `form-store` (Zustand) existente via `updateStep` e `steps`
- Reutiliza `validateCpf`, `validateCnpj`, `validateEmail`, `validatePhone` de `validators.ts` (Feature 008)
- CSS Modules, sem biblioteca de UI externa
- React 19 + Vite + TypeScript — sem dependências novas
- Máscaras implementadas inline (sem biblioteca), como no formulário do arquiteto

## Fora de Escopo

- Múltiplos clientes por contrato
- Upload de documentos de identificação
- Busca automática de dados por CPF/CNPJ (integração com Receita Federal)
- Validação em tempo real enquanto o usuário digita (apenas on blur e on submit)
- Internacionalização ou clientes estrangeiros
