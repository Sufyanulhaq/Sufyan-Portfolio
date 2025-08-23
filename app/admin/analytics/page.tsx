"use client"

import { useState, useEffect } from "react"

// Force dynamic rendering to prevent build-time prerendering issues
export const dynamic = 'force-dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, TrendingDown, Users, Eye, Heart, MousePointer, Globe } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

interface AnalyticsData {
  pageViews: ChartData[]
  uniqueVisitors: ChartData[]
  topPages: PageData[]
  trafficSources: SourceData[]
  userBehavior: BehaviorData[]
  conversions: ConversionData[]
}

interface ChartData {
  date: string
  value: number
}

interface PageData {
  page: string
  views: number
  uniqueVisitors: number
  bounceRate: number
}

interface SourceData {
  source: string
  visitors: number
  percentage: number
}

interface BehaviorData {
  action: string
  count: number
  percentage: number
}

interface ConversionData {
  goal: string
  conversions: number
  rate: number
}

const mockAnalyticsData: AnalyticsData = {
  pageViews: [
    { date: "2024-01-01", value: 1200 },
    { date: "2024-01-02", value: 1350 },
    { date: "2024-01-03", value: 1100 },
    { date: "2024-01-04", value: 1600 },
    { date: "2024-01-05", value: 1400 },
    { date: "2024-01-06", value: 1800 },
    { date: "2024-01-07", value: 2000 },
  ],
  uniqueVisitors: [
    { date: "2024-01-01", value: 800 },
    { date: "2024-01-02", value: 950 },
    { date: "2024-01-03", value: 750 },
    { date: "2024-01-04", value: 1100 },
    { date: "2024-01-05", value: 900 },
    { date: "2024-01-06", value: 1200 },
    { date: "2024-01-07", value: 1400 },
  ],
  topPages: [
    { page: "/", views: 2500, uniqueVisitors: 1800, bounceRate: 35 },
    { page: "/portfolio", views: 1800, uniqueVisitors: 1200, bounceRate: 25 },
    { page: "/blog", views: 1500, uniqueVisitors: 1000, bounceRate: 40 },
    { page: "/services", views: 1200, uniqueVisitors: 800, bounceRate: 30 },
    { page: "/about", views: 800, uniqueVisitors: 600, bounceRate: 45 },
  ],
  trafficSources: [
    { source: "Direct", visitors: 2500, percentage: 40 },
    { source: "Organic Search", visitors: 2000, percentage: 32 },
    { source: "Social Media", visitors: 1200, percentage: 19 },
    { source: "Referral", visitors: 500, percentage: 8 },
    { source: "Email", visitors: 100, percentage: 1 },
  ],
  userBehavior: [
    { action: "Page View", count: 8000, percentage: 100 },
    { action: "Portfolio Click", count: 2400, percentage: 30 },
    { action: "Contact Form", count: 800, percentage: 10 },
    { action: "Blog Read", count: 1600, percentage: 20 },
    { action: "Download Resume", count: 400, percentage: 5 },
  ],
  conversions: [
    { goal: "Contact Form", conversions: 800, rate: 10 },
    { goal: "Portfolio View", conversions: 2400, rate: 30 },
    { goal: "Blog Engagement", conversions: 1600, rate: 20 },
    { goal: "Resume Download", conversions: 400, rate: 5 },
  ],
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(mockAnalyticsData)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      // In a real app, you'd fetch from your analytics API
      // const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      // const data = await response.json()
      // setAnalyticsData(data)
      
      // For now, using mock data
      setTimeout(() => {
        setAnalyticsData(mockAnalyticsData)
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching analytics:", error)
      setIsLoading(false)
    }
  }

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100
    return ((current - previous) / previous) * 100
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track your website performance and user behavior</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your website performance and user behavior</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(8000)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(4200)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +8.2% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.5%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-green-600" />
              -2.1% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.8%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +5.3% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Page Views & Visitors</CardTitle>
            <CardDescription>Daily website traffic over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.pageViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.trafficSources}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ source, percentage }) => `${source} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="visitors"
                >
                  {analyticsData.trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Pages</CardTitle>
          <CardDescription>Most viewed pages on your website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">{index + 1}</Badge>
                  <div>
                    <h3 className="font-medium">{page.page}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(page.views)} views • {formatNumber(page.uniqueVisitors)} unique visitors
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{page.bounceRate}%</div>
                  <div className="text-xs text-muted-foreground">Bounce Rate</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Behavior */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Behavior</CardTitle>
            <CardDescription>How users interact with your website</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.userBehavior}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="action" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Goals</CardTitle>
            <CardDescription>Key conversion metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.conversions.map((goal) => (
                <div key={goal.goal} className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{goal.goal}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(goal.conversions)} conversions
                    </p>
                  </div>
                  <Badge variant="secondary">{goal.rate}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
