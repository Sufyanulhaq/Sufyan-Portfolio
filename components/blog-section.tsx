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

  // Fallback to dummy data if no posts from database
  const fallbackPosts = [
    {
      _id: "1",
      title: "Building High-Performance React Applications",
      excerpt: "Learn advanced techniques for optimizing React applications and improving user experience.",
      category: "Development",
      featured: true,
      createdAt: new Date().toISOString(),
      readTime: "8",
      slug: "building-high-performance-react-applications"
    },
    {
      _id: "2", 
      title: "The Future of Web Development: AI Integration",
      excerpt: "Explore how artificial intelligence is transforming web development and what it means for developers.",
      category: "Technology",
      featured: false,
      createdAt: new Date().toISOString(),
      readTime: "12",
      slug: "future-of-web-development-ai-integration"
    },
    {
      _id: "3",
      title: "SEO Best Practices for 2025",
      excerpt: "Stay ahead of the competition with these proven SEO strategies that will improve your rankings.",
      category: "SEO",
      featured: false,
      createdAt: new Date().toISOString(),
      readTime: "10",
      slug: "seo-best-practices-2025"
    }
  ]

  const displayPosts = posts.length > 0 ? posts : fallbackPosts

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {displayPosts.map((post) => (
            <Card key={post._id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={
                    (post as any).coverImage || 
                    (post.category === "Development" && "/images/blogs/blog-post-1.jpg") ||
                    (post.category === "Technology" && "/images/blogs/blog-post-2.jpg") ||
                    (post.category === "SEO" && "/images/blogs/blog-post-3.jpg") ||
                    (post.category === "Backend" && "/images/blogs/blog-post-1.jpg") ||
                    (post.category === "Performance" && "/images/blogs/blog-post-2.jpg") ||
                    "/images/blogs/blog-post-3.jpg"
                  }
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={post.featured}
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
