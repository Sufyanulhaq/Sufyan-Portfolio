import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { Plus, Folder } from "lucide-react"
import connectDB from "@/lib/mongodb"
import Category from "@/models/Category"
import { requirePermission } from "@/lib/rbac"

async function getAllCategories() {
  try {
    await connectDB()
    const categories = await Category.find().populate("createdBy", "name").sort({ sortOrder: 1, name: 1 }).lean()

    return categories.map((category) => ({
      ...category,
      _id: category._id.toString(),
      createdBy: category.createdBy
        ? {
            ...category.createdBy,
            _id: category.createdBy._id.toString(),
          }
        : null,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function CategoriesPage() {
  await requirePermission("MANAGE_POSTS")
  const categories = await getAllCategories()

  const columns = [
    {
      key: "name" as const,
      title: "Name",
      sortable: true,
      filterable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: row.color }} />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "description" as const,
      title: "Description",
      render: (value: string) => <span className="text-sm text-muted-foreground">{value || "No description"}</span>,
    },
    {
      key: "postCount" as const,
      title: "Posts",
      sortable: true,
      render: (value: number) => <Badge variant="secondary">{value}</Badge>,
    },
    {
      key: "isActive" as const,
      title: "Status",
      sortable: true,
      filterable: true,
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>{value ? "Active" : "Inactive"}</Badge>
      ),
    },
    {
      key: "createdAt" as const,
      title: "Created",
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ]

  const handleEdit = (category: any) => {
    window.location.href = `/admin/categories/${category._id}/edit`
  }

  const handleDelete = async (category: any) => {
    if (category.postCount > 0) {
      alert("Cannot delete category with existing posts. Please reassign posts first.")
      return
    }

    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      // Delete logic would be implemented here
      console.log("Delete category:", category._id)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Organize your content with categories</p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            New Category
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            All Categories
          </CardTitle>
          <CardDescription>Manage your content categories</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={categories}
            columns={columns}
            searchable={true}
            filterable={true}
            actions={{
              edit: handleEdit,
              delete: handleDelete,
            }}
            emptyMessage="No categories found. Create your first category to get started."
          />
        </CardContent>
      </Card>
    </div>
  )
}
