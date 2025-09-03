"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Ensure local types exist to avoid missing module imports
type SeriesPoint = { x: string | number; y: number }
type ChartType = "area" | "line" | "pie"

export function ChartCard({
  title,
  data,
  type = "area",
  seriesKey = "y",
  xKey = "x",
  // Use theme-aware shadcn chart tokens for a premium, cohesive palette
  colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"],
  height = 220,
}: {
  title: string
  data: SeriesPoint[] | any[]
  type?: ChartType
  seriesKey?: string
  xKey?: string
  colors?: string[]
  height?: number
}) {
  // Shared styling and compact number formatting
  const gridColor = "hsl(var(--border))"
  const compact = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 2 })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-pretty">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height }} role="region" aria-label={`${title} chart`} className="h-full">
          <ChartContainer config={{ series: { label: title, color: colors[0] } }} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              {type === "pie" ? (
                // Modern donut styling + correct tooltip content factory usage
                <PieChart>
                  <Pie
                    data={data as any[]}
                    dataKey={seriesKey}
                    nameKey={xKey}
                    innerRadius="58%"
                    outerRadius="78%"
                    cornerRadius={3}
                    padAngle={2}
                    stroke="transparent"
                  >
                    {(data as any[]).map((_, i) => (
                      <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={ChartTooltipContent({
                      valueFormatter: (v) => (typeof v === "number" ? compact.format(v) : String(v)),
                    })}
                  />
                </PieChart>
              ) : type === "line" ? (
                // Premium line chart: subtle grid, hidden axes lines, compact tooltip, smoother stroke
                <LineChart data={data as any[]}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey={xKey} axisLine={false} tickLine={false} tickMargin={8} minTickGap={12} />
                  <YAxis axisLine={false} tickLine={false} tickMargin={8} width={40} />
                  <ChartTooltip
                    cursor={{ stroke: "hsl(var(--muted-foreground))", strokeDasharray: "3 3", strokeWidth: 1 }}
                    content={ChartTooltipContent({
                      valueFormatter: (v) => (typeof v === "number" ? compact.format(v) : String(v)),
                    })}
                  />
                  <Line
                    type="monotone"
                    dataKey={seriesKey}
                    stroke={colors[0]}
                    strokeWidth={2.25}
                    dot={false}
                    activeDot={{ r: 3, strokeWidth: 0, fill: colors[0] }}
                  />
                </LineChart>
              ) : (
                // Premium area chart: remove gradient, use subtle fill opacity, compact tooltip
                <AreaChart data={data as any[]}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey={xKey} axisLine={false} tickLine={false} tickMargin={8} minTickGap={12} />
                  <YAxis axisLine={false} tickLine={false} tickMargin={8} width={40} />
                  <ChartTooltip
                    cursor={{ stroke: "hsl(var(--muted-foreground))", strokeDasharray: "3 3", strokeWidth: 1 }}
                    content={ChartTooltipContent({
                      valueFormatter: (v) => (typeof v === "number" ? compact.format(v) : String(v)),
                    })}
                  />
                  <Area
                    type="monotone"
                    dataKey={seriesKey}
                    stroke={colors[0]}
                    strokeWidth={2}
                    fill={colors[0]}
                    fillOpacity={0.16}
                    isAnimationActive
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
