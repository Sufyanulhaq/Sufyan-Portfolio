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

    // Get all active categories
    const categories = await sql`
      SELECT 
        id,
        name,
        slug,
        description,
        parent_id,
        sort_order,
        is_active,
        created_at,
        updated_at
      FROM cms.categories
      WHERE is_active = TRUE
      ORDER BY sort_order ASC, name ASC
    `

    return NextResponse.json({
      success: true,
      categories: categories.map(category => ({
        ...category,
        created_at: category.created_at?.toISOString(),
        updated_at: category.updated_at?.toISOString()
      }))
    })

  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
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
    const { name, slug, description, parent_id, sort_order } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Check if slug already exists
    const existingCategory = await sql`
      SELECT id FROM cms.categories WHERE slug = ${slug} LIMIT 1
    `

    if (existingCategory.length > 0) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      )
    }

    // Insert new category
    const result = await sql`
      INSERT INTO cms.categories (
        name, slug, description, parent_id, sort_order, is_active
      ) VALUES (
        ${name}, ${slug}, ${description || null}, ${parent_id || null}, 
        ${sort_order || 0}, TRUE
      ) RETURNING id
    `

    const categoryId = result[0].id

    // Log the activity
    await sql`
      INSERT INTO cms.activity_logs (
        user_id, action, table_name, record_id, new_values
      ) VALUES (
        ${session.id}, 'create', 'categories', ${categoryId}, ${JSON.stringify({
          name, slug, created_by: session.name
        })}
      )
    `

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      category: { id: categoryId, name, slug }
    })

  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}