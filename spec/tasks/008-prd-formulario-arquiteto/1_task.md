# Tarefa 1.0: Validators — Funções de validação CPF, CNPJ, CAU, email e telefone

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- Nenhuma

## Estimativa

- **Tamanho**: P
- **Horas estimadas**: < 2h

## Visão Geral

Criar o arquivo `frontend/src/utils/validators.ts` com funções puras de validação para todos os campos do formulário de dados do arquiteto. Cada função recebe uma string e retorna `boolean`. Criar `frontend/src/utils/validators.test.ts` com cobertura completa, incluindo casos válidos, inválidos e edge cases.

<skills>
### Conformidade com Skills Padrões

- **Frontend**: TypeScript puro (sem framework)
- **Testes**: Vitest
- **Package mgr**: bun
</skills>

<requirements>
- `validateCpf(value: string): boolean` — remove máscara, verifica 11 dígitos e algoritmo módulo 11
- `validateCnpj(value: string): boolean` — remove máscara, verifica 14 dígitos e algoritmo módulo 11
- `validateCau(value: string): boolean` — regex `/^[A-Z]\d{4,6}-\d$/`
- `validateEmail(value: string): boolean` — regex de e-mail válido
- `validatePhone(value: string): boolean` — remove máscara, verifica 10 (fixo) ou 11 (celular) dígitos
- Todas as funções são exportadas como named exports
- Sem dependências externas — somente TypeScript puro
- Funções puras: sem efeitos colaterais
- `bun run test` deve passar com 100% de sucesso
</requirements>

## Subtarefas

- [ ] 1.1 Criar `frontend/src/utils/validators.ts` com as 5 funções
- [ ] 1.2 Implementar `validateCpf`: remover `.-`, verificar tamanho 11, aplicar algoritmo dígito verificador
- [ ] 1.3 Implementar `validateCnpj`: remover `./- `, verificar tamanho 14, aplicar algoritmo dígito verificador
- [ ] 1.4 Implementar `validateCau`: regex `/^[A-Z]\d{4,6}-\d$/` aplicada ao valor trimado
- [ ] 1.5 Implementar `validateEmail`: regex cobrindo formato `user@domain.tld`
- [ ] 1.6 Implementar `validatePhone`: remover `() - `, verificar 10 ou 11 dígitos numéricos
- [ ] 1.7 Criar `frontend/src/utils/validators.test.ts` com os casos descritos na seção de Testes
- [ ] 1.8 Executar `bun run test` no diretório `frontend` — todos os testes devem passar

## Detalhes de Implementação

Consulte a seção **"Validators"** da `techspec.md` para a tabela de funções e suas regras.

**Algoritmo CPF (módulo 11):**
```
Dígito 1: somar dígitos[0..8] × [10,9,8,7,6,5,4,3,2]; resto = soma % 11; d1 = resto < 2 ? 0 : 11 - resto
Dígito 2: somar dígitos[0..9] × [11,10,9,8,7,6,5,4,3,2]; resto = soma % 11; d2 = resto < 2 ? 0 : 11 - resto
```

**Algoritmo CNPJ (módulo 11):**
```
Peso1 = [5,4,3,2,9,8,7,6,5,4,3,2]; Peso2 = [6,5,4,3,2,9,8,7,6,5,4,3,2]
d1: soma(dígitos[0..11] × Peso1) % 11 → < 2 ? 0 : 11 - resto
d2: soma(dígitos[0..12] × Peso2) % 11 → < 2 ? 0 : 11 - resto
```

## Critérios de Sucesso

- `bun run test` passa sem erros no frontend
- `bun run build` no frontend sem erros de TypeScript
- Todos os 5 validators exportados e funcionando

## Testes da Tarefa

- [ ] Testes de unidade (`validators.test.ts`):
  - `validateCpf`: CPF válido (ex: `529.982.247-25`), inválido (dígito errado), sequência repetida (`111.111.111-11`), vazio
  - `validateCnpj`: CNPJ válido (ex: `11.222.333/0001-81`), inválido, sequência repetida, vazio
  - `validateCau`: `A12345-8` válido, `B123456-0` válido, `12345-8` inválido (sem letra), `A1234` inválido (sem hífen), vazio
  - `validateEmail`: `user@domain.com` válido, `user@` inválido, `user.domain.com` inválido, vazio
  - `validatePhone`: `(11) 99999-9999` celular válido, `(11) 3333-4444` fixo válido, `(11) 9999` inválido, vazio
- [ ] Testes de integração: não aplicável
- [ ] Testes E2E: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/utils/validators.ts` — criar
- `frontend/src/utils/validators.test.ts` — criar
