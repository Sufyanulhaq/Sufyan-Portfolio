"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  ExternalLink, 
  User, 
  Calendar, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  BookOpen,
  Tag,
  Eye,
  Heart
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    role: string
  }
  category: string
  tags: string[]
  publishedAt: string
  readTime: string
  featured: boolean
  views: number
  likes: number
  coverImage: string
  slug: string
}

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showFeatured, setShowFeatured] = useState(false)

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "Building High-Performance React Applications",
      excerpt: "Learn the essential techniques for optimizing React applications, from code splitting to memoization strategies that will make your apps lightning fast.",
      content: "Full article content here...",
      author: {
        name: "Sufyan Ul Haq",
        role: "Full-Stack Developer"
      },
      category: "Development",
      tags: ["React", "Performance", "Optimization", "JavaScript"],
      publishedAt: "2025-01-15",
      readTime: "8 min read",
      featured: true,
      views: 2847,
      likes: 156,
      coverImage: "/modern-portfolio-website.png",
      slug: "building-high-performance-react-applications"
    },
    {
      id: "2",
      title: "The Future of Web Development: AI Integration",
      excerpt: "Explore how artificial intelligence is transforming web development and what it means for developers and businesses in the coming years.",
      content: "Full article content here...",
      author: {
        name: "Sufyan Ul Haq",
        role: "Full-Stack Developer"
      },
      category: "Technology",
      tags: ["AI", "Web Development", "Future", "Innovation"],
      publishedAt: "2025-01-10",
      readTime: "12 min read",
      featured: true,
      views: 2156,
      likes: 98,
      coverImage: "/modern-ecommerce-dashboard.png",
      slug: "future-of-web-development-ai-integration"
    },
    {
      id: "3",
      title: "SEO Best Practices for 2025",
      excerpt: "Stay ahead of the competition with these proven SEO strategies that will improve your website's search engine rankings and drive organic traffic.",
      content: "Full article content here...",
      author: {
        name: "Sufyan Ul Haq",
        role: "Full-Stack Developer"
      },
      category: "SEO",
      tags: ["SEO", "Marketing", "Traffic", "Google"],
      publishedAt: "2025-01-05",
      readTime: "10 min read",
      featured: true,
      views: 1892,
      likes: 87,
      coverImage: "/task-management-app.png",
      slug: "seo-best-practices-2025"
    },
    {
      id: "4",
      title: "Mastering TypeScript: Advanced Patterns",
      excerpt: "Dive deep into advanced TypeScript patterns and techniques that will make your code more robust, maintainable, and type-safe.",
      content: "Full article content here...",
      author: {
        name: "Sufyan Ul Haq",
        role: "Full-Stack Developer"
      },
      category: "Development",
      tags: ["TypeScript", "Programming", "Advanced", "Patterns"],
      publishedAt: "2024-12-28",
      readTime: "15 min read",
      featured: false,
      views: 1456,
      likes: 73,
      coverImage: "/weather-dashboard.png",
      slug: "mastering-typescript-advanced-patterns"
    },
    {
      id: "5",
      title: "Building Scalable Microservices Architecture",
      excerpt: "Learn how to design and implement microservices that can scale with your business needs while maintaining performance and reliability.",
      content: "Full article content here...",
      author: {
        name: "Sufyan Ul Haq",
        role: "Full-Stack Developer"
      },
      category: "Backend",
      tags: ["Microservices", "Architecture", "Scalability", "Backend"],
      publishedAt: "2024-12-20",
      readTime: "18 min read",
      featured: false,
      views: 1234,
      likes: 65,
      coverImage: "/real-estate-platform.png",
      slug: "building-scalable-microservices-architecture"
    },
    {
      id: "6",
      title: "Optimizing Database Performance for Web Applications",
      excerpt: "Discover proven techniques for optimizing database queries, indexing strategies, and connection management to improve your application's performance.",
      content: "Full article content here...",
      author: {
        name: "Sufyan Ul Haq",
        role: "Full-Stack Developer"
      },
      category: "Database",
      tags: ["Database", "Performance", "SQL", "Optimization"],
      publishedAt: "2024-12-15",
      readTime: "14 min read",
      featured: false,
      views: 987,
      likes: 52,
      coverImage: "/modern-portfolio-website.png",
      slug: "optimizing-database-performance-web-applications"
    }
  ]

  const categories = ["all", "Development", "Technology", "SEO", "Backend", "Database", "Frontend", "Design"]
  const featuredPosts = blogPosts.filter(post => post.featured)
  const recentPosts = blogPosts.slice(0, 3)

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    const matchesFeatured = !showFeatured || post.featured

    return matchesSearch && matchesCategory && matchesFeatured
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Development
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Insights & Tips
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Sharing knowledge, experiences, and insights from my journey in full-stack development. 
              From technical deep-dives to industry trends, discover what I've learned along the way.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Featured Articles
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              My most popular and insightful articles, covering everything from technical deep-dives 
              to industry insights and best practices.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground px-4">{post.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{post.category}</Badge>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/blog/${post.slug}`}>Read More</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              variant={showFeatured ? "default" : "outline"}
              onClick={() => setShowFeatured(!showFeatured)}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Featured Only
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="h-64 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground px-4">{post.title}</h3>
                    <p className="text-muted-foreground mt-2">{post.category}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-muted-foreground mb-6 leading-relaxed">{post.excerpt}</p>
                  
                  {/* Tags */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-blue-500" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Post Meta */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{post.views} views</span>
                    </div>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-3 mb-6 p-3 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {post.author.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{post.author.name}</div>
                      <div className="text-sm text-muted-foreground">{post.author.role}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <Button asChild size="cta" className="flex-1">
                      <Link href={`/blog/${post.slug}`}>
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="cta">
                      <Link href={`/blog/${post.slug}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or filters to find what you're looking for.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setShowFeatured(false)
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">
            Stay Updated with My Latest Insights
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get notified when I publish new articles about development, design, and industry trends. 
            Never miss valuable insights that can help you grow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="hero" variant="secondary" className="text-lg">
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="hero" variant="outline" className="text-lg border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/portfolio">
                View My Work
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
