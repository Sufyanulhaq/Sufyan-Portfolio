import { getSession } from '@/lib/auth-actions'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  UserPlus, 
  Shield, 
  Activity, 
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock,
  Calendar,
  Mail,
  Phone,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Ban
} from 'lucide-react'
import { neon } from '@neondatabase/serverless'

// Force dynamic rendering to prevent Vercel build issues
export const dynamic = 'force-dynamic'

async function getUsersData() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    // Get all users with roles and activity info
    const users = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.role,
        u.is_active,
        u.is_verified,
        u.last_login,
        u.created_at,
        u.updated_at,
        u.avatar_url,
        u.bio,
        u.location,
        u.website,
        u.social_links,
        u.preferences,
        u.login_attempts,
        u.locked_until
      FROM cms.users u
      ORDER BY u.created_at DESC
    `

    // Get user statistics
    const [totalUsers, activeUsers, adminUsers, verifiedUsers] = await Promise.all([
      sql`SELECT COUNT(*) FROM cms.users`,
      sql`SELECT COUNT(*) FROM cms.users WHERE is_active = TRUE`,
      sql`SELECT COUNT(*) FROM cms.users WHERE role = 'admin'`,
      sql`SELECT COUNT(*) FROM cms.users WHERE is_verified = TRUE`
    ])

    // Get recent user activity
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
      WHERE al.table_name = 'users'
      ORDER BY al.created_at DESC
      LIMIT 10
    `

    return {
      users: users.map(user => ({
        ...user,
        created_at: user.created_at?.toISOString(),
        updated_at: user.updated_at?.toISOString(),
        last_login: user.last_login?.toISOString(),
        locked_until: user.locked_until?.toISOString()
      })) as any[],
      stats: {
        total: parseInt(totalUsers[0]?.count || '0'),
        active: parseInt(activeUsers[0]?.count || '0'),
        admins: parseInt(adminUsers[0]?.count || '0'),
        verified: parseInt(verifiedUsers[0]?.count || '0')
      },
      recentActivity: recentActivity.map(activity => ({
        ...activity,
        created_at: activity.created_at?.toISOString()
      })) as any[]
    }
  } catch (error) {
    console.error('Error fetching users data:', error)
    return {
      users: [],
      stats: { total: 0, active: 0, admins: 0, verified: 0 },
      recentActivity: []
    }
  }
}

export default async function UsersPage() {
  const session = await getSession()
  if (!session) redirect('/auth/login')
  
  const usersData = await getUsersData()

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'editor': return 'bg-blue-100 text-blue-800'
      case 'author': return 'bg-green-100 text-green-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return 'bg-red-100 text-red-800'
    if (!isVerified) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return 'Inactive'
    if (!isVerified) return 'Unverified'
    return 'Active'
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

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const lastLogin = new Date(date)
    const diffInHours = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return `${Math.floor(diffInHours / 168)}w ago`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">User Management</h1>
            <span className="text-sm text-muted-foreground">
              Manage user accounts, roles, and permissions
            </span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
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
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersData.stats.total}</div>
              <p className="text-xs text-muted-foreground">
                All registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{usersData.stats.active}</div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrators</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{usersData.stats.admins}</div>
              <p className="text-xs text-muted-foreground">
                Admin privileges
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{usersData.stats.verified}</div>
              <p className="text-xs text-muted-foreground">
                Email verified
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search & Filter Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name, email, or role..."
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Shield className="mr-2 h-4 w-4" />
                  Role Filter
                </Button>
                <Button variant="outline" size="sm">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Status Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>All Users</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Activity className="mr-2 h-4 w-4" />
                  Activity Log
                </Button>
                <Button variant="outline" size="sm">
                  <Shield className="mr-2 h-4 w-4" />
                  Roles & Permissions
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usersData.users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="mt-4 text-lg font-medium">No users found</h3>
                <p className="mt-2 text-muted-foreground">
                  Create your first user account to get started.
                </p>
                <Button className="mt-4">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {usersData.users.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* User Header */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                              {user.avatar_url ? (
                                <img 
                                  src={user.avatar_url} 
                                  alt={user.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <Users className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">{user.name}</h3>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          
                          <Badge className={getRoleColor(user.role)}>
                            {user.role.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(user.is_active, user.is_verified)}>
                            {getStatusText(user.is_active, user.is_verified)}
                          </Badge>
                        </div>

                        {/* User Details */}
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            {user.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{user.phone}</span>
                              </div>
                            )}
                            
                            {user.location && (
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{user.location}</span>
                              </div>
                            )}
                            
                            {user.website && (
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{user.website}</span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Joined: {formatDate(user.created_at)}</span>
                            </div>
                            
                            {user.last_login && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Last: {getTimeAgo(user.last_login)}</span>
                              </div>
                            )}
                            
                            {user.login_attempts > 0 && (
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm text-yellow-600">
                                  {user.login_attempts} failed attempts
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* User Bio */}
                        {user.bio && (
                          <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Bio:</span>
                            <p className="text-sm line-clamp-2">{user.bio}</p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 ml-4">
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex gap-1">
                          {user.is_active ? (
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Ban className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          
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

        {/* Recent User Activity */}
        {usersData.recentActivity.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent User Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {usersData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">
                          {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                        </Badge>
                        <span className="text-sm font-medium">
                          {activity.user_name || 'System'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {activity.action === 'create' ? 'Created new user account' :
                         activity.action === 'update' ? 'Updated user profile' :
                         activity.action === 'delete' ? 'Deleted user account' :
                         activity.action === 'login' ? 'User logged in' :
                         activity.action === 'logout' ? 'User logged out' :
                         `Modified user ${activity.table_name}`}
                      </p>
                    </div>
                    
                    <div className="text-xs text-muted-foreground flex-shrink-0">
                      {activity.created_at ? formatDate(activity.created_at) : 'Unknown'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
