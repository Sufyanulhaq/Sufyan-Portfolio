import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, ExternalLink, Github } from "lucide-react"
import { neon } from '@neondatabase/serverless'

// Force dynamic rendering to prevent build-time database connection
export const dynamic = 'force-dynamic'

async function getAllProjects() {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('Database not configured')
      return []
    }

    const sql = neon(process.env.DATABASE_URL)
    
    const projects = await sql`
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.description,
        p.content,
        p.featured_image,
        p.gallery_images,
        p.technologies,
        p.project_url,
        p.github_url,
        p.status,
        p.featured,
        p.sort_order,
        p.view_count,
        p.published_at,
        p.created_at,
        p.updated_at,
        p.author_id,
        u.name as author_name,
        c.name as category_name
      FROM cms.portfolio p
      LEFT JOIN cms.users u ON p.author_id = u.id
      LEFT JOIN cms.categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `
    
    return projects.map(project => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      content: project.content,
      coverImage: project.featured_image || '/placeholder.jpg',
      images: project.gallery_images || [],
      technologies: project.technologies || [],
      category: project.category_name || 'Uncategorized',
      featured: project.featured,
      liveUrl: project.project_url,
      githubUrl: project.github_url,
      status: project.status?.toUpperCase() || 'DRAFT',
      author: {
        name: project.author_name || 'Unknown'
      },
      viewCount: project.view_count || 0,
      createdAt: project.created_at?.toISOString(),
      updatedAt: project.updated_at?.toISOString(),
      publishedAt: project.published_at?.toISOString()
    }))
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export default async function AdminProjectsPage() {
  const projects = await getAllProjects()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  {project.featured && (
                    <Badge variant="secondary" className="bg-yellow-500 text-white">
                      Featured
                    </Badge>
                  )}
                  <Badge variant={
                    project.status === 'PUBLISHED' ? 'default' : 
                    project.status === 'DRAFT' ? 'secondary' : 'destructive'
                  }>
                    {project.status}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Category: {project.category}</span>
                  <span>•</span>
                  <span>{project.viewCount} views</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map((tech: string) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.technologies.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    {project.liveUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={project.liveUrl} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={project.githubUrl} target="_blank">
                          <Github className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/projects/${project.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="text-center space-y-4">
                  <div className="text-4xl">📁</div>
                  <div>
                    <h3 className="text-lg font-semibold">No projects yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Create your first project to get started
                    </p>
                  </div>
                  <Button asChild>
                    <Link href="/admin/projects/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Project
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}