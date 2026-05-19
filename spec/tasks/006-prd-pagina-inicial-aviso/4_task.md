# Tarefa 4.0: DisclaimerPage — Implementar Tela 2 com lógica de aceite e testes

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 1.0 (a rota `/formulario` precisa existir para que "Continuar" possa navegar)

## Estimativa

- **Tamanho**: M
- **Horas estimadas**: 2-4h

## Visão Geral

Criar o componente `DisclaimerPage` (Tela 2 do fluxo) com seu CSS Module associado. A página exibe os quatro pontos institucionais obrigatórios (Seção 3 do documento), um checkbox "Li e concordo com os termos" e o botão "Continuar" — que só é habilitado após o checkbox ser marcado. Ao clicar em "Continuar" com o checkbox marcado, navega para `/formulario`. O estado do checkbox é local (`useState`), sem persistência.

<skills>
### Conformidade com Skills Padrões

- **Frontend**: React 19 + Vite + TypeScript
- **CSS**: CSS Modules
- **Testes**: Vitest + Testing Library
- **Package mgr**: bun
</skills>

<requirements>
- RF-04 (PRD): Exibir os quatro pontos institucionais obrigatórios
- RF-05 (PRD): Checkbox inicia desmarcado; botão "Continuar" inicia desabilitado
- RF-06 (PRD): Marcar o checkbox habilita o botão "Continuar" (Regra 1 — Anexo V)
- RF-07 (PRD): Clicar em "Continuar" (com checkbox marcado) navega para `/formulario`
- RF-08 (PRD): O aceite não persiste entre sessões (sem localStorage)
- Botão desabilitado deve usar atributo `disabled` nativo HTML
- Checkbox deve ter `<label>` associado explicitamente (acessibilidade)
- O título da página deve usar `<h1>` único
</requirements>

## Subtarefas

- [ ] 4.1 Criar `frontend/src/pages/disclaimer-page.tsx` com o componente `DisclaimerPage`
- [ ] 4.2 Implementar `useState<boolean>(false)` para controlar o estado do checkbox
- [ ] 4.3 Renderizar os quatro pontos institucionais obrigatórios conforme o PRD
- [ ] 4.4 Implementar checkbox com `<label>` associado e handler `onChange`
- [ ] 4.5 Implementar botão "Continuar" com `disabled={!accepted}` e navegação para `/formulario`
- [ ] 4.6 Criar `frontend/src/pages/disclaimer-page.module.css` com os estilos
- [ ] 4.7 Criar `frontend/src/pages/disclaimer-page.test.tsx` com os testes descritos abaixo
- [ ] 4.8 Executar `bun test` e `bun run build`

## Detalhes de Implementação

Consulte as seções **"Visão Geral dos Componentes"**, **"Interfaces Principais"**, **"Modelos de Dados"** e **"Testes Unidade"** da `techspec.md`.

Os quatro pontos institucionais obrigatórios (conforme Seção 3 do documento base):
1. Os modelos têm caráter orientativo
2. A ferramenta não substitui análise jurídica individualizada
3. O uso do documento não gera responsabilidade do CAU/DF sobre o contrato final
4. O profissional permanece responsável pela adequação do documento ao caso concreto

Mock de `useNavigate` nos testes:
```typescript
const mockNavigate = vi.fn()
vi.mock('react-router', () => ({ useNavigate: () => mockNavigate }))
```

## Critérios de Sucesso

- Todos os testes de `disclaimer-page.test.tsx` passam
- `bun run build` conclui sem erros
- Checkbox inicia desmarcado e botão inicia desabilitado
- Marcar o checkbox remove o `disabled` do botão
- Clicar em "Continuar" (com checkbox marcado) navega corretamente

## Testes da Tarefa

- [ ] Testes de unidade (`disclaimer-page.test.tsx`):
  - Renderiza os quatro pontos institucionais (um `expect` por ponto, verificando o texto)
  - Checkbox inicia desmarcado
  - Botão "Continuar" inicia com atributo `disabled`
  - Marcar o checkbox remove `disabled` do botão
  - Desmarcar o checkbox recoloca `disabled` no botão
  - Clicar em "Continuar" com checkbox marcado chama `navigate('/formulario')`
- [ ] Testes de integração: não aplicável
- [ ] Testes E2E: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/pages/disclaimer-page.tsx` — criar
- `frontend/src/pages/disclaimer-page.module.css` — criar
- `frontend/src/pages/disclaimer-page.test.tsx` — criar
