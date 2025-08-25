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
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

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
        p.category_id,
        p.view_count,
        p.published_at,
        p.created_at,
        p.updated_at,
        p.author_id,
        u.name as author_name,
        u.email as author_email,
        c.name as category_name
      FROM cms.portfolio p
      LEFT JOIN cms.users u ON p.author_id = u.id
      LEFT JOIN cms.categories c ON p.category_id = c.id
      WHERE p.id = ${parseInt(id)}
      LIMIT 1
    `

    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const project = projects[0]

    // Get SEO data
    const seoData = await sql`
      SELECT * FROM cms.seo_settings 
      WHERE table_name = 'portfolio' AND record_id = ${parseInt(id)}
      LIMIT 1
    `

    const formattedProject = {
      id: project.id,
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
      categoryId: project.category_id,
      viewCount: project.view_count || 0,
      publishedAt: project.published_at?.toISOString(),
      createdAt: project.created_at?.toISOString(),
      updatedAt: project.updated_at?.toISOString(),
      author: {
        id: project.author_id,
        name: project.author_name,
        email: project.author_email
      },
      category: {
        id: project.category_id,
        name: project.category_name
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
      project: formattedProject
    })

  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json(
      { error: "Failed to fetch project" },
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
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const body = await request.json()
    const { 
      title, 
      slug, 
      description, 
      content, 
      featuredImage, 
      galleryImages,
      technologies,
      projectUrl,
      githubUrl,
      status, 
      featured,
      sortOrder,
      categoryId,
      seoData 
    } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      )
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

    // Check if project exists
    const existingProject = await sql`
      SELECT id FROM cms.portfolio WHERE id = ${parseInt(id)} LIMIT 1
    `

    if (existingProject.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Update the project
    await sql`
      UPDATE cms.portfolio SET
        title = ${title},
        slug = ${slug},
        description = ${description},
        content = ${content || null},
        featured_image = ${featuredImage || null},
        gallery_images = ${galleryImages || []},
        technologies = ${technologies || []},
        project_url = ${projectUrl || null},
        github_url = ${githubUrl || null},
        status = ${status || 'draft'},
        featured = ${featured || false},
        sort_order = ${sortOrder || 0},
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
          'portfolio', ${parseInt(id)}, ${seoData.meta_title || null}, 
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
        ${session.id}, 'update', 'portfolio', ${parseInt(id)}, 
        ${JSON.stringify({ title, status, updated_by: session.name })}
      )
    `

    return NextResponse.json({
      success: true,
      message: "Project updated successfully"
    })

  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json(
      { error: "Failed to update project" },
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
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

    // Check if project exists
    const existingProject = await sql`
      SELECT * FROM cms.portfolio WHERE id = ${parseInt(id)} LIMIT 1
    `

    if (existingProject.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Delete related SEO settings first
    await sql`
      DELETE FROM cms.seo_settings 
      WHERE table_name = 'portfolio' AND record_id = ${parseInt(id)}
    `

    // Delete the project
    await sql`
      DELETE FROM cms.portfolio WHERE id = ${parseInt(id)}
    `

    // Log the activity
    await sql`
      INSERT INTO cms.activity_logs (
        user_id, action, table_name, record_id, old_values
      ) VALUES (
        ${session.id}, 'delete', 'portfolio', ${parseInt(id)}, 
        ${JSON.stringify({ ...existingProject[0], deleted_by: session.name })}
      )
    `

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    )
  }
}