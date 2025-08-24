import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sufyanulhaq.com'
  
  const robotsTxt = `# Robots.txt for ${baseUrl}
# Generated automatically

User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/api/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /auth/
Disallow: /api/admin/

# Allow important pages
Allow: /
Allow: /about
Allow: /portfolio
Allow: /services
Allow: /blog
Allow: /contact

# Crawl delay (optional)
Crawl-delay: 1

# Additional directives for Liverpool business SEO
# Local business optimization
Allow: /services/web-development
Allow: /services/ecommerce
Allow: /services/ui-ux-design
Allow: /portfolio/

# Blog content
Allow: /blog/

# Contact and business information
Allow: /contact
Allow: /about

# Performance optimization
Allow: /images/
Allow: /public/
`

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}
