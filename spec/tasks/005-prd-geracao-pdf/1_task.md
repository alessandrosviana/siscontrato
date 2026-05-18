# Tarefa 1.0: Setup — puppeteer-core + logo base64 + exportar schema

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- Nenhuma

## Estimativa

- **Tamanho**: P
- **Horas estimadas**: 1–2h

## Visão Geral

Prepara a infra necessária antes de qualquer implementação de PDF:
1. Instala `puppeteer-core` como dependência de produção no backend.
2. Cria o asset `backend/src/assets/cau-df-logo.b64.ts` com o logo do CAU/DF em base64.
3. Exporta `ContratoPayloadSchema` de `backend/src/routes/contratos.ts` para reutilização em `pdf.ts`.

<skills>
### Conformidade com Skills Padrões

- **Package manager**: usar `bun add puppeteer-core` — nunca npm/yarn.
- **Código-fonte**: inglês (nomes de variáveis, funções, constantes).
- **code-standards.md**: constante nomeada claramente, sem magic strings.
</skills>

<requirements>
- `puppeteer-core` adicionado em `dependencies` do `backend/package.json`.
- Arquivo `backend/src/assets/cau-df-logo.b64.ts` criado e exportando `export const cauDfLogoBase64: string`.
- O valor de `cauDfLogoBase64` é uma string base64 válida de uma imagem PNG (pode ser um placeholder simples enquanto o logo real não está disponível).
- `ContratoPayloadSchema` exportado de `backend/src/routes/contratos.ts` (adicionar `export` à declaração existente).
- Nenhum teste de regressão existente pode quebrar.
</requirements>

## Subtarefas

- [ ] 1.1 Instalar `puppeteer-core`: `bun add puppeteer-core` dentro de `backend/`
- [ ] 1.2 Criar `backend/src/assets/cau-df-logo.b64.ts` exportando `cauDfLogoBase64` como string base64
- [ ] 1.3 Adicionar `export` ao `ContratoPayloadSchema` em `contratos.ts`
- [ ] 1.4 Executar `bun test` para garantir que nenhum teste existente quebrou

## Detalhes de Implementação

Ver **Pontos de Integração** e **Decisões Principais** na techspec.md:
- Logo como base64 embutido (sem I/O em runtime)
- `ContratoPayloadSchema` exportado para ser único ponto de verdade

Para o placeholder do logo (enquanto o PNG real não está disponível), uma string base64 de um PNG mínimo de 1×1 pixel transparente é suficiente para viabilizar o desenvolvimento das próximas tasks.

## Critérios de Sucesso

- `bun test` continua passando (52 testes existentes).
- `import { ContratoPayloadSchema } from './contratos'` funciona em outro arquivo do mesmo diretório.
- `import { cauDfLogoBase64 } from '../assets/cau-df-logo.b64'` funciona em `pdf-service.ts`.
- `backend/package.json` contém `"puppeteer-core"` em `dependencies`.

## Testes da Tarefa

- [ ] Testes de unidade: não aplicável (setup de infraestrutura, sem lógica a testar)
- [ ] Testes de integração: não aplicável
- [ ] Verificação: `bun test` passa sem erros após as mudanças

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `backend/package.json` — adicionar `puppeteer-core`
- `backend/src/routes/contratos.ts` — exportar `ContratoPayloadSchema`
- `backend/src/assets/cau-df-logo.b64.ts` — novo arquivo
