# Relatório de Bugfix — Formulário de Dados do Projeto (Feature 010)

## Resumo

- Total de Bugs: 2
- Bugs Corrigidos: 2
- Testes de Regressão Criados: 2

## Detalhes por Bug

| ID | Severidade | Status | Correção | Testes Criados |
|----|------------|--------|----------|----------------|
| BUG-01 | Baixa | Corrigido | Adicionado wrapper flex com `span.inputSuffix` exibindo "m²" ao lado do input de `area_projeto`; label atualizado para "Área do Projeto — opcional" | `shows m² suffix next to area_projeto input (BUG-01 regression)` |
| BUG-02 | Baixa | Corrigido | Cor `.suggestionTag` alterada de `#888` para `#767676` (contraste 4.54:1, atendendo WCAG 2.2 SC 1.4.3 AA) | `suggestion tag color class is applied (BUG-02 regression)` |

## Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `frontend/src/pages/project-form-page.tsx` | Wrapper `.inputWrapper` + `.inputSuffix` para campo `area_projeto`; label sem "(m²)" |
| `frontend/src/pages/project-form-page.module.css` | Cor `.suggestionTag`: `#888` → `#767676`; classes `.inputWrapper` e `.inputSuffix` adicionadas; `.input` com `flex: 1` |
| `frontend/src/pages/project-form-page.test.tsx` | 2 testes de regressão adicionados |

## Testes

- Testes unitários: TODOS PASSANDO (136/136)
- Testes de integração: NÃO APLICÁVEL
- Testes E2E: NÃO APLICÁVEL
- Lint: SEM ERROS
- Tipagem: SEM ERROS
- Build: SEM ERROS (96.17 kB gzipped)
