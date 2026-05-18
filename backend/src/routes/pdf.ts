import { Hono, type Context } from 'hono'
import { ContratoPayloadSchema } from './contratos'
import { generateHtml } from '../services/contratos-service'
import { generatePdf } from '../services/pdf-service'
import { cauDfLogoBase64, cauDfLogoMimeType } from '../assets/cau-df-logo.b64'

export const pdfRouter = new Hono()

function handleLogo(c: Context) {
  const logoBuffer = Buffer.from(cauDfLogoBase64, 'base64')
  return new Response(logoBuffer, {
    headers: {
      'Content-Type': cauDfLogoMimeType,
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

async function handleGeneratePdf(c: Context) {
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
    const html = generateHtml(result.data)
    const pdfBuffer = await generatePdf(html)
    const date = new Date().toISOString().slice(0, 10)
    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contrato-${date}.pdf"`,
      },
    })
  } catch (err) {
    console.error('PDF generation failed', { error: err instanceof Error ? err.message : 'Unknown error' })
    return c.json({ error: err instanceof Error ? err.message : 'Erro interno' }, 400)
  }
}

pdfRouter.get('/pdf/logo', (c) => handleLogo(c))
pdfRouter.post('/pdf/gerar', (c) => handleGeneratePdf(c))
