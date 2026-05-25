import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DisclaimerPage } from './disclaimer-page'

const mockNavigate = vi.fn()
vi.mock('react-router', () => ({ useNavigate: () => mockNavigate }))

beforeEach(() => {
  mockNavigate.mockClear()
})

describe('DisclaimerPage', () => {
  it('renders the first institutional point', () => {
    render(<DisclaimerPage />)
    expect(screen.getByText('Os modelos têm caráter orientativo')).toBeInTheDocument()
  })

  it('renders the second institutional point', () => {
    render(<DisclaimerPage />)
    expect(
      screen.getByText('A ferramenta não substitui análise jurídica individualizada')
    ).toBeInTheDocument()
  })

  it('renders the third institutional point', () => {
    render(<DisclaimerPage />)
    expect(
      screen.getByText(
        'O uso do documento não gera responsabilidade do CAU/DF sobre o contrato final'
      )
    ).toBeInTheDocument()
  })

  it('renders the fourth institutional point', () => {
    render(<DisclaimerPage />)
    expect(
      screen.getByText(
        'O profissional permanece responsável pela adequação do documento ao caso concreto'
      )
    ).toBeInTheDocument()
  })

  it('checkbox starts unchecked', () => {
    render(<DisclaimerPage />)
    const checkbox = screen.getByRole('checkbox', { name: /li e concordo com os termos/i })
    expect(checkbox).not.toBeChecked()
  })

  it('button "Continuar" starts disabled', () => {
    render(<DisclaimerPage />)
    const button = screen.getByRole('button', { name: /continuar/i })
    expect(button).toBeDisabled()
  })

  it('checking the checkbox removes disabled from button', () => {
    render(<DisclaimerPage />)
    const checkbox = screen.getByRole('checkbox', { name: /li e concordo com os termos/i })
    const button = screen.getByRole('button', { name: /continuar/i })
    fireEvent.click(checkbox)
    expect(button).not.toBeDisabled()
  })

  it('unchecking the checkbox re-disables the button', () => {
    render(<DisclaimerPage />)
    const checkbox = screen.getByRole('checkbox', { name: /li e concordo com os termos/i })
    const button = screen.getByRole('button', { name: /continuar/i })
    fireEvent.click(checkbox)
    expect(button).not.toBeDisabled()
    fireEvent.click(checkbox)
    expect(button).toBeDisabled()
  })

  it('clicking "Continuar" with checkbox checked calls navigate("/pacote")', () => {
    render(<DisclaimerPage />)
    const checkbox = screen.getByRole('checkbox', { name: /li e concordo com os termos/i })
    const button = screen.getByRole('button', { name: /continuar/i })
    fireEvent.click(checkbox)
    fireEvent.click(button)
    expect(mockNavigate).toHaveBeenCalledOnce()
    expect(mockNavigate).toHaveBeenCalledWith('/pacote')
  })
})
