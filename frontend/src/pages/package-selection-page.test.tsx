import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PackageSelectionPage } from './package-selection-page'

const mockNavigate = vi.fn()
vi.mock('react-router', () => ({ useNavigate: () => mockNavigate }))

const mockUpdateStep = vi.fn()
vi.mock('../store/form-store', () => ({
  useFormStore: (selector: (state: { updateStep: typeof mockUpdateStep }) => unknown) =>
    selector({ updateStep: mockUpdateStep }),
}))

const mockPackages = [
  {
    id: 'projeto-arquitetura',
    label: 'Projeto de Arquitetura',
    tipo_servico: 'projeto',
    tipologias: ['residencial', 'comercial'],
    escopo_padrao: 'Escopo de teste',
    numero_revisoes_sugerido: 2,
    entregaveis: ['Plantas baixas'],
  },
  {
    id: 'projeto-arquitetura-interiores',
    label: 'Projeto de Arquitetura de Interiores',
    tipo_servico: 'reforma de interiores',
    tipologias: ['residencial', 'comercial'],
    escopo_padrao: 'Escopo interiores',
    numero_revisoes_sugerido: 1,
    entregaveis: ['Layout'],
  },
  {
    id: 'projeto-acompanhamento-obra',
    label: 'Projeto + Acompanhamento de Obra',
    tipo_servico: 'projeto',
    tipologias: ['residencial', 'comercial'],
    escopo_padrao: 'Escopo obra',
    numero_revisoes_sugerido: 3,
    entregaveis: ['Plantas'],
  },
  {
    id: 'reforma',
    label: 'Reforma',
    tipo_servico: 'reforma',
    tipologias: ['residencial', 'comercial'],
    escopo_padrao: 'Escopo reforma',
    numero_revisoes_sugerido: 1,
    entregaveis: ['Memorial'],
  },
  {
    id: 'reforma-interiores',
    label: 'Reforma de Interiores',
    tipo_servico: 'reforma de interiores',
    tipologias: ['residencial', 'comercial'],
    escopo_padrao: 'Escopo reforma interiores',
    numero_revisoes_sugerido: 1,
    entregaveis: ['Layout'],
  },
]

function mockFetchSuccess() {
  vi.mocked(globalThis.fetch).mockResolvedValue({
    ok: true,
    json: async () => mockPackages,
  } as Response)
}

function mockFetchFailure() {
  vi.mocked(globalThis.fetch).mockRejectedValue(new Error('Network error'))
}

beforeEach(() => {
  globalThis.fetch = vi.fn()
  mockNavigate.mockClear()
  mockUpdateStep.mockClear()
})

describe('PackageSelectionPage', () => {
  it('renders loading indicator during fetch', () => {
    vi.mocked(globalThis.fetch).mockReturnValue(new Promise(() => {}))
    render(<PackageSelectionPage />)
    expect(screen.getByText(/carregando pacotes/i)).toBeInTheDocument()
  })

  it('renders 5 package cards after successful fetch', async () => {
    mockFetchSuccess()
    render(<PackageSelectionPage />)
    await waitFor(() => {
      expect(screen.getByText('Projeto de Arquitetura')).toBeInTheDocument()
    })
    expect(screen.getByText('Projeto de Arquitetura de Interiores')).toBeInTheDocument()
    expect(screen.getByText('Projeto + Acompanhamento de Obra')).toBeInTheDocument()
    expect(screen.getByText('Reforma')).toBeInTheDocument()
    expect(screen.getByText('Reforma de Interiores')).toBeInTheDocument()
    const cards = screen.getAllByRole('button', { pressed: false })
    const packageCards = cards.filter((btn) => btn.hasAttribute('aria-pressed'))
    expect(packageCards).toHaveLength(5)
  })

  it('clicking a card selects the package (aria-pressed="true")', async () => {
    mockFetchSuccess()
    render(<PackageSelectionPage />)
    await waitFor(() => {
      expect(screen.getByText('Projeto de Arquitetura')).toBeInTheDocument()
    })
    const cards = screen.getAllByRole('button', { pressed: false })
    const card = cards.find((btn) => btn.textContent?.includes('Projeto de Arquitetura') && !btn.textContent?.includes('Interiores') && !btn.textContent?.includes('+'))!
    fireEvent.click(card)
    expect(card).toHaveAttribute('aria-pressed', 'true')
  })

  it('selecting a package shows its available typologies', async () => {
    mockFetchSuccess()
    render(<PackageSelectionPage />)
    await waitFor(() => {
      expect(screen.getByText('Projeto de Arquitetura')).toBeInTheDocument()
    })
    const cards = screen.getAllByRole('button', { pressed: false })
    const card = cards.find((btn) => btn.textContent?.includes('Projeto de Arquitetura') && !btn.textContent?.includes('Interiores') && !btn.textContent?.includes('+'))!
    fireEvent.click(card)
    expect(screen.getByRole('button', { name: /tipologia residencial/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /tipologia comercial/i })).toBeInTheDocument()
  })

  it('switching packages clears previously selected typology', async () => {
    mockFetchSuccess()
    render(<PackageSelectionPage />)
    await waitFor(() => {
      expect(screen.getByText('Projeto de Arquitetura')).toBeInTheDocument()
    })
    const allCards = screen.getAllByRole('button', { pressed: false })
    const firstCard = allCards.find((btn) => btn.textContent?.includes('Projeto de Arquitetura') && !btn.textContent?.includes('Interiores') && !btn.textContent?.includes('+'))!
    fireEvent.click(firstCard)
    const typologyButton = screen.getByRole('button', { name: /tipologia residencial/i })
    fireEvent.click(typologyButton)
    expect(typologyButton).toHaveAttribute('aria-pressed', 'true')
    const secondCard = screen.getByText('Reforma de Interiores').closest('button')!
    fireEvent.click(secondCard)
    const newTypologyButton = screen.getByRole('button', { name: /tipologia residencial/i })
    expect(newTypologyButton).toHaveAttribute('aria-pressed', 'false')
  })

  it('button "Continuar" starts disabled', async () => {
    mockFetchSuccess()
    render(<PackageSelectionPage />)
    await waitFor(() => {
      expect(screen.getByText('Projeto de Arquitetura')).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled()
  })

  it('selecting package + typology enables "Continuar"', async () => {
    mockFetchSuccess()
    render(<PackageSelectionPage />)
    await waitFor(() => {
      expect(screen.getByText('Projeto de Arquitetura')).toBeInTheDocument()
    })
    const cards = screen.getAllByRole('button', { pressed: false })
    const card = cards.find((btn) => btn.textContent?.includes('Projeto de Arquitetura') && !btn.textContent?.includes('Interiores') && !btn.textContent?.includes('+'))!
    fireEvent.click(card)
    fireEvent.click(screen.getByRole('button', { name: /tipologia residencial/i }))
    expect(screen.getByRole('button', { name: /continuar/i })).not.toBeDisabled()
  })

  it('clicking "Continuar" calls updateStep("package", {...}) with correct fields', async () => {
    mockFetchSuccess()
    render(<PackageSelectionPage />)
    await waitFor(() => {
      expect(screen.getByText('Projeto de Arquitetura')).toBeInTheDocument()
    })
    const cards = screen.getAllByRole('button', { pressed: false })
    const card = cards.find((btn) => btn.textContent?.includes('Projeto de Arquitetura') && !btn.textContent?.includes('Interiores') && !btn.textContent?.includes('+'))!
    fireEvent.click(card)
    fireEvent.click(screen.getByRole('button', { name: /tipologia residencial/i }))
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockUpdateStep).toHaveBeenCalledOnce()
    expect(mockUpdateStep).toHaveBeenCalledWith('package', {
      pacote_servico: 'projeto-arquitetura',
      tipo_servico: 'projeto',
      tipo_projeto: 'residencial',
      escopo_servicos: 'Escopo de teste',
      numero_revisoes: '2',
    })
  })

  it('clicking "Continuar" calls navigate("/formulario")', async () => {
    mockFetchSuccess()
    render(<PackageSelectionPage />)
    await waitFor(() => {
      expect(screen.getByText('Projeto de Arquitetura')).toBeInTheDocument()
    })
    const cards = screen.getAllByRole('button', { pressed: false })
    const card = cards.find((btn) => btn.textContent?.includes('Projeto de Arquitetura') && !btn.textContent?.includes('Interiores') && !btn.textContent?.includes('+'))!
    fireEvent.click(card)
    fireEvent.click(screen.getByRole('button', { name: /tipologia residencial/i }))
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockNavigate).toHaveBeenCalledOnce()
    expect(mockNavigate).toHaveBeenCalledWith('/formulario')
  })

  it('renders error message when fetch fails', async () => {
    mockFetchFailure()
    render(<PackageSelectionPage />)
    await waitFor(() => {
      expect(screen.getByText(/não foi possível carregar os pacotes/i)).toBeInTheDocument()
    })
  })

  it('clicking selected card again deselects it (aria-pressed back to false and typologies disappear)', async () => {
    mockFetchSuccess()
    render(<PackageSelectionPage />)
    await waitFor(() => {
      expect(screen.getByText('Projeto de Arquitetura')).toBeInTheDocument()
    })
    const cards = screen.getAllByRole('button', { pressed: false })
    const card = cards.find((btn) => btn.textContent?.includes('Projeto de Arquitetura') && !btn.textContent?.includes('Interiores') && !btn.textContent?.includes('+'))!
    fireEvent.click(card)
    expect(card).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /tipologia residencial/i })).toBeInTheDocument()
    fireEvent.click(card)
    expect(card).toHaveAttribute('aria-pressed', 'false')
    expect(screen.queryByRole('button', { name: /tipologia residencial/i })).not.toBeInTheDocument()
  })
})
