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
      features,
      status,
      featured,
      icon,
      featuredImage,
      priceRange,
      deliveryTime,
      sortOrder,
      seoTitle,
      seoDescription,
      seoKeywords
    } = body

    // Validation
    if (!title || !slug || !description || !category || !features || features.length === 0) {
      return NextResponse.json(
        { error: 'Title, slug, description, category, and at least one feature are required' },
        { status: 400 }
      )
    }

    const sql = neon(process.env.DATABASE_URL!)

    // Check if slug already exists
    const existingService = await sql`
      SELECT id FROM cms.services WHERE slug = ${slug} LIMIT 1
    `

    if (existingService.length > 0) {
      return NextResponse.json(
        { error: 'A service with this slug already exists' },
        { status: 400 }
      )
    }

    // Create SEO settings
    const seoData = {
      meta_title: seoTitle || title,
      meta_description: seoDescription || description,
      keywords: seoKeywords ? seoKeywords.split(',').map((k: string) => k.trim()) : [],
      canonical_url: `/services/${slug}`,
      og_image: featuredImage,
      og_title: seoTitle || title,
      og_description: seoDescription || description
    }

    // Insert the service
    const result = await sql`
      INSERT INTO cms.services (
        title, slug, description, long_description, category, features, status, 
        featured, icon, featured_image, price_range, delivery_time, sort_order,
        author_id, created_at, updated_at
      ) VALUES (
        ${title}, ${slug}, ${description}, ${longDescription || null}, 
        ${category}, ${features}, ${status || 'active'}, 
        ${featured || false}, ${icon || null}, ${featuredImage || null}, 
        ${priceRange || null}, ${deliveryTime || null}, 
        ${sortOrder ? parseInt(sortOrder) : null},
        ${session.id}, NOW(), NOW()
      ) RETURNING id
    `

    const serviceId = result[0].id

    // Insert SEO settings
    await sql`
      INSERT INTO cms.seo_settings (
        page_type, page_id, meta_title, meta_description, keywords,
        canonical_url, og_image, og_title, og_description
      ) VALUES (
        'service', ${serviceId}, ${seoData.meta_title}, ${seoData.meta_description},
        ${seoData.keywords}, ${seoData.canonical_url}, ${seoData.og_image},
        ${seoData.og_title}, ${seoData.og_description}
      )
    `

    // Log the activity
    await sql`
      INSERT INTO cms.activity_logs (
        user_id, action, table_name, record_id, new_values
      ) VALUES (
        ${session.id}, 'create', 'services', ${serviceId}, ${JSON.stringify({
          title, slug, category, status, author: session.name
        })}
      )
    `

    return NextResponse.json({
      success: true,
      message: 'Service created successfully',
      service: {
        id: serviceId,
        title,
        slug,
        status
      }
    })

  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
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

    const services = await sql`
      SELECT 
        s.id,
        s.title,
        s.slug,
        s.description,
        s.long_description,
        s.status,
        s.featured,
        s.icon,
        s.featured_image,
        s.price_range,
        s.delivery_time,
        s.features,
        s.category,
        s.sort_order,
        s.created_at,
        s.updated_at,
        s.views_count,
        s.inquiries_count
      FROM cms.services s
      ORDER BY s.sort_order ASC, s.created_at DESC
    `

    return NextResponse.json({
      success: true,
      services: services.map(service => ({
        ...service,
        created_at: service.created_at?.toISOString(),
        updated_at: service.updated_at?.toISOString()
      }))
    })

  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}
