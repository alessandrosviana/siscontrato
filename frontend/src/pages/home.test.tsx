import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HomePage } from './home'
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

describe('HomePage', () => {
  it('renders the page heading', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { name: /siscontrato cau\/df/i })).toBeInTheDocument()
  })

  it('renders the DownloadPdfButton component', () => {
    render(<HomePage />)
    expect(screen.getByTestId('download-pdf-button')).toBeInTheDocument()
  })

  it('renders download section with accessible label', () => {
    render(<HomePage />)
    expect(screen.getByRole('region', { name: /download do contrato/i })).toBeInTheDocument()
  })

  it('passes merged form steps as payload to DownloadPdfButton', () => {
    useFormStore.setState({
      steps: {
        step1: { cliente_nome: 'Maria Silva', cliente_documento: '123.456.789-00' },
        step2: { arquiteto_nome: 'João Arquiteto' },
      },
    })
    render(<HomePage />)
    const btn = screen.getByTestId('download-pdf-button')
    const payload = JSON.parse(btn.getAttribute('data-payload') ?? '{}')
    expect(payload.cliente_nome).toBe('Maria Silva')
    expect(payload.arquiteto_nome).toBe('João Arquiteto')
  })
})
