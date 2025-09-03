import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Clock, Eye, Heart, ArrowLeft, Share2, Bookmark } from "lucide-react"
import { neon } from '@neondatabase/serverless'

// Force dynamic rendering to prevent build-time database connection
export const dynamic = 'force-dynamic'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

async function getPostBySlug(slug: string) {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('Database not configured')
      return null
    }

    const sql = neon(process.env.DATABASE_URL)
    
    const posts = await sql`
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.content,
        p.featured_image,
        p.status,
        p.published_at,
        p.view_count,
        p.tags,
        p.created_at,
        p.updated_at,
        u.name as author_name,
        u.email as author_email,
        u.bio as author_bio,
        u.avatar_url as author_avatar,
        c.name as category_name
      FROM cms.posts p
      LEFT JOIN cms.users u ON p.author_id = u.id
      LEFT JOIN cms.categories c ON p.category_id = c.id
      WHERE p.slug = ${slug} AND p.status IN ('published', 'draft')
      LIMIT 1
    `

    if (posts.length === 0) {
      return null
    }

    const post = posts[0]

    // Increment view count
    await sql`
      UPDATE cms.posts 
      SET view_count = view_count + 1 
      WHERE id = ${post.id}
    `

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featured_image,
      status: post.status,
      publishedAt: post.published_at?.toISOString(),
      viewCount: post.view_count + 1, // Include the increment
      tags: post.tags || [],
      createdAt: post.created_at?.toISOString(),
      updatedAt: post.updated_at?.toISOString(),
      author: {
        name: post.author_name || 'Unknown Author',
        email: post.author_email,
        bio: post.author_bio,
        avatar: post.author_avatar
      },
      category: post.category_name || 'Uncategorized'
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

async function getRelatedPosts(currentPostId: number, limit = 3) {
  try {
    if (!process.env.DATABASE_URL) {
      return []
    }

    const sql = neon(process.env.DATABASE_URL)
    
    const posts = await sql`
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.featured_image,
        p.published_at,
        p.view_count,
        u.name as author_name,
        c.name as category_name
      FROM cms.posts p
      LEFT JOIN cms.users u ON p.author_id = u.id
      LEFT JOIN cms.categories c ON p.category_id = c.id
      WHERE p.id != ${currentPostId} 
        AND p.status IN ('published', 'draft')
      ORDER BY p.published_at DESC
      LIMIT ${limit}
    `

    return posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      featuredImage: post.featured_image,
      publishedAt: post.published_at?.toISOString(),
      viewCount: post.view_count || 0,
      author: {
        name: post.author_name || 'Unknown Author'
      },
      category: post.category_name || 'Uncategorized'
    }))
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.id)
  const readTime = calculateReadTime(post.content)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <article className="space-y-8">
          <header className="space-y-6">
            <div className="space-y-4">
              <Badge>{post.category}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Unknown date'}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {readTime} min read
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {post.viewCount} views
              </div>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{post.author.name}</p>
                {post.author.bio && (
                  <p className="text-sm text-muted-foreground">{post.author.bio}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Heart className="mr-2 h-4 w-4" />
                Like
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-strong:font-semibold prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-pre:bg-gray-900 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 space-y-8">
            <h2 className="text-3xl font-bold">Related Posts</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/blog/${relatedPost.slug}`}>
                    {relatedPost.featuredImage && (
                      <div className="relative aspect-video">
                        <Image
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{relatedPost.title}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {relatedPost.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{relatedPost.author.name}</span>
                        <span>•</span>
                        <span>{relatedPost.publishedAt ? new Date(relatedPost.publishedAt).toLocaleDateString() : 'Unknown date'}</span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}