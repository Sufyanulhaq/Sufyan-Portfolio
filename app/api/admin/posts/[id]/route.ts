import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { neon } from '@neondatabase/serverless'
import Post from "@/models/Post"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to view posts
    if (!["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = params
    
    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    

    const post = await Post.findById(id).populate("author", "name email")

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

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
    console.error("Error fetching post:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to edit posts
    if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = params
    const body = await request.json()
    
    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    

    // Check if post exists
    const existingPost = await Post.findById(id)
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Update post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate("author", "name email")

    if (!updatedPost) {
      return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Post updated successfully",
      post: {
        ...updatedPost.toObject(),
        _id: updatedPost._id.toString(),
        createdAt: updatedPost.createdAt.toISOString(),
        updatedAt: updatedPost.updatedAt.toISOString(),
      }
    })
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to delete posts
    if (!["SUPER_ADMIN", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = params
    
    if (!id || id === "undefined") {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    

    // Check if post exists
    const existingPost = await Post.findById(id)
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Delete post
    await Post.findByIdAndDelete(id)

    return NextResponse.json({
      message: "Post deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
