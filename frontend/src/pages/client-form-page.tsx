import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useFormStore } from '../store/form-store'
import { validateCnpj, validateCpf, validateEmail, validatePhone } from '../utils/validators'
import styles from './client-form-page.module.css'

type ClientTipo = 'PF' | 'PJ'

interface ClientFields {
  cliente_nome: string
  cliente_documento: string
  cliente_endereco: string
  cliente_email: string
  cliente_telefone: string
  razao_social: string
  nome_representante_legal: string
}

function applyCpfMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function applyCnpjMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14)
  if (digits.length <= 2) return digits
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits.length === 0 ? '' : `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
}

function isFormValid(fields: ClientFields, tipo: ClientTipo): boolean {
  if (!fields.cliente_nome.trim()) return false
  const docValid = tipo === 'PF' ? validateCpf(fields.cliente_documento) : validateCnpj(fields.cliente_documento)
  if (!docValid) return false
  if (!fields.cliente_endereco.trim()) return false
  if (fields.cliente_email.trim() && !validateEmail(fields.cliente_email)) return false
  if (fields.cliente_telefone.trim() && !validatePhone(fields.cliente_telefone)) return false
  if (tipo === 'PJ') {
    if (!fields.razao_social.trim()) return false
    if (!fields.nome_representante_legal.trim()) return false
  }
  return true
}

export function ClientFormPage() {
  const navigate = useNavigate()
  const { updateStep, steps } = useFormStore()
  const savedStep = steps['client'] as (Partial<ClientFields> & { cliente_tipo?: ClientTipo }) | undefined
  const [clientTipo, setClientTipo] = useState<ClientTipo>(savedStep?.cliente_tipo ?? 'PF')
  const [fields, setFields] = useState<ClientFields>({
    cliente_nome: savedStep?.cliente_nome ?? '',
    cliente_documento: savedStep?.cliente_documento ?? '',
    cliente_endereco: savedStep?.cliente_endereco ?? '',
    cliente_email: savedStep?.cliente_email ?? '',
    cliente_telefone: savedStep?.cliente_telefone ?? '',
    razao_social: savedStep?.razao_social ?? '',
    nome_representante_legal: savedStep?.nome_representante_legal ?? '',
  })
  function handleTypeChange(tipo: ClientTipo) {
    setClientTipo(tipo)
    setFields((prev) => ({
      ...prev,
      cliente_documento: '',
      razao_social: '',
      nome_representante_legal: '',
    }))
  }
  function handleChange(field: keyof ClientFields, value: string) {
    let masked = value
    if (field === 'cliente_documento') {
      masked = clientTipo === 'PF' ? applyCpfMask(value) : applyCnpjMask(value)
    }
    if (field === 'cliente_telefone') masked = applyPhoneMask(value)
    setFields((prev) => ({ ...prev, [field]: masked }))
  }
  function handleSubmit() {
    if (!isFormValid(fields, clientTipo)) return
    updateStep('client', {
      cliente_tipo: clientTipo,
      cliente_nome: fields.cliente_nome,
      cliente_documento: fields.cliente_documento,
      cliente_endereco: fields.cliente_endereco,
      cliente_email: fields.cliente_email,
      cliente_telefone: fields.cliente_telefone,
      razao_social: fields.razao_social,
      nome_representante_legal: fields.nome_representante_legal,
    })
    navigate('/projeto')
  }
  function handleBack() {
    navigate('/formulario')
  }
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Dados do Cliente</h1>
      <p className={styles.subtitle}>Preencha os dados do cliente contratante.</p>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        noValidate
      >
        <fieldset className={styles.radioGroup}>
          <legend>Tipo de Pessoa</legend>
          <label>
            <input
              type="radio"
              name="clientTipo"
              value="PF"
              checked={clientTipo === 'PF'}
              onChange={() => handleTypeChange('PF')}
            />
            {' '}Pessoa Física
          </label>
          <label>
            <input
              type="radio"
              name="clientTipo"
              value="PJ"
              checked={clientTipo === 'PJ'}
              onChange={() => handleTypeChange('PJ')}
            />
            {' '}Pessoa Jurídica
          </label>
        </fieldset>
        <div className={styles.fieldGroup}>
          <label htmlFor="cliente_nome" className={styles.label}>
            Nome completo
          </label>
          <input
            id="cliente_nome"
            type="text"
            className={styles.input}
            value={fields.cliente_nome}
            onChange={(e) => handleChange('cliente_nome', e.target.value)}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="cliente_documento" className={styles.label}>
            {clientTipo === 'PF' ? 'CPF' : 'CNPJ'}
          </label>
          <input
            id="cliente_documento"
            type="text"
            className={styles.input}
            value={fields.cliente_documento}
            onChange={(e) => handleChange('cliente_documento', e.target.value)}
            placeholder={clientTipo === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="cliente_endereco" className={styles.label}>
            Endereço
          </label>
          <input
            id="cliente_endereco"
            type="text"
            className={styles.input}
            value={fields.cliente_endereco}
            onChange={(e) => handleChange('cliente_endereco', e.target.value)}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="cliente_email" className={styles.label}>
            E-mail (opcional)
          </label>
          <input
            id="cliente_email"
            type="email"
            className={styles.input}
            value={fields.cliente_email}
            onChange={(e) => handleChange('cliente_email', e.target.value)}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="cliente_telefone" className={styles.label}>
            Telefone (opcional)
          </label>
          <input
            id="cliente_telefone"
            type="tel"
            className={styles.input}
            value={fields.cliente_telefone}
            onChange={(e) => handleChange('cliente_telefone', e.target.value)}
            placeholder="(00) 00000-0000"
          />
        </div>
        {clientTipo === 'PJ' && (
          <>
            <div className={styles.fieldGroup}>
              <label htmlFor="razao_social" className={styles.label}>
                Razão Social
              </label>
              <input
                id="razao_social"
                type="text"
                className={styles.input}
                value={fields.razao_social}
                onChange={(e) => handleChange('razao_social', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="nome_representante_legal" className={styles.label}>
                Nome do Representante Legal
              </label>
              <input
                id="nome_representante_legal"
                type="text"
                className={styles.input}
                value={fields.nome_representante_legal}
                onChange={(e) => handleChange('nome_representante_legal', e.target.value)}
              />
            </div>
          </>
        )}
        <div className={styles.actions}>
          <button type="button" className={styles.backButton} onClick={handleBack}>
            Voltar
          </button>
          <button
            type="submit"
            className={styles.continueButton}
            disabled={!isFormValid(fields, clientTipo)}
          >
            Continuar
          </button>
        </div>
      </form>
    </main>
  )
}
