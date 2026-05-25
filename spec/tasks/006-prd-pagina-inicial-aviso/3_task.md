# Tarefa 3.0: LandingPage — Implementar Tela 1 com CSS Module e testes

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 1.0 (a rota `/aviso` precisa existir para que o botão "Criar contrato" possa navegar)

## Estimativa

- **Tamanho**: M
- **Horas estimadas**: 2-4h

## Visão Geral

Criar o componente `LandingPage` (Tela 1 do fluxo) com seu CSS Module associado. A página exibe o título da ferramenta, uma descrição breve, o botão "Criar contrato" (que navega para `/aviso`) e um rodapé com "CAU/DF | Aviso legal". Esta task NÃO substitui a rota `/` — isso acontece na Tarefa 5.0. A `LandingPage` é criada e testada de forma isolada.

<skills>
### Conformidade com Skills Padrões

- **Frontend**: React 19 + Vite + TypeScript
- **CSS**: CSS Modules
- **Testes**: Vitest + Testing Library
- **Package mgr**: bun
</skills>

<requirements>
- RF-01 (PRD): A página deve exibir título "Gerador de Contratos para Arquitetos", descrição e botão "Criar contrato"
- RF-02 (PRD): Clicar em "Criar contrato" deve chamar `navigate('/aviso')`
- RF-03 (PRD): O rodapé deve exibir "CAU/DF" e "Aviso legal"
- O título deve usar `<h1>` (acessibilidade)
- Estilo via CSS Modules (arquivo `landing-page.module.css`)
- Sem estado local — componente puramente apresentacional
</requirements>

## Subtarefas

- [ ] 3.1 Criar `frontend/src/pages/landing-page.tsx` com o componente `LandingPage`
- [ ] 3.2 Criar `frontend/src/pages/landing-page.module.css` com os estilos institucionais
- [ ] 3.3 Implementar navegação para `/aviso` via `useNavigate()` ao clicar em "Criar contrato"
- [ ] 3.4 Adicionar rodapé com texto "CAU/DF" e "Aviso legal"
- [ ] 3.5 Criar `frontend/src/pages/landing-page.test.tsx` com os testes descritos abaixo
- [ ] 3.6 Executar `bun test` e `bun run build`

## Detalhes de Implementação

Consulte as seções **"Visão Geral dos Componentes"**, **"Interfaces Principais"** e **"Testes Unidade"** da `techspec.md`.

Mock de `useNavigate` nos testes:
```typescript
const mockNavigate = vi.fn()
vi.mock('react-router', () => ({ useNavigate: () => mockNavigate }))
```

## Critérios de Sucesso

- Todos os testes de `landing-page.test.tsx` passam
- `bun run build` conclui sem erros
- A página exibe título `<h1>`, descrição, botão e rodapé conforme o PRD

## Testes da Tarefa

- [ ] Testes de unidade (`landing-page.test.tsx`):
  - Renderiza `<h1>` com texto "Gerador de Contratos para Arquitetos"
  - Renderiza botão com texto "Criar contrato"
  - Renderiza rodapé com texto "CAU/DF"
  - Renderiza rodapé com texto "Aviso legal"
  - Clicar em "Criar contrato" chama `navigate('/aviso')`
- [ ] Testes de integração: não aplicável
- [ ] Testes E2E: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/pages/landing-page.tsx` — criar
- `frontend/src/pages/landing-page.module.css` — criar
- `frontend/src/pages/landing-page.test.tsx` — criar
