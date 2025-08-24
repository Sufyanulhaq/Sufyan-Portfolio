import { getSession } from '@/lib/auth-actions'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
  Star,
  Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'
import { neon } from '@neondatabase/serverless'

async function getServices() {
  try {
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
    
    return services
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
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'coming_soon': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Web Development': 'bg-blue-100 text-blue-800',
      'Mobile Development': 'bg-purple-100 text-purple-800',
      'UI/UX Design': 'bg-pink-100 text-pink-800',
      'E-commerce': 'bg-green-100 text-green-800',
      'API Development': 'bg-orange-100 text-orange-800',
      'Consulting': 'bg-indigo-100 text-indigo-800',
      'Maintenance': 'bg-yellow-100 text-yellow-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getPriceRangeColor = (priceRange: string) => {
    switch (priceRange) {
      case 'Budget': return 'bg-green-100 text-green-800'
      case 'Mid-Range': return 'bg-yellow-100 text-yellow-800'
      case 'Premium': return 'bg-purple-100 text-purple-800'
      case 'Enterprise': return 'bg-blue-100 text-blue-800'
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
              Manage your professional services and offerings
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
                Highlighted services
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {services.reduce((sum, s) => sum + (s.views_count || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                All services combined
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        <Card>
          <CardHeader>
            <CardTitle>All Services</CardTitle>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No services yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Get started by adding your first service offering.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/admin/services/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Service
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <div key={service.id} className="group border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                    {/* Service Image */}
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      {service.featured_image ? (
                        <img
                          src={service.featured_image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className={getStatusColor(service.status)}>
                          {service.status === 'active' ? 'Active' : 
                           service.status === 'inactive' ? 'Inactive' : 
                           service.status === 'coming_soon' ? 'Coming Soon' : service.status}
                        </Badge>
                      </div>
                      
                      {/* Featured Badge */}
                      {service.featured && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary">Featured</Badge>
                        </div>
                      )}

                      {/* Sort Order */}
                      {service.sort_order && (
                        <div className="absolute bottom-3 left-3">
                          <Badge variant="outline" className="bg-background/80">
                            #{service.sort_order}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Service Info */}
                    <div className="p-4 space-y-3">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        
                        {service.description && (
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {service.description}
                          </p>
                        )}
                      </div>

                      {/* Category & Price */}
                      <div className="flex items-center gap-2">
                        {service.category && (
                          <Badge className={getCategoryColor(service.category)} variant="outline">
                            {service.category}
                          </Badge>
                        )}
                        
                        {service.price_range && (
                          <Badge className={getPriceRangeColor(service.price_range)} variant="outline">
                            {service.price_range}
                          </Badge>
                        )}
                      </div>

                      {/* Features */}
                      {service.features && service.features.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Key Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {service.features.slice(0, 3).map((feature: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {service.features.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{service.features.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Service Details */}
                      <div className="space-y-2 text-xs text-muted-foreground">
                        {service.delivery_time && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Delivery: {service.delivery_time}</span>
                          </div>
                        )}
                        
                        {service.views_count > 0 && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{service.views_count.toLocaleString()} views</span>
                          </div>
                        )}

                        {service.inquiries_count > 0 && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span>{service.inquiries_count} inquiries</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-2">
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link href={`/admin/services/${service.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </Button>
                        
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link href={`/services/${service.slug}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                        
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Last Updated */}
                      {service.updated_at && (
                        <div className="text-xs text-muted-foreground pt-2 border-t">
                          Updated: {formatDate(service.updated_at)}
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
