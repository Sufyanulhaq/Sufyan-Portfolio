import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Check, X, Trash2, MessageSquare } from "lucide-react"
import { neon } from '@neondatabase/serverless'

// Force dynamic rendering to prevent build-time database connection
export const dynamic = 'force-dynamic'

async function getAllComments() {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('Database not configured')
      return []
    }

    const sql = neon(process.env.DATABASE_URL)
    
    const comments = await sql`
      SELECT 
        c.id,
        c.content,
        c.status,
        c.author_name,
        c.author_email,
        c.created_at,
        c.updated_at,
        p.title as post_title,
        p.slug as post_slug,
        p.id as post_id
      FROM cms.comments c
      LEFT JOIN cms.posts p ON c.post_id = p.id
      ORDER BY c.created_at DESC
    `
    
    return comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      status: comment.status,
      approved: comment.status === 'approved',
      author: {
        name: comment.author_name || 'Unknown',
        email: comment.author_email
      },
      post: comment.post_id ? {
        id: comment.post_id,
        title: comment.post_title,
        slug: comment.post_slug
      } : { title: 'Unknown Post' },
      createdAt: comment.created_at?.toISOString(),
      updatedAt: comment.updated_at?.toISOString(),
      likes: 0 // Default value since not in schema yet
    }))
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}

export default async function AdminCommentsPage() {
  const comments = await getAllComments()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold">Comments</h1>
        <p className="text-muted-foreground">Manage user comments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Comments</CardTitle>
          <CardDescription>A list of all user comments</CardDescription>
        </CardHeader>
        <CardContent>
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {comment.author.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{comment.author.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Unknown date'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={comment.approved ? "default" : "secondary"}>
                      {comment.approved ? "Approved" : "Pending"}
                    </Badge>
                  </div>

                  <p className="text-sm mb-3">{comment.content}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      <span>On: {comment.post?.title || 'Unknown Post'}</span>
                      <span>•</span>
                      <span>{comment.likes} likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!comment.approved && (
                        <Button variant="outline" size="sm">
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {comment.approved && (
                        <Button variant="outline" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No comments found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}