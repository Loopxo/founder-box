import { NextRequest, NextResponse } from 'next/server'
import { buildResumeHTML, ResumeData } from '@/lib/resume-html'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, template = 'classic' } = body as { data: ResumeData; template: string }

    // Use the SAME HTML generator as the live preview — guaranteed match
    const html = buildResumeHTML(data, template)

    // PDF generation via Puppeteer
    try {
      const PDF_WIDTH = '8.5in'
      const baseMargin = { top: '0', right: '0', bottom: '0', left: '0' }

      // Try @sparticuz/chromium (production / serverless)
      try {
        const chromium = await import('@sparticuz/chromium')
        const puppeteer = await import('puppeteer-core')

        const executablePath = await chromium.default.executablePath()
        const browser = await puppeteer.default.launch({
          args: chromium.default.args,
          executablePath,
          headless: true,
        })

        const page = await browser.newPage()
        await page.setViewport({ width: 816, height: 1056 })
        await page.setContent(html, { waitUntil: 'networkidle0' })

        // Measure actual content height so the PDF is never cut off
        const contentHeightPx = await page.evaluate(() => document.documentElement.scrollHeight)
        const contentHeightIn = (contentHeightPx / 96).toFixed(4) + 'in'

        const pdfBuffer = await page.pdf({
          printBackground: true,
          width: PDF_WIDTH,
          height: contentHeightIn,
          margin: baseMargin,
        })
        await browser.close()

        return new NextResponse(Buffer.from(pdfBuffer), {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="resume.pdf"`,
          },
        })
      } catch {
        // Fallback: local Chrome
        const puppeteerFull = await import('puppeteer-core')
        const { execSync } = await import('child_process')

        let executablePath = ''
        const paths = [
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          '/usr/bin/google-chrome',
          '/usr/bin/chromium-browser',
          '/usr/bin/chromium',
        ]
        for (const p of paths) {
          try { execSync(`test -f "${p}"`, { stdio: 'ignore' }); executablePath = p; break }
          catch { continue }
        }
        if (!executablePath) throw new Error('No Chrome found')

        const browser = await puppeteerFull.default.launch({
          executablePath,
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        })
        const page = await browser.newPage()
        await page.setViewport({ width: 816, height: 1056 })
        await page.setContent(html, { waitUntil: 'networkidle0' })

        // Measure actual content height so the PDF is never cut off
        const contentHeightPx = await page.evaluate(() => document.documentElement.scrollHeight)
        const contentHeightIn = (contentHeightPx / 96).toFixed(4) + 'in'

        const pdfBuffer = await page.pdf({
          printBackground: true,
          width: PDF_WIDTH,
          height: contentHeightIn,
          margin: baseMargin,
        })
        await browser.close()

        return new NextResponse(Buffer.from(pdfBuffer), {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="resume.pdf"`,
          },
        })
      }
    } catch (pdfError) {
      console.error('PDF generation failed, returning HTML fallback:', pdfError)
      return new NextResponse(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'X-PDF-Fallback': 'true',
        },
      })
    }
  } catch (error) {
    console.error('Resume PDF API error:', error)
    return NextResponse.json({ error: 'Failed to generate resume' }, { status: 500 })
  }
}
