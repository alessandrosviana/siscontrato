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
  const { ProjectFormPage } = await import('./project-form-page')
  return render(<ProjectFormPage />)
}

describe('ProjectFormPage', () => {
  it('renders 5 fields and Continuar/Voltar buttons', async () => {
    await renderPage()
    expect(screen.getByLabelText(/tipo de contrato/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tipo de serviço/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tipologia/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/endereço do projeto/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/área do projeto/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument()
  })

  it('empty form keeps continue button disabled', async () => {
    await renderPage()
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled()
  })

  it('tipo_contrato empty keeps continue button disabled even with other fields filled', async () => {
    await renderPage()
    fireEvent.change(screen.getByLabelText(/tipo de serviço/i), { target: { value: 'projeto' } })
    fireEvent.change(screen.getByLabelText(/tipologia/i), { target: { value: 'residencial' } })
    fireEvent.change(screen.getByLabelText(/endereço do projeto/i), { target: { value: 'Rua A, 123' } })
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled()
  })

  it('endereco_projeto empty keeps continue button disabled', async () => {
    await renderPage()
    fireEvent.change(screen.getByLabelText(/tipo de contrato/i), { target: { value: 'Empreitada' } })
    fireEvent.change(screen.getByLabelText(/tipo de serviço/i), { target: { value: 'projeto' } })
    fireEvent.change(screen.getByLabelText(/tipologia/i), { target: { value: 'residencial' } })
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled()
  })

  it('area_projeto with invalid text keeps continue button disabled', async () => {
    await renderPage()
    fireEvent.change(screen.getByLabelText(/tipo de contrato/i), { target: { value: 'Empreitada' } })
    fireEvent.change(screen.getByLabelText(/tipo de serviço/i), { target: { value: 'projeto' } })
    fireEvent.change(screen.getByLabelText(/tipologia/i), { target: { value: 'residencial' } })
    fireEvent.change(screen.getByLabelText(/endereço do projeto/i), { target: { value: 'Rua A, 123' } })
    fireEvent.change(screen.getByLabelText(/área do projeto/i), { target: { value: 'abc' } })
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled()
  })

  it('area_projeto with negative value keeps continue button disabled', async () => {
    await renderPage()
    fireEvent.change(screen.getByLabelText(/tipo de contrato/i), { target: { value: 'Empreitada' } })
    fireEvent.change(screen.getByLabelText(/tipo de serviço/i), { target: { value: 'projeto' } })
    fireEvent.change(screen.getByLabelText(/tipologia/i), { target: { value: 'residencial' } })
    fireEvent.change(screen.getByLabelText(/endereço do projeto/i), { target: { value: 'Rua A, 123' } })
    fireEvent.change(screen.getByLabelText(/área do projeto/i), { target: { value: '-5' } })
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled()
  })

  it('all required fields valid with area_projeto empty enables continue button', async () => {
    await renderPage()
    fireEvent.change(screen.getByLabelText(/tipo de contrato/i), { target: { value: 'Empreitada' } })
    fireEvent.change(screen.getByLabelText(/tipo de serviço/i), { target: { value: 'projeto' } })
    fireEvent.change(screen.getByLabelText(/tipologia/i), { target: { value: 'residencial' } })
    fireEvent.change(screen.getByLabelText(/endereço do projeto/i), { target: { value: 'Rua A, 123' } })
    expect(screen.getByRole('button', { name: /continuar/i })).not.toBeDisabled()
  })

  it('all fields including area_projeto 45.5 enables continue button', async () => {
    await renderPage()
    fireEvent.change(screen.getByLabelText(/tipo de contrato/i), { target: { value: 'Empreitada' } })
    fireEvent.change(screen.getByLabelText(/tipo de serviço/i), { target: { value: 'projeto' } })
    fireEvent.change(screen.getByLabelText(/tipologia/i), { target: { value: 'residencial' } })
    fireEvent.change(screen.getByLabelText(/endereço do projeto/i), { target: { value: 'Rua A, 123' } })
    fireEvent.change(screen.getByLabelText(/área do projeto/i), { target: { value: '45.5' } })
    expect(screen.getByRole('button', { name: /continuar/i })).not.toBeDisabled()
  })

  it('clicking Continuar with valid data calls updateStep with correct data', async () => {
    await renderPage()
    fireEvent.change(screen.getByLabelText(/tipo de contrato/i), { target: { value: 'Prestação de Serviço' } })
    fireEvent.change(screen.getByLabelText(/tipo de serviço/i), { target: { value: 'reforma' } })
    fireEvent.change(screen.getByLabelText(/tipologia/i), { target: { value: 'comercial' } })
    fireEvent.change(screen.getByLabelText(/endereço do projeto/i), { target: { value: 'Av. Paulista, 1000' } })
    fireEvent.change(screen.getByLabelText(/área do projeto/i), { target: { value: '200' } })
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockUpdateStep).toHaveBeenCalledWith('project', {
      tipo_contrato: 'Prestação de Serviço',
      tipo_servico: 'reforma',
      tipo_projeto: 'comercial',
      endereco_projeto: 'Av. Paulista, 1000',
      area_projeto: '200',
    })
  })

  it('clicking Continuar with valid data navigates to /escopo', async () => {
    await renderPage()
    fireEvent.change(screen.getByLabelText(/tipo de contrato/i), { target: { value: 'Empreitada' } })
    fireEvent.change(screen.getByLabelText(/tipo de serviço/i), { target: { value: 'projeto' } })
    fireEvent.change(screen.getByLabelText(/tipologia/i), { target: { value: 'residencial' } })
    fireEvent.change(screen.getByLabelText(/endereço do projeto/i), { target: { value: 'Rua B, 50' } })
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/escopo')
  })

  it('clicking Voltar navigates to /contratante', async () => {
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /voltar/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/contratante')
  })

  it('pre-fills fields from steps[project] on revisit', async () => {
    mockSteps = {
      project: {
        tipo_contrato: 'Empreitada',
        tipo_servico: 'projeto',
        tipo_projeto: 'residencial',
        endereco_projeto: 'Rua A, 123',
        area_projeto: '100',
      },
    }
    await renderPage()
    expect(screen.getByLabelText(/tipo de contrato/i)).toHaveValue('Empreitada')
    expect(screen.getByLabelText(/tipo de serviço/i)).toHaveValue('projeto')
    expect(screen.getByLabelText(/tipologia/i)).toHaveValue('residencial')
    expect(screen.getByLabelText(/endereço do projeto/i)).toHaveValue('Rua A, 123')
    expect(screen.getByLabelText(/área do projeto/i)).toHaveValue('100')
  })

  it('pre-fills tipo_servico and tipo_projeto from steps[package] on first visit', async () => {
    mockSteps = {
      package: { tipo_servico: 'reforma', tipo_projeto: 'comercial' },
    }
    await renderPage()
    expect(screen.getByLabelText(/tipo de serviço/i)).toHaveValue('reforma')
    expect(screen.getByLabelText(/tipologia/i)).toHaveValue('comercial')
  })

  it('shows suggestion tag for tipo_servico and tipo_projeto on first visit (steps = {})', async () => {
    mockSteps = {}
    await renderPage()
    const tags = screen.getAllByText(/sugestão do pacote/i)
    expect(tags).toHaveLength(2)
  })

  it('does not show suggestion tag on revisit when steps[project] exists', async () => {
    mockSteps = {
      project: {
        tipo_contrato: 'Empreitada',
        tipo_servico: 'projeto',
        tipo_projeto: 'residencial',
        endereco_projeto: 'Rua A, 123',
        area_projeto: '100',
      },
    }
    await renderPage()
    expect(screen.queryByText(/sugestão do pacote/i)).not.toBeInTheDocument()
  })

  it('shows m² suffix next to area_projeto input (BUG-01 regression)', async () => {
    await renderPage()
    expect(screen.getByText('m²')).toBeInTheDocument()
  })

  it('suggestion tag color class is applied (BUG-02 regression)', async () => {
    mockSteps = {}
    await renderPage()
    const tags = screen.getAllByText(/sugestão do pacote/i)
    expect(tags).toHaveLength(2)
    tags.forEach((tag) => expect(tag.className).toContain('suggestionTag'))
  })
})
