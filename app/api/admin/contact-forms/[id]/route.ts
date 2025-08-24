import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { getSession } from '@/lib/auth-actions'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    const forms = await sql`
      SELECT 
        cf.id,
        cf.name,
        cf.email,
        cf.phone,
        cf.message,
        cf.status,
        cf.is_read,
        cf.source,
        cf.ip_address,
        cf.user_agent,
        cf.created_at,
        cf.updated_at,
        cf.response_sent,
        cf.response_sent_at,
        cf.notes
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

    return NextResponse.json({
      success: true,
      form: {
        ...form,
        created_at: form.created_at?.toISOString(),
        updated_at: form.updated_at?.toISOString(),
        response_sent_at: form.response_sent_at?.toISOString()
      }
    })

  } catch (error) {
    console.error('Error fetching contact form:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact form' },
      { status: 500 }
    )
  }
}

export async function PATCH(
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
    const { status, notes, is_read } = body

    const sql = neon(process.env.DATABASE_URL!)

    // Build update fields
    const updateFields = []
    const updateValues = []

    if (status !== undefined) {
      updateFields.push('status = $' + (updateFields.length + 1))
      updateValues.push(status)
    }

    if (notes !== undefined) {
      updateFields.push('notes = $' + (updateFields.length + 1))
      updateValues.push(notes)
    }

    if (is_read !== undefined) {
      updateFields.push('is_read = $' + (updateFields.length + 1))
      updateValues.push(is_read)
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    // Add ID to values
    updateValues.push(parseInt(params.id))

    const updateQuery = `
      UPDATE cms.contact_forms 
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE id = $${updateValues.length}
    `

    await sql.unsafe(updateQuery, updateValues)

    // Log the activity
    await sql`
      INSERT INTO cms.activity_logs (
        user_id, action, table_name, record_id, new_values
      ) VALUES (
        ${session.id}, 'update', 'contact_forms', ${parseInt(params.id)}, ${JSON.stringify({
          status, notes, is_read, updated_by: session.name
        })}
      )
    `

    return NextResponse.json({
      success: true,
      message: 'Contact form updated successfully'
    })

  } catch (error) {
    console.error('Error updating contact form:', error)
    return NextResponse.json(
      { error: 'Failed to update contact form' },
      { status: 500 }
    )
  }
}
