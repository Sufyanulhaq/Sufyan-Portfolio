"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label: string
    type: "positive" | "negative" | "neutral"
  }
  className?: string
}

function StatsCard({ title, value, description, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className="flex items-center mt-2">
            <Badge
              variant={trend.type === "positive" ? "secondary" : trend.type === "negative" ? "destructive" : "outline"}
              className={cn(
                "text-xs",
                trend.type === "positive" && "bg-green-100 text-green-800 hover:bg-green-100",
                trend.type === "negative" && "bg-red-100 text-red-800 hover:bg-red-100",
              )}
            >
              {trend.type === "positive" ? "+" : trend.type === "negative" ? "-" : ""}
              {Math.abs(trend.value)}%
            </Badge>
            <span className="text-xs text-muted-foreground ml-2">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { StatsCard }
export default StatsCard
