import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { getSession } from '@/lib/auth-actions'

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
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

    // Fetch the service
    const services = await sql`
      SELECT 
        s.id,
        s.title,
        s.slug,
        s.description,
        s.content,
        s.long_description,
        s.icon,
        s.featured_image,
        s.price_range,
        s.features,
        s.status,
        s.featured,
        s.sort_order,
        s.meta_title,
        s.meta_description,
        s.seo_data,
        s.created_at,
        s.updated_at
      FROM cms.services s
      WHERE s.id = ${parseInt(id)}
      LIMIT 1
    `

    if (services.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const service = services[0]
    
    // Parse SEO data
    const seoData = service.seo_data || {}
    
    const formattedService = {
      id: service.id,
      title: service.title,
      slug: service.slug,
      description: service.description,
      content: service.content,
      longDescription: service.long_description,
      icon: service.icon,
      featuredImage: service.featured_image,
      priceRange: service.price_range,
      features: service.features || [],
      status: service.status,
      featured: service.featured,
      sortOrder: service.sort_order,
      seoTitle: service.meta_title,
      seoDescription: service.meta_description,
      seoKeywords: seoData.keywords ? seoData.keywords.join(', ') : '',
      createdAt: service.created_at?.toISOString(),
      updatedAt: service.updated_at?.toISOString()
    }

    return NextResponse.json({
      success: true,
      service: formattedService
    })

  } catch (error) {
    console.error("Error fetching service:", error)
    return NextResponse.json(
      { error: "Failed to fetch service" },
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
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    const body = await request.json()
    const { 
      title, 
      slug, 
      description, 
      content, 
      longDescription,
      icon,
      featuredImage, 
      priceRange,
      features,
      status, 
      featured,
      sortOrder,
      seoTitle,
      seoDescription,
      seoKeywords
    } = body

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      )
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

    // Check if service exists
    const existingService = await sql`
      SELECT id FROM cms.services WHERE id = ${parseInt(id)} LIMIT 1
    `

    if (existingService.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    // Check if slug already exists for other services
    const slugConflict = await sql`
      SELECT id FROM cms.services WHERE slug = ${slug} AND id != ${parseInt(id)} LIMIT 1
    `

    if (slugConflict.length > 0) {
      return NextResponse.json(
        { error: "A service with this slug already exists" },
        { status: 400 }
      )
    }

    // Parse SEO keywords
    const keywords = seoKeywords ? seoKeywords.split(',').map((k: string) => k.trim()) : []
    
    // Update the service
    await sql`
      UPDATE cms.services SET
        title = ${title},
        slug = ${slug},
        description = ${description || null},
        content = ${content || null},
        long_description = ${longDescription || null},
        icon = ${icon || null},
        featured_image = ${featuredImage || null},
        price_range = ${priceRange || null},
        features = ${features || []},
        status = ${status || 'active'},
        featured = ${featured || false},
        sort_order = ${sortOrder || 0},
        meta_title = ${seoTitle || null},
        meta_description = ${seoDescription || null},
        seo_data = ${JSON.stringify({ keywords })},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(id)}
    `

    return NextResponse.json({
      success: true,
      message: "Service updated successfully"
    })

  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json(
      { error: "Failed to update service" },
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
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 })
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const sql = neon(process.env.DATABASE_URL)

    // Check if service exists
    const existingService = await sql`
      SELECT id FROM cms.services WHERE id = ${parseInt(id)} LIMIT 1
    `

    if (existingService.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    // Delete the service
    await sql`
      DELETE FROM cms.services WHERE id = ${parseInt(id)}
    `

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    )
  }
}
