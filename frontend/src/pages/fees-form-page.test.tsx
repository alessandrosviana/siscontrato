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
  const { FeesFormPage } = await import('./fees-form-page')
  return render(<FeesFormPage />)
}

function fillRequiredAVista() {
  fireEvent.change(screen.getByLabelText(/prazo de execução/i), { target: { value: '12' } })
  fireEvent.change(screen.getByLabelText(/prazo de execução/i).parentElement!.querySelector('select')!, { target: { value: 'meses' } })
  fireEvent.change(screen.getByLabelText(/valor total dos honorários/i), { target: { value: 'R$ 15.000,00' } })
  fireEvent.change(screen.getByLabelText(/forma de pagamento/i), { target: { value: 'a_vista' } })
}

describe('FeesFormPage', () => {
  it('renders title, prazo fields, valor total, forma pagamento and Voltar/Continuar buttons', async () => {
    await renderPage()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/honorários e prazos/i)
    expect(screen.getByLabelText(/prazo de execução/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/valor total dos honorários/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/forma de pagamento/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument()
  })

  it('Continuar disabled when required fields are empty', async () => {
    await renderPage()
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled()
  })

  it('selecting parcelado shows parcelas and valor_parcela fields', async () => {
    await renderPage()
    fireEvent.change(screen.getByLabelText(/forma de pagamento/i), { target: { value: 'parcelado' } })
    expect(screen.getByLabelText(/número de parcelas/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/valor da parcela/i)).toBeInTheDocument()
  })

  it('selecting a_vista after parcelado hides and resets conditional fields', async () => {
    await renderPage()
    fireEvent.change(screen.getByLabelText(/forma de pagamento/i), { target: { value: 'parcelado' } })
    fireEvent.change(screen.getByLabelText(/número de parcelas/i), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText(/forma de pagamento/i), { target: { value: 'a_vista' } })
    expect(screen.queryByLabelText(/número de parcelas/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/valor da parcela/i)).not.toBeInTheDocument()
  })

  it('parcelas with value 1 keeps Continuar disabled (minimum 2)', async () => {
    await renderPage()
    fireEvent.change(screen.getByLabelText(/prazo de execução/i), { target: { value: '12' } })
    fireEvent.change(screen.getByLabelText(/prazo de execução/i).parentElement!.querySelector('select')!, { target: { value: 'meses' } })
    fireEvent.change(screen.getByLabelText(/valor total dos honorários/i), { target: { value: 'R$ 15.000,00' } })
    fireEvent.change(screen.getByLabelText(/forma de pagamento/i), { target: { value: 'parcelado' } })
    fireEvent.change(screen.getByLabelText(/número de parcelas/i), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText(/valor da parcela/i), { target: { value: 'R$ 1.500,00' } })
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled()
  })

  it('fully valid form a_vista enables Continuar', async () => {
    await renderPage()
    fillRequiredAVista()
    expect(screen.getByRole('button', { name: /continuar/i })).not.toBeDisabled()
  })

  it('fully valid form parcelado enables Continuar', async () => {
    await renderPage()
    fireEvent.change(screen.getByLabelText(/prazo de execução/i), { target: { value: '12' } })
    fireEvent.change(screen.getByLabelText(/prazo de execução/i).parentElement!.querySelector('select')!, { target: { value: 'meses' } })
    fireEvent.change(screen.getByLabelText(/valor total dos honorários/i), { target: { value: 'R$ 15.000,00' } })
    fireEvent.change(screen.getByLabelText(/forma de pagamento/i), { target: { value: 'parcelado' } })
    fireEvent.change(screen.getByLabelText(/número de parcelas/i), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText(/valor da parcela/i), { target: { value: 'R$ 5.000,00' } })
    expect(screen.getByRole('button', { name: /continuar/i })).not.toBeDisabled()
  })

  it('submit a_vista: updateStep fees does not include parcelas or valor_parcela', async () => {
    await renderPage()
    fillRequiredAVista()
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockUpdateStep).toHaveBeenCalledWith('fees', expect.objectContaining({
      prazo_total: '12 meses',
      valor_total: 'R$ 15.000,00',
      forma_pagamento: 'a_vista',
    }))
    const callArg = mockUpdateStep.mock.calls[0][1] as Record<string, unknown>
    expect(callArg).not.toHaveProperty('parcelas')
    expect(callArg).not.toHaveProperty('valor_parcela')
  })

  it('submit parcelado: updateStep fees includes parcelas and valor_parcela', async () => {
    await renderPage()
    fireEvent.change(screen.getByLabelText(/prazo de execução/i), { target: { value: '6' } })
    fireEvent.change(screen.getByLabelText(/prazo de execução/i).parentElement!.querySelector('select')!, { target: { value: 'meses' } })
    fireEvent.change(screen.getByLabelText(/valor total dos honorários/i), { target: { value: 'R$ 12.000,00' } })
    fireEvent.change(screen.getByLabelText(/forma de pagamento/i), { target: { value: 'parcelado' } })
    fireEvent.change(screen.getByLabelText(/número de parcelas/i), { target: { value: '4' } })
    fireEvent.change(screen.getByLabelText(/valor da parcela/i), { target: { value: 'R$ 3.000,00' } })
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockUpdateStep).toHaveBeenCalledWith('fees', expect.objectContaining({
      prazo_total: '6 meses',
      forma_pagamento: 'parcelado',
      parcelas: '4',
      valor_parcela: 'R$ 3.000,00',
    }))
  })

  it('submit calls navigate to /clausulas', async () => {
    await renderPage()
    fillRequiredAVista()
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/clausulas')
  })

  it('Voltar calls navigate to /servicos-adicionais', async () => {
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /voltar/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/servicos-adicionais')
  })

  it('revisit: fields pre-filled from steps fees', async () => {
    mockSteps = {
      fees: {
        prazo_total: '12 meses',
        valor_total: 'R$ 20.000,00',
        forma_pagamento: 'a_vista',
        indice_reajuste: 'IPCA',
      },
    }
    await renderPage()
    expect(screen.getByLabelText(/prazo de execução/i)).toHaveValue('12')
    expect(screen.getByLabelText(/valor total dos honorários/i)).toHaveValue('R$ 20.000,00')
    expect(screen.getByLabelText(/forma de pagamento/i)).toHaveValue('a_vista')
    expect(screen.getByLabelText(/índice de reajuste/i)).toHaveValue('IPCA')
  })

  it('alert visible when steps additional-services has selected services', async () => {
    mockSteps = {
      'additional-services': { selected_services: ['Gestão de obra'] },
    }
    await renderPage()
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(/serviços adicionais/i)
  })

  it('alert absent when steps additional-services has no selections', async () => {
    mockSteps = {
      'additional-services': { selected_services: [] },
    }
    await renderPage()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
