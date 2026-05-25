# Tarefa 3.0: ArchitectFormPage — Implementar tela de dados do arquiteto

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Dependências

- 1.0 (validators.ts precisa existir para ser importado)
- 2.0 (ContratoPayload atualizado — build deve passar)

## Estimativa

- **Tamanho**: G
- **Horas estimadas**: 4-8h

## Visão Geral

Criar o componente `ArchitectFormPage` em `frontend/src/pages/architect-form-page.tsx` com CSS Module associado. A página exibe um formulário com 7 campos (nome, CPF, CNPJ, registro CAU, endereço, email, telefone). Ao clicar "Continuar", valida todos os campos usando os validators da Task 1.0, exibe erros abaixo dos campos inválidos, e se tudo válido grava no `form-store` e navega para `/contratante`. O botão "Voltar" retorna para `/pacote`. A tela pré-preenche os campos se o usuário já passou por ela antes. Por fim, atualizar `App.tsx` para substituir o placeholder `/formulario` pelo componente real.

<skills>
### Conformidade com Skills Padrões

- **Frontend**: React 19 + Vite + TypeScript
- **CSS**: CSS Modules
- **Estado**: Zustand 5 (`useFormStore`)
- **Testes**: Vitest + Testing Library
- **Package mgr**: bun
</skills>

<requirements>
- RF-01 (PRD): Formulário com 7 campos — nome, CPF, CNPJ, CAU, endereço, email, telefone
- RF-02 (PRD): CPF e CNPJ são campos independentes — pelo menos um deve ser válido para avançar
- RF-03 (PRD): Ao clicar "Continuar", todos os campos são validados simultaneamente; erros exibidos abaixo de cada campo inválido
- RF-04 (PRD): Botão "Continuar" sempre habilitado — validação só ocorre ao submeter
- RF-05 (PRD): Se válido: `updateStep('architect', {...})` + `navigate('/contratante')`
- RF-06 (PRD): Botão "Voltar" chama `navigate('/pacote')` sem apagar dados do store
- RF-07 (PRD): Pré-preenchimento dos campos a partir de `steps['architect']` no store na montagem
- RF-08 (PRD): Máscaras aplicadas nos campos de CPF (`000.000.000-00`), CNPJ (`00.000.000/0000-00`) e telefone (`(00) 00000-0000`)
- RF-09 (PRD): Placeholder `A12345-8` no campo `registro_cau`
- Acessibilidade: `<label htmlFor>` em todos os campos, `aria-describedby` nas mensagens de erro, `aria-invalid="true"` em campos com erro, `<h1>` único
- `App.tsx`: substituir `<div>Form under development</div>` por `<ArchitectFormPage />`
- Sem linhas em branco dentro de funções (code-standards.md)
- `bun run test` e `bun run build` devem passar sem erros
</requirements>

## Subtarefas

- [ ] 3.1 Criar `frontend/src/pages/architect-form-page.tsx` com os estados: `fields` (7 campos), `errors` (Record<string,string>), `submitted` (boolean)
- [ ] 3.2 Implementar pré-preenchimento: ler `steps['architect']` do form-store na montagem e popular `fields`
- [ ] 3.3 Implementar funções de máscara inline para CPF, CNPJ e telefone (sem biblioteca)
- [ ] 3.4 Implementar `handleSubmit`: setar `submitted = true`, chamar validators importados de `validators.ts`, coletar erros, se nenhum erro: `updateStep` + `navigate('/contratante')`
- [ ] 3.5 Renderizar formulário: campos com `<label>`, `<input>`, mensagem de erro condicional com `aria-describedby` e `aria-invalid`
- [ ] 3.6 Implementar botão "Voltar" com `navigate('/pacote')`
- [ ] 3.7 Criar `frontend/src/pages/architect-form-page.module.css` com estilos institucionais (seguir padrão das outras páginas)
- [ ] 3.8 Criar `frontend/src/pages/architect-form-page.test.tsx` com os testes descritos abaixo
- [ ] 3.9 Atualizar `frontend/src/App.tsx`: importar `ArchitectFormPage` e substituir o placeholder da rota `/formulario`
- [ ] 3.10 Executar `bun run test` no diretório `frontend` — todos os testes devem passar
- [ ] 3.11 Executar `bun run build` no diretório `frontend`

## Detalhes de Implementação

Consulte as seções **"Interfaces Principais"**, **"Modelos de Dados"**, **"Pontos de Integração"** e **"Testes Unidade"** da `techspec.md`.

**Dados gravados no form-store ao confirmar:**
```typescript
updateStep('architect', {
  arquiteto_nome: fields.arquiteto_nome,
  arquiteto_cpf: fields.arquiteto_cpf,
  arquiteto_cnpj: fields.arquiteto_cnpj,
  registro_cau: fields.registro_cau,
  arquiteto_endereco: fields.arquiteto_endereco,
  arquiteto_email: fields.arquiteto_email,
  arquiteto_telefone: fields.arquiteto_telefone,
})
```

**Regra CPF/CNPJ:** pelo menos um preenchido e válido. Se ambos preenchidos, ambos válidos.

**Estado de erros ativo apenas após `submitted = true`** — antes do primeiro clique em "Continuar" nenhum erro é exibido.

**Mock de `useNavigate` nos testes:**
```typescript
const mockNavigate = vi.fn()
vi.mock('react-router', () => ({ useNavigate: () => mockNavigate }))
```

**Mock do `useFormStore` nos testes:**
```typescript
const mockUpdateStep = vi.fn()
vi.mock('../store/form-store', () => ({
  useFormStore: () => ({ updateStep: mockUpdateStep, steps: {} })
}))
```

## Critérios de Sucesso

- Todos os testes de `architect-form-page.test.tsx` passam
- `bun run build` sem erros de TypeScript
- Rota `/formulario` exibe o formulário (não mais o placeholder)
- "Continuar" com campos vazios exibe erros em todos os campos
- "Continuar" com dados válidos chama `updateStep` e navega

## Testes da Tarefa

- [ ] Testes de unidade (`architect-form-page.test.tsx`):
  - Renderiza os 7 campos e os botões "Continuar" e "Voltar"
  - Clicar "Continuar" com todos os campos vazios exibe mensagens de erro
  - Preencher apenas CPF válido + demais campos obrigatórios → sem erro CPF/CNPJ
  - Preencher apenas CNPJ válido + demais campos obrigatórios → sem erro CPF/CNPJ
  - CPF e CNPJ ambos inválidos → exibe erro na regra CPF/CNPJ
  - Registro CAU inválido (ex: `12345`) → exibe erro no campo CAU
  - Todos os campos válidos → "Continuar" chama `updateStep('architect', {...})` com dados corretos
  - Todos os campos válidos → "Continuar" chama `navigate('/contratante')`
  - "Voltar" chama `navigate('/pacote')`
  - Campos pré-preenchidos quando `steps['architect']` existe no store
  - Máscara de CPF aplicada ao digitar (ex: `52998224725` → `529.982.247-25`)
  - Botão "Continuar" está habilitado mesmo com campos vazios (RF-04)
- [ ] Testes de integração: não aplicável
- [ ] Testes E2E: não aplicável

<critical>SEMPRE CRIE E EXECUTE OS TESTES DA TAREFA ANTES DE CONSIDERÁ-LA FINALIZADA</critical>

## Arquivos relevantes

- `frontend/src/pages/architect-form-page.tsx` — criar
- `frontend/src/pages/architect-form-page.module.css` — criar
- `frontend/src/pages/architect-form-page.test.tsx` — criar
- `frontend/src/utils/validators.ts` — ler e importar (Task 1.0)
- `frontend/src/store/form-store.ts` — ler (usar `updateStep` e `steps`)
- `frontend/src/types/contrato.ts` — ler (referência de tipos, Task 2.0)
- `frontend/src/App.tsx` — modificar (substituir placeholder)
