# PRD — Motor de Geração de Contratos

## Visão Geral

O Motor de Geração de Contratos é o componente central do backend responsável por combinar os dados do formulário preenchido pelo arquiteto com as cláusulas da Biblioteca de Cláusulas (Feature 02), compondo o HTML final do contrato pronto para revisão e posterior conversão em PDF (Feature 04).

O problema que resolve: arquitetos do CAU/DF precisam montar manualmente o contrato de prestação de serviços — selecionando cláusulas, preenchendo dados e seguindo a estrutura correta do modelo orientativo — um processo propenso a omissões e erros de formatação. O motor automatiza essa composição, garantindo que o documento gerado esteja sempre completo, ordenado e em conformidade com o modelo do CAU/DF.

## Objetivos

- 100% das variáveis `{{variavel}}` substituídas na geração (zero marcações no output)
- Tempo de geração do HTML < 500ms para contratos com até 20 cláusulas
- Rejeição de payloads incompletos com HTTP 400 e identificação do campo ausente
- HTML gerado semanticamente correto para compatibilidade com Feature 04 (PDF)

## Histórias de Usuário

- Como **arquiteto**, quero visualizar o HTML do contrato antes de finalizar, para revisar o documento e identificar erros antes de converter em PDF
- Como **arquiteto**, quero selecionar um pacote de serviço e ter o escopo pré-preenchido automaticamente, para não precisar redigir os entregáveis padrão manualmente
- Como **sistema**, quero rejeitar payloads com campos obrigatórios ausentes, para garantir que nenhum contrato gerado contenha lacunas visíveis

## Funcionalidades Principais

### RF-01 — Endpoint de preview
`POST /api/contratos/preview` recebe o payload do formulário e retorna `{ html: string }` com status 200. Pode ser chamado múltiplas vezes durante o preenchimento.

### RF-02 — Endpoint de geração final
`POST /api/contratos/gerar` recebe o payload confirmado e retorna `{ html: string }` com o documento final. Após esta chamada, o contrato não pode ser editado na plataforma (Regra 4 — Anexo V). Nesta feature o retorno é HTML; a geração de PDF ocorre na Feature 04.

### RF-03 — Endpoint de pacotes
`GET /api/contratos/pacotes` retorna a lista dos 5 pacotes disponíveis com seus dados de pré-preenchimento: escopo inicial, número sugerido de revisões e entregáveis típicos.

### RF-04 — Substituição de variáveis
O motor substitui todas as ocorrências de `{{variavel}}` pelos valores do payload. As 16 variáveis previstas são:

| Grupo | Variáveis |
|-------|-----------|
| Cliente | `cliente_nome`, `cliente_documento`, `cliente_endereco` |
| Arquiteto | `arquiteto_nome`, `registro_cau` |
| Projeto | `tipo_servico`, `tipo_projeto`, `endereco_projeto`, `area_projeto` |
| Contratual | `escopo_servicos`, `servicos_adicionais`, `prazo_total`, `valor_total`, `parcelas`, `numero_revisoes`, `cidade_foro` |

### RF-05 — Validação de payload
Se qualquer variável obrigatória estiver ausente, a requisição é rejeitada com HTTP 400 e `{ error: string }` identificando o(s) campo(s) faltantes. `servicos_adicionais` é opcional (condicional).

### RF-06 — Composição ordenada do documento
O HTML deve montar as 17 seções nesta ordem:

1. Header — logotipo CAU/DF + título
2. Disclaimer institucional
3. Identificação das partes
4. Objeto do contrato
5. Escopo dos serviços
6. Serviços adicionais *(condicional — só aparece se `servicos_adicionais` estiver no payload)*
7. Etapas e prazos
8. Honorários profissionais
9. Forma de pagamento
10. Cláusulas opcionais selecionadas *(na ordem da Biblioteca de Cláusulas)*
11. Direitos autorais
12. Responsabilidades das partes
13. Alterações de escopo
14. Rescisão contratual
15. Foro
16. Assinaturas
17. Footer institucional *(CAU/DF + aviso de modelo orientativo)*

### RF-07 — Inclusão condicional de seções
Seções opcionais só são incluídas no HTML quando os dados correspondentes estiverem presentes no payload (ex: seção de Serviços adicionais só aparece se `servicos_adicionais` for fornecido).

### RF-08 — Pré-preenchimento por pacote
O motor incorpora automaticamente os valores padrão do pacote selecionado via `tipo_servico`. Os 5 pacotes do MVP e seus pré-preenchimentos (escopo inicial, revisões sugeridas, entregáveis típicos) são servidos por `GET /api/contratos/pacotes`.

Pacotes do MVP:
- Projeto de Arquitetura
- Projeto de Arquitetura de Interiores
- Projeto + Acompanhamento de Obra
- Reforma
- Reforma de Interiores

### RF-09 — Inclusão de cláusulas obrigatórias
O HTML gerado deve incluir as cláusulas obrigatórias da Biblioteca (Feature 02) nas posições corretas da estrutura, com as variáveis substituídas.

### RF-10 — Inclusão de cláusulas opcionais
O HTML gerado deve incluir as cláusulas opcionais indicadas no payload (`clausulas_opcionais: string[]`), na ordem definida pela Biblioteca de Cláusulas.

## Experiência do Usuário

Esta feature é backend puro — sem UI direta. O frontend de revisão/preview será implementado em feature posterior. O contato do usuário com este motor é indireto, via respostas JSON consumidas pelo frontend.

O HTML gerado deve usar semântica adequada (headings `h1`/`h2`, parágrafos `p`, seções `section`) para que o PDF produzido na Feature 04 seja estruturalmente correto e acessível.

## Restrições Técnicas de Alto Nível

- Depende de Feature 02 (`clausulas-service.ts`) para buscar cláusulas obrigatórias e opcionais
- Processamento stateless — sem banco de dados ou persistência de contratos no MVP
- Output desta feature é HTML; conversão para PDF é responsabilidade da Feature 04
- Sem dependência de template engines externas — substituição via TypeScript nativo

## Fora de Escopo

- Geração de PDF (Feature 04)
- Armazenamento e persistência de contratos gerados
- Edição do contrato após `POST /api/contratos/gerar`
- Autenticação e autorização de usuários
- Assinatura digital
- Envio do contrato por e-mail
- Versionamento de contratos gerados
