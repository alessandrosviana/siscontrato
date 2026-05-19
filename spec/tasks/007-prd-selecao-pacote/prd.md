# PRD — Seleção de Pacote de Serviço

## Visão Geral

Após aceitar o aviso institucional, o arquiteto precisa definir o contexto do contrato que irá gerar. A tela de seleção de pacote (Etapa 3 do fluxo principal) apresenta os 5 pacotes de serviço disponíveis no MVP e as tipologias aplicáveis a cada pacote. A escolha pré-configura automaticamente campos do formulário — como escopo, número de revisões e tipo de serviço — reduzindo o esforço de preenchimento nas etapas seguintes. Todos os campos pré-preenchidos permanecem editáveis.

## Objetivos

- 100% dos usuários selecionam pacote e tipologia antes de acessar o formulário
- Reduzir o tempo médio de preenchimento do formulário por meio do pré-preenchimento automático
- Garantir que `tipo_servico`, `escopo_servicos` e `numero_revisoes` sejam pré-configurados com valores coerentes ao pacote escolhido
- **Métrica de sucesso:** taxa de conclusão da etapa ≥ 95% (usuários que chegam à tela e clicam em "Continuar")

## Histórias de Usuário

- Como arquiteto, quero ver os pacotes disponíveis em cards visuais para entender rapidamente as opções antes de escolher
- Como arquiteto, quero ver as tipologias do pacote selecionado para especificar se o projeto é residencial, comercial etc.
- Como arquiteto, quero que o formulário já venha pré-preenchido com base no meu pacote para não precisar digitar informações óbvias
- Como arquiteto, quero poder voltar e trocar o pacote caso tenha escolhido errado

## Funcionalidades Principais

### Feature 01 — Listagem e Seleção de Pacotes

A rota `/pacote` exibe os 5 pacotes do MVP como cards clicáveis. Os dados são carregados via `GET /api/pacotes`.

**Pacotes disponíveis no MVP:**

| Pacote | Tipo de serviço | Tipologias disponíveis |
|---|---|---|
| Projeto de Arquitetura | projeto | residencial, comercial, corporativa, institucional, outros |
| Projeto de Arquitetura de Interiores | reforma de interiores | residencial, comercial |
| Projeto + Acompanhamento de Obra | projeto | residencial, comercial |
| Reforma | reforma | residencial, comercial |
| Reforma de Interiores | reforma de interiores | residencial, comercial |

**Requisitos funcionais:**
- RF-01: A rota `/pacote` deve exibir os 5 pacotes como cards selecionáveis com nome e tipo de serviço
- RF-02: Clicar em um card seleciona o pacote (destaque visual); clicar novamente deseleciona
- RF-03: Apenas um pacote pode ser selecionado por vez
- RF-04: `GET /api/pacotes` retorna a lista de pacotes com tipologias e dados de pré-configuração (hardcoded no backend)

### Feature 02 — Seleção de Tipologia

Após selecionar um pacote, as tipologias disponíveis para aquele pacote são exibidas na mesma tela (não requer navegação).

**Requisitos funcionais:**
- RF-05: Selecionar um pacote exibe dinamicamente suas tipologias disponíveis
- RF-06: O usuário deve selecionar uma tipologia para continuar
- RF-07: Tipologias são exibidas como opções clicáveis (cards menores ou botões de seleção)

### Feature 03 — Pré-preenchimento e Navegação

Ao clicar em "Continuar", o sistema salva os dados no estado do formulário e navega para o formulário multi-etapas.

**Dados salvos no form-store:**
- `pacote_servico` — identificador do pacote selecionado
- `tipo_contrato` — derivado do pacote
- `tipo_servico` — derivado do pacote
- `escopo_servicos` — texto sugestivo pré-preenchido com o escopo típico do pacote
- `numero_revisoes` — valor sugerido para o tipo de serviço

**Requisitos funcionais:**
- RF-08: O botão "Continuar" só é habilitado após selecionar pacote E tipologia
- RF-09: Clicar em "Continuar" salva os campos acima no form-store e navega para `/formulario`
- RF-10: Todos os campos pré-preenchidos devem ser editáveis nas etapas seguintes do formulário
- RF-11: Se o usuário voltar e trocar o pacote, o form-store é sobrescrito com os novos valores

## Experiência do Usuário

**Fluxo principal:**
```
/aviso (Tela 2 — já implementada)
  → clicar "Continuar"
/pacote (Tela 3 — esta feature)
  → clicar no card do pacote desejado
  → tipologias do pacote aparecem
  → clicar na tipologia
  → botão "Continuar" habilita
  → clicar "Continuar"
/formulario (Formulário multi-etapas)
```

**Acessibilidade:**
- Cards de pacote e tipologia operáveis via teclado (Tab + Enter/Space)
- Card selecionado deve ter `aria-pressed="true"` ou equivalente
- Estado de seleção anunciado por leitores de tela
- Botão "Continuar" com `disabled` nativo enquanto não houver seleção completa
- `<h1>` único na página

**Design e UX:**
- Estilo via CSS Modules
- Visual institucional coerente com a identidade CAU/DF
- Tipologias aparecem na mesma tela sem recarregamento (transição suave)
- Estado de loading durante `GET /api/pacotes` (indicador visual)
- Estado de erro caso a API falhe (mensagem clara ao usuário)

## Restrições Técnicas de Alto Nível

- `GET /api/pacotes` é hardcoded no backend — sem banco de dados para esta feature
- Os dados de pré-preenchimento (`escopo_servicos`, `numero_revisoes`) são definidos por pacote no backend e retornados pela API
- A rota `/pacote` deve ser adicionada ao `createBrowserRouter` em `App.tsx`
- O `DisclaimerPage` (/aviso) deve navegar para `/pacote` em vez de `/formulario` após esta feature

## Fora de Escopo

- Criação, edição ou remoção de pacotes (CRUD)
- Personalização de pacotes pelo usuário
- Persistência da seleção entre sessões
- Internacionalização (i18n)
- Design responsivo para mobile
- Formulário multi-etapas (feature futura)
