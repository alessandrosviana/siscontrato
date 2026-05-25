# Tarefa 1.0: OptionalClausesPage — Tela de Seleção de Cláusulas Opcionais

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- Nenhuma

## Estimativa

- **Tamanho**: G
- **Horas estimadas**: 4-8h

## Visão Geral

Criar a tela `/clausulas` que exibe as cláusulas opcionais buscadas da API (`GET /api/clausulas?obrigatoria=false`), permite ativar/desativar cada uma via toggle, expandir o texto via accordion, e adicionar cláusulas personalizadas com texto livre. As seleções são salvas no store ao clicar "Continuar".

<skills>
### Conformidade com Skills Padrões

- React + Vite + TypeScript: componente funcional com tipos explícitos
- Vitest + Testing Library: testes unitários com mock de `fetch` via `vi.stubGlobal`
- CSS Modules: estilos em arquivo `.module.css` próprio seguindo padrão do projeto
- bun: executar `bun run test` para validação
</skills>

<requirements>
- Adicionar `clausulas_personalizadas?: string[]` ao `ContratoPayload` em `frontend/src/types/contrato.ts`
- Interface `Clausula` com `slug`, `titulo`, `texto`, `categoria` definida no componente
- Interface `CustomClause` com `id: string` e `text: string` para cláusulas personalizadas
- `fetchState: 'loading' | 'error' | 'success'` gerenciado com `useState`
- Fetch `GET /api/clausulas?obrigatoria=false` no `useEffect` ao montar o componente
- Estado de loading com indicador visual; estado de erro com mensagem e botão "Tentar novamente"
- `activeSlugs: Set<string>` inicializado da revisita (`steps['optional-clauses']?.clausulas_opcionais`)
- `expandedSlugs: Set<string>` para controlar acordeons (múltiplos abertos simultaneamente)
- `customClauses: CustomClause[]` inicializado da revisita, com novos UUIDs gerados via `crypto.randomUUID()`
- Toggle de cláusula: criar novo `Set` com spread (imutável)
- Accordion: `aria-expanded`, `aria-controls`, `id` nas áreas de texto
- Toggles com `role="switch"` e `aria-checked`
- Botão "+ Adicionar cláusula personalizada": insere novo `{ id: crypto.randomUUID(), text: '' }`
- Remoção de personalizada por `id`; cada textarea com `<label htmlFor>` associado
- Submit: `updateStep('optional-clauses', { clausulas_opcionais: Array.from(activeSlugs), clausulas_personalizadas: customClauses.map(c => c.text.trim()).filter(Boolean) })`
- Botão "Continuar" desabilitado apenas durante `fetchState === 'loading'`; sempre habilitado após carregar
- Botão "Voltar" → `navigate('/honorarios')` sem apagar dados do store
- `<h1>` único na página; `focus-visible` com outline em todos os elementos interativos
</requirements>

## Subtarefas

- [ ] 1.1 Atualizar `frontend/src/types/contrato.ts`: adicionar `clausulas_personalizadas?: string[]` ao `ContratoPayload`
- [ ] 1.2 Criar `frontend/src/pages/optional-clauses-page.tsx` com interfaces `Clausula` e `CustomClause`, estados de fetch/toggles/accordion/personalizadas, lógica de submit e pré-preenchimento de revisita
- [ ] 1.3 Criar `frontend/src/pages/optional-clauses-page.module.css` seguindo padrão visual das demais páginas (container, title, form, fieldGroup, label, actions, backButton, continueButton, alert — com `focus-visible`)
- [ ] 1.4 Criar `frontend/src/pages/optional-clauses-page.test.tsx` com todos os cenários listados em "Testes da Tarefa"
- [ ] 1.5 Executar `bun run test` e garantir 100% de aprovação

## Detalhes de Implementação

Consultar `techspec.md` desta pasta — seções:
- **Interfaces Principais**: definição de `Clausula`, `CustomClause`, `FetchState`
- **Estado Interno do Componente**: inicialização de cada estado com revisita
- **Lógica de Fetch**: `useEffect` com tratamento de erro e retry
- **Lógica de Toggle e Accordion**: padrão imutável com `Set`
- **Lógica de Cláusulas Personalizadas**: adicionar, remover, editar
- **Lógica de Submit**: conversão de `Set` e filtro de textos vazios
- **Acessibilidade**: `role="switch"`, `aria-checked`, `aria-expanded`, `aria-controls`

## Critérios de Sucesso

- `optional-clauses-page.tsx` exporta `OptionalClausesPage`
- `contrato.ts` contém `clausulas_personalizadas?: string[]`
- Tela exibe indicador de carregamento enquanto busca a API
- Tela exibe mensagem de erro com botão de retry se a API falhar
- Após carregar, exibe lista de cláusulas com toggle e botão "Ver texto"
- Toggle ativa/desativa cláusulas; accordion expande/colapsa texto
- "+ Adicionar cláusula personalizada" insere textarea; botão de remoção funciona
- Submit salva slugs ativos e textos não-vazios; navigate('/resultado') chamado
- Todos os testes passando; `bun run build` sem erros; `bun run lint` sem erros

## Testes da Tarefa

- [ ] Indicador de carregamento visível inicialmente (antes do fetch resolver)
- [ ] Títulos das cláusulas renderizados após fetch bem-sucedido
- [ ] Mensagem de erro exibida quando fetch falha (HTTP 500 ou erro de rede)
- [ ] Botão "Tentar novamente" reexecuta o fetch
- [ ] Clicar no toggle de uma cláusula a ativa (aria-checked=true)
- [ ] Clicar novamente no toggle a desativa
- [ ] Clicar em "Ver texto" expande o accordion (aria-expanded=true)
- [ ] Clicar novamente colapsa o accordion
- [ ] "+ Adicionar cláusula personalizada" insere textarea vazio
- [ ] Clicar em remover elimina o textarea correspondente (outros intactos)
- [ ] Submit sem seleção: `updateStep` chamado com arrays vazios
- [ ] Submit com cláusula ativa: `updateStep` inclui slug correto
- [ ] Submit com personalizada preenchida: texto incluído em `clausulas_personalizadas`
- [ ] Submit com personalizada vazia: texto descartado (não incluído)
- [ ] Submit: `navigate('/resultado')` chamado
- [ ] Voltar: `navigate('/honorarios')` chamado
- [ ] Revisita — slugs: toggles restaurados a partir de `steps['optional-clauses'].clausulas_opcionais`
- [ ] Revisita — personalizadas: textareas restaurados a partir de `steps['optional-clauses'].clausulas_personalizadas`

## Arquivos relevantes

- `frontend/src/pages/optional-clauses-page.tsx` (criar)
- `frontend/src/pages/optional-clauses-page.module.css` (criar)
- `frontend/src/pages/optional-clauses-page.test.tsx` (criar)
- `frontend/src/types/contrato.ts` (modificar)
- `frontend/src/pages/fees-form-page.tsx` (referência de padrão de formulário)
- `frontend/src/components/download-pdf-button.tsx` (referência de padrão de fetch + loading/error)
- `frontend/vite.config.ts` (referência — proxy /api já configurado)
