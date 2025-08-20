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
  // Prevent build-time execution
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to view analytics
    if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "7d"
    
    // Only connect to DB if we're not in build mode
    if (process.env.MONGODB_URI) {
      await connectDB()
    }

    // Calculate date ranges
    const now = new Date()
    let startDate: Date
    
    switch (range) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    // Fetch analytics data
    const [
      totalStats,
      periodStats,
      topPages,
      trafficSources,
      userBehavior,
      conversions
    ] = await Promise.all([
      // Total stats
      Promise.all([
        Post.countDocuments({ published: true }),
        User.countDocuments({ isActive: true }),
        Post.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
        Comment.countDocuments({ isApproved: true }),
      ]),
      
      // Period stats
      Promise.all([
        Post.countDocuments({ 
          published: true, 
          createdAt: { $gte: startDate } 
        }),
        User.countDocuments({ 
          createdAt: { $gte: startDate } 
        }),
        Post.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          { $group: { _id: null, total: { $sum: "$views" } } },
        ]),
        Comment.countDocuments({ 
          createdAt: { $gte: startDate } 
        }),
      ]),
      
      // Top performing pages
      Post.find({ published: true })
        .sort({ views: -1 })
        .limit(10)
        .select("title views createdAt")
        .lean(),
      
      // Traffic sources (simulated data for now)
      Promise.resolve([
        { source: "Direct", visitors: 2500, percentage: 40 },
        { source: "Organic Search", visitors: 2000, percentage: 32 },
        { source: "Social Media", visitors: 1200, percentage: 19 },
        { source: "Referral", visitors: 500, percentage: 8 },
        { source: "Email", visitors: 100, percentage: 1 },
      ]),
      
      // User behavior
      UserActivity.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: "$action",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      
      // Conversion goals
      Promise.resolve([
        { goal: "Contact Form", conversions: 800, rate: 10 },
        { goal: "Portfolio View", conversions: 2400, rate: 30 },
        { goal: "Blog Engagement", conversions: 1600, rate: 20 },
        { goal: "Resume Download", conversions: 400, rate: 5 },
      ]),
    ])

    const [totalPosts, totalUsers, totalViewsData, totalComments] = totalStats
    const [periodPosts, periodUsers, periodViewsData, periodComments] = periodStats
    const totalViews = totalViewsData[0]?.total || 0
    const periodViews = periodViewsData[0]?.total || 0

    // Generate chart data for the selected period
    const daysInPeriod = Math.ceil((now.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
    const pageViews = []
    const uniqueVisitors = []
    
    for (let i = 0; i < daysInPeriod; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      
      // Simulate daily data (in a real app, you'd fetch this from analytics)
      const baseViews = Math.floor(Math.random() * 500) + 800
      const baseVisitors = Math.floor(Math.random() * 300) + 500
      
      pageViews.push({
        date: dateStr,
        value: baseViews + Math.floor(Math.random() * 200)
      })
      
      uniqueVisitors.push({
        date: dateStr,
        value: baseVisitors + Math.floor(Math.random() * 150)
      })
    }

    return NextResponse.json({
      pageViews,
      uniqueVisitors,
      topPages: topPages.map(post => ({
        ...post,
        _id: post._id.toString(),
        createdAt: post.createdAt.toISOString(),
      })),
      trafficSources,
      userBehavior: userBehavior.map(behavior => ({
        action: behavior._id,
        count: behavior.count,
        percentage: Math.round((behavior.count / userBehavior.reduce((sum, b) => sum + b.count, 0)) * 100)
      })),
      conversions,
      summary: {
        total: {
          posts: totalPosts,
          users: totalUsers,
          views: totalViews,
          comments: totalComments,
        },
        period: {
          posts: periodPosts,
          users: periodUsers,
          views: periodViews,
          comments: periodComments,
        },
        growth: {
          posts: totalPosts > 0 ? Math.round(((periodPosts / totalPosts) * 100) - 100) : 0,
          users: totalUsers > 0 ? Math.round(((periodUsers / totalUsers) * 100) - 100) : 0,
          views: totalViews > 0 ? Math.round(((periodViews / totalViews) * 100) - 100) : 0,
          comments: totalComments > 0 ? Math.round(((periodComments / totalComments) * 100) - 100) : 0,
        }
      }
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
