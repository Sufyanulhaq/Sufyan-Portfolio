import { NextRequest, NextResponse } from "next/server"

// Force dynamic rendering to prevent build-time analysis
export const dynamic = 'force-dynamic'

// Dynamic imports to prevent build-time analysis
const connectDB = () => import("@/lib/mongodb").then(m => m.default())
const Category = () => import("@/models/Category").then(m => m.default)

export async function GET(request: NextRequest) {
  // Prevent build-time execution
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  try {
    // Only connect to DB if we're not in build mode
    if (process.env.MONGODB_URI) {
      await connectDB()
    }

    const categories = await (await Category()).find({ isActive: true })
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
