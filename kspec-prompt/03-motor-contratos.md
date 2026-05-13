# Feature 03 — Motor de Geração de Contratos

## Contexto

O motor de geração de contratos é o componente central do backend. Ele recebe os
dados do formulário preenchido pelo usuário e os insere no template do contrato,
compondo o documento final com as cláusulas corretas.

Depende da Biblioteca de Cláusulas (Feature 02) para obter os textos das cláusulas.

## Objetivo desta feature

Implementar o serviço backend responsável por combinar dados do formulário +
cláusulas obrigatórias + cláusulas opcionais selecionadas → gerando o HTML/texto
final do contrato, pronto para conversão em PDF.

## Requisitos

### Variáveis do template (Anexo I)

O template usa variáveis no formato `{{variavel}}`. O motor deve substituir todas
elas pelos valores fornecidos. Variáveis previstas:

**Campos do cliente:**
- `{{cliente_nome}}`, `{{cliente_documento}}`, `{{cliente_endereco}}`

**Campos do arquiteto:**
- `{{arquiteto_nome}}`, `{{registro_cau}}`

**Campos do projeto:**
- `{{tipo_servico}}`, `{{tipo_projeto}}`, `{{endereco_projeto}}`, `{{area_projeto}}`

**Campos contratuais:**
- `{{escopo_servicos}}`, `{{servicos_adicionais}}`, `{{prazo_total}}`
- `{{valor_total}}`, `{{parcelas}}`, `{{numero_revisoes}}`, `{{cidade_foro}}`

### Estrutura do contrato gerado (Seção 11)

O documento deve seguir esta ordem:
1. HEADER — logotipo CAU/DF + título
2. DISCLAIMER institucional
3. Identificação das partes
4. Objeto do contrato
5. Escopo dos serviços
6. Serviços adicionais (condicional — só aparece se selecionados)
7. Etapas e prazos
8. Honorários profissionais
9. Forma de pagamento
10. Cláusulas opcionais selecionadas (na ordem da biblioteca)
11. Direitos autorais
12. Responsabilidades das partes
13. Alterações de escopo
14. Rescisão contratual
15. Foro
16. Assinaturas
17. FOOTER institucional (CAU/DF + aviso de modelo orientativo)

### Pacotes de serviço (Seção 7)

Ao selecionar um pacote, o motor deve pré-preencher automaticamente:
- estrutura inicial do escopo de serviços
- número sugerido de revisões
- entregáveis típicos do serviço

Pacotes previstos no MVP:
- Projeto de Arquitetura
- Projeto de Arquitetura de Interiores
- Projeto + acompanhamento de obra
- Reforma
- Reforma de interiores

### API (backend)

- `POST /api/contratos/preview` — recebe o payload do formulário, retorna HTML do contrato para revisão
- `POST /api/contratos/gerar` — recebe o payload final confirmado, retorna o PDF (ou dispara geração)

### Regras de negócio (Anexo V)

- Regra 8: o contrato é gerado a partir de template base + respostas do formulário + cláusulas opcionais selecionadas
- Regra 4: após geração do PDF, o documento não pode mais ser editado na plataforma
- Cada bloco pode ser incluído ou omitido automaticamente conforme opções selecionadas

## Referência no documento

Seção 7 — Estrutura baseada em pacotes de serviços
Seção 11 — Estrutura do Contrato Gerado
Seção 14 — Motor de geração de contratos
Anexo I — Estrutura Modular do Modelo de Contrato
Anexo V — Regras 4 e 8
