import { describe, expect, it } from 'vitest'
import { Hono } from 'hono'
import { healthRouter } from './health'

const app = new Hono()
app.route('/', healthRouter)

describe('GET /health', () => {
  it('returns status 200', async () => {
    const response = await app.request('/health')
    expect(response.status).toBe(200)
  })

  it("returns body { status: 'ok' }", async () => {
    const response = await app.request('/health')
    const body = await response.json()
    expect(body).toEqual({ status: 'ok' })
  })

  it('returns JSON content-type', async () => {
    const response = await app.request('/health')
    expect(response.headers.get('content-type')).toContain('application/json')
  })
})
