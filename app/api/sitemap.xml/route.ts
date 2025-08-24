import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET() {
  try {
    // Check if we have database connection
    if (!process.env.DATABASE_URL) {
      throw new Error('Database not configured')
    }

    const sql = neon(process.env.DATABASE_URL)
    
    // Get all published content with error handling
    const [posts, portfolio, services] = await Promise.all([
      sql`SELECT slug, updated_at FROM cms.posts WHERE status = 'published'`.catch(() => []),
      sql`SELECT slug, updated_at FROM cms.portfolio WHERE status = 'published'`.catch(() => []),
      sql`SELECT slug, updated_at FROM cms.services WHERE status = 'active'`.catch(() => [])
    ])

    // Base URL from environment or default
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sufyanulhaq.com'
    
    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/about', priority: '0.8', changefreq: 'weekly' },
      { url: '/portfolio', priority: '0.8', changefreq: 'weekly' },
      { url: '/services', priority: '0.8', changefreq: 'weekly' },
      { url: '/blog', priority: '0.7', changefreq: 'weekly' },
      { url: '/contact', priority: '0.6', changefreq: 'monthly' }
    ]

    // Generate XML sitemap
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    // Add static pages
    staticPages.forEach(page => {
      xml += '  <url>\n'
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`
      xml += `    <priority>${page.priority}</priority>\n`
      xml += '  </url>\n'
    })

    // Add blog posts
    posts.forEach(post => {
      xml += '  <url>\n'
      xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`
      xml += '    <changefreq>monthly</changefreq>\n'
      xml += '    <priority>0.6</priority>\n'
      if (post.updated_at) {
        xml += `    <lastmod>${post.updated_at.toISOString()}</lastmod>\n`
      }
      xml += '  </url>\n'
    })

    // Add portfolio projects
    portfolio.forEach(project => {
      xml += '  <url>\n'
      xml += `    <loc>${baseUrl}/portfolio/${project.slug}</loc>\n`
      xml += '    <changefreq>monthly</changefreq>\n'
      xml += '    <priority>0.7</priority>\n'
      if (project.updated_at) {
        xml += `    <lastmod>${project.updated_at.toISOString()}</lastmod>\n`
      }
      xml += '  </url>\n'
    })

    // Add services
    services.forEach(service => {
      xml += '  <url>\n'
      xml += `    <loc>${baseUrl}/services/${service.slug}</loc>\n`
      xml += '    <changefreq>monthly</changefreq>\n'
      xml += '    <priority>0.7</priority>\n'
      if (service.updated_at) {
        xml += `    <lastmod>${service.updated_at.toISOString()}</lastmod>\n`
      }
      xml += '  </url>\n'
    })

    xml += '</urlset>'

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })

  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Return a basic sitemap on error
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sufyanulhaq.com'
    const basicXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/portfolio</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/services</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`

    return new NextResponse(basicXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  }
}
