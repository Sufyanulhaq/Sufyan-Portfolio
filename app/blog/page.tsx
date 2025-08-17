"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Calendar, Clock, Eye, Heart } from "lucide-react"
import BlogPostCard from "@/components/blog-post-card"

interface Post {
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

interface BlogPageProps {
  searchParams: {
    page?: string
    category?: string
    search?: string
    featured?: string
  }
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    search: searchParams.search || "",
    category: searchParams.category || "all",
    featured: searchParams.featured || "all"
  })

  const postsPerPage = 9

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [])

  useEffect(() => {
    filterPosts()
  }, [posts, filters])

  useEffect(() => {
    // Update URL when filters change
    const params = new URLSearchParams()
    if (filters.search) params.set("search", filters.search)
    if (filters.category !== "all") params.set("category", filters.category)
    if (filters.featured !== "all") params.set("featured", filters.featured)
    if (currentPage > 1) params.set("page", currentPage.toString())
    
    const newUrl = params.toString() ? `?${params.toString()}` : ""
    window.history.replaceState({}, "", `/blog${newUrl}`)
  }, [filters, currentPage])

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams()
      params.set("page", currentPage.toString())
      params.set("limit", postsPerPage.toString())
      if (filters.category !== "all") params.set("category", filters.category)
      if (filters.featured !== "all") params.set("featured", filters.featured)
      if (filters.search) params.set("search", filters.search)

      const response = await fetch(`/api/blog/posts?${params.toString()}`)
      const data = await response.json()
      
      setPosts(data.posts || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      const categoryNames = data.categories?.map((cat: any) => cat.name) || []
      setCategories(categoryNames)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const filterPosts = () => {
    let filtered = posts

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(filters.search.toLowerCase()) ||
          post.category?.toLowerCase().includes(filters.search.toLowerCase()) ||
          post.tags?.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      )
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((post) => post.category === filters.category)
    }

    // Featured filter
    if (filters.featured !== "all") {
      filtered = filtered.filter((post) => 
        filters.featured === "true" ? post.featured : !post.featured
      )
    }

    setFilteredPosts(filtered)
  }

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }))
    setCurrentPage(1)
  }

  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, category: value }))
    setCurrentPage(1)
  }

  const handleFeaturedChange = (value: string) => {
    setFilters(prev => ({ ...prev, featured: value }))
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Latest <span className="text-primary">Insights</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Thoughts on web development, technology trends, and building better digital experiences.
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Latest <span className="text-primary">Insights</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thoughts on web development, technology trends, and building better digital experiences.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filters.category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.featured} onValueChange={handleFeaturedChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Posts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="true">Featured Only</SelectItem>
                <SelectItem value="false">Regular Posts</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              {filteredPosts.length} posts found
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                    className="w-10 h-10 p-0"
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or check back later for new content.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setFilters({ search: "", category: "all", featured: "all" })
                setCurrentPage(1)
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
