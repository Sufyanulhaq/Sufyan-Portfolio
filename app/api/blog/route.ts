import { NextRequest, NextResponse } from "next/server"
import { neon } from '@neondatabase/serverless'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category") || "all"
    const search = searchParams.get("search") || ""
    const featured = searchParams.get("featured") || "all"
    
    // Check if we have database connection
    if (!process.env.DATABASE_URL) {
      throw new Error('Database not configured')
    }

    const sql = neon(process.env.DATABASE_URL)

    // Build query conditions
    let whereConditions = "WHERE p.status = 'published'"
    const queryParams: any[] = []
    let paramIndex = 1

    if (category !== "all") {
      whereConditions += ` AND p.category_id = $${paramIndex}`
      queryParams.push(parseInt(category))
      paramIndex++
    }
    
    if (featured !== "all") {
      whereConditions += ` AND p.featured = $${paramIndex}`
      queryParams.push(featured === "true")
      paramIndex++
    }
    
    if (search) {
      whereConditions += ` AND (p.title ILIKE $${paramIndex} OR p.excerpt ILIKE $${paramIndex} OR p.content ILIKE $${paramIndex})`
      queryParams.push(`%${search}%`)
      paramIndex++
    }

    // Execute query with pagination
    const offset = (page - 1) * limit
    
    const postsQuery = `
      SELECT 
        p.id, p.title, p.slug, p.excerpt, p.content, p.category_id, p.tags,
        p.featured, p.status, p.view_count, p.featured_image,
        p.created_at, p.updated_at, p.published_at,
        u.name as author_name, c.name as category_name
      FROM cms.posts p
      LEFT JOIN cms.users u ON p.author_id = u.id
      LEFT JOIN cms.categories c ON p.category_id = c.id
      ${whereConditions}
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    
    const countQuery = `
      SELECT COUNT(*) 
      FROM cms.posts p
      ${whereConditions}
    `

    queryParams.push(limit, offset)
    
    const [posts, totalResult] = await Promise.all([
      sql.unsafe(postsQuery, queryParams),
      sql.unsafe(countQuery, queryParams.slice(0, -2))
    ])

    const total = parseInt(totalResult[0]?.count || '0')

    const formattedPosts = posts.map((post) => ({
      ...post,
      id: post.id.toString(),
      author: post.author_name ? {
        name: post.author_name,
      } : null,
      created_at: post.created_at?.toISOString(),
      updated_at: post.updated_at?.toISOString(),
      published_at: post.published_at?.toISOString(),
    }))

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
