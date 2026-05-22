import { useState } from 'react'
import { useFormStore } from '../store/form-store'
import type { ContratoPayload } from '../types/contrato'

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

  return (
    <div>
      <div aria-live="polite" aria-atomic="true">
        {state === 'loading' && <span className="sr-only">Gerando PDF, aguarde...</span>}
      </div>
      <button
        onClick={handleDownload}
        disabled={state === 'loading'}
        aria-label="Baixar contrato em PDF"
        aria-busy={state === 'loading'}
      >
        {state === 'idle' && 'Baixar PDF'}
        {state === 'loading' && 'Gerando PDF...'}
        {state === 'error' && 'Erro ao gerar PDF — tente novamente'}
      </button>
      {state === 'error' && (
        <p role="alert">Erro ao gerar PDF — tente novamente</p>
      )}
    </div>
  )
}
