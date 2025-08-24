import { getSession } from '@/lib/auth-actions'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Clock,
  User,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { neon } from '@neondatabase/serverless'

async function getPosts() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const posts = await sql`
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.status,
        p.published_at,
        p.views_count,
        p.likes_count,
        p.read_time,
        p.created_at,
        p.category,
        p.tags,
        u.name as author_name
      FROM cms.posts p
      LEFT JOIN cms.users u ON p.author_id = u.id
      ORDER BY p.created_at DESC
    `
    
    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export default async function PostsPage() {
  const session = await getSession()
  if (!session) redirect('/auth/login')
  
  const posts = await getPosts()

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Blog Posts Management</h1>
            <span className="text-sm text-muted-foreground">
              Manage your blog content and SEO
            </span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button asChild>
              <Link href="/admin/posts/new">
                <Plus className="mr-2 h-4 w-4" />
                New Post
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
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{posts.length}</div>
              <p className="text-xs text-muted-foreground">
                All time posts
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
                {posts.filter(p => p.status === 'published').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Live posts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {posts.filter(p => p.status === 'draft').length}
              </div>
              <p className="text-xs text-muted-foreground">
                In progress
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
                {posts.reduce((sum, p) => sum + (p.views_count || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                All posts combined
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No posts yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Get started by creating your first blog post.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/admin/posts/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Post
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <Badge className={getStatusColor(post.status)}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </Badge>
                        {post.featured && (
                          <Badge variant="secondary">Featured</Badge>
                        )}
                      </div>
                      
                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{post.author_name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                        {post.published_at && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Published: {formatDate(post.published_at)}</span>
                          </div>
                        )}
                        {post.read_time && (
                          <span>{post.read_time} min read</span>
                        )}
                        {post.views_count > 0 && (
                          <span>{post.views_count.toLocaleString()} views</span>
                        )}
                      </div>
                      
                      {post.category && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Category:</span>
                          <Badge variant="outline" className="text-xs">
                            {post.category}
                          </Badge>
                        </div>
                      )}
                      
                                             {post.tags && post.tags.length > 0 && (
                         <div className="flex items-center gap-2">
                           <span className="text-xs text-muted-foreground">Tags:</span>
                           <div className="flex gap-1">
                             {post.tags.slice(0, 3).map((tag: string, index: number) => (
                               <Badge key={index} variant="outline" className="text-xs">
                                 {tag}
                               </Badge>
                             ))}
                             {post.tags.length > 3 && (
                               <span className="text-xs text-muted-foreground">
                                 +{post.tags.length - 3} more
                               </span>
                             )}
                           </div>
                         </div>
                       )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/blog/${post.slug}`} target="_blank">
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
