# Bugs — Formulário de Dados do Projeto (Feature 010)

## BUG-01 — Sufixo visual "m²" ausente no campo Área do Projeto

**Severidade:** Baixa

**Status:** Aberto

**Requisito violado:** RF-06

**Descrição:**
O PRD especifica que o campo `area_projeto` deve exibir a unidade "m²" como sufixo visual ao lado do input. A implementação atual exibe "m²" apenas dentro do texto do label ("Área do Projeto (m²) — opcional"), não como um elemento sufixo posicionado visualmente ao lado do campo de entrada.

**Evidência:**
- `project-form-page.tsx` linha 141-142: o label contém "(m²)" mas não há elemento de sufixo no JSX do campo input.
- `project-form-page.module.css`: ausência de classes `.suffix`, `.inputWrapper` ou equivalente que implemente o sufixo visual.

**Impacto:**
Experiência do usuário levemente degradada — o usuário precisa ler o label para saber a unidade esperada, em vez de vê-la ao lado do campo. Não afeta funcionalidade nem validação.

**Reprodução:**
1. Acessar `/projeto`
2. Observar o campo "Área do Projeto (m²) — opcional"
3. A unidade "m²" aparece no label, não como sufixo ao lado do input

- **Status:** Corrigido
- **Correção aplicada:** Adicionado wrapper `div.inputWrapper` (flex) com `span.inputSuffix` exibindo "m²" ao lado do input. Label atualizado para "Área do Projeto — opcional" sem o "(m²)". Adicionadas classes `.inputWrapper`, `.inputSuffix` no CSS Module.
- **Testes de regressão:** `project-form-page.test.tsx` — "shows m² suffix next to area_projeto input (BUG-01 regression)"

---

## BUG-02 — Contraste insuficiente da etiqueta "(sugestão do pacote)" (WCAG 2.2 SC 1.4.3)

**Severidade:** Baixa

**Status:** Aberto

**Requisito violado:** Acessibilidade WCAG 2.2

**Descrição:**
A cor `#888` usada para a etiqueta "(sugestão do pacote)" sobre fundo branco (#fff) tem taxa de contraste de aproximadamente 3.5:1, abaixo do mínimo de 4.5:1 exigido pelo WCAG 2.2 SC 1.4.3 para texto normal. O texto usa `font-size: 0.75rem` sem bold, portanto é classificado como texto normal (não texto grande).

**Evidência:**
- `project-form-page.module.css` linha 41: `.suggestionTag { color: #888; }`
- Taxa de contraste #888 vs #ffffff: ~3.54:1 (insuficiente para texto normal)

**Impacto:**
Usuários com baixa acuidade visual podem ter dificuldade para ler a etiqueta informativa. O fluxo funcional não é afetado pois a etiqueta é apenas informativa.

**Correção sugerida:**
Usar `#767676` (contraste 4.54:1) ou mais escuro para atender WCAG 2.2 AA.

- **Status:** Corrigido
- **Correção aplicada:** Alterada a cor de `#888` para `#767676` na classe `.suggestionTag` em `project-form-page.module.css`. Contraste resultante: ~4.54:1, atendendo WCAG 2.2 SC 1.4.3 AA.
- **Testes de regressão:** `project-form-page.test.tsx` — "suggestion tag color class is applied (BUG-02 regression)"
