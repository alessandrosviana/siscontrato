# PRD — Preenchimento de Variáveis das Cláusulas Opcionais

## Visão Geral

As cláusulas opcionais do contrato contêm variáveis de template (ex: `{{usos_adicionais}}`, `{{valor_visita_extra}}`) que devem ser substituídas por valores reais antes da geração do PDF. Hoje, quando o usuário ativa uma cláusula com variáveis, essas lacunas aparecem literalmente no contrato final — o que compromete a validade e a apresentação do documento.

Esta feature resolve o problema expondo, dentro da própria tela de seleção de cláusulas (`/clausulas`), campos de preenchimento para cada variável de uma cláusula ativada. O usuário vê o texto da cláusula, identifica as lacunas e preenche os valores — tudo no mesmo lugar, sem etapas extras.

## Objetivos

- Eliminar a ocorrência de `{{placeholders}}` literais no PDF gerado quando cláusulas opcionais com variáveis são selecionadas.
- Nenhuma etapa extra no fluxo — os campos de preenchimento são integrados à tela `/clausulas` já existente.
- Todos os contratos gerados com cláusulas opcionais selecionadas exibem texto completo e coerente.

## Histórias de Usuário

- Como arquiteto, quero preencher os valores das lacunas de uma cláusula diretamente na tela de seleção, para que o contrato gerado não contenha placeholders visíveis.
- Como arquiteto, quero que os valores que já preenchi sejam preservados mesmo que eu desative temporariamente uma cláusula, para não precisar redigitá-los se mudar de ideia.
- Como arquiteto, quero ser avisado visualmente se ativei uma cláusula mas deixei algum campo em branco, para não gerar um contrato incompleto por descuido.

## Funcionalidades Principais

### RF1 — Metadados de variáveis na API de cláusulas

O endpoint `GET /api/clausulas?obrigatoria=false` deve retornar, para cada cláusula, um array `variaveis` com os metadados de cada variável de template presente no texto:

```
variaveis: [{ slug: string, label: string }]
```

O `slug` corresponde à chave do placeholder no texto (ex: `usos_adicionais`). O `label` é o texto amigável exibido como rótulo do campo (ex: `"Usos adicionais permitidos"`). Cláusulas sem variáveis retornam `variaveis: []`.

### RF2 — Campos de preenchimento dentro do accordion

Quando o usuário abre o accordion de uma cláusula que possui `variaveis.length > 0`, os inputs de preenchimento são exibidos logo abaixo do texto da cláusula, dentro do painel expandido. Cada variável gera um campo `<input type="text">` com:

- Label amigável (`variaveis[i].label`) associado via `<label htmlFor>`
- Placeholder descritivo indicando o que preencher
- Valor atual (se já preenchido anteriormente — revisita ou preservação de estado)

### RF3 — Preenchimento independente de ativação

Os campos de variável podem ser preenchidos mesmo com o toggle da cláusula desativado. O accordion abre independentemente do estado do toggle.

### RF4 — Valores preservados ao desativar cláusula

Se o usuário desativar o toggle de uma cláusula após ter preenchido seus campos, os valores são mantidos em memória. Ao reativar a cláusula, os campos aparecem já preenchidos.

### RF5 — Aviso visual para cláusulas ativas com campos em branco

Quando o usuário clica em "Continuar" e há pelo menos uma cláusula ativa com variável em branco, um aviso não-bloqueante é exibido na tela (ex: mensagem de alerta abaixo da lista). O botão "Continuar" **não é desabilitado** — o usuário decide prosseguir ou corrigir.

### RF6 — Envio dos valores no payload do contrato

Ao clicar "Continuar", os valores preenchidos são incluídos no campo `variaveis_opcionais: Record<string, string>` do `ContratoPayload` já existente. Somente variáveis de cláusulas **ativas** são enviadas — variáveis de cláusulas inativas são descartadas.

### RF7 — Revisita restaura os valores preenchidos

Ao retornar à tela `/clausulas`, os campos de variável são restaurados a partir do store (`steps['optional-clauses']`), da mesma forma que os toggles e as cláusulas personalizadas já são restaurados hoje.

## Experiência do Usuário

**Fluxo principal:**
1. Usuário acessa `/clausulas` e vê a lista de cláusulas opcionais.
2. Ativa o toggle de uma cláusula (ex: "Direitos Autorais Ampliados").
3. Abre o accordion clicando em "Ver texto" — vê o texto com os placeholders destacados e os campos de preenchimento abaixo.
4. Preenche os campos (ex: "Usos adicionais permitidos" = "publicações impressas").
5. Clica "Continuar" — se algum campo de cláusula ativa estiver em branco, vê aviso mas pode prosseguir.

**Comportamento do accordion:** Os campos aparecem somente dentro do accordion aberto, mantendo a lista compacta para cláusulas que o usuário não está editando.

**Acessibilidade:**
- Cada `<input>` tem `<label htmlFor>` com texto descritivo.
- O aviso de campos em branco usa `role="alert"` para leitores de tela.
- `focus-visible` com outline em todos os inputs.

## Restrições Técnicas de Alto Nível

- Os metadados de variáveis (`label`) são definidos no backend (`clausulas.json`) — o frontend não infere labels a partir do slug.
- O campo `variaveis_opcionais: Record<string, string>` já existe em `ContratoPayload` e no serviço de geração de PDF — nenhuma alteração no motor de contratos é necessária.
- A feature é exclusivamente frontend + dados do backend; nenhum novo endpoint é criado.

## Fora de Escopo

- Validação bloqueante (o "Continuar" nunca é desabilitado por campos de variável em branco).
- Interface administrativa para edição dos labels ou adição de novas variáveis.
- Suporte a variáveis em cláusulas obrigatórias (essas já são preenchidas automaticamente a partir dos formulários anteriores).
- Formatação especial de inputs (máscara monetária, seleção de datas) — todos os campos são texto livre nesta versão.
