import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LandingPage } from './landing-page'

const mockNavigate = vi.fn()
vi.mock('react-router', () => ({ useNavigate: () => mockNavigate }))

beforeEach(() => {
  mockNavigate.mockClear()
})

describe('LandingPage', () => {
  it('renders h1 with "Gerador de Contratos para Arquitetos"', () => {
    render(<LandingPage />)
    expect(
      screen.getByRole('heading', { level: 1, name: /gerador de contratos para arquitetos/i }),
    ).toBeInTheDocument()
  })

  it('renders button with text "Criar contrato"', () => {
    render(<LandingPage />)
    expect(screen.getByRole('button', { name: /criar contrato/i })).toBeInTheDocument()
  })

  it('renders footer with "CAU/DF"', () => {
    render(<LandingPage />)
    expect(screen.getByText('CAU/DF')).toBeInTheDocument()
  })

  it('renders footer with "Aviso legal"', () => {
    render(<LandingPage />)
    expect(screen.getByText('Aviso legal')).toBeInTheDocument()
  })

  it('clicking "Criar contrato" calls navigate("/aviso")', () => {
    render(<LandingPage />)
    fireEvent.click(screen.getByRole('button', { name: /criar contrato/i }))
    expect(mockNavigate).toHaveBeenCalledOnce()
    expect(mockNavigate).toHaveBeenCalledWith('/aviso')
  })
})
