import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useFormStore } from '../store/form-store'
import { DownloadPdfButton } from '../components/download-pdf-button'
import { buildPayload } from '../utils/build-payload'
import styles from './result-page.module.css'

type PreviewState = 'loading' | 'error' | 'success'

const EDIT_LINKS = [
  { label: 'Dados do Arquiteto', route: '/formulario' },
  { label: 'Dados do Contratante', route: '/contratante' },
  { label: 'Dados do Projeto', route: '/projeto' },
  { label: 'Escopo dos Serviços', route: '/escopo' },
  { label: 'Serviços Adicionais', route: '/servicos-adicionais' },
  { label: 'Honorários e Prazos', route: '/honorarios' },
  { label: 'Cláusulas Opcionais', route: '/clausulas' },
]

export function ResultPage() {
  const steps = useFormStore((s) => s.steps)
  const isFinalized = useFormStore((s) => s.isFinalized)
  const updateStep = useFormStore((s) => s.updateStep)
  const navigate = useNavigate()
  const [previewState, setPreviewState] = useState<PreviewState>('loading')
  const [previewHtml, setPreviewHtml] = useState<string>('')
  const [showAddClauseModal, setShowAddClauseModal] = useState(false)
  const [newClauseText, setNewClauseText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  async function loadPreview() {
    setPreviewState('loading')
    try {
      const payload = buildPayload(steps)
      const res = await fetch('/api/contratos/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const { html } = await res.json() as { html: string }
      setPreviewHtml(html)
      setPreviewState('success')
    } catch (err) {
      console.error('Failed to load contract preview', { error: err instanceof Error ? err.message : 'Unknown error' })
      setPreviewState('error')
    }
  }

  useEffect(() => {
    loadPreview()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (showAddClauseModal) {
      textareaRef.current?.focus()
    }
  }, [showAddClauseModal])

  function handleOpenModal() {
    setShowAddClauseModal(true)
  }

  function handleCloseModal() {
    setShowAddClauseModal(false)
    setNewClauseText('')
  }

  function handleConfirmClause() {
    if (!newClauseText.trim()) {
      setShowAddClauseModal(false)
      return
    }
    const existing = (steps['optional-clauses']?.clausulas_personalizadas as string[]) ?? []
    updateStep('optional-clauses', {
      ...steps['optional-clauses'],
      clausulas_personalizadas: [...existing, newClauseText.trim()],
    })
    setShowAddClauseModal(false)
    setNewClauseText('')
    loadPreview()
  }

  function handleEditLink(route: string) {
    navigate(route)
  }

  function renderPreviewArea() {
    if (previewState === 'loading') {
      return (
        <div className={styles.previewLoading} aria-busy="true" role="status">
          Carregando preview…
        </div>
      )
    }
    if (previewState === 'error') {
      return (
        <div className={styles.previewError}>
          <p>Erro ao carregar o preview do contrato.</p>
          <button onClick={loadPreview}>Tentar novamente</button>
        </div>
      )
    }
    return (
      <div
        className={styles.previewContent}
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>CAU/DF</span>
      </header>
      <div className={styles.topBar}>
        <h1 className={styles.pageTitle}>Revisão do Contrato</h1>
        <button
          className={styles.addClauseButton}
          onClick={handleOpenModal}
          disabled={isFinalized}
        >
          + Adicionar cláusula
        </button>
      </div>
      <div className={styles.body}>
        {previewState === 'success' && (
          <nav className={styles.sidebar} aria-label="Editar seções do contrato">
            <span className={styles.sidebarTitle}>Editar seção</span>
            {EDIT_LINKS.map(({ label, route }) => (
              <button
                key={route}
                className={styles.sidebarLink}
                onClick={() => handleEditLink(route)}
              >
                {label}
              </button>
            ))}
          </nav>
        )}
        <div className={styles.previewArea} aria-busy={previewState === 'loading'}>
          {renderPreviewArea()}
        </div>
      </div>
      <div className={styles.actions}>
        <DownloadPdfButton payload={buildPayload(steps)} onSuccess={() => navigate('/concluido')} />
      </div>
      {showAddClauseModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.modalTitle} id="modal-title">
              Adicionar cláusula personalizada
            </h2>
            <textarea
              ref={textareaRef}
              className={styles.modalTextarea}
              value={newClauseText}
              onChange={(e) => setNewClauseText(e.target.value)}
              placeholder="Digite a cláusula personalizada…"
              aria-label="Texto da cláusula personalizada"
            />
            <div className={styles.modalActions}>
              <button className={styles.modalCancelButton} onClick={handleCloseModal}>
                Cancelar
              </button>
              <button className={styles.modalConfirmButton} onClick={handleConfirmClause}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
