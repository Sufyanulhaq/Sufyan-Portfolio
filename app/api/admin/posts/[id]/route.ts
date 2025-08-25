import { NextRequest, NextResponse } from "next/server"
import { neon } from '@neondatabase/serverless'
import { getSession } from '@/lib/auth-actions'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    
    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

    const posts = await sql`
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.content,
        p.featured_image,
        p.status,
        p.featured,
        p.tags,
        p.category_id,
        p.view_count,
        p.published_at,
        p.created_at,
        p.updated_at,
        p.author_id,
        u.name as author_name,
        u.email as author_email,
        c.name as category_name
      FROM cms.posts p
      LEFT JOIN cms.users u ON p.author_id = u.id
      LEFT JOIN cms.categories c ON p.category_id = c.id
      WHERE p.id = ${parseInt(id)}
      LIMIT 1
    `

    if (posts.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const post = posts[0]

    // Get SEO data
    const seoData = await sql`
      SELECT * FROM cms.seo_settings 
      WHERE table_name = 'posts' AND record_id = ${parseInt(id)}
      LIMIT 1
    `

    const formattedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featured_image,
      status: post.status,
      featured: post.featured,
      tags: post.tags || [],
      categoryId: post.category_id,
      viewCount: post.view_count || 0,
      publishedAt: post.published_at?.toISOString(),
      createdAt: post.created_at?.toISOString(),
      updatedAt: post.updated_at?.toISOString(),
      author: {
        id: post.author_id,
        name: post.author_name,
        email: post.author_email
      },
      category: {
        id: post.category_id,
        name: post.category_name
      },
      seo: seoData.length > 0 ? {
        metaTitle: seoData[0].meta_title,
        metaDescription: seoData[0].meta_description,
        keywords: seoData[0].keywords,
        canonicalUrl: seoData[0].canonical_url,
        ogImage: seoData[0].og_image,
        ogTitle: seoData[0].og_title,
        ogDescription: seoData[0].og_description
      } : {}
    }

    return NextResponse.json({
      success: true,
      post: formattedPost
    })

  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    
    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const body = await request.json()
    const { 
      title, 
      slug, 
      excerpt, 
      content, 
      featuredImage, 
      status, 
      featured,
      tags, 
      categoryId,
      seoData 
    } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

    // Check if post exists
    const existingPost = await sql`
      SELECT id FROM cms.posts WHERE id = ${parseInt(id)} LIMIT 1
    `

    if (existingPost.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Update the post
    await sql`
      UPDATE cms.posts SET
        title = ${title},
        slug = ${slug},
        excerpt = ${excerpt || null},
        content = ${content},
        featured_image = ${featuredImage || null},
        status = ${status || 'draft'},
        featured = ${featured || false},
        tags = ${tags || []},
        category_id = ${categoryId ? parseInt(categoryId.toString()) : null},
        published_at = ${status === 'published' ? new Date().toISOString() : null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(id)}
    `

    // Update SEO settings if provided
    if (seoData) {
      await sql`
        INSERT INTO cms.seo_settings (
          table_name, record_id, meta_title, meta_description, keywords,
          canonical_url, og_image, og_title, og_description
        ) VALUES (
          'posts', ${parseInt(id)}, ${seoData.meta_title || null}, 
          ${seoData.meta_description || null}, ${seoData.keywords || null},
          ${seoData.canonical_url || null}, ${seoData.og_image || null},
          ${seoData.og_title || null}, ${seoData.og_description || null}
        ) ON CONFLICT (table_name, record_id) DO UPDATE SET
          meta_title = EXCLUDED.meta_title,
          meta_description = EXCLUDED.meta_description,
          keywords = EXCLUDED.keywords,
          canonical_url = EXCLUDED.canonical_url,
          og_image = EXCLUDED.og_image,
          og_title = EXCLUDED.og_title,
          og_description = EXCLUDED.og_description,
          updated_at = CURRENT_TIMESTAMP
      `
    }

    // Log the activity
    await sql`
      INSERT INTO cms.activity_logs (
        user_id, action, table_name, record_id, new_values
      ) VALUES (
        ${session.id}, 'update', 'posts', ${parseInt(id)}, 
        ${JSON.stringify({ title, status, updated_by: session.name })}
      )
    `

    return NextResponse.json({
      success: true,
      message: "Post updated successfully"
    })

  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    
    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

    // Check if post exists
    const existingPost = await sql`
      SELECT * FROM cms.posts WHERE id = ${parseInt(id)} LIMIT 1
    `

    if (existingPost.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Delete related SEO settings first
    await sql`
      DELETE FROM cms.seo_settings 
      WHERE table_name = 'posts' AND record_id = ${parseInt(id)}
    `

    // Delete the post
    await sql`
      DELETE FROM cms.posts WHERE id = ${parseInt(id)}
    `

    // Log the activity
    await sql`
      INSERT INTO cms.activity_logs (
        user_id, action, table_name, record_id, old_values
      ) VALUES (
        ${session.id}, 'delete', 'posts', ${parseInt(id)}, 
        ${JSON.stringify({ ...existingPost[0], deleted_by: session.name })}
      )
    `

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    )
  }
}