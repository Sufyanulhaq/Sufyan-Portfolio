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

    const sql = neon(process.env.DATABASE_URL!)

    // Get all homepage sections with metadata
    const sections = await sql`
      SELECT 
        hs.id,
        hs.section_name,
        hs.section_type,
        hs.title,
        hs.subtitle,
        hs.content,
        hs.background_image,
        hs.background_color,
        hs.text_color,
        hs.layout,
        hs.sort_order,
        hs.is_active,
        hs.is_published,
        hs.meta_title,
        hs.meta_description,
        hs.custom_css,
        hs.tags,
        hs.created_at,
        hs.updated_at,
        u.name as updated_by
      FROM cms.homepage_sections hs
      LEFT JOIN cms.users u ON hs.updated_by = u.id
      ORDER BY hs.sort_order ASC, hs.created_at ASC
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
    console.error('Error fetching homepage sections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch homepage sections' },
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
      custom_css,
      tags
    } = body

    if (!section_name || !section_type || !title) {
      return NextResponse.json(
        { error: 'Section name, type, and title are required' },
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
        meta_description, custom_css, tags, updated_by
      ) VALUES (
        ${section_name}, ${section_type}, ${title}, ${subtitle || null}, ${content || null},
        ${background_image || null}, ${background_color || null}, ${text_color || null}, ${layout || 'container'},
        ${sort_order || 1}, ${is_active !== undefined ? is_active : true}, ${is_published !== undefined ? is_published : false},
        ${meta_title || null}, ${meta_description || null}, ${custom_css || null}, ${tags || []}, ${session.id}
      ) RETURNING id
    `

    const sectionId = result[0].id

    // Log the activity
    await sql`
      INSERT INTO cms.activity_logs (
        user_id, action, table_name, record_id, new_values
      ) VALUES (
        ${session.id}, 'create', 'homepage_sections', ${sectionId}, ${JSON.stringify({
          section_name, section_type, title, subtitle, content,
          background_image, background_color, text_color, layout,
          sort_order, is_active, is_published, meta_title,
          meta_description, custom_css, tags, created_by: session.name
        })}
      )
    `

    return NextResponse.json({
      success: true,
      message: 'Homepage section created successfully',
      section: { id: sectionId, section_name, title }
    })

  } catch (error) {
    console.error('Error creating homepage section:', error)
    return NextResponse.json(
      { error: 'Failed to create homepage section' },
      { status: 500 }
    )
  }
}
