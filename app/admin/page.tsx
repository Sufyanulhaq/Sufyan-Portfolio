import { getSession, logoutAction } from '@/lib/auth-actions'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  FileText, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings,
  LogOut,
  Plus,
  Eye,
  FolderOpen,
  Globe,
  Mail,
  TrendingUp,
  Search
} from 'lucide-react'
import Link from 'next/link'
import { neon } from '@neondatabase/serverless'

async function getDashboardStats() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const [postsCount, portfolioCount, servicesCount, contactFormsCount, unreadMessages] = await Promise.all([
      sql`SELECT COUNT(*) FROM cms.posts WHERE status = 'published'`,
      sql`SELECT COUNT(*) FROM cms.portfolio WHERE status = 'published'`,
      sql`SELECT COUNT(*) FROM cms.services WHERE status = 'active'`,
      sql`SELECT COUNT(*) FROM cms.contact_forms`,
      sql`SELECT COUNT(*) FROM cms.contact_forms WHERE is_read = FALSE`
    ])
    
    return {
      postsCount: parseInt(postsCount[0].count),
      portfolioCount: parseInt(portfolioCount[0].count),
      servicesCount: parseInt(servicesCount[0].count),
      contactFormsCount: parseInt(contactFormsCount[0].count),
      unreadMessages: parseInt(unreadMessages[0].count)
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      postsCount: 0,
      portfolioCount: 0,
      servicesCount: 0,
      contactFormsCount: 0,
      unreadMessages: 0
    }
  }
}

export default async function AdminPage() {
  const session = await getSession()
  if (!session) redirect('/auth/login')
  
  const stats = await getDashboardStats()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Advanced CMS Dashboard</h1>
            <span className="text-sm text-muted-foreground">
              Welcome back, {session.name} ({session.role})
            </span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <span className="text-xs text-muted-foreground">
              Last login: {session.last_login ? new Date(session.last_login).toLocaleDateString() : 'Never'}
            </span>
            <form action={logoutAction}>
              <Button variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 sm:p-8 lg:p-12">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.postsCount}</div>
              <p className="text-xs text-muted-foreground">
                Blog posts live
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Items</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.portfolioCount}</div>
              <p className="text-xs text-muted-foreground">
                Projects showcased
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.servicesCount}</div>
              <p className="text-xs text-muted-foreground">
                Services offered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Forms</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.contactFormsCount}</div>
              <p className="text-xs text-muted-foreground">
                {stats.unreadMessages} unread
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Content Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" size="sm">
                <Link href="/admin/posts/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Blog Post
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link href="/admin/posts">
                  <Eye className="mr-2 h-4 w-4" />
                  Manage Posts
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Portfolio Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" size="sm">
                <Link href="/admin/portfolio/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link href="/admin/portfolio">
                  <Eye className="mr-2 h-4 w-4" />
                  Manage Portfolio
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Services & SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" size="sm">
                <Link href="/admin/services">
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Services
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link href="/admin/seo">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  SEO Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Management Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" size="sm">
                <Link href="/admin/contact-forms">
                  <Eye className="mr-2 h-4 w-4" />
                  View Messages
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link href="/admin/contact-forms">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {stats.unreadMessages} Unread
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics & Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" size="sm">
                <Link href="/admin/analytics">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link href="/admin/analytics">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" size="sm">
                <Link href="/admin/seo">
                  <Search className="mr-2 h-4 w-4" />
                  SEO Settings
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link href="/admin/media">
                  <Image className="mr-2 h-4 w-4" />
                  Media Library
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="sm">
                <Link href="/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.postsCount}</div>
                <div className="text-sm text-blue-600">Blog Posts</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.portfolioCount}</div>
                <div className="text-sm text-green-600">Portfolio Items</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.unreadMessages}</div>
                <div className="text-sm text-orange-600">Unread Messages</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
