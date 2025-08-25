import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { getSession } from '@/lib/auth-actions'
import { sendClientResponse } from '@/lib/email-service'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { message, status } = body

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Response message is required' },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get contact form details
    const forms = await sql`
      SELECT cf.email, cf.name, cf.message
      FROM cms.contact_forms cf
      WHERE cf.id = ${parseInt(params.id)}
      LIMIT 1
    `

    if (forms.length === 0) {
      return NextResponse.json(
        { error: 'Contact form not found' },
        { status: 404 }
      )
    }

    const form = forms[0]

    // Update contact form status
    await sql`
      UPDATE cms.contact_forms 
      SET 
        status = ${status || 'responded'},
        response_sent = TRUE,
        response_sent_at = NOW(),
        is_read = TRUE,
        updated_at = NOW()
      WHERE id = ${parseInt(params.id)}
    `

    // Send email response to client
    try {
      await sendClientResponse({
        adminName: session.name,
        adminEmail: session.email,
        responseMessage: message,
        originalMessage: form.message,
        clientName: form.name,
        clientEmail: form.email
      })
      console.log('Client response email sent successfully')
    } catch (emailError) {
      console.error('Failed to send client response email:', emailError)
      // Don't fail the response if email fails
    }
    
    // Log the activity
    await sql`
      INSERT INTO cms.activity_logs (
        user_id, action, table_name, record_id, new_values
      ) VALUES (
        ${session.id}, 'respond', 'contact_forms', ${parseInt(params.id)}, ${JSON.stringify({
          status: status || 'responded',
          response_sent: true,
          client_email: form.email,
          client_name: form.name,
          responded_by: session.name
        })}
      )
    `

    return NextResponse.json({
      success: true,
      message: 'Response sent successfully',
      details: {
        clientEmail: form.email,
        clientName: form.name,
        responseMessage: message
      }
    })

  } catch (error) {
    console.error('Error sending response:', error)
    return NextResponse.json(
      { error: 'Failed to send response' },
      { status: 500 }
    )
  }
}
