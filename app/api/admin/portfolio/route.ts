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
      description,
      longDescription,
      category,
      technologies,
      status,
      featured,
      client,
      projectUrl,
      githubUrl,
      featuredImage,
      completionDate,
      seoTitle,
      seoDescription,
      seoKeywords
    } = body

    // Validation
    if (!title || !slug || !description || !category || !technologies || technologies.length === 0) {
      return NextResponse.json(
        { error: 'Title, slug, description, category, and at least one technology are required' },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Check if slug already exists
    const existingProject = await sql`
      SELECT id FROM cms.portfolio WHERE slug = ${slug} LIMIT 1
    `

    if (existingProject.length > 0) {
      return NextResponse.json(
        { error: 'A project with this slug already exists' },
        { status: 400 }
      )
    }

    // Create SEO settings
    const seoData = {
      meta_title: seoTitle || title,
      meta_description: seoDescription || description,
      keywords: seoKeywords ? seoKeywords.split(',').map((k: string) => k.trim()) : [],
      canonical_url: `/portfolio/${slug}`,
      og_image: featuredImage,
      og_title: seoTitle || title,
      og_description: seoDescription || description
    }

    // Insert the project
    const result = await sql`
      INSERT INTO cms.portfolio (
        title, slug, description, long_description, category, technologies, status, 
        featured, client, project_url, github_url, featured_image, completion_date,
        author_id, created_at
      ) VALUES (
        ${title}, ${slug}, ${description}, ${longDescription || null}, 
        ${category}, ${technologies}, ${status || 'draft'}, 
        ${featured || false}, ${client || null}, ${projectUrl || null}, 
        ${githubUrl || null}, ${featuredImage || null}, 
        ${completionDate ? new Date(completionDate).toISOString() : null},
        ${session.id}, NOW()
      ) RETURNING id
    `

    const projectId = result[0].id

    // Insert SEO settings
    await sql`
      INSERT INTO cms.seo_settings (
        page_type, page_id, meta_title, meta_description, keywords,
        canonical_url, og_image, og_title, og_description
      ) VALUES (
        'portfolio', ${projectId}, ${seoData.meta_title}, ${seoData.meta_description},
        ${seoData.keywords}, ${seoData.canonical_url}, ${seoData.og_image},
        ${seoData.og_title}, ${seoData.og_description}
      )
    `

    // Log the activity
    await sql`
      INSERT INTO cms.activity_logs (
        user_id, action, table_name, record_id, new_values
      ) VALUES (
        ${session.id}, 'create', 'portfolio', ${projectId}, ${JSON.stringify({
          title, slug, category, status, author: session.name
        })}
      )
    `

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      project: {
        id: projectId,
        title,
        slug,
        status
      }
    })

  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
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

    const portfolio = await sql`
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.description,
        p.long_description,
        p.status,
        p.featured,
        p.client,
        p.project_url,
        p.github_url,
        p.technologies,
        p.category,
        p.completion_date,
        p.created_at,
        p.views_count,
        p.likes_count,
        p.featured_image
      FROM cms.portfolio p
      ORDER BY p.created_at DESC
    `

    return NextResponse.json({
      success: true,
      portfolio: portfolio.map(project => ({
        ...project,
        created_at: project.created_at?.toISOString(),
        completion_date: project.completion_date?.toISOString()
      }))
    })

  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}
