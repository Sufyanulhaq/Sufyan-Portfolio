import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Category from "@/models/Category"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to view categories
    if (!["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await connectDB()

    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 })
      .lean()

    const formattedCategories = categories.map((category) => ({
      ...category,
      _id: category._id.toString(),
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }))

    return NextResponse.json({ categories: formattedCategories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to create categories
    if (!["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    
    await connectDB()

    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug })
    if (existingCategory) {
      return NextResponse.json({ error: "Category with this name already exists" }, { status: 400 })
    }

    // Create new category
    const category = new Category({
      ...body,
      slug,
    })

    await category.save()

    return NextResponse.json({
      message: "Category created successfully",
      category: {
        ...category.toObject(),
        _id: category._id.toString(),
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
