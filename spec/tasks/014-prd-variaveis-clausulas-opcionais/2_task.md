# Tarefa 2.0: Frontend — Inputs de Variáveis na OptionalClausesPage

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 1.0

## Estimativa

- **Tamanho**: M
- **Horas estimadas**: 2-4h

## Visão Geral

Estender `OptionalClausesPage` para exibir campos de preenchimento das variáveis de template dentro do accordion de cada cláusula ativa. Adiciona dois novos estados (`clausulaVars`, `showVarsWarning`), renderiza inputs com labels amigáveis, exibe aviso não-bloqueante ao tentar continuar com campos em branco, e inclui os valores no payload via `updateStep`. Inclui 11 novos cenários de teste.

<skills>
### Conformidade com Skills Padrões

- React + Vite + TypeScript: estado, JSX, tipos explícitos
- Vitest + Testing Library: 11 novos cenários no arquivo existente
- CSS Modules: novas classes no `.module.css` existente
- bun: executar `bun run test` para validação
</skills>

<requirements>
- Interface local `Clausula` atualizada com `variaveis: ClausulaVariavel[]` e interface `ClausulaVariavel { slug: string; label: string }` definida no componente
- Estado `clausulaVars: Record<string, string>` inicializado de `steps['optional-clauses']?.variaveis_opcionais ?? {}`
- Estado `showVarsWarning: boolean` inicializado como `false`
- Dentro do accordion aberto (`expandedSlugs.has(slug)`), quando `clausula.variaveis.length > 0`: renderizar um `<input type="text">` por variável com `<label htmlFor>` usando `label` amigável do backend
- `handleVarChange(slug, value)`: atualiza `clausulaVars` e redefine `showVarsWarning` para `false`
- `hasMissingVars()`: retorna `true` se qualquer cláusula ativa tiver variável com valor em branco
- `handleSubmit()`: chama `hasMissingVars()` → se `true`, `setShowVarsWarning(true)`; **não bloqueia** a navegação; filtra `activeVars` (somente cláusulas ativas com valores não-vazios); passa `variaveis_opcionais: activeVars` no `updateStep`
- Aviso `role="alert"` com `className={styles.varsWarning}` renderizado acima dos botões de ação somente quando `showVarsWarning === true`
- Novos estilos em `optional-clauses-page.module.css`: `.varsGroup`, `.varLabel`, `.varInput`, `.varsWarning`
- `focus-visible` com outline em todos os novos inputs
</requirements>

## Subtarefas

- [ ] 2.1 Atualizar `frontend/src/pages/optional-clauses-page.tsx`: interface local `Clausula` + `ClausulaVariavel`, estados `clausulaVars` e `showVarsWarning`, funções `handleVarChange` e `hasMissingVars`, JSX de inputs no accordion, aviso, submit atualizado
- [ ] 2.2 Atualizar `frontend/src/pages/optional-clauses-page.module.css`: classes `.varsGroup`, `.varLabel`, `.varInput`, `.varsWarning` com `focus-visible`
- [ ] 2.3 Atualizar `frontend/src/pages/optional-clauses-page.test.tsx`: adicionar os 11 novos cenários (listados em "Testes da Tarefa")
- [ ] 2.4 Executar `bun run test` e garantir 100% de aprovação

## Detalhes de Implementação

Consultar `techspec.md` desta pasta — seções **Estado Interno do Componente**, **Lógica de Variáveis** e **Lógica de Submit (atualizada)**.

O mock de fetch nos testes deve retornar cláusulas com `variaveis` populados:
```typescript
const mockClausulas = [
  {
    slug: 'clausula-com-vars',
    titulo: 'Cláusula Com Variáveis',
    texto: 'Texto com {{var_a}} e {{var_b}}.',
    categoria: 'teste',
    variaveis: [
      { slug: 'var_a', label: 'Variável A' },
      { slug: 'var_b', label: 'Variável B' },
    ],
  },
  {
    slug: 'clausula-sem-vars',
    titulo: 'Cláusula Sem Variáveis',
    texto: 'Texto fixo.',
    categoria: 'teste',
    variaveis: [],
  },
]
```

## Critérios de Sucesso

- Abrir accordion de cláusula com variáveis exibe inputs com labels amigáveis
- Digitar em um input atualiza o valor em `clausulaVars`
- Desativar toggle não apaga os valores preenchidos
- Clicar "Continuar" com cláusula ativa e campo em branco: aviso `role="alert"` visível; navegação ocorre normalmente
- Clicar "Continuar" com todos os campos preenchidos: sem aviso; `variaveis_opcionais` no `updateStep` contém apenas variáveis de cláusulas ativas
- Variáveis de cláusulas inativas **não** aparecem no `updateStep`
- Revisitar a tela restaura os valores anteriores nos inputs
- 11 novos testes passando; suite completa sem regressões
- `bun run build` e `bun run lint` sem erros

## Testes da Tarefa

- [ ] Inputs de variáveis renderizados dentro do accordion quando cláusula tem `variaveis.length > 0`
- [ ] Labels com texto amigável (`variaveis[i].label`) associados via `htmlFor`
- [ ] Inputs **não** renderizados quando accordion está fechado
- [ ] Cláusula sem variáveis não exibe nenhum input extra
- [ ] Digitar no input atualiza o valor (verificar pelo valor do input)
- [ ] `showVarsWarning` falso inicialmente — aviso não visível
- [ ] Submit com cláusula ativa e campo em branco: `role="alert"` visível na tela
- [ ] Submit com todos os campos preenchidos: aviso **não** visível
- [ ] Editar qualquer campo após aviso exibido faz o aviso desaparecer
- [ ] Submit: `updateStep` inclui apenas variáveis de cláusulas **ativas** em `variaveis_opcionais`
- [ ] Revisita: `clausulaVars` restaurado de `steps['optional-clauses'].variaveis_opcionais`

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/pages/optional-clauses-page.tsx` (modificar)
- `frontend/src/pages/optional-clauses-page.module.css` (modificar)
- `frontend/src/pages/optional-clauses-page.test.tsx` (modificar)
- `backend/src/data/clausulas.json` (referência — dados com `variaveis` já populados pela Task 1.0)
