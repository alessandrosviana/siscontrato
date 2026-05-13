# Tarefa 5.0: Integração Final

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 4.0 Quality Tools

## Estimativa

- **Tamanho**: P
- **Horas estimadas**: 1-2h

## Visão Geral

Valida que o monorepo funciona corretamente como um todo: `bun dev` na raiz sobe backend e frontend simultaneamente, `bun test` na raiz executa todos os testes de ambos os projetos, e `bun run build` gera os artefatos de produção. Esta task não adiciona código novo — é a checagem de integração que confirma que todas as peças encaixam.

<skills>
### Conformidade com Skills Padrões

- **code-standards**: sem alterações de código — foco em validação e documentação mínima.
</skills>

<requirements>
- `bun dev` na raiz deve iniciar backend (porta 3000) e frontend (porta 5173) em paralelo.
- `bun test` na raiz deve executar os testes de `backend/` e `frontend/` e todos devem passar.
- `bun run build` na raiz deve concluir sem erros para ambos os projetos.
- O proxy `/api → http://localhost:3000` deve funcionar: `GET /api/health` via frontend retorna `{ status: "ok" }`.
- Um `README.md` mínimo deve documentar os comandos essenciais para novos desenvolvedores.
</requirements>

## Subtarefas

- [ ] 5.1 Executar `bun dev` na raiz e confirmar que backend e frontend sobem sem erros
- [ ] 5.2 Confirmar que `GET http://localhost:3000/health` retorna `{ "status": "ok" }` com 200
- [ ] 5.3 Confirmar que `http://localhost:5173` carrega a aplicação React sem erros no console do browser
- [ ] 5.4 Testar o proxy: `GET http://localhost:5173/api/health` deve retornar a mesma resposta que o backend direto
- [ ] 5.5 Executar `bun test` na raiz e confirmar que todos os testes passam
- [ ] 5.6 Executar `bun run build` na raiz e confirmar que os artefatos são gerados sem erros
- [ ] 5.7 Criar `README.md` na raiz com: pré-requisitos, como instalar (`bun install`), como rodar (`bun dev`), como testar (`bun test`) e estrutura de pastas

## Detalhes de Implementação

Consulte as seções **Monorepo — Orquestração na Raiz**, **Experiência do Usuário (fluxo principal esperado)** e **Sequenciamento de Desenvolvimento (passo 6)** em `techspec.md`.

## Critérios de Sucesso

- `bun dev` na raiz: backend em `:3000` e frontend em `:5173` operacionais simultaneamente
- `bun test` na raiz: todos os testes passam (zero falhas)
- `bun run build` na raiz: termina sem erros
- Proxy validado: requisição do frontend para `/api/health` retorna `{ "status": "ok" }`
- `README.md` criado com os comandos essenciais documentados

## Testes da Tarefa

- [ ] Testes de unidade: não aplicável (sem código novo)
- [ ] Testes de integração: execução de `bun dev` + validação manual do proxy `/api/health`
- [ ] Testes E2E: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos Relevantes

- `/package.json` (pode precisar de ajustes nos scripts de raiz)
- `/README.md` (novo)
