import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, ArrowRight, Eye, Heart } from "lucide-react"

interface BlogPostCardProps {
  post: {
    _id: string
    title: string
    excerpt: string
    slug: string
    coverImage?: string
    category?: string
    tags?: string[]
    author?: {
      name: string
      _id: string
    }
    createdAt: string
    readTime?: number
    views?: number
    likes?: number
    featured?: boolean
  }
  variant?: "default" | "featured" | "compact"
}

export default function BlogPostCard({ post, variant = "default" }: BlogPostCardProps) {
  const isFeatured = variant === "featured" || post.featured

  if (variant === "compact") {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <CalendarDays className="h-4 w-4" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            {post.readTime && (
              <>
                <Clock className="h-4 w-4 ml-2" />
                <span>{post.readTime} min read</span>
              </>
            )}
          </div>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-lg">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </CardTitle>
          <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            {post.category && (
              <Badge variant="secondary">{post.category}</Badge>
            )}
            <Link
              href={`/blog/${post.slug}`}
              className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
            >
              Read More →
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${
      isFeatured ? "ring-2 ring-primary/20" : ""
    }`}>
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
        {isFeatured && (
          <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">Featured</Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <CalendarDays className="h-4 w-4" />
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          {post.readTime && (
            <>
              <Clock className="h-4 w-4 ml-2" />
              <span>{post.readTime} min read</span>
            </>
          )}
        </div>
        
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </CardTitle>
        
        <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
          
          {/* Stats and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {post.views !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views.toLocaleString()}</span>
                </div>
              )}
              {post.likes !== undefined && (
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </div>
              )}
            </div>
            
            <Link
              href={`/blog/${post.slug}`}
              className="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-1"
            >
              Read More
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
