# Relatório de Bugfix — Escopo dos Serviços e Serviços Adicionais (Feature 011)

## Resumo

- Total de Bugs: 2
- Bugs Corrigidos: 2
- Testes de Regressão Criados: 0 (cobertos pelos testes existentes)

## Detalhes por Bug

| ID | Severidade | Status | Correção | Testes |
|----|------------|--------|----------|--------|
| BUG-01 | Média | Corrigido | `role="alert"` adicionado ao `<p>` do alerta inline (WCAG 2.2 SC 4.1.3) | Testes existentes de visibilidade do alerta |
| BUG-02 | Baixa | Corrigido | `<div>/<span>` → `<fieldset>/<legend>` no grupo de checkboxes (WCAG 2.2 SC 1.3.1) | Testes existentes de renderização e interação |

## Arquivo Modificado

| Arquivo | Alteração |
|---------|-----------|
| `frontend/src/pages/additional-services-page.tsx` | `role="alert"` no alerta; `fieldset/legend` no grupo de checkboxes |

## Testes

- Testes unitários: TODOS PASSANDO (168/168)
- Build: SEM ERROS (192ms)
- Lint: SEM ERROS
