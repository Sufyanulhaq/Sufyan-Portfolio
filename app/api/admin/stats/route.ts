import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import Post from "@/models/Post"
import User from "@/models/User"
import Project from "@/models/Project"
import Comment from "@/models/Comment"
import UserActivity from "@/models/UserActivity"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to view stats
    if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await connectDB()

    // Calculate date ranges
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Fetch comprehensive stats
    const [
      totalStats,
      monthlyStats,
      weeklyStats,
      recentPosts,
      userGrowth,
      activityData,
      engagementData
    ] = await Promise.all([
      // Total stats
      Promise.all([
        Post.countDocuments({ published: true }),
        User.countDocuments({ isActive: true }),
        Post.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
        Comment.countDocuments({ isApproved: true }),
        Project.countDocuments(),
      ]),
      
      // Monthly stats
      Promise.all([
        Post.countDocuments({ 
          createdAt: { $gte: thirtyDaysAgo }, 
          published: true 
        }),
        User.countDocuments({ 
          createdAt: { $gte: thirtyDaysAgo } 
        }),
        Post.aggregate([
          { $match: { createdAt: { $gte: thirtyDaysAgo } } },
          { $group: { _id: null, total: { $sum: "$views" } } },
        ]),
        Comment.countDocuments({ 
          createdAt: { $gte: thirtyDaysAgo } 
        }),
        Project.countDocuments({ 
          createdAt: { $gte: thirtyDaysAgo } 
        }),
      ]),
      
      // Weekly stats
      Promise.all([
        Post.countDocuments({ 
          createdAt: { $gte: sevenDaysAgo }, 
          published: true 
        }),
        User.countDocuments({ 
          createdAt: { $gte: sevenDaysAgo } 
        }),
        Post.aggregate([
          { $match: { createdAt: { $gte: sevenDaysAgo } } },
          { $group: { _id: null, total: { $sum: "$views" } } },
        ]),
        Comment.countDocuments({ 
          createdAt: { $gte: sevenDaysAgo } 
        }),
        Project.countDocuments({ 
          createdAt: { $gte: sevenDaysAgo } 
        }),
      ]),
      
      // Recent posts
      Post.find({ published: true })
        .populate("author", "name")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      
      // User growth over time
      User.aggregate([
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
        { $limit: 30 },
      ]),
      
      // User activity data
      UserActivity.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: "$action",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),
      
      // Engagement metrics
      Post.aggregate([
        {
          $project: {
            title: 1,
            views: 1,
            likes: 1,
            comments: { $size: { $ifNull: ["$comments", []] } },
            engagementRate: {
              $divide: [
                { $add: ["$likes", { $size: { $ifNull: ["$comments", []] } }] },
                { $max: ["$views", 1] }
              ],
            },
          },
        },
        { $sort: { engagementRate: -1 } },
        { $limit: 10 },
      ]),
    ])

    const [totalPosts, totalUsers, totalViewsData, totalComments, totalProjects] = totalStats
    const [monthlyPosts, monthlyUsers, monthlyViewsData, monthlyComments, monthlyProjects] = monthlyStats
    const [weeklyPosts, weeklyUsers, weeklyViewsData, weeklyComments, weeklyProjects] = weeklyStats
    
    const totalViews = totalViewsData[0]?.total || 0
    const monthlyViews = monthlyViewsData[0]?.total || 0
    const weeklyViews = weeklyViewsData[0]?.total || 0

    // Calculate trends
    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return { value: 0, type: "neutral" as const }
      const change = ((current - previous) / previous) * 100
      return {
        value: Math.abs(change),
        type: change > 0 ? ("positive" as const) : change < 0 ? ("negative" as const) : ("neutral" as const),
      }
    }

    const monthlyTrend = calculateTrend(monthlyPosts, totalPosts - monthlyPosts)
    const weeklyTrend = calculateTrend(weeklyPosts, monthlyPosts - weeklyPosts)

    return NextResponse.json({
      overview: {
        totalPosts,
        totalUsers,
        totalViews,
        totalComments,
        totalProjects,
        monthlyPosts,
        monthlyUsers,
        monthlyViews,
        monthlyComments,
        monthlyProjects,
        weeklyPosts,
        weeklyUsers,
        weeklyViews,
        weeklyComments,
        weeklyProjects,
      },
      trends: {
        posts: monthlyTrend,
        users: calculateTrend(monthlyUsers, totalUsers - monthlyUsers),
        views: calculateTrend(monthlyViews, totalViews - monthlyViews),
        comments: calculateTrend(monthlyComments, totalComments - monthlyComments),
        projects: calculateTrend(monthlyProjects, totalProjects - monthlyProjects),
      },
      topPosts: recentPosts.map((post) => ({
        ...post,
        _id: post._id.toString(),
        author: post.author ? {
          ...post.author,
          _id: post.author._id.toString(),
        } : null,
        createdAt: post.createdAt.toISOString(),
      })),
      userGrowth,
      activityData: activityData.map((activity) => ({
        action: activity._id,
        count: activity.count,
      })),
      engagementData: engagementData.map((post) => ({
        ...post,
        _id: post._id.toString(),
        engagementRate: Math.round(post.engagementRate * 100 * 100) / 100, // Round to 2 decimal places
      })),
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
