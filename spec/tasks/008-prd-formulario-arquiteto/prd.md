# PRD — Formulário de Dados do Arquiteto

## Visão Geral

O fluxo de geração de contrato exige que o arquiteto preencha seus dados profissionais antes de avançar para as etapas seguintes. Esta feature implementa a **Tela 3 do formulário multi-etapas** (etapa 4 do fluxo completo), responsável por coletar e validar os dados de identificação do arquiteto contratante. As informações preenchidas aqui alimentam diretamente o contrato gerado em PDF.

## Objetivos

- Coletar os 7 dados obrigatórios do arquiteto com validação antes de avançar
- Garantir que nenhum dado inválido chegue ao motor de geração de contrato
- Persistir os dados no estado global para que estejam disponíveis nas etapas seguintes e na geração do PDF

## Histórias de Usuário

- Como arquiteto, quero preencher meus dados profissionais em um formulário simples para que eles sejam inseridos automaticamente no contrato gerado
- Como arquiteto, quero receber feedback claro sobre campos inválidos ao tentar avançar para não precisar revisar o documento manualmente depois
- Como arquiteto, quero poder voltar para a seleção de pacote sem perder os dados já preenchidos

## Funcionalidades Principais

### Formulário de dados do arquiteto

O usuário preenche os seguintes campos:

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| `arquiteto_nome` | texto | sim | não vazio |
| `arquiteto_cpf` | texto | sim (exclusivo com CNPJ) | CPF válido com 11 dígitos |
| `arquiteto_cnpj` | texto | sim (exclusivo com CPF) | CNPJ válido com 14 dígitos |
| `registro_cau` | texto | sim | formato CAU (ex: A12345-8) |
| `arquiteto_endereco` | texto | sim | não vazio |
| `arquiteto_email` | email | sim | formato e-mail válido |
| `arquiteto_telefone` | telefone | sim | formato telefone brasileiro |

**Nota sobre CPF e CNPJ:** os campos são exibidos simultaneamente, mas pelo menos um deve estar preenchido e válido para avançar. Se ambos forem preenchidos, ambos devem ser válidos.

### Requisitos Funcionais

- **RF-01**: A tela exibe um formulário com os 7 campos descritos acima
- **RF-02**: CPF e CNPJ são campos de texto independentes — o usuário preenche um ou ambos
- **RF-03**: Ao clicar "Continuar", todos os campos obrigatórios são validados simultaneamente; erros são exibidos abaixo de cada campo inválido
- **RF-04**: O botão "Continuar" está habilitado independentemente do estado dos campos — a validação ocorre apenas ao submeter
- **RF-05**: Se a validação passar, os dados são gravados no estado global (`form-store`) e o usuário navega para a tela de dados do contratante
- **RF-06**: O botão "Voltar" retorna para `/pacote` sem apagar os dados já preenchidos no form-store
- **RF-07**: Se o usuário retornar a esta tela (navegação para trás), os campos são pré-preenchidos com os dados já salvos no form-store
- **RF-08**: Máscaras de entrada são aplicadas nos campos de CPF, CNPJ e telefone para facilitar o preenchimento
- **RF-09**: O campo `registro_cau` exibe um placeholder com o formato esperado (ex: `A12345-8`)

## Experiência do Usuário

### Fluxo principal

1. Usuário chega em `/formulario` vindo de `/pacote`
2. Preenche os dados do arquiteto
3. Clica "Continuar" → validação é executada
   - Se inválido: erros aparecem abaixo dos campos com problema; foco vai para o primeiro campo inválido
   - Se válido: dados salvos no store, navega para a tela de dados do contratante
4. Botão "Voltar" retorna para `/pacote` a qualquer momento

### Acessibilidade

- Cada campo possui `<label>` associado via `htmlFor`
- Mensagens de erro associadas ao campo via `aria-describedby`
- Campo inválido recebe `aria-invalid="true"` após tentativa de submissão
- `<h1>` único na página
- Navegação por teclado funcional (Tab entre campos, Enter no botão)

## Restrições Técnicas de Alto Nível

- Os dados desta tela devem ser compatíveis com os campos de `ContratoPayload` utilizados no motor de geração de PDF (`arquiteto_nome`, `arquiteto_endereco`, `registro_cau`)
- Os campos `arquiteto_email`, `arquiteto_telefone`, `arquiteto_cpf` e `arquiteto_cnpj` não existem atualmente em `ContratoPayload` — a tech spec deve decidir se estende o payload ou os trata como dados auxiliares
- A validação de CPF/CNPJ deve verificar o dígito verificador (não apenas o tamanho)
- A validação de número CAU deve seguir o formato oficial: letra + dígitos + hífen + dígito verificador (ex: `A12345-8`)
- O estado global usa Zustand (`useFormStore` + `updateStep`)

## Fora de Escopo

- Consulta de dados do arquiteto em APIs externas (ex: CAU-BR, Receita Federal)
- Edição de dados após geração do contrato
- Suporte a múltiplos arquitetos por contrato
- Persistência em banco de dados — os dados existem apenas na sessão do navegador
- Tela de dados do contratante (próxima feature)
