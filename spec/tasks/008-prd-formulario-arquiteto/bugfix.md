# Relatório de Correção de Bugs — Formulário de Dados do Arquiteto (008)

## BUG-01 — WCAG 2.2 SC 2.4.11 — Focus Appearance

- **Severidade:** Baixa
- **Arquivo:** `frontend/src/pages/architect-form-page.module.css`
- **Status:** Corrigido

### Problema

O seletor `.input` continha `outline: none`, removendo o indicador de foco nativo do browser. O seletor `.input:focus` apenas alterava o `border-color` sem fornecer um outline compensatório. Em modo de alto contraste do sistema operacional, a mudança de cor de borda é insuficiente para indicar o campo ativo, violando WCAG 2.2 SC 2.4.11 (Focus Appearance).

### Correção Aplicada

Adicionado ao seletor `.input:focus` em `architect-form-page.module.css`:

```css
.input:focus {
  border-color: #1a1a2e;
  outline: 2px solid #1a1a2e;
  outline-offset: 2px;
}
```

### Verificação

- **Testes:** 105 testes passando (`bun run test --run` no diretório `frontend`)
- **Build:** Build de produção concluído com sucesso (`bun run build` no diretório `frontend`)
- **Testes de regressão:** Propriedades CSS de outline não são diretamente testáveis via Testing Library em CSS Modules; os testes existentes continuam passando sem regressões.
