import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Project, User } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const featured = searchParams.get("featured")
    const search = searchParams.get("search")
    const skip = (page - 1) * limit

    await connectDB()

    // Build query
    const query: any = {}

    if (category && category !== "all") {
      query.category = category
    }

    if (status && status !== "all") {
      query.status = status
    }

    if (featured && featured !== "all") {
      query.featured = featured === "true"
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { longDescription: { $regex: search, $options: "i" } },
        { technologies: { $in: [new RegExp(search, "i")] } }
      ]
    }

    // Get total count
    const total = await Project.countDocuments(query)
    const pages = Math.ceil(total / limit)

    // Get projects
    const projects = await Project.find(query)
      .populate("author", "name email bio avatar")
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Format projects
    const formattedProjects = projects.map((project) => ({
      ...project,
      _id: project._id.toString(),
      author: project.author ? {
        ...project.author,
        _id: project.author._id.toString(),
      } : null,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }))

    return NextResponse.json({
      projects: formattedProjects,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error("Error fetching portfolio projects:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json(
      { 
        error: "Failed to fetch portfolio projects",
        details: error.message,
        type: error.name
      },
      { status: 500 }
    )
  }
}
