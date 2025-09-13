import { NextRequest, NextResponse } from 'next/server'
import { generateProposalPDF, generateFileName, generateContractPDF, generateInvoicePDF } from '@/lib/pdf-templates'
import { pdfGenerationLimiter, getClientIP, createRateLimitResponse } from "@/lib/rate-limit"
import { clientFormSchema } from '@/lib/schemas'
// import { prisma } from '@/lib/prisma' // Temporarily disabled

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientIP = getClientIP(request)
    const rateLimitResult = pdfGenerationLimiter.isAllowed(clientIP)
    
    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(
        rateLimitResult.remaining,
        rateLimitResult.resetTime,
        "Too many PDF generation requests. Please wait before trying again."
      )
    }
    const requestData = await request.json()
    
    // Check if this is an invoice generation request
    if (requestData.type === 'invoice' && requestData.invoice) {
      const pdfBuffer = await generateInvoicePDF({
        invoice: requestData.invoice,
        logo: requestData.invoice.logo,
        theme: requestData.invoice.theme
      })
      const fileName = `invoice-${requestData.invoice.invoiceNumber || 'draft'}.pdf`
      
      return new NextResponse(pdfBuffer as unknown as BodyInit, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Length': pdfBuffer.length.toString(),
        }
      })
    }
    
    // Check if this is a contract generation request
    if (requestData.content && requestData.title) {
      // Contract generation
      const pdfBuffer = await generateContractPDF({
        content: requestData.content,
        title: requestData.title,
        logo: requestData.logo
      })
      const fileName = `${requestData.title.replace(/\s+/g, '_')}.pdf`
      
      return new NextResponse(pdfBuffer as unknown as BodyInit, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Length': pdfBuffer.length.toString(),
        }
      })
    }
    
    // Proposal generation (existing functionality)
    const formData = requestData
    
    // Validate the form data
    const validatedData = clientFormSchema.parse(formData)
    
    // Generate PDF
    const pdfBuffer = await generateProposalPDF(
      validatedData, 
      undefined, // default options
      requestData.customImages, // custom images
      requestData.customLogo, // custom logo
      requestData.customTexts, // custom texts
      requestData.imageHeights // image heights
    )
    const fileName = generateFileName(validatedData)
    
    // TODO: Save client and proposal to database when database is set up
    // try {
    //   const client = await prisma.client.create({
    //     data: {
    //       clientName: validatedData.clientName,
    //       clientEmail: validatedData.clientEmail,
    //       clientPhone: validatedData.clientPhone,
    //       businessName: validatedData.businessName,
    //       industry: validatedData.industry,
    //       services: validatedData.services,
    //       budget: validatedData.budget,
    //       timeline: validatedData.timeline,
    //       currentWebsite: validatedData.currentWebsite || null,
    //       specialRequirements: validatedData.specialRequirements || null,
    //       competitors: validatedData.competitors || null,
    //     }
    //   })

    //   await prisma.proposal.create({
    //     data: {
    //       clientId: client.id,
    //       template: validatedData.industry,
    //       status: 'generated',
    //       fileName: fileName,
    //     }
    //   })
    // } catch (dbError) {
    //   console.error('Database error (non-blocking):', dbError)
    //   // Don't fail the PDF generation if database fails
    // }
    
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': pdfBuffer.length.toString(),
      }
    })
    
  } catch (error) {
    console.error('PDF generation error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ 
        error: 'Invalid form data',
        details: 'Validation failed'
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      error: 'PDF generation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}