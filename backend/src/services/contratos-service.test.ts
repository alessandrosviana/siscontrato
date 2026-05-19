import { describe, it, expect } from 'vitest'
import { generateHtml, buildVariableMap, getPackages } from './contratos-service'

const validPayload = {
  cliente_nome: 'Maria Silva',
  cliente_documento: '123.456.789-00',
  cliente_endereco: 'Rua das Flores, 100, Brasília - DF',
  arquiteto_nome: 'João Arquiteto',
  arquiteto_endereco: 'SQN 205, Bloco A, Apt 101, Brasília - DF',
  registro_cau: 'A-12345-DF',
  tipo_servico: 'projeto-arquitetura',
  tipo_projeto: 'Projeto de Arquitetura Residencial',
  endereco_projeto: 'Rua das Rosas, 200, Brasília - DF',
  area_projeto: '120m²',
  escopo_servicos: 'Levantamento, anteprojeto, projeto executivo',
  prazo_total: '90',
  valor_total: 'R$ 15.000,00',
  forma_pagamento: '3 parcelas iguais de R$ 5.000,00',
  numero_revisoes: '2',
  finalidade_uso: 'construção da residência descrita neste contrato',
  prazo_documentos: '5',
  lista_documentos: 'escritura do imóvel, IPTU, planta do lote',
  prazo_orcamento_aditivo: '5',
  prazo_aviso_rescisao: '15',
  cidade_foro: 'Brasília',
}

describe('generateHtml', () => {
  it('returns HTML containing all 10 mandatory clause titles', () => {
    const html = generateHtml(validPayload)
    const mandatorySlugs = [
      'Identificação das Partes',
      'Objeto do Contrato',
      'Escopo dos Serviços',
      'Prazos',
      'Honorários e Forma de Pagamento',
      'Direitos Autorais',
      'Responsabilidades das Partes',
      'Alterações de Escopo',
      'Rescisão Contratual',
      'Foro',
    ]
    for (const title of mandatorySlugs) {
      expect(html).toContain(title)
    }
  })

  it('does not include servicos adicionais section when field is absent', () => {
    const html = generateHtml(validPayload)
    expect(html).not.toContain('servicos-adicionais')
    expect(html).not.toContain('Serviços Adicionais')
  })

  it('includes servicos adicionais section when field is present', () => {
    const html = generateHtml({
      ...validPayload,
      servicos_adicionais: 'Consultoria de interiores',
    })
    expect(html).toContain('Serviços Adicionais')
    expect(html).toContain('Consultoria de interiores')
  })

  it('returns HTML with no unreplaced template variables', () => {
    const html = generateHtml(validPayload)
    expect(html.includes('{{')).toBe(false)
  })

  it('includes selected optional clause in output', () => {
    const html = generateHtml({
      ...validPayload,
      clausulas_opcionais: ['numero-maximo-revisoes'],
      variaveis_opcionais: {
        valor_revisao_adicional: 'R$ 500,00',
      },
    })
    expect(html).toContain('Número Máximo de Revisões')
  })

  it('throws error when optional clause slug does not exist', () => {
    expect(() =>
      generateHtml({ ...validPayload, clausulas_opcionais: ['slug-inexistente'] })
    ).toThrow('Cláusula não encontrada: slug-inexistente')
  })

  it('throws error listing missing variables when optional clause variables are not provided', () => {
    expect(() =>
      generateHtml({ ...validPayload, clausulas_opcionais: ['numero-maximo-revisoes'] })
    ).toThrow('Variáveis faltantes para cláusulas opcionais')
  })

  it('generates HTML with no placeholders when all optional clause variables are provided', () => {
    const html = generateHtml({
      ...validPayload,
      clausulas_opcionais: ['numero-maximo-revisoes'],
      variaveis_opcionais: { valor_revisao_adicional: 'R$ 500,00' },
    })
    expect(html.includes('{{')).toBe(false)
  })

  it('respects biblioteca order for optional clauses regardless of payload order', () => {
    const html = generateHtml({
      ...validPayload,
      clausulas_opcionais: ['numero-maximo-revisoes', 'direitos-autorais-ampliados'],
      variaveis_opcionais: {
        numero_revisoes: '3',
        valor_revisao_adicional: 'R$ 500,00',
        usos_adicionais: 'publicações impressas',
        valor_direitos_ampliados: 'R$ 2.000,00',
      },
    })
    const posAmpliados = html.indexOf('Direitos Autorais Ampliados')
    const posMaxRevisoes = html.indexOf('Número Máximo de Revisões')
    expect(posAmpliados).toBeGreaterThan(-1)
    expect(posMaxRevisoes).toBeGreaterThan(-1)
    expect(posAmpliados).toBeLessThan(posMaxRevisoes)
  })
})

describe('buildVariableMap', () => {
  it('maps cliente_nome to nome_contratante', () => {
    const map = buildVariableMap(validPayload)
    expect(map['nome_contratante']).toBe('Maria Silva')
  })

  it('sets estado_foro to "Distrito Federal" always', () => {
    const map = buildVariableMap(validPayload)
    expect(map['estado_foro']).toBe('Distrito Federal')
  })

  it('maps escopo_servicos to etapas_servico', () => {
    const map = buildVariableMap(validPayload)
    expect(map['etapas_servico']).toBe('Levantamento, anteprojeto, projeto executivo')
  })

  it('includes variaveis_opcionais in the map when provided', () => {
    const map = buildVariableMap({
      ...validPayload,
      variaveis_opcionais: { valor_revisao_adicional: 'R$ 800,00' },
    })
    expect(map['valor_revisao_adicional']).toBe('R$ 800,00')
  })
})

describe('getPackages', () => {
  it('returns array with 5 packages', () => {
    const packages = getPackages()
    expect(packages).toHaveLength(5)
  })

  it('every package has required fields', () => {
    const packages = getPackages()
    for (const pkg of packages) {
      expect(pkg).toHaveProperty('id')
      expect(pkg).toHaveProperty('label')
      expect(pkg).toHaveProperty('escopo_padrao')
      expect(pkg).toHaveProperty('numero_revisoes_sugerido')
      expect(pkg).toHaveProperty('entregaveis')
      expect(Array.isArray(pkg.entregaveis)).toBe(true)
    }
  })

  it('every package has a non-empty tipo_servico string', () => {
    const packages = getPackages()
    for (const pkg of packages) {
      expect(typeof pkg.tipo_servico).toBe('string')
      expect(pkg.tipo_servico.length).toBeGreaterThan(0)
    }
  })

  it('every package has tipologias array with at least one element', () => {
    const packages = getPackages()
    for (const pkg of packages) {
      expect(Array.isArray(pkg.tipologias)).toBe(true)
      expect(pkg.tipologias.length).toBeGreaterThan(0)
    }
  })
})
