import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import { clausulasRouter } from './clausulas'

const testApp = new Hono()
testApp.route('/api', clausulasRouter)

describe('GET /api/clausulas', () => {
  it('returns status 200', async () => {
    const res = await testApp.request('/api/clausulas')
    expect(res.status).toBe(200)
  })

  it('returns array with 20 items', async () => {
    const res = await testApp.request('/api/clausulas')
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(20)
  })

  it('returns Content-Type application/json', async () => {
    const res = await testApp.request('/api/clausulas')
    expect(res.headers.get('Content-Type')).toContain('application/json')
  })

  it('filters obrigatoria=true — all items have obrigatoria === true', async () => {
    const res = await testApp.request('/api/clausulas?obrigatoria=true')
    const body = await res.json()
    expect(body.length).toBeGreaterThan(0)
    expect(body.every((item: { obrigatoria: boolean }) => item.obrigatoria === true)).toBe(true)
  })

  it('filters obrigatoria=false — all items have obrigatoria === false', async () => {
    const res = await testApp.request('/api/clausulas?obrigatoria=false')
    const body = await res.json()
    expect(body.length).toBeGreaterThan(0)
    expect(body.every((item: { obrigatoria: boolean }) => item.obrigatoria === false)).toBe(true)
  })

  it('ignores invalid obrigatoria value — returns all 20 items', async () => {
    const res = await testApp.request('/api/clausulas?obrigatoria=invalido')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toHaveLength(20)
  })

  it('filters by categoria — all items have matching categoria', async () => {
    const res = await testApp.request('/api/clausulas?categoria=honorarios')
    const body = await res.json()
    expect(body.length).toBeGreaterThan(0)
    expect(body.every((item: { categoria: string }) => item.categoria === 'honorarios')).toBe(true)
  })
})

describe('GET /api/clausulas/:slug', () => {
  it('returns status 200 for existing slug', async () => {
    const res = await testApp.request('/api/clausulas/foro')
    expect(res.status).toBe(200)
  })

  it('returns clausula with correct slug', async () => {
    const res = await testApp.request('/api/clausulas/foro')
    const body = await res.json()
    expect(body.slug).toBe('foro')
  })

  it('returns status 404 for non-existing slug', async () => {
    const res = await testApp.request('/api/clausulas/nao-existe')
    expect(res.status).toBe(404)
  })

  it('returns body with error field for non-existing slug', async () => {
    const res = await testApp.request('/api/clausulas/nao-existe')
    const body = await res.json()
    expect(body).toHaveProperty('error')
  })

  it('returns Content-Type application/json for existing slug', async () => {
    const res = await testApp.request('/api/clausulas/foro')
    expect(res.headers.get('Content-Type')).toContain('application/json')
  })
})
