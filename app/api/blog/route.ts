import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Post from "@/models/Post"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")

    await connectDB()

    const query: any = { published: true }
    if (category) query.category = category
    if (featured === "true") query.featured = true

    const skip = (page - 1) * limit

    const posts = await Post.find(query)
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Post.countDocuments(query)

    return NextResponse.json({
      posts: posts.map((post) => ({
        ...post,
        _id: post._id.toString(),
        author: {
          ...post.author,
          _id: post.author._id.toString(),
        },
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
