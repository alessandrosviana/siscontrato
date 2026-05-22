import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ResultPage } from './result-page'

const mockUpdateStep = vi.fn()
const mockNavigate = vi.fn()
const mockStoreState = {
  steps: {},
  updateStep: mockUpdateStep,
  isFinalized: false,
  setCurrentStep: vi.fn(),
  resetForm: vi.fn(),
  finalizeForm: vi.fn(),
}

vi.mock('../store/form-store', () => ({
  useFormStore: vi.fn((selector) => selector(mockStoreState)),
}))

vi.mock('react-router', () => ({
  useNavigate: vi.fn(() => mockNavigate),
}))

vi.mock('../components/download-pdf-button', () => ({
  DownloadPdfButton: ({ onSuccess }: { onSuccess?: () => void }) => (
    <button data-testid="download-btn" onClick={onSuccess}>Gerar contrato</button>
  ),
}))

function makeFetchSuccess() {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ html: '<p>Preview do contrato</p>' }),
  })
}

function makeFetchError() {
  return vi.fn().mockResolvedValue({
    ok: false,
    json: () => Promise.resolve({}),
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  mockStoreState.steps = {}
  mockStoreState.isFinalized = false
})

describe('ResultPage', () => {
  it('cenário 1: exibe indicador de carregamento antes do fetch resolver', () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})))
    render(<ResultPage />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText(/carregando preview/i)).toBeInTheDocument()
  })

  it('cenário 2: renderiza o preview HTML após fetch bem-sucedido', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    render(<ResultPage />)
    await waitFor(() => {
      expect(screen.getByText('Preview do contrato')).toBeInTheDocument()
    })
  })

  it('cenário 3: exibe mensagem de erro quando fetch retorna ok: false', async () => {
    vi.stubGlobal('fetch', makeFetchError())
    render(<ResultPage />)
    await waitFor(() => {
      expect(screen.getByText(/erro ao carregar/i)).toBeInTheDocument()
    })
  })

  it('cenário 4: clicar "Tentar novamente" refaz o fetch (fetch chamado 2 vezes)', async () => {
    const fetchMock = makeFetchError()
    vi.stubGlobal('fetch', fetchMock)
    render(<ResultPage />)
    await waitFor(() => {
      expect(screen.getByText(/tentar novamente/i)).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText(/tentar novamente/i))
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })
  })

  it('cenário 5: renderiza os 7 links de edição na barra lateral', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    render(<ResultPage />)
    await waitFor(() => {
      expect(screen.getByText('Dados do Arquiteto')).toBeInTheDocument()
    })
    expect(screen.getByText('Dados do Contratante')).toBeInTheDocument()
    expect(screen.getByText('Dados do Projeto')).toBeInTheDocument()
    expect(screen.getByText('Escopo dos Serviços')).toBeInTheDocument()
    expect(screen.getByText('Serviços Adicionais')).toBeInTheDocument()
    expect(screen.getByText('Honorários e Prazos')).toBeInTheDocument()
    expect(screen.getByText('Cláusulas Opcionais')).toBeInTheDocument()
  })

  it('cenário 6: clicar link Editar chama navigate com a rota correta', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    render(<ResultPage />)
    await waitFor(() => {
      expect(screen.getByText('Dados do Arquiteto')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Dados do Arquiteto'))
    expect(mockNavigate).toHaveBeenCalledWith('/formulario')
    fireEvent.click(screen.getByText('Dados do Contratante'))
    expect(mockNavigate).toHaveBeenCalledWith('/contratante')
  })

  it('cenário 7: clicar "Adicionar cláusula" abre modal com role="dialog"', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    render(<ResultPage />)
    await waitFor(() => {
      expect(screen.getByText('Preview do contrato')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Adicionar cláusula'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('cenário 8: cancelar modal fecha sem chamar updateStep', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    render(<ResultPage />)
    await waitFor(() => {
      expect(screen.getByText('Preview do contrato')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Adicionar cláusula'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Cancelar'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(mockUpdateStep).not.toHaveBeenCalled()
  })

  it('cenário 9: confirmar modal com texto chama updateStep e recarrega o preview', async () => {
    const fetchMock = makeFetchSuccess()
    vi.stubGlobal('fetch', fetchMock)
    render(<ResultPage />)
    await waitFor(() => {
      expect(screen.getByText('Preview do contrato')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Adicionar cláusula'))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Cláusula extra de teste' } })
    fireEvent.click(screen.getByText('Confirmar'))
    expect(mockUpdateStep).toHaveBeenCalledWith(
      'optional-clauses',
      expect.objectContaining({
        clausulas_personalizadas: ['Cláusula extra de teste'],
      })
    )
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('cenário 10: confirmar modal vazio não chama updateStep e fecha o modal', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    render(<ResultPage />)
    await waitFor(() => {
      expect(screen.getByText('Preview do contrato')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Adicionar cláusula'))
    fireEvent.click(screen.getByText('Confirmar'))
    expect(mockUpdateStep).not.toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('cenário 11: isFinalized=true desabilita "Adicionar cláusula"', async () => {
    mockStoreState.isFinalized = true
    vi.stubGlobal('fetch', makeFetchSuccess())
    render(<ResultPage />)
    await waitFor(() => {
      expect(screen.getByText('Preview do contrato')).toBeInTheDocument()
    })
    expect(screen.getByText('Adicionar cláusula')).toBeDisabled()
  })

  it('cenário 12: navega para /concluido ao clicar em Gerar contrato', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    render(<ResultPage />)
    await waitFor(() => {
      expect(screen.getByTestId('download-btn')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByTestId('download-btn'))
    expect(mockNavigate).toHaveBeenCalledWith('/concluido')
  })
})
