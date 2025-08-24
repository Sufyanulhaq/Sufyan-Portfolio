import Link from "next/link"
import Image from "next/image"

// Force dynamic rendering to prevent build-time MongoDB connection
export const dynamic = 'force-dynamic'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, ExternalLink, Github } from "lucide-react"
import connectDB from "@/lib/mongodb"

async function getAllProjects() {
  try {
    await connectDB()
    
    // Dynamic import to avoid circular dependency issues
    const { Project } = await import("@/lib/models")
    
    const projects = await Project.find().sort({ createdAt: -1 }).lean()

    return projects.map((project) => ({
      ...project,
      _id: project._id.toString(),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      startDate: project.startDate.toISOString(),
      endDate: project.endDate?.toISOString(),
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
            New Project
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project._id} className="overflow-hidden">
            <div className="relative aspect-video">
              <Image src={project.coverImage || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              {project.featured && <Badge className="absolute top-2 left-2">Featured</Badge>}
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                <Badge variant={project.status === "COMPLETED" ? "default" : "secondary"}>
                  {project.status.replace("_", " ")}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Technologies</p>
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

                <div className="flex items-center justify-between">
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
                      <Link href={`/admin/projects/${project._id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No projects found</p>
            <Button asChild>
              <Link href="/admin/projects/new">Create your first project</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
