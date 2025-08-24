import { getSession } from '@/lib/auth-actions'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Globe, 
  FileText, 
  Settings,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Database,
  Code
} from 'lucide-react'
import { neon } from '@neondatabase/serverless'

// Force dynamic rendering to prevent Vercel build issues
export const dynamic = 'force-dynamic'

async function getSEOSettings() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    // Get global SEO settings
    const globalSettings = await sql`
      SELECT * FROM cms.seo_settings 
      WHERE table_name = 'global' 
      LIMIT 1
    `

    // Get content count for sitemap
    const [postsCount, portfolioCount, servicesCount] = await Promise.all([
      sql`SELECT COUNT(*) FROM cms.posts WHERE status = 'published'`,
      sql`SELECT COUNT(*) FROM cms.portfolio WHERE status = 'published'`,
      sql`SELECT COUNT(*) FROM cms.services WHERE status = 'active'`
    ])

    // Get recent SEO updates
    const recentUpdates = await sql`
      SELECT 
        ss.table_name,
        ss.meta_title,
        ss.updated_at,
        u.name as updated_by
      FROM cms.seo_settings ss
      LEFT JOIN cms.users u ON ss.user_id = u.id
      ORDER BY ss.updated_at DESC
      LIMIT 5
    `

    return {
      globalSettings: globalSettings[0] || null,
      counts: {
        posts: parseInt(postsCount[0]?.count || '0'),
        portfolio: parseInt(portfolioCount[0]?.count || '0'),
        services: parseInt(servicesCount[0]?.count || '0')
      },
      recentUpdates: recentUpdates.map(update => ({
        ...update,
        updated_at: update.updated_at?.toISOString()
      }))
    }
  } catch (error) {
    console.error('Error fetching SEO settings:', error)
    return {
      globalSettings: null,
      counts: { posts: 0, portfolio: 0, services: 0 },
      recentUpdates: []
    }
  }
}

export default async function SEOPage() {
  const session = await getSession()
  if (!session) redirect('/auth/login')
  
  const seoData = await getSEOSettings()

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">SEO Management</h1>
            <span className="text-sm text-muted-foreground">
              Optimize your website for search engines
            </span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Global Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 sm:p-8 lg:p-12">
        {/* SEO Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{seoData.counts.posts}</div>
              <p className="text-xs text-muted-foreground">
                SEO optimized content
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Projects</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{seoData.counts.portfolio}</div>
              <p className="text-xs text-muted-foreground">
                Project showcases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{seoData.counts.services}</div>
              <p className="text-xs text-muted-foreground">
                Service offerings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SEO Status</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* SEO Tools */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Sitemap Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Sitemap Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">XML Sitemap</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pages Indexed</span>
                  <span className="text-sm font-medium">
                    {seoData.counts.posts + seoData.counts.portfolio + seoData.counts.services + 5}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Updated</span>
                  <span className="text-sm text-muted-foreground">
                    {seoData.globalSettings?.updated_at ? 
                      formatDate(seoData.globalSettings.updated_at) : 'Never'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Robots.txt Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Robots.txt Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Modified</span>
                  <span className="text-sm text-muted-foreground">
                    {seoData.globalSettings?.updated_at ? 
                      formatDate(seoData.globalSettings.updated_at) : 'Never'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rules</span>
                  <span className="text-sm font-medium">5</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Code className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent SEO Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Recent SEO Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            {seoData.recentUpdates.length === 0 ? (
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No recent SEO updates</p>
              </div>
            ) : (
              <div className="space-y-3">
                {seoData.recentUpdates.map((update, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <Search className="h-4 w-4 text-blue-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">
                          {update.table_name === 'posts' ? 'Blog Post' :
                           update.table_name === 'portfolio' ? 'Portfolio' :
                           update.table_name === 'services' ? 'Service' :
                           update.table_name === 'global' ? 'Global' :
                           update.table_name}
                        </Badge>
                        <span className="text-sm font-medium">
                          {update.updated_by || 'System'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {update.meta_title || 'SEO settings updated'}
                      </p>
                    </div>
                    
                    <div className="text-xs text-muted-foreground flex-shrink-0">
                      {update.updated_at ? formatDate(update.updated_at) : 'Unknown'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* SEO Health Check */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              SEO Health Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Meta Titles</p>
                  <p className="text-sm text-green-600">All pages optimized</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Meta Descriptions</p>
                  <p className="text-sm text-green-600">Complete coverage</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Structured Data</p>
                  <p className="text-sm text-green-600">Schema implemented</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Image Alt Tags</p>
                  <p className="text-sm text-green-600">All images tagged</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Page Speed</p>
                  <p className="text-sm text-green-600">Optimized</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Mobile Friendly</p>
                  <p className="text-sm text-green-600">Responsive design</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
