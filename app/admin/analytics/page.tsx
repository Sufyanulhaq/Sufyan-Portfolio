import { getSession } from '@/lib/auth-actions'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Mail,
  FileText,
  Briefcase,
  Settings,
  Calendar,
  Clock,
  BarChart3,
  Activity,
  Edit,
  Trash2
} from 'lucide-react'
import { neon } from '@neondatabase/serverless'

// Force dynamic rendering to prevent Vercel build issues
export const dynamic = 'force-dynamic'

async function getAnalyticsData() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    // Get basic counts
    const [postsCount, portfolioCount, servicesCount, contactFormsCount] = await Promise.all([
      sql`SELECT COUNT(*) FROM cms.posts WHERE status = 'published'`,
      sql`SELECT COUNT(*) FROM cms.portfolio WHERE status = 'published'`,
      sql`SELECT COUNT(*) FROM cms.services WHERE status = 'active'`,
      sql`SELECT COUNT(*) FROM cms.contact_forms`
    ])

    // Get recent activity
    const recentActivity = await sql`
      SELECT 
        al.action,
        al.table_name,
        al.record_id,
        al.new_values,
        al.created_at,
        u.name as user_name
      FROM cms.activity_logs al
      LEFT JOIN cms.users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 10
    `

    // Get contact form trends (last 7 days)
    const contactTrends = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM cms.contact_forms 
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `

    // Get unread messages
    const unreadMessages = await sql`
      SELECT COUNT(*) FROM cms.contact_forms WHERE is_read = FALSE
    `

    return {
      postsCount: parseInt(postsCount[0].count),
      portfolioCount: parseInt(portfolioCount[0].count),
      servicesCount: parseInt(servicesCount[0].count),
      contactFormsCount: parseInt(contactFormsCount[0].count),
      unreadMessages: parseInt(unreadMessages[0].count),
      recentActivity: recentActivity.map(activity => ({
        ...activity,
        created_at: activity.created_at?.toISOString()
      })),
      contactTrends: contactTrends.map(trend => ({
        ...trend,
        date: trend.date?.toISOString()
      }))
    }
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return {
      postsCount: 0,
      portfolioCount: 0,
      servicesCount: 0,
      contactFormsCount: 0,
      unreadMessages: 0,
      recentActivity: [],
      contactTrends: []
    }
  }
}

export default async function AnalyticsPage() {
  const session = await getSession()
  if (!session) redirect('/auth/login')
  
  const analytics = await getAnalyticsData()

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <Activity className="h-4 w-4 text-green-600" />
      case 'update': return <Edit className="h-4 w-4 text-blue-600" />
      case 'delete': return <Trash2 className="h-4 w-4 text-red-600" />
      case 'respond': return <Mail className="h-4 w-4 text-purple-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-800'
      case 'update': return 'bg-blue-100 text-blue-800'
      case 'delete': return 'bg-red-100 text-red-800'
      case 'respond': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Type the data properly to avoid TypeScript errors
  const typedContactTrends = analytics.contactTrends as Array<{ date: string; count: number }>
  const typedRecentActivity = analytics.recentActivity as Array<{ 
    action: string; 
    table_name: string; 
    record_id: number; 
    new_values: any; 
    created_at: string; 
    user_name: string 
  }>

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <span className="text-sm text-muted-foreground">
              Website performance and business insights
            </span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Badge variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 days
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 sm:p-8 lg:p-12">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.postsCount}</div>
              <p className="text-xs text-muted-foreground">
                Blog content live
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.portfolioCount}</div>
              <p className="text-xs text-muted-foreground">
                Projects showcased
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.servicesCount}</div>
              <p className="text-xs text-muted-foreground">
                Services offered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.contactFormsCount}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.unreadMessages} unread
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Contact Form Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Contact Form Trends (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
                             {typedContactTrends.length === 0 ? (
                 <div className="text-center py-8">
                   <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                   <p className="text-muted-foreground">No recent inquiries</p>
                 </div>
               ) : (
                 <div className="space-y-3">
                   {typedContactTrends.map((trend, index) => (
                     <div key={index} className="flex items-center justify-between">
                       <span className="text-sm font-medium">
                         {trend.date ? new Date(trend.date).toLocaleDateString('en-US', { 
                           month: 'short', 
                           day: 'numeric' 
                         }) : 'Unknown'}
                       </span>
                       <div className="flex items-center gap-2">
                         <div className="w-20 bg-muted rounded-full h-2">
                           <div 
                             className="bg-primary h-2 rounded-full" 
                             style={{ width: `${Math.min((trend.count / Math.max(...typedContactTrends.map(t => t.count))) * 100, 100)}%` }}
                           ></div>
                         </div>
                         <span className="text-sm font-medium w-8 text-right">
                           {trend.count}
                         </span>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Quick Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {analytics.contactFormsCount > 0 ? 
                      Math.round((analytics.unreadMessages / analytics.contactFormsCount) * 100) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">Response Rate</p>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {analytics.postsCount + analytics.portfolioCount + analytics.servicesCount}
                  </div>
                  <p className="text-xs text-muted-foreground">Total Content</p>
                </div>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {analytics.contactFormsCount > 0 ? 
                    Math.round(analytics.contactFormsCount / 30) : 0}
                </div>
                <p className="text-xs text-muted-foreground">Avg. Inquiries/Day</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
                         {typedRecentActivity.length === 0 ? (
               <div className="text-center py-8">
                 <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                 <p className="text-muted-foreground">No recent activity</p>
               </div>
             ) : (
               <div className="space-y-3">
                 {typedRecentActivity.map((activity, index) => (
                   <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                     <div className="flex-shrink-0">
                       {getActionIcon(activity.action)}
                     </div>
                     
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-1">
                         <Badge className={getActionColor(activity.action)}>
                           {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                         </Badge>
                         <span className="text-sm font-medium">
                           {activity.user_name || 'System'}
                         </span>
                       </div>
                       
                       <p className="text-sm text-muted-foreground">
                         {activity.action === 'create' ? 'Created new' :
                          activity.action === 'update' ? 'Updated' :
                          activity.action === 'delete' ? 'Deleted' :
                          activity.action === 'respond' ? 'Responded to' : 'Modified'} 
                         {activity.table_name === 'posts' ? ' blog post' :
                          activity.table_name === 'portfolio' ? ' portfolio project' :
                          activity.table_name === 'services' ? ' service' :
                          activity.table_name === 'contact_forms' ? ' contact form' :
                          ` ${activity.table_name}`}
                       </p>
                     </div>
                     
                     <div className="text-xs text-muted-foreground flex-shrink-0">
                       {activity.created_at ? formatDate(activity.created_at) : 'Unknown'}
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
