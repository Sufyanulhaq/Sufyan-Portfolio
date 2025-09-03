import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { getSession } from '@/lib/auth-actions'

export async function GET() {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

    // Get all homepage content sections
    const sections = await sql`
      SELECT 
        id,
        section_name,
        section_type,
        title,
        subtitle,
        content,
        background_image,
        background_color,
        text_color,
        layout,
        sort_order,
        is_active,
        is_published,
        meta_title,
        meta_description,
        custom_css,
        created_at,
        updated_at
      FROM cms.homepage_sections
      ORDER BY sort_order ASC, id ASC
    `

    return NextResponse.json({
      success: true,
      sections: sections.map(section => ({
        ...section,
        created_at: section.created_at?.toISOString(),
        updated_at: section.updated_at?.toISOString()
      }))
    })

  } catch (error) {
    console.error('Error fetching homepage content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch homepage content' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      section_name,
      section_type,
      title,
      subtitle,
      content,
      background_image,
      background_color,
      text_color,
      layout,
      sort_order,
      is_active,
      is_published,
      meta_title,
      meta_description,
      custom_css
    } = body

    if (!section_name || !section_type) {
      return NextResponse.json(
        { error: 'Section name and type are required' },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Insert new homepage section
    const result = await sql`
      INSERT INTO cms.homepage_sections (
        section_name, section_type, title, subtitle, content,
        background_image, background_color, text_color, layout,
        sort_order, is_active, is_published, meta_title,
        meta_description, custom_css, updated_by
      ) VALUES (
        ${section_name}, ${section_type}, ${title || null}, ${subtitle || null}, 
        ${content || null}, ${background_image || null}, ${background_color || null}, 
        ${text_color || null}, ${layout || 'container'}, ${sort_order || 0}, 
        ${is_active !== undefined ? is_active : true}, 
        ${is_published !== undefined ? is_published : false},
        ${meta_title || null}, ${meta_description || null}, ${custom_css || null}, 
        ${session.id}
      ) RETURNING id
    `

    const sectionId = result[0].id

    // Log the activity
    await sql`
      INSERT INTO cms.activity_logs (
        user_id, action, table_name, record_id, new_values
      ) VALUES (
        ${session.id}, 'create', 'homepage_sections', ${sectionId}, ${JSON.stringify({
          section_name, section_type, title, created_by: session.name
        })}
      )
    `

    return NextResponse.json({
      success: true,
      message: 'Homepage section created successfully',
      section: { id: sectionId, section_name, section_type, title }
    })

  } catch (error) {
    console.error('Error creating homepage section:', error)
    return NextResponse.json(
      { error: 'Failed to create homepage section' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Section ID is required' },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Get current data for logging
    const currentSection = await sql`
      SELECT * FROM cms.homepage_sections WHERE id = ${id} LIMIT 1
    `

    if (currentSection.length === 0) {
      return NextResponse.json(
        { error: 'Homepage section not found' },
        { status: 404 }
      )
    }

    // Build update query dynamically
    const updateFields = []
    const updateValues = []
    let paramIndex = 1

    const allowedFields = [
      'section_name', 'section_type', 'title', 'subtitle', 'content',
      'background_image', 'background_color', 'text_color', 'layout',
      'sort_order', 'is_active', 'is_published', 'meta_title',
      'meta_description', 'custom_css'
    ]

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = $${paramIndex}`)
        updateValues.push(value)
        paramIndex++
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Add updated_by and updated_at
    updateFields.push(`updated_by = $${paramIndex}`)
    updateValues.push(session.id)

    const updateQuery = `
      UPDATE cms.homepage_sections 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex + 1}
      RETURNING *
    `

    await sql.unsafe(updateQuery, [...updateValues, id])

    // Log the activity
    await sql`
      INSERT INTO cms.activity_logs (
        user_id, action, table_name, record_id, old_values, new_values
      ) VALUES (
        ${session.id}, 'update', 'homepage_sections', ${id}, 
        ${JSON.stringify(currentSection[0])}, ${JSON.stringify(updateData)}
      )
    `

    return NextResponse.json({
      success: true,
      message: 'Homepage section updated successfully'
    })

  } catch (error) {
    console.error('Error updating homepage section:', error)
    return NextResponse.json(
      { error: 'Failed to update homepage section' },
      { status: 500 }
    )
  }
}

