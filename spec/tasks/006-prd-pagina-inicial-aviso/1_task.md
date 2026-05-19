# Tarefa 1.0: Roteamento — Configurar novas rotas em App.tsx

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- Nenhuma

## Estimativa

- **Tamanho**: P
- **Horas estimadas**: < 2h

## Visão Geral

Modificar `App.tsx` para adicionar as rotas `/aviso`, `/resultado` e `/formulario` ao `createBrowserRouter` existente. A rota `/` continua apontando para `HomePage` temporariamente — a troca para `LandingPage` acontece na Tarefa 5.0. As rotas `/aviso` e `/resultado` recebem componentes placeholder enquanto suas páginas reais são desenvolvidas nas Tasks 3.0 e 4.0.

<skills>
### Conformidade com Skills Padrões

- **Frontend**: React 19 + Vite + TypeScript
- **Roteamento**: React Router 7 (`createBrowserRouter`)
- **Package mgr**: bun
</skills>

<requirements>
- RF-02 (PRD): Clicar em "Criar contrato" deve navegar para `/aviso` — a rota precisa existir
- RF-07 (PRD): Clicar em "Continuar" deve navegar para `/formulario` — a rota precisa existir
- A rota `/resultado` deve existir para receber o `DownloadPdfButton` migrado na Tarefa 2.0
- Cada nova rota deve ter um componente placeholder funcional (não pode ser `undefined`)
</requirements>

## Subtarefas

- [ ] 1.1 Adicionar rota `/aviso` com componente placeholder `<div>Aviso</div>`
- [ ] 1.2 Adicionar rota `/resultado` com componente placeholder `<div>Resultado</div>`
- [ ] 1.3 Adicionar rota `/formulario` com componente placeholder `<div>Formulário em desenvolvimento</div>`
- [ ] 1.4 Verificar que a rota `/` continua funcionando (HomePage ainda em uso)
- [ ] 1.5 Executar `bun run build` e `bun test` para confirmar que nada quebrou

## Detalhes de Implementação

Consulte a seção **"Sequenciamento de Desenvolvimento — Ordem de Construção"** da `techspec.md`.

O `createBrowserRouter` em `App.tsx` deve receber os novos objetos de rota. Componentes placeholder podem ser funções inline anônimas ou componentes simples declarados no próprio `App.tsx` enquanto as páginas reais não existem.

## Critérios de Sucesso

- `bun test` passa sem erros
- `bun run build` conclui sem erros de TypeScript
- Acessar `/aviso`, `/resultado` e `/formulario` no browser não retorna 404

## Testes da Tarefa

- [ ] Testes de unidade: não necessários para esta task (apenas configuração de roteamento)
- [ ] Testes de integração: não aplicável
- [ ] Testes E2E: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/App.tsx` — arquivo a modificar
