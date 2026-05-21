import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useFormStore } from '../store/form-store'
import styles from './project-form-page.module.css'

interface ProjectFields {
  tipo_contrato: string
  tipo_servico: string
  tipo_projeto: string
  endereco_projeto: string
  area_projeto: string
}

const TIPO_CONTRATO_OPTIONS = ['Prestação de Serviço', 'Empreitada']
const TIPO_SERVICO_OPTIONS = ['projeto', 'reforma', 'reforma de interiores']
const TIPOLOGIA_OPTIONS = ['residencial', 'comercial', 'corporativa', 'institucional', 'outros']

function isFormValid(fields: ProjectFields): boolean {
  if (!fields.tipo_contrato) return false
  if (!fields.tipo_servico) return false
  if (!fields.tipo_projeto) return false
  if (!fields.endereco_projeto.trim()) return false
  if (fields.area_projeto.trim()) {
    const val = parseFloat(fields.area_projeto)
    if (isNaN(val) || val <= 0) return false
  }
  return true
}

export function ProjectFormPage() {
  const navigate = useNavigate()
  const { updateStep, steps } = useFormStore()
  const savedProject = steps['project'] as Partial<ProjectFields> | undefined
  const savedPackage = steps['package'] as { tipo_servico?: string; tipo_projeto?: string } | undefined
  const [suggestedFields] = useState<Set<string>>(() =>
    savedProject ? new Set() : new Set(['tipo_servico', 'tipo_projeto'])
  )
  const [fields, setFields] = useState<ProjectFields>({
    tipo_contrato: savedProject?.tipo_contrato ?? '',
    tipo_servico: savedProject?.tipo_servico ?? savedPackage?.tipo_servico ?? '',
    tipo_projeto: savedProject?.tipo_projeto ?? savedPackage?.tipo_projeto ?? '',
    endereco_projeto: savedProject?.endereco_projeto ?? '',
    area_projeto: savedProject?.area_projeto ?? '',
  })
  function handleChange(field: keyof ProjectFields, value: string) {
    setFields((prev) => ({ ...prev, [field]: value }))
  }
  function handleSubmit() {
    if (!isFormValid(fields)) return
    updateStep('project', {
      tipo_contrato: fields.tipo_contrato,
      tipo_servico: fields.tipo_servico,
      tipo_projeto: fields.tipo_projeto,
      endereco_projeto: fields.endereco_projeto,
      area_projeto: fields.area_projeto,
    })
    navigate('/escopo')
  }
  function handleBack() {
    navigate('/contratante')
  }
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Dados do Projeto</h1>
      <p className={styles.subtitle}>Preencha os dados do projeto objeto do contrato.</p>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        noValidate
      >
        <div className={styles.fieldGroup}>
          <label htmlFor="tipo_contrato" className={styles.label}>
            Tipo de Contrato
          </label>
          <select
            id="tipo_contrato"
            className={styles.select}
            value={fields.tipo_contrato}
            onChange={(e) => handleChange('tipo_contrato', e.target.value)}
          >
            <option value="">Selecione...</option>
            {TIPO_CONTRATO_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="tipo_servico" className={styles.label}>
            Tipo de Serviço
            {suggestedFields.has('tipo_servico') && (
              <span className={styles.suggestionTag}>(sugestão do pacote)</span>
            )}
          </label>
          <select
            id="tipo_servico"
            className={styles.select}
            value={fields.tipo_servico}
            onChange={(e) => handleChange('tipo_servico', e.target.value)}
          >
            <option value="">Selecione...</option>
            {TIPO_SERVICO_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="tipo_projeto" className={styles.label}>
            Tipologia
            {suggestedFields.has('tipo_projeto') && (
              <span className={styles.suggestionTag}>(sugestão do pacote)</span>
            )}
          </label>
          <select
            id="tipo_projeto"
            className={styles.select}
            value={fields.tipo_projeto}
            onChange={(e) => handleChange('tipo_projeto', e.target.value)}
          >
            <option value="">Selecione...</option>
            {TIPOLOGIA_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="endereco_projeto" className={styles.label}>
            Endereço do Projeto
          </label>
          <input
            id="endereco_projeto"
            type="text"
            className={styles.input}
            value={fields.endereco_projeto}
            onChange={(e) => handleChange('endereco_projeto', e.target.value)}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="area_projeto" className={styles.label}>
            Área do Projeto — opcional
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="area_projeto"
              type="text"
              inputMode="decimal"
              className={styles.input}
              value={fields.area_projeto}
              onChange={(e) => handleChange('area_projeto', e.target.value)}
            />
            <span className={styles.inputSuffix}>m²</span>
          </div>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.backButton} onClick={handleBack}>
            Voltar
          </button>
          <button
            type="submit"
            className={styles.continueButton}
            disabled={!isFormValid(fields)}
          >
            Continuar
          </button>
        </div>
      </form>
    </main>
  )
}
