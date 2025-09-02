"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts"

type SeriesPoint = { x: string | number; y: number }
type ChartType = "area" | "line" | "pie"

export function ChartCard({
  title,
  data,
  type = "area",
  seriesKey = "y",
  xKey = "x",
  colors = ["#0ea5a0", "#f97316", "#0f172a"],
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {type === "pie" ? (
              <PieChart>
                <Pie data={data as any[]} dataKey={seriesKey} nameKey={xKey} outerRadius={70} innerRadius={40}>
                  {(data as any[]).map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : type === "line" ? (
              <LineChart data={data as any[]}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey={seriesKey} stroke={colors[0]} strokeWidth={2} dot={false} />
              </LineChart>
            ) : (
              <AreaChart data={data as any[]}>
                <defs>
                  <linearGradient id="c0" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[0]} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey={seriesKey} stroke={colors[0]} fillOpacity={1} fill="url(#c0)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
