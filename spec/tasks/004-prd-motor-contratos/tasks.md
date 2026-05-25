# Resumo de Tarefas de Implementação de Motor de Geração de Contratos

**Legenda de tamanho**: P (< 2h) | M (2-4h) | G (4-8h) | GG (> 8h)

## Tarefas

- [x] 1.0 Dados e Templates Estruturais — pacotes.json (5 pacotes) e templates/contrato.ts (seções estruturais do HTML) [M]
- [x] 2.0 Service de Geração — contratos-service.ts com buildVariableMap, generateHtml e getPackages, instalar Zod e testes unitários (depende: 1.0) [G]
- [x] 3.0 Endpoints da API — router contratos.ts com Zod, registro em index.ts e testes HTTP dos endpoints (depende: 2.0) [M]
