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
  const { AdditionalServicesPage } = await import('./additional-services-page')
  return render(<AdditionalServicesPage />)
}

describe('AdditionalServicesPage', () => {
  it('renders 3 checkboxes and Continuar/Voltar buttons', async () => {
    await renderPage()
    expect(screen.getByLabelText('Gestão de obra')).toBeInTheDocument()
    expect(screen.getByLabelText('Acompanhamento de obra')).toBeInTheDocument()
    expect(screen.getByLabelText('Fiscalização de obra')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument()
  })

  it('description field is absent when no service is selected', async () => {
    await renderPage()
    expect(screen.queryByLabelText(/descrição dos serviços adicionais/i)).not.toBeInTheDocument()
  })

  it('alert is absent when no service is selected', async () => {
    await renderPage()
    expect(
      screen.queryByText(/serviços adicionais impactam o prazo/i)
    ).not.toBeInTheDocument()
  })

  it('description field becomes visible when a service is checked', async () => {
    await renderPage()
    fireEvent.click(screen.getByLabelText('Gestão de obra'))
    expect(screen.getByLabelText(/descrição dos serviços adicionais/i)).toBeInTheDocument()
  })

  it('alert becomes visible when a service is checked', async () => {
    await renderPage()
    fireEvent.click(screen.getByLabelText('Gestão de obra'))
    expect(
      screen.getByText(/serviços adicionais impactam o prazo e os honorários/i)
    ).toBeInTheDocument()
  })

  it('description field and alert hide when all services are unchecked', async () => {
    await renderPage()
    fireEvent.click(screen.getByLabelText('Gestão de obra'))
    fireEvent.click(screen.getByLabelText('Gestão de obra'))
    expect(screen.queryByLabelText(/descrição dos serviços adicionais/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/serviços adicionais impactam o prazo/i)
    ).not.toBeInTheDocument()
  })

  it('Continuar button is always enabled even with no selection', async () => {
    await renderPage()
    expect(screen.getByRole('button', { name: /continuar/i })).not.toBeDisabled()
  })

  it('with no selection calls updateStep with servicos_adicionais empty string', async () => {
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockUpdateStep).toHaveBeenCalledWith(
      'additional-services',
      expect.objectContaining({ servicos_adicionais: '' })
    )
  })

  it('with one service and no description calls updateStep with service name only', async () => {
    await renderPage()
    fireEvent.click(screen.getByLabelText('Gestão de obra'))
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockUpdateStep).toHaveBeenCalledWith(
      'additional-services',
      expect.objectContaining({ servicos_adicionais: 'Gestão de obra' })
    )
  })

  it('with multiple services and no description formats as comma-separated list', async () => {
    await renderPage()
    fireEvent.click(screen.getByLabelText('Gestão de obra'))
    fireEvent.click(screen.getByLabelText('Acompanhamento de obra'))
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockUpdateStep).toHaveBeenCalledWith(
      'additional-services',
      expect.objectContaining({ servicos_adicionais: 'Gestão de obra, Acompanhamento de obra' })
    )
  })

  it('with service and description appends description after period', async () => {
    await renderPage()
    fireEvent.click(screen.getByLabelText('Gestão de obra'))
    fireEvent.change(screen.getByLabelText(/descrição dos serviços adicionais/i), {
      target: { value: 'texto' },
    })
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockUpdateStep).toHaveBeenCalledWith(
      'additional-services',
      expect.objectContaining({ servicos_adicionais: 'Gestão de obra. Descrição: texto' })
    )
  })

  it('clicking Continuar navigates to /resultado', async () => {
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/resultado')
  })

  it('clicking Voltar navigates to /escopo', async () => {
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /voltar/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/escopo')
  })

  it('restores checkboxes and description from steps[additional-services] on revisit', async () => {
    mockSteps = {
      'additional-services': {
        selected_services: ['Gestão de obra', 'Fiscalização de obra'],
        description: 'descricao salva',
      },
    }
    await renderPage()
    expect(screen.getByLabelText('Gestão de obra')).toBeChecked()
    expect(screen.getByLabelText('Acompanhamento de obra')).not.toBeChecked()
    expect(screen.getByLabelText('Fiscalização de obra')).toBeChecked()
    expect(screen.getByLabelText(/descrição dos serviços adicionais/i)).toHaveValue(
      'descricao salva'
    )
  })
})
