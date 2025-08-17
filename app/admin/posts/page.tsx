import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Eye, Calendar, Filter } from "lucide-react"
import connectDB from "@/lib/mongodb"
import Post from "@/models/Post"
import Category from "@/models/Category"
import Tag from "@/models/Tag"
import { requirePermission } from "@/lib/rbac"

async function getAllPosts() {
  try {
    await connectDB()
    const posts = await Post.find()
      .populate("author", "name")
      .populate("category", "name color")
      .populate("tags", "name color")
      .sort({ createdAt: -1 })
      .lean()

    return posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
      author: post.author
        ? {
            ...post.author,
            _id: post.author._id.toString(),
          }
        : null,
      category: post.category
        ? {
            ...post.category,
            _id: post.category._id.toString(),
          }
        : null,
      tags:
        post.tags?.map((tag: any) => ({
          ...tag,
          _id: tag._id.toString(),
        })) || [],
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      publishedAt: post.publishedAt?.toISOString() || null,
      scheduledAt: post.scheduledAt?.toISOString() || null,
    }))
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

async function getContentStats() {
  try {
    await connectDB()
    const [totalPosts, publishedPosts, draftPosts, scheduledPosts, categories, tags] = await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ published: true }),
      Post.countDocuments({ published: false }),
      Post.countDocuments({ scheduledAt: { $gt: new Date() } }),
      Category.find({ isActive: true }).lean(),
      Tag.find({ isActive: true }).lean(),
    ])

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      scheduledPosts,
      categories: categories.map((cat) => ({ ...cat, _id: cat._id.toString() })),
      tags: tags.map((tag) => ({ ...tag, _id: tag._id.toString() })),
    }
  } catch (error) {
    console.error("Error fetching content stats:", error)
    return {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      scheduledPosts: 0,
      categories: [],
      tags: [],
    }
  }
}

export default async function AdminPostsPage() {
  await requirePermission("MANAGE_POSTS")
  const posts = await getAllPosts()
  const stats = await getContentStats()

  const columns = [
    {
      key: "title" as const,
      title: "Title",
      sortable: true,
      filterable: true,
      render: (value: string, row: any) => (
        <div className="space-y-1">
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{row.excerpt}</div>
        </div>
      ),
    },
    {
      key: "author" as const,
      title: "Author",
      sortable: true,
      render: (value: any) => value?.name || "Unknown",
    },
    {
      key: "category" as const,
      title: "Category",
      sortable: true,
      filterable: true,
      render: (value: any) =>
        value ? <Badge style={{ backgroundColor: value.color + "20", color: value.color }}>{value.name}</Badge> : null,
    },
    {
      key: "published" as const,
      title: "Status",
      sortable: true,
      filterable: true,
      render: (value: boolean, row: any) => {
        if (row.scheduledAt && new Date(row.scheduledAt) > new Date()) {
          return <Badge variant="outline">Scheduled</Badge>
        }
        return <Badge variant={value ? "default" : "secondary"}>{value ? "Published" : "Draft"}</Badge>
      },
    },
    {
      key: "views" as const,
      title: "Views",
      sortable: true,
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: "createdAt" as const,
      title: "Created",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ]

  const handleView = (post: any) => {
    window.open(`/blog/${post.slug}`, "_blank")
  }

  const handleEdit = (post: any) => {
    window.location.href = `/admin/posts/${post._id}/edit`
  }

  const handleDelete = async (post: any) => {
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      // Delete logic would be implemented here
      console.log("Delete post:", post._id)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Manage your blog posts, categories, and tags</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/categories">
              <Filter className="mr-2 h-4 w-4" />
              Categories
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/posts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedPosts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftPosts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduledPosts}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>All Posts</CardTitle>
              <CardDescription>Manage your blog posts with advanced filtering and bulk operations</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={posts}
                columns={columns}
                searchable={true}
                filterable={true}
                actions={{
                  view: handleView,
                  edit: handleEdit,
                  delete: handleDelete,
                }}
                emptyMessage="No posts found. Create your first post to get started."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Organize your content with categories</CardDescription>
              </div>
              <Button asChild>
                <Link href="/admin/categories/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Category
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.categories.map((category) => (
                  <Card key={category._id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                          <CardTitle className="text-base">{category.name}</CardTitle>
                        </div>
                        <Badge variant="secondary">{category.postCount}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/categories/${category._id}/edit`}>
                            <Edit className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tags</CardTitle>
                <CardDescription>Tag your content for better organization</CardDescription>
              </div>
              <Button asChild>
                <Link href="/admin/tags/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Tag
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.tags.map((tag) => (
                  <Badge
                    key={tag._id}
                    variant="outline"
                    className="text-sm px-3 py-1"
                    style={{ borderColor: tag.color, color: tag.color }}
                  >
                    {tag.name} ({tag.postCount})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
