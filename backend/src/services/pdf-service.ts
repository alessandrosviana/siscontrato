import puppeteer from 'puppeteer-core'

const CHROME_PATH = process.env.CHROME_PATH
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:3000'
const LOGO_URL = `${BACKEND_URL}/api/pdf/logo`

const FOOTER_TEMPLATE = `
<div style="width: 100%; font-size: 8px; display: flex; justify-content: space-between; align-items: center; padding: 0 60px; box-sizing: border-box; border-top: 1px solid #ccc; font-family: 'Times New Roman', Times, serif;">
  <span style="max-width: 80%;">
    Este documento foi gerado a partir de modelo orientativo disponibilizado pelo CAU/DF.
    O CAU/DF não se responsabiliza pelo conteúdo adaptado pelo profissional.
  </span>
  <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
</div>
`

function injectLogoHeader(html: string): string {
  const header = `
<div style="position:fixed;top:0;left:0;right:0;height:55px;display:flex;align-items:center;padding:0 60px;background:white;border-bottom:1px solid #ccc;-webkit-print-color-adjust:exact;print-color-adjust:exact;z-index:9999;box-sizing:border-box;">
  <img src="${LOGO_URL}" style="height:40px;object-fit:contain;" />
</div>
<div style="height:55px;"></div>
`
  if (html.includes('<body>')) {
    return html.replace('<body>', `<body>${header}`)
  }
  return `<html><body>${header}${html}</body></html>`
}

export async function generatePdf(html: string): Promise<Buffer> {
  console.log('PDF generation started')
  const launchOptions = CHROME_PATH ? { executablePath: CHROME_PATH } : {}
  const browser = await puppeteer.launch(launchOptions)
  try {
    const page = await browser.newPage()
    await page.setContent(injectLogoHeader(html), { waitUntil: 'networkidle0' })
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: FOOTER_TEMPLATE,
      margin: {
        top: '80px',
        bottom: '80px',
        left: '60px',
        right: '60px',
      },
      timeout: 30_000,
    })
    return Buffer.from(pdf)
  } catch (err) {
    console.error('PDF generation failed', { error: err instanceof Error ? err.message : 'Unknown error' })
    throw err
  } finally {
    await browser.close()
  }
}
