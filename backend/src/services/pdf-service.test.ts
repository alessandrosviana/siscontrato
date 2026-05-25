import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('puppeteer-core')

import puppeteer from 'puppeteer-core'
import { generatePdf } from './pdf-service'

const mockPdfResult = Buffer.from('fake-pdf-content')

const mockPage = {
  setContent: vi.fn<() => Promise<void>>(),
  pdf: vi.fn<() => Promise<Buffer>>(),
}

const mockBrowser = {
  newPage: vi.fn<() => Promise<typeof mockPage>>(),
  close: vi.fn<() => Promise<void>>(),
}

beforeEach(() => {
  vi.clearAllMocks()
  mockPage.setContent.mockResolvedValue(undefined)
  mockPage.pdf.mockResolvedValue(mockPdfResult)
  mockBrowser.newPage.mockResolvedValue(mockPage)
  mockBrowser.close.mockResolvedValue(undefined)
  vi.mocked(puppeteer.launch).mockResolvedValue(mockBrowser as never)
})

describe('generatePdf', () => {
  const sampleHtml = '<html><body><p>Contrato de teste</p></body></html>'

  it('returns a Buffer', async () => {
    const result = await generatePdf(sampleHtml)
    expect(Buffer.isBuffer(result)).toBe(true)
  })

  it('passes html directly to setContent without modification', async () => {
    await generatePdf(sampleHtml)
    const [passedHtml] = mockPage.setContent.mock.calls[0] as [string, unknown]
    expect(passedHtml).toBe(sampleHtml)
  })

  it('calls page.setContent with the original html content included', async () => {
    await generatePdf(sampleHtml)
    const [injectedHtml] = mockPage.setContent.mock.calls[0] as [string, unknown]
    expect(injectedHtml).toContain('Contrato de teste')
  })

  it('calls page.pdf with format A4 and printBackground true', async () => {
    await generatePdf(sampleHtml)
    expect(mockPage.pdf).toHaveBeenCalledWith(
      expect.objectContaining({ format: 'A4', printBackground: true })
    )
  })

  it('calls page.pdf with displayHeaderFooter true', async () => {
    await generatePdf(sampleHtml)
    expect(mockPage.pdf).toHaveBeenCalledWith(
      expect.objectContaining({ displayHeaderFooter: true })
    )
  })

  it('calls page.pdf with correct margins', async () => {
    await generatePdf(sampleHtml)
    expect(mockPage.pdf).toHaveBeenCalledWith(
      expect.objectContaining({
        margin: { top: '80px', bottom: '80px', left: '60px', right: '60px' },
      })
    )
  })

  it('calls page.pdf with footerTemplate containing .pageNumber and .totalPages classes', async () => {
    await generatePdf(sampleHtml)
    const callArgs = (mockPage.pdf.mock.calls[0] as unknown[])[0] as Record<string, string>
    expect(callArgs.footerTemplate).toContain('class="pageNumber"')
    expect(callArgs.footerTemplate).toContain('class="totalPages"')
  })

  it('calls page.pdf with footerTemplate containing institutional disclaimer', async () => {
    await generatePdf(sampleHtml)
    const callArgs = (mockPage.pdf.mock.calls[0] as unknown[])[0] as Record<string, string>
    expect(callArgs.footerTemplate).toContain('CAU/DF')
  })

  it('calls page.pdf with timeout of 30000ms', async () => {
    await generatePdf(sampleHtml)
    expect(mockPage.pdf).toHaveBeenCalledWith(expect.objectContaining({ timeout: 30_000 }))
  })

  it('calls browser.close in finally even when page.pdf throws', async () => {
    mockPage.pdf.mockRejectedValueOnce(new Error('PDF generation error'))
    await expect(generatePdf(sampleHtml)).rejects.toThrow('PDF generation error')
    expect(mockBrowser.close).toHaveBeenCalledTimes(1)
  })

  it('calls browser.close in finally on successful generation', async () => {
    await generatePdf(sampleHtml)
    expect(mockBrowser.close).toHaveBeenCalledTimes(1)
  })

  it('calls browser.newPage after launching browser', async () => {
    await generatePdf(sampleHtml)
    expect(mockBrowser.newPage).toHaveBeenCalledTimes(1)
  })
})
