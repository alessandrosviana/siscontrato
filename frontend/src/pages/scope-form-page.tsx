import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useFormStore } from '../store/form-store'
import { FormShell } from '../components/form-shell'
import styles from './scope-form-page.module.css'

interface ScopeFields {
  escopo_servicos: string
  numero_revisoes: string
}

function isFormValid(fields: ScopeFields, showNumeroRevisoes: boolean): boolean {
  if (!fields.escopo_servicos.trim()) return false
  if (showNumeroRevisoes) {
    const n = parseInt(fields.numero_revisoes, 10)
    if (isNaN(n) || n < 1 || String(n) !== fields.numero_revisoes.trim()) return false
  }
  return true
}

export function ScopeFormPage() {
  const navigate = useNavigate()
  const { updateStep, steps } = useFormStore()
  const savedScope = steps['scope'] as Partial<ScopeFields> | undefined
  const savedPackage = steps['package'] as { escopo_servicos?: string; numero_revisoes?: string; tipo_servico?: string } | undefined
  const tipoServico = (steps['project'] as { tipo_servico?: string } | undefined)?.tipo_servico
    ?? savedPackage?.tipo_servico
  const [showNumeroRevisoes] = useState<boolean>(() => tipoServico === 'projeto')
  const [suggestedFields] = useState<Set<string>>(() =>
    savedScope ? new Set() : new Set(['escopo_servicos', 'numero_revisoes'])
  )
  const [fields, setFields] = useState<ScopeFields>({
    escopo_servicos: savedScope?.escopo_servicos ?? savedPackage?.escopo_servicos ?? '',
    numero_revisoes: savedScope?.numero_revisoes ?? savedPackage?.numero_revisoes ?? '',
  })
  function handleChange(field: keyof ScopeFields, value: string) {
    setFields((prev) => ({ ...prev, [field]: value }))
  }
  function handleSubmit() {
    if (!isFormValid(fields, showNumeroRevisoes)) return
    updateStep('scope', {
      escopo_servicos: fields.escopo_servicos,
      numero_revisoes: fields.numero_revisoes,
    })
    navigate('/servicos-adicionais')
  }
  function handleBack() {
    navigate('/projeto')
  }
  return (
    <FormShell
      step={5}
      title="Escopo dos Serviços"
      subtitle="Descreva o escopo dos serviços contratados."
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
          <label htmlFor="escopo_servicos" className={styles.label}>
            Escopo dos Serviços
            {suggestedFields.has('escopo_servicos') && (
              <span className={styles.suggestionTag}>sugestão do pacote</span>
            )}
          </label>
          <textarea
            id="escopo_servicos"
            className={styles.textarea}
            value={fields.escopo_servicos}
            onChange={(e) => handleChange('escopo_servicos', e.target.value)}
            rows={6}
          />
        </div>
        {showNumeroRevisoes && (
          <div className={styles.fieldGroup}>
            <label htmlFor="numero_revisoes" className={styles.label}>
              Número de Revisões
              {suggestedFields.has('numero_revisoes') && (
                <span className={styles.suggestionTag}>sugestão do pacote</span>
              )}
            </label>
            <input
              id="numero_revisoes"
              type="text"
              inputMode="numeric"
              className={styles.input}
              value={fields.numero_revisoes}
              onChange={(e) => handleChange('numero_revisoes', e.target.value)}
            />
          </div>
        )}
        <div className={styles.actions}>
          <button type="button" className={styles.backButton} onClick={handleBack}>
            Voltar
          </button>
          <button
            type="submit"
            className={styles.continueButton}
            disabled={!isFormValid(fields, showNumeroRevisoes)}
          >
            Continuar
          </button>
        </div>
      </form>
    </FormShell>
  )
}
