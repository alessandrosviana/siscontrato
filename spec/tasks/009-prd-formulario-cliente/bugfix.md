# Relatório de Bugfix — Formulário de Dados do Cliente (Feature 009)

## Resumo
- Total de Bugs: 2
- Bugs Corrigidos: 1
- Não aplicável (decisão documentada): 1
- Testes de Regressão Criados: 0 (CSS não testável via Testing Library em CSS Modules)

## Detalhes por Bug

| ID | Severidade | Status | Correção | Testes Criados |
|----|------------|--------|----------|----------------|
| BUG-01 | Baixa | Corrigido | Substituído `.input:focus` por `.input:focus-visible` em `client-form-page.module.css` | Não aplicável (CSS Module) |
| BUG-02 | Informativa | Não é Bug — Decisão Documentada | Sem ação — TechSpec documenta explicitamente a validação silenciosa como trade-off aceito | — |

## Testes
- Testes unitários: TODOS PASSANDO (119/119)
- Testes de integração: TODOS PASSANDO
- Testes E2E: NÃO APLICÁVEL
- Lint: SEM ERROS
- Tipagem: SEM ERROS
- Build: SEM ERROS

## Notas

**BUG-01:** A mudança de `:focus` para `:focus-visible` melhora a UX sem comprometer a acessibilidade — o outline continua visível para navegação por teclado (WCAG 2.2 SC 2.4.11 atendido), mas não aparece ao clicar com mouse, alinhando ao comportamento esperado em interfaces modernas.

**BUG-02:** A ausência de `aria-describedby`/`aria-invalid` é uma consequência direta da decisão de design de validação silenciosa (botão desabilitado como único feedback). Essa decisão está documentada na TechSpec na seção "Decisões Principais" e foi aprovada pelo usuário durante o `/kspec-prd`. Se necessário no futuro, pode-se adicionar `aria-invalid="true"` ao campo `cliente_documento` quando o valor tiver comprimento completo mas for inválido no módulo 11, sem exibir mensagem de texto.
