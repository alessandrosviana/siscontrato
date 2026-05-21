import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ClientFormPage } from './client-form-page'

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

describe('ClientFormPage', () => {
  it('renders type selector with PF selected by default and base fields', () => {
    render(<ClientFormPage />)
    const pfRadio = screen.getByRole('radio', { name: /pessoa física/i })
    const pjRadio = screen.getByRole('radio', { name: /pessoa jurídica/i })
    expect(pfRadio).toBeChecked()
    expect(pjRadio).not.toBeChecked()
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/endereço/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument()
  })

  it('selecting PJ shows razao_social and nome_representante_legal fields', () => {
    render(<ClientFormPage />)
    fireEvent.click(screen.getByRole('radio', { name: /pessoa jurídica/i }))
    expect(screen.getByLabelText(/razão social/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/representante legal/i)).toBeInTheDocument()
  })

  it('selecting PF hides conditional fields', () => {
    render(<ClientFormPage />)
    fireEvent.click(screen.getByRole('radio', { name: /pessoa jurídica/i }))
    fireEvent.click(screen.getByRole('radio', { name: /pessoa física/i }))
    expect(screen.queryByLabelText(/razão social/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/representante legal/i)).not.toBeInTheDocument()
  })

  it('switching from PJ to PF clears razao_social and nome_representante_legal', () => {
    render(<ClientFormPage />)
    fireEvent.click(screen.getByRole('radio', { name: /pessoa jurídica/i }))
    fireEvent.change(screen.getByLabelText(/razão social/i), { target: { value: 'Empresa XYZ' } })
    fireEvent.change(screen.getByLabelText(/representante legal/i), { target: { value: 'João Silva' } })
    fireEvent.click(screen.getByRole('radio', { name: /pessoa física/i }))
    fireEvent.click(screen.getByRole('radio', { name: /pessoa jurídica/i }))
    expect(screen.getByLabelText(/razão social/i)).toHaveValue('')
    expect(screen.getByLabelText(/representante legal/i)).toHaveValue('')
  })

  it('empty form keeps continue button disabled', () => {
    render(<ClientFormPage />)
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled()
  })

  it('invalid CPF keeps continue button disabled', () => {
    render(<ClientFormPage />)
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } })
    fireEvent.change(screen.getByLabelText(/cpf/i), { target: { value: '111.111.111-11' } })
    fireEvent.change(screen.getByLabelText(/endereço/i), { target: { value: 'Rua A, 1' } })
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled()
  })

  it('invalid CNPJ (PJ) keeps continue button disabled', () => {
    render(<ClientFormPage />)
    fireEvent.click(screen.getByRole('radio', { name: /pessoa jurídica/i }))
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'Empresa XYZ' } })
    fireEvent.change(screen.getByLabelText(/cnpj/i), { target: { value: '11.111.111/1111-11' } })
    fireEvent.change(screen.getByLabelText(/endereço/i), { target: { value: 'Rua A, 1' } })
    fireEvent.change(screen.getByLabelText(/razão social/i), { target: { value: 'Empresa XYZ Ltda' } })
    fireEvent.change(screen.getByLabelText(/representante legal/i), { target: { value: 'João Silva' } })
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled()
  })

  it('all valid PF fields enables continue button', () => {
    render(<ClientFormPage />)
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } })
    fireEvent.change(screen.getByLabelText(/cpf/i), { target: { value: '529.982.247-25' } })
    fireEvent.change(screen.getByLabelText(/endereço/i), { target: { value: 'Rua A, 1' } })
    expect(screen.getByRole('button', { name: /continuar/i })).not.toBeDisabled()
  })

  it('all valid PJ fields (including conditionals) enables continue button', () => {
    render(<ClientFormPage />)
    fireEvent.click(screen.getByRole('radio', { name: /pessoa jurídica/i }))
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'Empresa XYZ' } })
    fireEvent.change(screen.getByLabelText(/cnpj/i), { target: { value: '11.222.333/0001-81' } })
    fireEvent.change(screen.getByLabelText(/endereço/i), { target: { value: 'Rua B, 2' } })
    fireEvent.change(screen.getByLabelText(/razão social/i), { target: { value: 'Empresa XYZ Ltda' } })
    fireEvent.change(screen.getByLabelText(/representante legal/i), { target: { value: 'Maria Souza' } })
    expect(screen.getByRole('button', { name: /continuar/i })).not.toBeDisabled()
  })

  it('clicking continue with valid PF data calls updateStep and navigates to /projeto', () => {
    render(<ClientFormPage />)
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } })
    fireEvent.change(screen.getByLabelText(/cpf/i), { target: { value: '529.982.247-25' } })
    fireEvent.change(screen.getByLabelText(/endereço/i), { target: { value: 'Rua A, 1' } })
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    expect(mockUpdateStep).toHaveBeenCalledWith('client', {
      cliente_tipo: 'PF',
      cliente_nome: 'João Silva',
      cliente_documento: '529.982.247-25',
      cliente_endereco: 'Rua A, 1',
      cliente_email: '',
      cliente_telefone: '',
      razao_social: '',
      nome_representante_legal: '',
    })
    expect(mockNavigate).toHaveBeenCalledWith('/projeto')
  })

  it('clicking Voltar navigates to /formulario', () => {
    render(<ClientFormPage />)
    fireEvent.click(screen.getByRole('button', { name: /voltar/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/formulario')
  })

  it('pre-fills fields when steps[client] exists in store (including clientTipo)', () => {
    mockSteps = {
      client: {
        cliente_tipo: 'PJ',
        cliente_nome: 'Empresa ABC',
        cliente_documento: '11.222.333/0001-81',
        cliente_endereco: 'Av. Brasil, 500',
        cliente_email: 'abc@empresa.com',
        cliente_telefone: '(11) 98765-4321',
        razao_social: 'Empresa ABC Ltda',
        nome_representante_legal: 'Carlos Pereira',
      },
    }
    render(<ClientFormPage />)
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue('Empresa ABC')
    expect(screen.getByLabelText(/cnpj/i)).toHaveValue('11.222.333/0001-81')
    expect(screen.getByLabelText(/endereço/i)).toHaveValue('Av. Brasil, 500')
    expect(screen.getByLabelText(/razão social/i)).toHaveValue('Empresa ABC Ltda')
    expect(screen.getByRole('radio', { name: /pessoa jurídica/i })).toBeChecked()
  })

  it('applies CPF mask when typing (52998224725 -> 529.982.247-25)', () => {
    render(<ClientFormPage />)
    const docInput = screen.getByLabelText(/cpf/i)
    fireEvent.change(docInput, { target: { value: '52998224725' } })
    expect(docInput).toHaveValue('529.982.247-25')
  })

  it('switching type clears cliente_documento', () => {
    render(<ClientFormPage />)
    fireEvent.change(screen.getByLabelText(/cpf/i), { target: { value: '529.982.247-25' } })
    fireEvent.click(screen.getByRole('radio', { name: /pessoa jurídica/i }))
    expect(screen.getByLabelText(/cnpj/i)).toHaveValue('')
  })
})
