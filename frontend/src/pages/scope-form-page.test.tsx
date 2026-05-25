import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockNavigate = vi.fn()
vi.mock('react-router', () => ({ useNavigate: () => mockNavigate }))

const mockUpdateStep = vi.fn()
let mockSteps: Record<string, unknown> = {}

vi.mock('../store/form-store', () => ({
  useFormStore: () => ({ updateStep: mockUpdateStep, steps: mockSteps }),
}))

beforeEach(() => {
  mockNavigate.mockClear()
  mockUpdateStep.mockClear()
  mockSteps = {}
})

async function renderPage() {
  const { ScopeFormPage } = await import('./scope-form-page')
  return render(<ScopeFormPage />)
}

describe('ScopeFormPage', () => {
  it('renders textarea escopo and Continuar/Voltar buttons', async () => {
    mockSteps = { package: { tipo_servico: 'reforma', escopo_servicos: '', numero_revisoes: '' } }
    await renderPage()
    expect(screen.getByLabelText(/escopo dos serviços/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument()
  })

  it('numero_revisoes visible when tipo_servico is projeto', async () => {
    mockSteps = { package: { tipo_servico: 'projeto', escopo_servicos: '', numero_revisoes: '2' } }
    await renderPage()
    expect(screen.getByLabelText(/número de revisões/i)).toBeInTheDocument()
  })

  it('numero_revisoes hidden when tipo_servico is reforma', async () => {
    mockSteps = { package: { tipo_servico: 'reforma', escopo_servicos: '', numero_revisoes: '' } }
    await renderPage()
    expect(screen.queryByLabelText(/número de revisões/i)).not.toBeInTheDocument()
  })

  it('numero_revisoes hidden when tipo_servico is reforma de interiores', async () => {
    mockSteps = { package: { tipo_servico: 'reforma de interiores', escopo_servicos: '', numero_revisoes: '' } }
    await renderPage()
    expect(screen.queryByLabelText(/número de revisões/i)).not.toBeInTheDocument()
  })

  it('empty escopo keeps continue button disabled', async () => {
    mockSteps = { package: { tipo_servico: 'reforma', escopo_servicos: '', numero_revisoes: '' } }
    await renderPage()
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled()
  })

  it('empty numero_revisoes with tipo_servico projeto keeps continue button disabled', async () => {
    mockSteps = { package: { tipo_servico: 'projeto', escopo_servicos: 'Escopo válido', numero_revisoes: '' } }
    await renderPage()
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled()
  })

  it('decimal numero_revisoes (1.5) keeps continue button disabled', async () => {
    mockSteps = { package: { tipo_servico: 'projeto', escopo_servicos: 'Escopo válido', numero_revisoes: '' } }
    await renderPage()
    fireEvent.change(screen.getByLabelText(/número de revisões/i), { target: { value: '1.5' } })
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled()
  })

  it('zero numero_revisoes keeps continue button disabled', async () => {
    mockSteps = { package: { tipo_servico: 'projeto', escopo_servicos: 'Escopo válido', numero_revisoes: '' } }
    await renderPage()
    fireEvent.change(screen.getByLabelText(/número de revisões/i), { target: { value: '0' } })
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled()
  })

  it('negative numero_revisoes keeps continue button disabled', async () => {
    mockSteps = { package: { tipo_servico: 'projeto', escopo_servicos: 'Escopo válido', numero_revisoes: '' } }
    await renderPage()
    fireEvent.change(screen.getByLabelText(/número de revisões/i), { target: { value: '-1' } })
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled()
  })

  it('all fields valid with numero_revisoes enables continue button', async () => {
    mockSteps = { package: { tipo_servico: 'projeto', escopo_servicos: 'Escopo válido', numero_revisoes: '3' } }
    await renderPage()
    expect(screen.getByRole('button', { name: /continuar/i })).not.toBeDisabled()
  })

  it('all fields valid without numero_revisoes (reforma) enables continue button', async () => {
    mockSteps = { package: { tipo_servico: 'reforma', escopo_servicos: '', numero_revisoes: '' } }
    await renderPage()
    fireEvent.change(screen.getByLabelText(/escopo dos serviços/i), { target: { value: 'Escopo de reforma' } })
    expect(screen.getByRole('button', { name: /continuar/i })).not.toBeDisabled()
  })

  it('clicking Continuar with valid data calls updateStep with correct data', async () => {
    mockSteps = { package: { tipo_servico: 'projeto', escopo_servicos: 'Escopo do pacote', numero_revisoes: '3' } }
    await renderPage()
    fireEvent.change(screen.getByLabelText(/escopo dos serviços/i), { target: { value: 'Escopo personalizado' } })
    fireEvent.change(screen.getByLabelText(/número de revisões/i), { target: { value: '5' } })
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockUpdateStep).toHaveBeenCalledWith('scope', {
      escopo_servicos: 'Escopo personalizado',
      numero_revisoes: '5',
    })
  })

  it('clicking Continuar with valid data navigates to /servicos-adicionais', async () => {
    mockSteps = { package: { tipo_servico: 'projeto', escopo_servicos: 'Escopo do pacote', numero_revisoes: '3' } }
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/servicos-adicionais')
  })

  it('clicking Voltar navigates to /projeto', async () => {
    mockSteps = { package: { tipo_servico: 'reforma', escopo_servicos: '', numero_revisoes: '' } }
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /voltar/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/projeto')
  })

  it('pre-fills fields from steps[scope] on revisit', async () => {
    mockSteps = {
      scope: { escopo_servicos: 'Escopo salvo anteriormente', numero_revisoes: '4' },
      package: { tipo_servico: 'projeto', escopo_servicos: 'Escopo do pacote', numero_revisoes: '2' },
    }
    await renderPage()
    expect(screen.getByLabelText(/escopo dos serviços/i)).toHaveValue('Escopo salvo anteriormente')
    expect(screen.getByLabelText(/número de revisões/i)).toHaveValue('4')
  })

  it('pre-fills escopo_servicos and numero_revisoes from steps[package] on first visit', async () => {
    mockSteps = { package: { tipo_servico: 'projeto', escopo_servicos: 'Escopo padrão do pacote', numero_revisoes: '2' } }
    await renderPage()
    expect(screen.getByLabelText(/escopo dos serviços/i)).toHaveValue('Escopo padrão do pacote')
    expect(screen.getByLabelText(/número de revisões/i)).toHaveValue('2')
  })

  it('shows suggestion tag for both fields on first visit', async () => {
    mockSteps = { package: { tipo_servico: 'projeto', escopo_servicos: 'Escopo do pacote', numero_revisoes: '3' } }
    await renderPage()
    const tags = screen.getAllByText(/sugestão do pacote/i)
    expect(tags.length).toBeGreaterThanOrEqual(2)
  })

  it('does not show suggestion tag on revisit when steps[scope] exists', async () => {
    mockSteps = {
      scope: { escopo_servicos: 'Escopo salvo', numero_revisoes: '2' },
      package: { tipo_servico: 'projeto', escopo_servicos: 'Escopo do pacote', numero_revisoes: '3' },
    }
    await renderPage()
    expect(screen.queryByText(/sugestão do pacote/i)).not.toBeInTheDocument()
  })
})
