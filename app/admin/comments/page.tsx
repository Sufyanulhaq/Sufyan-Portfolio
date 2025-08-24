import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Force dynamic rendering to prevent build-time MongoDB connection
export const dynamic = 'force-dynamic'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Check, X, Trash2, MessageSquare } from "lucide-react"
import connectDB from "@/lib/mongodb"
import { Comment } from "@/lib/models"

async function getAllComments() {
  try {
    await connectDB()
    const comments = await Comment.find()
      .populate("author", "name")
      .populate("post", "title slug")
      .sort({ createdAt: -1 })
      .lean()

    return comments.map((comment) => ({
      ...comment,
      _id: comment._id.toString(),
      author: {
        ...comment.author,
        _id: comment.author._id.toString(),
      },
      post: {
        ...comment.post,
        _id: comment.post._id.toString(),
      },
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
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
                <div key={comment._id} className="p-4 border rounded-lg">
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
                          {new Date(comment.createdAt).toLocaleDateString()}
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
                      <span>On: {comment.post.title}</span>
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
