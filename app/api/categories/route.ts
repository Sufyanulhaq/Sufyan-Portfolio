import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Category from "@/models/Category"

export async function GET(request: NextRequest) {
  try {
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
