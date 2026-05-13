# Feature 07 — Formulário de Dados do Arquiteto

## Contexto

Etapa 4 do fluxo. O usuário preenche os dados do arquiteto contratante.
Esses dados serão usados para identificar o profissional no contrato gerado.

## Objetivo desta feature

Implementar a tela de coleta de dados do arquiteto (Tela 3 — Anexo IV),
com validações e integração ao estado global do formulário.

## Requisitos

### Campos (Tela 3 — Anexo IV e Anexo III)

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| `arquiteto_nome` | texto | sim | não vazio |
| `arquiteto_documento` | texto | sim | CPF ou CNPJ válido |
| `registro_cau` | texto | sim | formato CAU (ex: A12345-8) |
| `arquiteto_endereco` | texto | sim | não vazio |
| `arquiteto_email` | email | sim | formato de e-mail válido |
| `arquiteto_telefone` | telefone | sim | formato brasileiro |

### Regras de negócio (Anexo V — Regra 2)

Campos obrigatórios do contrato que estão nesta etapa:
- `arquiteto_nome`
- `registro_cau`

### Comportamento

- Validação em tempo real nos campos (feedback visual imediato)
- Botão "Continuar" desabilitado se há campos obrigatórios em branco ou inválidos
- Botão "Voltar" retorna para a seleção de pacote
- Dados persistidos no estado global ao avançar

## Referência no documento

Seção 8 — Fluxo (etapa 4)
Anexo III — Campos relacionados ao arquiteto
Anexo IV — Tela 3
Anexo V — Regra 2
