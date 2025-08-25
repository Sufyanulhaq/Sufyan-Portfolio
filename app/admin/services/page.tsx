import { getSession } from '@/lib/auth-actions'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Settings,
  DollarSign,
  Star,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { neon } from '@neondatabase/serverless'

// Force dynamic rendering to prevent build-time database connection
export const dynamic = 'force-dynamic'

async function getServices() {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('Database not configured')
      return []
    }

    const sql = neon(process.env.DATABASE_URL)
    
    const services = await sql`
      SELECT 
        s.id,
        s.title,
        s.slug,
        s.description,
        s.content,
        s.status,
        s.featured,
        s.icon,
        s.featured_image,
        s.price_range,
        s.features,
        s.sort_order,
        s.created_at,
        s.updated_at
      FROM cms.services s
      ORDER BY s.sort_order ASC, s.created_at DESC
    `
    
    return services.map(service => ({
      id: service.id,
      title: service.title,
      slug: service.slug,
      description: service.description,
      content: service.content,
      status: service.status,
      featured: service.featured,
      icon: service.icon,
      featuredImage: service.featured_image,
      priceRange: service.price_range,
      features: service.features || [],
      sortOrder: service.sort_order,
      createdAt: service.created_at?.toISOString(),
      updatedAt: service.updated_at?.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}

export default async function ServicesPage() {
  const session = await getSession()
  if (!session) redirect('/auth/login')
  
  const services = await getServices()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-yellow-100 text-yellow-800'
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Services Management</h1>
            <span className="text-sm text-muted-foreground">
              Manage your service offerings and pricing
            </span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button asChild>
              <Link href="/admin/services/new">
                <Plus className="mr-2 h-4 w-4" />
                New Service
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
              <CardTitle className="text-sm font-medium">Total Services</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{services.length}</div>
              <p className="text-xs text-muted-foreground">
                All services
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {services.filter(s => s.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Live services
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {services.filter(s => s.featured).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Featured services
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Price Range</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {services.filter(s => s.priceRange).length}
              </div>
              <p className="text-xs text-muted-foreground">
                With pricing
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Services List */}
        <Card>
          <CardHeader>
            <CardTitle>All Services</CardTitle>
          </CardHeader>
          <CardContent>
            {services.length > 0 ? (
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{service.title}</h3>
                        <Badge className={getStatusColor(service.status)}>
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </Badge>
                        {service.featured && (
                          <Badge variant="secondary">Featured</Badge>
                        )}
                      </div>
                      
                      {service.description && (
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {service.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(service.createdAt)}</span>
                        </div>
                        {service.priceRange && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span>{service.priceRange}</span>
                          </div>
                        )}
                        {service.features && service.features.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Settings className="h-3 w-3" />
                            <span>{service.features.length} features</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/services/${service.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/services/${service.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No services found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Create your first service to get started
                </p>
                <Button asChild className="mt-4">
                  <Link href="/admin/services/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Service
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
