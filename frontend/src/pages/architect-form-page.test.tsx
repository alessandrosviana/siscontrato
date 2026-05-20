import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ArchitectFormPage } from './architect-form-page'

const mockNavigate = vi.fn()
vi.mock('react-router', () => ({ useNavigate: () => mockNavigate }))

const mockUpdateStep = vi.fn()
const mockUseFormStore = vi.fn(() => ({ updateStep: mockUpdateStep, steps: {} }))
vi.mock('../store/form-store', () => ({
  useFormStore: () => mockUseFormStore(),
}))

const VALID_CPF = '529.982.247-25'
const VALID_CNPJ = '11.222.333/0001-81'
const VALID_CAU = 'A12345-8'
const VALID_EMAIL = 'arquiteto@example.com'
const VALID_PHONE = '(61) 99999-9999'
const VALID_NOME = 'João Silva'
const VALID_ENDERECO = 'Rua das Flores, 100'

function fillAllFieldsWithCpf() {
  fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: VALID_NOME } })
  fireEvent.change(screen.getByLabelText(/^cpf$/i), { target: { value: VALID_CPF } })
  fireEvent.change(screen.getByLabelText(/registro cau/i), { target: { value: VALID_CAU } })
  fireEvent.change(screen.getByLabelText(/endereço/i), { target: { value: VALID_ENDERECO } })
  fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: VALID_EMAIL } })
  fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: VALID_PHONE } })
}

function fillAllFieldsWithCnpj() {
  fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: VALID_NOME } })
  fireEvent.change(screen.getByLabelText(/^cnpj$/i), { target: { value: VALID_CNPJ } })
  fireEvent.change(screen.getByLabelText(/registro cau/i), { target: { value: VALID_CAU } })
  fireEvent.change(screen.getByLabelText(/endereço/i), { target: { value: VALID_ENDERECO } })
  fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: VALID_EMAIL } })
  fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: VALID_PHONE } })
}

beforeEach(() => {
  mockNavigate.mockClear()
  mockUpdateStep.mockClear()
  mockUseFormStore.mockReset()
  mockUseFormStore.mockImplementation(() => ({ updateStep: mockUpdateStep, steps: {} }))
})

describe('ArchitectFormPage', () => {
  it('renders the 7 fields and the Continue and Back buttons', () => {
    render(<ArchitectFormPage />)
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^cpf$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^cnpj$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/registro cau/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/endereço/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument()
  })

  it('clicking Continue with all fields empty shows error messages', () => {
    render(<ArchitectFormPage />)
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument()
    expect(screen.getByText(/informe pelo menos cpf ou cnpj válido/i)).toBeInTheDocument()
    expect(screen.getByText(/registro cau é obrigatório/i)).toBeInTheDocument()
    expect(screen.getByText(/endereço é obrigatório/i)).toBeInTheDocument()
    expect(screen.getByText(/e-mail é obrigatório/i)).toBeInTheDocument()
    expect(screen.getByText(/telefone é obrigatório/i)).toBeInTheDocument()
  })

  it('filling only valid CPF plus other required fields shows no CPF/CNPJ error', () => {
    render(<ArchitectFormPage />)
    fillAllFieldsWithCpf()
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(screen.queryByText(/cpf inválido/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/informe pelo menos cpf ou cnpj válido/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/cnpj inválido/i)).not.toBeInTheDocument()
  })

  it('filling only valid CNPJ plus other required fields shows no CPF/CNPJ error', () => {
    render(<ArchitectFormPage />)
    fillAllFieldsWithCnpj()
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(screen.queryByText(/cnpj inválido/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/informe pelo menos cpf ou cnpj válido/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/cpf inválido/i)).not.toBeInTheDocument()
  })

  it('CPF and CNPJ both invalid shows CPF/CNPJ error', () => {
    render(<ArchitectFormPage />)
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: VALID_NOME } })
    fireEvent.change(screen.getByLabelText(/^cpf$/i), { target: { value: '111.111.111-11' } })
    fireEvent.change(screen.getByLabelText(/^cnpj$/i), { target: { value: '11.111.111/1111-11' } })
    fireEvent.change(screen.getByLabelText(/registro cau/i), { target: { value: VALID_CAU } })
    fireEvent.change(screen.getByLabelText(/endereço/i), { target: { value: VALID_ENDERECO } })
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: VALID_EMAIL } })
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: VALID_PHONE } })
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    const cpfError = screen.queryByText(/cpf inválido/i)
    const cnpjError = screen.queryByText(/cnpj inválido/i)
    expect(cpfError || cnpjError).not.toBeNull()
  })

  it('invalid CAU shows error on CAU field', () => {
    render(<ArchitectFormPage />)
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: VALID_NOME } })
    fireEvent.change(screen.getByLabelText(/^cpf$/i), { target: { value: VALID_CPF } })
    fireEvent.change(screen.getByLabelText(/registro cau/i), { target: { value: '12345' } })
    fireEvent.change(screen.getByLabelText(/endereço/i), { target: { value: VALID_ENDERECO } })
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: VALID_EMAIL } })
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: VALID_PHONE } })
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(screen.getByText(/registro cau inválido/i)).toBeInTheDocument()
  })

  it('all valid fields calls updateStep("architect", {...}) with correct data', () => {
    render(<ArchitectFormPage />)
    fillAllFieldsWithCpf()
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockUpdateStep).toHaveBeenCalledOnce()
    expect(mockUpdateStep).toHaveBeenCalledWith('architect', {
      arquiteto_nome: VALID_NOME,
      arquiteto_cpf: VALID_CPF,
      arquiteto_cnpj: '',
      registro_cau: VALID_CAU,
      arquiteto_endereco: VALID_ENDERECO,
      arquiteto_email: VALID_EMAIL,
      arquiteto_telefone: VALID_PHONE,
    })
  })

  it('all valid fields calls navigate("/contratante")', () => {
    render(<ArchitectFormPage />)
    fillAllFieldsWithCpf()
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockNavigate).toHaveBeenCalledOnce()
    expect(mockNavigate).toHaveBeenCalledWith('/contratante')
  })

  it('Back button calls navigate("/pacote")', () => {
    render(<ArchitectFormPage />)
    fireEvent.click(screen.getByRole('button', { name: /voltar/i }))
    expect(mockNavigate).toHaveBeenCalledOnce()
    expect(mockNavigate).toHaveBeenCalledWith('/pacote')
  })

  it('fields are pre-filled when steps["architect"] exists in store', () => {
    mockUseFormStore.mockReturnValueOnce({
      updateStep: mockUpdateStep,
      steps: {
        architect: {
          arquiteto_nome: 'João Silva',
          arquiteto_cpf: '529.982.247-25',
          arquiteto_cnpj: '',
          registro_cau: 'A12345-8',
          arquiteto_endereco: 'Rua das Flores, 100',
          arquiteto_email: 'arquiteto@example.com',
          arquiteto_telefone: '(61) 99999-9999',
        },
      },
    })
    render(<ArchitectFormPage />)
    expect((screen.getByLabelText(/nome completo/i) as HTMLInputElement).value).toBe('João Silva')
    expect((screen.getByLabelText(/^cpf$/i) as HTMLInputElement).value).toBe('529.982.247-25')
    expect((screen.getByLabelText(/registro cau/i) as HTMLInputElement).value).toBe('A12345-8')
    expect((screen.getByLabelText(/endereço/i) as HTMLInputElement).value).toBe('Rua das Flores, 100')
    expect((screen.getByLabelText(/e-mail/i) as HTMLInputElement).value).toBe('arquiteto@example.com')
    expect((screen.getByLabelText(/telefone/i) as HTMLInputElement).value).toBe('(61) 99999-9999')
  })

  it('CPF mask is applied when typing', () => {
    render(<ArchitectFormPage />)
    const cpfInput = screen.getByLabelText(/^cpf$/i)
    fireEvent.change(cpfInput, { target: { value: '52998224725' } })
    expect((cpfInput as HTMLInputElement).value).toBe('529.982.247-25')
  })

  it('Continue button is enabled even with empty fields (RF-04)', () => {
    render(<ArchitectFormPage />)
    expect(screen.getByRole('button', { name: /continuar/i })).not.toBeDisabled()
  })
})
