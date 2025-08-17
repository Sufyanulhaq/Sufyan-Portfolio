import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions, hasPermission } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Category from "@/models/Category"
import UserActivity from "@/models/UserActivity"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !hasPermission(session.user.role as any, "VIEW_POSTS")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const categories = await Category.find().populate("createdBy", "name").sort({ sortOrder: 1, name: 1 })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Categories API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !hasPermission(session.user.role as any, "MANAGE_POSTS")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { name, slug, description, color, icon, isActive, sortOrder } = data

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
    }

    await connectDB()

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug })
    if (existingCategory) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
    }

    const category = await Category.create({
      name,
      slug,
      description,
      color: color || "#3B82F6",
      icon,
      isActive: isActive !== false,
      sortOrder: sortOrder || 0,
      createdBy: session.user.id,
    })

    // Log activity
    await UserActivity.create({
      user: session.user.id,
      action: "CREATE_CATEGORY",
      resource: "CATEGORY",
      resourceId: category._id,
      details: { name, slug },
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error("Create category error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
