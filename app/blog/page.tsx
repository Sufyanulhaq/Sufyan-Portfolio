"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  ArrowRight,
  TrendingUp,
  Code,
  Palette,
  Zap,
  BookOpen,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  slug: string
  author: {
    name: string
    avatar: string
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
}

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showFeatured, setShowFeatured] = useState(false)

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "My Tech Stack in 2025: What I Use and Why",
      excerpt: "A deep dive into the technologies, frameworks, and tools that power my development workflow in 2025. From frontend frameworks to deployment strategies, discover what's working for me and why.",
      content: "In the ever-evolving landscape of web development, staying current with the latest technologies is crucial for delivering exceptional results. After years of experimentation and real-world testing, I've refined my tech stack to focus on tools that provide the best developer experience, performance, and maintainability...",
      slug: "tech-stack-2025",
      author: {
        name: "Sufyan Ul Haq",
        avatar: "/professional-developer-portrait.png",
        role: "Full-Stack Developer"
      },
      category: "Development",
      tags: ["Tech Stack", "Frameworks", "Tools", "2025", "Best Practices"],
      publishedAt: "2025-01-15",
      readTime: "8 min read",
      featured: true,
      views: 2847,
      likes: 156,
      coverImage: "/modern-portfolio-website.png"
    },
    {
      id: "2",
      title: "From Brief to Launch: How I Build High-Performing Client Websites",
      excerpt: "Walk through my complete development process, from initial client consultation to final deployment. Learn the strategies and methodologies that ensure project success.",
      content: "Building a successful website isn't just about writing code—it's about understanding business objectives, user needs, and technical requirements. Over the years, I've developed a systematic approach that transforms client briefs into high-performing digital solutions...",
      slug: "brief-to-launch-process",
      author: {
        name: "Sufyan Ul Haq",
        avatar: "/professional-developer-portrait.png",
        role: "Full-Stack Developer"
      },
      category: "Process",
      tags: ["Client Work", "Development Process", "Project Management", "Methodology"],
      publishedAt: "2025-01-10",
      readTime: "12 min read",
      featured: true,
      views: 2156,
      likes: 134,
      coverImage: "/task-management-app.png"
    },
    {
      id: "3",
      title: "Performance Optimization: The Secret Sauce of Modern Web Development",
      excerpt: "Explore advanced techniques for optimizing website performance, from Core Web Vitals to server-side optimizations. Learn how to build lightning-fast websites that users love.",
      content: "In today's digital landscape, performance isn't just a nice-to-have—it's a critical factor that directly impacts user experience, conversion rates, and search engine rankings. Users expect websites to load in under 2 seconds, and search engines prioritize fast-loading pages...",
      slug: "performance-optimization-secrets",
      author: {
        name: "Sufyan Ul Haq",
        avatar: "/professional-developer-portrait.png",
        role: "Full-Stack Developer"
      },
      category: "Performance",
      tags: ["Performance", "Core Web Vitals", "Optimization", "Speed", "SEO"],
      publishedAt: "2025-01-05",
      readTime: "10 min read",
      featured: true,
      views: 1892,
      likes: 98,
      coverImage: "/weather-dashboard.png"
    },
    {
      id: "4",
      title: "Building Scalable APIs: Lessons from Production",
      excerpt: "Real-world insights from building and maintaining APIs that serve millions of requests. Discover the architecture patterns and best practices that ensure scalability and reliability.",
      content: "Building APIs that can handle production traffic is a different beast from creating simple endpoints. Over the years, I've learned valuable lessons about designing APIs that scale, handle errors gracefully, and provide excellent developer experience...",
      slug: "scalable-apis-production-lessons",
      author: {
        name: "Sufyan Ul Haq",
        avatar: "/professional-developer-portrait.png",
        role: "Full-Stack Developer"
      },
      category: "Backend",
      tags: ["APIs", "Scalability", "Production", "Architecture", "Best Practices"],
      publishedAt: "2024-12-28",
      readTime: "15 min read",
      featured: false,
      views: 1456,
      likes: 87,
      coverImage: "/modern-ecommerce-dashboard.png"
    },
    {
      id: "5",
      title: "The Future of Frontend: What's Next in 2025 and Beyond",
      excerpt: "Predictions and insights about the future of frontend development. From new frameworks to emerging patterns, discover what's shaping the next generation of web applications.",
      content: "Frontend development is evolving at an unprecedented pace. New frameworks, tools, and patterns emerge regularly, each promising to revolutionize how we build user interfaces. As we move into 2025, several trends are becoming clear...",
      slug: "future-frontend-2025",
      author: {
        name: "Sufyan Ul Haq",
        avatar: "/professional-developer-portrait.png",
        role: "Full-Stack Developer"
      },
      category: "Frontend",
      tags: ["Frontend", "Future", "Trends", "Frameworks", "Innovation"],
      publishedAt: "2024-12-20",
      readTime: "9 min read",
      featured: false,
      views: 1234,
      likes: 76,
      coverImage: "/real-estate-platform.png"
    },
    {
      id: "6",
      title: "Database Design Patterns for Modern Applications",
      excerpt: "Essential database design patterns that every developer should know. Learn how to structure your data for performance, scalability, and maintainability.",
      content: "Database design is often overlooked in the excitement of building features, but it's the foundation that determines your application's performance and scalability. Poor database design can lead to slow queries, data inconsistencies, and maintenance nightmares...",
      slug: "database-design-patterns",
      author: {
        name: "Sufyan Ul Haq",
        avatar: "/professional-developer-portrait.png",
        role: "Full-Stack Developer"
      },
      category: "Database",
      tags: ["Database", "Design Patterns", "Performance", "Scalability", "Architecture"],
      publishedAt: "2024-12-15",
      readTime: "11 min read",
      featured: false,
      views: 987,
      likes: 65,
      coverImage: "/modern-ecommerce-dashboard.png"
    },
    {
      id: "7",
      title: "SEO for Developers: Technical Implementation Guide",
      excerpt: "A comprehensive guide to implementing SEO best practices in your code. Learn how to build websites that search engines love and users can find easily.",
      content: "Search Engine Optimization isn't just about content—it's about building websites that search engines can understand and index effectively. As developers, we have a crucial role in implementing the technical foundations of SEO...",
      slug: "seo-for-developers-guide",
      author: {
        name: "Sufyan Ul Haq",
        avatar: "/professional-developer-portrait.png",
        role: "Full-Stack Developer"
      },
      category: "SEO",
      tags: ["SEO", "Technical SEO", "Search Engines", "Performance", "Best Practices"],
      publishedAt: "2024-12-10",
      readTime: "13 min read",
      featured: false,
      views: 876,
      likes: 54,
      coverImage: "/modern-portfolio-website.png"
    },
    {
      id: "8",
      title: "Testing Strategies for Full-Stack Applications",
      excerpt: "Comprehensive testing strategies that ensure your applications are reliable, maintainable, and bug-free. From unit tests to end-to-end testing, cover all your bases.",
      content: "Testing is often the first thing to be sacrificed when deadlines loom, but it's also the most important investment you can make in your codebase. Well-tested applications are easier to maintain, debug, and extend...",
      slug: "testing-strategies-fullstack",
      author: {
        name: "Sufyan Ul Haq",
        avatar: "/professional-developer-portrait.png",
        role: "Full-Stack Developer"
      },
      category: "Testing",
      tags: ["Testing", "Unit Tests", "Integration Tests", "E2E", "Quality"],
      publishedAt: "2024-12-05",
      readTime: "14 min read",
      featured: false,
      views: 765,
      likes: 43,
      coverImage: "/task-management-app.png"
    }
  ]

  const categories = ["all", "Development", "Process", "Performance", "Backend", "Frontend", "Database", "SEO", "Testing"]
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="font-heading font-bold text-xl text-foreground">
              Sufyan
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
                Portfolio
              </Link>
              <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                Services
              </Link>
              <Link href="/blog" className="text-foreground font-medium">
                Blog
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
                      <TrendingUp className="h-4 w-4" />
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
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/blog/${post.slug}`}>
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
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
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto">
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 h-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/portfolio">
                View My Work
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
