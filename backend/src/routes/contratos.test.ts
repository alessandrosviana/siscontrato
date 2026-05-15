import { describe, it, expect, vi, afterEach } from 'vitest'
import { Hono } from 'hono'
import { contratosRouter } from './contratos'

const testApp = new Hono()
testApp.route('/api', contratosRouter)

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

describe('POST /api/contratos/preview — error logging', () => {
  afterEach(() => vi.restoreAllMocks())

  it('calls console.error when generateHtml throws', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const payloadWithInvalidSlug = {
      ...validPayload,
      clausulas_opcionais: ['slug-inexistente'],
    }
    await testApp.request('/api/contratos/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadWithInvalidSlug),
    })
    expect(spy).toHaveBeenCalledWith('Contract generation failed', expect.objectContaining({ error: expect.any(String) }))
  })
})

describe('POST /api/contratos/preview', () => {
  it('returns status 200 with valid payload', async () => {
    const res = await testApp.request('/api/contratos/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    })
    expect(res.status).toBe(200)
  })

  it('returns body.html as non-empty string', async () => {
    const res = await testApp.request('/api/contratos/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    })
    const body = await res.json()
    expect(typeof body.html).toBe('string')
    expect(body.html.length).toBeGreaterThan(0)
  })

  it('returns Content-Type application/json', async () => {
    const res = await testApp.request('/api/contratos/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    })
    expect(res.headers.get('Content-Type')).toContain('application/json')
  })

  it('returns status 400 when cliente_nome is missing', async () => {
    const payloadMissingNome = Object.fromEntries(
      Object.entries(validPayload).filter(([k]) => k !== 'cliente_nome')
    )
    const res = await testApp.request('/api/contratos/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadMissingNome),
    })
    expect(res.status).toBe(400)
  })

  it('returns body.error when campo is missing', async () => {
    const payloadMissingNome = Object.fromEntries(
      Object.entries(validPayload).filter(([k]) => k !== 'cliente_nome')
    )
    const res = await testApp.request('/api/contratos/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadMissingNome),
    })
    const body = await res.json()
    expect(body.error).toBeDefined()
    expect(typeof body.error).toBe('string')
  })

  it('returns status 400 for invalid optional clause slug', async () => {
    const payloadWithInvalidSlug = {
      ...validPayload,
      clausulas_opcionais: ['slug-inexistente'],
    }
    const res = await testApp.request('/api/contratos/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadWithInvalidSlug),
    })
    expect(res.status).toBe(400)
  })
})

describe('POST /api/contratos/gerar', () => {
  it('returns status 200 with valid payload', async () => {
    const res = await testApp.request('/api/contratos/gerar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    })
    expect(res.status).toBe(200)
  })

  it('returns body.html as non-empty string', async () => {
    const res = await testApp.request('/api/contratos/gerar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    })
    const body = await res.json()
    expect(typeof body.html).toBe('string')
    expect(body.html.length).toBeGreaterThan(0)
  })
})

describe('GET /api/contratos/pacotes', () => {
  it('returns status 200', async () => {
    const res = await testApp.request('/api/contratos/pacotes')
    expect(res.status).toBe(200)
  })

  it('returns array with 5 items', async () => {
    const res = await testApp.request('/api/contratos/pacotes')
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(5)
  })
})
