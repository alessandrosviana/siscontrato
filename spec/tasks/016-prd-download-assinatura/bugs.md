# Bugs — Feature 016: Download do Contrato e Encaminhamento para Assinatura

## BUG-01 — Modal gov.br sem tecla Escape para fechar

**Severidade:** Média
**Status:** Corrigido
**Componente:** `frontend/src/pages/completion-page.tsx`

**Descrição:**
O modal "Como assinar via gov.br" não responde à tecla Escape para fechar. O WCAG 2.2 (critério 2.1.1 — Teclado) exige que todos os controles de interface sejam operáveis por teclado. Dialogs modais devem ser fecháveis via Escape conforme padrão WAI-ARIA Authoring Practices (APG) para o padrão Dialog Modal.

**Como reproduzir:**
1. Navegar para `/concluido` com `isFinalized = true`
2. Clicar em "Encaminhar para assinatura via gov.br"
3. Com o modal aberto, pressionar a tecla Escape
4. O modal não fecha

**Esperado:** Modal fecha ao pressionar Escape
**Obtido:** Modal permanece aberto

**Evidência:**
Ausência de handler `onKeyDown` ou `onKeyUp` no componente. Busca por `Escape` em `completion-page.tsx` retorna zero resultados.

- **Correção aplicada:** Adicionado handler `handleModalKeyDown` no `div[role="dialog"]` que detecta `key === 'Escape'` e chama `handleCloseModal()`
- **Testes de regressão:** cenário 10 em `completion-page.test.tsx` — pressionar Escape fecha o modal

---

## BUG-02 — Modal gov.br sem focus trap (aprisionamento de foco)

**Severidade:** Média
**Status:** Corrigido
**Componente:** `frontend/src/pages/completion-page.tsx`

**Descrição:**
O modal "Como assinar via gov.br" não implementa focus trap. Quando o modal está aberto, o usuário navegando por Tab pode sair do modal e interagir com elementos da página de fundo. O WCAG 2.2 (critério 2.1.2 — Sem Armadilha de Teclado) e o padrão WAI-ARIA APG para Dialog Modal exigem que o foco seja mantido dentro do modal enquanto ele estiver aberto.

**Como reproduzir:**
1. Navegar para `/concluido` com `isFinalized = true`
2. Clicar em "Encaminhar para assinatura via gov.br"
3. Com o modal aberto, pressionar Tab repetidamente
4. O foco sai do modal e alcança os botões de fundo (ex.: "Baixar contrato", "Gerar novo contrato")

**Esperado:** Tab circula apenas entre os elementos interativos dentro do modal (link e botão Fechar)
**Obtido:** Tab escapa do modal para elementos externos

**Evidência:**
O componente usa apenas `modalFirstFocusRef` para focar o primeiro elemento ao abrir, mas não implementa nenhum mecanismo de interceptação de Tab para limitar o foco ao contexto do modal.

- **Correção aplicada:** O mesmo handler `handleModalKeyDown` intercepta Tab e Shift+Tab — quando o foco está no último elemento e Tab é pressionado, move para o primeiro; quando está no primeiro e Shift+Tab é pressionado, move para o último
- **Testes de regressão:** cenários 11 e 12 em `completion-page.test.tsx` — Tab no último vai para primeiro, Shift+Tab no primeiro vai para último

---

## BUG-03 — Contraste insuficiente no link do modal gov.br (WCAG AA)

**Severidade:** Baixa
**Status:** Corrigido
**Componente:** `frontend/src/pages/completion-page.module.css`

**Descrição:**
O link "Acessar assinatura.iti.br" dentro do modal usa a cor `#1a73e8` sobre fundo branco `#ffffff`. O contraste calculado é aproximadamente 3.8:1, abaixo do mínimo de 4.5:1 exigido pelo WCAG 2.2 (critério 1.4.3 — Contraste Mínimo) para texto normal.

**Como reproduzir:**
1. Abrir o modal gov.br na página `/concluido`
2. Verificar o link "Acessar assinatura.iti.br" com ferramenta de contraste (ex.: WebAIM Contrast Checker)
3. Inserir foreground `#1a73e8` e background `#ffffff`

**Esperado:** Contraste >= 4.5:1
**Obtido:** Contraste ~3.8:1

**Evidência:**
`completion-page.module.css`, linha 133: `.modalLink { color: #1a73e8; }`. O elemento é renderizado sobre fundo branco (`.modalContent { background: #fff; }`).

**Correção sugerida:** Usar `#1558b0` (contraste ~5.5:1) ou `#0d47a1` em lugar de `#1a73e8`.

- **Correção aplicada:** Cor do link alterada de `#1a73e8` para `#1558b0` em `.modalLink` — contraste resultante ~5.5:1, aprovado no WCAG AA
- **Testes de regressão:** Verificação visual — sem teste unitário para cor CSS

---

## BUG-04 — buildPayload duplicado entre CompletionPage e ResultPage

**Severidade:** Baixa (qualidade de código)
**Status:** Corrigido
**Componente:** `frontend/src/pages/completion-page.tsx` e `frontend/src/pages/result-page.tsx`

**Descrição:**
A função `buildPayload` estava duplicada em `completion-page.tsx` (linha 8) e `result-page.tsx` (linha 20) com implementação idêntica. Viola o princípio DRY e aumenta o risco de divergência futura. A TechSpec menciona reutilização da mesma função, mas ela foi copiada em vez de extraída para um módulo compartilhado (ex.: `src/utils/build-payload.ts`).

**Impacto:** Risco de manutenção — uma alteração em `buildPayload` precisaria ser replicada nos dois arquivos manualmente.

**Evidência:**
- `completion-page.tsx` linhas 8-13
- `result-page.tsx` linhas 20-25

Implementações idênticas confirmadas por inspeção de código.

- **Correção aplicada:** Função extraída para `frontend/src/utils/build-payload.ts` e importada em ambas as páginas; implementações locais removidas
- **Testes de regressão:** `frontend/src/utils/build-payload.test.ts` com 3 cenários — merge de steps, steps vazio, e sobrescrita de campo com mesmo nome
