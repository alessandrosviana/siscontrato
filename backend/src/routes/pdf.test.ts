import { describe, it, expect, vi, afterEach } from 'vitest'
import { Hono } from 'hono'

vi.mock('../services/pdf-service', () => ({
  generatePdf: vi.fn().mockResolvedValue(Buffer.from('fake-pdf')),
}))

import { pdfRouter } from './pdf'
import * as pdfService from '../services/pdf-service'

const testApp = new Hono()
testApp.route('/api', pdfRouter)

const validPayload = {
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

describe('POST /api/pdf/gerar', () => {
  afterEach(() => vi.restoreAllMocks())

  it('returns status 200 with Content-Type application/pdf for valid payload', async () => {
    const res = await testApp.request('/api/pdf/gerar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    })
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toContain('application/pdf')
  })

  it('returns Content-Disposition attachment with contrato filename for valid payload', async () => {
    const res = await testApp.request('/api/pdf/gerar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    })
    const disposition = res.headers.get('Content-Disposition')
    expect(disposition).toContain('attachment')
    expect(disposition).toContain('contrato-')
    expect(disposition).toContain('.pdf')
  })

  it('returns status 400 with body.error string when required field is missing', async () => {
    const payloadMissingField = Object.fromEntries(
      Object.entries(validPayload).filter(([k]) => k !== 'cliente_nome')
    )
    const res = await testApp.request('/api/pdf/gerar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadMissingField),
    })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(typeof body.error).toBe('string')
  })

  it('returns status 400 with body.error string when body is not JSON', async () => {
    const res = await testApp.request('/api/pdf/gerar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-valid-json',
    })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(typeof body.error).toBe('string')
  })

  it('returns status 400 and calls console.error when generatePdf throws', async () => {
    ;(pdfService.generatePdf as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Chrome not found'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await testApp.request('/api/pdf/gerar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeDefined()
    expect(consoleSpy).toHaveBeenCalledWith('PDF generation failed', expect.objectContaining({ error: expect.any(String) }))
  })
})
