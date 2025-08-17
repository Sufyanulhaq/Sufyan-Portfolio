import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, Clock, Eye, Heart, ArrowLeft, Share2 } from "lucide-react"
import connectDB from "@/lib/mongodb"
import Post from "@/models/Post"

async function getBlogPost(slug: string) {
  try {
    await connectDB()
    const post = await Post.findOne({ slug, published: true }).populate("author", "name bio avatar").lean()

    if (!post) return null

    return {
      ...post,
      _id: post._id.toString(),
      author: {
        ...post.author,
        _id: post.author._id.toString(),
      },
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

async function getRelatedPosts(currentSlug: string, category: string) {
  try {
    await connectDB()
    const posts = await Post.find({
      slug: { $ne: currentSlug },
      category,
      published: true,
    })
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean()

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
    console.error("Error fetching related posts:", error)
    return []
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.slug, post.category)

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </Button>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Badge variant="secondary">{post.category}</Badge>
            <CalendarDays className="h-4 w-4 ml-2" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <Clock className="h-4 w-4 ml-2" />
            <span>{post.readTime} min read</span>
          </div>

          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>

          <p className="text-xl text-muted-foreground mb-8">{post.excerpt}</p>

          {/* Author Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-semibold text-primary">{post.author.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-semibold">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">Author</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{post.likes}</span>
              </div>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.coverImage && (
          <div className="relative aspect-video mb-12 rounded-lg overflow-hidden">
            <Image
              src={post.coverImage || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="whitespace-pre-wrap leading-relaxed">{post.content}</div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag: string) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <Separator className="my-12" />

        {/* Author Bio */}
        <div className="bg-muted/50 rounded-lg p-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="font-semibold text-primary text-xl">{post.author.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">{post.author.name}</h3>
              <p className="text-muted-foreground">
                {post.author.bio || "Full-stack developer passionate about creating innovative web solutions."}
              </p>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold mb-8">Related Posts</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost._id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group block p-4 rounded-lg border hover:shadow-md transition-all duration-300"
                >
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{relatedPost.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    <span>{new Date(relatedPost.createdAt).toLocaleDateString()}</span>
                    <Clock className="h-3 w-3 ml-2" />
                    <span>{relatedPost.readTime} min</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  )
}

export async function generateStaticParams() {
  try {
    await connectDB()
    const posts = await Post.find({ published: true }).select("slug").lean()
    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}
