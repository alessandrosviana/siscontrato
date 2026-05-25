# Bugs — Formulário de Dados do Arquiteto (008)

## BUG-01

- **Severidade:** Baixa
- **Componente:** `architect-form-page.module.css`
- **Linha:** 44 (seletor `.input:focus`)
- **Descrição:** `outline: none` remove o indicador de foco nativo sem fornecer alternativa visualmente equivalente. Em modo de alto contraste do sistema operacional, a mudança de `border-color` no foco é insuficiente para indicar o campo ativo, violando WCAG 2.2 SC 2.4.11 (Focus Appearance).
- **Correção sugerida:** Adicionar `outline: 2px solid #1a1a2e; outline-offset: 2px` ao seletor `.input:focus`
- **Status:** Corrigido
- **Correção aplicada:** Adicionado `outline: 2px solid #1a1a2e; outline-offset: 2px` ao seletor `.input:focus`
- **Testes de regressão:** testes existentes passando (outline não é testável via Testing Library em CSS Modules)
