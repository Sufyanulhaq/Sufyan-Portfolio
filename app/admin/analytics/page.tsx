import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard } from "@/components/ui/stats-card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Users,
  Eye,
  MessageSquare,
  Calendar,
  Globe,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react"
import connectDB from "@/lib/mongodb"
import Post from "@/models/Post"
import User from "@/models/User"
import UserActivity from "@/models/UserActivity"
import Comment from "@/models/Comment"
import { requirePermission } from "@/lib/rbac"

async function getAnalyticsData() {
  try {
    await connectDB()

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [totalStats, monthlyStats, weeklyStats, topPosts, userGrowth, activityData, engagementData, trafficSources] =
      await Promise.all([
        // Total stats
        Promise.all([
          Post.countDocuments({ published: true }),
          User.countDocuments({ isActive: true }),
          Post.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
          Comment.countDocuments(),
        ]),

        // Monthly stats
        Promise.all([
          Post.countDocuments({ createdAt: { $gte: thirtyDaysAgo }, published: true }),
          User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
          Post.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            { $group: { _id: null, total: { $sum: "$views" } } },
          ]),
          Comment.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        ]),

        // Weekly stats
        Promise.all([
          Post.countDocuments({ createdAt: { $gte: sevenDaysAgo }, published: true }),
          User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
          Post.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            { $group: { _id: null, total: { $sum: "$views" } } },
          ]),
          Comment.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
        ]),

        // Top performing posts
        Post.find({ published: true })
          .sort({ views: -1 })
          .limit(10)
          .select("title views likes comments createdAt")
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
                $divide: [{ $add: ["$likes", { $size: { $ifNull: ["$comments", []] } }] }, { $max: ["$views", 1] }],
              },
            },
          },
          { $sort: { engagementRate: -1 } },
          { $limit: 10 },
        ]),

        // Traffic sources simulation (would be real data from analytics)
        Promise.resolve([
          { source: "Direct", visitors: 1250, percentage: 35 },
          { source: "Google", visitors: 980, percentage: 28 },
          { source: "Social Media", visitors: 720, percentage: 20 },
          { source: "Referrals", visitors: 430, percentage: 12 },
          { source: "Email", visitors: 180, percentage: 5 },
        ]),
      ])

    const [totalPosts, totalUsers, totalViewsData, totalComments] = totalStats
    const [monthlyPosts, monthlyUsers, monthlyViewsData, monthlyComments] = monthlyStats
    const [weeklyPosts, weeklyUsers, weeklyViewsData, weeklyComments] = weeklyStats

    const totalViews = totalViewsData[0]?.total || 0
    const monthlyViews = monthlyViewsData[0]?.total || 0
    const weeklyViews = weeklyViewsData[0]?.total || 0

    return {
      overview: {
        totalPosts,
        totalUsers,
        totalViews,
        totalComments,
        monthlyPosts,
        monthlyUsers,
        monthlyViews,
        monthlyComments,
        weeklyPosts,
        weeklyUsers,
        weeklyViews,
        weeklyComments,
      },
      topPosts: topPosts.map((post) => ({
        ...post,
        _id: post._id.toString(),
        createdAt: post.createdAt.toISOString(),
      })),
      userGrowth,
      activityData,
      engagementData: engagementData.map((post) => ({
        ...post,
        _id: post._id.toString(),
      })),
      trafficSources,
    }
  } catch (error) {
    console.error("Error fetching analytics data:", error)
    return {
      overview: {
        totalPosts: 0,
        totalUsers: 0,
        totalViews: 0,
        totalComments: 0,
        monthlyPosts: 0,
        monthlyUsers: 0,
        monthlyViews: 0,
        monthlyComments: 0,
        weeklyPosts: 0,
        weeklyUsers: 0,
        weeklyViews: 0,
        weeklyComments: 0,
      },
      topPosts: [],
      userGrowth: [],
      activityData: [],
      engagementData: [],
      trafficSources: [],
    }
  }
}

export default async function AnalyticsPage() {
  await requirePermission("VIEW_ANALYTICS")
  const data = await getAnalyticsData()

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, type: "neutral" as const }
    const change = ((current - previous) / previous) * 100
    return {
      value: Math.abs(change),
      type: change > 0 ? ("positive" as const) : change < 0 ? ("negative" as const) : ("neutral" as const),
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive insights into your website performance</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Posts"
              value={data.overview.totalPosts}
              description="Published blog posts"
              icon={BarChart3}
              trend={calculateTrend(data.overview.monthlyPosts, data.overview.totalPosts - data.overview.monthlyPosts)}
            />
            <StatsCard
              title="Total Users"
              value={data.overview.totalUsers}
              description="Registered users"
              icon={Users}
              trend={calculateTrend(data.overview.monthlyUsers, data.overview.totalUsers - data.overview.monthlyUsers)}
            />
            <StatsCard
              title="Total Views"
              value={data.overview.totalViews.toLocaleString()}
              description="All-time page views"
              icon={Eye}
              trend={calculateTrend(data.overview.monthlyViews, data.overview.totalViews - data.overview.monthlyViews)}
            />
            <StatsCard
              title="Comments"
              value={data.overview.totalComments}
              description="User engagement"
              icon={MessageSquare}
              trend={calculateTrend(
                data.overview.monthlyComments,
                data.overview.totalComments - data.overview.monthlyComments,
              )}
            />
          </div>

          {/* Traffic Sources */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Traffic Sources
                </CardTitle>
                <CardDescription>Where your visitors come from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.trafficSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full bg-primary"
                          style={{
                            backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                          }}
                        />
                        <span className="font-medium">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{source.visitors.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{source.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>User actions in the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.activityData.slice(0, 8).map((activity, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{activity._id.replace("_", " ")}</span>
                      <Badge variant="secondary">{activity.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Performing Posts
                </CardTitle>
                <CardDescription>Posts with the most views</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topPosts.slice(0, 8).map((post, index) => (
                    <div key={post._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{post.title}</h4>
                        <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{post.views.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">views</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Content Engagement
                </CardTitle>
                <CardDescription>Posts with highest engagement rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.engagementData.slice(0, 8).map((post, index) => (
                    <div key={post._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{post.title}</h4>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>{post.views} views</span>
                          <span>{post.likes} likes</span>
                          <span>{post.comments} comments</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{(post.engagementRate * 100).toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">engagement</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <StatsCard
              title="New Users (30d)"
              value={data.overview.monthlyUsers}
              description="Users joined this month"
              icon={Users}
              trend={calculateTrend(data.overview.weeklyUsers * 4, data.overview.monthlyUsers)}
            />
            <StatsCard
              title="Active Users"
              value={data.overview.totalUsers}
              description="Total registered users"
              icon={Activity}
            />
            <StatsCard
              title="User Growth"
              value={`+${((data.overview.monthlyUsers / Math.max(data.overview.totalUsers - data.overview.monthlyUsers, 1)) * 100).toFixed(1)}%`}
              description="Monthly growth rate"
              icon={TrendingUp}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Registration Trend</CardTitle>
              <CardDescription>Daily user registrations over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <LineChart className="h-8 w-8 mr-2" />
                Chart visualization would be implemented here with a charting library
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Avg. Session Duration"
              value="4m 32s"
              description="Time spent per visit"
              icon={Calendar}
            />
            <StatsCard title="Bounce Rate" value="34.2%" description="Single page visits" icon={Activity} />
            <StatsCard title="Pages per Session" value="2.8" description="Average page views" icon={Eye} />
            <StatsCard title="Return Visitors" value="68%" description="Returning users" icon={Users} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>User interaction patterns and behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Most Engaging Content Types</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Technical Tutorials</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div className="w-4/5 h-full bg-primary rounded-full" />
                        </div>
                        <span className="text-sm">80%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Project Showcases</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div className="w-3/5 h-full bg-primary rounded-full" />
                        </div>
                        <span className="text-sm">65%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Industry News</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div className="w-2/5 h-full bg-primary rounded-full" />
                        </div>
                        <span className="text-sm">45%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
