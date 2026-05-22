import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockNavigate = vi.fn()
vi.mock('react-router', () => ({ useNavigate: () => mockNavigate }))

const mockUpdateStep = vi.fn()
let mockSteps: Record<string, unknown> = {}

vi.mock('../store/form-store', () => ({
  useFormStore: vi.fn(() => ({
    steps: mockSteps,
    updateStep: mockUpdateStep,
  })),
}))

const mockClausulas = [
  { slug: 'rescisao', titulo: 'Rescisão Contratual', texto: 'Texto da rescisão {{variavel}}', categoria: 'geral' },
  { slug: 'garantia', titulo: 'Garantia de Serviços', texto: 'Texto da garantia', categoria: 'geral' },
  { slug: 'confidencial', titulo: 'Confidencialidade', texto: 'Texto de confidencialidade', categoria: 'especial' },
]

function makeFetchSuccess(data: unknown = mockClausulas) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  })
}

function makeFetchError(status = 500) {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve(null),
  })
}

beforeEach(() => {
  mockNavigate.mockClear()
  mockUpdateStep.mockClear()
  mockSteps = {}
})

afterEach(() => {
  vi.unstubAllGlobals()
})

async function renderPage() {
  const { OptionalClausesPage } = await import('./optional-clauses-page')
  return render(<OptionalClausesPage />)
}

describe('OptionalClausesPage', () => {
  it('1. shows loading indicator before fetch resolves', async () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})))
    await renderPage()
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText(/carregando cláusulas/i)).toBeInTheDocument()
  })

  it('2. renders clause titles after successful fetch', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Rescisão Contratual')).toBeInTheDocument()
      expect(screen.getByText('Garantia de Serviços')).toBeInTheDocument()
      expect(screen.getByText('Confidencialidade')).toBeInTheDocument()
    })
  })

  it('3. shows error message when fetch returns HTTP 500', async () => {
    vi.stubGlobal('fetch', makeFetchError(500))
    await renderPage()
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText(/erro ao carregar/i)).toBeInTheDocument()
    })
  })

  it('4. retry button re-executes the fetch', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 500, json: () => Promise.resolve(null) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockClausulas) })
    vi.stubGlobal('fetch', fetchMock)
    await renderPage()
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: /tentar novamente/i }))
    await waitFor(() => {
      expect(screen.getByText('Rescisão Contratual')).toBeInTheDocument()
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('5. toggle activates a clause (aria-checked=true)', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Rescisão Contratual')).toBeInTheDocument()
    })
    const toggleButton = screen.getByRole('switch', { name: /ativar cláusula: rescisão contratual/i })
    expect(toggleButton).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(toggleButton)
    expect(toggleButton).toHaveAttribute('aria-checked', 'true')
  })

  it('6. toggle deactivates a clause when clicked again', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Rescisão Contratual')).toBeInTheDocument()
    })
    const toggleButton = screen.getByRole('switch', { name: /ativar cláusula: rescisão contratual/i })
    fireEvent.click(toggleButton)
    expect(toggleButton).toHaveAttribute('aria-checked', 'true')
    fireEvent.click(toggleButton)
    expect(toggleButton).toHaveAttribute('aria-checked', 'false')
  })

  it('7. "Ver texto" expands accordion (aria-expanded=true)', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Rescisão Contratual')).toBeInTheDocument()
    })
    const verTextoButtons = screen.getAllByRole('button', { name: /ver texto/i })
    expect(verTextoButtons[0]).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(verTextoButtons[0])
    expect(verTextoButtons[0]).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/texto da rescisão/i)).toBeInTheDocument()
  })

  it('8. clicking "Ver texto" again collapses accordion', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Rescisão Contratual')).toBeInTheDocument()
    })
    const verTextoButtons = screen.getAllByRole('button', { name: /ver texto/i })
    fireEvent.click(verTextoButtons[0])
    expect(screen.getByText(/texto da rescisão/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /ocultar texto/i }))
    expect(screen.getByText(/texto da rescisão/i)).not.toBeVisible()
  })

  it('9. "+ Adicionar cláusula personalizada" inserts an empty textarea', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Rescisão Contratual')).toBeInTheDocument()
    })
    expect(screen.queryByRole('textbox', { name: /cláusula personalizada 1/i })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /\+ adicionar cláusula personalizada/i }))
    expect(screen.getByRole('textbox', { name: /cláusula personalizada 1/i })).toBeInTheDocument()
  })

  it('10. remove button eliminates corresponding textarea while keeping others', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Rescisão Contratual')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: /\+ adicionar cláusula personalizada/i }))
    fireEvent.click(screen.getByRole('button', { name: /\+ adicionar cláusula personalizada/i }))
    expect(screen.getByRole('textbox', { name: /cláusula personalizada 1/i })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /cláusula personalizada 2/i })).toBeInTheDocument()
    const removeButtons = screen.getAllByRole('button', { name: /remover cláusula personalizada/i })
    fireEvent.click(removeButtons[0])
    expect(screen.queryByRole('textbox', { name: /cláusula personalizada 2/i })).not.toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /cláusula personalizada 1/i })).toBeInTheDocument()
  })

  it('11. submit without selection calls updateStep with empty arrays', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Rescisão Contratual')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockUpdateStep).toHaveBeenCalledWith('optional-clauses', {
      clausulas_opcionais: [],
      clausulas_personalizadas: [],
    })
  })

  it('12. submit with active clause includes slug in clausulas_opcionais', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Rescisão Contratual')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('switch', { name: /ativar cláusula: rescisão contratual/i }))
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockUpdateStep).toHaveBeenCalledWith('optional-clauses', {
      clausulas_opcionais: ['rescisao'],
      clausulas_personalizadas: [],
    })
  })

  it('13. submit with filled custom clause includes text in clausulas_personalizadas', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Rescisão Contratual')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: /\+ adicionar cláusula personalizada/i }))
    fireEvent.change(screen.getByRole('textbox', { name: /cláusula personalizada 1/i }), {
      target: { value: 'Minha cláusula personalizada' },
    })
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockUpdateStep).toHaveBeenCalledWith('optional-clauses', {
      clausulas_opcionais: [],
      clausulas_personalizadas: ['Minha cláusula personalizada'],
    })
  })

  it('14. submit discards empty custom clause text', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Rescisão Contratual')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: /\+ adicionar cláusula personalizada/i }))
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockUpdateStep).toHaveBeenCalledWith('optional-clauses', {
      clausulas_opcionais: [],
      clausulas_personalizadas: [],
    })
  })

  it('15. submit calls navigate to /resultado', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Rescisão Contratual')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/resultado')
  })

  it('16. Voltar calls navigate to /honorarios', async () => {
    vi.stubGlobal('fetch', makeFetchSuccess())
    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Rescisão Contratual')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: /voltar/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/honorarios')
  })

  it('17. revisit — slugs restored from steps optional-clauses.clausulas_opcionais', async () => {
    mockSteps = {
      'optional-clauses': {
        clausulas_opcionais: ['rescisao', 'confidencial'],
        clausulas_personalizadas: [],
      },
    }
    vi.stubGlobal('fetch', makeFetchSuccess())
    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Rescisão Contratual')).toBeInTheDocument()
    })
    const rescisaoToggle = screen.getByRole('switch', { name: /ativar cláusula: rescisão contratual/i })
    const garantiaToggle = screen.getByRole('switch', { name: /ativar cláusula: garantia de serviços/i })
    const confidencialToggle = screen.getByRole('switch', { name: /ativar cláusula: confidencialidade/i })
    expect(rescisaoToggle).toHaveAttribute('aria-checked', 'true')
    expect(garantiaToggle).toHaveAttribute('aria-checked', 'false')
    expect(confidencialToggle).toHaveAttribute('aria-checked', 'true')
  })

  it('18. revisit — personalizadas restored from steps optional-clauses.clausulas_personalizadas', async () => {
    mockSteps = {
      'optional-clauses': {
        clausulas_opcionais: [],
        clausulas_personalizadas: ['Texto salvo 1', 'Texto salvo 2'],
      },
    }
    vi.stubGlobal('fetch', makeFetchSuccess())
    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Rescisão Contratual')).toBeInTheDocument()
    })
    expect(screen.getByRole('textbox', { name: /cláusula personalizada 1/i })).toHaveValue('Texto salvo 1')
    expect(screen.getByRole('textbox', { name: /cláusula personalizada 2/i })).toHaveValue('Texto salvo 2')
  })
})
