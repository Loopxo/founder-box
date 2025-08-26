import { NextRequest, NextResponse } from 'next/server'
import { generateProposalPDF, generateFileName, generateContractPDF, generateInvoicePDF } from '@/lib/pdf-templates'
import { clientFormSchema } from '@/lib/schemas'
// import { prisma } from '@/lib/prisma' // Temporarily disabled

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()
    console.log('Received request data:', requestData)
    
    // Check if this is an invoice generation request
    if (requestData.type === 'invoice' && requestData.invoice) {
      console.log('Starting invoice PDF generation...')
      const pdfBuffer = await generateInvoicePDF({
        invoice: requestData.invoice,
        logo: requestData.invoice.logo,
        theme: requestData.invoice.theme
      })
      console.log('Invoice PDF generated, buffer length:', pdfBuffer.length)
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
      console.log('Starting contract PDF generation...')
      const pdfBuffer = await generateContractPDF({
        content: requestData.content,
        title: requestData.title,
        logo: requestData.logo
      })
      console.log('Contract PDF generated, buffer length:', pdfBuffer.length)
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
    console.log('Processing as proposal form data')
    
    // Validate the form data
    const validatedData = clientFormSchema.parse(formData)
    console.log('Data validated successfully')
    
    // Generate PDF
    console.log('Starting PDF generation...')
    const pdfBuffer = await generateProposalPDF(
      validatedData, 
      undefined, // default options
      requestData.customImages, // custom images
      requestData.customLogo, // custom logo
      requestData.customTexts, // custom texts
      requestData.imageHeights // image heights
    )
    console.log('PDF generated, buffer length:', pdfBuffer.length)
    const fileName = generateFileName(validatedData)
    console.log('Generated file name:', fileName)
    
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