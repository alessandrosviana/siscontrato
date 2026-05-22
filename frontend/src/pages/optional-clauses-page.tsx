import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useFormStore } from '../store/form-store'
import styles from './optional-clauses-page.module.css'

interface Clausula {
  slug: string
  titulo: string
  texto: string
  categoria: string
}

interface CustomClause {
  id: string
  text: string
}

type FetchState = 'loading' | 'error' | 'success'

export function OptionalClausesPage() {
  const navigate = useNavigate()
  const { steps, updateStep } = useFormStore()
  const savedStep = steps['optional-clauses'] as
    | { clausulas_opcionais?: string[]; clausulas_personalizadas?: string[] }
    | undefined
  const [fetchState, setFetchState] = useState<FetchState>('loading')
  const [clausulas, setClausulas] = useState<Clausula[]>([])
  const [activeSlugs, setActiveSlugs] = useState<Set<string>>(() => {
    const saved = savedStep?.clausulas_opcionais ?? []
    return new Set(saved)
  })
  const [expandedSlugs, setExpandedSlugs] = useState<Set<string>>(new Set())
  const [customClauses, setCustomClauses] = useState<CustomClause[]>(() => {
    const saved = savedStep?.clausulas_personalizadas ?? []
    return saved.map((text) => ({ id: crypto.randomUUID(), text }))
  })
  const loadClausulas = useCallback(() => {
    setFetchState('loading')
    fetch('/api/clausulas?obrigatoria=false')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data: Clausula[]) => {
        setClausulas(data)
        setFetchState('success')
      })
      .catch((err) => {
        console.error('Failed to load optional clauses', { error: err instanceof Error ? err.message : 'Unknown error' })
        setFetchState('error')
      })
  }, [])
  useEffect(() => {
    loadClausulas()
  }, [loadClausulas])
  function toggleSlug(slug: string) {
    if (activeSlugs.has(slug)) {
      setActiveSlugs(new Set([...activeSlugs].filter((s) => s !== slug)))
    } else {
      setActiveSlugs(new Set([...activeSlugs, slug]))
    }
  }
  function toggleExpanded(slug: string) {
    if (expandedSlugs.has(slug)) {
      setExpandedSlugs(new Set([...expandedSlugs].filter((s) => s !== slug)))
    } else {
      setExpandedSlugs(new Set([...expandedSlugs, slug]))
    }
  }
  function addCustomClause() {
    setCustomClauses((prev) => [...prev, { id: crypto.randomUUID(), text: '' }])
  }
  function removeCustomClause(id: string) {
    setCustomClauses((prev) => prev.filter((c) => c.id !== id))
  }
  function updateCustomClauseText(id: string, value: string) {
    setCustomClauses((prev) => prev.map((c) => (c.id === id ? { ...c, text: value } : c)))
  }
  function handleSubmit() {
    updateStep('optional-clauses', {
      clausulas_opcionais: Array.from(activeSlugs),
      clausulas_personalizadas: customClauses.map((c) => c.text.trim()).filter(Boolean),
    })
    navigate('/resultado')
  }
  function handleBack() {
    navigate('/honorarios')
  }
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Cláusulas Opcionais</h1>
      <p className={styles.subtitle}>
        Selecione as cláusulas que deseja incluir no contrato e adicione cláusulas personalizadas se necessário.
      </p>
      <div aria-live="polite" aria-atomic="true">
        {fetchState === 'loading' && (
          <p className={styles.alert} role="status">
            Carregando cláusulas...
          </p>
        )}
        {fetchState === 'error' && (
          <div className={styles.errorAlert} role="alert">
            <span>Erro ao carregar as cláusulas. Verifique sua conexão e tente novamente.</span>
            <button className={styles.retryButton} onClick={loadClausulas}>
              Tentar novamente
            </button>
          </div>
        )}
      </div>
      {fetchState === 'success' && (
        <div className={styles.form}>
          <div className={styles.fieldGroup}>
            {clausulas.map((clausula) => {
              const isActive = activeSlugs.has(clausula.slug)
              const isExpanded = expandedSlugs.has(clausula.slug)
              return (
                <div key={clausula.slug} className={styles.clausulaItem}>
                  <div className={styles.clausulaHeader}>
                    <span className={styles.clausulaTitulo}>{clausula.titulo}</span>
                    <div className={styles.clausulaControls}>
                      <button
                        type="button"
                        className={styles.accordionButton}
                        aria-expanded={isExpanded}
                        aria-controls={`texto-${clausula.slug}`}
                        onClick={() => toggleExpanded(clausula.slug)}
                      >
                        {isExpanded ? 'Ocultar texto' : 'Ver texto'}
                      </button>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isActive}
                        className={styles.toggleButton}
                        aria-label={`Ativar cláusula: ${clausula.titulo}`}
                        onClick={() => toggleSlug(clausula.slug)}
                      />
                    </div>
                  </div>
                  <p
                    id={`texto-${clausula.slug}`}
                    className={styles.clausulaTexto}
                    hidden={!isExpanded}
                  >
                    {clausula.texto}
                  </p>
                </div>
              )
            })}
          </div>
          <div className={styles.fieldGroup}>
            {customClauses.map((clause, index) => {
              const labelId = `custom-clause-label-${clause.id}`
              const inputId = `custom-clause-input-${clause.id}`
              return (
                <div key={clause.id} className={styles.customClauseWrapper}>
                  <div className={styles.customClauseHeader}>
                    <label id={labelId} htmlFor={inputId} className={styles.label}>
                      Cláusula personalizada {index + 1}
                    </label>
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeCustomClause(clause.id)}
                      aria-label={`Remover cláusula personalizada ${index + 1}`}
                    >
                      Remover
                    </button>
                  </div>
                  <textarea
                    id={inputId}
                    className={styles.textarea}
                    value={clause.text}
                    onChange={(e) => updateCustomClauseText(clause.id, e.target.value)}
                    rows={4}
                  />
                </div>
              )
            })}
            <button type="button" className={styles.addButton} onClick={addCustomClause}>
              + Adicionar cláusula personalizada
            </button>
          </div>
        </div>
      )}
      <div className={styles.actions}>
        <button type="button" className={styles.backButton} onClick={handleBack}>
          Voltar
        </button>
        <button
          type="button"
          className={styles.continueButton}
          onClick={handleSubmit}
          disabled={fetchState === 'loading'}
        >
          Continuar
        </button>
      </div>
    </main>
  )
}
