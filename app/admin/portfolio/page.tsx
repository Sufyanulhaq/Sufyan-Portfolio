import { getSession } from '@/lib/auth-actions'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Globe,
  Github,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'
import { neon } from '@neondatabase/serverless'

async function getPortfolio() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const portfolio = await sql`
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.description,
        p.status,
        p.featured,
        p.project_url,
        p.github_url,
        p.technologies,
        p.category,
        p.client,
        p.completion_date,
        p.created_at,
        p.views_count,
        p.likes_count,
        p.featured_image
      FROM cms.portfolio p
      ORDER BY p.created_at DESC
    `
    
    return portfolio
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return []
  }
}

export default async function PortfolioPage() {
  const session = await getSession()
  if (!session) redirect('/auth/login')
  
  const portfolio = await getPortfolio()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Web Development': 'bg-blue-100 text-blue-800',
      'Mobile App': 'bg-purple-100 text-purple-800',
      'E-commerce': 'bg-green-100 text-green-800',
      'UI/UX Design': 'bg-pink-100 text-pink-800',
      'API Development': 'bg-orange-100 text-orange-800',
      'Dashboard': 'bg-indigo-100 text-indigo-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Portfolio Management</h1>
            <span className="text-sm text-muted-foreground">
              Showcase your best projects and work
            </span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button asChild>
              <Link href="/admin/portfolio/new">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 sm:p-8 lg:p-12">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{portfolio.length}</div>
              <p className="text-xs text-muted-foreground">
                All projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {portfolio.filter(p => p.status === 'published').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Live projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {portfolio.filter(p => p.featured).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Highlighted work
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {portfolio.reduce((sum, p) => sum + (p.views_count || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                All projects combined
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Grid */}
        <Card>
          <CardHeader>
            <CardTitle>All Portfolio Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {portfolio.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No projects yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Get started by adding your first portfolio project.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/admin/portfolio/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Project
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {portfolio.map((project) => (
                  <div key={project.id} className="group border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                    {/* Project Image */}
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      {project.featured_image ? (
                        <img
                          src={project.featured_image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                      </div>
                      
                      {/* Featured Badge */}
                      {project.featured && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary">Featured</Badge>
                        </div>
                      )}
                    </div>

                    {/* Project Info */}
                    <div className="p-4 space-y-3">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        
                        {project.description && (
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>

                      {/* Category */}
                      {project.category && (
                        <Badge className={getCategoryColor(project.category)} variant="outline">
                          {project.category}
                        </Badge>
                      )}

                      {/* Technologies */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 3).map((tech: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{project.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Project Details */}
                      <div className="space-y-2 text-xs text-muted-foreground">
                        {project.client && (
                          <div className="flex items-center gap-1">
                            <span>Client: {project.client}</span>
                          </div>
                        )}
                        
                        {project.completion_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Completed: {formatDate(project.completion_date)}</span>
                          </div>
                        )}
                        
                        {project.views_count > 0 && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{project.views_count.toLocaleString()} views</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-2">
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link href={`/admin/portfolio/${project.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </Button>
                        
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link href={`/portfolio/${project.slug}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                        
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* External Links */}
                      {(project.project_url || project.github_url) && (
                        <div className="flex items-center gap-2 pt-2 border-t">
                          {project.project_url && (
                            <Button asChild variant="ghost" size="sm" className="flex-1">
                              <Link href={project.project_url} target="_blank">
                                <Globe className="mr-2 h-4 w-4" />
                                Live Demo
                              </Link>
                            </Button>
                          )}
                          
                          {project.github_url && (
                            <Button asChild variant="ghost" size="sm" className="flex-1">
                              <Link href={project.github_url} target="_blank">
                                <Github className="mr-2 h-4 w-4" />
                                Code
                              </Link>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
