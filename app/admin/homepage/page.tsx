import { getSession } from '@/lib/auth-actions'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  Edit, 
  Eye, 
  Plus,
  Save,
  RefreshCw,
  Globe,
  Image,
  FileText,
  Settings,
  Layout,
  Palette,
  Type,
  ArrowUp,
  ArrowDown,
  Trash2
} from 'lucide-react'
import { neon } from '@neondatabase/serverless'

// Force dynamic rendering to prevent Vercel build issues
export const dynamic = 'force-dynamic'

async function getHomepageSections() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    // Get homepage sections with content and settings
    const sections = await sql`
      SELECT 
        hs.id,
        hs.section_name,
        hs.section_type,
        hs.title,
        hs.subtitle,
        hs.content,
        hs.background_image,
        hs.background_color,
        hs.text_color,
        hs.layout,
        hs.sort_order,
        hs.is_active,
        hs.is_published,
        hs.created_at,
        hs.updated_at,
        u.name as updated_by
      FROM cms.homepage_sections hs
      LEFT JOIN cms.users u ON hs.updated_by = u.id
      ORDER BY hs.sort_order ASC, hs.created_at ASC
    `

    // Get section statistics
    const [totalSections, activeSections, publishedSections] = await Promise.all([
      sql`SELECT COUNT(*) FROM cms.homepage_sections`,
      sql`SELECT COUNT(*) FROM cms.homepage_sections WHERE is_active = TRUE`,
      sql`SELECT COUNT(*) FROM cms.homepage_sections WHERE is_published = TRUE`
    ])

    return {
      sections: sections.map(section => ({
        ...section,
        created_at: section.created_at?.toISOString(),
        updated_at: section.updated_at?.toISOString()
      })),
      stats: {
        total: parseInt(totalSections[0]?.count || '0'),
        active: parseInt(activeSections[0]?.count || '0'),
        published: parseInt(publishedSections[0]?.count || '0')
      }
    }
  } catch (error) {
    console.error('Error fetching homepage sections:', error)
    return {
      sections: [],
      stats: { total: 0, active: 0, published: 0 }
    }
  }
}

export default async function HomepageCMSPage() {
  const session = await getSession()
  if (!session) redirect('/auth/login')
  
  const homepageData = await getHomepageSections()

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'hero': return <Home className="h-5 w-5" />
      case 'content': return <FileText className="h-5 w-5" />
      case 'image': return <Image className="h-5 w-5" />
      case 'layout': return <Layout className="h-5 w-5" />
      default: return <Settings className="h-5 w-5" />
    }
  }

  const getSectionTypeColor = (type: string) => {
    switch (type) {
      case 'hero': return 'bg-blue-100 text-blue-800'
      case 'content': return 'bg-green-100 text-green-800'
      case 'image': return 'bg-purple-100 text-purple-800'
      case 'layout': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (isActive: boolean, isPublished: boolean) => {
    if (isPublished && isActive) return 'bg-green-100 text-green-800'
    if (isActive) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Homepage CMS</h1>
            <span className="text-sm text-muted-foreground">
              Manage your homepage content and layout
            </span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 sm:p-8 lg:p-12">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sections</CardTitle>
              <Layout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{homepageData.stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Homepage sections
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sections</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{homepageData.stats.active}</div>
              <p className="text-xs text-muted-foreground">
                Currently enabled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{homepageData.stats.published}</div>
              <p className="text-xs text-muted-foreground">
                Live on website
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Homepage Sections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Homepage Sections</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Button size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {homepageData.sections.length === 0 ? (
              <div className="text-center py-12">
                <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="mt-4 text-lg font-medium">No homepage sections yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Create your first homepage section to get started.
                </p>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {homepageData.sections.map((section, index) => (
                  <div key={section.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Section Header */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getSectionIcon(section.section_type)}
                            <h3 className="font-medium">{section.section_name}</h3>
                            <Badge className={getSectionTypeColor(section.section_type)}>
                              {section.section_type.toUpperCase()}
                            </Badge>
                            <Badge className={getStatusColor(section.is_active, section.is_published)}>
                              {section.is_published ? 'Published' : section.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            Order: {section.sort_order}
                          </div>
                        </div>

                        {/* Section Content Preview */}
                        <div className="space-y-2">
                          {section.title && (
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Title:</span>
                              <p className="text-sm">{section.title}</p>
                            </div>
                          )}
                          
                          {section.subtitle && (
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Subtitle:</span>
                              <p className="text-sm">{section.subtitle}</p>
                            </div>
                          )}
                          
                          {section.content && (
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Content:</span>
                              <p className="text-sm line-clamp-2">{section.content}</p>
                            </div>
                          )}
                        </div>

                        {/* Section Settings */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {section.background_image && (
                            <span>Background: {section.background_image}</span>
                          )}
                          {section.background_color && (
                            <span>Color: {section.background_color}</span>
                          )}
                          {section.layout && (
                            <span>Layout: {section.layout}</span>
                          )}
                        </div>

                        {/* Last Updated */}
                        <div className="text-xs text-muted-foreground">
                          {section.updated_at ? (
                            <span>Updated: {formatDate(section.updated_at)} by {section.updated_by || 'System'}</span>
                          ) : (
                            <span>Created: {formatDate(section.created_at)}</span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 ml-4">
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Plus className="h-6 w-6" />
                <span>Add Hero Section</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>Add Content Block</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Image className="h-6 w-6" />
                <span>Add Image Section</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Layout className="h-6 w-6" />
                <span>Add Layout Section</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
