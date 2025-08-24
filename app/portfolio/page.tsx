"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Github, 
  Globe, 
  Code, 
  Palette, 
  Database, 
  Zap, 
  Users, 
  TrendingUp,
  ArrowRight,
  Calendar,
  Clock,
  Target
} from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  category: string
  status: "completed" | "in-progress" | "planned"
  featured: boolean
  image: string
  techStack: string[]
  challenges: string[]
  solutions: string[]
  results: string[]
  liveUrl?: string
  githubUrl?: string
  duration: string
  teamSize: string
  budget: string
}

export default function PortfolioPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showFeatured, setShowFeatured] = useState(false)

  const projects: Project[] = [
    {
      id: "1",
      title: "Modern Analytics Dashboard",
      description: "A comprehensive business intelligence platform with real-time data visualization and advanced reporting capabilities.",
      longDescription: "Built for a growing SaaS company, this dashboard provides executives and teams with real-time insights into business performance, user behavior, and revenue metrics. Features include interactive charts, custom reporting, automated alerts, and role-based access control.",
      category: "SaaS",
      status: "completed",
      featured: true,
      image: "/images/projects/analytics-dashboard.jpg",
      techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "D3.js", "Chart.js", "AWS"],
      challenges: [
        "Complex data aggregation from multiple sources",
        "Real-time updates without performance degradation",
        "Handling large datasets efficiently",
        "Creating intuitive data visualization"
      ],
      solutions: [
        "Implemented efficient caching with Redis",
        "Used WebSockets for real-time updates",
        "Optimized database queries and indexing",
        "Created reusable chart components with D3.js"
      ],
      results: [
        "50% faster data loading times",
        "Real-time dashboard updates",
        "Improved decision-making speed by 40%",
        "Reduced support tickets by 60%"
      ],
      liveUrl: "https://dashboard.example.com",
      githubUrl: "https://github.com/example/analytics-dashboard",
      duration: "12 weeks",
      teamSize: "3 developers",
      budget: "$45,000"
    },
    {
      id: "2",
      title: "E-commerce Platform",
      description: "A high-performance online store with advanced features, mobile optimization, and seamless payment processing.",
      longDescription: "Developed for a premium fashion retailer, this e-commerce platform handles thousands of products, multiple payment gateways, inventory management, and customer analytics. The platform is optimized for mobile devices and includes advanced features like wishlists, product recommendations, and social sharing.",
      category: "E-commerce",
      status: "completed",
      featured: true,
      image: "/images/projects/ecommerce-platform.jpg",
      techStack: ["Next.js", "Stripe", "PostgreSQL", "Redis", "Tailwind CSS", "Framer Motion", "Vercel"],
      challenges: [
        "Handling high traffic during sales events",
        "Integrating multiple payment gateways",
        "Optimizing for mobile performance",
        "Managing complex inventory systems"
      ],
      solutions: [
        "Implemented CDN and edge caching",
        "Created unified payment abstraction layer",
        "Mobile-first responsive design approach",
        "Built robust inventory management API"
      ],
      results: [
        "300% increase in mobile conversions",
        "99.9% uptime during peak traffic",
        "40% improvement in page load speed",
        "25% increase in average order value"
      ],
      liveUrl: "https://store.example.com",
      githubUrl: "https://github.com/example/ecommerce",
      duration: "16 weeks",
      teamSize: "4 developers",
      budget: "$65,000"
    },
    {
      id: "3",
      title: "Lead Generation Website",
      description: "A conversion-focused website designed to capture leads and drive business growth through strategic design and optimization.",
      longDescription: "Created for a B2B consulting firm, this lead generation website combines compelling copywriting, strategic CTAs, and performance optimization to maximize lead capture. The site includes landing pages, lead magnets, email automation, and comprehensive analytics tracking.",
      category: "Marketing",
      status: "completed",
      featured: true,
      image: "/images/projects/lead-generation.jpg",
      techStack: ["Vue.js", "Laravel", "MySQL", "Mailchimp", "Google Analytics", "Hotjar", "CloudFlare"],
      challenges: [
        "Creating compelling lead capture forms",
        "Optimizing conversion rates",
        "Integrating marketing automation tools",
        "Tracking user behavior effectively"
      ],
      solutions: [
        "A/B tested multiple form designs",
        "Implemented progressive profiling",
        "Built custom marketing automation",
        "Added comprehensive tracking pixels"
      ],
      results: [
        "400% increase in lead generation",
        "Conversion rate improved from 2% to 8%",
        "Reduced cost per lead by 60%",
        "Generated $150K in new business"
      ],
      liveUrl: "https://consulting.example.com",
      githubUrl: "https://github.com/example/lead-gen",
      duration: "8 weeks",
      teamSize: "2 developers",
      budget: "$25,000"
    },
    {
      id: "4",
      title: "Task Management App",
      description: "A collaborative project management tool with real-time updates, team collaboration, and advanced task tracking.",
      longDescription: "Built for remote teams, this task management application enables seamless collaboration with features like real-time updates, file sharing, time tracking, and project analytics. The app supports multiple project views, team roles, and integrations with popular tools.",
      category: "Productivity",
      status: "completed",
      featured: false,
      image: "/task-management-app.png",
      techStack: ["React", "Node.js", "Socket.io", "MongoDB", "AWS S3", "JWT", "Multer"],
      challenges: [
        "Real-time collaboration across multiple users",
        "Handling large file uploads efficiently",
        "Managing complex user permissions",
        "Ensuring data consistency"
      ],
      solutions: [
        "Implemented WebSocket connections with Socket.io",
        "Used AWS S3 for file storage and CDN",
        "Built role-based access control system",
        "Implemented optimistic updates with conflict resolution"
      ],
      results: [
        "Real-time collaboration for 100+ users",
        "50% reduction in project completion time",
        "Improved team productivity by 35%",
        "99.9% uptime with 24/7 availability"
      ],
      liveUrl: "https://tasks.example.com",
      githubUrl: "https://github.com/example/task-manager",
      duration: "14 weeks",
      teamSize: "3 developers",
      budget: "$55,000"
    },
    {
      id: "5",
      title: "Real Estate Platform",
      description: "A comprehensive real estate website with property listings, advanced search, and virtual tour capabilities.",
      longDescription: "Developed for a real estate agency, this platform features advanced property search, virtual tours, mortgage calculators, and agent management tools. The site includes a powerful admin panel for managing listings, leads, and analytics.",
      category: "Real Estate",
      status: "completed",
      featured: false,
      image: "/real-estate-platform.png",
      techStack: ["Next.js", "PostgreSQL", "Prisma", "NextAuth", "Cloudinary", "Mapbox", "Stripe"],
      challenges: [
        "Managing large property databases",
        "Implementing advanced search filters",
        "Handling high-resolution property images",
        "Creating intuitive user experience"
      ],
      solutions: [
        "Optimized database with proper indexing",
        "Built flexible search API with filters",
        "Implemented image optimization pipeline",
        "Created user-centered design system"
      ],
      results: [
        "Property search 3x faster than competitors",
        "Increased lead generation by 200%",
        "Improved user engagement by 45%",
        "Reduced bounce rate by 30%"
      ],
      liveUrl: "https://realestate.example.com",
      githubUrl: "https://github.com/example/real-estate",
      duration: "18 weeks",
      teamSize: "4 developers",
      budget: "$75,000"
    },
    {
      id: "6",
      title: "Weather Dashboard",
      description: "A beautiful weather application with real-time data, forecasts, and interactive weather maps.",
      longDescription: "A modern weather application that provides current conditions, hourly forecasts, and interactive weather maps. Features include location-based weather, severe weather alerts, and customizable weather widgets for different locations.",
      category: "Utility",
      status: "completed",
      featured: false,
      image: "/weather-dashboard.png",
      techStack: ["React", "OpenWeather API", "Chart.js", "Leaflet Maps", "PWA", "Service Workers"],
      challenges: [
        "Integrating multiple weather APIs",
        "Creating responsive weather visualizations",
        "Implementing offline functionality",
        "Optimizing for mobile performance"
      ],
      solutions: [
        "Built unified weather data service",
        "Created custom chart components",
        "Implemented PWA with service workers",
        "Mobile-first responsive design"
      ],
      results: [
        "Lightning-fast weather updates",
        "Works offline with cached data",
        "Mobile-optimized experience",
        "4.8/5 user rating"
      ],
      liveUrl: "https://weather.example.com",
      githubUrl: "https://github.com/example/weather-app",
      duration: "6 weeks",
      teamSize: "1 developer",
      budget: "$15,000"
    }
  ]

  const categories = ["all", "SaaS", "E-commerce", "Marketing", "Productivity", "Real Estate", "Utility"]
  const statuses = ["all", "completed", "in-progress", "planned"]

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || project.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || project.status === selectedStatus
    const matchesFeatured = !showFeatured || project.featured

    return matchesSearch && matchesCategory && matchesStatus && matchesFeatured
  })

  const featuredProjects = projects.filter(project => project.featured)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
              My Portfolio
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Showcase
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              A collection of projects that demonstrate my expertise in full-stack development, 
              design, and problem-solving. Each project represents a unique challenge and solution.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These projects represent the pinnacle of my work, showcasing innovative solutions 
              and technical excellence across different industries and technologies.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Code className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 3).map((tech, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.techStack.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.techStack.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{project.category}</Badge>
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
                  placeholder="Search projects..."
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
            
            <div className="flex items-center gap-4">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All Status" : status.replace("-", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant={showFeatured ? "default" : "outline"}
                onClick={() => setShowFeatured(!showFeatured)}
                className="flex items-center gap-2"
              >
                <Target className="h-4 w-4" />
                Featured Only
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} id={`project-${project.id}`} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="h-64 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Code className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">{project.title}</h3>
                    <p className="text-muted-foreground mt-2">{project.category}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-muted-foreground mb-6 leading-relaxed">{project.longDescription}</p>
                  
                  {/* Tech Stack */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      Technology Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{project.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{project.teamSize}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>{project.budget}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="capitalize">{project.status.replace("-", " ")}</span>
                    </div>
                  </div>

                  {/* Challenges & Solutions */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-3">Key Challenges & Solutions</h4>
                    <div className="space-y-3">
                      {project.challenges.slice(0, 2).map((challenge, idx) => (
                        <div key={idx} className="text-sm">
                          <div className="font-medium text-foreground mb-1">Challenge: {challenge}</div>
                          <div className="text-muted-foreground">Solution: {project.solutions[idx]}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Results */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-3">Results & Impact</h4>
                    <ul className="space-y-2">
                      {project.results.slice(0, 3).map((result, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    {project.liveUrl && (
                      <Button asChild size="cta" className="flex-1">
                        <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4 mr-2" />
                          Live Demo
                        </Link>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button asChild variant="outline" size="cta">
                        <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          Code
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or filters to find what you're looking for.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setSelectedStatus("all")
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
            Ready to Start Your Project?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss your vision and create something amazing together. 
            I'm here to help bring your ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="hero" variant="secondary" className="text-lg">
              <Link href="/contact">
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="hero" variant="outline" className="text-lg border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/services">
                View Services
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
