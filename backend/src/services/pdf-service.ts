import puppeteer from 'puppeteer-core'

const CHROME_PATH = process.env.CHROME_PATH

const FOOTER_TEMPLATE = `
<div style="width: 100%; font-size: 8px; display: flex; justify-content: space-between; align-items: center; padding: 0 60px; box-sizing: border-box; border-top: 1px solid #ccc; font-family: 'Times New Roman', Times, serif;">
  <span style="max-width: 80%;">
    Este documento foi gerado a partir de modelo orientativo disponibilizado pelo CAU/DF.
    O CAU/DF não se responsabiliza pelo conteúdo adaptado pelo profissional.
  </span>
  <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
</div>
`

export async function generatePdf(html: string): Promise<Buffer> {
  console.log('PDF generation started')
  const launchOptions = {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ...(CHROME_PATH ? { executablePath: CHROME_PATH } : {}),
  }
  const browser = await puppeteer.launch(launchOptions)
  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
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
