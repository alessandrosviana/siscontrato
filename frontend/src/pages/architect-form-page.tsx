import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useFormStore } from '../store/form-store'
import { validateCau, validateCnpj, validateCpf, validateEmail, validatePhone } from '../utils/validators'
import { FormShell } from '../components/form-shell'
import styles from './architect-form-page.module.css'

interface ArchitectFields {
  arquiteto_nome: string
  arquiteto_cpf: string
  arquiteto_cnpj: string
  registro_cau: string
  arquiteto_endereco: string
  arquiteto_email: string
  arquiteto_telefone: string
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

function validateFields(fields: ArchitectFields): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!fields.arquiteto_nome.trim()) {
    errors.arquiteto_nome = 'Nome é obrigatório'
  }
  const cpfFilled = fields.arquiteto_cpf.trim().length > 0
  const cnpjFilled = fields.arquiteto_cnpj.trim().length > 0
  if (!cpfFilled && !cnpjFilled) {
    errors.arquiteto_cpf = 'Informe pelo menos CPF ou CNPJ válido'
  } else {
    if (cpfFilled && !validateCpf(fields.arquiteto_cpf)) {
      errors.arquiteto_cpf = 'CPF inválido'
    }
    if (cnpjFilled && !validateCnpj(fields.arquiteto_cnpj)) {
      errors.arquiteto_cnpj = 'CNPJ inválido'
    }
    if (!cpfFilled && cnpjFilled && validateCnpj(fields.arquiteto_cnpj)) {
      delete errors.arquiteto_cpf
    }
    if (cpfFilled && !cnpjFilled && validateCpf(fields.arquiteto_cpf)) {
      delete errors.arquiteto_cpf
    }
  }
  if (!fields.registro_cau.trim()) {
    errors.registro_cau = 'Registro CAU é obrigatório'
  } else if (!validateCau(fields.registro_cau)) {
    errors.registro_cau = 'Registro CAU inválido (ex: A12345-8)'
  }
  if (!fields.arquiteto_endereco.trim()) {
    errors.arquiteto_endereco = 'Endereço é obrigatório'
  }
  if (!fields.arquiteto_email.trim()) {
    errors.arquiteto_email = 'E-mail é obrigatório'
  } else if (!validateEmail(fields.arquiteto_email)) {
    errors.arquiteto_email = 'E-mail inválido'
  }
  if (!fields.arquiteto_telefone.trim()) {
    errors.arquiteto_telefone = 'Telefone é obrigatório'
  } else if (!validatePhone(fields.arquiteto_telefone)) {
    errors.arquiteto_telefone = 'Telefone inválido'
  }
  return errors
}

export function ArchitectFormPage() {
  const navigate = useNavigate()
  const { updateStep, steps } = useFormStore()
  const savedStep = steps['architect'] as Partial<ArchitectFields> | undefined
  const [fields, setFields] = useState<ArchitectFields>({
    arquiteto_nome: savedStep?.arquiteto_nome ?? '',
    arquiteto_cpf: savedStep?.arquiteto_cpf ?? '',
    arquiteto_cnpj: savedStep?.arquiteto_cnpj ?? '',
    registro_cau: savedStep?.registro_cau ?? '',
    arquiteto_endereco: savedStep?.arquiteto_endereco ?? '',
    arquiteto_email: savedStep?.arquiteto_email ?? '',
    arquiteto_telefone: savedStep?.arquiteto_telefone ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState<boolean>(false)
  const fieldRefs = useRef<Record<string, HTMLInputElement | null>>({})
  function handleChange(field: keyof ArchitectFields, value: string) {
    let masked = value
    if (field === 'arquiteto_cpf') masked = applyCpfMask(value)
    if (field === 'arquiteto_cnpj') masked = applyCnpjMask(value)
    if (field === 'arquiteto_telefone') masked = applyPhoneMask(value)
    const updated = { ...fields, [field]: masked }
    setFields(updated)
    if (submitted) {
      setErrors(validateFields(updated))
    }
  }
  function handleSubmit() {
    setSubmitted(true)
    const validationErrors = validateFields(fields)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      const firstErrorField = Object.keys(validationErrors)[0]
      fieldRefs.current[firstErrorField]?.focus()
      return
    }
    updateStep('architect', {
      arquiteto_nome: fields.arquiteto_nome,
      arquiteto_cpf: fields.arquiteto_cpf,
      arquiteto_cnpj: fields.arquiteto_cnpj,
      registro_cau: fields.registro_cau,
      arquiteto_endereco: fields.arquiteto_endereco,
      arquiteto_email: fields.arquiteto_email,
      arquiteto_telefone: fields.arquiteto_telefone,
    })
    navigate('/contratante')
  }
  function handleBack() {
    navigate('/pacote')
  }
  function getFieldProps(field: keyof ArchitectFields) {
    const errorId = `${field}-error`
    const hasError = submitted && !!errors[field]
    return {
      id: field,
      'aria-describedby': hasError ? errorId : undefined,
      'aria-invalid': hasError ? ('true' as const) : undefined,
      ref: (el: HTMLInputElement | null) => {
        fieldRefs.current[field] = el
      },
    }
  }
  return (
    <FormShell
      step={2}
      title="Dados do Arquiteto"
      subtitle="Preencha seus dados profissionais para o contrato."
    >
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        noValidate
      >
        <div className={styles.fieldGroup}>
          <label htmlFor="arquiteto_nome" className={styles.label}>
            Nome completo
          </label>
          <input
            type="text"
            className={styles.input}
            value={fields.arquiteto_nome}
            onChange={(e) => handleChange('arquiteto_nome', e.target.value)}
            {...getFieldProps('arquiteto_nome')}
          />
          {submitted && errors.arquiteto_nome && (
            <span id="arquiteto_nome-error" className={styles.errorMessage} role="alert">
              {errors.arquiteto_nome}
            </span>
          )}
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="arquiteto_cpf" className={styles.label}>
            CPF
          </label>
          <input
            type="text"
            className={styles.input}
            value={fields.arquiteto_cpf}
            onChange={(e) => handleChange('arquiteto_cpf', e.target.value)}
            placeholder="000.000.000-00"
            {...getFieldProps('arquiteto_cpf')}
          />
          {submitted && errors.arquiteto_cpf && (
            <span id="arquiteto_cpf-error" className={styles.errorMessage} role="alert">
              {errors.arquiteto_cpf}
            </span>
          )}
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="arquiteto_cnpj" className={styles.label}>
            CNPJ
          </label>
          <input
            type="text"
            className={styles.input}
            value={fields.arquiteto_cnpj}
            onChange={(e) => handleChange('arquiteto_cnpj', e.target.value)}
            placeholder="00.000.000/0000-00"
            {...getFieldProps('arquiteto_cnpj')}
          />
          {submitted && errors.arquiteto_cnpj && (
            <span id="arquiteto_cnpj-error" className={styles.errorMessage} role="alert">
              {errors.arquiteto_cnpj}
            </span>
          )}
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="registro_cau" className={styles.label}>
            Registro CAU
          </label>
          <input
            type="text"
            className={styles.input}
            value={fields.registro_cau}
            onChange={(e) => handleChange('registro_cau', e.target.value)}
            placeholder="A12345-8"
            {...getFieldProps('registro_cau')}
          />
          {submitted && errors.registro_cau && (
            <span id="registro_cau-error" className={styles.errorMessage} role="alert">
              {errors.registro_cau}
            </span>
          )}
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="arquiteto_endereco" className={styles.label}>
            Endereço
          </label>
          <input
            type="text"
            className={styles.input}
            value={fields.arquiteto_endereco}
            onChange={(e) => handleChange('arquiteto_endereco', e.target.value)}
            {...getFieldProps('arquiteto_endereco')}
          />
          {submitted && errors.arquiteto_endereco && (
            <span id="arquiteto_endereco-error" className={styles.errorMessage} role="alert">
              {errors.arquiteto_endereco}
            </span>
          )}
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="arquiteto_email" className={styles.label}>
            E-mail
          </label>
          <input
            type="email"
            className={styles.input}
            value={fields.arquiteto_email}
            onChange={(e) => handleChange('arquiteto_email', e.target.value)}
            {...getFieldProps('arquiteto_email')}
          />
          {submitted && errors.arquiteto_email && (
            <span id="arquiteto_email-error" className={styles.errorMessage} role="alert">
              {errors.arquiteto_email}
            </span>
          )}
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="arquiteto_telefone" className={styles.label}>
            Telefone
          </label>
          <input
            type="tel"
            className={styles.input}
            value={fields.arquiteto_telefone}
            onChange={(e) => handleChange('arquiteto_telefone', e.target.value)}
            placeholder="(00) 00000-0000"
            {...getFieldProps('arquiteto_telefone')}
          />
          {submitted && errors.arquiteto_telefone && (
            <span id="arquiteto_telefone-error" className={styles.errorMessage} role="alert">
              {errors.arquiteto_telefone}
            </span>
          )}
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.backButton} onClick={handleBack}>
            Voltar
          </button>
          <button type="submit" className={styles.continueButton}>
            Continuar
          </button>
        </div>
      </form>
    </FormShell>
  )
}
