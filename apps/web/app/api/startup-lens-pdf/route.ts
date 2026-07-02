import { NextRequest, NextResponse } from "next/server"
import { requestMeta } from "@/lib/audit"
import { assertSameOrigin, enforceApiRateLimit, payloadTooLargeResponse, readJsonBody } from "@/lib/security"
import { normalizeStartupLensDraft } from "@/lib/startup-lens-data"
import { generateStartupLensPDF } from "@/lib/startup-lens-pdf"

function sanitizeFilename(companyName: string) {
  const safeName = companyName.trim().replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "")
  return safeName || "startup_lens_report"
}

export async function POST(request: NextRequest) {
  try {
    const csrfResponse = assertSameOrigin(request)
    if (csrfResponse) return csrfResponse
    const rateLimitResponse = await enforceApiRateLimit({ ip: requestMeta(request).ipAddress, scope: "public:startup-lens-pdf", limit: 20 })
    if (rateLimitResponse) return rateLimitResponse

    const payload = await readJsonBody(request).catch((error) => {
      throw payloadTooLargeResponse(error) || error
    })
    const draft = normalizeStartupLensDraft(payload)
    const pdfBuffer = await generateStartupLensPDF(draft)
    const fileName = `${sanitizeFilename(draft.companyName)}_startup_lens_report.pdf`

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    if (error instanceof NextResponse) return error
    console.error("Startup Lens PDF generation error:", error)

    return NextResponse.json(
      {
        error: "PDF generation failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
