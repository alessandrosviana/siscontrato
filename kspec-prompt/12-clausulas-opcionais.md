# Feature 12 — Seleção de Cláusulas Opcionais

## Contexto

Etapa 11 do fluxo. O usuário escolhe quais cláusulas opcionais incluir no contrato,
a partir da biblioteca de cláusulas pré-definidas.

Depende da Biblioteca de Cláusulas (Feature 02) para listar as cláusulas disponíveis.

## Objetivo desta feature

Implementar a tela de seleção de cláusulas opcionais (Tela 8 — Anexo IV), com
listagem das cláusulas disponíveis, exibição do texto de cada cláusula e seleção
pelo usuário.

## Requisitos

### Cláusulas opcionais disponíveis (Seção 10)

1. Direitos autorais ampliados
2. Exclusividade do arquiteto
3. Número máximo de revisões
4. Visitas extras cobradas
5. Reajuste de honorários
6. Alteração de escopo mediante termo aditivo
7. Repetição de serviços
8. Suspensão do projeto
9. Multa por cancelamento
10. Autorização de uso de imagens da obra

### Comportamento da tela (Tela 8 — Anexo IV)

- Lista todas as cláusulas com:
  - Título da cláusula
  - Toggle (ativar / desativar)
  - Botão para expandir e ler o texto completo da cláusula
- Por padrão, nenhuma cláusula opcional está selecionada
- O usuário pode ativar/desativar qualquer combinação

### Campo para cláusula adicional personalizada (Seção 4 e Regra 6)

- Botão "+ Adicionar cláusula personalizada"
- Ao clicar, abre campo de texto livre para o usuário redigir uma cláusula própria
- Permite adicionar múltiplas cláusulas personalizadas
- Cada cláusula personalizada pode ser removida individualmente

### Estado salvo no formulário

- `clausulas_opcionais` — array com os slugs das cláusulas selecionadas
- `clausulas_personalizadas` — array de textos das cláusulas adicionais do usuário

### Regras de negócio (Anexo V)

- Regra 5: cláusulas opcionais só são incluídas no contrato quando selecionadas
- Regra 6: o sistema deve permitir inclusão de cláusulas adicionais personalizadas

## Referência no documento

Seção 4 — Funcionalidades incluídas (biblioteca de cláusulas e campo adicional)
Seção 8 — Fluxo (etapa 11)
Seção 10 — Biblioteca de Cláusulas Opcionais
Anexo IV — Tela 8
Anexo V — Regras 5 e 6
