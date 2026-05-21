import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useFormStore } from '../store/form-store'
import styles from './additional-services-page.module.css'

const ADDITIONAL_SERVICES = ['Gestão de obra', 'Acompanhamento de obra', 'Fiscalização de obra']

const ALERT_MESSAGE =
  'Serviços adicionais impactam o prazo e os honorários. Lembre-se de revisá-los nas etapas seguintes.'

export function formatServicosAdicionais(selected: string[], desc: string): string {
  if (selected.length === 0) return ''
  const base = selected.join(', ')
  return desc.trim() ? `${base}. Descrição: ${desc.trim()}` : base
}

export function AdditionalServicesPage() {
  const navigate = useNavigate()
  const { updateStep, steps } = useFormStore()
  const savedStep = steps['additional-services'] as
    | { selected_services?: string[]; description?: string }
    | undefined
  const [selectedServices, setSelectedServices] = useState<string[]>(
    savedStep?.selected_services ?? []
  )
  const [description, setDescription] = useState<string>(savedStep?.description ?? '')
  function handleToggleService(service: string) {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    )
  }
  function handleSubmit() {
    updateStep('additional-services', {
      servicos_adicionais: formatServicosAdicionais(selectedServices, description),
      selected_services: selectedServices,
      description,
    })
    navigate('/resultado')
  }
  function handleBack() {
    navigate('/escopo')
  }
  const hasSelection = selectedServices.length > 0
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Serviços Adicionais</h1>
      <p className={styles.subtitle}>Selecione os serviços adicionais, se houver.</p>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        noValidate
      >
        <fieldset className={styles.fieldGroup}>
          <legend className={styles.label}>Serviços Adicionais</legend>
          <div className={styles.checkboxGroup}>
            {ADDITIONAL_SERVICES.map((service) => (
              <label key={service} htmlFor={`service-${service}`} className={styles.checkbox}>
                <input
                  id={`service-${service}`}
                  type="checkbox"
                  checked={selectedServices.includes(service)}
                  onChange={() => handleToggleService(service)}
                />
                {service}
              </label>
            ))}
          </div>
        </fieldset>
        {hasSelection && (
          <p className={styles.alert} role="alert">{ALERT_MESSAGE}</p>
        )}
        {hasSelection && (
          <div className={styles.fieldGroup}>
            <label htmlFor="descricao_servico_adicional" className={styles.label}>
              Descrição dos Serviços Adicionais
            </label>
            <textarea
              id="descricao_servico_adicional"
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        )}
        <div className={styles.actions}>
          <button type="button" className={styles.backButton} onClick={handleBack}>
            Voltar
          </button>
          <button type="submit" className={styles.continueButton}>
            Continuar
          </button>
        </div>
      </form>
    </main>
  )
}
