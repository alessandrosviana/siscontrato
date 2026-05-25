import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFormStore } from '../store/form-store'
import { CompletionPage } from './completion-page'
import type { ContratoPayload } from '../types/contrato'

const mockResetForm = vi.fn()
const mockNavigate = vi.fn()
let capturedPayload: ContratoPayload | undefined

vi.mock('../store/form-store', () => ({
  useFormStore: vi.fn(),
}))

vi.mock('react-router', () => ({
  useNavigate: vi.fn(() => mockNavigate),
}))

vi.mock('../components/download-pdf-button', () => ({
  DownloadPdfButton: ({ payload }: { payload: ContratoPayload }) => {
    capturedPayload = payload
    return <button>Baixar PDF</button>
  },
}))

const defaultStoreState = {
  steps: { project: { tipo_servico: 'projeto' } },
  isFinalized: true as boolean,
  resetForm: mockResetForm,
  currentStep: 0,
  setCurrentStep: vi.fn(),
  updateStep: vi.fn(),
  finalizeForm: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  capturedPayload = undefined
  vi.mocked(useFormStore).mockImplementation((selector) =>
    selector({ ...defaultStoreState, isFinalized: true, resetForm: mockResetForm })
  )
})

describe('CompletionPage', () => {
  it('cenário 1: guard redireciona para /resultado quando isFinalized é false', () => {
    vi.mocked(useFormStore).mockImplementation((selector) =>
      selector({ ...defaultStoreState, steps: {}, isFinalized: false })
    )
    render(<CompletionPage />)
    expect(mockNavigate).toHaveBeenCalledWith('/resultado', { replace: true })
  })

  it('cenário 2: mensagem de sucesso está visível', () => {
    render(<CompletionPage />)
    expect(screen.getByText('Seu contrato foi gerado com sucesso!')).toBeInTheDocument()
  })

  it('cenário 3: aviso de não-armazenamento está visível', () => {
    render(<CompletionPage />)
    expect(
      screen.getByText('Salve o documento. Esta plataforma não armazena contratos gerados.')
    ).toBeInTheDocument()
  })

  it('cenário 4: DownloadPdfButton está renderizado e recebe payload com dados do store', () => {
    render(<CompletionPage />)
    expect(screen.getByText('Baixar PDF')).toBeInTheDocument()
    expect(capturedPayload).toBeDefined()
    expect((capturedPayload as { tipo_servico: string }).tipo_servico).toBe('projeto')
  })

  it('cenário 5: clicar "Encaminhar para assinatura via gov.br" abre o modal', () => {
    render(<CompletionPage />)
    fireEvent.click(screen.getByText('Encaminhar para assinatura via gov.br'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('cenário 6: modal exibe lista ol com 4 itens', () => {
    render(<CompletionPage />)
    fireEvent.click(screen.getByText('Encaminhar para assinatura via gov.br'))
    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(4)
  })

  it('cenário 7: modal contém link para assinador.iti.br com target="_blank"', () => {
    render(<CompletionPage />)
    fireEvent.click(screen.getByText('Encaminhar para assinatura via gov.br'))
    const link = screen.getByRole('link', { name: /assinador\.iti\.br/i })
    expect(link).toHaveAttribute('href', expect.stringContaining('assinador.iti.br'))
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('cenário 8: clicar "Fechar" fecha o modal e retorna foco ao botão de origem', () => {
    render(<CompletionPage />)
    const govBrButton = screen.getByText('Encaminhar para assinatura via gov.br')
    fireEvent.click(govBrButton)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Fechar'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(govBrButton).toHaveFocus()
  })

  it('cenário 9: clicar "Gerar novo contrato" chama resetForm e navega para /', () => {
    render(<CompletionPage />)
    fireEvent.click(screen.getByText('Gerar novo contrato'))
    expect(mockResetForm).toHaveBeenCalledOnce()
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('cenário 10: pressionar Escape fecha o modal (BUG-01)', () => {
    render(<CompletionPage />)
    fireEvent.click(screen.getByText('Encaminhar para assinatura via gov.br'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('cenário 11: Tab no último elemento do modal vai para o primeiro (BUG-02)', () => {
    render(<CompletionPage />)
    fireEvent.click(screen.getByText('Encaminhar para assinatura via gov.br'))
    const dialog = screen.getByRole('dialog')
    const closeButton = screen.getByText('Fechar')
    closeButton.focus()
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: false })
    const link = screen.getByRole('link', { name: /assinador\.iti\.br/i })
    expect(link).toHaveFocus()
  })

  it('cenário 12: Shift+Tab no primeiro elemento do modal vai para o último (BUG-02)', () => {
    render(<CompletionPage />)
    fireEvent.click(screen.getByText('Encaminhar para assinatura via gov.br'))
    const dialog = screen.getByRole('dialog')
    const link = screen.getByRole('link', { name: /assinador\.iti\.br/i })
    link.focus()
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true })
    const closeButton = screen.getByText('Fechar')
    expect(closeButton).toHaveFocus()
  })
})
