import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Project from "@/models/Project"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category") || "all"
    const status = searchParams.get("status") || "all"
    const featured = searchParams.get("featured") || "all"
    const search = searchParams.get("search") || ""
    
    await connectDB()

    // Build query
    const query: any = {}
    
    if (category !== "all") {
      query.category = category
    }
    
    if (status !== "all") {
      query.status = status
    }
    
    if (featured !== "all") {
      query.featured = featured === "true"
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { longDescription: { $regex: search, $options: "i" } },
      ]
    }

    // Execute query with pagination
    const skip = (page - 1) * limit
    
    const [projects, total] = await Promise.all([
      Project.find(query)
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Project.countDocuments(query),
    ])

    const formattedProjects = projects.map((project) => ({
      ...project,
      _id: project._id.toString(),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }))

    return NextResponse.json({
      projects: formattedProjects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching portfolio projects:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
