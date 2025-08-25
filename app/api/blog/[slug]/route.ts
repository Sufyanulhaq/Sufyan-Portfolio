import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import Post from "@/models/Post"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    

    const post = await Post.findOne({ 
      slug, 
      published: true 
    }).populate("author", "name email")

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Increment view count
    await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } })

    const formattedPost = {
      ...post.toObject(),
      _id: post._id.toString(),
      author: post.author ? {
        ...post.author,
        _id: post.author._id.toString(),
      } : null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }

    return NextResponse.json({ post: formattedPost })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
