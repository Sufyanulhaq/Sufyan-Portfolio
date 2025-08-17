import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Post from "@/models/Post"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to view posts
    if (!["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || "all"
    const category = searchParams.get("category") || "all"
    const search = searchParams.get("search") || ""
    
    await connectDB()

    // Build query
    const query: any = {}
    
    if (status !== "all") {
      query.published = status === "published"
    }
    
    if (category !== "all") {
      query.category = category
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ]
    }

    // Execute query with pagination
    const skip = (page - 1) * limit
    
    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate("author", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(query),
    ])

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
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
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

    // Check if user has permission to create posts
    if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    
    await connectDB()

    // Create new post
    const post = new Post({
      ...body,
      author: session.user.id,
    })

    await post.save()

    return NextResponse.json({
      message: "Post created successfully",
      post: {
        ...post.toObject(),
        _id: post._id.toString(),
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
