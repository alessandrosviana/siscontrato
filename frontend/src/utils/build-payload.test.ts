import { describe, it, expect } from 'vitest'
import { buildPayload } from './build-payload'

describe('buildPayload', () => {
  it('combina todos os steps em um único objeto plano', () => {
    const steps = {
      step1: { nome: 'João', cpf: '123' },
      step2: { tipo_servico: 'projeto', valor: 1000 },
    }
    const result = buildPayload(steps)
    expect(result).toEqual({ nome: 'João', cpf: '123', tipo_servico: 'projeto', valor: 1000 })
  })

  it('retorna objeto vazio quando steps está vazio', () => {
    expect(buildPayload({})).toEqual({})
  })

  it('campo de step posterior sobrescreve campo de step anterior com mesmo nome', () => {
    const steps = {
      step1: { tipo_servico: 'primeiro' },
      step2: { tipo_servico: 'segundo' },
    }
    const result = buildPayload(steps)
    expect(result.tipo_servico).toBe('segundo')
  })
})
