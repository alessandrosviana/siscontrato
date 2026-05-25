# PRD — Escopo dos Serviços e Serviços Adicionais (Feature 011)

## Visão Geral

Etapas 7 e 8 do fluxo de geração de contrato de arquitetura. Após definir os dados do projeto, o arquiteto descreve o escopo dos serviços contratados e seleciona eventuais serviços adicionais. Ambas as informações são incorporadas diretamente às cláusulas do contrato gerado. O escopo pode ser pré-preenchido com o texto-padrão do pacote selecionado, poupando retrabalho.

## Objetivos

- Coletar `escopo_servicos` e `numero_revisoes` para compor as cláusulas obrigatórias do contrato
- Reduzir retrabalho pré-preenchendo escopo e número de revisões a partir do pacote
- Permitir ao arquiteto registrar serviços adicionais (gestão, acompanhamento e fiscalização de obra) que impactam prazo e honorários
- Alertar proativamente sobre a necessidade de revisar prazo e honorários quando serviços adicionais são selecionados

## Histórias de Usuário

- Como arquiteto que já escolheu o pacote, quero encontrar o escopo e o número de revisões pré-preenchidos para não precisar digitar do zero o que o pacote já define
- Como arquiteto que precisa personalizar o escopo, quero editar livremente o texto para refletir o acordado com o cliente
- Como arquiteto que vai incluir acompanhamento de obra, quero selecionar esse serviço adicional e ser lembrado de ajustar prazo e honorários nas etapas seguintes
- Como usuário que voltou a esta etapa, quero encontrar os dados já preenchidos anteriormente para não perder o trabalho feito

## Funcionalidades Principais

### RF-01 — Tela de Escopo dos Serviços (/escopo)

Página com dois campos:
- `escopo_servicos` (textarea obrigatório): descrição livre do escopo contratado
- `numero_revisoes` (número inteiro, obrigatório quando exibido): quantidade de revisões incluídas no contrato

### RF-02 — Pré-preenchimento do Escopo

Ao montar a página `/escopo`:
1. Se `steps['scope']` existir → popular campos com os valores salvos anteriormente
2. Caso contrário → pré-preencher `escopo_servicos` com `steps['package'].escopo_padrao` e `numero_revisoes` com `steps['package'].numero_revisoes_sugerido`

Campos pré-preenchidos do pacote exibem a etiqueta textual discreta "(sugestão do pacote)" ao lado do label — mesmo padrão da Feature 010. A etiqueta aparece apenas na primeira visita (quando `steps['scope']` não existe).

### RF-03 — Exibição Condicional de Número de Revisões

O campo `numero_revisoes` só é exibido quando o tipo de serviço selecionado envolve fases de projeto:
- **Exibido** quando `tipo_servico === 'projeto'` (obtido de `steps['project'].tipo_servico` ou `steps['package'].tipo_servico`)
- **Oculto** para `tipo_servico === 'reforma'` ou `tipo_servico === 'reforma de interiores'`

Quando exibido, é obrigatório e deve conter um número inteiro maior ou igual a 1.

### RF-04 — Validação do Escopo

O botão "Continuar" fica desabilitado enquanto:
- `escopo_servicos` estiver vazio (após trim)
- `numero_revisoes` estiver vazio, não for inteiro ou for menor que 1 (apenas quando o campo estiver visível)

Não são exibidas mensagens de erro — o botão desabilitado é o único indicador.

### RF-05 — Persistência do Escopo

Ao clicar "Continuar" com formulário válido:
```
updateStep('scope', { escopo_servicos, numero_revisoes })
navigate('/servicos-adicionais')
```

### RF-06 — Navegação do Escopo

- Botão "Voltar" → `navigate('/projeto')` sem apagar dados do store
- Botão "Continuar" (válido) → salva no store e navega para `/servicos-adicionais`

### RF-07 — Atualização do Fluxo de Navegação

`ProjectFormPage` (`/projeto`) atualmente navega para `/resultado` ao confirmar. Esta feature deve atualizar essa navegação para `/escopo`.

### RF-08 — Tela de Serviços Adicionais (/servicos-adicionais)

Página com checkboxes múltiplos para selecionar serviços adicionais opcionais:
- Gestão de obra
- Acompanhamento de obra
- Fiscalização de obra

Nenhum serviço precisa ser selecionado para avançar — todos são opcionais.

### RF-09 — Campo de Descrição Condicional

Quando pelo menos um serviço adicional está selecionado, exibe um campo `descricao_servico_adicional` (textarea, opcional): descrição do que foi acordado para os serviços adicionais. Quando nenhum serviço está selecionado, o campo fica oculto.

### RF-10 — Alerta de Revisão de Prazo e Honorários

Quando ao menos um serviço adicional está selecionado, exibe uma mensagem informativa inline:
> "Serviços adicionais impactam o prazo e os honorários. Lembre-se de revisá-los nas etapas seguintes."

A mensagem desaparece quando nenhum serviço está selecionado.

### RF-11 — Persistência dos Serviços Adicionais

Ao clicar "Continuar":
```
updateStep('additional-services', {
  servicos_adicionais: [lista de serviços selecionados],
  descricao_servico_adicional: texto da descrição
})
navigate('/resultado')
```

### RF-12 — Pré-preenchimento dos Serviços Adicionais

Ao montar `/servicos-adicionais`:
- Se `steps['additional-services']` existir → restaurar checkboxes e descrição salvos anteriormente

### RF-13 — Navegação dos Serviços Adicionais

- Botão "Voltar" → `navigate('/escopo')` sem apagar dados do store
- Botão "Continuar" → salva no store e navega para `/resultado`

## Experiência do Usuário

**Persona principal:** arquiteto que já definiu os dados do cliente e do projeto; agora descreve o que será entregue e qualquer serviço extra acordado.

**Fluxo principal:**
1. Usuário chega via `/projeto` (formulário do projeto)
2. Em `/escopo`: encontra o texto de escopo e o número de revisões pré-preenchidos do pacote
3. Ajusta o escopo conforme o acordo específico com o cliente
4. Clica "Continuar" → vai para `/servicos-adicionais`
5. Marca os serviços adicionais desejados (ou nenhum)
6. Se marcou algum: vê o campo de descrição e o alerta sobre revisão de prazo/honorários
7. Clica "Continuar" → vai para `/resultado`

**Acessibilidade:**
- Todos os campos com `<label htmlFor>` associado
- `<h1>` único por página
- Indicador visual de foco nos campos (`outline` visível — WCAG 2.2)
- Etiqueta "(sugestão do pacote)" implementada como texto, não apenas elemento visual
- Checkboxes com `<label>` associado via `htmlFor`
- Mensagem de alerta renderizada como texto, não apenas cor

**Layout:** seguir o padrão visual das demais páginas (CSS Modules, mesma paleta, botões de ação no rodapé).

## Restrições Técnicas de Alto Nível

- Integra ao `form-store` (Zustand) via `updateStep('scope', {...})` e `updateStep('additional-services', {...})`
- Leitura de `steps['package']` (pré-fill), `steps['scope']` (revisita), `steps['project']` (tipo_servico para exibição condicional), `steps['additional-services']` (revisita)
- `numero_revisoes` armazenado como string no store (consistente com `ContratoPayload.numero_revisoes`)
- `servicos_adicionais` armazenado como array de strings no store; o `ResultPage` é responsável por formatá-lo para o payload do contrato
- CSS Modules, sem biblioteca de UI externa
- React 19 + Vite + TypeScript — sem dependências novas

## Fora de Escopo

- Cálculo automático de valor dos serviços adicionais
- Configuração dinâmica das opções de serviços adicionais via backend
- Upload de documentos relacionados ao escopo
- Integração direta com o template PDF (os dados são salvos no store; o ResultPage e o backend fazem a composição)
- Validação de consistência entre escopo e tipologia do projeto
