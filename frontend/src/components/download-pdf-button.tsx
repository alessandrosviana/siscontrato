import { useState } from 'react'
import { useFormStore } from '../store/form-store'
import type { ContratoPayload } from '../types/contrato'
import styles from './download-pdf-button.module.css'

type DownloadState = 'idle' | 'loading' | 'error'

interface Props {
  payload: ContratoPayload
  onSuccess?: () => void
}

export function DownloadPdfButton({ payload, onSuccess }: Props) {
  const [state, setState] = useState<DownloadState>('idle')

  async function handleDownload() {
    setState('loading')
    try {
      const res = await fetch('/api/pdf/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const tipoServico = (payload.tipo_servico ?? 'contrato')
        .toLowerCase().replace(/\s+/g, '-')
      a.download = `contrato-${tipoServico}-${new Date().toISOString().slice(0, 10)}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      useFormStore.getState().finalizeForm()
      onSuccess?.()
      setState('idle')
    } catch (err) {
      console.error('PDF download failed', { error: err instanceof Error ? err.message : 'Unknown error' })
      setState('error')
    }
  }

  const buttonClass =
    state === 'loading' ? styles.buttonLoading
    : state === 'error' ? styles.buttonError
    : styles.button

  const label =
    state === 'idle' ? 'Baixar PDF'
    : state === 'loading' ? 'Gerando PDF…'
    : 'Erro — tentar novamente'

  return (
    <div className={styles.wrapper}>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {state === 'loading' && 'Gerando PDF, aguarde...'}
      </div>
      <button
        className={buttonClass}
        onClick={handleDownload}
        disabled={state === 'loading'}
        aria-label="Baixar contrato em PDF"
        aria-busy={state === 'loading'}
      >
        {state === 'loading' && <span className={styles.spinner} aria-hidden="true" />}
        {label}
      </button>
      {state === 'error' && (
        <p className={styles.errorMessage} role="alert">
          Falha ao gerar o PDF. Verifique sua conexão e tente novamente.
        </p>
      )}
    </div>
  )
}
