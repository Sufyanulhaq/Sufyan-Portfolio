import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import { Post, User } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    const skip = (page - 1) * limit

    await connectDB()

    // Build query
    const query: any = { published: true }

    if (category && category !== "all") {
      query.category = category
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ]
    }

    if (featured && featured !== "all") {
      query.featured = featured === "true"
    }

    // Get total count
    const total = await Post.countDocuments(query)
    const pages = Math.ceil(total / limit)

    // Get posts
    const posts = await Post.find(query)
      .populate("author", "name email bio avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Format posts
    const formattedPosts = posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
      author: post.author ? {
        ...post.author,
        _id: post.author._id.toString(),
      } : null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }))

    return NextResponse.json({
      posts: formattedPosts,
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
    console.error("Error fetching blog posts:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json(
      { 
        error: "Failed to fetch blog posts",
        details: error.message,
        type: error.name
      },
      { status: 500 }
    )
  }
}
