import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ResultPage } from './result-page'
import { useFormStore } from '../store/form-store'

vi.mock('../components/download-pdf-button', () => ({
  DownloadPdfButton: ({ payload }: { payload: Record<string, unknown> }) => (
    <button data-testid="download-pdf-button" data-payload={JSON.stringify(payload)}>
      Baixar PDF
    </button>
  ),
}))

beforeEach(() => {
  useFormStore.setState({ isFinalized: false, currentStep: 0, steps: {} })
})

describe('ResultPage', () => {
  it('renders the DownloadPdfButton component', () => {
    render(<ResultPage />)
    expect(screen.getByTestId('download-pdf-button')).toBeInTheDocument()
  })

  it('renders download section with accessible label', () => {
    render(<ResultPage />)
    expect(screen.getByRole('region', { name: /download do contrato/i })).toBeInTheDocument()
  })

  it('passes merged form steps as payload to DownloadPdfButton', () => {
    useFormStore.setState({
      steps: {
        step1: { cliente_nome: 'Ana Arquiteta', cliente_documento: '987.654.321-00' },
        step2: { arquiteto_nome: 'Carlos Silva' },
      },
    })
    render(<ResultPage />)
    const btn = screen.getByTestId('download-pdf-button')
    const payload = JSON.parse(btn.getAttribute('data-payload') ?? '{}')
    expect(payload.cliente_nome).toBe('Ana Arquiteta')
    expect(payload.arquiteto_nome).toBe('Carlos Silva')
  })

  it('renders with empty payload when store has no steps', () => {
    render(<ResultPage />)
    const btn = screen.getByTestId('download-pdf-button')
    const payload = JSON.parse(btn.getAttribute('data-payload') ?? '{}')
    expect(payload).toEqual({})
  })

  it('renders the page heading', () => {
    render(<ResultPage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})
