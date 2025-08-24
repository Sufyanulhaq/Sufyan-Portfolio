import { NextRequest, NextResponse } from "next/server"
import { neon } from '@neondatabase/serverless'

// Force dynamic rendering to prevent build-time analysis
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)
    
    const categories = await sql`
      SELECT 
        id,
        name,
        slug,
        description,
        parent_id,
        sort_order,
        is_active,
        meta_title,
        meta_description,
        created_at,
        updated_at
      FROM cms.categories
      WHERE is_active = TRUE
      ORDER BY sort_order ASC, name ASC
    `

    const formattedCategories = categories.map((category) => ({
      _id: category.id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parent_id,
      sortOrder: category.sort_order,
      isActive: category.is_active,
      metaTitle: category.meta_title,
      metaDescription: category.meta_description,
      createdAt: category.created_at?.toISOString(),
      updatedAt: category.updated_at?.toISOString(),
    }))

    return NextResponse.json({ categories: formattedCategories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
