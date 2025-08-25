import { neon } from '@neondatabase/serverless'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface HomepageSection {
  id: number
  section_name: string
  section_type: string
  title?: string
  subtitle?: string
  content?: string
  background_image?: string
  background_color?: string
  text_color?: string
  layout?: string
  sort_order: number
  is_active: boolean
  is_published: boolean
  meta_title?: string
  meta_description?: string
  custom_css?: string
}

async function getHomepageContent(): Promise<HomepageSection[]> {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('Database not configured, using fallback content')
      return []
    }

    const sql = neon(process.env.DATABASE_URL)
    
    const sections = await sql`
      SELECT 
        id, section_name, section_type, title, subtitle, content,
        background_image, background_color, text_color, layout,
        sort_order, is_active, is_published, meta_title,
        meta_description, custom_css
      FROM cms.homepage_sections
      WHERE is_active = TRUE AND is_published = TRUE
      ORDER BY sort_order ASC, id ASC
    `
    
    return sections as HomepageSection[]
  } catch (error) {
    console.error('Error fetching homepage content:', error)
    return []
  }
}

function renderSection(section: HomepageSection) {
  const sectionStyle = {
    backgroundColor: section.background_color || undefined,
    backgroundImage: section.background_image ? `url(${section.background_image})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: section.text_color || undefined
  }

  const containerClass = section.layout === 'full-width' 
    ? 'w-full px-4 sm:px-6 lg:px-8' 
    : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'

  switch (section.section_type) {
    case 'hero':
      return (
        <section 
          key={section.id}
          className="min-h-screen flex items-center justify-center relative overflow-hidden"
          style={sectionStyle}
        >
          <div className={containerClass}>
            <div className="text-center space-y-8">
              {section.title && (
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  {section.title}
                </h1>
              )}
              {section.subtitle && (
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                  {section.subtitle}
                </p>
              )}
              {section.content && (
                <div className="max-w-4xl mx-auto">
                  <div 
                    className="text-lg leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-4">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  View Portfolio
                </Button>
              </div>
            </div>
          </div>
        </section>
      )

    case 'content':
      return (
        <section 
          key={section.id}
          className="py-24 relative"
          style={sectionStyle}
        >
          <div className={containerClass}>
            <div className="text-center space-y-6">
              {section.title && (
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                  {section.title}
                </h2>
              )}
              {section.subtitle && (
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  {section.subtitle}
                </p>
              )}
              {section.content && (
                <div className="max-w-4xl mx-auto">
                  <div 
                    className="text-lg leading-relaxed prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )

    case 'cta':
      return (
        <section 
          key={section.id}
          className="py-24 relative"
          style={sectionStyle}
        >
          <div className={containerClass}>
            <Card className="p-12 text-center bg-gradient-to-r from-primary to-blue-700 text-white">
              {section.title && (
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {section.title}
                </h2>
              )}
              {section.subtitle && (
                <p className="text-xl mb-8 opacity-90">
                  {section.subtitle}
                </p>
              )}
              {section.content && (
                <div 
                  className="mb-8 prose prose-lg prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-primary">
                  Contact Me
                </Button>
              </div>
            </Card>
          </div>
        </section>
      )

    default:
      // Generic content section
      return (
        <section 
          key={section.id}
          className="py-16 relative"
          style={sectionStyle}
        >
          <div className={containerClass}>
            <div className="space-y-6">
              {section.title && (
                <h2 className="text-2xl md:text-3xl font-bold">
                  {section.title}
                </h2>
              )}
              {section.subtitle && (
                <p className="text-lg text-muted-foreground">
                  {section.subtitle}
                </p>
              )}
              {section.content && (
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              )}
            </div>
          </div>
        </section>
      )
  }
}

export default async function DynamicHomepage() {
  const sections = await getHomepageContent()

  if (sections.length === 0) {
    // Fallback content when no database content is available
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to My Portfolio
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Content management system is being set up. Please check back soon.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/portfolio">View Portfolio</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Contact Me</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {sections.map(renderSection)}
      
      {/* Custom CSS */}
      {sections.some(s => s.custom_css) && (
        <style jsx>{`
          ${sections.filter(s => s.custom_css).map(s => s.custom_css).join('\n')}
        `}</style>
      )}
    </div>
  )
}
