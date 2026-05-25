# Bugs — Feature 011: Escopo dos Serviços e Serviços Adicionais

## BUG-01

**ID:** BUG-01
**Severidade:** Média
**Status:** Aberto
**Componente:** `additional-services-page.tsx`
**Requisito relacionado:** RF-10 / WCAG 2.2 SC 4.1.3 (Status Messages)

**Descrição:**
O alerta "Serviços adicionais impactam o prazo e os honorários..." é renderizado como `<p className={styles.alert}>` sem `role="alert"` nem `aria-live`. Por ser uma mensagem dinâmica que aparece/desaparece conforme a seleção de checkboxes, leitores de tela não anunciarão automaticamente sua inserção no DOM, violando o critério WCAG 2.2 SC 4.1.3.

**Evidência:**
```tsx
// additional-services-page.tsx linha 73
{hasSelection && (
  <p className={styles.alert}>{ALERT_MESSAGE}</p>
)}
```

**Correção sugerida:**
```tsx
{hasSelection && (
  <p className={styles.alert} role="alert">{ALERT_MESSAGE}</p>
)}
```

- **Status:** Corrigido
- **Correção aplicada:** Adicionado `role="alert"` ao `<p>` do alerta inline.
- **Testes de regressão:** Coberto pelo teste existente "Ao marcar um serviço → alerta de revisão visível".

---

## BUG-02

**ID:** BUG-02
**Severidade:** Baixa
**Status:** Aberto
**Componente:** `additional-services-page.tsx`
**Requisito relacionado:** WCAG 2.2 SC 1.3.1 (Info and Relationships)

**Descrição:**
O grupo de checkboxes "Serviços Adicionais" utiliza `<span className={styles.label}>` como título do grupo em vez de `<fieldset>` + `<legend>`. Quando há um grupo de controles relacionados, a semântica correta é `<fieldset>`/`<legend>` para que tecnologias assistivas associem corretamente o nome do grupo a cada checkbox.

**Evidência:**
```tsx
// additional-services-page.tsx linhas 57-70
<div className={styles.fieldGroup}>
  <span className={styles.label}>Serviços Adicionais</span>
  <div className={styles.checkboxGroup}>
    {ADDITIONAL_SERVICES.map((service) => (
      <label key={service} htmlFor={`service-${service}`} className={styles.checkbox}>
        <input id={`service-${service}`} type="checkbox" ... />
        {service}
      </label>
    ))}
  </div>
</div>
```

**Correção sugerida:**
```tsx
<fieldset className={styles.fieldGroup}>
  <legend className={styles.label}>Serviços Adicionais</legend>
  <div className={styles.checkboxGroup}>
    {ADDITIONAL_SERVICES.map((service) => (
      <label key={service} htmlFor={`service-${service}`} className={styles.checkbox}>
        <input id={`service-${service}`} type="checkbox" ... />
        {service}
      </label>
    ))}
  </div>
</fieldset>
```

- **Status:** Corrigido
- **Correção aplicada:** `<div>/<span>` substituídos por `<fieldset>/<legend>` no grupo de checkboxes.
- **Testes de regressão:** Coberto pelos testes existentes de renderização e interação com checkboxes.
