"use client"

import { useState, useEffect } from "react"

// Force dynamic rendering to prevent build-time prerendering issues
export const dynamic = 'force-dynamic'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Plus, Edit, Eye, Trash2, MoreHorizontal, Calendar, Clock, Eye as EyeIcon, Heart } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Post {
  _id: string
  title: string
  excerpt: string
  slug: string
  category?: string
  tags?: string[]
  published: boolean
  featured: boolean
  views?: number
  likes?: number
  readTime?: number
  author?: {
    name: string
    _id: string
  }
  createdAt: string
  updatedAt: string
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    filterPosts()
  }, [posts, searchQuery, statusFilter, categoryFilter])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/admin/posts")
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterPosts = () => {
    let filtered = posts

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((post) => {
        if (statusFilter === "published") return post.published
        if (statusFilter === "draft") return !post.published
        if (statusFilter === "featured") return post.featured
        return true
      })
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((post) => post.category === categoryFilter)
    }

    setFilteredPosts(filtered)
  }

  const togglePostStatus = async (postId: string, field: "published" | "featured") => {
    try {
      const post = posts.find((p) => p._id === postId)
      if (!post) return

      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !post[field] }),
      })

      if (response.ok) {
        setPosts(posts.map((p) => 
          p._id === postId ? { ...p, [field]: !p[field] } : p
        ))
      }
    } catch (error) {
      console.error(`Error updating post ${field}:`, error)
    }
  }

  const deletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPosts(posts.filter((p) => p._id !== postId))
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const getCategories = () => {
    const categories = posts.map((post) => post.category).filter(Boolean) as string[]
    return [...new Set(categories)]
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold">Blog Posts</h1>
            <p className="text-muted-foreground">Manage your blog posts and content</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog posts and content</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>Find and filter posts by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getCategories().map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              {filteredPosts.length} of {posts.length} posts
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
          <CardDescription>A list of all blog posts and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="font-medium line-clamp-2">{post.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {post.category && (
                      <Badge variant="secondary">{post.category}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                      {post.featured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <EyeIcon className="h-3 w-3" />
                        <span>{post.views?.toLocaleString() || 0}</span>
                      </div>
                      {post.likes && (
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span>{post.likes}</span>
                        </div>
                      )}
                      {post.readTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.readTime}m</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/blog/${post.slug}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Post
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/posts/${post._id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Post
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => togglePostStatus(post._id, "published")}>
                          {post.published ? "Unpublish" : "Publish"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => togglePostStatus(post._id, "featured")}>
                          {post.featured ? "Remove Featured" : "Mark Featured"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => deletePost(post._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Post
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
