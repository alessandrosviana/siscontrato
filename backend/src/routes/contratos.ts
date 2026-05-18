import { z } from 'zod'
import { Hono, type Context } from 'hono'
import { generateHtml, getPackages, type ContratoPayload } from '../services/contratos-service'

export const ContratoPayloadSchema = z.object({
  cliente_nome: z.string().min(1),
  cliente_documento: z.string().min(1),
  cliente_endereco: z.string().min(1),
  arquiteto_nome: z.string().min(1),
  arquiteto_endereco: z.string().min(1),
  registro_cau: z.string().min(1),
  tipo_servico: z.string().min(1),
  tipo_projeto: z.string().min(1),
  endereco_projeto: z.string().min(1),
  area_projeto: z.string().min(1),
  escopo_servicos: z.string().min(1),
  prazo_total: z.string().min(1),
  valor_total: z.string().min(1),
  forma_pagamento: z.string().min(1),
  numero_revisoes: z.string().min(1),
  finalidade_uso: z.string().min(1),
  prazo_documentos: z.string().min(1),
  lista_documentos: z.string().min(1),
  prazo_orcamento_aditivo: z.string().min(1),
  prazo_aviso_rescisao: z.string().min(1),
  cidade_foro: z.string().min(1),
  servicos_adicionais: z.string().optional(),
  clausulas_opcionais: z.array(z.string()).optional(),
  variaveis_opcionais: z.record(z.string(), z.string()).optional(),
})

export const contratosRouter = new Hono()

async function handleGenerate(c: Context) {
  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Body inválido — envie JSON com Content-Type: application/json' }, 400)
  }
  const result = ContratoPayloadSchema.safeParse(body)
  if (!result.success) {
    return c.json({ error: result.error.message }, 400)
  }
  try {
    const html = generateHtml(result.data as ContratoPayload)
    return c.json({ html }, 200)
  } catch (err) {
    console.error('Contract generation failed', { error: err instanceof Error ? err.message : 'Unknown error' })
    return c.json({ error: err instanceof Error ? err.message : 'Erro interno' }, 400)
  }
}

contratosRouter.post('/contratos/preview', (c) => handleGenerate(c))
contratosRouter.post('/contratos/gerar', (c) => handleGenerate(c))

contratosRouter.get('/contratos/pacotes', (c) => {
  return c.json(getPackages(), 200)
})
