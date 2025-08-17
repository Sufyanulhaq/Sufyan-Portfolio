import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, Eye, Heart } from "lucide-react"
import connectDB from "@/lib/mongodb"
import Post from "@/models/Post"

async function getBlogPosts() {
  try {
    await connectDB()
    const posts = await Post.find({ published: true }).populate("author", "name").sort({ createdAt: -1 }).lean()

    return posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
      author: {
        ...post.author,
        _id: post.author._id.toString(),
      },
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

function BlogPostCard({ post }: { post: any }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={post.coverImage || `/placeholder.svg?height=240&width=400&query=${encodeURIComponent(post.title)}`}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {post.featured && <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">Featured</Badge>}
      </div>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <CalendarDays className="h-4 w-4" />
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <Clock className="h-4 w-4 ml-2" />
          <span>{post.readTime} min read</span>
        </div>
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{post.title}</CardTitle>
        <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{post.likes}</span>
            </div>
          </div>
          <Badge variant="secondary">{post.category}</Badge>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <Button asChild className="w-full mt-4">
          <Link href={`/blog/${post.slug}`}>Read More</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function BlogPostsSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-video bg-muted animate-pulse" />
          <CardHeader>
            <div className="h-4 bg-muted rounded animate-pulse mb-2" />
            <div className="h-6 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-muted rounded animate-pulse w-20" />
              <div className="h-6 bg-muted rounded animate-pulse w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  const featuredPosts = posts.filter((post) => post.featured)
  const regularPosts = posts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            Latest <span className="text-primary">Insights</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thoughts on web development, technology trends, and building better digital experiences.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="font-heading text-2xl font-bold mb-8">Featured Posts</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {featuredPosts.slice(0, 2).map((post) => (
                <BlogPostCard key={post._id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <h2 className="font-heading text-2xl font-bold mb-8">All Posts</h2>
          <Suspense fallback={<BlogPostsSkeleton />}>
            {regularPosts.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {regularPosts.map((post) => (
                  <BlogPostCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No blog posts found.</p>
              </div>
            )}
          </Suspense>
        </section>
      </div>
    </div>
  )
}
