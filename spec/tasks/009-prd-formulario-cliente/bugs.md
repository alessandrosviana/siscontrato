# Bugs — Feature 009: Formulário de Dados do Cliente

## Resumo

| ID | Severidade | Componente | Status |
|----|------------|------------|--------|
| BUG-01 | Baixa | `client-form-page.module.css` | Corrigido |
| BUG-02 | Informativa | `client-form-page.tsx` | Decisão Documentada |

---

## BUG-01 — `outline: none` no estado base do input sem uso de `:focus-visible`

**Severidade:** Baixa
**Componente:** `frontend/src/pages/client-form-page.module.css`
**Linha:** 44
**Status:** Aberto

**Descrição:**
A classe `.input` define `outline: none` no estado base, removendo o outline padrão do navegador. O estado `.input:focus` redefine o outline com `outline: 2px solid #1a1a2e`. Embora o comportamento final no foco esteja correto para WCAG 2.2 SC 2.4.11 (o outline é visível ao navegar por teclado), o uso de `:focus` em vez de `:focus-visible` faz o outline aparecer também ao clicar com mouse, o que é uma experiência visual diferente da esperada em muitas UIs modernas.

Não é uma violação de acessibilidade (o outline aparece em todos os cenários de foco, inclusive teclado), mas é uma oportunidade de melhoria para alinhar ao padrão moderno de CSS.

**Evidência:**
```css
/* Linha 44 */
.input {
  outline: none;    /* remove outline padrão */
}

/* Linha 48-52 */
.input:focus {
  outline: 2px solid #1a1a2e;  /* restaura outline apenas no foco */
  outline-offset: 2px;
}
```

**Correção Sugerida:**
Substituir `.input:focus` por `.input:focus-visible` para aplicar outline apenas ao foco por teclado, mantendo a experiência visual limpa ao clicar com mouse, sem comprometer a acessibilidade por teclado.

```css
.input:focus-visible {
  border-color: #1a1a2e;
  outline: 2px solid #1a1a2e;
  outline-offset: 2px;
}
```

- **Status:** Corrigido
- **Correção aplicada:** Substituído `.input:focus` por `.input:focus-visible` em `client-form-page.module.css` — outline aparece agora apenas ao navegar por teclado, sem interferir no clique com mouse
- **Testes de regressão:** CSS não é testável via Testing Library em CSS Modules; testes existentes passando (119/119)

---

## BUG-02 — Ausência de `aria-describedby` e `aria-invalid` nos campos

**Severidade:** Informativa (Decisão de Design Documentada)
**Componente:** `frontend/src/pages/client-form-page.tsx`
**Linha:** 145-229 (campos de input)
**Status:** Decisão Documentada — Não é Bug

**Descrição:**
O PRD (RF-06, seção Acessibilidade) especifica que campos inválidos devem ter `aria-describedby` e `aria-invalid="true"`. A implementação não possui esses atributos.

A TechSpec (decisão de design, seção "Validação silenciosa") determinou explicitamente que não haveria mensagens de erro — o feedback é feito apenas pelo botão "Continuar" desabilitado. Esta decisão elimina a necessidade de `aria-describedby` (não há elemento de mensagem de erro para vincular) e `aria-invalid` (não há estado de "erro exibido" para indicar).

**Evidência da decisão na TechSpec:**
> "Sem estado de erros — validação é silenciosa (botão desabilitado); sem `submitted` flag"
> "Validação silenciosa — Botão desabilitado, sem mensagens de erro — UX mais limpa para formulário curto"

**Impacto:**
Usuários de tecnologia assistiva que navegam por teclado não recebem feedback específico sobre qual campo está inválido — apenas que o botão "Continuar" está desabilitado. Isso pode causar confusão especialmente no caso de CPF/CNPJ com formato correto mas dígitos verificadores inválidos.

**Recomendação (Backlog):**
Considerar adicionar indicador visual de campo inválido (ex: borda vermelha em `cliente_documento` quando o CPF/CNPJ estiver com formato completo mas inválido), com `aria-invalid="true"` correspondente, sem necessariamente exibir mensagem de texto — equilibrando a UX silenciosa com feedback acessível mínimo.
