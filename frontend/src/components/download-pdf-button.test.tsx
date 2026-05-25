import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { DownloadPdfButton } from './download-pdf-button'
import { useFormStore } from '../store/form-store'
import type { ContratoPayload } from '../types/contrato'

const testPayload: ContratoPayload = {
  cliente_nome: 'Maria Silva',
  cliente_documento: '123.456.789-00',
  cliente_endereco: 'Rua das Flores, 100, Brasília - DF',
  arquiteto_nome: 'João Arquiteto',
  arquiteto_endereco: 'SQN 205, Bloco A, Brasília - DF',
  registro_cau: 'A-12345-DF',
  tipo_servico: 'projeto-arquitetura',
  tipo_projeto: 'Projeto Residencial',
  endereco_projeto: 'Rua das Rosas, 200, Brasília - DF',
  area_projeto: '120m²',
  escopo_servicos: 'Levantamento e projeto executivo',
  prazo_total: '90',
  valor_total: 'R$ 15.000,00',
  forma_pagamento: '3 parcelas de R$ 5.000,00',
  numero_revisoes: '2',
  finalidade_uso: 'construção da residência',
  prazo_documentos: '5',
  lista_documentos: 'escritura e IPTU',
  prazo_orcamento_aditivo: '5',
  prazo_aviso_rescisao: '15',
  cidade_foro: 'Brasília',
}

function makeFetchOk() {
  const blob = new Blob(['%PDF-mock'], { type: 'application/pdf' })
  return vi.fn().mockResolvedValue({
    ok: true,
    blob: () => Promise.resolve(blob),
  })
}

function makeFetchError() {
  return vi.fn().mockResolvedValue({
    ok: false,
    status: 400,
    blob: () => Promise.resolve(new Blob()),
  })
}

beforeEach(() => {
  useFormStore.setState({ isFinalized: false, currentStep: 0, steps: {} })
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('DownloadPdfButton', () => {
  it('renders button with idle text', () => {
    vi.stubGlobal('fetch', makeFetchOk())
    render(<DownloadPdfButton payload={testPayload} />)
    expect(screen.getByRole('button', { name: /baixar contrato em pdf/i })).toBeInTheDocument()
    expect(screen.getByText('Baixar PDF')).toBeInTheDocument()
  })

  it('disables button and shows loading text while fetching', async () => {
    let resolveFetch!: (value: unknown) => void
    const pendingBlob = new Promise((resolve) => { resolveFetch = resolve })
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(pendingBlob))

    render(<DownloadPdfButton payload={testPayload} />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByText('Gerando PDF...')).toBeInTheDocument()
      expect(screen.getByRole('button')).toBeDisabled()
    })

    resolveFetch({ ok: true, blob: () => Promise.resolve(new Blob(['%PDF'], { type: 'application/pdf' })) })
  })

  it('renders aria-live region for loading announcements', () => {
    vi.stubGlobal('fetch', makeFetchOk())
    render(<DownloadPdfButton payload={testPayload} />)
    const liveRegion = document.querySelector('[aria-live="polite"]')
    expect(liveRegion).toBeInTheDocument()
  })

  it('announces loading state to screen readers via aria-live', async () => {
    let resolveFetch!: (value: unknown) => void
    const pendingBlob = new Promise((resolve) => { resolveFetch = resolve })
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(pendingBlob))

    render(<DownloadPdfButton payload={testPayload} />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      const liveRegion = document.querySelector('[aria-live="polite"]')
      expect(liveRegion?.textContent).toContain('Gerando PDF')
    })

    resolveFetch({ ok: true, blob: () => Promise.resolve(new Blob(['%PDF'], { type: 'application/pdf' })) })
  })

  it('triggers download with tipo_servico and date-based filename on successful fetch', async () => {
    vi.stubGlobal('fetch', makeFetchOk())

    const mockObjectUrl = 'blob:mock-url'
    const createObjectURL = vi.fn().mockReturnValue(mockObjectUrl)
    const revokeObjectURL = vi.fn()
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL })

    const mockAnchor = { href: '', download: '', click: vi.fn() }
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLElement
      return originalCreateElement(tag)
    })

    render(<DownloadPdfButton payload={testPayload} />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(createObjectURL).toHaveBeenCalled()
      expect(mockAnchor.download).toMatch(/^contrato-projeto-arquitetura-\d{4}-\d{2}-\d{2}\.pdf$/)
      expect(mockAnchor.click).toHaveBeenCalled()
      expect(revokeObjectURL).toHaveBeenCalledWith(mockObjectUrl)
    })

    createElementSpy.mockRestore()
  })

  it('uses tipo_servico from payload in filename with lowercase and hyphens', async () => {
    vi.stubGlobal('fetch', makeFetchOk())
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('blob:mock'),
      revokeObjectURL: vi.fn(),
    })

    const payloadWithTipoServico = { ...testPayload, tipo_servico: 'Projeto Residencial' }
    const mockAnchor = { href: '', download: '', click: vi.fn() }
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLElement
      return originalCreateElement(tag)
    })

    render(<DownloadPdfButton payload={payloadWithTipoServico} />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mockAnchor.download).toMatch(/^contrato-projeto-residencial-\d{4}-\d{2}-\d{2}\.pdf$/)
    })

    createElementSpy.mockRestore()
  })

  it('uses contrato as fallback filename when tipo_servico is absent', async () => {
    vi.stubGlobal('fetch', makeFetchOk())
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('blob:mock'),
      revokeObjectURL: vi.fn(),
    })

    const payloadWithoutTipoServico = { ...testPayload, tipo_servico: undefined } as unknown as ContratoPayload
    const mockAnchor = { href: '', download: '', click: vi.fn() }
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLElement
      return originalCreateElement(tag)
    })

    render(<DownloadPdfButton payload={payloadWithoutTipoServico} />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mockAnchor.download).toMatch(/^contrato-contrato-\d{4}-\d{2}-\d{2}\.pdf$/)
    })

    createElementSpy.mockRestore()
  })

  it('shows error message when fetch returns non-ok response', async () => {
    vi.stubGlobal('fetch', makeFetchError())

    render(<DownloadPdfButton payload={testPayload} />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveTextContent('Erro ao gerar PDF — tente novamente')
    })

    expect(screen.getByRole('button')).not.toBeDisabled()
  })

  it('shows error message when fetch rejects (network error)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network failure')))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<DownloadPdfButton payload={testPayload} />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveTextContent('Erro ao gerar PDF — tente novamente')
    })

    expect(consoleSpy).toHaveBeenCalledWith('PDF download failed', expect.objectContaining({ error: expect.any(String) }))
    expect(screen.getByRole('button')).not.toBeDisabled()
  })

  it('finalizes the form store after successful download', async () => {
    vi.stubGlobal('fetch', makeFetchOk())
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('blob:mock'),
      revokeObjectURL: vi.fn(),
    })

    const mockAnchor = { href: '', download: '', click: vi.fn() }
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLElement
      return originalCreateElement(tag)
    })

    render(<DownloadPdfButton payload={testPayload} />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(useFormStore.getState().isFinalized).toBe(true)
    })

    createElementSpy.mockRestore()
  })

  it('does not require onSuccess prop — successful download works without it', async () => {
    vi.stubGlobal('fetch', makeFetchOk())
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('blob:mock'),
      revokeObjectURL: vi.fn(),
    })

    const mockAnchor = { href: '', download: '', click: vi.fn() }
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLElement
      return originalCreateElement(tag)
    })

    render(<DownloadPdfButton payload={testPayload} />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(mockAnchor.click).toHaveBeenCalled()
      expect(useFormStore.getState().isFinalized).toBe(true)
    })

    createElementSpy.mockRestore()
  })

  it('calls onSuccess once after finalizeForm on successful download', async () => {
    vi.stubGlobal('fetch', makeFetchOk())
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('blob:mock'),
      revokeObjectURL: vi.fn(),
    })

    const mockAnchor = { href: '', download: '', click: vi.fn() }
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLElement
      return originalCreateElement(tag)
    })

    const onSuccess = vi.fn()
    render(<DownloadPdfButton payload={testPayload} onSuccess={onSuccess} />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(useFormStore.getState().isFinalized).toBe(true)
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })

    createElementSpy.mockRestore()
  })
})
