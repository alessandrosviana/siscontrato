import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useFormStore } from '../store/form-store'
import { DownloadPdfButton } from '../components/download-pdf-button'
import { buildPayload } from '../utils/build-payload'
import styles from './completion-page.module.css'

export function CompletionPage() {
  const steps = useFormStore((s) => s.steps)
  const isFinalized = useFormStore((s) => s.isFinalized)
  const resetForm = useFormStore((s) => s.resetForm)
  const navigate = useNavigate()
  const [showGovBrModal, setShowGovBrModal] = useState(false)
  const govBrButtonRef = useRef<HTMLButtonElement>(null)
  const modalFirstFocusRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!isFinalized) {
      navigate('/resultado', { replace: true })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (showGovBrModal) {
      modalFirstFocusRef.current?.focus()
    }
  }, [showGovBrModal])

  function handleOpenModal() {
    setShowGovBrModal(true)
  }

  function handleCloseModal() {
    setShowGovBrModal(false)
    govBrButtonRef.current?.focus()
  }

  function handleModalKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      handleCloseModal()
      return
    }
    if (e.key === 'Tab') {
      const focusableElements = Array.from(
        e.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      )
      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
  }

  function handleNewContract() {
    resetForm()
    navigate('/')
  }

  return (
    <main className={styles.container}>
      <div className={styles.successBanner}>
        <h1 className={styles.successTitle}>Seu contrato foi gerado com sucesso!</h1>
        <p className={styles.storageWarning}>
          Salve o documento. Esta plataforma não armazena contratos gerados.
        </p>
      </div>
      <div className={styles.actions}>
        <DownloadPdfButton payload={buildPayload(steps)} />
        <button
          ref={govBrButtonRef}
          className={styles.govBrButton}
          onClick={handleOpenModal}
        >
          Encaminhar para assinatura via gov.br
        </button>
        <button
          className={styles.newContractButton}
          onClick={handleNewContract}
        >
          Gerar novo contrato
        </button>
      </div>
      {showGovBrModal && (
        <div className={styles.modalOverlay}>
          <div
            className={styles.modalContent}
            role="dialog"
            aria-modal="true"
            aria-labelledby="govbr-modal-title"
            onKeyDown={handleModalKeyDown}
          >
            <h2 id="govbr-modal-title" className={styles.modalTitle}>
              Como assinar via gov.br
            </h2>
            <ol className={styles.modalList}>
              <li>Acesse assinador.iti.br</li>
              <li>Faça login com sua conta gov.br</li>
              <li>Envie o PDF gerado</li>
              <li>Assine digitalmente</li>
            </ol>
            <a
              ref={modalFirstFocusRef}
              href="https://assinador.iti.br/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Acessar assinador.iti.br (abre em nova aba)"
              className={styles.modalLink}
            >
              Acessar assinador.iti.br
            </a>
            <button className={styles.modalCloseButton} onClick={handleCloseModal}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
