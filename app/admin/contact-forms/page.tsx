import { getSession } from '@/lib/auth-actions'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  Eye, 
  CheckCircle, 
  Clock,
  User,
  Phone,
  Globe,
  Calendar,
  MessageSquare,
  TrendingUp,
  Filter
} from 'lucide-react'
import Link from 'next/link'
import { neon } from '@neondatabase/serverless'

async function getContactForms() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const forms = await sql`
      SELECT 
        cf.id,
        cf.name,
        cf.email,
        cf.phone,
        cf.message,
        cf.status,
        cf.is_read,
        cf.source,
        cf.ip_address,
        cf.user_agent,
        cf.created_at,
        cf.updated_at,
        cf.response_sent,
        cf.response_sent_at,
        cf.notes
      FROM cms.contact_forms cf
      ORDER BY cf.created_at DESC
    `
    
    return forms
  } catch (error) {
    console.error('Error fetching contact forms:', error)
    return []
  }
}

export default async function ContactFormsPage() {
  const session = await getSession()
  if (!session) redirect('/auth/login')
  
  const forms = await getContactForms()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'responded': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getReadStatusColor = (isRead: boolean) => {
    return isRead ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
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
    const created = new Date(date)
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return `${Math.floor(diffInHours / 168)}w ago`
  }

  const unreadCount = forms.filter(f => !f.is_read).length
  const newCount = forms.filter(f => f.status === 'new').length
  const respondedCount = forms.filter(f => f.status === 'responded').length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Contact Forms Management</h1>
            <span className="text-sm text-muted-foreground">
              Manage customer inquiries and client communications
            </span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <TrendingUp className="mr-2 h-4 w-4" />
              Analytics
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
              <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forms.length}</div>
              <p className="text-xs text-muted-foreground">
                All time inquiries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{newCount}</div>
              <p className="text-xs text-muted-foreground">
                Pending review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Responded</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{respondedCount}</div>
              <p className="text-xs text-muted-foreground">
                Client contacted
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Forms List */}
        <Card>
          <CardHeader>
            <CardTitle>All Contact Form Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {forms.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No inquiries yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Contact form submissions will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {forms.map((form) => (
                  <div key={form.id} className={`border rounded-lg p-4 transition-colors ${
                    !form.is_read ? 'bg-blue-50 border-blue-200' : 'hover:bg-muted/50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Badge className={getReadStatusColor(form.is_read)}>
                              {form.is_read ? 'Read' : 'Unread'}
                            </Badge>
                            <Badge className={getStatusColor(form.status)}>
                              {form.status === 'new' ? 'New' : 
                               form.status === 'in_progress' ? 'In Progress' : 
                               form.status === 'responded' ? 'Responded' : 
                               form.status === 'closed' ? 'Closed' : form.status}
                            </Badge>
                            {form.response_sent && (
                              <Badge variant="outline" className="text-green-700 border-green-300">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Response Sent
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            {getTimeAgo(form.created_at)}
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{form.name}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{form.email}</span>
                            </div>
                            
                            {form.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{form.phone}</span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            {form.source && (
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Source: {form.source}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{formatDate(form.created_at)}</span>
                            </div>
                            
                            {form.response_sent_at && (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-600">
                                  Responded: {formatDate(form.response_sent_at)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Message:</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-3 pl-6">
                            {form.message}
                          </p>
                        </div>

                        {/* Notes */}
                        {form.notes && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Notes:</span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 pl-6">
                              {form.notes}
                            </p>
                          </div>
                        )}

                        {/* Technical Info */}
                        <div className="text-xs text-muted-foreground space-y-1">
                          {form.ip_address && (
                            <span>IP: {form.ip_address}</span>
                          )}
                          {form.user_agent && (
                            <span className="block truncate">User Agent: {form.user_agent}</span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 ml-4">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/contact-forms/${form.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                        
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/contact-forms/${form.id}/respond`}>
                            <Mail className="mr-2 h-4 w-4" />
                            Respond
                          </Link>
                        </Button>
                        
                        <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark Read
                        </Button>
                      </div>
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
