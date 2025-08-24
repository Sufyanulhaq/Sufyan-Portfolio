import { NextRequest, NextResponse } from "next/server"
import { neon } from '@neondatabase/serverless'

// Force dynamic rendering to prevent build-time analysis
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    const offset = (page - 1) * limit

    const sql = neon(process.env.DATABASE_URL)
    
    // Build WHERE conditions
    let whereConditions = ["p.status = 'published'"]
    let params: any[] = []
    let paramIndex = 1

    if (category && category !== "all") {
      whereConditions.push(`p.category_id = $${paramIndex++}`)
      params.push(category)
    }

    if (search) {
      whereConditions.push(`(p.title ILIKE $${paramIndex++} OR p.excerpt ILIKE $${paramIndex++} OR p.content ILIKE $${paramIndex++})`)
      params.push(`%${search}%`)
      params.push(`%${search}%`)
      params.push(`%${search}%`)
    }

    if (featured && featured !== "all") {
      whereConditions.push(`p.featured = $${paramIndex++}`)
      params.push(featured === "true")
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM cms.posts p
      ${sql.unsafe(whereClause)}
    `
    const total = parseInt(countResult[0]?.total || '0')
    const pages = Math.ceil(total / limit)

    // Get posts
    const posts = await sql`
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.content,
        p.featured_image,
        p.status,
        p.view_count,
        p.published_at,
        p.created_at,
        p.updated_at,
        u.name as author_name,
        u.email as author_email,
        u.bio as author_bio,
        u.avatar_url as author_avatar
      FROM cms.posts p
      LEFT JOIN cms.users u ON p.author_id = u.id
      ${sql.unsafe(whereClause)}
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    // Format posts
    const formattedPosts = posts.map((post) => ({
      _id: post.id.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featured_image,
      status: post.status,
      viewCount: post.view_count,
      publishedAt: post.published_at?.toISOString(),
      createdAt: post.created_at?.toISOString(),
      updatedAt: post.updated_at?.toISOString(),
      author: post.author_name ? {
        _id: post.author_id?.toString() || '1',
        name: post.author_name,
        email: post.author_email,
        bio: post.author_bio,
        avatar: post.author_avatar
      } : null,
    }))

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
  }
}
