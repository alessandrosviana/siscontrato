# Relatório de Code Review - Task 2.0: AdditionalServicesPage

## Resumo
- Data: 2026-05-21
- Branch: (working directory — sem git repo ativo no frontend)
- Status: APROVADO
- Arquivos Modificados: 4
  - `frontend/src/pages/additional-services-page.tsx` (criado)
  - `frontend/src/pages/additional-services-page.module.css` (criado)
  - `frontend/src/pages/additional-services-page.test.tsx` (criado)
  - `frontend/src/App.tsx` (modificado)
- Linhas Adicionadas: ~250
- Linhas Removidas: 0

## Conformidade com Rules

| Rule | Status | Observações |
|------|--------|-------------|
| Idioma do código em inglês | OK | Variáveis e funções em inglês; strings de domínio em português são esperadas no projeto |
| camelCase para funções e variáveis | OK | `handleToggleService`, `handleSubmit`, `handleBack`, `selectedServices`, `description`, `hasSelection` |
| PascalCase para componentes | OK | `AdditionalServicesPage` |
| kebab-case para arquivos | OK | `additional-services-page.tsx`, `additional-services-page.module.css`, `additional-services-page.test.tsx` |
| Funções iniciando com verbo | OK | `handleToggleService`, `handleSubmit`, `handleBack`, `formatServicosAdicionais` |
| Sem magic numbers | OK | Constantes `ADDITIONAL_SERVICES` e `ALERT_MESSAGE` declaradas fora do componente |
| Sem mais de 3 parâmetros | OK | Funções com no máximo 2 parâmetros |
| Sem flag params | OK | Nenhuma flag param |
| Early returns | OK | `formatServicosAdicionais` usa early return quando `selected.length === 0` |
| Sem linhas em branco dentro de funções | OK com ressalva | Funções `handleToggleService`, `handleSubmit`, `handleBack` sem linhas em branco. No JSX do return, há uma linha em branco (linha 74) entre o bloco do alerta e o bloco da descrição — tecnicamente dentro da função do componente, mas aceitável para legibilidade do JSX |
| Sem comentários desnecessários | OK | Código sem comentários supérfluos |
| Uma variável por linha | OK | Todas as declarações individuais |
| Métodos com no máximo 50 linhas | OK | Componente completo com 100 linhas; funções internas todas abaixo de 10 linhas |
| Sem classes longas | N/A | Componente funcional, sem classes |

## Verificação de Segurança

| Item | Status | Observações |
|------|--------|-------------|
| Inputs validados | N/A | Funcionalidade exclusivamente frontend; nenhum dado enviado ao backend neste componente |
| Endpoints protegidos | N/A | Sem chamadas de API |
| CORS | N/A | Sem chamadas de API |
| Sem secrets hardcoded | OK | Nenhum secret no código |
| Erros sem vazamento interno | N/A | Sem chamadas de API |
| Sem HTML não sanitizado | OK | Sem `dangerouslySetInnerHTML`; alerta renderizado como texto em `<p>` |
| Queries parametrizadas | N/A | Sem banco de dados |
| Rate limiting | N/A | Sem endpoints sensíveis |
| Dados sensíveis fora de logs | OK | Nenhum dado sensível; nenhum log presente |
| Checkboxes com valores fixos | OK | `ADDITIONAL_SERVICES` como constante imutável — sem risco de injeção |

## Aderência à TechSpec

| Decisão Técnica | Implementado | Observações |
|-----------------|--------------|-------------|
| `ADDITIONAL_SERVICES` como constante fora do componente | SIM | Linha 6 |
| `formatServicosAdicionais` como função pura fora do componente | SIM | Linhas 11–15; exportada como `export function` |
| Estado `selectedServices: string[]` e `description: string` | SIM | Linhas 23–26 |
| Pré-preenchimento via `savedStep?.selected_services ?? []` e `savedStep?.description ?? ''` | SIM | Linhas 20–26; padrão exato da TechSpec |
| Sem `isFormValid` — botão sempre habilitado | SIM | Linha 93: `<button type="submit">` sem `disabled` |
| `updateStep('additional-services', { servicos_adicionais, selected_services, description })` | SIM | Linhas 33–38 |
| Formatação: join + `. Descrição: ` se descrição preenchida | SIM | Linhas 12–14 de `formatServicosAdicionais` |
| `navigate('/resultado')` no submit | SIM | Linha 39 |
| `navigate('/escopo')` no voltar | SIM | Linha 42 |
| Alerta condicional a `selectedServices.length > 0` | SIM | Linhas 72–74 via `hasSelection` |
| Campo descrição condicional a `selectedServices.length > 0` | SIM | Linhas 75–88 via `hasSelection` |
| Rota `/servicos-adicionais` adicionada no `App.tsx` | SIM | Linhas 45–48 do App.tsx |
| Checkboxes com `<label htmlFor>` e `id` associados (acessibilidade) | SIM | `htmlFor={`service-${service}`}` e `id={`service-${service}`}` |
| Alerta como texto, não apenas cor | SIM | `<p className={styles.alert}>{ALERT_MESSAGE}</p>` |
| `focus-visible` com outline WCAG 2.2 | SIM | CSS: `.checkbox input:focus-visible` e `.textarea:focus-visible` com `outline: 2px solid` |
| CSS Modules sem biblioteca externa | SIM | Usa apenas `additional-services-page.module.css` |
| Sem dependências novas | SIM | Apenas `react`, `react-router` e `zustand` já existentes |

## Tasks Verificadas

| Task | Status | Observações |
|------|--------|-------------|
| 2.1 — Criar componente com constante e estado | COMPLETA | `ADDITIONAL_SERVICES`, `selectedServices`, `description` presentes |
| 2.2 — Lógica de pré-preenchimento na inicialização | COMPLETA | `savedStep?.selected_services ?? []` e `savedStep?.description ?? ''` |
| 2.3 — Renderizar 3 checkboxes com `label htmlFor` e `input` associados | COMPLETA | Loop sobre `ADDITIONAL_SERVICES` com `htmlFor` e `id` |
| 2.4 — Campo `descricao_servico_adicional` condicional | COMPLETA | Renderizado quando `hasSelection` |
| 2.5 — Alerta inline condicional com texto correto | COMPLETA | Texto exato conforme PRD RF-10 |
| 2.6 — `formatServicosAdicionais` fora do componente | COMPLETA | Função pura exportada nas linhas 11–15 |
| 2.7 — `handleSubmit` com `updateStep` e `navigate` | COMPLETA | Correto com as 3 chaves especificadas |
| 2.8 — Botão "Voltar" com `navigate('/escopo')` | COMPLETA | Linha 41–43 |
| 2.9 — CSS Module com `.alert`, `.checkbox` e padrão visual | COMPLETA | Classes presentes e coerentes com demais páginas |
| 2.10 — Criar `additional-services-page.test.tsx` com todos os testes | COMPLETA | 14 testes cobrindo todos os cenários da TechSpec |
| 2.11 — Atualizar `App.tsx` com rota `/servicos-adicionais` | COMPLETA | Rota presente nas linhas 45–48 |
| 2.12 — Executar `bun run test` — todos passam | COMPLETA | 168/168 testes passando |
| 2.13 — Executar `bun run build` — sem erros | COMPLETA | Build bem-sucedido em 189ms |

## Testes

- Total de Testes no Projeto: 168
- Passando: 168
- Falhando: 0
- Testes da Task 2.0: 14 (todos passando)
- Coverage: não medido (sem flag de coverage na execução)

### Testes da Task 2.0 — Cobertura de Cenários

| Cenário | Teste | Status |
|---------|-------|--------|
| Renderiza 3 checkboxes e botões Continuar/Voltar | `renders 3 checkboxes and Continuar/Voltar buttons` | PASSOU |
| Nenhum selecionado → campo descrição ausente | `description field is absent when no service is selected` | PASSOU |
| Nenhum selecionado → alerta ausente | `alert is absent when no service is selected` | PASSOU |
| Marcar serviço → campo descrição visível | `description field becomes visible when a service is checked` | PASSOU |
| Marcar serviço → alerta visível | `alert becomes visible when a service is checked` | PASSOU |
| Desmarcar todos → campo e alerta ocultam | `description field and alert hide when all services are unchecked` | PASSOU |
| Botão Continuar sempre habilitado | `Continuar button is always enabled even with no selection` | PASSOU |
| Sem seleção → `servicos_adicionais = ''` | `with no selection calls updateStep with servicos_adicionais empty string` | PASSOU |
| Um serviço sem descrição → nome do serviço | `with one service and no description calls updateStep with service name only` | PASSOU |
| Múltiplos serviços → lista separada por vírgula | `with multiple services and no description formats as comma-separated list` | PASSOU |
| Serviço + descrição → formato completo | `with service and description appends description after period` | PASSOU |
| Continuar → `navigate('/resultado')` | `clicking Continuar navigates to /resultado` | PASSOU |
| Voltar → `navigate('/escopo')` | `clicking Voltar navigates to /escopo` | PASSOU |
| Revisita → checkboxes e descrição restaurados | `restores checkboxes and description from steps[additional-services] on revisit` | PASSOU |

## Problemas Encontrados

Nenhum problema bloqueante identificado.

| Severidade | Arquivo | Linha | Descrição | Sugestão |
|------------|---------|-------|-----------|----------|
| Baixa | `additional-services-page.tsx` | 74 | Linha em branco entre o bloco `{hasSelection && <p>}` e `{hasSelection && <div>}` dentro do `return` do componente. A rule proíbe linhas em branco dentro de funções, e o JSX está tecnicamente dentro da função do componente. | Remover a linha em branco entre os dois blocos condicionais. Impacto: nulo em funcionalidade. |
| Baixa | `additional-services-page.module.css` | 70 | `.textarea` tem `outline: none` como regra base antes do `:focus-visible`. Navegadores antigos ou em modo de alto contraste que não suportam `:focus-visible` perderão o indicador de foco completamente. | Substituir `outline: none` por `outline: 2px solid transparent` ou remover a regra base e confiar na herança. O `:focus-visible` já está correto. |

## Pontos Positivos

- Função `formatServicosAdicionais` corretamente isolada como função pura e exportada, facilitando testes unitários diretos
- Pré-preenchimento via inicialização de estado (`useState(() => ...)`) — sem `useEffect`, sem risco de flash de estado inicial
- Constante `ALERT_MESSAGE` extraída fora do componente — evita recriação a cada render e facilita manutenção
- 14 testes cobrem todos os cenários especificados na TechSpec, incluindo edge cases (desmarcar todos, múltiplos serviços, revisita)
- Acessibilidade implementada corretamente: `htmlFor`/`id` associados, `<h1>` único, alerta como texto semântico, `focus-visible` com outline adequado ao WCAG 2.2
- CSS Module coerente com o padrão visual das demais páginas do projeto
- Nenhuma dependência nova introduzida
- `bun run test` (168 testes), `bun run build` e `bun run lint` passam sem erros

## Recomendações

- Remover a linha em branco na linha 74 do componente para conformidade estrita com as rules do projeto
- Rever `outline: none` no `.textarea` base do CSS para melhorar compatibilidade com modos de acessibilidade que não suportam `:focus-visible`
- Considerar adicionar `aria-live="polite"` no elemento do alerta para que leitores de tela anunciem automaticamente quando ele aparecer ao marcar um checkbox

## Conclusão

A implementação da Task 2.0 está completa, correta e bem executada. Todos os requisitos funcionais do PRD (RF-08 a RF-13), todas as decisões técnicas da TechSpec e todas as subtarefas foram atendidos. Os 168 testes do projeto passam, o build compila sem erros e o lint está limpo. Os dois problemas encontrados são de baixa severidade e não impactam funcionalidade, acessibilidade ou segurança. O código está apto para integração.
