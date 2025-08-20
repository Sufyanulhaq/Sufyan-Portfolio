import { NextRequest, NextResponse } from "next/server"

// Force dynamic rendering to prevent build-time analysis
export const dynamic = 'force-dynamic'

// Dynamic imports to prevent build-time analysis
const connectDB = () => import("@/lib/mongodb").then(m => m.default())
const Post = () => import("@/lib/models").then(m => m.Post)
const User = () => import("@/lib/models").then(m => m.User)

export async function GET(request: NextRequest) {
  // Prevent build-time execution
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    const skip = (page - 1) * limit

    // Only connect to DB if we're not in build mode
    if (process.env.MONGODB_URI) {
      await connectDB()
    }

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
    const total = await (await Post()).countDocuments(query)
    const pages = Math.ceil(total / limit)

    // Get posts
    const posts = await (await Post()).find(query)
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
