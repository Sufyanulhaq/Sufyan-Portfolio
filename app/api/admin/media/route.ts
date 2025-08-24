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

    // Get all media files with metadata
    const mediaFiles = await sql`
      SELECT 
        ml.id,
        ml.filename,
        ml.original_name,
        ml.file_path,
        ml.file_size,
        ml.mime_type,
        ml.category,
        ml.tags,
        ml.alt_text,
        ml.caption,
        ml.usage_count,
        ml.created_at,
        ml.updated_at,
        u.name as uploaded_by
      FROM cms.media_library ml
      LEFT JOIN cms.users u ON ml.uploaded_by = u.id
      ORDER BY ml.created_at DESC
    `

    return NextResponse.json({
      success: true,
      media: mediaFiles.map(file => ({
        ...file,
        created_at: file.created_at?.toISOString(),
        updated_at: file.updated_at?.toISOString()
      }))
    })

  } catch (error) {
    console.error('Error fetching media library:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media library' },
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
      filename, 
      original_name, 
      file_path, 
      file_size, 
      mime_type, 
      category, 
      tags, 
      alt_text, 
      caption 
    } = body

    if (!filename || !original_name || !file_path || !file_size || !mime_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Insert new media file
    const result = await sql`
      INSERT INTO cms.media_library (
        filename, original_name, file_path, file_size, mime_type,
        category, tags, alt_text, caption, uploaded_by
      ) VALUES (
        ${filename}, ${original_name}, ${file_path}, ${file_size}, ${mime_type},
        ${category || null}, ${tags || []}, ${alt_text || null}, ${caption || null}, ${session.id}
      ) RETURNING id
    `

    const mediaId = result[0].id

    // Log the activity
    await sql`
      INSERT INTO cms.activity_logs (
        user_id, action, table_name, record_id, new_values
      ) VALUES (
        ${session.id}, 'create', 'media_library', ${mediaId}, ${JSON.stringify({
          filename, original_name, file_path, file_size, mime_type,
          category, tags, alt_text, caption, uploaded_by: session.name
        })}
      )
    `

    return NextResponse.json({
      success: true,
      message: 'Media file uploaded successfully',
      media: { id: mediaId, filename, original_name }
    })

  } catch (error) {
    console.error('Error uploading media file:', error)
    return NextResponse.json(
      { error: 'Failed to upload media file' },
      { status: 500 }
    )
  }
}
