import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, ArrowRight } from "lucide-react"
import connectDB from "@/lib/mongodb"
import type { IPost } from "@/models/Post"

async function getLatestPosts(): Promise<Array<IPost & { _id: string; author: { _id: string; name: string }; createdAt: string; updatedAt: string }>> {
  try {
    await connectDB()
    
    // Dynamic import to avoid circular dependency issues
    const { Post } = await import("@/lib/models")
    
    const posts = await Post.find({ published: true })
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean()

    return posts.map((post: any) => ({
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
    console.error("Error fetching latest posts:", error)
    return []
  }
}

export default async function BlogSection() {
  const posts = await getLatestPosts()

  if (posts.length === 0) {
    return null
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Latest <span className="text-primary">Insights</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thoughts on web development, technology trends, and building better digital experiences.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {posts.map((post) => (
            <Card key={post._id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={
                    post.coverImage || 
                    (post.category === "Development" && "/images/blog-post-1.jpg") ||
                    (post.category === "Technology" && "/images/blog-post-2.jpg") ||
                    (post.category === "SEO" && "/images/blog-post-3.jpg") ||
                    (post.category === "Backend" && "/images/blog-post-1.jpg") ||
                    (post.category === "Performance" && "/images/blog-post-2.jpg") ||
                    "/images/blog-post-3.jpg"
                  }
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg shadow-md"
                />
                {post.featured && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">Featured</Badge>
                )}
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{post.readTime} min read</span>
                </div>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">{post.category}</Badge>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/blog">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
