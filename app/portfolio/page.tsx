"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, ExternalLink, Github, Eye, Calendar, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Project {
  _id: string
  title: string
  description: string
  longDescription: string
  slug: string
  coverImage: string
  images: string[]
  technologies: string[]
  category: string
  featured: boolean
  liveUrl?: string
  githubUrl?: string
  status: string
  startDate: string
  endDate: string
  client?: string
  testimonial?: {
    content: string
    author: string
    position: string
    company: string
  }
  createdAt: string
  updatedAt: string
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all",
    featured: "all"
  })

  useEffect(() => {
    fetchProjects()
    fetchCategories()
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, filters])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/portfolio/projects")
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
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

  const filterProjects = () => {
    let filtered = projects

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          project.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          project.technologies.some(tech => tech.toLowerCase().includes(filters.search.toLowerCase()))
      )
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((project) => project.category === filters.category)
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((project) => project.status === filters.status)
    }

    // Featured filter
    if (filters.featured !== "all") {
      filtered = filtered.filter((project) => 
        filters.featured === "true" ? project.featured : !project.featured
      )
    }

    setFilteredProjects(filtered)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "default"
      case "IN_PROGRESS":
        return "secondary"
      case "PLANNED":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Completed"
      case "IN_PROGRESS":
        return "In Progress"
      case "PLANNED":
        return "Planned"
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              My <span className="text-primary">Portfolio</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A collection of projects showcasing my skills in web development, design, and problem-solving.
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
            My <span className="text-primary">Portfolio</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of projects showcasing my skills in web development, design, and problem-solving.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            
            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
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

            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="PLANNED">Planned</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.featured} onValueChange={(value) => setFilters(prev => ({ ...prev, featured: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="true">Featured Only</SelectItem>
                <SelectItem value="false">Regular Projects</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground flex items-center mt-4">
            <Filter className="mr-2 h-4 w-4" />
            {filteredProjects.length} projects found
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project._id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={project.coverImage || `/placeholder.svg?height=240&width=400&query=${encodeURIComponent(project.title)}`}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {project.featured && (
                    <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                      Featured
                    </Badge>
                  )}
                  <Badge 
                    variant={getStatusBadgeVariant(project.status)}
                    className="absolute top-4 right-4"
                  >
                    {getStatusText(project.status)}
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 4}
                      </Badge>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {project.client && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Client:</span>
                        <span>{project.client}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(project.startDate).toLocaleDateString()}</span>
                      </div>
                      {project.endDate && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(project.endDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Testimonial */}
                  {project.testimonial && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm italic line-clamp-3">"{project.testimonial.content}"</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        — {project.testimonial.author}, {project.testimonial.position} at {project.testimonial.company}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    {project.liveUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Live Demo
                        </Link>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-3 w-3 mr-1" />
                          Code
                        </Link>
                      </Button>
                    )}
                    <Button size="sm" variant="outline" asChild className="ml-auto">
                      <Link href={`/portfolio/${project.slug}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or check back later for new projects.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setFilters({ search: "", category: "all", status: "all", featured: "all" })}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
