import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Comment from "@/models/Comment"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to view comments
    if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || "all"
    const search = searchParams.get("search") || ""
    
    await connectDB()

    // Build query
    const query: any = {}
    
    if (status !== "all") {
      if (status === "approved") {
        query.isApproved = true
        query.isSpam = false
      } else if (status === "pending") {
        query.isApproved = false
        query.isSpam = false
      } else if (status === "spam") {
        query.isSpam = true
      }
    }
    
    if (search) {
      query.content = { $regex: search, $options: "i" }
    }

    // Execute query with pagination
    const skip = (page - 1) * limit
    
    const [comments, total] = await Promise.all([
      Comment.find(query)
        .populate("author", "name email")
        .populate("post", "title slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Comment.countDocuments(query),
    ])

    const formattedComments = comments.map((comment) => ({
      ...comment,
      _id: comment._id.toString(),
      author: comment.author ? {
        ...comment.author,
        _id: comment.author._id.toString(),
      } : null,
      post: comment.post ? {
        ...comment.post,
        _id: comment.post._id.toString(),
      } : null,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    }))

    return NextResponse.json({
      comments: formattedComments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to moderate comments
    if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { commentId, action } = body
    
    await connectDB()

    let updateData: any = {}
    
    switch (action) {
      case "approve":
        updateData = { isApproved: true, isSpam: false }
        break
      case "reject":
        updateData = { isApproved: false, isSpam: false }
        break
      case "markSpam":
        updateData = { isSpam: true, isApproved: false }
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      updateData,
      { new: true }
    ).populate("author", "name email")

    if (!updatedComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Comment updated successfully",
      comment: {
        ...updatedComment.toObject(),
        _id: updatedComment._id.toString(),
        createdAt: updatedComment.createdAt.toISOString(),
        updatedAt: updatedComment.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Error updating comment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
