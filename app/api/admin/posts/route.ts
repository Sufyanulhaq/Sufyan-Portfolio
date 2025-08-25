import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { getSession } from '@/lib/auth-actions'

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      tags,
      status,
      featured,
      readTime,
      featuredImage,
      seoTitle,
      seoDescription,
      seoKeywords
    } = body

    // Validation
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Check if slug already exists
    const existingPost = await sql`
      SELECT id FROM cms.posts WHERE slug = ${slug} LIMIT 1
    `

    if (existingPost.length > 0) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      )
    }

    // Create SEO settings
    const seoData = {
      meta_title: seoTitle || title,
      meta_description: seoDescription || excerpt,
      keywords: seoKeywords ? seoKeywords.split(',').map((k: string) => k.trim()) : [],
      canonical_url: `/blog/${slug}`,
      og_image: featuredImage,
      og_title: seoTitle || title,
      og_description: seoDescription || excerpt
    }

    // Convert category to integer if provided
    const categoryId = category ? parseInt(category.toString()) : null
    
    // Debug logging
    console.log('Post creation data:', {
      title,
      slug,
      category: category,
      categoryId: categoryId,
      categoryType: typeof category,
      categoryIdType: typeof categoryId
    })

    // Insert the post
    const result = await sql`
      INSERT INTO cms.posts (
        title, slug, excerpt, content, category_id, tags, status, 
        featured, featured_image, author_id, published_at
      ) VALUES (
        ${title}, ${slug}, ${excerpt || null}, ${content}, 
        ${categoryId}, ${tags || []}, ${status || 'draft'}, 
        ${featured || false}, ${featuredImage || null}, ${session.id}, 
        ${status === 'published' ? new Date().toISOString() : null}
      ) RETURNING id
    `

    const postId = result[0].id

    // Insert SEO settings
    await sql`
      INSERT INTO cms.seo_settings (
        table_name, record_id, meta_title, meta_description, keywords,
        canonical_url, og_image, og_title, og_description
      ) VALUES (
        'posts', ${postId}, ${seoData.meta_title}, ${seoData.meta_description},
        ${seoData.keywords}, ${seoData.canonical_url}, ${seoData.og_image},
        ${seoData.og_title}, ${seoData.og_description}
      )
    `

    // Log the activity
    await sql`
      INSERT INTO cms.activity_logs (
        user_id, action, table_name, record_id, new_values
      ) VALUES (
        ${session.id}, 'create', 'posts', ${postId}, ${JSON.stringify({
          title, slug, status, author: session.name
        })}
      )
    `

    return NextResponse.json({
      success: true,
      message: 'Post created successfully',
      post: {
        id: postId,
        title,
        slug,
        status
      }
    })

  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    const posts = await sql`
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.status,
        p.published_at,
        p.view_count,
        p.created_at,
        p.category_id,
        p.tags,
        p.featured,
        p.featured_image,
        u.name as author_name,
        c.name as category_name
      FROM cms.posts p
      LEFT JOIN cms.users u ON p.author_id = u.id
      LEFT JOIN cms.categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `

    return NextResponse.json({
      success: true,
      posts: posts.map(post => ({
        ...post,
        created_at: post.created_at?.toISOString(),
        published_at: post.published_at?.toISOString()
      }))
    })

  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
