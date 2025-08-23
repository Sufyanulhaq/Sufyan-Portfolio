import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, FolderOpen, Users, Eye, Heart, MessageSquare, BarChart3 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Force dynamic rendering to prevent build-time MongoDB connection
export const dynamic = 'force-dynamic'

// Dynamic imports to prevent build-time analysis
const connectDB = () => import("@/lib/mongodb").then(m => m.default())
const Post = () => import("@/models/Post").then(m => m.default)
const User = () => import("@/models/User").then(m => m.default)
const Project = () => import("@/models/Project").then(m => m.default)
const Comment = () => import("@/models/Comment").then(m => m.default)
import StatsCard from "@/components/StatsCard"

async function getDashboardStats() {
  try {
    await connectDB()

    const [postsCount, usersCount, projectsCount, commentsCount, totalViews, totalLikes, recentPosts] =
      await Promise.all([
        (await Post()).countDocuments(),
        (await User()).countDocuments(),
        (await Project()).countDocuments(),
        (await Comment()).countDocuments(),
        (await Post()).aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
        (await Post()).aggregate([{ $group: { _id: null, total: { $sum: "$likes" } } }]),
        (await Post()).find().populate("author", "name").sort({ createdAt: -1 }).limit(5).lean(),
      ])

    return {
      postsCount,
      usersCount,
      projectsCount,
      commentsCount,
      totalViews: totalViews[0]?.total || 0,
      totalLikes: totalLikes[0]?.total || 0,
      recentPosts: recentPosts.map((post) => ({
        ...post,
        _id: post._id.toString(),
        author: {
          ...post.author,
          _id: post.author._id.toString(),
        },
        createdAt: post.createdAt.toISOString(),
      })),
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      postsCount: 0,
      usersCount: 0,
      projectsCount: 0,
      commentsCount: 0,
      totalViews: 0,
      totalLikes: 0,
      recentPosts: [],
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      title: "Total Posts",
      value: stats.postsCount,
      description: "Published blog posts",
      icon: FileText,
      color: "text-blue-600",
      trend: { value: 12, type: "positive" as const, label: "vs last month" },
    },
    {
      title: "Total Projects",
      value: stats.projectsCount,
      description: "Portfolio projects",
      icon: FolderOpen,
      color: "text-green-600",
      trend: { value: 8, type: "positive" as const, label: "vs last month" },
    },
    {
      title: "Total Users",
      value: stats.usersCount,
      description: "Registered users",
      icon: Users,
      color: "text-purple-600",
      trend: { value: 15, type: "positive" as const, label: "vs last month" },
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      description: "Blog post views",
      icon: Eye,
      color: "text-orange-600",
      trend: { value: 23, type: "positive" as const, label: "vs last month" },
    },
    {
      title: "Total Likes",
      value: stats.totalLikes,
      description: "Blog post likes",
      icon: Heart,
      color: "text-red-600",
      trend: { value: 18, type: "positive" as const, label: "vs last month" },
    },
    {
      title: "Comments",
      value: stats.commentsCount,
      description: "User comments",
      icon: MessageSquare,
      color: "text-cyan-600",
      trend: { value: 5, type: "negative" as const, label: "vs last month" },
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin dashboard</p>
        </div>
        <Button asChild>
          <Link href="/admin/analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Analytics
          </Link>
        </Button>
      </div>

      {/* Enhanced Stats Grid with StatsCard component */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>Latest blog posts from your site</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentPosts.length > 0 ? (
            <div className="space-y-4">
              {stats.recentPosts.map((post) => (
                <div key={post._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      By {post.author.name} • {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{post.views}</span>
                      <Heart className="h-4 w-4 ml-2" />
                      <span>{post.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No posts found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
