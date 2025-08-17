import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Post from "@/models/Post"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB()

    const post = await Post.findOne({ slug: params.slug, published: true }).populate("author", "name bio avatar").lean()

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Increment view count
    await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } })

    return NextResponse.json({
      ...post,
      _id: post._id.toString(),
      author: {
        ...post.author,
        _id: post.author._id.toString(),
      },
    })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
