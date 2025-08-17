"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ComponentType<{ className?: string }>
  color?: string
  trend?: {
    value: number
    type: "positive" | "negative" | "neutral"
    label: string
  }
}

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  color = "text-blue-600",
  trend,
}: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4 text-muted-foreground", color)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center mt-2">
            {trend.type === "positive" ? (
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
            ) : trend.type === "negative" ? (
              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
            ) : null}
            <Badge
              variant={trend.type === "positive" ? "default" : "secondary"}
              className="text-xs"
            >
              {trend.type === "positive" ? "+" : ""}
              {trend.value}% {trend.label}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
