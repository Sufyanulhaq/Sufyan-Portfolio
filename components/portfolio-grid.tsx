"use client"

import Link from "next/link"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Eye } from "lucide-react"

interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: string[]
  category: string
  githubUrl: string
  liveUrl: string
  featured: boolean
}

const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with user authentication, payment processing, and admin dashboard.",
    image: "/images/portfolio/ecommerce-platform.png",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
    category: "Full-Stack",
    githubUrl: "https://github.com/sufyan/ecommerce-platform",
    liveUrl: "https://ecommerce-demo.sufyan.dev",
    featured: true,
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates and team collaboration features.",
    image: "/images/portfolio/task-management-app.tiff",
    technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Socket.io"],
    category: "Full-Stack",
    githubUrl: "https://github.com/sufyan/task-manager",
    liveUrl: "https://tasks.sufyan.dev",
    featured: true,
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "A responsive weather application with location-based forecasts and interactive charts.",
    image: "/images/portfolio/weather-dashboard.tiff",
    technologies: ["React", "Chart.js", "OpenWeather API", "CSS Modules"],
    category: "Frontend",
    githubUrl: "https://github.com/sufyan/weather-dashboard",
    liveUrl: "https://weather.sufyan.dev",
    featured: false,
  },
  {
    id: 4,
    title: "Blog CMS",
    description: "A content management system for bloggers with markdown support and SEO optimization.",
    image: "/blog-cms-admin.png",
    technologies: ["Next.js", "MDX", "Supabase", "Tailwind CSS"],
    category: "Full-Stack",
    githubUrl: "https://github.com/sufyan/blog-cms",
    liveUrl: "https://blog-cms.sufyan.dev",
    featured: false,
  },
  {
    id: 5,
    title: "Portfolio Website",
    description: "A modern portfolio website with smooth animations and responsive design.",
    image: "/images/portfolio/modern-portfolio-website.png",
    technologies: ["Next.js", "Framer Motion", "Tailwind CSS", "TypeScript"],
    category: "Frontend",
    githubUrl: "https://github.com/sufyan/portfolio",
    liveUrl: "https://sufyan.dev",
    featured: false,
  },
  {
    id: 6,
    title: "Real Estate Platform",
    description: "A comprehensive real estate platform with property listings, search, and virtual tours.",
    image: "/images/portfolio/real-estate-platform.tiff",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Mapbox"],
    category: "Full-Stack",
    githubUrl: "https://github.com/sufyan/real-estate",
    liveUrl: "https://realestate.sufyan.dev",
    featured: true,
  },
]

const categories = ["All", "Full-Stack", "Frontend", "Backend"]

export function PortfolioGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  const filteredProjects = projects.filter(
    (project) => selectedCategory === "All" || project.category === selectedCategory,
  )

  const featuredProjects = filteredProjects.filter((project) => project.featured)
  const regularProjects = filteredProjects.filter((project) => !project.featured)

  return (
    <div className="space-y-12">
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted hover:text-foreground"
            }
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-8">Featured Projects</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <Card
                key={project.id}
                className="group overflow-hidden bg-card border-border hover:shadow-xl transition-all duration-300"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-heading font-semibold text-card-foreground">{project.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {project.category}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Regular Projects */}
      {regularProjects.length > 0 && (
        <section>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-8">Other Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularProjects.map((project) => (
              <Card
                key={project.id}
                className="group overflow-hidden bg-card border-border hover:shadow-lg transition-all duration-300"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-heading font-semibold text-card-foreground">{project.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {project.category}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="text-center pt-12">
        <Card className="p-8 bg-gradient-to-r from-primary/5 to-accent/5 border-border">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Interested in Working Together?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            I'm always excited to take on new challenges and create amazing digital experiences. Let's discuss your
            project!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Start a Project
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/services">View Services</Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  )
}
