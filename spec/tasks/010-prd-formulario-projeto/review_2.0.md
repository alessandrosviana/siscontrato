# Code Review — Task 2.0: ProjectFormPage

- **Data**: 2026-05-20
- **Status**: APROVADO COM RESSALVAS
- **Testes**: 134/134 passando
- **Build**: sem erros

## Arquivos Modificados

- `frontend/src/pages/project-form-page.tsx` (criado)
- `frontend/src/pages/project-form-page.module.css` (criado)
- `frontend/src/pages/project-form-page.test.tsx` (criado)
- `frontend/src/pages/client-form-page.tsx` (navigate → '/projeto')
- `frontend/src/pages/client-form-page.test.tsx` (regressão atualizada)
- `frontend/src/App.tsx` (rota /projeto adicionada)

## Conformidade com Rules

| Rule | Status |
|------|--------|
| Código-fonte em inglês | OK |
| camelCase para variáveis/funções | OK |
| PascalCase para componentes/interfaces | OK |
| kebab-case para arquivos | OK |
| Constantes para magic values | OK |
| Sem linhas em branco dentro de funções | OK |
| Sem aninhamento de mais de 2 if/else | OK |
| Uma variável por linha | OK |
| Funções com menos de 50 linhas | OK |

## Aderência à TechSpec

| Decisão Técnica | Status |
|-----------------|--------|
| `isFormValid` como função pura fora do componente | OK |
| `suggestedFields: Set<string>` com inicialização lazy | OK |
| Pré-preenchimento steps['project'] com prioridade | OK |
| Pré-preenchimento steps['package'] para tipo_servico/tipo_projeto | OK |
| Validação silenciosa (botão disabled) | OK |
| `updateStep('project', {...})` + navigate('/resultado') | OK |
| Botão "Voltar" → /contratante | OK |
| CSS Module com .suggestionTag e .input:focus-visible | OK |
| Acessibilidade: h1 único, label htmlFor, focus-visible | OK |

## Cobertura de Requisitos

| Requisito | Status |
|-----------|--------|
| RF-01: select tipo_contrato obrigatório | OK |
| RF-02: select tipo_servico pré-preenchido do pacote | OK |
| RF-03: select tipo_projeto pré-preenchido do pacote | OK |
| RF-04: etiqueta "(sugestão do pacote)" apenas na 1ª visita | OK |
| RF-05: endereco_projeto texto obrigatório | OK |
| RF-06: area_projeto opcional com decimais | OK |
| RF-07: botão desabilitado quando campos obrigatórios vazios | OK |
| RF-08: Voltar → /contratante | OK |
| RF-09: Continuar → updateStep + navigate('/resultado') | OK |
| RF-10: pré-preenchimento steps['project'] ou steps['package'] | OK |
| RF-11: ClientFormPage navega para /projeto | OK |

## Ressalvas (Baixa Severidade)

### R-01: `area_projeto` usa `type="text"` em vez de `type="number"`
- **Arquivo**: `project-form-page.tsx`
- **Descrição**: A subtarefa 2.7 especificava `type="number" min="0" step="0.01"`, mas o agente implementou `type="text"` com `inputMode="decimal"`.
- **Justificativa da escolha**: `type="number"` em jsdom normaliza inputs inválidos (ex: "abc") para `""`, quebrando os testes de validação que precisam detectar strings não numéricas. Além disso, evita problemas de vírgula vs. ponto decimal em diferentes locales.
- **Recomendação**: Manter `type="text"` com `inputMode="decimal"` — é a implementação mais robusta para este contexto.

### R-02: `savedProject` e `savedPackage` declaradas no corpo do componente
- **Arquivo**: `project-form-page.tsx`
- **Descrição**: Pequeno desvio do princípio "declare próximo ao uso", mas necessário para uso nos inicializadores lazy do useState.
- **Recomendação**: Manter como está — é a única forma de usar esses valores nos inicializadores lazy. Não é um problema real.

## Pontos Positivos

- Implementação fiel ao padrão do ClientFormPage (Feature 009)
- `isFormValid` como função pura fora do componente, sem closure
- `suggestedFields` com inicialização lazy correta
- Acessibilidade completa: h1 único, label htmlFor, focus-visible nos inputs e selects
- Etiqueta "(sugestão do pacote)" como span dentro do label — acessível por leitores de tela
- 15 cenários de teste implementados com cobertura completa
- Teste de regressão do ClientFormPage atualizado
- Build TypeScript + Vite sem erros; lint limpo

## Conclusão

Task 2.0 aprovada. As ressalvas são de severidade baixa e o review recomenda manter a implementação atual sem alterações de código. A escolha de `type="text"` para `area_projeto` é tecnicamente superior ao `type="number"` neste contexto (testes + compatibilidade de locale).
