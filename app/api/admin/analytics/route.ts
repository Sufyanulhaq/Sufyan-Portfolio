import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions, hasPermission } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Post from "@/models/Post"
import User from "@/models/User"
import UserActivity from "@/models/UserActivity"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !hasPermission(session.user.role as any, "VIEW_ANALYTICS")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30d"
    const metric = searchParams.get("metric") || "overview"

    await connectDB()

    const now = new Date()
    let startDate: Date

    switch (period) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    let data: any = {}

    switch (metric) {
      case "users":
        data = await User.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        ])
        break

      case "posts":
        data = await Post.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
              },
              count: { $sum: 1 },
              views: { $sum: "$views" },
              likes: { $sum: "$likes" },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
        ])
        break

      case "activity":
        data = await UserActivity.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          {
            $group: {
              _id: "$action",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ])
        break

      default:
        // Overview data
        const [totalUsers, totalPosts, totalViews, recentActivity] = await Promise.all([
          User.countDocuments({ createdAt: { $gte: startDate } }),
          Post.countDocuments({ createdAt: { $gte: startDate } }),
          Post.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: null, total: { $sum: "$views" } } },
          ]),
          UserActivity.find({ createdAt: { $gte: startDate } })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("user", "name email")
            .lean(),
        ])

        data = {
          totalUsers,
          totalPosts,
          totalViews: totalViews[0]?.total || 0,
          recentActivity: recentActivity.map((activity) => ({
            ...activity,
            _id: activity._id.toString(),
            user: activity.user
              ? {
                  ...activity.user,
                  _id: activity.user._id.toString(),
                }
              : null,
            createdAt: activity.createdAt.toISOString(),
          })),
        }
    }

    return NextResponse.json({ data, period, metric })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
