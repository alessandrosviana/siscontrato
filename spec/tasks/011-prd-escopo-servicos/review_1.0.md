# Relatório de Code Review - ScopeFormPage (Task 1.0 — Feature 011)
<!-- Ressalva corrigida: showNumeroRevisoes movido para useState(() => ...) -->

## Resumo
- Data: 2026-05-21
- Branch: 011-prd-escopo-servicos
- Status: APROVADO COM RESSALVAS
- Arquivos Modificados: 3 (App.tsx, project-form-page.tsx, project-form-page.test.tsx)
- Arquivos Novos: 3 (scope-form-page.tsx, scope-form-page.module.css, scope-form-page.test.tsx)
- Linhas Adicionadas: ~320
- Linhas Removidas: 2

## Conformidade com Rules

| Rule | Status | Observações |
|------|--------|-------------|
| Código em inglês (variáveis, funções, comentários) | OK | Todas as variáveis, funções e interfaces em inglês |
| camelCase para funções e variáveis | OK | `handleChange`, `handleSubmit`, `handleBack`, `showNumeroRevisoes`, `savedScope`, `savedPackage` |
| PascalCase para componentes e interfaces | OK | `ScopeFormPage`, `ScopeFields` |
| kebab-case para arquivos | OK | `scope-form-page.tsx`, `scope-form-page.module.css`, `scope-form-page.test.tsx` |
| Nomes claros e sem abreviações excessivas | OK | Todos os nomes são descritivos |
| Constantes para magic numbers | OK | Sem magic numbers presentes |
| Funções devem começar com verbo | OK | `handleChange`, `handleSubmit`, `handleBack`, `isFormValid` |
| Máximo 3 parâmetros por função | OK | Máximo 2 parâmetros nas funções |
| Sem efeitos colaterais em consultas | OK | `isFormValid` é função pura sem side effects |
| Aninhamento máximo de 2 if/else | OK | Todos os condicionais usam early return |
| Sem flag params | OK | `showNumeroRevisoes` é parâmetro de dado, não flag de comportamento |
| Sem linhas em branco dentro de funções | OK | Todos os blocos de código sem linhas em branco internas |
| Declarar variáveis próximas ao uso | OK | Variáveis de estado declaradas no topo do componente |
| Uma variável por linha | OK | Sem declarações múltiplas |
| Comentários apenas quando necessário | OK | Sem comentários desnecessários |

## Verificação de Segurança

| Item | Status | Observações |
|------|--------|-------------|
| Inputs validados | N/A | Funcionalidade exclusivamente frontend sem envio direto de dados sensíveis |
| Endpoints autenticados | N/A | Sem chamadas de API nesta task |
| CORS configurado | N/A | Frontend sem configuração de CORS |
| Sem secrets hardcoded | OK | Nenhum secret ou API key no código |
| Erros não vazam detalhes internos | N/A | Sem tratamento de erros de API |
| Sem HTML não sanitizado | OK | Sem uso de `dangerouslySetInnerHTML` |
| Queries parametrizadas | N/A | Sem acesso a banco de dados |
| Rate limiting | N/A | Sem endpoints sensíveis nesta task |
| Headers de segurança | N/A | Backend não alterado |
| Dados sensíveis fora dos logs | OK | Sem logging de dados do formulário |

## Aderência à TechSpec

| Decisão Técnica | Implementado | Observações |
|-----------------|--------------|-------------|
| `isFormValid` como função pura fora do componente | SIM | Implementado corretamente nas linhas 11-18 |
| `suggestedFields: Set<string>` com inicialização lazy via `useState(() => ...)` | SIM | Linha 28, usando inicializador lazy |
| `showNumeroRevisoes` calculado uma única vez na montagem | PARCIAL | Calculado como `const` no corpo do componente sem `useState`; tecnicamente é recalculado a cada render. Comportamento funcional está correto pois `steps` não muda durante a visita, mas diverge da especificação de "calculado uma única vez na montagem" |
| `numero_revisoes` como string no store | SIM | Tipo `string` em `ScopeFields` e salvo como string via `updateStep` |
| Pré-fill de `steps['scope']` na revisita | SIM | Linhas 23 e 31-34 |
| Pré-fill de `steps['package']` na 1ª visita | SIM | Linhas 24 e 31-34 via `?? savedPackage?.escopo_servicos` |
| Etiqueta "(sugestão do pacote)" apenas na 1ª visita | SIM | Controlado por `suggestedFields.has(...)` |
| `navigate('/servicos-adicionais')` no submit | SIM | Linha 44 |
| `navigate('/projeto')` no Voltar | SIM | Linha 47 |
| `<label htmlFor>` em todos os campos | SIM | `htmlFor="escopo_servicos"` e `htmlFor="numero_revisoes"` |
| `<h1>` único por página | SIM | Único `<h1>` na linha 51 |
| `focus-visible` com outline WCAG 2.2 | SIM | `.textarea:focus-visible` e `.input:focus-visible` com `outline: 2px solid` |
| CSS Module seguindo padrão das demais páginas | SIM | CSS idêntico ao `project-form-page.module.css` |
| `ProjectFormPage` → `navigate('/escopo')` | SIM | Linha 57 de `project-form-page.tsx` |
| Rota `/escopo` no `App.tsx` | SIM | Linhas 41-44 de `App.tsx` |
| `tipo_servico` obtido de `steps['project']?.tipo_servico ?? steps['package']?.tipo_servico` | SIM | Linhas 25-27 |

## Tasks Verificadas

| Task | Status | Observações |
|------|--------|-------------|
| 1.1 Criar scope-form-page.tsx com interface ScopeFields e estado fields/suggestedFields | COMPLETA | |
| 1.2 Lógica de pré-preenchimento: steps['scope'] vs steps['package'] | COMPLETA | |
| 1.3 Calcular showNumeroRevisoes uma única vez na montagem | PARCIAL | Calculado como `const` no corpo do componente, sem `useState`; veja ressalva 1 |
| 1.4 isFormValid como função pura fora do componente | COMPLETA | |
| 1.5 Renderizar textarea com etiqueta condicional | COMPLETA | |
| 1.6 Renderizar campo numero_revisoes condicional com inputMode="numeric" | COMPLETA | |
| 1.7 Botão Continuar com disabled e handleSubmit | COMPLETA | |
| 1.8 Botão Voltar com navigate('/projeto') | COMPLETA | |
| 1.9 Criar scope-form-page.module.css com .suggestionTag e focus-visible | COMPLETA | |
| 1.10 Criar scope-form-page.test.tsx com todos os testes exigidos | COMPLETA | 17 testes, todos passando |
| 1.11 Atualizar project-form-page.tsx: navigate('/escopo') | COMPLETA | |
| 1.12 Atualizar project-form-page.test.tsx: regressão navigate('/escopo') | COMPLETA | |
| 1.13 Atualizar App.tsx: rota /escopo | COMPLETA | |
| 1.14 bun run test passando | COMPLETA | 154 testes em 11 arquivos, todos passando |
| 1.15 bun run build passando | COMPLETA | Build sem erros TypeScript |

## Testes

- Total de Testes (arquivos da task): 17 (ScopeFormPage) + 1 regressão (ProjectFormPage) = 18
- Total de Testes (suite completa): 154
- Passando: 154
- Falhando: 0
- Coverage: não mensurado (bun run test sem --coverage)

### Cobertura de Cenários da Task

| Cenário Exigido | Teste Presente | Status |
|----------------|----------------|--------|
| Renderiza textarea e botões | `renders textarea escopo and Continuar/Voltar buttons` | PASS |
| numero_revisoes visível (tipo_servico=projeto) | `numero_revisoes visible when tipo_servico is projeto` | PASS |
| numero_revisoes oculto (reforma) | `numero_revisoes hidden when tipo_servico is reforma` | PASS |
| numero_revisoes oculto (reforma de interiores) | `numero_revisoes hidden when tipo_servico is reforma de interiores` | PASS |
| Escopo vazio → desabilitado | `empty escopo keeps continue button disabled` | PASS |
| numero_revisoes vazio → desabilitado | `empty numero_revisoes with tipo_servico projeto keeps continue button disabled` | PASS |
| numero_revisoes decimal → desabilitado | `decimal numero_revisoes (1.5) keeps continue button disabled` | PASS |
| numero_revisoes zero → desabilitado | `zero numero_revisoes keeps continue button disabled` | PASS |
| numero_revisoes negativo → desabilitado | `negative numero_revisoes keeps continue button disabled` | PASS |
| Campos válidos com numero_revisoes → habilitado | `all fields valid with numero_revisoes enables continue button` | PASS |
| Campos válidos sem numero_revisoes (reforma) → habilitado | `all fields valid without numero_revisoes (reforma) enables continue button` | PASS |
| Continuar → updateStep com dados corretos | `clicking Continuar with valid data calls updateStep with correct data` | PASS |
| Continuar → navigate('/servicos-adicionais') | `clicking Continuar with valid data navigates to /servicos-adicionais` | PASS |
| Voltar → navigate('/projeto') | `clicking Voltar navigates to /projeto` | PASS |
| Pré-fill de steps['scope'] na revisita | `pre-fills fields from steps[scope] on revisit` | PASS |
| Pré-fill de steps['package'] na 1ª visita | `pre-fills escopo_servicos and numero_revisoes from steps[package] on first visit` | PASS |
| Etiqueta visível na 1ª visita | `shows suggestion tag for both fields on first visit` | PASS |
| Etiqueta ausente na revisita | `does not show suggestion tag on revisit when steps[scope] exists` | PASS |
| Regressão ProjectFormPage → navigate('/escopo') | `clicking Continuar with valid data navigates to /escopo` | PASS |

## Problemas Encontrados

| Severidade | Arquivo | Linha | Descrição | Sugestão |
|------------|---------|-------|-----------|----------|
| Baixa | scope-form-page.tsx | 27 | `showNumeroRevisoes` é `const` no corpo do componente e recalculado a cada render. A TechSpec especifica explicitamente "calculado uma única vez na montagem" para evitar comportamento inconsistente em re-renders. O comportamento funcional está correto (steps não muda durante a visita), mas diverge da decisão arquitetural documentada. | Envolver em `useState(() => tipoServico === 'projeto')` para garantir cálculo único na montagem, conforme TechSpec seção "Arquitetura". |

## Pontos Positivos

- `isFormValid` implementada como função pura fora do componente, exatamente como especificado. Testável de forma isolada e sem acoplamento ao estado do componente.
- Inicialização lazy de `suggestedFields` com `useState(() => ...)` segue o padrão estabelecido na Feature 010.
- Lógica de validação de `numero_revisoes` robusta: verifica `isNaN`, `< 1` e `String(n) !== fields.numero_revisoes.trim()` para rejeitar decimais (ex: "1.5" → `parseInt` retorna 1, mas `String(1) !== "1.5"`).
- CSS Module idêntico ao padrão do projeto (`project-form-page.module.css`), mantendo consistência visual.
- Padrão `outline: none` + `:focus-visible` com `outline: 2px solid` aplicado corretamente, garantindo indicador de foco para navegação por teclado sem degradar a estética para usuários de mouse.
- Cobertura de testes completa: todos os 18 cenários exigidos pela task e TechSpec foram implementados e passam.
- Regressão em `project-form-page.test.tsx` atualizada corretamente.
- Sem dependências novas introduzidas.
- Build TypeScript e lint passando sem erros.
- `<label htmlFor>` em todos os campos e `<h1>` único garantindo conformidade de acessibilidade.

## Recomendações

1. **Ressalva técnica — showNumeroRevisoes**: Para total aderência à TechSpec, substituir:
   ```typescript
   const showNumeroRevisoes = tipoServico === 'projeto'
   ```
   por:
   ```typescript
   const [showNumeroRevisoes] = useState(() => tipoServico === 'projeto')
   ```
   Isso garante que o valor é calculado apenas na montagem do componente, conforme a decisão arquitetural documentada. O impacto prático é mínimo neste contexto (o store não muda durante a visita à página), mas a intenção da spec é tornar explícito que é um valor de montagem, não derivado a cada render.

## Conclusão

A implementação da Task 1.0 está completa e funcional. Todos os requisitos funcionais (RF-01 a RF-07) foram implementados corretamente. Os 154 testes da suite passam integralmente, o build TypeScript está limpo e o lint não aponta nenhum problema. O código segue os padrões do projeto (CSS Modules, React 19, Vitest, bun) e está alinhado à TechSpec em seus pontos principais.

A única ressalva encontrada é de baixa severidade: `showNumeroRevisoes` é recalculado a cada render por ser `const` no corpo do componente, enquanto a TechSpec especifica que deveria ser calculado uma única vez na montagem via `useState`. O comportamento funcional é equivalente no contexto atual, mas a divergência com a decisão arquitetural é registrada para ciência do time.

Status final: **APROVADO COM RESSALVAS**
