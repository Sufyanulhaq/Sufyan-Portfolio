import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Post from "@/models/Post"
import User from "@/models/User"
import Comment from "@/models/Comment"
import Project from "@/models/Project"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const [totalPosts, publishedPosts, totalUsers, totalComments, totalProjects, totalViews, recentPosts, recentUsers] =
      await Promise.all([
        Post.countDocuments(),
        Post.countDocuments({ status: "PUBLISHED" }),
        User.countDocuments(),
        Comment.countDocuments(),
        Project.countDocuments(),
        Post.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
        Post.find({ status: "PUBLISHED" }).limit(5).sort({ createdAt: -1 }),
        User.find().limit(5).sort({ createdAt: -1 }).select("name email createdAt"),
      ])

    const stats = {
      totalPosts,
      publishedPosts,
      totalUsers,
      totalComments,
      totalProjects,
      totalViews: totalViews[0]?.total || 0,
      recentPosts,
      recentUsers,
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
