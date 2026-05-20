# Relatório de Code Review - Task 2.0: ClientFormPage (Feature 009)

## Resumo
- Data: 2026-05-20
- Branch: (repositório sem git — análise baseada nos arquivos do diretório de trabalho)
- Status: APROVADO COM RESSALVAS
- Arquivos Modificados: 4
  - `frontend/src/pages/client-form-page.tsx` (criado)
  - `frontend/src/pages/client-form-page.module.css` (criado)
  - `frontend/src/pages/client-form-page.test.tsx` (criado)
  - `frontend/src/App.tsx` (modificado)
- Linhas Adicionadas: ~425 (estimado)
- Linhas Removidas: ~0

---

## Conformidade com Rules

| Rule | Status | Observações |
|------|--------|-------------|
| Código-fonte em inglês | OK | Variáveis, funções, interfaces e tipos todos em inglês |
| camelCase para funções/variáveis | OK | `clientTipo`, `handleTypeChange`, `handleChange`, `handleSubmit`, `handleBack`, `isFormValid` — todos corretos |
| PascalCase para componente | OK | `ClientFormPage` correto |
| kebab-case para arquivos | OK | `client-form-page.tsx`, `client-form-page.module.css`, `client-form-page.test.tsx` |
| Nomenclatura clara (sem abreviações excessivas) | OK | Nomes descritivos e dentro de 30 caracteres |
| Constantes para magic numbers | OK | Não há magic numbers; os literais de rota (`'/formulario'`, `'/resultado'`) são strings de rota, aceitáveis inline |
| Funções começam com verbo | OK | `handleTypeChange`, `handleChange`, `handleSubmit`, `handleBack`, `applyCpfMask`, `applyCnpjMask`, `applyPhoneMask`, `isFormValid` |
| Máx. 3 parâmetros por função | OK | Todas as funções respeitam o limite |
| Sem efeitos colaterais em consultas | OK | `isFormValid` é função pura sem efeitos colaterais |
| Sem aninhamento de mais de 2 if/else | OK | `isFormValid` usa early returns; funções de máscara usam if/else linear sem aninhamento |
| Sem flag params | OK | Nenhuma função usa boolean flag para chavear comportamento |
| Métodos com até 50 linhas | OK | Nenhuma função excede 50 linhas |
| Sem linhas em branco dentro de funções | NOK (Baixa) | `client-form-page.tsx` linha 72: a função `handleTypeChange` inicia imediatamente após o `useState` sem linha em branco, mas as funções `handleTypeChange`, `handleChange`, `handleSubmit`, `handleBack` são declaradas dentro de `ClientFormPage` sem linhas em branco entre os corpos — conforme a regra. Porém, na linha 63-71 o bloco de inicialização de `useState` contém o objeto literal multi-linha imediatamente encadeado, sem violação. Nenhuma violação efetiva identificada. |
| Sem comentários desnecessários | OK | Código sem comentários; autoexplicativo |
| Uma variável por linha | OK | Declarações individuais respeitadas |
| Variáveis declaradas próximas ao uso | OK | Padrão seguido |

---

## Verificação de Segurança

| Item | Status | Observações |
|------|--------|-------------|
| Inputs validados | OK | CPF/CNPJ validados com módulo 11 via `validateCpf`/`validateCnpj`; email via regex; telefone via contagem de dígitos |
| Endpoints protegidos | N/A | Funcionalidade exclusivamente frontend sem chamadas de backend |
| CORS configurado | N/A | Sem backend nesta feature |
| Sem secrets hardcoded | OK | Nenhum secret ou API key no código |
| Erros sem vazamento de stack traces | N/A | Sem tratamento de erros de rede |
| Sem renderização HTML não sanitizado | OK | Sem uso de `dangerouslySetInnerHTML`; todo conteúdo via JSX seguro |
| Queries parametrizadas | N/A | Sem queries SQL/NoSQL |
| Rate limiting | N/A | Sem endpoints sensíveis |
| Headers de segurança | N/A | Sem backend nesta feature |
| Dados sensíveis fora de logs | OK | CPF/CNPJ não são logados; sem `console.log` com dados sensíveis |

---

## Aderência à TechSpec

| Decisão Técnica | Implementado | Observações |
|-----------------|--------------|-------------|
| Componente funcional `ClientFormPage` em `client-form-page.tsx` | SIM | Implementado conforme especificado |
| `type ClientTipo = 'PF' \| 'PJ'` | SIM | Declarado no topo do arquivo |
| `interface ClientFields` com 7 campos | SIM | Todos os campos presentes: `cliente_nome`, `cliente_documento`, `cliente_endereco`, `cliente_email`, `cliente_telefone`, `razao_social`, `nome_representante_legal` |
| `clientTipo` como estado separado de `fields` | SIM | `useState<ClientTipo>` independente |
| `isFormValid(fields, clientTipo): boolean` — função pura | SIM | Função pura sem efeitos colaterais, fora do componente |
| `disabled={!isFormValid(fields, clientTipo)}` no botão | SIM | Implementado corretamente |
| `handleTypeChange` zera `cliente_documento`, `razao_social`, `nome_representante_legal` | SIM | Zera os 3 campos conforme especificado |
| `updateStep('client', {...})` com 8 campos + `cliente_tipo` | SIM | Todos os 9 campos passados corretamente |
| `navigate('/resultado')` ao confirmar | SIM | Implementado |
| `navigate('/formulario')` ao voltar | SIM | Implementado |
| Pré-preenchimento de `steps['client']` incluindo `clientTipo` | SIM | `savedStep?.cliente_tipo ?? 'PF'` inicializa o estado |
| Máscaras inline sem biblioteca externa | SIM | `applyCpfMask`, `applyCnpjMask`, `applyPhoneMask` inline |
| CSS Modules com `.radioGroup` | SIM | Classe `.radioGroup` implementada com `fieldset` sem borda e `gap` |
| `fieldset + legend` para rádios | SIM | `<fieldset className={styles.radioGroup}><legend>Tipo de Pessoa</legend>` |
| `<label htmlFor>` em todos os campos | SIM | Todos os 5 campos base e 2 condicionais têm `htmlFor` correto |
| `<h1>` único na página | SIM | Um único `<h1>` com "Dados do Cliente" |
| `.input:focus` com `outline: 2px solid` | SIM | `outline: 2px solid #1a1a2e` com `outline-offset: 2px` |
| `.continueButton:disabled` com `opacity: 0.5; cursor: not-allowed` | SIM | Implementado |
| Rota `/contratante` em `App.tsx` | SIM | Adicionada com `element: <ClientFormPage />` |
| `ContratoPayload` com 5 novos campos opcionais | SIM | `cliente_tipo?`, `cliente_email?`, `cliente_telefone?`, `razao_social?`, `nome_representante_legal?` adicionados |
| Validação silenciosa (sem mensagens de erro) | SIM | Sem estados de erro; sem `aria-invalid` nos campos — válido segundo a TechSpec |

---

## Tasks Verificadas

| Task | Status | Observações |
|------|--------|-------------|
| 2.1 Criar `client-form-page.tsx` com estados `clientTipo` e `fields` | COMPLETA | Estados corretos com tipagem adequada |
| 2.2 Pré-preenchimento de `steps['client']` na montagem | COMPLETA | Inicialização via `useState` com dados do store |
| 2.3 Funções de máscara inline: `applyCpfMask`, `applyCnpjMask`, `applyPhoneMask` | COMPLETA | Todas implementadas sem biblioteca |
| 2.4 `handleTypeChange` com zeragem dos 3 campos | COMPLETA | Implementado corretamente |
| 2.5 `isFormValid(fields, tipo): boolean` — função pura | COMPLETA | Fora do componente, sem efeitos colaterais |
| 2.6 `handleSubmit` com `updateStep` + `navigate` | COMPLETA | Implementado; verifica `isFormValid` via `disabled` no botão (submit não é chamado se desabilitado) |
| 2.7 Seletor de tipo com `fieldset + legend` | COMPLETA | Renderizado corretamente |
| 2.8 Campos base com `<label>` + `<input>` | COMPLETA | 5 campos base com acessibilidade correta |
| 2.9 Campos condicionais PJ com renderização condicional | COMPLETA | `{clientTipo === 'PJ' && (...)}` |
| 2.10 Botão "Voltar" com `navigate('/formulario')` | COMPLETA | Implementado |
| 2.11 CSS Module com `.radioGroup` | COMPLETA | Criado seguindo padrão do arquiteto |
| 2.12 Testes unitários `client-form-page.test.tsx` | COMPLETA | 14 testes implementados e passando |
| 2.13 Rota `/contratante` em `App.tsx` | COMPLETA | Adicionada corretamente |
| 2.14 `bun run test` — todos os testes passam | COMPLETA | 119 testes passando (14 novos + 105 existentes) |
| 2.15 `bun run build` — sem erros TypeScript | COMPLETA | Build concluído com sucesso |

---

## Testes

- Total de Testes (suite completa): 119
- Testes novos (ClientFormPage): 14
- Passando: 119
- Falhando: 0
- Coverage: não medido (projeto não configurou threshold de cobertura)

### Avaliação da Qualidade dos Testes

Os 14 testes cobrem todos os cenários exigidos pela TechSpec:

| Cenário | Cobertura |
|---------|-----------|
| Renderização inicial (PF padrão) + campos base | Coberto |
| Selecionar PJ exibe campos condicionais | Coberto |
| Selecionar PF oculta campos condicionais | Coberto |
| Trocar PJ → PF limpa campos condicionais | Coberto |
| Formulário vazio → botão desabilitado | Coberto |
| CPF inválido → botão desabilitado | Coberto |
| CNPJ inválido (PJ) → botão desabilitado | Coberto |
| Campos PF válidos → botão habilitado | Coberto |
| Campos PJ válidos → botão habilitado | Coberto |
| Submit PF → `updateStep` com dados corretos + `navigate('/resultado')` | Coberto |
| Botão Voltar → `navigate('/formulario')` | Coberto |
| Pré-preenchimento incluindo `clientTipo` | Coberto |
| Máscara CPF ao digitar | Coberto |
| Troca de tipo limpa `cliente_documento` | Coberto |

Edge cases e cenários negativos presentes: CPF inválido (`111.111.111-11`), CNPJ inválido (`11.111.111/1111-11`), formulário vazio. Os testes verificam comportamento real, não apenas execução sem erro.

**Observação:** O teste de CNPJ inválido usa o valor `11.111.111/1111-11` que, após remover não-dígitos, resulta em `11111111111111` — presente em `REPEATED_SEQUENCES_CNPJ`. O `validateCnpj` retorna `false`, confirmando que o botão fica desabilitado. Comportamento correto.

---

## Problemas Encontrados

| Severidade | Arquivo | Linha | Descrição | Sugestão |
|------------|---------|-------|-----------|----------|
| Baixa | `client-form-page.tsx` | 119-138 | Os rádios dentro do `fieldset` usam `<label>` sem `htmlFor` explícito — o texto está dentro do `<label>` que envolve o `<input>`, o que é correto semanticamente, mas difere do padrão de `htmlFor` adotado nos demais campos. O `getByRole('radio', { name: /pessoa física/i })` nos testes funciona porque o texto está dentro do `<label>`, não porque haja `htmlFor`. | Padrão consistente: manter o modelo `<label><input ... /> texto</label>` para rádios (já é o modelo correto para rádios com label wrapper) — sem ação necessária, mas documentar a distinção. |
| Baixa | `client-form-page.tsx` | 44-56 | A função `isFormValid` não é exportada nem testada diretamente — é testada indiretamente via comportamento do botão. | Aceitável para o escopo, mas se houver crescimento da lógica, considerar mover para `utils/validators.ts` com teste unitário direto. |
| Baixa | `client-form-page.tsx` | 89-101 | `handleSubmit` não verifica `isFormValid` explicitamente — confia apenas no `disabled` do botão. Se o botão for ativado via JavaScript externo ou testes E2E sem restrição de `disabled`, o `updateStep` seria chamado com dados inválidos. | Adicionar guard: `if (!isFormValid(fields, clientTipo)) return` no início de `handleSubmit`. |
| Informativo | `client-form-page.tsx` | 19-42 | As funções `applyCpfMask`, `applyCnpjMask`, `applyPhoneMask` são idênticas às do `architect-form-page.tsx`. Se uma terceira página precisar de máscaras, extrair para `utils/masks.ts`. | Extrair para `utils/masks.ts` quando houver um terceiro uso — conforme indicado nas considerações técnicas da TechSpec. |
| Informativo | `client-form-page.module.css` | 44-45 | `.input` define `outline: none` e `.input:focus` redefine com `outline: 2px solid`. Esta é uma abordagem intencional (remove o outline padrão, redefine com cor de marca), mas reseta o foco padrão para usuários que não ativam `:focus` via teclado no Chrome. Navegadores modernos distinguem `:focus` de `:focus-visible`. | Considerar usar `:focus-visible` em vez de `:focus` para aplicar outline apenas ao foco via teclado, evitando outline ao clicar com mouse — mais alinhado com WCAG 2.2 SC 2.4.11. |

---

## Pontos Positivos

- Implementação concisa (245 linhas para o componente, sem inchaço).
- `isFormValid` é uma função pura genuína — declarada fora do componente, sem dependências de closure, sem efeitos colaterais. Decisão arquitetural correta conforme a TechSpec.
- Pré-preenchimento correto: `clientTipo` é inicializado via `useState` com o valor salvo, evitando problemas de inconsistência entre tipo e campos.
- `handleTypeChange` zera exatamente os 3 campos especificados (`cliente_documento`, `razao_social`, `nome_representante_legal`) — nenhum campo extra zerado, nenhum campo faltando.
- Acessibilidade bem implementada: `fieldset + legend` para rádios, `htmlFor` em todos os campos text/email/tel, `<h1>` único.
- CSS Module com `outline: 2px solid` no foco — conformidade WCAG 2.2 SC 2.4.11.
- `.continueButton:disabled` com `opacity: 0.5; cursor: not-allowed` — feedback visual adequado.
- Testes bem estruturados com mocks limpos no `beforeEach`, cobrindo todos os 14 cenários obrigatórios incluindo edge cases (CPF/CNPJ inválidos, formulário vazio).
- `bun run test`: 119/119 passando. `bun run build`: sem erros TypeScript. `bun run lint`: sem erros.
- Nenhuma dependência nova introduzida — apenas reutiliza código existente (`validators.ts`, `form-store`, `react-router`).

---

## Recomendações

1. **Guard em `handleSubmit` (Baixa prioridade):** Adicionar `if (!isFormValid(fields, clientTipo)) return` como primeira linha de `handleSubmit`, tornando a defesa explícita e independente do atributo `disabled` do botão.

2. **`:focus-visible` no CSS (Informativo):** Substituir `.input:focus { outline: 2px solid #1a1a2e }` por `.input:focus-visible { outline: 2px solid #1a1a2e }` para melhorar a experiência com mouse sem comprometer a acessibilidade por teclado (WCAG 2.2 SC 2.4.11).

3. **Extração de máscaras (Informativo):** Quando uma terceira página precisar de máscaras, centralizar `applyCpfMask`, `applyCnpjMask`, `applyPhoneMask` em `frontend/src/utils/masks.ts`. A TechSpec já documenta este trade-off.

---

## Conclusão

A implementação da Task 2.0 está **completa e funcional**. Todos os requisitos do PRD (RF-01 a RF-09) foram atendidos, a TechSpec foi seguida com precisão — incluindo a decisão de validação silenciosa com botão desabilitado — e todos os 14 testes obrigatórios foram implementados e passam. O build TypeScript e o lint estão sem erros.

Os problemas encontrados são de severidade baixa ou informativa, nenhum bloqueante: o principal é a ausência de guard explícito em `handleSubmit` (defesa em profundidade), que não compromete o comportamento normal da aplicação. A decisão de usar `:focus` em vez de `:focus-visible` é aceitável e cumpre o critério WCAG 2.2 solicitado.

**Status: APROVADO COM RESSALVAS** — aprovado para merge, com recomendação de implementar o guard em `handleSubmit` na próxima oportunidade.
