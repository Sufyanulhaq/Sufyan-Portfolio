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
    const status = searchParams.get("status")
    const featured = searchParams.get("featured")
    const search = searchParams.get("search")
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

    if (status && status !== "all") {
      whereConditions.push(`p.status = $${paramIndex++}`)
      params.push(status)
    }

    if (featured && featured !== "all") {
      whereConditions.push(`p.featured = $${paramIndex++}`)
      params.push(featured === "true")
    }

    if (search) {
      whereConditions.push(`(p.title ILIKE $${paramIndex++} OR p.description ILIKE $${paramIndex++})`)
      params.push(`%${search}%`)
      params.push(`%${search}%`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM cms.portfolio p
      ${sql.unsafe(whereClause)}
    `
    const total = parseInt(countResult[0]?.total || '0')
    const pages = Math.ceil(total / limit)

    // Get projects
    const projects = await sql`
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.description,
        p.content,
        p.featured_image,
        p.gallery_images,
        p.technologies,
        p.project_url,
        p.github_url,
        p.status,
        p.featured,
        p.sort_order,
        p.view_count,
        p.published_at,
        p.created_at,
        p.updated_at,
        p.author_id,
        u.name as author_name,
        u.email as author_email,
        u.bio as author_bio,
        u.avatar_url as author_avatar
      FROM cms.portfolio p
      LEFT JOIN cms.users u ON p.author_id = u.id
      ${sql.unsafe(whereClause)}
      ORDER BY p.featured DESC, p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    // Format projects
    const formattedProjects = projects.map((project) => ({
      _id: project.id.toString(),
      title: project.title,
      slug: project.slug,
      description: project.description,
      content: project.content,
      featuredImage: project.featured_image,
      galleryImages: project.gallery_images || [],
      technologies: project.technologies || [],
      projectUrl: project.project_url,
      githubUrl: project.github_url,
      status: project.status,
      featured: project.featured,
      sortOrder: project.sort_order,
      viewCount: project.view_count,
      publishedAt: project.published_at?.toISOString(),
      createdAt: project.created_at?.toISOString(),
      updatedAt: project.updated_at?.toISOString(),
      author: project.author_name ? {
        _id: project.author_id?.toString() || '1',
        name: project.author_name,
        email: project.author_email,
        bio: project.author_bio,
        avatar: project.author_avatar
      } : null,
    }))

    return NextResponse.json({
      projects: formattedProjects,
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
    console.error("Error fetching portfolio projects:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
